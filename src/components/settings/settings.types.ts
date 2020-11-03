export type Setting = SettingBoolean | SettingNumber;

export enum SettingBoolean {
    Wardrobe = 'Wardrobe',
    MenuCraftButton = 'MenuCraftButton',
    TransferFeeCalc = 'TransferFeeCalc',
    XpHpEnergyCalc = 'XpHpEnergyCalc',
    WestCalc = 'WestCalc',
}

export enum SettingNumber {
    TopBar = 'TopBar', // renamed from topBar
    DuelBar = 'DuelBar', // renamed from duelBar
}

export interface SettingValues {
    [SettingBoolean.Wardrobe]: boolean;
    [SettingBoolean.MenuCraftButton]: boolean;
    [SettingBoolean.TransferFeeCalc]: boolean;
    [SettingBoolean.XpHpEnergyCalc]: boolean;
    [SettingBoolean.WestCalc]: boolean;
    [SettingNumber.TopBar]: number;
    [SettingNumber.DuelBar]: number;
}

export type SettingBehaviour<SettingName extends Setting = Setting> = SettingName extends SettingBoolean
    ? SettingCheckbox
    : SettingName extends SettingNumber
    ? SettingCombobox
    : never;

export interface SettingAppearance<SettingName extends Setting = Setting> {
    name: SettingName;
    translation: string;
    behaviour: SettingBehaviour<SettingName>;
}

export interface SettingCheckbox {
    type: 'checkbox';
}

export interface SettingComboboxOption {
    value: number;
    translation: string;
}

export interface SettingCombobox {
    type: 'combobox';
    options: Array<SettingComboboxOption>;
}
