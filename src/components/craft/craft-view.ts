import { CatchErrors } from '../error-tracker/catch-errors';
import {
    CraftingRecipeDifficulty,
    CraftingWindowStartCraftXHRResponse,
    TheWestWindow,
    tw2gui,
    XHRErrorResponse,
} from '../../@types/the-west';
import { CraftService } from './craft-service';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { Profession } from './craft.types';
import { Recipe } from './recipe';
import { recipes } from './recipes';
import { twCalcIcon } from '../gui/tw-calc.icon';

interface CraftViewFilter {
    craftableOnly: boolean; // true = show only craftable, false = show all
    difficulty: CraftingRecipeDifficulty | null;
    search: string;
}

export class CraftView {
    private readonly noResults: JQuery;
    private readonly collapseAll: JQuery;
    private readonly progressBar: tw2gui.Progressbar;
    private readonly search: tw2gui.Textfield;
    private readonly scrollpane: tw2gui.Scrollpane;
    private readonly filters: CraftViewFilter = {
        craftableOnly: false,
        difficulty: null,
        search: '',
    };
    private readonly recipes: Array<Recipe>;

    constructor(
        public readonly profession: Profession,
        private readonly craftService: CraftService,
        private readonly window: TheWestWindow,
        private readonly logger: Logger,
        private readonly language: Language,
        public readonly errorTracker: ErrorTracker,
    ) {
        const { west, Character, $ } = this.window;
        this.logger.log('initializing craft view...');
        this.progressBar = new west.gui.Progressbar().setValue(Character.professionSkill || 0);

        // Search input
        this.search = new west.gui.Textfield().setPlaceholder(this.language.getTranslation(220));
        this.search.addKeyUpListener(() => {
            this.filters.search = this.search.getValue();
            this.apply();
        });

        // Scrollpane
        this.scrollpane = new west.gui.Scrollpane();

        // Create recipes
        this.recipes = recipes[this.profession].map(recipe =>
            Recipe.of(recipe, this.craftService, this.window, this.language, this.logger, (recipeId, amount) =>
                this.startCraft(recipeId, amount),
            ),
        );

        this.noResults = $('<div style="margin: 8px; text-align: center; font-weight: bold;"><p>No results</p></divs>');
        this.noResults.hide();

        this.collapseAll = this.getCollapseAllDiv();
    }

    static of(
        key: Profession,
        craftService: CraftService,
        window: TheWestWindow,
        logger: Logger,
        language: Language,
        errorTracker: ErrorTracker,
    ): CraftView {
        return new CraftView(key, craftService, window, logger, language, errorTracker);
    }

    @CatchErrors('CraftView.destroy')
    destroy(): void {
        this.logger.log('destroying craft view...');
        this.recipes.forEach(recipe => recipe.destroy());
    }

    @CatchErrors('CraftView.getFiltersDiv')
    private getFiltersDiv(): JQuery {
        const { Crafting, $, west } = this.window;

        const difficultyTitle = Crafting.description.split('<br />');
        const filters = $('<div style="align-items: center; display: flex; flex-direction: row;"></div>');

        const craftableCheckbox = new west.gui.Checkbox('')
            .setValue(true)
            .setTooltip(this.language.getTranslation(176))
            .setSelected(false);

        craftableCheckbox.setCallback(() => {
            this.filters.craftableOnly = craftableCheckbox.isSelected();
            this.apply();
        });

        filters.append(craftableCheckbox.getMainDiv());
        filters.append('&nbsp;|&nbsp;');

        const difficultyFilters: Array<CraftingRecipeDifficulty | null> = [null, 'easy', 'medium', 'hard'];
        difficultyFilters.forEach((value, index) => {
            const checkbox = new west.gui.Checkbox<CraftingRecipeDifficulty | null>('', 'TWCalc_CraftFilter')
                .setValue(value)
                .setSelected(value === null)
                .setRadiobutton()
                // add a tooltip for easy/medium/hard
                .setTooltip(index ? difficultyTitle[index - 1] : '');

            checkbox.setCallback(() => {
                this.filters.difficulty = checkbox.getValue();
                this.apply();
            });

            filters.append(checkbox.getMainDiv());
        });

        return filters;
    }

    show(recipeId: number): void {
        this.logger.log(`showing recipe id = ${recipeId}`);
        const recipe = this.getRecipe(recipeId);
        // Scroll down to recipe
        const posY =
            ((this.scrollpane.clipPane[0].clientHeight - 30) / this.scrollpane.contentPane[0].clientHeight) *
            recipe.getOffsetTop();
        this.scrollpane.scrollTo(0, posY, true);
        // Collapse recipe products
        recipe.setCollapsed(true);
    }

