import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { TheWestWindow } from '../../@types/the-west';
import { TW2Window } from '../tw2-window/tw2-window';

export class ErrorLogWindow extends TW2Window {
    constructor(window: TheWestWindow, language: Language, logger: Logger) {
        super('TWCalcErrorLog', window, language, logger, { title: 'TW-Calc Error Log' });
    }

    open(): void {
        super.open();
    }
}
