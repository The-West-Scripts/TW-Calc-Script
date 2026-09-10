import {
    AllTombolaInfo,
    Spin,
    Tombola,
    TombolaId,
    TombolaKey,
    TombolaLevel,
    TWCalcEventName,
} from './tombola-exporter.types';
import { CatchErrors } from '../error-tracker/catch-errors';
import { Component } from '../component.types';
import { Config } from '../config/config';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { InvisibleError } from '../error-tracker/invisible-error';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { StorageKey } from '../storage/storage.types';
import { TheWestWindow, WheelofFortuneGambleXHRResponse, WofData } from '../../@types/the-west';
import { Storage as TWCalcStorage } from '../storage/storage';
import { wofPatch } from './wof-patch';

// index is event id (used for legacy reasons - migration to v2)
const events = ['Hearts', 'Easter', 'Independence', 'Octoberfest', 'DayOfDead'];

const translations: Record<TWCalcEventName, number> = {
    easter: 195,
    independence: 196,
    valentine: 194,
    octoberfest: 197,
    dotd: 198,
    fair: 174,
};

@singleton()
export class TombolaExporter implements Component {
    private tombolaInfo: AllTombolaInfo | undefined;
    private callbackList: Array<(tombolaInfo: AllTombolaInfo) => void> = [];

    constructor(
        @inject('window') private window: TheWestWindow,
        @inject('localStorage') private readonly localStorage: WindowLocalStorage['localStorage'],
        private readonly storage: TWCalcStorage,
        private readonly logger: Logger,
        private readonly config: Config,
        private readonly language: Language,
        public readonly errorTracker: ErrorTracker,
    ) {}

    @CatchErrors('TombolaExporter.init')
    init(): void {
        this.migrate();
        wofPatch(this.window, (action, wofid, data, response) =>
            this.errorTracker.execute(() => this.onWheelOfFortuneSpin({ ...data, action, wofid }, response)),
        );
    }

    @CatchErrors('TombolaExporter.onWheelOfFortuneSpin')
    private onWheelOfFortuneSpin(
        data: WofData & { action: string; wofid: number },
        response: WheelofFortuneGambleXHRResponse,
    ): void {
        this.logger.log('new tombola spin', data, response);
        const eventType = this.getCurrentEvent();
        const tombolaId = data.wofid;

        // Travelling circus
        if (tombolaId === 1) {
            if (!response.picked) {
                throw new Error('Invalid tombola! (wofId = 1)');
            }
            // payid values: 1 - free, '1' - bonds, '2' - nuggets
            const isFree = response.payid === 1;
            return this.save(
                {
                    tombolaId,
                    prize: response.picked[0],
                    category: response.picked[1],
                },
                isFree,
            );
        }
        // Valentine
        if (response.prize) {
            const prize = response.prize.itemId;
            // @ts-ignore
            const isFree = !!this.window.west.wof.WofManager.wofs.heartswof.mode.free;
            return this.save(
                {
                    tombolaId,
                    prize,
                    category: 0,
                },
                isFree,
            );
        }
        // DOTD
        if (response && response.cost && response.stages) {
            const category = response.stages.length - 1;
            const prize = response.stages[category].rewards.item;
            // @ts-ignore
            const card = Number(data.card || response.card); // TODO: fix types

            if (data.action === 'gamble') {
                const level = card == 2 ? 'Left_card' : card == 1 ? 'Middle_card' : 'Right_card'; // left_card is 2, middle_card 1, right_card 0
                return this.save({ tombolaId, prize, category, level }, true);
            } else if (data.action === 'bribe' || data.action === 'change') {
                const level = 'After_bribe';
                return this.save({ tombolaId, prize, category, level }, false);
            } else if (data.action === 'end') {
                // TODO: Implement
            }
        } else if (eventType) {
            // easter & independence: outcome & enhance
            // octoberfest: failed, normal: itemId & itemEnhance, after_bribe: outcome & enhance
            if (response && !response.failed && (response.itemId || response.outcome)) {
                const categoryType = response.itemEnhance || (response.outcome && response.outcome.itemEnhance);
                const prize = response.itemId || (response.outcome && response.outcome.itemId) || 0;
                const level = getLevel(data, response);

                let category = 0;
                switch (categoryType) {
                    case 25:
                        category = 1;
                        break;
                    case 150:
                        category = 2;
                        break;
                    case 800:
                        category = 3;
                        break;
                }

                const spin = { tombolaId, prize, category, level };

                if (typeof level === 'undefined') {
                    // Every event that reaches this branch is exported with a level, and jQuery
                    // drops an undefined value from the query string instead of sending it empty,
                    // so the export would fail with "Level is not defined!". Keep the player's own
                    // stats - those do not use the level - and report where the level went instead
                    // of firing a request that cannot succeed.
                    this.addSpinToStorage(spin, true);
                    throw InvisibleError.of(
                        new Error(
                            `Unable to resolve the tombola level! event=${eventType} ` +
                                `data=${JSON.stringify(data)} response=[${Object.keys(response).join(', ')}]`,
                        ),
                    );
                }

                this.save(spin, true); // TODO: change isFree from constant
            } else {
                this.logger.warn('Unable to process WoF response!', response);
            }
        } else {
            this.logger.warn('Unknown event type!', eventType);
        }
    }

