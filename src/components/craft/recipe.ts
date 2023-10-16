import { CraftingRecipeDifficulty, Item, TheWestWindow, tw2gui, tw2widget } from '../../@types/the-west';
import { CraftService } from './craft-service';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { Resource } from './craft.types';
import { zip } from '../../utils/zip';

export type RecipeOnStartCraft = (recipeId: number, amount: number) => void;

export class Recipe {
    private readonly item: Item;
    private readonly container: JQuery;
    private readonly title: JQuery;
    private readonly content: JQuery;
    private readonly craftAmount: JQuery;
    private readonly craft: JQuery;
    private readonly collapse: JQuery;
    private readonly difficulty: JQuery;
    private readonly recipeName: JQuery;

    private readonly resources: { items: Array<Resource>; widgets: Array<tw2widget.CraftingItem> };
    private readonly craftingItem: tw2widget.CraftingItem;
    private readonly unsubscribe: () => void;

    constructor(
        public readonly recipeId: number,
        private readonly craftService: CraftService,
        private readonly window: TheWestWindow,
        private readonly language: Language,
        private readonly logger: Logger,
        private readonly onStartCraft: RecipeOnStartCraft,
    ) {
        const { $, ItemManager, Crafting, tw2widget } = this.window;

        this.item = ItemManager.get(recipeId);

        this.resources = this.getResources();
        this.craftingItem = new tw2widget.CraftingItem(ItemManager.get(this.item.craftitem));
        this.container = $('<div data-recipe-craft-item-id="' + this.item.craftitem + '"></div>');
        this.title = $(
            '<div class="recipe_title" data-name="' +
                this.item.name +
                '" data-recipe-id="" style="display: inline-block; text-align: left;"></div>',
        );
        this.collapse = $('<div class="recipe_collapse">+</div>');
        this.collapse.on('click', () => this.setCollapsedToggle());
        this.difficulty = $('<div class="recipe_difficult hasMousePopup"></div>');
        this.recipeName = $(
            '<div class="recipe_name" style="width: 235px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">' +
                this.name.split(':').pop() +
                '</div>',
        );
        this.recipeName.on('click', () => this.setCollapsedToggle());

        const titleInner = $('<div class="recipe_title_inner"></div>');
        titleInner.append(this.collapse);
        titleInner.append(this.difficulty);
        titleInner.append(this.recipeName);

        titleInner.append(
            $(
                '<div class="recipe_colors" style="margin-top: 3px; color: white; font-size: 12px; font-family: monospace; ">' +
                    '|&nbsp;<span style="color: rgb(196, 163, 103">' +
                    this.item.min_level +
                    '</span>/<span style="color: rgb(88, 185, 88)">' +
                    this.getMidLevel() +
                    '</span>/<span style="color: rgb(85, 205, 221)">' +
                    this.item.max_level +
                    '</span>',
            ).attr('title', Crafting.description),
        );

        this.craftAmount = $('<div class="recipe_craft_amount"></div>');
        this.craft = $('<div data-id="' + recipeId + '" class="recipe_craft" style="color: white"></div>');
        this.title.append(titleInner).append(this.craftAmount).append(this.craft);

        this.content = $(
            '<div class="recipe_content" style="margin-left: auto; margin-right: auto; display: none"></div>',
        );

        // Get title and content together
        this.container.append(this.title).append(this.content);

        // Subscribe to on bag change events and update recipes
        this.unsubscribe = this.craftService.onBagChange(() => this.initMainDiv());
    }

    get name(): string {
        return this.item.name;
    }

    static of(
        recipeId: number,
        craftService: CraftService,
        window: TheWestWindow,
        language: Language,
        logger: Logger,
        onStartCraft: RecipeOnStartCraft,
    ): Recipe {
        return new Recipe(recipeId, craftService, window, language, logger, onStartCraft);
    }

    destroy(): void {
        this.unsubscribe();
    }

    isCraftable(): boolean {
        return this.isLearned() && this.getMaxCraftable() > 0 && this.craftService.getLastCraft(this.recipeId) === null;
    }

