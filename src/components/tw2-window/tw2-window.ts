import { CatchErrors } from '../error-tracker/catch-errors';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { MarkOptional, MarkRequired } from 'ts-essentials';
import { TheWestWindow, tw2gui } from '../../@types/the-west';
import {
    TW2WindowOpenOptions,
    TW2WindowOptions,
    TW2WindowPlainText,
    TW2WindowPosition,
    TW2WindowTranslation,
    TW2WindowView,
} from './tw2-window.types';

const defaultOptions: MarkOptional<TW2WindowOptions, 'title'> = {
    reloadable: false,
    size: null,
    content: { marginLeft: 12, marginBottom: 12, marginTop: 12, marginRight: 12 },
};

export class TW2Window<Tab extends string | number = string> {
    protected readonly $: JQueryStatic;
    protected options: Required<TW2WindowOptions>;
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
        public readonly errorTracker: ErrorTracker,
        protected window: TheWestWindow,
        protected language: Language | null,
        protected logger: Logger,
        options: MarkRequired<Partial<TW2WindowOptions>, 'title'>,
    ) {
        this.options = Object.assign({}, defaultOptions, options);
        this.$ = window.$;
    }

    @CatchErrors('TW2Window.open')
    public open(options?: Partial<TW2WindowOpenOptions<Tab>>): void {
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

            const { marginLeft, marginRight, marginTop, marginBottom } = this.options.content;
            this.tw2win
                .addTab(tabTitle, tab, () => this.setTab(tab as Tab))
                .appendToContentPane(
                    this.window.$(
                        `<div id="tab_${tab}" style="display: none; overflow: hidden; margin: ${marginTop}px ${marginLeft}px ${marginBottom}px ${marginRight}px"></div>`,
                    ),
                );
        });

        // if provided, show the tab from args
        if (options && options.tab) {
            this.setTab(options.tab);
        } else {
            // show the first tab
            if (tabKeys.length) {
                this.setTab(tabKeys[0] as Tab);
            }
        }

        // move if position is set
        if (options && options.position) {
            this.move(options.position);
        }
    }

    @CatchErrors('TW2Window.moveTo')
    public move(position: TW2WindowPosition): void {
        $('.tw2gui_window.tw2gui_win2.' + this.id)
            .css('left', position.x)
            .css('top', position.y);
    }

    @CatchErrors('TW2Window.setOptions')
    public setOptions(options: Partial<TW2WindowOptions>): void {
        Object.assign(this.options, options);
    }

    @CatchErrors('TW2Window.getMainDiv')
    public getMainDiv(): JQuery {
        return this.$(`.${this.id}`);
    }

    @CatchErrors('TW2Window.setTab')
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
        this.tw2win.activateTab(tab.toString());
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
