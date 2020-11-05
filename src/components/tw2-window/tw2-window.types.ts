export interface TW2WindowOptions {
    reloadable?: boolean;
    title?: TW2WindowPlainText | TW2WindowTranslation;
}

export interface TW2WindowTabOption {
    title: TW2WindowPlainText | TW2WindowTranslation;
    open: () => void;
}

export type TW2WindowPlainText = string;

export interface TW2WindowTranslation {
    type: 'translation';
    translation: number;
}
