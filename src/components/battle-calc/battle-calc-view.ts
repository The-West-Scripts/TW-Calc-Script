import { BattleCalc } from './battle-calc';
import { BattleCalcInput, BattleCalcViewInput } from './battle-calc.types';
import { CatchErrors } from '../error-tracker/catch-errors';
import { Component } from '../component.types';
import { Config } from '../config/config';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { Storage } from '../storage/storage';
import { StorageKey } from '../storage/storage.types';
import { TheWestWindow } from '../../@types/the-west';
import { TW2WindowTranslation, TW2WindowView } from '../tw2-window/tw2-window.types';
import { WestCalcWindowTab } from '../west-calc/west-calc-window.types';

interface NumericInputOptions {
    label?: string;
    inputWidth: number;
    labelWidth: number;
    isIntegerOnly: boolean;
}

const numericInputOptionsDefaults: NumericInputOptions = {
    label: undefined,
    inputWidth: 100,
    labelWidth: 180,
    isIntegerOnly: true,
};

@singleton()
export class BattleCalcView implements TW2WindowView<WestCalcWindowTab>, Component {
    key = WestCalcWindowTab.BattleCalc;
    title: TW2WindowTranslation = {
        type: 'translation',
        translation: 214,
    };

    constructor(
        @inject('window') private readonly window: TheWestWindow,
        private readonly language: Language,
        private readonly storage: Storage,
        private readonly config: Config,
        private readonly battleCalc: BattleCalc,
        private readonly logger: Logger,
        public readonly errorTracker: ErrorTracker,
    ) {}

    @CatchErrors('BattleCalcView.calculate')
    private calculate(): void {
        const battleCalcDiv = this.window.$('#BattleCalc');
        if (!battleCalcDiv.length) {
            return;
        }

        const {
            charClass,
            premium,
            level,
            health,
            leadership,
            pitfall,
            hide,
            dodge,
            aim,
            mapPosition,
            charTower,
            damageBonus,
            dodgeBonus,
            resistanceBonus,
            hitBonus,
            weaponMax,
            weaponMin,
        } = this.getCachedInput();

        const input: BattleCalcInput = {
            charClass,
            premium,
            level,
            skills: {
                health,
                leadership,
                pitfall,
                hide,
                dodge,
                aim,
            },
            mapPosition,
            charTower,
            damage: [weaponMin, weaponMax],
            bonus: {
                attack: hitBonus,
                defense: dodgeBonus,
                resistance: resistanceBonus,
                damage: damageBonus,
            },
        };

        this.logger.log('calculating battle calc based on input...', input);
        // TODO: add a checkbox to use player's actual wear
        const output = this.battleCalc.getInstance().coreCalc(input, false);
        this.logger.log('battle calc calculation finished', output);
        const prefix = '#TW_Calc_BattleCalc_';

        this.window.$(prefix + 'AttackHit').text(output.attack.hit);
        this.window.$(prefix + 'AttackDodge').text(output.attack.dodge);
        this.window.$(prefix + 'DefenseHit').text(output.defense.hit);
        this.window.$(prefix + 'DefenseDodge').text(output.defense.dodge);
        this.window.$(prefix + 'HealthOutput').text(output.health + ' HP');
        this.window.$(prefix + 'AttackResistance').text(output.attack.resistance);
        this.window.$(prefix + 'AttackResistanceBonus').text(`(+${output.attack.resistance_bonus})`);
        this.window.$(prefix + 'DefenseResistance').text(output.defense.resistance);
        this.window.$(prefix + 'DefenseResistanceBonus').text(`(+${output.defense.resistance_bonus})`);
        this.window.$(prefix + 'DamageOutput').text(output.damage);
    }

