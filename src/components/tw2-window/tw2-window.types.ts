export interface TW2WindowOptions {
    reloadable?: boolean;
    title?: string;
}

export interface TW2WindowTabOption {
    title: TW2WindowTabPlainText | TW2WindowTabTranslation;
    open: () => void;
}

export interface TW2WindowTabPlainText {
    type: 'text';
    value: string;
}

export interface TW2WindowTabTranslation {
    type: 'translation';
    translation: number;
}