    apply(): void {
        this.logger.log('apply craft filter...', this.filters);
        const filters = this.filters;
        let visibleCount = 0;
        // Apply all filters and hide/show recipes
        this.recipes.forEach(recipe => {
            const visible =
                // Matches difficulty if enabled
                (filters.difficulty === null || filters.difficulty === recipe.getDifficulty()) &&
                // Is craftable if only craftable is enabled
                (!filters.craftableOnly || recipe.isCraftable()) &&
                // Includes a search of search is defined
                (!filters.search.length || recipe.getName().toLowerCase().search(filters.search.toLowerCase()) !== -1);
            if (visible) {
                visibleCount++;
            }
            recipe.setVisible(visible);
        });
        if (!visibleCount) {
            this.collapseAll.hide();
            this.noResults.show();
        } else {
            this.collapseAll.show();
            this.noResults.hide();
        }
        this.scrollpane.scrollToTop();
    }

    getMainDiv(): JQuery {
        const { $, west } = this.window;
        const mainDiv = $(`<div id="TWCalcCraft_${this.profession}"></div>`);
        const groupFrame = new west.gui.Groupframe();
        const groupFrameContent = $(
            '<div style="display: flex; justify-content: space-between; flex-direction: row; align-items: center;"></div>',
        );

        this.progressBar.setMaxValue(this.craftService.maxProfessionSkill);

        // Append a search input
        this.search.setWidth(this.isMyProfession() ? 200 : 624);
        groupFrameContent.append(this.search.getMainDiv());

        if (this.isMyProfession()) {
            const progressBar = this.progressBar.getMainDiv().css('width', 300);
            groupFrameContent.append(progressBar);
        }

        if (this.isMyProfession()) {
            groupFrameContent.append(this.getFiltersDiv());
        }

        groupFrame.appendToContentPane(groupFrameContent);
        // Add top group frame
        mainDiv.append(groupFrame.getMainDiv());

        // Add collapse all button
        this.scrollpane.appendContent(this.collapseAll);

        // Add recipes to content
        this.scrollpane.appendContent(this.getRecipes());
        this.scrollpane.appendContent(this.noResults);

        // Add a scrollpane
        const scrollpaneDiv = $(this.scrollpane.getMainDiv()).css({ height: 293, 'text-align': 'center' });
        mainDiv.append(scrollpaneDiv);

        // TW-Calc.net redirect button
        mainDiv.append(
            $(
                '<a href="//tw-calc.net/craft/' +
                    this.profession +
                    '" target="_blank" title="Show this profession on tw-calc.net"><div style="background-position: 0 0; background-image: url(' +
                    twCalcIcon +
                    '); width: 25px; height: 25px; position: absolute; bottom: 0; left: 5px"></div></a>',
            ),
        );

        return mainDiv;
    }

    private startCraft(recipeId: number, amount: number): void {
        this.logger.log(`start craft recipe id ${recipeId} (amount = ${amount})`);
        const { Ajax, Character, MessageError, EventHandler, MessageSuccess } = this.window;

        Ajax.remoteCall<CraftingWindowStartCraftXHRResponse | XHRErrorResponse, { recipe_id: number; amount: number }>(
            'crafting',
            'start_craft',
            {
                recipe_id: recipeId,
                amount: amount,
            },
            resp => {
                if (resp.error) {
                    return MessageError(resp.msg).show();
                }

                Character.setProfessionSkill(resp.msg.profession_skill);
                Character.updateDailyTask('crafts', resp.msg.count);
                EventHandler.signal('inventory_changed');

                this.progressBar.setValue(Character.professionSkill || 0);
                // Reload recipes, their difficulty or product counts might have changed
                this.recipes.forEach(recipe => recipe.initMainDiv());

                return MessageSuccess(resp.msg.msg).show();
            },
        );
    }

    private getRecipes(): JQuery {
        // Get recipes divs
        const { $ } = this.window;
        const recipesDiv = $('<div></div>');
        this.recipes.forEach(recipe => recipesDiv.append(recipe.getMainDiv()));
        return recipesDiv;
    }

    private getRecipe(recipeId: number): Recipe {
        const recipe = this.recipes.find(recipe => recipe.recipeId === recipeId);
        if (!recipe) {
            throw new Error(`recipe (id = ${recipeId}) not found`);
        }
        return recipe;
    }

    private getCollapseAllDiv(): JQuery {
        const { $ } = this.window;
        const recipeTitle = $(
            '<div id="recipe_title_" class="recipe_title" style="display: inline-block; text-align: left;"></div>',
        );
        const recipeTitleInner = $('<div class="recipe_title_inner"></div>');
        const collapseAll = $('<div class="recipe_collapse">+</div>');

        recipeTitleInner.append('<div id="recipe_difficult_" class="recipe_difficult"></div>');
        recipeTitleInner.append(
            '<div id="recipe_name" class="recipe_name">' + this.language.getTranslation(178) + '</div>',
        );

        // Collapse all recipes
        $(recipeTitle).on('click', () => {
            const collapse = collapseAll.text() === '+';
            this.recipes.forEach(recipe => recipe.setCollapsed(collapse));
            collapseAll.text(collapse ? '-' : '+');
        });

        return recipeTitle.append(collapseAll).append(recipeTitleInner);
    }

    private isMyProfession(): boolean {
        return this.craftService.isProfession(this.profession);
    }
}
