import { BagChange, CraftingWindowXHRResponse, TheWestWindow, XHRErrorResponse } from '../../@types/the-west';
import { CatchErrors } from '../error-tracker/catch-errors';
import { Component } from '../component.types';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { Logger } from '../logger/logger';
import { Profession } from './craft.types';

export const craftTranslations: Record<number, number> = {
    1: 179,
    2: 180,
    3: 181,
    4: 182,
};

@singleton()
export class CraftService implements Component {
    private lastRecipeCraftTimestamp: Record<number, number | null> = {}; // recipe_id => last craft timestamp
    private learnedRecipes: Record<number, boolean> = {}; // recipe_id => isLearned
    private onBagChangeCallbacks: Array<(changes: Array<BagChange>) => void> = [];
    private maxProfessionSkillValue = 0;

    constructor(
        @inject('window') private window: TheWestWindow,
        private readonly logger: Logger,
        public readonly errorTracker: ErrorTracker,
    ) {}

    get maxProfessionSkill(): number {
        return this.maxProfessionSkillValue;
    }

    /**
     * Fetch when what was the last time recipes were crafted.
     * @private
     */
    @CatchErrors('CraftService.update')
    update(): void {
        const { $, Character } = this.window;

        $.get(
            'game.php',
            {
                window: 'crafting',
            },
            (response: CraftingWindowXHRResponse | XHRErrorResponse) => {
                if (response.error) {
                    return this.logger.error(response.error);
                }
                const recipes = response.recipes_content;
                if (typeof recipes !== 'undefined') {
                    for (let i = 0; i < recipes.length; i++) {
                        const recipe = recipes[i];
                        this.lastRecipeCraftTimestamp[recipe.item_id] = recipe.last_craft;
                        this.learnedRecipes[recipe.item_id] = true;
                    }
                }
                Character.setProfessionSkill(response.profession_skill);
                this.maxProfessionSkillValue = response.profession_maxskill;
            },
        );
    }

    isRecipeLearned(recipeId: number): boolean {
        return this.learnedRecipes.hasOwnProperty(recipeId) && this.learnedRecipes[recipeId];
    }

    setLearnedRecipe(recipeId: number): void {
        this.learnedRecipes[recipeId] = true;
        this.lastRecipeCraftTimestamp[recipeId] = null;
    }

    getLastCraft(recipeId: number): number | null {
        const lastCraft = this.lastRecipeCraftTimestamp;
        return lastCraft && lastCraft.hasOwnProperty(recipeId) ? lastCraft[recipeId] : null;
    }

    init(): any {
        const { ItemManager } = this.window;
        // patch game on update changes caller
        patchBagUpdateChanges(this.window, changes => {
            this.onBagChangeCallbacks.forEach(callback => callback(changes));
        });
        // update last craft
        this.update();
        // listen to bag changes and update recipes
        this.onBagChange(changes => {
            changes.forEach(change => {
                if (ItemManager.get(change.item_id).type === 'recipe' && change.count > 0) {
                    this.learnedRecipes[change.item_id] = true;
                }
            });
        });
    }

    isProfession(profession: Profession): boolean {
        const { Character } = this.window;
        return Character.professionId === profession;
    }

    /**
     * Subscribe to bag change events and return unsubscribe function.
     * @param callback
     */
    onBagChange(callback: (changes: Array<BagChange>) => void): () => void {
        // Be aware of memory leaks when window closes
        this.onBagChangeCallbacks.push(callback);
        return () => {
            // filter callbacks
            this.onBagChangeCallbacks = this.onBagChangeCallbacks.filter(otherCallback => otherCallback !== callback);
        };
    }
}

function patchBagUpdateChanges(window: TheWestWindow, callback: (changes: Array<BagChange>) => void): void {
    const originalFn = window.Bag.updateChanges;
    window.Bag.updateChanges = function (changes, from) {
        originalFn.apply(this, [changes, from]);
        callback(changes);
    };
}
