export enum WestCalcWindowTab {
    Settings = 'settings',
}

export interface WestCalcWindowTabOption {
    translationId: number;
    open: () => void;
}
