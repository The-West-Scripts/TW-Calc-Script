import { CatchErrors } from '../error-tracker/catch-errors';
import { Component } from '../component.types';
import { DuelBarPosition, DuelWindowPlayer, OnNearbyPlayersChangeCallback } from './duel-bar.types';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { SettingNumber } from '../settings/settings.types';
import { Settings } from '../settings/settings';
import { TheWestWindow } from '../../@types/the-west';
import { WaitUntil } from '../../utils/wait-until.decorator';
import { WestCalc } from '../west-calc/west-calc';

@singleton()
export class DuelBar implements Component {
    private readonly updateInterval = 1000;
    private readonly lastPosition: { x: number; y: number } = { x: -1, y: -1 };
    private readonly onNearbyPlayersChangeCallbacks: Array<OnNearbyPlayersChangeCallback> = [];
    private nearbyPlayers: Array<DuelWindowPlayer> = [];
    private updateInProgress = false;

    constructor(
        @inject('window') private window: TheWestWindow,
        private readonly settings: Settings,
        private readonly language: Language,
        private readonly westCalc: WestCalc,
        public readonly logger: Logger,
        public readonly errorTracker: ErrorTracker,
    ) {}

    @WaitUntil<DuelBar>(function (this: DuelBar) {
        const map = this.window.Map;
        // Before the Map is injected by The-West, it is MapConstructor from the polyfill
        return typeof map === 'object' && typeof map['calcWayTime'] === 'function';
    })
    @CatchErrors('DuelBar.init')
    init(): void {
        if (this.isEnabled()) {
            // periodically update the duel bar
            this.window.setInterval(() => this.update(), this.updateInterval);
        }
    }

    @CatchErrors('DuelBar.update')
    private update(): void {
        if (
            // if player position changed, update the duel bar
            this.lastPosition.x !== this.window.Character.position.x &&
            this.lastPosition.y !== this.window.Character.position.y &&
            // do not try to updae it, if we are already updating it
            !this.updateInProgress
        ) {
            this.logger.log('updating duel bar...');
            this.updateInProgress = true;
            this.loadNearbyPlayers(
                this.errorTracker.catchErrors(players => {
                    this.lastPosition.x = this.window.Character.position.x;
                    this.lastPosition.y = this.window.Character.position.y;
                    this.updateInProgress = false;
                    this.logger.log('duel bar updated', this.lastPosition, players);
                }),
            );
        }
    }

    appendTo(element: JQuery): void {
        let mainDiv: JQuery | undefined;

        this.onNearbyPlayersChange(players => {
            this.logger.log('nearby players list has changed', players);
            if (mainDiv != undefined) {
                // remove old div
                mainDiv.remove();
            }
            // do not show a duel bar when there are no nearby players
            if (players.length === 0) {
                return;
            }
            // replace it with new one
            mainDiv = this.getMainDiv(players);
            // append it to content
            element.append(mainDiv);
        });
    }

    isEnabled(): boolean {
        return this.settings.get(SettingNumber.NearestJobsBar) != DuelBarPosition.hidden;
    }

    isPosition(position: 'up' | 'down'): boolean {
        const settings = this.settings.get(SettingNumber.DuelBar);
        if (position === 'down') {
            return settings === DuelBarPosition.down;
        }
        return settings === DuelBarPosition.up;
    }

