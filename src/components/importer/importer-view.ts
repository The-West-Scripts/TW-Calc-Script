import { Importer } from './importer';
import { inject, singleton } from 'tsyringe';
import { TheWestWindow } from '../../@types/the-west';
import { TW2WindowTranslation, TW2WindowView } from '../tw2-window/tw2-window.types';
import { WestCalcWindowTab } from '../west-calc/west-calc-window.types';

@singleton()
export class ImporterView implements TW2WindowView<WestCalcWindowTab> {
    key = WestCalcWindowTab.Import;
    title: TW2WindowTranslation = {
        type: 'translation',
        translation: 211,
    };

    constructor(@inject('window') private readonly window: TheWestWindow, private readonly importer: Importer) {}

    init(): void {
        this.importer.start();
    }

    getMainDiv(): JQuery {
        return this.window.$('<div id="TW_Calc_Importer"></div>');
    }
}
