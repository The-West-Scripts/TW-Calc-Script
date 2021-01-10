export interface TW2WindowOptions {
    reloadable?: boolean;
    title?: TW2WindowPlainText | TW2WindowTranslation;
    size?: { width: number; height: number };
}

export type TW2WindowPlainText = string;

export interface TW2WindowTranslation {
    type: 'translation';
    translation: number;
}

export interface TW2WindowView<Tab> {
    key: Tab;
    title: TW2WindowPlainText | TW2WindowTranslation | undefined;
    /**
     * getMainDiv() method is called only once, when the window is created and opened.
     */
    getMainDiv(): JQuery;
    /**
     * init method is called when the tab of the view is clicked and view is shown.
     */
    init?(): void;
}
