import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { TheWestWindow, tw2gui } from '../../@types/the-west';
import { TW2WindowOptions, TW2WindowPlainText, TW2WindowTabOption, TW2WindowTranslation } from './tw2-window.types';

const defaultOptions: TW2WindowOptions = {
    reloadable: true,
};

export class TW2Window<Tab extends string = string> {
    protected readonly $: JQueryStatic;
    protected options: TW2WindowOptions;
    protected readonly tabs: Partial<Record<Tab, TW2WindowTabOption>> = {};

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
        protected language: Language,
        protected logger: Logger,
        options: Partial<TW2WindowOptions> = {},
    ) {
        this.options = Object.assign(defaultOptions, options);
        this.$ = window.$;
    }

    public open(tab?: Tab): void {
        this.logger.log(`open window "${this.id}"...`, this.options, this.tabs);

        const additionalClasses = [];
        if (!this.options.reloadable) {
            additionalClasses.push('noreload');
        }
        this.win = this.window.wman.open(
            this.id,
            getTitle(this.language, this.options.title),
            additionalClasses.join(' '),
        );

        const tabKeys = Object.keys(this.tabs);
        tabKeys.forEach(tab => {
            const tabOptions = this.tabs[tab] as TW2WindowTabOption;
            const title = getTitle(this.language, tabOptions.title);

            this.tw2win
                .addTab(title, tab)
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

    public getTabMainDiv(tab: Tab): JQuery {
        return this.$(`.tw2gui_window_content_pane > #tab_${tab}`, this.getMainDiv());
    }

    public setTab(tab: Tab): void {
        const tabOptions = this.tabs[tab];
        if (typeof tabOptions !== 'undefined') {
            tabOptions.open();
            this.showTab(tab);
        } else {
            throw new Error(`Tab "${tab}" does not exist!`);
        }
    }

    public addTab(tab: Tab, option: TW2WindowTabOption): void {
        this.tabs[tab] = option;
    }

    private showTab(tab: Tab): void {
        // activate the desired tab
        this.tw2win.activateTab(tab);
        // hide all content panes
        $(`div.tw2gui_window_content_pane > *`, this.getMainDiv()).each(function () {
            $(this).hide();
        });
        // fade in the desired content pane
        $(`div.tw2gui_window_content_pane > #tab_${tab}`, this.getMainDiv()).fadeIn();
    }
}

function getTitle(language: Language, title?: TW2WindowPlainText | TW2WindowTranslation): string {
    if (typeof title != 'object') {
        return title || '';
    }
    return language.getTranslation(title.translation);
}
