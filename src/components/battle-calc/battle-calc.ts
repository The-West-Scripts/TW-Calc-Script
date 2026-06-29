import { BattleCalcWindow, BattleCoreCalc } from './battle-calc.types';
import { CatchErrors } from '../error-tracker/catch-errors';
import { Component } from '../component.types';
import { Config } from '../config/config';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { Logger } from '../logger/logger';
import { MarkRequired } from 'ts-essentials';

const MAX_LOAD_ATTEMPTS = 3;

@singleton()
export class BattleCalc implements Component {
    private loading = false;

    constructor(
        @inject('window') private window: BattleCalcWindow,
        private config: Config,
        private readonly logger: Logger,
        public readonly errorTracker: ErrorTracker,
    ) {}

    @CatchErrors('BattleCalc.init')
    init(): void {
        this.load();
    }

    /**
     * Loads the battle calc core script from the server. A single failed or cancelled
     * request used to leave the calc unavailable for the whole session, so failures are
     * retried with a backoff. Safe to call again (e.g. when a view finds it unavailable):
     * it is a no-op while already loaded or loading.
     */
    load(): void {
        if (this.isAvailable() || this.loading) {
            return;
        }
        this.loading = true;
        this.attemptLoad(1);
    }

    isAvailable(): boolean {
        return isAvailable(this.window);
    }

    getInstance(): BattleCoreCalc {
        const window = this.window;
        if (!isAvailable(window)) {
            throw new Error(`Battle calc core is not loaded yet!`);
        }
        return window['BattleCalc'];
    }

    private attemptLoad(attempt: number): void {
        this.window.$.getScript(this.config.website + '/js/battle-calculator-core.js')
            .done(() => {
                this.loading = false;
            })
            .fail(() => {
                this.logger.error(`failed to load battle calc core (attempt ${attempt}/${MAX_LOAD_ATTEMPTS})`);
                if (attempt < MAX_LOAD_ATTEMPTS) {
                    this.window.setTimeout(() => this.attemptLoad(attempt + 1), attempt * 2000);
                } else {
                    this.loading = false;
                }
            });
    }
}

function isAvailable(window: BattleCalcWindow): window is MarkRequired<BattleCalcWindow, 'BattleCalc'> {
    return window.hasOwnProperty('BattleCalc') && typeof window['BattleCalc'] !== 'undefined';
}