    @CatchErrors('BattleCalcView.getCachedInput')
    private getCachedInput(): BattleCalcViewInput {
        const defaultInput: BattleCalcViewInput = {
            health: 0,
            dodge: 0,
            hide: 0,
            aim: 0,
            pitfall: 0,
            leadership: 0,
            weaponMin: 50,
            weaponMax: 110,
            level: 1,
            charClass: 'greenhorn',
            mapPosition: 0,
            premium: false,
            charTower: false,
            hitBonus: 0,
            dodgeBonus: 0,
            resistanceBonus: 0,
            damageBonus: 0,
        };
        if (!this.storage.has(StorageKey.battleCalc)) {
            return defaultInput;
        }
        return Object.assign(defaultInput, this.storage.getObject<Partial<BattleCalcViewInput>>(StorageKey.battleCalc));
    }

    init(): void {
        this.calculate();
    }

    getMainDiv(): JQuery {
        if (!this.battleCalc.isAvailable()) {
            return $('<div>Battle calc core script is not loaded, try refreshing the game.</div>');
        }

        const { west } = this.window;
        const leftHtmlDiv = $('<div></div>');
        const skillsFrame = new west.gui.Groupframe().appendToContentPane(
            '<div style="font-weight: bold; font-size: large;">' + this.language.getTranslation(4) + '</div>',
        );

        const skills = {
            health: this.language.getTranslation(29),
            dodge: this.language.getTranslation(8),
            hide: this.language.getTranslation(6),
            aim: this.language.getTranslation(9),
            pitfall: this.language.getTranslation(193),
            leadership: this.language.getTranslation(5),
        };

        Object.entries(skills).forEach(([key, label]) => {
            skillsFrame.appendToContentPane($('<div></div>').append(this.getNumericInput(key, { label })));
        });

        const characterFrame = new west.gui.Groupframe().appendToContentPane(
            '<div style="font-weight: bold; font-size: large;">' + this.language.getTranslation(32) + '</div>',
        );

        characterFrame.appendToContentPane(
            $('<div></div>').append(this.getNumericInput('level', { label: this.language.getTranslation(30) })),
        );
        characterFrame.appendToContentPane(
            $('<div></div>')
                .append(
                    this.getNumericInput('weaponMin', {
                        label: this.language.getTranslation(201),
                        inputWidth: 50,
                        labelWidth: 140,
                    }),
                )
                .append('&nbsp;-&nbsp;')
                .append(this.getNumericInput('weaponMax', { inputWidth: 50 })),
        );

        characterFrame.appendToContentPane(
            '<div style="font-weight: bold;">' + this.language.getTranslation(32) + '</div>',
        );

        const characterCombobox = new west.gui.Combobox<string>('TWCalc_Character').setWidth(100);
        characterCombobox.addListener(this.onInputChange('charClass', () => characterCombobox.getValue()));

        characterFrame.appendToContentPane(
            characterCombobox
                .addItem('greenhorn', this.language.getTranslation(38))
                .addItem('soldier', this.language.getTranslation(41))
                .addItem('worker', this.language.getTranslation(42))
                .addItem('duelist', this.language.getTranslation(39))
                .addItem('adventurer', this.language.getTranslation(40))
                .select(this.getCachedInputValue('charClass'))
                .getMainDiv(),
        );

        characterFrame.appendToContentPane(
            '<div style="font-weight: bold;">' + this.language.getTranslation(18) + '</div>',
        );

        const placeCombobox = new west.gui.Combobox<number>('TWCalc_Place').setWidth(100);
        placeCombobox.addListener(this.onInputChange('mapPosition', () => placeCombobox.getValue()));

        characterFrame.appendToContentPane(
            placeCombobox
                .addItem(0, this.language.getTranslation(21))
                .addItem(10000, this.language.getTranslation(223))
                .addItem(10001, this.language.getTranslation(224))
                .addItem(100, this.language.getTranslation(22) + ' 0')
                .addItem(1, this.language.getTranslation(22) + ' 1')
                .addItem(2, this.language.getTranslation(22) + ' 2')
                .addItem(3, this.language.getTranslation(22) + ' 3')
                .addItem(4, this.language.getTranslation(22) + ' 4')
                .addItem(5, this.language.getTranslation(22) + ' 5')
                .addItem(1000, this.language.getTranslation(203) + ' 0')
                .addItem(11, this.language.getTranslation(203) + ' 1')
                .addItem(12, this.language.getTranslation(203) + ' 2')
                .addItem(13, this.language.getTranslation(203) + ' 3')
                .addItem(14, this.language.getTranslation(203) + ' 4')
                .addItem(15, this.language.getTranslation(203) + ' 5')
                .select(this.getCachedInputValue('mapPosition'))
                .getMainDiv(),
        );

        const checkBoxes = {
            premium: this.language.getTranslation(2),
            charTower: this.language.getTranslation(20),
        };
        const checkBoxesDiv = $('<div></div>');

        Object.entries(checkBoxes).forEach(([key, label]) => {
            const checkBox = new west.gui.Checkbox(label).setId(key).setSelected(this.getCachedInputValue(key));
            checkBox.setCallback(this.onInputChange(key, () => checkBox.isSelected()));
            $(checkBoxesDiv).append($('<div style="margin: 2px 0"></div>').append(checkBox.getMainDiv()));
        });

        characterFrame.appendToContentPane(checkBoxesDiv);

        const bonusesFrame = new west.gui.Groupframe().appendToContentPane(
            '<div style="font-weight: bold; font-size: large;">' + this.language.getTranslation(202) + '</div>',
        );

        const bonuses = {
            hitBonus: this.language.getTranslation(14),
            dodgeBonus: this.language.getTranslation(51),
            resistanceBonus: this.language.getTranslation(140),
            damageBonus: this.language.getTranslation(141),
        };

        Object.entries(bonuses).forEach(([key, label]) => {
            bonusesFrame.appendToContentPane(
                $('<div></div>').append(this.getNumericInput(key, { label, isIntegerOnly: false })),
            );
        });

        leftHtmlDiv
            .append(skillsFrame.getMainDiv())
            .append(characterFrame.getMainDiv())
            .append(bonusesFrame.getMainDiv());

        const rightHtmlDiv = new west.gui.Groupframe().appendToContentPane(
            '<div style="font-weight: bold; font-size: 18px; color: darkred; margin: 6px 0">' +
                this.language.getTranslation(31) +
                '</div>' +
                '<div style="margin: 2px 0"><div style="font-weight: bold;">' +
                this.language.getTranslation(14) +
                '</div>' +
                '<div><span style="display: inline-block; width: 24px; text-align: center"><img alt="attacker_primary" src="' +
                this.config.cdn +
                '/images/fort/battle/attacker_primary.png"></span><span id="TW_Calc_BattleCalc_AttackHit">0</span></div></div>' +
                '<div style="margin: 2px 0"><div style="font-weight: bold;">' +
                this.language.getTranslation(51) +
                '</div>' +
                '<div><span style="display: inline-block; width: 24px; text-align: center"><img alt="defender_secondary" src="' +
                this.config.cdn +
                '/images/fort/battle/defender_secondary.png"></span><span id="TW_Calc_BattleCalc_AttackDodge">0</span></div></div>' +
                '<div style="margin: 2px 0"><div style="font-weight: bold;">' +
                this.language.getTranslation(140) +
                '</div>' +
                '<div><span style="display: inline-block; width: 24px; text-align: center"><img alt="resistance" src="' +
                this.config.cdn +
                '/images/fort/battle/resistance.png"></span></span><span id="TW_Calc_BattleCalc_AttackResistance">0</span> <span id="TW_Calc_BattleCalc_AttackResistanceBonus">0</span></div></div>' +
                '<div style="font-weight: bold; font-size: 18px; color: darkblue; margin: 6px 0">' +
                this.language.getTranslation(33) +
                '</div>' +
                '<div style="margin: 2px 0"><div style="font-weight: bold;">' +
                this.language.getTranslation(14) +
                '</div>' +
                '<div><span style="display: inline-block; width: 24px; text-align: center"><img alt="attacker_primary" src="' +
                this.config.cdn +
                '/images/fort/battle/attacker_primary.png"></span><span id="TW_Calc_BattleCalc_DefenseHit">0</span></div></div>' +
                '<div style="margin: 2px 0"><div style="font-weight: bold;">' +
                this.language.getTranslation(51) +
                '</div>' +
                '<div><span style="display: inline-block; width: 24px; text-align: center"><img alt="defender_secondary" src="' +
                this.config.cdn +
                '/images/fort/battle/defender_secondary.png"></span><span id="TW_Calc_BattleCalc_DefenseDodge">0</span></div></div>' +
                '<div style="margin: 2px 0"><div style="font-weight: bold;">' +
                this.language.getTranslation(140) +
                '</div>' +
                '<div><span style="display: inline-block; text-align: center; width: 24px;"><img alt="resistance" src="' +
                this.config.cdn +
                '/images/fort/battle/resistance.png"></span></span><span id="TW_Calc_BattleCalc_DefenseResistance">0</span> <span id="TW_Calc_BattleCalc_DefenseResistanceBonus">0</span></div></div>' +
                '<div style="margin-top: 12px">' +
                '<div style="margin: 2px 0"><div style="font-size: 13px; font-weight: bold">' +
                this.language.getTranslation(28) +
                ':&nbsp;<span id="TW_Calc_BattleCalc_HealthOutput">0</span></div></div>' +
                '<div style="margin: 2px 0"><div style="font-size: 13px; font-weight: bold">' +
                this.language.getTranslation(141) +
                ':&nbsp;<span id="TW_Calc_BattleCalc_DamageOutput">0</span></div></div>' +
                '</div>',
        );

        const html = $('<div id="BattleCalc"></div>');

        html.append(
            $('<div style="width: 350px; height: 355px; position: absolute; top: 10px; left: 0"></div>').append(
                new west.gui.Scrollpane().appendContent(leftHtmlDiv).getMainDiv(),
            ),
        ).append(
            $('<div style="width: 340px; height: 355px; position: absolute; top: 10px; right: 5px"></div>').append(
                new west.gui.Scrollpane().appendContent(rightHtmlDiv.getMainDiv()).getMainDiv(),
            ),
        );

        return html;
    }

