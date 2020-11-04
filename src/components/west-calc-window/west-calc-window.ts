import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { TheWestWindow } from '../../@types/the-west';
import { TW2Window } from '../tw2-window/tw2-window';
import { WestCalcWindowTab } from './west-calc-window.types';

@singleton()
export class WestCalcWindow extends TW2Window<WestCalcWindowTab> {
    constructor(@inject('window') window: TheWestWindow, language: Language, logger: Logger) {
        // renamed from "TWCalc_window"
        super('TWCalcWindow', window, language, logger, { title: 'The-West Calc' });
    }

    open(tab?: WestCalcWindowTab): void {
        super.open(tab);
    }
}