    getMaxCraftable(): number {
        const { Bag } = this.window;
        let maxAmount = Infinity;
        this.resources.items.forEach(resource => {
            const bagCount = Bag.getItemCount(resource.item.item_id);
            const amount = Math.floor(bagCount / resource.count);
            maxAmount = Math.min(maxAmount, amount);
        });
        // If recipe has a cooldown, we can craft only one time
        if (this.item.blocktime) {
            return Math.min(1, maxAmount);
        }
        return maxAmount;
    }

    getDifficulty(): CraftingRecipeDifficulty | null {
        if (!this.isLearned()) {
            return null;
        }
        return this.window.Crafting.getRecipeColor(this.item);
    }

    getName(): string {
        return this.item.name;
    }

    isLearned(): boolean {
        return this.isMyProfession() && this.craftService.isRecipeLearned(this.recipeId);
    }

    isLearnable(): boolean {
        if (!this.isMyProfession() || this.isLearned()) {
            return false;
        }
        const { Bag } = this.window;
        if (!Bag.items_by_id.hasOwnProperty(this.recipeId)) {
            return false;
        }
        const { ItemManager, Character } = this.window;
        return ItemManager.get(this.recipeId).min_level <= (Character.professionSkill || 0);
    }

    setCollapsed(collapsed: boolean): void {
        if (collapsed) {
            this.content.slideDown(250);
            this.collapse.text('-');
        } else {
            this.content.slideUp(250);
            this.collapse.text('+');
        }
    }

    setCollapsedToggle(): void {
        this.setCollapsed(this.collapse.text() === '+');
    }

    setVisible(visible: boolean): void {
        if (visible) {
            this.container.show();
        } else {
            this.container.hide();
        }
    }

    getOffsetTop(): number {
        return this.title[0].offsetTop;
    }

    getMainDiv(): JQuery {
        const { $, ItemPopup } = this.window;
        const craftItem = $('<div class="recipe_craftitem"></div>');
        const resources = $(
            '<div class="recipe_resources" style="overflow-x: auto; overflow-y: auto; display: flex;"></div>',
        );

        // Add resource item widgets
        this.resources.widgets.forEach(widget => {
            addMinimapLink(widget, this.window);
            resources.append(widget.getMainDiv());
        });

        // Add craft item
        craftItem.append(this.craftingItem.getMainDiv());

        // If not my profession, hide crafting button
        if (!this.isMyProfession()) {
            this.craft.empty();
        }

        // Add item popup to the recipe name
        const itemPopup = new ItemPopup(this.item);
        this.recipeName.attr('title', itemPopup.getXHTML());

        this.content.append(resources).append(craftItem);
        this.initMainDiv();

        return this.container;
    }

    initMainDiv(): void {
        this.logger.log('reloading main div of recipe...', this);
        const { ItemUse, Bag, Crafting, $ } = this.window;
        const maxCraftable = this.getMaxCraftable();
        const isCraftable = this.isCraftable();

        // Update recipe color
        this.difficulty.removeClass('middle hard easy');
        const difficulty = this.getDifficulty();
        if (difficulty) {
            this.difficulty.addClass(difficulty).attr('title', Crafting.description);
        }

        // Add plus/minus field
        const plusMinusField = this.getPlusMinusField(isCraftable, maxCraftable);
        this.craftAmount.empty().append(plusMinusField.getMainDiv());

        this.craft.empty();
        // Update crafting button
        if (isCraftable) {
            const craftButton = $('<span>' + this.language.getTranslation(177) + '</span>');
            craftButton.on('click', () => this.onStartCraft(this.recipeId, plusMinusField.getValue()));
            underline(craftButton);
            this.craft.append(craftButton);
            // Enable plus/minus
        } else {
            const lastCraft = this.craftService.getLastCraft(this.recipeId);
            // If has crafting cooldown, show remaining duration
            if (lastCraft !== null) {
                this.craft.append(
                    '<span style="color: yellow; cursor: default;">' + lastCraft.formatDurationBuffWay() + '</span>',
                );
            } else if (this.isLearnable()) {
                // Show learn button
                const learnButton = $('<span>' + this.language.getTranslation(209) + '</span>');
                learnButton.on('click', () => {
                    // When callback is called, the item was used
                    ItemUse.use(this.recipeId, () => this.setIsLearned(), 'recipe');
                });
                underline(learnButton);
                this.craft.append(learnButton);
            }
            // Otherwise is empty
        }

        // Update resources
        const { widgets, items } = this.resources;
        zip(widgets, items, (widget, resource) =>
            widget.setRequired(Bag.getItemCount(resource.item.item_id), resource.count),
        );

        // Update craft item
        this.craftingItem.setCount(Bag.getItemCount(this.craftingItem.obj.item_id));

        // Update recipe name color
        this.recipeName.css('color', this.isLearned() ? 'white' : 'gray');
    }

