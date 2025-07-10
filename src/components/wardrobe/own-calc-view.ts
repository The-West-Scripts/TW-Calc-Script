import { CatchErrors } from '../error-tracker/catch-errors';
import { CharacterSkills, SkillKey, TheWestWindow, WearSlotKey } from '../../@types/the-west';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { getViewName } from './wearable-view';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { OwnCalcWearable, OwnCalcWearableV1 } from './own-calc-view.types';
import { Storage } from '../storage/storage';
import { StorageKey } from '../storage/storage.types';
import { TW2WindowView } from '../tw2-window/tw2-window.types';
import { WardrobeWindowTab } from './wardrobe-window.types';
import { WearableViewFactory } from './wearable-view-factory';
import ClickEvent = JQuery.ClickEvent;

@singleton()
export class OwnCalcView {
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
            if (this.storage.has(StorageKey.ownCalc)) {
                const object = this.storage.getObject<Array<OwnCalcWearable> | Array<OwnCalcWearableV1>>(
                    StorageKey.ownCalc,
                );
                // we need to convert to new structure when, there is no config property
                if (isWearableV1(object)) {
                    const newOwnCalc: Array<OwnCalcWearable> = object.map((obj, i) => {
                        const { name, ...config } = obj;
                        return { id: i, name, config };
                    });
                    this.storage.setObject<Array<OwnCalcWearable>>(StorageKey.ownCalc, newOwnCalc);
                }
            }
        });
    }

    @CatchErrors('OwnCalcView.showAddOwnCalcDialog')
    private showAddOwnCalcDialog(callback: (id: number) => void): void {
        const { west, CharacterSkills } = this.window;
        const config = getSkillsConfig(CharacterSkills);

        const input = new west.gui.Textfield().setWidth(440).setPlaceholder(this.language.getTranslation(157));

        const dialog = new west.gui.Dialog(this.language.getTranslation(172))
            .setWidth(462)
            .setHeight(324)
            .addButton(this.language.getTranslation(36), () => {
                const wearable = this.addOwnCalcWearable(input.getValue(), config);
                callback(wearable.id);
            })
            .addButton(this.language.getTranslation(92))
            .show();

        const content = dialog.divMain.find('.tw2gui_dialog_content > .tw2gui_dialog_text');

        content.append(this.getSkillsFrame(config, true));
        content.append(input.getMainDiv());
    }

    @CatchErrors('OwnCalcView.showOwnCalcConfigDialog')
    private showOwnCalcConfigDialog(wearable: OwnCalcWearable): void {
        const { west } = this.window;
        const dialog = new west.gui.Dialog(getViewName(wearable.name))
            .setWidth(462)
            .setHeight(294)
            .addButton(this.language.getTranslation(162))
            .show();

        dialog.divMain
            .find('.tw2gui_dialog_content > .tw2gui_dialog_text')
            .append(this.getSkillsFrame(wearable.config, false));
    }

    @CatchErrors('OwnCalcView.addOwnCalcWearable')
    private addOwnCalcWearable(name: string, config: Record<SkillKey, number>): OwnCalcWearable {
        const { MessageSuccess } = this.window;
        const wearable: OwnCalcWearable = {
            id: Date.now(),
            name: name,
            config,
        };
        const list = this.getList();
        list.push(wearable);
        this.storage.setObject<Array<OwnCalcWearable>>(StorageKey.ownCalc, list);
        this.logger.log('set own calc to', list);
        MessageSuccess(this.language.getTranslation(165)).show();
        return wearable;
    }

    /**
     * Creates a skill frame, object from defaults will be mutated.
     * @param defaults
     * @param configurable
     * @private
     */
    @CatchErrors('OwnCalcView.getSkillsFrame')
    private getSkillsFrame(defaults: Record<SkillKey, number>, configurable: boolean) {
        const { $, west, CharacterSkills } = this.window;
        const skillsFrame = $(
            '<div style="width: 432px; margin-left: auto; margin-right: auto; text-align: center;"></div>',
        );
        CharacterSkills.allSkillKeys.forEach(skillKey => {
            const startValue = defaults[skillKey];
            const maxValue = configurable ? Infinity : defaults[skillKey];
            const minValue = configurable ? 0 : defaults[skillKey];
            // callback when plus/minus button is clicked
            const callbackPlusMinus = (event: ClickEvent) => {
                const displayValue = $(event.currentTarget).parent().find('.displayValue');
                let value = defaults[skillKey];
                if ($(event.currentTarget).hasClass('butPlus')) {
                    value = Math.min(maxValue, value + 1);
                } else if ($(event.currentTarget).hasClass('butMinus')) {
                    value = Math.max(0, value - 1);
                }
                $(displayValue).val(value.toString());
                defaults[skillKey] = value;
            };
            // skillBox
            const skillBox = CharacterSkills.getSkill(skillKey).getSkillPMBox(
                'TWCalc_Wardrobe_' + skillKey,
                {},
                {
                    id: 'TWCalc_Wardrobe_' + skillKey,
                    min_value: minValue,
                    start_value: startValue,
                    max_value: maxValue,
                    extra_points: 0,
                    callbackPlus: (event: ClickEvent) => callbackPlusMinus(event),
                    callbackMinus: (event: ClickEvent) => callbackPlusMinus(event),
                },
            );
            skillsFrame.append(skillBox);
        });
        return new west.gui.Groupframe().appendToContentPane(skillsFrame).getMainDiv();
    }

    @CatchErrors('OwnCalcView.getBestItems')
    private getBestItems(wearable: OwnCalcWearable): Array<number> {
        // this is a copy-paste logic from the game (Bag.searchBest)
        const { west, Bag, Wear, ItemManager } = this.window;
        const bestSet = west.item.Calculator.getBestSet(wearable.config);
        const bestSetItems = (bestSet && bestSet.getItems()) || [];
        const bestSetItemsByType: Partial<Record<WearSlotKey, number>> = {};
        bestSetItems.forEach(itemId => {
            bestSetItemsByType[ItemManager.get(itemId).type] = itemId;
        });
        const inventoryItems = Bag.getItemsByItemIds(bestSetItems);
        const result: Partial<Record<WearSlotKey, number>> = {};

        // find best items
        for (let i = 0; i < inventoryItems.length; i++) {
            const inventoryItem = inventoryItems[i];
            const slotType = inventoryItem.getType();
            const wearItem = Wear.get(slotType);
            if (
                !wearItem ||
                (wearItem &&
                    (wearItem.getItemBaseId() !== inventoryItem.getItemBaseId() ||
                        wearItem.getItemLevel() < inventoryItem.getItemLevel()))
            ) {
                result[slotType] = inventoryItem.getId();
            } else {
                result[slotType] = wearItem.getId();
            }
        }

        // if already worn, add items from current wear
        Wear.slots.forEach(slotType => {
            if (result.hasOwnProperty(slotType)) {
                return;
            }
            if (Wear.wear.hasOwnProperty(slotType)) {
                result[slotType] = Wear.wear[slotType].obj.item_id;
            } else if (bestSetItemsByType.hasOwnProperty(slotType)) {
                result[slotType] = bestSetItemsByType[slotType];
            }
        });

        return Object.values(result as Record<WearSlotKey, number>);
    }

    getTW2WindowView(): TW2WindowView<WardrobeWindowTab> {
        return this.wardrobeViewFactory.getWindowView(
            WardrobeWindowTab.OwnCalc,
            {
                type: 'translation',
                translation: 160,
            },
            {
                add: (callback: (id: number) => void) => this.showAddOwnCalcDialog(callback),
                list: () => {
                    return this.getList().map(({ id, name }) => ({ id, name }));
                },
                remove: (id: number) => {
                    const newList = this.getList().filter(obj => obj.id !== id);
                    this.setList(newList);
                },
                show: (id: number, actions: JQuery) => {
                    const list = this.getList();

                    const wearable = list.find(obj => obj.id === id);
                    if (!wearable) {
                        return null;
                    }

                    actions.append(
                        $(
                            '<div style="' +
                                'background: url(/images/tw2gui/iconset.png) repeat -32px 80px;' +
                                'width: 16px;' +
                                'height: 16px;' +
                                'display: inline-block;' +
                                'cursor: pointer;' +
                                'margin-right: 8px"></div>',
                        )
                            .attr('title', this.language.getTranslation(169))
                            .on('click', () => this.showOwnCalcConfigDialog(wearable)),
                    );

                    this.logger.log('show own calc wearable id = ' + wearable.id, wearable);

                    return {
                        id: id,
                        name: wearable.name,
                        items: this.getBestItems(wearable),
                    };
                },
            },
        );
    }

    private setList(list: Array<OwnCalcWearable>): void {
        this.storage.setObject<Array<OwnCalcWearable>>(StorageKey.ownCalc, list);
    }

    private getList(): Array<OwnCalcWearable> {
        return this.storage.getObject<Array<OwnCalcWearable>>(StorageKey.ownCalc, []);
    }
}

function isWearableV1(obj: Array<OwnCalcWearable> | Array<OwnCalcWearableV1>): obj is Array<OwnCalcWearableV1> {
    return Array.isArray(obj) && obj.length > 0 && !obj[0].hasOwnProperty('id');
}

function getSkillsConfig(characterSkills: CharacterSkills): Record<SkillKey, number> {
    const obj: Partial<Record<SkillKey, number>> = {};
    characterSkills.allSkillKeys.forEach(key => {
        obj[key] = 0;
    });
    return obj as Record<SkillKey, number>;
}
