import recipes from './recipes';
import { CatchErrors } from '../error-tracker/catch-errors';
import { Component } from '../component.types';
import { CraftWindow } from './craft-window';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { Recipes } from './craft.types';
import { TheWestWindow } from '../../@types/the-west';

@singleton()
export class Craft implements Component {
    public readonly window: CraftWindow;

    private recipes: Recipes = recipes;
    private lastCraft: Record<number, number> | null = null; // recipe_id => last craft timestamp

    constructor(
        @inject('window') private theWestWindow: TheWestWindow,
        private readonly language: Language,
        private readonly logger: Logger,
        public readonly errorTracker: ErrorTracker,
    ) {
        this.window = new CraftWindow(this.theWestWindow, this.errorTracker, this.language, this.logger, this.recipes);
    }

    @CatchErrors('Craft.init')
    init(): void {
        this.updateLastCraft();
    }

    @CatchErrors('Craft.open')
    open(professionId: number): void {
        this.window.open({ tab: professionId });
    }

    @CatchErrors('Craft.openCraftRecipeWindow')
    openCraftRecipeWindow(recipeId: number): void {
        this.logger.log(`show recipe id = ${recipeId}`);
    }

    private updateLastCraft() {
        this.theWestWindow.$.get(
            'game.php',
            {
                window: 'crafting',
            },
            (response: { recipes_content: Array<{ item_id: number; last_craft: number }> }) => {
                this.lastCraft = {};
                const recipes = response.recipes_content;
                if (typeof recipes !== 'undefined') {
                    for (let i = 0; i < recipes.length; i++) {
                        const recipe = recipes[i];
                        this.lastCraft[recipe.item_id] = recipe.last_craft;
                    }
                }
            },
        );
    }
}