    private getMainDiv(players: Array<DuelWindowPlayer>): JQuery {
        const bar = $(
            `<div style="text-align: center; width: 620px; height: 88px; position: relative; margin: 4px 0 4px 0;"></div>`,
        );

        players.forEach(player => {
            const wayTime = this.window.Map.calcWayTime(this.window.Character.position, {
                x: player.character_x,
                y: player.character_y,
            });

            const title = 'Duel ' + player.player_name + ' (' + wayTime.formatDuration() + ')';
            const avatar = this.window.$(`
                <div style="display: inline-block; margin-right: 5px; cursor:pointer; position:relative; float: left;">
                    <div class="duel-bar-avatar">${player.avatar}</div>
                    <div style="color: #F8C57C; top: 5px; position: absolute; text-align: center; width: 100%; font-weight: bold; text-shadow: 1px 1px 1px black; font-size: 11px;">
                        ${player.duellevel}                    
                    </div>
                    <img alt="${title}" onclick="SaloonWindow.startDuel(${player.player_id})" title="${title}" style="position: absolute; bottom: -22px; left: 11px; width: 50px;" src="/images/window/duels/charclass_${player.class}.png">
                    <div class="open_profile" title="${player.player_name}" onclick="PlayerProfileWindow.open(${player.player_id})" style="z-index: 3; width: 20px; height: 20px; display: none; cursor: pointer; position: absolute; left: -10px; top: 20px; background-image: url(/images/map/icons/instant-work-1.png);"></div>
                </div>`);

            avatar.on('mouseover', function () {
                $(this).find('.open_profile').show();
            });

            avatar.on('mouseout', function () {
                $(this).find('.open_profile').hide();
            });

            avatar
                .find('.duel-bar-avatar')
                .attr('title', title)
                .on('click', e => {
                    e.stopPropagation();
                    this.window.SaloonWindow.startDuel(player.player_id);
                });

            avatar
                .find('.open_profile')
                .on('mouseover', function () {
                    $(this).css({
                        'background-image': 'url(/images/map/icons/instant-work-1_hover.png)',
                        'margin-top': '-2px',
                        'margin-left': '-2px',
                        width: '24px',
                        height: '25px',
                    });
                })
                .on('mouseout', function () {
                    $(this).css({
                        'background-image': 'url(/images/map/icons/instant-work-1.png)',
                        'margin-top': '0px',
                        'margin-left': '0px',
                        width: '20px',
                        height: '20px',
                    });
                });

            bar.append(avatar);
        });

        bar.append(
            `<div class="tw2gui_window_buttons_close" style="position: absolute; right: -15px; top: 0;" title="${this.language.getTranslation(
                189,
            )} Duel Bar"></div>`,
        )
            .find('.tw2gui_window_buttons_close')
            .on('click', () => {
                this.westCalc.window.openSettings(SettingNumber.DuelBar);
            });

        return bar;
    }

    private onNearbyPlayersChange(callback: OnNearbyPlayersChangeCallback): void {
        callback(this.nearbyPlayers);
        this.onNearbyPlayersChangeCallbacks.push(callback);
    }

    private loadNearbyPlayers(callback: (players: Array<DuelWindowPlayer>) => void): void {
        this.logger.log('loading nearby players...');

        loadNearbyPlayers(
            this.errorTracker,
            this.window,
            8,
            this.errorTracker.catchErrors(players => {
                this.nearbyPlayers = players;
                this.onNearbyPlayersChangeCallbacks.forEach(callback => callback(players));
                callback(players);
            }),
        );
    }
}

function loadNearbyPlayers(
    errorTracker: ErrorTracker,
    w: TheWestWindow,
    maxPlayers: number,
    callback: (players: Array<DuelWindowPlayer>) => void,
): void {
    loadRecursive([], 0);

    ////////////

    function loadRecursive(output: Array<DuelWindowPlayer>, page: number) {
        w.$.post(
            '/game.php?window=duel&action=search_op&h=' + w.Player.h,
            {
                page,
            },
            errorTracker.catchErrors((response: { oplist: { pclist: Array<DuelWindowPlayer> } }) => {
                const players = response.oplist.pclist;

                players.forEach(player => {
                    if (
                        output.length < maxPlayers && // if we did not reach the maxPlayers limit
                        !output.find(otherPlayer => otherPlayer.player_id === player.player_id) // and the player is not in the list already
                    ) {
                        output.push(player);
                    }
                });

                // if we reached the maxPlayers limit or there are no players nearby call the callback
                if (output.length >= maxPlayers || !players.length) {
                    sortPlayersByDistance(w, output);
                    callback(output);
                } else {
                    loadRecursive(output, page + 1);
                }
            }),
            'json',
        );
    }
}

function sortPlayersByDistance(w: TheWestWindow, players: Array<DuelWindowPlayer>) {
    players.sort((a, b) => {
        const way_time_1 = w.Map.calcWayTime(w.Character.position, {
            x: a.character_x,
            y: a.character_y,
        });
        const way_time_2 = w.Map.calcWayTime(w.Character.position, {
            x: b.character_x,
            y: b.character_y,
        });

        return way_time_1 - way_time_2;
    });
}
