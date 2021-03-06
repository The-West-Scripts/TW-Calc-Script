export interface TW2WindowOptions {
    reloadable: boolean;
    title: TW2WindowPlainText | TW2WindowTranslation;
    size: { width: number; height: number } | null;
    content: { marginTop: number; marginLeft: number; marginBottom: number; marginRight: number };
}

export type TW2WindowPlainText = string;

export interface TW2WindowTranslation {
    type: 'translation';
    translation: number;
}

export interface TW2WindowTabInitOptions<InitOptions> {
    /*
     * Load callback is used to hide the loader
     */
    loadCallback: () => void;
    options?: InitOptions;
}

export interface TW2WindowView<Tab, InitOptions = undefined> {
    key: Tab;
    title: TW2WindowPlainText | TW2WindowTranslation | undefined;
    /**
     * Whether show loader when switch tab.
     */
    loader?: boolean;
    /**
     * getMainDiv() method is call when tab is opened.
     */
    getMainDiv(): JQuery;
    /**
     * init method is called after getMainDiv() is called.
     */
    init?(initOptions: TW2WindowTabInitOptions<InitOptions>): void;
    /**
     * destroy method is called when window is destroyed.
     */
    destroy?(): void;
}

export interface TW2WindowFactoryView {
    getMainDiv(): JQuery;
}

export interface TW2WindowPosition {
    x: number;
    y: number;
}

export interface TW2WindowOpenOptions<Tab, TabInitOptions = undefined> {
    tab: Tab;
    position: TW2WindowPosition;
    tabInitOptions?: TabInitOptions;
}
