export interface TW2WindowOptions {
    reloadable?: boolean;
    title?: TW2WindowPlainText | TW2WindowTranslation;
}

export type TW2WindowPlainText = string;

export interface TW2WindowTranslation {
    type: 'translation';
    translation: number;
}

export interface TW2WindowView<Tab> {
    key: Tab;
    title: TW2WindowPlainText | TW2WindowTranslation;
    getMainDiv(): JQuery;
    init?(): void;
}
