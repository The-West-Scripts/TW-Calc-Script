import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { SettingsView } from '../settings/settings-view';
import { TheWestWindow } from '../../@types/the-west';
import { TW2Window } from '../tw2-window/tw2-window';
import { WestCalcWindowTab } from './west-calc-window.types';

export class WestCalcWindow extends TW2Window<WestCalcWindowTab> {
    constructor(window: TheWestWindow, language: Language, logger: Logger, settingsView: SettingsView) {
        // renamed from "TWCalc_window"
        super('TWCalcWindow', window, language, logger, { title: 'The-West Calc' });
        // add views
        this.addView(settingsView);
    }

    open(tab?: WestCalcWindowTab): void {
        super.open(tab);
    }
}
