import { Component } from '../component.types';
import { inject, singleton } from 'tsyringe';
import { Logger } from '../logger/logger';
import { SettingBoolean } from '../settings/settings.types';
import { Settings } from '../settings/settings';
import { TheWestWindow } from '../../@types/the-west';
import { twCalcIcon } from './tw-calc.icon';
import { WestCalcWindow } from '../west-calc-window/west-calc-window';

@singleton()
export class Gui implements Component {
    public readonly uiMenuContainer: JQuery;

    constructor(
        @inject('window') private window: TheWestWindow,
        private settings: Settings,
        private westCalcWindow: WestCalcWindow,
        private logger: Logger,
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
                    `<div class="menulink" title="The-West Calc" style="background-position: 0 0; background-image: url(${twCalcIcon});""></div>`,
                )
                .on('click', () => {
                    this.westCalcWindow.open();
                })
                .on('mouseover', rightMenuButtonLogicMouseOver(this.window.$))
                .on('mouseout', rightMenuButtonLogicMouseOut(this.window.$));

            this.uiMenuContainer.append(westCalcButton);
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
