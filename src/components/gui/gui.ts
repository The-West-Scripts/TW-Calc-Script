import { Component } from '../component.types';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { nearestJobsIcon } from './nearest-jobs.icon';
import { NearestJobsList } from '../nearest-jobs/nearest-jobs-list';
import { SettingBoolean, SettingNumber } from '../settings/settings.types';
import { Settings } from '../settings/settings';
import { TheWestWindow } from '../../@types/the-west';
import { twCalcIcon } from './tw-calc.icon';
import { Wardrobe } from '../wardrobe/wardrobe';
import { wardrobeIcon } from './wardrobe.icon';
import { WestCalc } from '../west-calc/west-calc';

@singleton()
export class Gui implements Component {
    public readonly uiMenuContainer: JQuery;

    constructor(
        @inject('window') private window: TheWestWindow,
        private settings: Settings,
        private westCalc: WestCalc,
        private wardrobe: Wardrobe,
        private nearestJobsList: NearestJobsList,
        private logger: Logger,
        private language: Language,
    ) {
        // renamed from TWCalcButtons
        this.uiMenuContainer = this.window.$('<div class="ui_menucontainer" id="TWCalc_Buttons"></div>');
    }

    init(): void {
        this.logger.log('initializing gui...');
        this.initUiMenu();
    }

    private initUiMenu() {
        if (this.settings.get(SettingBoolean.WestCalc)) {
            const westCalcButton = this.window
                .$(
                    `<div class="menulink" title="The-West Calc" style="background-position: 0 0; background-image: url(${twCalcIcon});"></div>`,
                )
                .on('click', () => {
                    this.westCalc.window.open();
                })
                .on('mouseover', rightMenuButtonLogicMouseOver(this.window.$))
                .on('mouseout', rightMenuButtonLogicMouseOut(this.window.$));

            this.uiMenuContainer.append(westCalcButton);
        }

        if (this.settings.get(SettingNumber.NearestJobsBar) === 3) {
            const nearestJobsButton = this.window
                .$(
                    `<div class="menulink" title="${this.language.getTranslation(
                        152,
                    )}" style="background-position: 0 0; background-image: url(${nearestJobsIcon});"></div>`,
                )
                .on('click', () => {
                    this.nearestJobsList.open();
                })
                .on('mouseover', rightMenuButtonLogicMouseOver(this.window.$))
                .on('mouseout', rightMenuButtonLogicMouseOut(this.window.$));

            this.uiMenuContainer.append(nearestJobsButton);
        }

        if (this.settings.get(SettingBoolean.Wardrobe)) {
            const wardrobeButton = this.window
                .$(
                    `<div class="menulink" title="${this.language.getTranslation(
                        170,
                    )}" style="background-position: 0 0; background-image: url(${wardrobeIcon});"></div>`,
                )
                .on('click', () => {
                    this.wardrobe.window.open();
                })
                .on('mouseover', rightMenuButtonLogicMouseOver(this.window.$))
                .on('mouseout', rightMenuButtonLogicMouseOut(this.window.$));

            this.uiMenuContainer.append(wardrobeButton);
        }

        this.window.$(this.uiMenuContainer).append('<div class="menucontainer_bottom"></div>');
        this.window.$('#ui_menubar').append(this.uiMenuContainer);
    }
}

function rightMenuButtonLogicMouseOver($: JQueryStatic) {
    return function (this: HTMLElement) {
        $(this).css('background-position', '-25px 0');
    };
}

function rightMenuButtonLogicMouseOut($: JQueryStatic) {
    return function (this: HTMLElement) {
        $(this).css('background-position', '0 0');
    };
}
