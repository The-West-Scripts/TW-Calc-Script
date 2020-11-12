import { inject, singleton } from 'tsyringe';
import { TheWestWindow } from '../../@types/the-west';
import { TW2WindowTranslation, TW2WindowView } from '../tw2-window/tw2-window.types';
import { WestCalcWindowTab } from '../west-calc/west-calc-window.types';

@singleton()
export class NotepadView implements TW2WindowView<WestCalcWindowTab> {
    key = WestCalcWindowTab.Notepad;
    title: TW2WindowTranslation = {
        type: 'translation',
        translation: 210,
    };

    constructor(@inject('window') private readonly window: TheWestWindow) {}

    getMainDiv(): JQuery {
        return this.window.$('<div></div>');
    }
}
