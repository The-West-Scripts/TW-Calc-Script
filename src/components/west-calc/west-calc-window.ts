import { BattleCalcView } from '../battle-calc/battle-calc-view';
import { CharacterView } from '../character/character-view';
import { DuelCalcView } from '../duel-calc/duel-calc-view';
import { ImporterView } from '../importer/importer-view';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { NotepadView } from '../notepad/notepad-view';
import { SettingsView } from '../settings/settings-view';
import { TheWestWindow } from '../../@types/the-west';
import { TombolaView } from '../tombola/tombola-view';
import { TW2Window } from '../tw2-window/tw2-window';
import { WestCalcWindowTab } from './west-calc-window.types';

export class WestCalcWindow extends TW2Window<WestCalcWindowTab> {
    constructor(
        window: TheWestWindow,
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
        super('TWCalcWindow', window, language, logger, { title: 'The-West Calc' });
        // add views
        this.addView(notepadView);
        this.addView(importerView);
        this.addView(characterView);
        this.addView(battleCalcView);
        this.addView(duelCalcView);
        this.addView(tombolaView);
        this.addView(settingsView);
    }

    open(tab?: WestCalcWindowTab): void {
        super.open(tab);
    }
}
