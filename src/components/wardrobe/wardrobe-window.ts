import { ErrorTracker } from '../error-tracker/error-tracker';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { OwnCalcView } from './own-calc-view';
import { TheWestWindow } from '../../@types/the-west';
import { TW2Window } from '../tw2-window/tw2-window';
import { WardrobeView } from './wardrobe-view';
import { WardrobeWindowTab } from './wardrobe-window.types';

export class WardrobeWindow extends TW2Window<WardrobeWindowTab> {
    constructor(
        window: TheWestWindow,
        errorTracker: ErrorTracker,
        language: Language,
        logger: Logger,
        wardrobeView: WardrobeView,
        ownCalcView: OwnCalcView,
    ) {
        super('TWCalcWardrobe', errorTracker, window, language, logger, {
            title: { type: 'translation', translation: 170 },
            size: { width: 332, height: 402 },
            content: {
                marginTop: 12,
                marginBottom: 12,
                marginLeft: 4,
                marginRight: 4,
            },
        });
        this.addView(wardrobeView.getTW2WindowView());
        this.addView(ownCalcView.getTW2WindowView());
    }
}
