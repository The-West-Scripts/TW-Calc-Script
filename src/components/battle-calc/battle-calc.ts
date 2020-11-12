import { Component } from '../component.types';
import { Config } from '../config/config';
import { inject, singleton } from 'tsyringe';
import { TheWestWindow } from '../../@types/the-west';

@singleton()
export class BattleCalc implements Component {
    constructor(@inject('window') private window: TheWestWindow, private conig: Config) {}

    init(): void {
        this.window.$.getScript(this.conig.website + '/js/battle-calculator-core.js');
    }
}
