import { inject, injectable } from 'tsyringe';
import { TheWestWindow } from '../../@types/the-west';
import { TW2Window } from '../tw2-window/tw2-window';
import { WestCalcWindowTab, WestCalcWindowTabOption } from './west-calc-window.types';

@injectable()
export class WestCalcWindow extends TW2Window {
    private readonly tabs: Partial<Record<WestCalcWindowTab, WestCalcWindowTabOption>> = {};

    constructor(@inject('window') window: TheWestWindow) {
        // renamed from "TWCalc_window"
        super('TWCalcWindow', window, { title: 'The-West Calc' });
    }

    open(tab?: WestCalcWindowTab): void {
        Object.keys(this.tabs).forEach(tabKey => {
            this.getTabMainDiv(tabKey as WestCalcWindowTab).remove();
        });

        if (tab) {
            this.setTab(tab);
        }
    }

    public getMainDiv(): JQuery {
        return this.window.$('.TWCalc_window');
    }

    public getTabMainDiv(name: WestCalcWindowTab): JQuery {
        return this.window.$(`#tab_${name} > div`, this.getMainDiv());
    }

    public setTab(tab: WestCalcWindowTab): void {
        // also make display block
        const tabOptions = this.tabs[tab];
        if (typeof tabOptions !== 'undefined') {
            tabOptions.open();
        } else {
            throw new Error(`Tab "${tab}" does not exist!`);
        }
    }

    public addTab(tab: WestCalcWindowTab, option: WestCalcWindowTabOption): void {
        this.tabs[tab] = option;
    }
}
