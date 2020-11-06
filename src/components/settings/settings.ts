import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { SettingAppearance, SettingBoolean, SettingController, SettingNumber, SettingValues } from './settings.types';
import { Storage } from '../storage/storage';
import { StorageKey } from '../storage/storage.types';
import { TheWestWindow } from '../../@types/the-west';

@singleton()
export class Settings {
    private defaults: SettingValues = {
        [SettingBoolean.Wardrobe]: true,
        [SettingBoolean.MenuCraftButton]: true,
        [SettingBoolean.TransferFeeCalc]: true,
        [SettingBoolean.XpHpEnergyCalc]: true,
        [SettingBoolean.WestCalc]: true,
        [SettingNumber.NearestJobsBar]: 1,
        [SettingNumber.DuelBar]: 1,
    };

    constructor(
        private readonly language: Language,
        private readonly storage: Storage,
        private readonly logger: Logger,
        @inject('window') private readonly window: TheWestWindow,
    ) {}

    save(settings: Array<SettingController>): void {
        const output: Record<string, number | boolean> = {};

        settings.forEach(setting => {
            output[setting.name] = getValue(setting);
        });

        this.logger.log('saving settings...', output);
        this.storage.setObject(StorageKey.settings, output);
        this.window.MessageSuccess(this.language.getTranslation(88)).show();
    }

    get(setting: SettingBoolean): boolean;
    get(setting: SettingNumber): number;
    get(setting: SettingNumber | SettingBoolean): boolean | number {
        if (this.storage.has(StorageKey.settings)) {
            const settings = this.storage.getObject<Partial<SettingValues>>(StorageKey.settings);
            const value = settings[setting];
            if (typeof value !== 'undefined') {
                return value;
            }
        }
        return this.defaults[setting];
    }
}

export function getValue(setting: SettingController): any {
    if (isBooleanSetting(setting)) {
        return (setting.controller as any).isSelected();
    } else if (isNumberSetting(setting)) {
        return setting.controller.getValue();
    }
}

export function isBooleanSetting(appearance: SettingAppearance): appearance is SettingAppearance<SettingBoolean> {
    return appearance.behaviour.type === 'checkbox';
}

export function isNumberSetting(appearance: SettingAppearance): appearance is SettingAppearance<SettingNumber> {
    return appearance.behaviour.type === 'combobox';
}
