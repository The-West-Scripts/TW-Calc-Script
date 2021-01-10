import { BattleCalcInput, BattleCalcWindow } from './battle-calc.types';
import { Config } from '../config/config';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { TW2WindowTranslation, TW2WindowView } from '../tw2-window/tw2-window.types';
import { WestCalcWindowTab } from '../west-calc/west-calc-window.types';

@singleton()
export class CharacterView implements TW2WindowView<WestCalcWindowTab> {
    key = WestCalcWindowTab.Character;
    title: TW2WindowTranslation = {
        type: 'translation',
        translation: 212,
    };

    constructor(
        @inject('window') private readonly window: BattleCalcWindow,
        private readonly config: Config,
        private readonly language: Language,
    ) {}

    init(): void {
        const battleCalcDiv = this.window.$('#BattleCalc');
        if (!battleCalcDiv.length) {
            return;
        }
        const { Character, Premium, CharacterSkills, BattleCalc } = this.window;

        const input: BattleCalcInput = {
            charClass: Character.charClass,
            premium: Premium.hasBonus('character'),
            level: Character.level,
            skills: {
                health: CharacterSkills.skills.health.getPointsWithBonus(),
                leadership: CharacterSkills.skills.leadership.getPointsWithBonus(),
                pitfall: CharacterSkills.skills.pitfall.getPointsWithBonus(),
                hide: CharacterSkills.skills.hide.getPointsWithBonus(),
                dodge: CharacterSkills.skills.dodge.getPointsWithBonus(),
                aim: CharacterSkills.skills.aim.getPointsWithBonus(),
            },
            mapPosition: 0,
            charTower: false,
            damage: [0, 0],
            bonus: {
                attack: 0,
                defense: 0,
                resistance: 0,
                damage: 0,
            },
        };

        const output = BattleCalc.coreCalc(input, true);

        this.window.$(`#data-attack-hit`, battleCalcDiv).text(output.attack.hit);
        this.window.$(`#data-attack-dodge`, battleCalcDiv).text(output.attack.dodge);
        this.window.$(`#data-attack-resistance`, battleCalcDiv).text(output.attack.resistance);
        this.window.$(`#data-defense-hit`, battleCalcDiv).text(output.defense.hit);
        this.window.$(`#data-defense-dodge`, battleCalcDiv).text(output.defense.dodge);
        this.window.$(`#data-defense-resistance`, battleCalcDiv).text(output.defense.resistance);
        this.window.$(`#data-health`, battleCalcDiv).text(output.health);
        this.window.$(`#data-damage`, battleCalcDiv).text(output.damage);
    }

    getMainDiv(): JQuery {
        if (!this.window.hasOwnProperty('BattleCalc') || typeof this.window['BattleCalc'] === 'undefined') {
            return $('<div>Battle calc core script is not loaded, try refreshing the game.</div>');
        }

        const html = $('<div id="BattleCalc"></div>');
        const skills = ['health', 'dodge', 'hide', 'aim', 'pitfall', 'leadership'];
        const skillsContainer = new this.window.west.gui.Groupframe();

        for (let i = 0; i < skills.length; i++) {
            const skillKey = skills[i];
            const skillName = this.window.CharacterSkills.skills[skillKey].name;
            const skillPoints = this.window.CharacterSkills.skills[skillKey].getPointsWithBonus();

            skillsContainer.appendToContentPane(`<div style="display: inline-block; width: 88px; height: 60px;">
                <img class="skillicon" src="${this.config.cdn}/images/window/skills/skillicon_${skillKey}.png" title="${skillName}" alt="${skillName}" />
                <div class="tw2gui_plusminus">
                    <span class="displayValueBonus text_green unselectable" style="display: inline-block; width: 56px;">${skillPoints}</span>                 
                </div>
            </div>`);
        }

        html.append($('<div style="margin-top: 10px; text-align: center"></div>').append(skillsContainer.getMainDiv()));

        const groupFrame = new this.window.west.gui.Groupframe();

        groupFrame.appendToContentPane(
            $(
                '<table style="width: 100%; height: 180px; font-size: 14px">' +
                    '<tr>' +
                    '<td style="width: 33%">' +
                    '<div style="font-weight: bold; font-size: 16px; color: darkred;">' +
                    this.language.getTranslation(31) +
                    '</div>' +
                    '<div style="display: inline-block; font-weight: bold; width: 50%;">' +
                    this.language.getTranslation(14) +
                    '</div><div id="data-attack-hit"></div>' +
                    '<div style="display: inline-block; font-weight: bold; width: 50%;">' +
                    this.language.getTranslation(51) +
                    '</div><div id="data-attack-dodge"></div>' +
                    '<div style="display: inline-block; font-weight: bold; width: 50%;">' +
                    this.language.getTranslation(140) +
                    '</div><div id="data-attack-resistance"></div>' +
                    '</td><td style="width: 33%">' +
                    '<div style="font-weight: bold; font-size: 16px; color: darkblue;">' +
                    this.language.getTranslation(33) +
                    '</div>' +
                    '<div style="display: inline-block; font-weight: bold; width: 50%;">' +
                    this.language.getTranslation(14) +
                    '</div><div id="data-defense-hit"></div>' +
                    '<div style="display: inline-block; font-weight: bold; width: 50%;">' +
                    this.language.getTranslation(51) +
                    '</div><div id="data-defense-dodge"></div>' +
                    '<div style="display: inline-block; font-weight: bold; width: 50%;">' +
                    this.language.getTranslation(140) +
                    '</div><div id="data-defense-resistance"></div>' +
                    '</td><td style="width: 33%">' +
                    '<div style="font-weight: bold;">' +
                    this.language.getTranslation(28) +
                    ': </div><span><span id="data-health"></span> HP</span>' +
                    '<div style="font-weight: bold;">' +
                    this.language.getTranslation(141) +
                    ': </div><span id="data-damage"></span>' +
                    '</td>' +
                    '</tr>' +
                    '</table>',
            ),
        );

        html.append(groupFrame.getMainDiv());

        return html;
    }
}
