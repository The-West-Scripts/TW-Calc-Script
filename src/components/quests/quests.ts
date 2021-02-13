import { CatchErrors } from '../error-tracker/catch-errors';
import {
    Character,
    Map,
    TheWestWindow,
    Town,
    TownShopWindowXHRResponse,
    XHRErrorResponse,
} from '../../@types/the-west';
import { Component } from '../component.types';
import { Config } from '../config/config';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { getItemShopType } from '../../utils/items';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { NearestJobs } from '../nearest-jobs/nearest-jobs';
import { questsMonkeyPatch } from './quests-patch';
import { UserDistanceTown } from './quests.types';

@singleton()
export class Quests implements Component {
    constructor(
        @inject('window') private window: TheWestWindow,
        private readonly nearestJobs: NearestJobs,
        private readonly language: Language,
        private readonly config: Config,
        private readonly logger: Logger,
        public readonly errorTracker: ErrorTracker,
    ) {}

    @CatchErrors('Quests.init')
    init(): any {
        questsMonkeyPatch(this.window, this.language, this.config);
    }

    @CatchErrors('Quests.findQuestEmployer')
    findQuestEmployer(questEmployer: number): void {
        const { Map, UserMessage } = this.window;
        this.nearestJobs.getMinimap(map => {
            const questLocation = map.quest_locations[questEmployer];
            if (!questLocation) {
                return new UserMessage(this.language.getTranslation(204), 'hint').show();
            }
            Map.center(questLocation[0][0], questLocation[0][1]);
        });
    }

    @CatchErrors('Quests.openShopWindowByItemId')
    openShopWindowByItemId(itemId: number): void {
        const { $, Map, MessageSuccess, MessageError, ItemManager, Character, Trader } = this.window;
        this.nearestJobs.getMinimap(map => {
            MessageSuccess(this.language.getTranslation(143)).show();
            const towns = getTownsByDistance(map.towns, Map, Character);
            const shopType = getItemShopType(itemId, ItemManager);
            if (!shopType) {
                return MessageError(this.language.getTranslation(219)).show();
            }
            findItemShopRecursive(
                itemId,
                shopType,
                towns,
                $,
                this.logger,
                town => {
                    Trader.open(shopType, town.town_id, town.x, town.y);
                },
                () => {
                    return MessageError(this.language.getTranslation(219)).show();
                },
            );
        });
    }
}

function getShop($: JQueryStatic, shopType: string, townId: number): Promise<Array<number>> {
    return new Promise<Array<number>>((resolve, reject) => {
        $.get(
            'game.php?window=building_' + shopType + '&town_id=' + townId,
            (json: TownShopWindowXHRResponse | XHRErrorResponse) => {
                if ('error' in json) {
                    return reject();
                }
                resolve(json.trader_inv.map(item => item.item_id));
            },
        );
    });
}

/**
 * Find item in towns of shopType.
 * @param itemId
 * @param shopType
 * @param towns
 * @param $
 * @param logger
 * @param success callback us called when item is found
 * @param error callback is called when item is not found
 */
function findItemShopRecursive(
    itemId: number,
    shopType: string,
    towns: Array<UserDistanceTown>,
    $: JQueryStatic,
    logger: Logger,
    success: (town: UserDistanceTown) => void,
    error: () => void,
) {
    const town = towns.shift();
    logger.log('finding item in shops recursively', town, towns);
    if (!town) {
        return error();
    }
    getShop($, shopType, town.town_id)
        .then(items => {
            if (items.includes(itemId)) {
                return success(town);
            }
            findItemShopRecursive(itemId, shopType, towns, $, logger, success, error);
        })
        .catch(() => error());
}

function getTownsByDistance(towns: Record<number, Town>, map: Map, character: Character): Array<UserDistanceTown> {
    const townsByDistance: Array<UserDistanceTown> = [];
    const homeTown = character.homeTown;
    Object.values(towns).forEach(town => {
        if (town.member_count && town.town_points > 2000 && town.town_id != homeTown.town_id) {
            townsByDistance.push({
                town_id: town.town_id,
                x: town.x,
                y: town.y,
                distance: map.calcWayTime(character.position, town),
            });
        }
    });
    townsByDistance.sort((a, b) => a.distance - b.distance);
    // prefer a hometown and set its disntance to 0 because of small prices
    if (homeTown && homeTown.town_id) {
        const { town_id, x, y } = homeTown;
        townsByDistance.unshift({
            town_id,
            x,
            y,
            distance: 0,
        });
    }
    return townsByDistance;
}
