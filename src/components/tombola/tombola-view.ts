import { AllTombolaInfo, Tombola, TombolaInfo } from './tombola-exporter.types';
import { Config } from '../config/config';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { TheWestWindow, tw2gui } from '../../@types/the-west';
import { TombolaExporter } from './tombola-exporter';

@singleton()
export class TombolaView {
    private readonly scrollpane: tw2gui.Scrollpane;
    private readonly navigation: JQuery;
    private readonly tombolaName: JQuery;
    private readonly actions: JQuery;

    constructor(
        @inject('window') private readonly window: TheWestWindow,
        private logger: Logger,
        private config: Config,
        private language: Language,
        private tombolaExporter: TombolaExporter,
    ) {
        const { west, $ } = this.window;
        this.actions = $('<div></div>');
        this.tombolaName = $('<div style="font-size: 18px;"></div>');
        this.navigation = $(
            '<div style="display: flex; justify-content: space-between; align-items: center; margin: 6px 6px 12px 6px"></div>',
        );
        this.navigation.append(this.actions).append(this.tombolaName);
        this.scrollpane = new west.gui.Scrollpane();
    }

    static of(
        window: TheWestWindow,
        logger: Logger,
        config: Config,
        language: Language,
        tombolaExporter: TombolaExporter,
    ): TombolaView {
        return new TombolaView(window, logger, config, language, tombolaExporter);
    }

    show(loadCallback: () => void): void {
        const { west, $ } = this.window;
        this.tombolaExporter.getTombolaInfo(tombolaInfo => {
            this.actions.empty();
            const tombolaUserList = this.tombolaExporter.getFromStorage();
            const tombolaList = Object.values(tombolaInfo).filter(tombola =>
                tombolaUserList.hasOwnProperty(tombola.id),
            );
            tombolaList.sort((a, b) => {
                if (!!a.year || !!b.year) {
                    return -1;
                }
                return Number(a.year) - Number(b.year);
            });
            const combobox = new west.gui.Combobox<number>('TW_Calc_Tombola_list')
                .addListener(value => this.apply(tombolaInfo, value))
                .setWidth(250);
            tombolaList.forEach(tombola => {
                // only if user has tombola
                const tombolaName = getTombolaHeader(this.tombolaExporter, tombola);
                combobox.addItem(tombola.id, tombolaName);
            });
            // if user has some tombola data
            if (tombolaList.length) {
                this.actions.append(combobox.getMainDiv());
                const tombolaId = tombolaList[tombolaList.length - 1].id;
                this.apply(tombolaInfo, tombolaId);
            } else {
                this.scrollpane.appendContent(
                    $(
                        '<div style="text-align: center; padding: 24px; font-weight: bold">' +
                            this.language.getTranslation(221) +
                            '...</div>',
                    ),
                );
                this.navigation.remove();
            }
            // hide loader
            loadCallback();
        });
    }

    getMainDiv(): JQuery {
        const { $ } = this.window;
        const scrollpane = $('<div style="height: 308px"></div>').append(this.scrollpane.getMainDiv());
        return $('<div></div>').append(this.navigation).append(scrollpane);
    }

    private apply(allTombolaInfo: AllTombolaInfo, tombolaId: number): void {
        const { $ } = this.window;
        const tombolaInfo = allTombolaInfo[tombolaId];
        const tombola = this.tombolaExporter.getFromStorage()[tombolaInfo.id];
        this.logger.log('showing tombola id = ' + tombolaId, tombolaInfo);
        const link = $(
            `<a href="${this.config.website}/tombola/${tombolaInfo.tombolaId}" target="_blank">${getTombolaHeader(
                this.tombolaExporter,
                tombolaInfo,
            )}</a>`,
        );
        this.tombolaName.empty().append(link);
        // clear the content pane
        this.scrollpane.getContentPane().empty();
        // append a new content
        this.scrollpane.appendContent(this.getContent(tombolaInfo, tombola));
        this.scrollpane.scrollToTop();
    }

    private getContent(tombolaInfo: TombolaInfo, tombola: Tombola): JQuery {
        const { $ } = this.window;
        const content = $('<div style="overflow: auto;"></div>');
        const { spins, levels } = tombola;

        if (tombolaInfo.type === 'valentine') {
            content.append(
                '<span style="font-size: 15px; text-align: right; margin-left: 20px; font-weight: bold">' +
                    spins.free +
                    ' free ' +
                    pluralize(spins.free, 'spin') +
                    ' of ' +
                    spins.total +
                    ' total ' +
                    pluralize(spins.total, 'spin') +
                    '</span></h2>',
            );
        }
        // TODO: spins for other tombola

        Object.entries(levels).forEach(([levelId, level]) => {
            const container = getContainer(this.window, Number(levelId));
            const entries = Object.entries(level);
            if (!entries.length) {
                return;
            }
            entries.forEach(([itemId, itemCount]) => container.append(getItem(this.window, Number(itemId), itemCount)));
            content.append(container);
        });

        return content;
    }
}

function getItem(window: TheWestWindow, id: number, count: number): JQuery {
    const { ItemManager, tw2widget } = window;
    const itemObj = ItemManager.get(id);
    return new tw2widget.InventoryItem(itemObj).setCount(count).setShowcompare(false).getMainDiv();
}

function getContainer(window: TheWestWindow, level: number): JQuery {
    let bg = 'rgba(128, 128, 128, 0.4)';
    switch (level) {
        case 1:
            bg = 'rgba(0, 128, 0, 0.4)';
            break;
        case 2:
            bg = 'rgba(0, 0, 255, 0.4)';
            break;
        case 3:
            bg = 'rgba(255, 215, 0, 0.4)';
            break;
        case 4:
            bg = 'rgba(255, 0, 0, 0.4)';
            break;
    }
    return window.$(
        '<div style="background:' +
            bg +
            '; float: left; width: 613px; margin: 10px; padding: 10px; border: 3px solid #a49e97; border-radius: 8px; box-shadow: 0 0 20px inset; opacity: 0.9; left: 0; right: 0; top: 0; bottom: 0;"></div>',
    );
}

function pluralize(count: number, word: string) {
    if (count == 1) {
        return word;
    }
    return word + 's';
}

function getTombolaHeader(tombolaExporter: TombolaExporter, tombolaInfo: TombolaInfo): string {
    const tombolaName = tombolaExporter.getEventTranslation(tombolaInfo.type);
    return tombolaInfo.year ? `${tombolaInfo.year} - ${tombolaName}` : tombolaName;
}
