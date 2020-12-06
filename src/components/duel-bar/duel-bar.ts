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
import { WestCalc } from '../west-calc/west-calc';

@singleton()
export class DuelBar implements Component {
    private readonly lastPosition: { x: number; y: number } = { x: -1, y: -1 };
    private readonly onNearbyPlayersChangeCallbacks: Array<OnNearbyPlayersChangeCallback> = [];
    private nearbyPlayers: Array<DuelWindowPlayer> = [];

    constructor(
        @inject('window') private window: TheWestWindow,
        private readonly settings: Settings,
        private readonly logger: Logger,
        private readonly language: Language,
        private readonly westCalc: WestCalc,
        public readonly errorTracker: ErrorTracker,
    ) {}

    @CatchErrors('DuelBar.init')
    init(): void {
        if (this.isEnabled()) {
            this.window.setInterval(() => this.update(), 1000);
        }
    }

    @CatchErrors('DuelBar.update')
    private update(): void {
        // if player position changed, update the duel bar
        if (
            this.lastPosition.x !== this.window.Character.position.x &&
            this.lastPosition.y !== this.window.Character.position.y
        ) {
            this.logger.log('updating duel bar...');
            this.loadNearbyPlayers();

            this.lastPosition.x = this.window.Character.position.x;
            this.lastPosition.y = this.window.Character.position.y;
            this.logger.log('duel bar updated', this.lastPosition);
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
                    ${player.avatar}
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
                .find('.avatar_pic')
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

    private loadNearbyPlayers(): void {
        this.logger.log('loading nearby players...');

        loadNearbyPlayers(this.window, 8, players => {
            this.nearbyPlayers = players;
            this.onNearbyPlayersChangeCallbacks.forEach(callback => callback(players));
        });
    }
}

function loadNearbyPlayers(
    window: TheWestWindow,
    maxPlayers: number,
    callback: (players: Array<DuelWindowPlayer>) => void,
): void {
    loadRecursive([]);

    ////////////

    function loadRecursive(output: Array<DuelWindowPlayer>) {
        window.$.post(
            '/game.php?window=duel&action=search_op&h=' + window.Player.h,
            {
                page: 1,
            },
            (response: { oplist: { pclist: Array<DuelWindowPlayer> } }) => {
                const players = response.oplist.pclist;

                players.forEach(player => {
                    if (output.length < maxPlayers) {
                        output.push(player);
                    }
                });

                if (output.length === maxPlayers) {
                    sortPlayersByDistance(window, output);
                    callback(output);
                } else {
                    loadRecursive(output);
                }
            },
            'json',
        );
    }
}

function sortPlayersByDistance(window: TheWestWindow, players: Array<DuelWindowPlayer>) {
    players.sort((a, b) => {
        const way_time_1 = window.Map.calcWayTime(window.Character.position, {
            x: a.character_x,
            y: a.character_y,
        });
        const way_time_2 = window.Map.calcWayTime(window.Character.position, {
            x: b.character_x,
            y: b.character_y,
        });

        return way_time_1 - way_time_2;
    });
}
