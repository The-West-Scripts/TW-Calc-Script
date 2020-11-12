import { Config } from '../config/config';
import { DuelBarPosition } from '../duel-bar/duel-bar.types';
import { ErrorLog } from '../error-log/error-log';
import { inject, singleton } from 'tsyringe';
import { isBooleanSetting, isNumberSetting, Settings } from './settings';
import { Language } from '../language/language';
import { NearestJobs } from '../nearest-jobs/nearest-jobs';
import { NearestJobsBarPosition } from '../nearest-jobs/nearest-jobs.types';
import { SettingAppearance, SettingBoolean, SettingController, SettingNumber } from './settings.types';
import { TheWestWindow } from '../../@types/the-west';
import { TW2WindowTranslation, TW2WindowView } from '../tw2-window/tw2-window.types';
import { WestCalcWindowTab } from '../west-calc/west-calc-window.types';

@singleton()
export class SettingsView implements TW2WindowView<WestCalcWindowTab> {
    key = WestCalcWindowTab.Settings;
    title: TW2WindowTranslation = {
        type: 'translation',
        translation: 216,
    };

    constructor(
        @inject('window') private readonly window: TheWestWindow,
        private readonly language: Language,
        private readonly settings: Settings,
        private readonly nearestJobs: NearestJobs,
        private readonly errorLog: ErrorLog,
        private readonly config: Config,
    ) {}

    getMainDiv(): JQuery {
        const { west, $ } = this.window;
        const elements: Array<SettingController> = [];
        const settings = this.getOptions();
        const mainDiv = $('<div></div>');

        if (!settings) {
            throw new Error('Setting component was not initialized!');
        }

        settings.forEach(appearance => {
            if (isBooleanSetting(appearance)) {
                const { translation, name } = appearance;
                const checkbox = new west.gui.Checkbox(translation)
                    .setId(`TWCalc_${name}`)
                    .setSelected(this.settings.get(name))
                    .setCallback(() => {
                        this.settings.save(elements);
                    });

                elements.push({ ...appearance, controller: checkbox });
                mainDiv.append($(`<div style="margin: 3px 0"></div>`).append(checkbox.getMainDiv()));
            } else if (isNumberSetting(appearance)) {
                const { behaviour, translation, name } = appearance;
                const combobox = new west.gui.Combobox<number>(`TWCalc_${name}`);

                behaviour.options.forEach(option => {
                    combobox.addItem(option.value, option.translation);
                });

                combobox.select(this.settings.get(name));
                combobox.addListener(() => {
                    this.settings.save(elements);
                });

                elements.push({ ...appearance, controller: combobox });

                const row = $(`<div style="margin: 2px 0"></div>`);
                row.append(`<span>${translation}&nbsp;&nbsp;</span>`);
                row.append(combobox.getMainDiv());

                mainDiv.append(row);
            }
        });

        $(mainDiv)
            .append(
                `<p style="text-align: right; margin-bottom: 5px">${this.language.getTranslation(218)}<b> (F5)</b></p>`,
            )
            .append('<hr>')
            .append('</br>')
            .append(
                new west.gui.Button()
                    .setCaption(this.language.getTranslation(152))
                    .click(() => this.nearestJobs.dialog.open())
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

        return mainDiv;
    }

    private getOptions(): Array<SettingAppearance> {
        return [
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
                        {
                            value: NearestJobsBarPosition.downTransparent,
                            translation: `${this.language.getTranslation(187)} (transparent)`,
                        },
                        { value: NearestJobsBarPosition.down, translation: this.language.getTranslation(187) },
                        { value: NearestJobsBarPosition.up, translation: this.language.getTranslation(186) },
                        { value: NearestJobsBarPosition.right, translation: this.language.getTranslation(188) },
                        { value: NearestJobsBarPosition.hidden, translation: this.language.getTranslation(189) },
                    ],
                },
            },
            {
                name: SettingNumber.DuelBar,
                translation: this.language.getTranslation(191),
                behaviour: {
                    type: 'combobox',
                    options: [
                        { value: DuelBarPosition.up, translation: this.language.getTranslation(186) },
                        { value: DuelBarPosition.down, translation: this.language.getTranslation(187) },
                        { value: DuelBarPosition.hidden, translation: this.language.getTranslation(189) },
                    ],
                },
            },
        ];
    }
}
