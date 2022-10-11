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

export class TW2Window<Tab extends string | number = string, TabInitOptions = undefined> {
    protected readonly $: JQueryStatic;
    protected options: Required<TW2WindowOptions>;
    protected readonly views: Record<Tab, TW2WindowView<Tab, TabInitOptions>> = {} as Record<
        Tab,
        TW2WindowView<Tab, TabInitOptions>
    >;

    private win?: tw2gui.Window;

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

    get tw2win(): tw2gui.Window {
        if (!this.win) {
            throw new Error('Window manipulation before initialization!');
        }
        return this.win;
    }

    @CatchErrors('TW2Window.open')
    public open(options?: Partial<TW2WindowOpenOptions<Tab, TabInitOptions>>): void {
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

        const tabs = Object.values<TW2WindowView<Tab, TabInitOptions>>(this.views);
        tabs.forEach(tab => {
            const tabTitle = getTitle(this.language, tab.title) || '';

            const { marginLeft, marginRight, marginTop, marginBottom } = this.options.content;
            this.tw2win
                .addTab(tabTitle, tab.key.toString(), () => this.setTab(tab.key, 'tabSwitch'))
                .appendToContentPane(
                    this.window.$(
                        `<div id="tab_${tab.key}" style="display: none; overflow: hidden; margin: ${marginTop}px ${marginLeft}px ${marginBottom}px ${marginRight}px"></div>`,
                    ),
                );
        });

        // call destroy action when window is destroyed
        this.win.addEventListener('WINDOW_DESTROY', () => {
            tabs.forEach(tab => {
                this.errorTracker.execute(() => {
                    if (!tab.destroy) {
                        return;
                    }
                    tab?.destroy();
                });
            });
        });

        // if provided, show the tab from args
        if (options && options.tab) {
            this.setTab(options.tab, 'windowOpen', options.tabInitOptions);
        } else {
            // show the first tab
            if (tabs.length) {
                this.setTab(tabs[0].key, 'windowOpen');
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
    public setTab(tab: Tab, trigger: 'windowOpen' | 'tabSwitch', tabInitOptions?: TabInitOptions): void {
        const tabOptions = this.views[tab];
        this.logger.log(`set tab = ${tab}`, tab, tabOptions, tabInitOptions);
        if (typeof tabOptions !== 'undefined') {
            // If loader is enabled
            if (tabOptions.loader) {
                this.getWindow().showLoader();
                const timeout = trigger === 'tabSwitch' ? 50 : 500; // Higher timeout because of slow window rendering
                // It is more natural, when the desired tab is already activated
                this.tw2win.activateTab(tab.toString());
                // Show tab in the timeout, so the window is rendered at first and loader is visible if needed
                setTimeout(() => {
                    this.showTab(
                        tab,
                        tabOptions as TW2WindowView<Tab, TabInitOptions>,
                        () => {
                            // Hide the loader when the callback is called
                            this.getWindow().hideLoader();
                        },
                        tabInitOptions,
                    );
                }, timeout);
            } else {
                this.showTab(tab, tabOptions as TW2WindowView<Tab, TabInitOptions>, () => undefined, tabInitOptions);
            }
        } else {
            throw new Error(`Tab "${tab}" does not exist!`);
        }
    }

    protected addView(view: TW2WindowView<Tab, TabInitOptions>): void {
        this.views[view.key] = view;
    }

    private getWindow(): tw2gui.Window {
        if (!this.win) {
            throw new Error('Window object does not exist!');
        }
        return this.win;
    }

    private getTabMainDiv(tab: Tab): JQuery {
        return this.$(`.tw2gui_window_content_pane > #tab_${tab}`, this.getMainDiv());
    }

    private showTab<T extends Tab>(
        tab: T,
        tabOptions: TW2WindowView<T, TabInitOptions>,
        loadCallback: () => void,
        tabInitOptions?: TabInitOptions,
    ): void {
        // activate the desired tab
        this.tw2win.activateTab(tab.toString());
        // set content to the main div
        const mainDiv = this.errorTracker.execute(() => tabOptions.getMainDiv());
        this.getTabMainDiv(tabOptions.key)
            .empty()
            .append(mainDiv || '');
        // hide all content panes
        $(`div.tw2gui_window_content_pane > *`, this.getMainDiv()).each(function () {
            $(this).hide();
        });
        // if initialization function is defined, call it
        this.errorTracker.execute(() => {
            if (typeof tabOptions.init === 'function') {
                tabOptions.init({ loadCallback, options: tabInitOptions });
            }
        });
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