    getMidLevel(): number {
        return this.item.skillcolor
            ? this.item.max_level
            : this.item.min_level + Math.round((this.item.max_level - this.item.min_level) / 2);
    }

    getMinLevel(): number {
        return this.item.min_level;
    }

    getMaxLevel(): number {
        return this.item.max_level;
    }

    private getResources(): { items: Array<Resource>; widgets: Array<tw2widget.CraftingItem> } {
        const { ItemManager, tw2widget } = this.window;
        const items = (this.item.resources || []).map(({ item, count }) => {
            if (typeof item === 'number') {
                return { item: ItemManager.get(item), count };
            }
            return { item, count };
        });
        const widgets = items.map(resource => new tw2widget.CraftingItem(resource.item).setRequired(0, resource.count));
        return { items, widgets };
    }

    private setIsLearned(): void {
        this.logger.log('a recipe was learned', this);
        this.craftService.setLearnedRecipe(this.recipeId);
        this.initMainDiv();
    }

    private isMyProfession(): boolean {
        return this.craftService.isProfession(this.item.profession_id);
    }

    private getPlusMinusField(isCraftable: boolean, maxCraftable: number): tw2gui.Plusminusfield {
        const { west } = this.window;
        const value = isCraftable ? 1 : maxCraftable;
        const minValue = isCraftable ? 1 : maxCraftable;

        const plusMinusField = new west.gui.Plusminusfield(
            'TWCalc_Craft_' + this.recipeId,
            value,
            minValue,
            maxCraftable,
            0,
            event => callbackPlusminusButton(this.window, event),
            event => callbackPlusminusButton(this.window, event),
            (_, delta, button) => callbackWheel(this.window, delta, button),
        );
        plusMinusField.setEnabled(isCraftable);
        plusMinusField.divMain.on('mouseover', () =>
            plusMinusField.divMain.attr('title', `Max: ${plusMinusField.getMax()}`),
        );
        return plusMinusField;
    }
}

function callbackPlusminusButton(
    window: TheWestWindow,
    event: JQuery.ClickEvent<JQuery, { obj: tw2gui.Plusminusfield }>,
): boolean {
    const delta = window.$(event.currentTarget).hasClass('butPlus') ? 1 : -1;
    return callbackWheel(window, delta, event.data.obj);
}

function callbackWheel(window: TheWestWindow, delta: number, button: tw2gui.Plusminusfield): boolean {
    if (!button.enabled) {
        return false;
    }
    const nextValue = button.getValue() + delta;
    if (nextValue > button.getMax() || nextValue < button.getMin()) {
        return false;
    }
    button.setValue(nextValue);
    window.$('span.displayValue', button.getMainDiv()).text(button.getValue());
    return true;
}

function addMinimapLink(tw2item: tw2widget.CraftingItem, window: TheWestWindow) {
    const { $, Quest } = window;
    const minimapLinkContainer = $('<div style="width: 16px; right: 7px; bottom: 10px; position: absolute"></div>');
    const minimapLink = $(
        Quest.getMinimapLink({
            id: tw2item.obj.item_id,
            type: 'inventory_changed',
        }),
    ).css({
        display: 'block',
        width: '16px',
        position: 'relative',
        opacity: '1',
        left: '4px',
    });
    tw2item.getMainDiv().append(minimapLinkContainer.append(minimapLink));
}

function underline(element: JQuery): void {
    element
        .on('mouseover', () => element.css('text-decoration', 'underline'))
        .on('mouseout', () => element.css('text-decoration', 'none'));
}
