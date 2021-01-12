import { BattleCalcWindow, BattleCoreCalc } from './battle-calc.types';
import { Component } from '../component.types';
import { Config } from '../config/config';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { MarkRequired } from 'ts-essentials';

@singleton()
export class BattleCalc implements Component {
    constructor(
        @inject('window') private window: BattleCalcWindow,
        private config: Config,
        public readonly errorTracker: ErrorTracker,
    ) {}

    init(): void {
        this.window.$.getScript(this.config.website + '/js/battle-calculator-core.js');
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
}

function isAvailable(window: BattleCalcWindow): window is MarkRequired<BattleCalcWindow, 'BattleCalc'> {
    return window.hasOwnProperty('BattleCalc') && typeof window['BattleCalc'] !== 'undefined';
}
