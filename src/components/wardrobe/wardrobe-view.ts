import { CatchErrors } from '../error-tracker/catch-errors';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { Storage } from '../storage/storage';
import { StorageKey } from '../storage/storage.types';
import { TheWestWindow } from '../../@types/the-west';
import { TW2WindowView } from '../tw2-window/tw2-window.types';
import { WardrobeWearable } from './wardrobe-view.types';
import { WardrobeWindowTab } from './wardrobe-window.types';
import { WearableConfig } from './wearable-view.types';
import { WearableViewFactory } from './wearable-view-factory';

@singleton()
export class WardrobeView {
    constructor(
        @inject('window') private readonly window: TheWestWindow,
        private readonly wardrobeViewFactory: WearableViewFactory,
        private readonly storage: Storage,
        private readonly language: Language,
        private readonly logger: Logger,
        public readonly errorTracker: ErrorTracker,
    ) {
        this.errorTracker.execute(() => {
            // convert old wardrobe structure, to the new one
            if (this.storage.has(StorageKey.wardrobe)) {
                const object = this.storage.getObject(StorageKey.wardrobe);
                // we need to convert to new structure when any item is array
                // in new structure wardrobe is array of objects
                if (Array.isArray(object) && object.length > 0 && Array.isArray(object[0])) {
                    const newWardrobe: Array<WardrobeWearable> = object.map((obj, i) => {
                        const items = [];
                        // on first indexes are item ids, last index is name
                        for (let i = 0; i < obj.length - 1; i++) {
                            if (obj[i]) {
                                items.push(obj[i]);
                            }
                        }
                        return { id: i, items, name: obj[obj.length - 1] };
                    });
                    this.storage.setObject<Array<WardrobeWearable>>(StorageKey.wardrobe, newWardrobe);
                }
            }
        });
    }

    @CatchErrors('WardrobeView.addWear')
    private addWardrobeWearable(name: string): WardrobeWearable {
        const { Wear, MessageSuccess } = this.window;
        const items = Object.values(Wear.wear).map(item => {
            return item.obj.item_id;
        });
        const wearable: WardrobeWearable = {
            id: Date.now(),
            name: name,
            items,
        };
        const list = this.getList();
        list.push(wearable);
        this.storage.setObject<Array<WearableConfig>>(StorageKey.wardrobe, list);
        this.logger.log('set wardrobe to', list);
        MessageSuccess(this.language.getTranslation(165)).show();
        return wearable;
    }

    getTW2WindowView(): TW2WindowView<WardrobeWindowTab> {
        return this.wardrobeViewFactory.getWindowView(
            WardrobeWindowTab.Wardrobe,
            {
                type: 'translation',
                translation: 170,
            },
            {
                add: (callback: (id: number) => void): void => {
                    new this.window.west.gui.TextInputDialog()
                        .setTitle(this.language.getTranslation(161))
                        .setText(this.language.getTranslation(164))
                        .setPlaceholder(this.language.getTranslation(166))
                        .addButton(this.language.getTranslation(163), value => {
                            const wearable = this.addWardrobeWearable(value);
                            callback(wearable.id);
                        })
                        .addButton(this.language.getTranslation(162))
                        .show();
                },
                list: () => {
                    return this.getList().map(({ id, name }) => ({ id, name }));
                },
                remove: (id: number) => {
                    const newList = this.getList().filter(obj => obj.id !== id);
                    this.setList(newList);
                },
                show: (id: number) => {
                    const list = this.getList();
                    const obj = list.find(obj => obj.id === id);
                    if (!obj) {
                        return null;
                    }
                    return {
                        id: id,
                        name: obj.name,
                        items: obj.items,
                    };
                },
            },
        );
    }

    private setList(list: Array<WardrobeWearable>): void {
        this.storage.setObject<Array<WardrobeWearable>>(StorageKey.wardrobe, list);
    }

    private getList(): Array<WardrobeWearable> {
        return this.storage.getObject<Array<WardrobeWearable>>(StorageKey.wardrobe, []);
    }
}