    getEventTranslation(type: TWCalcEventName): string {
        return this.language.getTranslation(translations[type]);
    }

    addTombolaInfo(tombola: AllTombolaInfo): void {
        this.tombolaInfo = tombola;
        // trigger callbacks
        if (this.callbackList.length) {
            this.callbackList.forEach(cb => cb(tombola));
            this.callbackList = [];
        }
    }

    getFromStorage(): Record<TombolaId, Tombola> {
        return this.storage.getObject<Record<TombolaId, Tombola>>(StorageKey.tombola, {});
    }

    getTombolaInfo(callback: (tombolaInfo: AllTombolaInfo) => void): void {
        if (this.tombolaInfo) {
            return callback(this.tombolaInfo);
        }
        this.callbackList.push(callback);
        this.logger.log('loading tombola list...');
        this.window.$.get(this.config.website + '/service/tombola-list', () => undefined, 'jsonp');
    }

    private save(spin: Spin, isFree: boolean): void {
        this.logger.log('saving tombola...', spin, { isFree });
        this.exportSpin(spin);
        this.addSpinToStorage(spin, isFree);
    }

    private getCurrentEvent(): string | null {
        const eventIndex = events.findIndex(event => this.window.Game.sesData.hasOwnProperty(event));
        return eventIndex ? events[eventIndex] : null;
    }

    private exportSpin(spin: Spin): void {
        const { $ } = this.window;
        $.get(this.config.website + '/service/tombola-export', spin, null, 'jsonp')
            .done(resp => {
                this.logger.log('tombola exported', resp);
            })
            .fail((_jqXHR, textStatus: string, error: unknown) => {
                this.logger.warn('unable to export the tombola spin', spin, textStatus, error);
                this.errorTracker.track(
                    InvisibleError.of(
                        new Error(
                            `Unable to export the tombola spin! status=${textStatus} ` + `spin=${JSON.stringify(spin)}`,
                        ),
                    ),
                    'TombolaExporter.exportSpin',
                );
            });
    }

