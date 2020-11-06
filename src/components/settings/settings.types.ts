import { tw2gui } from '../../@types/the-west';

export type Setting = SettingBoolean | SettingNumber;

export enum SettingBoolean {
    Wardrobe = 'Wardrobe',
    MenuCraftButton = 'MenuCraftButton',
    TransferFeeCalc = 'TransferFeeCalc',
    XpHpEnergyCalc = 'XpHpEnergyCalc',
    WestCalc = 'WestCalc',
}

export enum SettingNumber {
    NearestJobsBar = 'NearestJobsBar', // renamed from topBar
    DuelBar = 'DuelBar', // renamed from duelBar
}

export interface SettingValues {
    [SettingBoolean.Wardrobe]: boolean;
    [SettingBoolean.MenuCraftButton]: boolean;
    [SettingBoolean.TransferFeeCalc]: boolean;
    [SettingBoolean.XpHpEnergyCalc]: boolean;
    [SettingBoolean.WestCalc]: boolean;
    [SettingNumber.NearestJobsBar]: number;
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

export interface SettingController<SettingName extends Setting = Setting> extends SettingAppearance<SettingName> {
    controller: Controller<SettingName>;
}

export type Controller<SettingName extends Setting = Setting> = SettingName extends SettingBoolean
    ? tw2gui.Checkbox
    : SettingName extends SettingNumber
    ? tw2gui.Combobox<any>
    : never;

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
