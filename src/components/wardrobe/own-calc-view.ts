import { ErrorTracker } from '../error-tracker/error-tracker';
import { singleton } from 'tsyringe';
import { TW2WindowView } from '../tw2-window/tw2-window.types';
import { WardrobeWindowTab } from './wardrobe-window.types';
import { Wearable, WearableConfig } from './wearable-view.types';
import { WearableViewFactory } from './wearable-view-factory';

@singleton()
export class OwnCalcView {
    constructor(
        private readonly wardrobeViewFactory: WearableViewFactory,
        public readonly errorTracker: ErrorTracker,
    ) {}

    init(): void {}

    getTW2WindowView(): TW2WindowView<WardrobeWindowTab> {
        return this.wardrobeViewFactory.getWindowView(
            WardrobeWindowTab.OwnCalc,
            {
                type: 'translation',
                translation: 160,
            },
            {
                add(): number | undefined {
                    return undefined;
                },
                list(): Array<Wearable> {
                    return [];
                },
                remove(): void {},
                show(id: number): WearableConfig {
                    return {
                        id: id,
                        name: '',
                        items: [],
                    };
                },
            },
        );
    }
}
