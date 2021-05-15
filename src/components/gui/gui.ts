import { BankFeesCalculator } from './bank-fees-calculator';
import { CatchErrors } from '../error-tracker/catch-errors';
import { Component } from '../component.types';
import { Craft } from '../craft/craft';
import { DuelBar } from '../duel-bar/duel-bar';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { NearestJobs } from '../nearest-jobs/nearest-jobs';
import { NearestJobsBarPosition } from '../nearest-jobs/nearest-jobs.types';
import { nearestJobsIcon } from './nearest-jobs.icon';
import { SettingBoolean, SettingNumber } from '../settings/settings.types';
import { Settings } from '../settings/settings';
import { TheWestWindow } from '../../@types/the-west';
import { twCalcIcon } from './tw-calc.icon';
import { Wardrobe } from '../wardrobe/wardrobe';
import { wardrobeIcon } from './wardrobe.icon';
import { WestCalc } from '../west-calc/west-calc';
import { XpHpEnergyCalculator } from './xp-hp-energy-calculator';

@singleton()
export class Gui implements Component {
    public readonly uiMenuContainer: JQuery;

    constructor(
        @inject('window') private window: TheWestWindow,
        private readonly settings: Settings,
        private readonly westCalc: WestCalc,
        private readonly wardrobe: Wardrobe,
        private readonly nearestJobs: NearestJobs,
        private readonly duelBar: DuelBar,
        private readonly logger: Logger,
        private readonly language: Language,
        private readonly craft: Craft,
        private readonly xpHpEnergyCalculator: XpHpEnergyCalculator,
        private readonly bankFeesCalculator: BankFeesCalculator,
        public readonly errorTracker: ErrorTracker,
    ) {
        // renamed from TWCalcButtons
        this.uiMenuContainer = this.window.$('<div class="ui_menucontainer" id="TWCalc_Buttons"></div>');
    }

    @CatchErrors('Gui.init')
    init(): void {
        this.logger.log('initializing gui...');
        this.initUiMenu();
        this.initBottomBar();
        this.initTopBar();
        this.initCraftButton();
        this.xpHpEnergyCalculator.init();
        this.bankFeesCalculator.init();
    }

    @CatchErrors('Gui.initUiMenu')
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

        if (this.settings.get(SettingNumber.NearestJobsBar) === NearestJobsBarPosition.right) {
            const nearestJobsButton = this.window
                .$(
                    `<div class="menulink" title="${this.language.getTranslation(
                        152,
                    )}" style="background-position: 0 0; background-image: url(${nearestJobsIcon});"></div>`,
                )
                .on('click', el => {
                    this.nearestJobs.list.appendTo(el);
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
                    this.wardrobe.open();
                })
                .on('mouseover', rightMenuButtonLogicMouseOver(this.window.$))
                .on('mouseout', rightMenuButtonLogicMouseOut(this.window.$));

            this.uiMenuContainer.append(wardrobeButton);
        }

        this.window.$(this.uiMenuContainer).append('<div class="menucontainer_bottom"></div>');
        this.window.$('#ui_menubar').append(this.uiMenuContainer);
    }

    @CatchErrors('Gui.initTopBar')
    private initTopBar(): void {
        const initTopBar = this.nearestJobs.isPosition('up') || this.duelBar.isPosition('up');
        if (!initTopBar) {
            return;
        }
        const { $ } = this.window;

        // remove that hanging premium thing
        setInterval(() => {
            this.window.$('.first-purchase').remove();
        }, 500);

        // put top bar lower when there is a game event
        const posTop = $('div.custom_unit_counter').length ? 58 : 44;
        const topBar = $(
            `<div id="TWCalc_TopBar" style="
                    text-align: center;                      
                    left: 50%;
                    margin-top: 10px;
                    max-width: 620px;
                    position: absolute;
                    top: ${posTop}px;
                    z-index: 19;
                    -webkit-transform: translateX(-50%);
                    -moz-transform: translateX(-50%);
                    -ms-transform: translateX(-50%);
                    -o-transform: translateX(-50%);
                    transform: translateX(-50%);"></div>`,
        );
        // append to user interface
        this.window.$('#user-interface').append(topBar);

        if (this.nearestJobs.isPosition('up')) {
            this.logger.log('add the nearest jobs bar up');
            const nearestJobsDiv = this.window.$('<div></div>');
            this.window.$(topBar).append(nearestJobsDiv);
            this.nearestJobs.bar.appendTo(nearestJobsDiv);
        }

        if (this.duelBar.isPosition('up')) {
            this.logger.log('add duel bar up');
            const duelBarDiv = this.window.$('<div></div>');
            this.window.$(topBar).append(duelBarDiv);
            this.duelBar.appendTo(duelBarDiv);
        }
    }

    @CatchErrors('Gui.initBottomBar')
    private initBottomBar() {
        const initBottomBar = this.nearestJobs.isPosition('down') || this.duelBar.isPosition('down');
        if (!initBottomBar) {
            return;
        }

        const bottomBar = $(
            `<div id="TWCalc_BottomBar" style="
                    left: 50%;
                    -webkit-transform: translateX(-50%);
                    -moz-transform: translateX(-50%);
                    -ms-transform: translateX(-50%);
                    -o-transform: translateX(-50%);
                    transform: translateX(-50%);
                    text-align: center;
                    max-width: 620px;
                    position: absolute;
                    bottom: 97px;"></div>`,
        );
        // append to bottom bar
        this.window.$('#ui_bottombar').append(bottomBar);

        setInterval(() => {
            // stop animation if there is any
            this.window.$(bottomBar).stop();
            // start the new animation
            this.window.$(bottomBar).animate({ bottom: getBottomBarPositionY(this.window) }, 500);
        }, 500);

        if (this.duelBar.isPosition('down')) {
            this.logger.log('add duel bar up');
            const duelBarDiv = this.window.$('<div></div>');
            this.window.$(bottomBar).append(duelBarDiv);
            this.duelBar.appendTo(duelBarDiv);
        }

        if (this.nearestJobs.isPosition('down')) {
            this.logger.log('add the nearest jobs bar down');
            const nearestJobsDiv = this.window.$('<div></div>');
            this.window.$(bottomBar).append(nearestJobsDiv);
            this.nearestJobs.bar.appendTo(nearestJobsDiv);
        }
    }

    @CatchErrors('Gui.initCraftButton')
    private initCraftButton(): void {
        const hasProfession = this.window.Character.professionId != null;

        if (this.settings.get(SettingBoolean.MenuCraftButton) && hasProfession) {
            this.window
                .$('.button.crafting.background')
                .off('click')
                .on('click', () => {
                    this.craft.open();
                });
        }
    }
}

function getBottomBarPositionY(window: TheWestWindow) {
    let posY = (window.$('#ui_bottombar').height() || 0) + 5 + 14 + (window.$('.friendsbar').height() || 0);
    // windows tabs are not opened
    if ($('#ui_windowdock').css('display') == 'none' || $('.windowbar_frames').html() == '') {
        posY += 15;
    } else {
        posY += 47;
    }
    return posY;
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
