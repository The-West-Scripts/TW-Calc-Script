import { Component } from '../component.types';
import { Config } from '../config/config';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { TheWestWindow } from '../../@types/the-west';

@singleton()
export class BattleCalc implements Component {
    constructor(
        @inject('window') private window: TheWestWindow,
        private config: Config,
        public readonly errorTracker: ErrorTracker,
    ) {}

    init(): void {
        this.window.$.getScript(this.config.website + '/js/battle-calculator-core.js');
    }
}