    private getNumericInput(
        key: string,
        numericInputOptions: Partial<NumericInputOptions> = numericInputOptionsDefaults,
    ): JQuery {
        const input = new this.window.west.gui.Textfield();
        const options = Object.assign({ ...numericInputOptionsDefaults }, numericInputOptions) as NumericInputOptions;

        if (typeof options.label !== 'undefined') {
            input.setLabel(
                '<span style="display: inline-block; font-weight: bold; width: ' +
                    options.labelWidth +
                    'px;">' +
                    options.label +
                    '</span>',
            );
        }
        if (options.isIntegerOnly) input.onlyNumeric();

        return input
            .setWidth(options.inputWidth)
            .setValue(this.getCachedInputValue(key))
            .addKeyUpListener(
                this.onInputChange<number>(key, () => {
                    const value = Number(input.getValue().replace(/,/, '.'));
                    if ((options.isIntegerOnly && !Number.isInteger(value)) || !Number.isFinite(value)) {
                        return 0;
                    }
                    return value;
                }),
            )
            .getMainDiv();
    }

    private onInputChange<T extends string | boolean | number>(key: string, getValue: () => T) {
        return () => {
            this.errorTracker.execute(() => {
                this.setCachedInputValue(key, getValue());
                this.calculate();
            });
        };
    }

    private getCachedInputValue<T>(key: string): T {
        const cachedInput = this.getCachedInput();
        if (!cachedInput) {
            throw new Error();
        }
        if (!(key in cachedInput)) {
            throw new Error(`key "${key}" does not exist on battle calc view input!`);
        }
        return cachedInput[key];
    }

    private setCachedInputValue<T extends string | boolean | number>(key: string, value: T) {
        const cachedInput = this.getCachedInput();
        if (!(key in cachedInput)) {
            throw new Error(`key "${key}" does not exist on battle calc view input!`);
        }
        cachedInput[key] = value;
        this.storage.setObject(StorageKey.battleCalc, cachedInput);
    }
}
