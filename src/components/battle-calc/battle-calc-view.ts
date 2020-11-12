import { inject, singleton } from 'tsyringe';
import { TheWestWindow } from '../../@types/the-west';
import { TW2WindowTranslation, TW2WindowView } from '../tw2-window/tw2-window.types';
import { WestCalcWindowTab } from '../west-calc/west-calc-window.types';

@singleton()
export class BattleCalcView implements TW2WindowView<WestCalcWindowTab> {
    key = WestCalcWindowTab.BattleCalc;
    title: TW2WindowTranslation = {
        type: 'translation',
        translation: 214,
    };

    constructor(@inject('window') private readonly window: TheWestWindow) {}

    getMainDiv(): JQuery {
        return this.window.$('<div></div>');
    }
}
