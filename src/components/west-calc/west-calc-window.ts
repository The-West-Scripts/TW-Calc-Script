import { BattleCalcView } from '../battle-calc/battle-calc-view';
import { CharacterView } from '../battle-calc/character-view';
import { DuelCalcView } from '../duel-calc/duel-calc-view';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { ImporterView } from '../importer/importer-view';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { NotepadView } from '../notepad/notepad-view';
import { SettingBoolean, SettingNumber } from '../settings/settings.types';
import { SettingsView } from '../settings/settings-view';
import { TheWestWindow } from '../../@types/the-west';
import { TombolaView } from '../tombola/tombola-view';
import { TW2Window } from '../tw2-window/tw2-window';
import { TW2WindowOpenOptions } from '../tw2-window/tw2-window.types';
import { WestCalcWindowTab } from './west-calc-window.types';

export class WestCalcWindow extends TW2Window<WestCalcWindowTab> {
    constructor(
        window: TheWestWindow,
        errorTracker: ErrorTracker,
        language: Language,
        logger: Logger,
        notepadView: NotepadView,
        importerView: ImporterView,
        characterView: CharacterView,
        battleCalcView: BattleCalcView,
        duelCalcView: DuelCalcView,
        tombolaView: TombolaView,
        settingsView: SettingsView,
    ) {
        // renamed from "TWCalc_window"
        super('TWCalcWindow', errorTracker, window, language, logger, { title: 'The-West Calc' });
        // add views
        this.addView(notepadView);
        this.addView(importerView);
        this.addView(characterView);
        this.addView(battleCalcView);
        this.addView(duelCalcView);
        this.addView(tombolaView);
        this.addView(settingsView);
    }

    open(options?: Partial<TW2WindowOpenOptions<WestCalcWindowTab>>): void {
        super.open(options);
    }

    openSettings(highlight?: SettingBoolean | SettingNumber): void {
        this.open({ tab: WestCalcWindowTab.Settings });

        if (highlight) {
            setTimeout(() => {
                this.getMainDiv()
                    .find('#TWCalc_Settings_' + highlight)
                    .css({
                        'background-color': 'rgb(255 255 0 / 0.5)',
                        'font-weight': 'bold',
                    });
            });
        }
    }
}
