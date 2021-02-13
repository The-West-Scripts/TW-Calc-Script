import { CatchErrors } from '../error-tracker/catch-errors';
import { CraftService, craftTranslations } from './craft-service';
import { CraftViewFactory } from './craft-view-factory';
import { CraftWindowTab, CraftWindowTabInitOptions } from './craft-window.types';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { TheWestWindow } from '../../@types/the-west';
import { TW2Window } from '../tw2-window/tw2-window';
import { TW2WindowOpenOptions } from '../tw2-window/tw2-window.types';

export class CraftWindow extends TW2Window<CraftWindowTab, CraftWindowTabInitOptions> {
    constructor(
        readonly window: TheWestWindow,
        language: Language,
        logger: Logger,
        private readonly craftViewFactory: CraftViewFactory,
        private readonly craftService: CraftService,
        public readonly errorTracker: ErrorTracker,
    ) {
        super('TWCalcCraft', errorTracker, window, language, logger, {
            title: { type: 'translation', translation: 183 },
        });

        for (let i = 1; i <= 4; i++) {
            this.addView(
                this.craftViewFactory.getWindowView(i, { type: 'translation', translation: craftTranslations[i] }),
            );
        }
    }

    @CatchErrors('CraftWindow.open')
    open(options?: Partial<TW2WindowOpenOptions<CraftWindowTab, CraftWindowTabInitOptions>>): void {
        super.open(options);
        // update last crafted recipes, since we do it only on script init
        this.craftService.update();
    }
}
