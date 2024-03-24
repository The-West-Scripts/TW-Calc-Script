import { ErrorTracker } from '../error-tracker/error-tracker';
import { Language } from '../language/language';
import { TheWestWindow } from '../../@types/the-west';
import { TW2WindowFactoryView } from '../tw2-window/tw2-window.types';
import { WearableConfig, WearableViewConfig } from './wearable-view.types';
import ClickEvent = JQuery.ClickEvent;
import { CatchErrors } from '../error-tracker/catch-errors';
import { Logger } from '../logger/logger';

interface WearableDOM {
    config: WearableConfig;
    itemsDOM: Array<JQuery>;
}

export class WearableView implements TW2WindowFactoryView {
    private readonly container: JQuery;
    private readonly content: JQuery;
    private readonly caption: JQuery;
    private readonly headerLeft: JQuery;
    private readonly iconShowList: JQuery;
    private readonly actions: JQuery;

    private wearable: WearableDOM | undefined;

    constructor(
        private readonly config: WearableViewConfig,
        private readonly window: TheWestWindow,
        private readonly logger: Logger,
        private readonly language: Language,
        public readonly errorTracker: ErrorTracker,
    ) {
        const { $ } = this.window;

        this.content = this.window.$('<div></div>');
        this.actions = $('<div style="display: flex; align-items: center; margin-left: -2px;"></div>');
        this.caption = $(
            '<div style="font-size: 16px; font-family: Georgia, \'Times New Roman\', serif; text-shadow: 1px 1px 0 #FFCC66, 1px 1px 2px #000000; text-transform: capitalize;"></div>',
        );

        const iconRemove = $(`<div style="
                background: url(/images/tw2gui/iconset.png) repeat -48px 0px;
                width: 16px;
                height: 16px;
                display: inline-block;
                cursor: pointer;
                margin-right: 8px;"></div>`)
            .attr('title', this.language.getTranslation(171))
            .on('click', () => this.remove());

        this.iconShowList = $(`<div style="
                width: 24px;
                height: 18px;
                cursor: pointer;
                background: url(/images/window/character/title_editbtn.jpg) no-repeat -2px -1px;
                border: 1px solid;
                margin: 0 2px;
                display: inline-block"></div>`).on('click', (e: ClickEvent) => this.bindSelectBox(e));

        const iconAdd = $(`<div style="
            background: url(/images/tw2gui/iconset.png) repeat -16px 80px;
            width: 16px;
            height: 16px;
            display: inline-block;
            cursor: pointer;
            margin: 2px 4px;"></div>`)
            .attr('title', this.language.getTranslation(161))
            .on('click', () => this.add());

        this.headerLeft = $(
            '<div style="display: flex; flex-direction: row; justify-content: center; align-items: center;"></div>',
        )
            .append(iconRemove)
            .append(this.actions)
            .append(this.caption);

        const headerRight = $(
            '<div style="display: flex; flex-direction: row; justify-content: center; align-items: center;"></div>',
        )
            .append(iconAdd)
            .append(this.iconShowList);

        const header = $(
            '<div style="display: flex; justify-content: space-between; height: 32px; align-items: center; margin: 0 6px;"></div>',
        )
            .append(this.headerLeft)
            .append(headerRight);

        this.container = $('<div></div>').append(header).append(this.content);
    }

    static of(
        config: WearableViewConfig,
        window: TheWestWindow,
        logger: Logger,
        language: Language,
        errorTracker: ErrorTracker,
    ): WearableView {
        return new WearableView(config, window, logger, language, errorTracker);
    }

    @CatchErrors('WearableView.add()')
    private add() {
        this.config.add(id => this.show(id));
    }

    @CatchErrors('WearableView.remove()')
    private remove() {
        if (typeof this.wearable === 'undefined') {
            throw new Error('No wearable is selected!');
        }
        const { MessageSuccess } = this.window;
        this.config.remove(this.wearable.config.id);
        this.wearable = undefined;
        this.show(false);
        MessageSuccess().show();
    }

    @CatchErrors('WearableView.bindSelectBox()')
    private bindSelectBox(to: ClickEvent): void {
        const selectBox = new this.window.west.gui.Selectbox()
            .setHeader(this.language.getTranslation(170))
            .setWidth(300);
        this.config.list().forEach(item => {
            selectBox.addItem(item.id, getViewName(item.name));
        });
        selectBox.addListener(itemId => this.errorTracker.execute(() => this.show(itemId)));
        selectBox.show(to);
    }

