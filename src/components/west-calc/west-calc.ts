import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { TheWestWindow } from '../../@types/the-west';
import { WestCalcWindow } from './west-calc-window';

@singleton()
export class WestCalc {
    public readonly window: WestCalcWindow;

    constructor(@inject('window') window: TheWestWindow, language: Language, logger: Logger) {
        this.window = new WestCalcWindow(window, language, logger);
    }
}
