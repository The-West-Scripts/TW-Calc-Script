import { CraftWindowTab } from './craft-window.types';
import { TheWestWindow } from '../../@types/the-west';
import { TW2WindowTranslation, TW2WindowView } from '../tw2-window/tw2-window.types';

export class CraftView implements TW2WindowView<CraftWindowTab> {
    title: TW2WindowTranslation;

    constructor(public readonly key: CraftWindowTab, private readonly window: TheWestWindow) {
        this.title = {
            type: 'translation',
            translation: translations[this.key],
        };
    }

    static of(key: CraftWindowTab, window: TheWestWindow): CraftView {
        return new CraftView(key, window);
    }

    getMainDiv(): JQuery {
        return this.window.$(`<div id="TWCalcCraft_${this.key}">${this.key}</div>`);
    }
}

const translations = {
    1: 179,
    2: 180,
    3: 181,
    4: 182,
};
