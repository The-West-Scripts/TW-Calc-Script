import { CatchErrors } from '../error-tracker/catch-errors';
import { Component } from '../component.types';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, registry, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { SettingBoolean } from '../settings/settings.types';
import { Settings } from '../settings/settings';
import { TheWestWindow } from '../../@types/the-west';

@singleton()
@registry([
    {
        token: 'timeout',
        useValue: 1000,
    },
])
export class XpHpEnergyCalculator implements Component {
    private interval: number | undefined;

    constructor(
        @inject('window') private readonly window: TheWestWindow,
        private readonly language: Language,
        @inject('timeout') private readonly timeout: number,
        private readonly settings: Settings,
        private readonly logger: Logger,
        public readonly errorTracker: ErrorTracker,
    ) {}

    @CatchErrors<XpHpEnergyCalculator>({
        component: 'XpHpEnergyCalc.inject',
        callback: object => {
            object.window.clearInterval(object.interval);
        },
    })
    private inject(): void {
        const characterExperience = this.window.Character.getExperience4Level();
        const characterMaxExperience = this.window.Character.getMaxExperience4Level();
        const nextLevelExperience = characterExperience - characterMaxExperience;
        const uiExperienceBar = this.window.$('#ui_experience_bar');

        if (!isNaN(nextLevelExperience) && Number(uiExperienceBar.data('experience')) !== characterExperience) {
            this.logger.log('updating xp indicator...');
            uiExperienceBar.data('experience', characterExperience);
            uiExperienceBar.addMousePopup(
                this.language.getTranslation(103) +
                    ':' +
                    ' ' +
                    characterExperience +
                    ' / ' +
                    characterMaxExperience +
                    ' (' +
                    nextLevelExperience +
                    ')',
            );
        }

        const characterHealth = this.window.Character.health;
        const characterMaxHealth = this.window.Character.maxHealth;
        const healthPointsGain =
            (this.window.Character.maxHealth - characterHealth) /
            (this.window.Character.healthRegen * characterMaxHealth);
        const healthPointsGainHour = Math.floor(healthPointsGain);
        const healthPointsGainMinute = Math.floor((healthPointsGain - healthPointsGainHour) * 60);
        const healthPointsDifference = characterHealth - characterMaxHealth;

        const uiHealthBar = $('#ui_character_container > .health_bar');

        if (Number(uiHealthBar.data('health')) !== characterHealth) {
            this.logger.log('updating health indicator...');
            uiHealthBar.data('health', characterHealth);
            uiHealthBar
                .text(
                    characterHealth +
                        ' / ' +
                        characterMaxHealth +
                        (healthPointsDifference < 0 ? ' (' + healthPointsDifference + ')' : ''),
                )
                .addMousePopup(
                    this.language.getTranslation(98) +
                        ': ' +
                        characterHealth +
                        ' / ' +
                        characterMaxHealth +
                        (healthPointsDifference < 0
                            ? ' (' +
                              healthPointsDifference +
                              ')</br>' +
                              this.language.getTranslation(104) +
                              ' ' +
                              healthPointsGainHour +
                              ' ' +
                              this.language.getTranslation(101) +
                              ' ' +
                              healthPointsGainMinute +
                              ' ' +
                              this.language.getTranslation(102)
                            : ''),
                );
        }

        const characterEnergy = this.window.Character.energy;
        const characterMaxEnergy = this.window.Character.maxEnergy;
        const energyGain =
            (characterMaxEnergy - characterEnergy) / (this.window.Character.energyRegen * characterMaxEnergy);
        const energyGainHour = Math.floor(energyGain);
        const energyGainMinute = Math.floor((energyGain - energyGainHour) * 60);
        const energyDifference = characterEnergy - characterMaxEnergy;

        const uiEnergyBar = this.window.$('#ui_character_container > .energy_bar');

        if (Number(uiEnergyBar.data('energy')) !== characterEnergy) {
            this.logger.log('updating energy indicator...');
            uiEnergyBar.data('energy', characterEnergy);
            uiEnergyBar
                .text(
                    characterEnergy +
                        ' / ' +
                        characterMaxEnergy +
                        (energyDifference < 0 ? ' (' + energyDifference + ')' : ''),
                )
                .addMousePopup(
                    this.language.getTranslation(200) +
                        ': ' +
                        characterEnergy +
                        ' / ' +
                        characterMaxEnergy +
                        (energyDifference < 0
                            ? ' (' +
                              energyDifference +
                              ')</br>' +
                              this.language.getTranslation(100) +
                              ': ' +
                              energyGainHour +
                              ' ' +
                              this.language.getTranslation(101) +
                              ' ' +
                              energyGainMinute +
                              ' ' +
                              this.language.getTranslation(102)
                            : ''),
                );
        }
    }

    init(): any {
        if (this.settings.get(SettingBoolean.XpHpEnergyCalc)) {
            this.logger.log('initializing xp, hp and energy ui indicator...');
            this.interval = this.window.setInterval(this.inject.bind(this), this.timeout);
        }
    }
}
