import { CatchErrors } from '../error-tracker/catch-errors';
import { Component } from '../component.types';
import { CraftService } from './craft-service';
import { CraftViewFactory } from './craft-view-factory';
import { CraftWindow } from './craft-window';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { Profession } from './craft.types';
import { recipes } from './recipes';
import { TheWestWindow } from '../../@types/the-west';

@singleton()
export class Craft implements Component {
    public readonly craftWindow: CraftWindow;
    private productRecipe: Record<number, Profession> | undefined; // product_id => recipe_id

    constructor(
        @inject('window') private readonly window: TheWestWindow,
        private readonly language: Language,
        private readonly logger: Logger,
        private readonly craftService: CraftService,
        private readonly craftViewFactory: CraftViewFactory,
        public readonly errorTracker: ErrorTracker,
    ) {
        this.craftWindow = new CraftWindow(
            window,
            this.language,
            this.logger,
            this.craftViewFactory,
            this.craftService,
            this.errorTracker,
        );
    }

    @CatchErrors('Craft.init')
    init(): void {
        this.craftService.init();
    }

    @CatchErrors('Craft.open')
    open(): void {
        this.craftWindow.open({ tab: this.getCurrentProfession() });
    }

    /**
     * Open a craft window with highlighted recipe for the given product.
     * @param productId
     */
    @CatchErrors('Craft.openCraftRecipeWindow')
    openCraftRecipeWindow(productId: number): void {
        const { MessageError, ItemManager } = this.window;
        this.logger.log(`show recipe for productId = ${productId}`);
        const recipeId = this.getRecipeForProduct(productId);
        if (recipeId) {
            const professionId = ItemManager.get(recipeId).profession_id;
            this.logger.log(
                `there is a profession (id = ${professionId}) with recipe (id = ${recipeId}) for the product (id = ${productId})`,
            );
            this.craftWindow.open({
                tab: professionId,
                tabInitOptions: { showRecipe: { id: recipeId } },
            });
        } else {
            MessageError('There is no recipe for this product!').show();
        }
    }

    private getCurrentProfession(): Profession | 0 {
        return this.window.Character.professionId || 0;
    }

    private getRecipeForProduct(productId: number): number | null {
        // Calculate the cache for future faster lookup
        if (!this.productRecipe) {
            const productRecipe = (this.productRecipe = {});
            Object.values(recipes).forEach(professionRecipes => {
                professionRecipes.forEach(recipeId => {
                    const craftItemId = this.window.ItemManager.get(recipeId).craftitem;
                    productRecipe[craftItemId] = recipeId;
                });
            });
        }
        const recipeId = this.productRecipe[productId];
        if (!recipeId) {
            return null;
        }
        return recipeId;
    }
}
