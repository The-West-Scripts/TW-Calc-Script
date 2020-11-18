import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { TheWestWindow, tw2gui } from '../../@types/the-west';
import { TW2WindowOptions, TW2WindowPlainText, TW2WindowTranslation, TW2WindowView } from './tw2-window.types';

const defaultOptions: TW2WindowOptions = {
    reloadable: true,
};

export class TW2Window<Tab extends string = string> {
    protected readonly $: JQueryStatic;
    protected options: TW2WindowOptions;
    protected readonly views: Partial<Record<Tab, TW2WindowView<Tab>>> = {};

    private win?: tw2gui.Window;

    get tw2win(): tw2gui.Window {
        if (!this.win) {
            throw new Error('Window manipulation before initialization!');
        }
        return this.win;
    }

    constructor(
        public readonly id: string,
        protected window: TheWestWindow,
        protected language: Language | null,
        protected logger: Logger,
        options: Partial<TW2WindowOptions> = {},
    ) {
        this.options = Object.assign({}, defaultOptions, options);
        this.$ = window.$;
    }

    public open(tab?: Tab): void {
        this.logger.log(`open window "${this.id}"...`, this.options, this.views);

        const additionalClasses = [];
        if (!this.options.reloadable) {
            additionalClasses.push('noreload');
        }
        const title = getTitle(this.language, this.options.title) || '';
        this.win = this.window.wman.open(this.id, title, additionalClasses.join(' ')).setMiniTitle(title);

        if (this.options.size) {
            const { width, height } = this.options.size;
            this.win.setSize(width, height);
        }

        const tabKeys = Object.keys(this.views);
        tabKeys.forEach(tab => {
            const tabOptions = this.views[tab];
            const tabTitle = getTitle(this.language, tabOptions.title) || '';

            this.tw2win
                .addTab(tabTitle, tab, () => this.setTab(tab as Tab))
                .appendToContentPane(
                    $(`<div id="tab_${tab}" style="display: none; overflow: hidden; margin: 18px 12px;"></div>`),
                );
        });

        // if provided, show the tab from args
        if (tab) {
            this.setTab(tab);
        } else {
            // show the first tab
            if (tabKeys.length) {
                this.setTab(tabKeys[0] as Tab);
            }
        }
    }

    public setOptions(options: Partial<TW2WindowOptions>): void {
        Object.assign(this.options, options);
    }

    public getMainDiv(): JQuery {
        return this.$(`.${this.id}`);
    }

    public setTab(tab: Tab): void {
        const tabOptions = this.views[tab];
        if (typeof tabOptions !== 'undefined') {
            this.showTab(tab, tabOptions as TW2WindowView<Tab>);
        } else {
            throw new Error(`Tab "${tab}" does not exist!`);
        }
    }

    protected addView(view: TW2WindowView<Tab>): void {
        this.views[view.key] = view;
    }

    private getTabMainDiv(tab: Tab): JQuery {
        return this.$(`.tw2gui_window_content_pane > #tab_${tab}`, this.getMainDiv());
    }

    private showTab<T extends Tab>(tab: T, tabOptions: TW2WindowView<T>): void {
        // set content to the main div
        this.getTabMainDiv(tabOptions.key).empty().append(tabOptions.getMainDiv());
        // activate the desired tab
        this.tw2win.activateTab(tab);
        // hide all content panes
        $(`div.tw2gui_window_content_pane > *`, this.getMainDiv()).each(function () {
            $(this).hide();
        });
        // if initialization function is defined, call it
        if (typeof tabOptions.init === 'function') {
            tabOptions.init();
        }
        // fade in the desired content pane
        $(`div.tw2gui_window_content_pane > #tab_${tab}`, this.getMainDiv()).fadeIn();
    }
}

function getTitle(language: Language | null, title?: TW2WindowPlainText | TW2WindowTranslation): string | undefined {
    if (typeof title != 'object') {
        return title;
    }
    if (!language) {
        return 'undefined';
    }
    return language.getTranslation(title.translation);
}