    private addSpinToStorage(spin: Spin, isFree: boolean): void {
        const { category, prize, tombolaId } = spin;
        const tombolas = this.getFromStorage();
        if (!tombolas.hasOwnProperty(tombolaId)) {
            tombolas[tombolaId] = {
                key: tombolaId,
                spins: { free: 0, total: 0 },
                levels: {},
            };
        }
        tombolas[tombolaId].spins.total++;
        if (isFree) {
            tombolas[tombolaId].spins.free++;
        }
        if (!tombolas[tombolaId].levels.hasOwnProperty(category)) {
            tombolas[tombolaId].levels[category] = {};
        }
        if (!tombolas[tombolaId].levels[category].hasOwnProperty(prize)) {
            tombolas[tombolaId].levels[category][prize] = 0;
        }
        tombolas[tombolaId].levels[category][prize]++;
        this.storage.setObject<Record<TombolaId, Tombola>>(StorageKey.tombola, tombolas);
    }

    /**
     * Migrates from v1 to v2.
     * @private
     */
    private migrate(): void {
        if (this.storage.has(StorageKey.tombola)) {
            return;
        }
        this.logger.log('migrating from tombola v1...');
        const data: Record<number, Tombola> = {};
        const localStorage = this.localStorage;

        for (const key in localStorage) {
            if (!localStorage.hasOwnProperty(key)) {
                continue;
            }

            const match = key.match(/^TWCalc_Tombola_(\d+_\d+_\d+|\d+)$/);
            if (!match) {
                continue;
            }
            const rawKey = match[1];
            const tombolaKey = parseKey(rawKey);
            if (!tombolaKey) {
                this.logger.log(`could not parse tombola key ${rawKey}...`);
                continue;
            }

            let tombola: Array<Record<string, number>> | undefined;
            let tombolaSpins: { total: number; free: number } | undefined;

            // parse tombola items
            try {
                tombola = JSON.parse(localStorage.getItem(key) || '[]');
            } catch (e) {
                // pass
            }
            // if tombola is not travelling circus
            if (typeof tombolaKey !== 'number') {
                // parse tombola spins
                try {
                    tombolaSpins = JSON.parse(
                        localStorage.getItem(`TWCalc_Tombola_Spins_${tombolaKey.id}_${tombolaKey.year}`) || '{}',
                    );
                } catch (e) {
                    // pass
                }
            }

            if (typeof tombola === 'undefined' || typeof tombolaSpins === 'undefined') {
                this.logger.log('invalid tombola data...', tombolaKey, tombola, tombolaSpins);
                continue;
            }

            const levels: Record<number, TombolaLevel> = {};
            tombola.forEach((items, level) => (levels[level] = items));

            data[getId(tombolaKey)] = {
                key: tombolaKey,
                spins: tombolaSpins,
                levels,
            };
        }

        this.storage.setObject<Record<number, Tombola>>(StorageKey.tombola, data);
        this.logger.log('migration finished!', data);
    }
}

/**
 * Reads the tombola level, which is the enhance the spin was played at - every event exported with
 * a level has only ever recorded 0, 25, 150 or 800. It is normally in the spin request, but an
 * octoberfest bribe/upgrade request carries no `enhance` and reports it on the response instead.
 *
 * A level of 0 is the un-enhanced spin, so the two sources are tried by *first defined*: a `||`
 * chain would fall through a real 0 to the next source. `construction_id` is deliberately not a
 * source - it is 0 on every octoberfest spin, and no recorded level has ever come from it.
 *
 * Returns undefined when neither source carries a level.
 */
function getLevel(data: WofData, response: WheelofFortuneGambleXHRResponse): number | undefined {
    for (const level of [data.enhance, response.enhance]) {
        if (typeof level !== 'undefined' && level !== null) {
            return level;
        }
    }

    return undefined;
}

function getId(key: number | TombolaKey): number {
    if (typeof key === 'number') {
        return key;
    }
    return key.id;
}

function parseKey(key: string): number | TombolaKey | undefined {
    if (key.match(/^1$/)) {
        return 1;
    }
    const match = key.match(/^(\d+)_(\d+)_(\d+)$/);
    if (!match) {
        return;
    }
    return {
        id: Number(match[1]),
        year: Number(match[2]),
        type: events[Number(match[3])],
    };
}
