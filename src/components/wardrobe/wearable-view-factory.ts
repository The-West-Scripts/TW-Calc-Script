import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { TheWestWindow } from '../../@types/the-west';
import { TW2WindowTranslation, TW2WindowView } from '../tw2-window/tw2-window.types';
import { WardrobeWindowTab } from './wardrobe-window.types';
import { WearableView } from './wearable-view';
import { WearableViewConfig } from './wearable-view.types';

@singleton()
export class WearableViewFactory {
    constructor(
        @inject('window') private readonly window: TheWestWindow,
        private readonly logger: Logger,
        private readonly language: Language,
        private readonly errorTracker: ErrorTracker,
    ) {}

    getWindowView(
        key: WardrobeWindowTab,
        title: TW2WindowTranslation,
        config: WearableViewConfig,
    ): TW2WindowView<WardrobeWindowTab> {
        let wearableView: WearableView;
        return {
            key,
            title,
            init() {
                wearableView.show(true);
            },
            getMainDiv: (): JQuery => {
                wearableView = WearableView.of(config, this.window, this.logger, this.language, this.errorTracker);
                return wearableView.getMainDiv();
            },
        };
    }
}
