import { BattleCalcView } from '../battle-calc/battle-calc-view';
import { CharacterView } from '../battle-calc/character-view';
import { DuelCalcView } from '../duel-calc/duel-calc-view';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { ImporterView } from '../importer/importer-view';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { NotepadView } from '../notepad/notepad-view';
import { SettingsView } from '../settings/settings-view';
import { TheWestWindow } from '../../@types/the-west';
import { TombolaView } from '../tombola/tombola-view';
import { WestCalcWindow } from './west-calc-window';

@singleton()
export class WestCalc {
    public readonly window: WestCalcWindow;

    constructor(
        @inject('window') window: TheWestWindow,
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
        this.window = new WestCalcWindow(
            window,
            errorTracker,
            language,
            logger,
            notepadView,
            importerView,
            characterView,
            battleCalcView,
            duelCalcView,
            tombolaView,
            settingsView,
        );
    }
}