    @CatchErrors('WearableView.wear')
    private wear(itemId: number, itemDOM: JQuery): void {
        const { Bag, Wear, $, MessageError } = this.window;
        this.logger.log(`wearing item id = ${itemId}`, itemDOM);

        if (Bag.loaded) {
            const inventoryItem = Bag.getItemByItemId(itemId);
            if (typeof inventoryItem !== 'undefined') {
                Wear.carry(inventoryItem);
            }
            $(itemDOM).css('opacity', '0.5');
        } else {
            MessageError('Loading...').show;
            Bag.loadItems();
            this.logger.warn('bag is not loaded, cannot wear an item...');
        }
    }

    getMainDiv(): JQuery {
        return this.container;
    }

    /**
     * @private
     * @param id of the wearable to be shown
     */
    show(id: number): void;
    /**
     *
     * @param fromListFallback if true opens the first item in list if there is no wearable selected
     * @private
     */
    show(fromListFallback: boolean): void;
    show(param: number | boolean): void {
        this.errorTracker.execute(() => {
            // reset gui elements
            this.actions.empty();
            this.caption.empty();

            // get wearable id
            let wearableId: number | undefined;
            if (typeof param === 'number') {
                wearableId = param;
            }
            if (typeof wearableId === 'undefined') {
                const list = this.config.list();
                if (!list.length) {
                    this.iconShowList.hide();
                }
                if (!list.length || !param) {
                    this.headerLeft.css('visibility', 'hidden');
                    this.content.html(
                        '<div style="margin: 15px; text-align: center; font-weight: bold">' +
                            this.language.getTranslation(208) +
                            '</div>',
                    );
                    return;
                }
                wearableId = list[0].id;
            }

            const { tw2widget, ItemManager, $, west, Premium, MessageError } = this.window;

            this.logger.log(`show wearable, id = ${wearableId}`);
            this.headerLeft.css('visibility', 'visible');
            this.iconShowList.show();
            // get wearable config
            const wearableConfig = this.config.show(wearableId, this.actions);
            if (!wearableConfig) {
                this.logger.error(`not found a wearable id = ${wearableId}`);
                MessageError(`Wearable '${wearableId}' not found!`).show();
                return;
            }
            this.logger.log('wearable config', wearableConfig);
            const wearableDOM: WearableDOM = {
                config: wearableConfig,
                itemsDOM: [],
            };
            // set caption
            this.caption.text(getViewName(wearableConfig.name));

            // get items
            wearableDOM.itemsDOM = wearableConfig.items.map(itemId => {
                const itemDOM = new tw2widget.InventoryItem(ItemManager.get(itemId))
                    .getMainDiv()
                    .css({ float: 'none', display: 'inline-block' });

                if (this.isWearing(itemId)) {
                    $(itemDOM).css('opacity', '0.5');
                }

                return $(itemDOM).on('click', () => {
                    this.wear(itemId, itemDOM);
                });
            });

            // append items to DOM
            const items = $('<div></div>');
            wearableDOM.itemsDOM.forEach(itemDOM => items.append(itemDOM));

            const groupFrame = new this.window.west.gui.Groupframe().appendToContentPane(items);
            // add wear all button
            if (Premium.hasBonus('automation')) {
                this.logger.log('wear all button enabled');
                const wearAllButton = new west.gui.Button().setCaption(this.language.getTranslation(207)).click(() => {
                    this.errorTracker.execute(() => {
                        const itemIds = wearableDOM.config.items;
                        for (let i = 0; i < itemIds.length; i++) {
                            const itemId = itemIds[i];
                            const itemDOM = wearableDOM.itemsDOM[i];
                            // wear an item
                            this.wear(itemId, itemDOM);
                        }
                    });
                });
                groupFrame.appendToContentPane(
                    $('<div style="display: block; margin: 4px 0; text-align: center"></div>').append(
                        wearAllButton.getMainDiv(),
                    ),
                );
            } else {
                this.logger.log('wear all button disabled, no automation');
            }

            this.wearable = wearableDOM;
            this.content.empty().append(groupFrame.getMainDiv());
        });
    }

    private isWearing(itemId: number): boolean {
        return Object.values(this.window.Wear.wear).some(slot => {
            return slot.obj.item_id === itemId;
        });
    }
}

export function getViewName(name?: string): string {
    return name || 'unnamed';
}
