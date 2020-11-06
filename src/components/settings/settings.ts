import { Component } from '../component.types';
import { Config } from '../config/config';
import { ErrorLog } from '../error-log/error-log';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { NearestJobsDialog } from '../nearest-jobs/nearest-jobs-dialog';
import { SettingAppearance, SettingBoolean, SettingController, SettingNumber, SettingValues } from './settings.types';
import { Storage } from '../storage/storage';
import { StorageKey } from '../storage/storage.types';
import { TheWestWindow } from '../../@types/the-west';
import { WestCalc } from '../west-calc/west-calc';
import { WestCalcWindowTab } from '../west-calc/west-calc-window.types';

@singleton()
export class Settings implements Component {
    private appearance?: Array<SettingAppearance>;
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
        private readonly westCalc: WestCalc,
        private readonly storage: Storage,
        private readonly nearestJobsDialog: NearestJobsDialog,
        private readonly errorLog: ErrorLog,
        private readonly config: Config,
        private readonly logger: Logger,
        @inject('window') private readonly window: TheWestWindow,
    ) {
        this.westCalc.window.addTab(WestCalcWindowTab.Settings, {
            title: {
                type: 'translation',
                translation: 216,
            },
            open: () => this.open(),
        });
    }

    init(): void {
        this.appearance = [
            {
                name: SettingBoolean.Wardrobe,
                translation: this.language.getTranslation(175),
                behaviour: { type: 'checkbox' },
            },
            {
                name: SettingBoolean.MenuCraftButton,
                translation: this.language.getTranslation(153),
                behaviour: { type: 'checkbox' },
            },
            {
                name: SettingBoolean.TransferFeeCalc,
                translation: this.language.getTranslation(108),
                behaviour: { type: 'checkbox' },
            },
            {
                name: SettingBoolean.XpHpEnergyCalc,
                translation: this.language.getTranslation(109),
                behaviour: { type: 'checkbox' },
            },
            {
                name: SettingBoolean.WestCalc,
                translation: this.language.getTranslation(184),
                behaviour: { type: 'checkbox' },
            },
            {
                name: SettingNumber.NearestJobsBar,
                translation: this.language.getTranslation(185),
                behaviour: {
                    type: 'combobox',
                    options: [
                        { value: 1, translation: `${this.language.getTranslation(187)} (transparent)` },
                        { value: 5, translation: this.language.getTranslation(187) },
                        { value: 2, translation: this.language.getTranslation(186) },
                        { value: 3, translation: this.language.getTranslation(188) },
                        { value: 4, translation: this.language.getTranslation(189) }, // hidden
                    ],
                },
            },
            {
                name: SettingNumber.DuelBar,
                translation: this.language.getTranslation(191),
                behaviour: {
                    type: 'combobox',
                    options: [
                        { value: 1, translation: this.language.getTranslation(186) },
                        { value: 2, translation: this.language.getTranslation(187) },
                        { value: 4, translation: this.language.getTranslation(189) },
                    ],
                },
            },
        ];
    }

    /**
     * Open a settings window.
     */
    open(): void {
        const { west } = this.window;
        const mainDiv = this.westCalc.window.getTabMainDiv(WestCalcWindowTab.Settings);
        const elements: Array<SettingController> = [];
        const settings = this.appearance;

        if (!settings) {
            throw new Error('Setting component was not initialized!');
        }

        settings.forEach(appearance => {
            if (isBooleanSetting(appearance)) {
                const { translation, name } = appearance;
                const checkbox = new west.gui.Checkbox(translation)
                    .setId(`TWCalc_${name}`)
                    .setSelected(this.get(name))
                    .setCallback(() => {
                        this.save(elements);
                    });

                elements.push({ ...appearance, controller: checkbox });
                mainDiv.append(checkbox.getMainDiv());
                mainDiv.append('</br>');
            } else if (isNumberSetting(appearance)) {
                const { behaviour, translation, name } = appearance;
                const combobox = new west.gui.Combobox<number>(`TWCalc_${name}`);

                behaviour.options.forEach(option => {
                    combobox.addItem(option.value, option.translation);
                });

                combobox.select(this.get(name));
                combobox.addListener(() => {
                    this.save(elements);
                });

                elements.push({ ...appearance, controller: combobox });
                mainDiv.append(combobox.getMainDiv());
                mainDiv.append(`<span>${translation}</span>`);
                mainDiv.append(combobox.getMainDiv);
                mainDiv.append('</br>');
            }
        });

        this.window
            .$(mainDiv)
            .append(
                `<p style="text-align: right; margin-bottom: 5px">${this.language.getTranslation(218)}<b> (F5)</b></p>`,
            )
            .append('<hr>')
            .append('</br>')
            .append(
                new west.gui.Button()
                    .setCaption(this.language.getTranslation(152))
                    .click(() => this.nearestJobsDialog.open())
                    .getMainDiv(),
            )
            .append(
                new west.gui.Button()
                    .setCaption('Error Log')
                    .click(() => this.errorLog.window.open())
                    .getMainDiv(),
            )
            .append(
                `</br><div style="margin-top: 8px;">Translated by <b>${this.language.getTranslator()}</b>.&nbsp;Thanks for the translation! Version: <b>v${
                    this.config.version
                }</b></div>`,
            );
    }

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

function getValue(setting: SettingController) {
    if (isBooleanSetting(setting)) {
        // TODO: improve typings
        return (setting.controller as any).isSelected();
    } else if (isNumberSetting(setting)) {
        return setting.controller.getValue();
    }
}

function isBooleanSetting(appearance: SettingAppearance): appearance is SettingAppearance<SettingBoolean> {
    return appearance.behaviour.type === 'checkbox';
}

function isNumberSetting(appearance: SettingAppearance): appearance is SettingAppearance<SettingNumber> {
    return appearance.behaviour.type === 'combobox';
}
