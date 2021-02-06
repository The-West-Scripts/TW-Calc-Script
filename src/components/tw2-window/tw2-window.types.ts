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

export interface TW2WindowView<Tab> {
    key: Tab;
    title: TW2WindowPlainText | TW2WindowTranslation | undefined;
    /**
     * getMainDiv() method is call when tab is opened.
     */
    getMainDiv(): JQuery;
    /**
     * init method is called after getMainDiv() is called.
     */
    init?(): void;
}

export interface TW2WindowFactoryView {
    getMainDiv(): JQuery;
}

export interface TW2WindowPosition {
    x: number;
    y: number;
}

export interface TW2WindowOpenOptions<Tab> {
    tab: Tab;
    position: TW2WindowPosition;
}
