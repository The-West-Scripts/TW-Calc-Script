import { Bag, TheWestWindow } from '../../@types/the-west';
import { CraftView } from './craft-view';
import { CraftWindowTab } from './craft-window.types';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { Recipes } from './craft.types';
import { TW2Window } from '../tw2-window/tw2-window';

export class CraftWindow extends TW2Window<CraftWindowTab> {
    // @ts-ignore
    constructor(readonly window: TheWestWindow, language: Language, logger: Logger, private readonly recipes: Recipes) {
        super('TWCalcCraft', window, language, logger, { title: { type: 'translation', translation: 183 } });

        for (let i = 1; i <= 4; i++) {
            this.addView(CraftView.of(i, this.window));
        }
    }

    open(tab: CraftWindowTab): void {
        super.open(tab);

        handleBagChanges(this.window, this.updateResources);
    }

    private updateResources() {
        // TODO: implement
    }
}

function handleBagChanges(window: TheWestWindow, callback: () => void): void {
    window.Bag.updateChanges = function (this: Bag, changes: unknown, from: unknown) {
        this.handleChanges(changes, from);
        window.Crafting.updateResources();
        callback();
    };
}
