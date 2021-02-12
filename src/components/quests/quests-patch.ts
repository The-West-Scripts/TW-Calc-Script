import { Config } from '../config/config';
import { getItemShopType } from '../../utils/items';
import { HiddenTasksWindow } from '../nearest-jobs/job-list-patch';
import { Language } from '../language/language';
import { TheWestWindow } from '../../@types/the-west';

// Path the original game so there are links in quests window to job/craft etc.
export function questsMonkeyPatch(window: TheWestWindow, language: Language, config: Config): void {
    questsGetMinimapLinkPath(window, language);
    questRenderPatch(window, language, config);
}

function questsGetMinimapLinkPath(window: HiddenTasksWindow, language: Language) {
    const { Quest, ItemManager, MinimapWindow } = window;
    const originalFn = Quest.getMinimapLink;

    Quest.getMinimapLink = function (jsRequirement): string {
        let output = '';
        const requirementTypes = ['inventory_changed', 'wear_changed'];

        if (jsRequirement && jsRequirement.id && requirementTypes.indexOf(jsRequirement.type) > -1) {
            const item = ItemManager.get(jsRequirement.id);
            const inShop = !!getItemShopType(item.item_id, ItemManager);

            if (item.spec_type === 'crafting') {
                return (
                    '<span class="quest_craftlink" style="cursor: pointer;" title="' +
                    language.getTranslation(192) +
                    '" onclick="TW_Calc.openCraftRecipeWindow(' +
                    item.item_id +
                    ')"><img src="/images/items/yield/toolbox.png" alt="Toolbox" width="16"/></span>&nbsp;'
                );
            } else if (item.spec_type === 'mapdrop') {
                output +=
                    '<span class="tw2gui-iconset tw2gui-icon-hammer" style="display: inline-block; cursor: pointer; vertical-align: middle; margin-right: 2px;" onclick="TW_Calc.openNearestJobWindowByProductId(' +
                    item.item_id +
                    ')"></span>';
            } else if (item.traderlevel && item.traderlevel < 21 && inShop) {
                output +=
                    '<span class="tw2gui-iconset tw2gui-icon-home" style="display: inline-block; cursor: pointer; vertical-align: middle; margin-right: 2px;" onclick="TW_Calc.openShopWindowByItemId(' +
                    item.item_id +
                    ')"></span>';
            } else if (window.hidTasks && window.hidTasks[item.item_base_id]) {
                output += MinimapWindow.getQuicklink(jsRequirement.id, 'inventory_changed').replace(
                    "class='quest_mmaplink'",
                    "style='cursor: pointer;'",
                );
            }
        } else if (jsRequirement && jsRequirement.type === 'task-finish-walk') {
            return (
                '<span class="quest_employerlink" style="cursor: pointer;" title=\'' +
                language.getTranslation(205) +
                '\' onclick="TW_Calc.findQuestEmployer(' +
                jsRequirement.value +
                ')"><img src="/images/map/minimap/icons/miniicon_quests.png" alt="Quests"/></span>&nbsp;'
            );
        } else if (jsRequirement && jsRequirement.type === 'task-finish-job') {
            output +=
                '<span class="tw2gui-iconset tw2gui-icon-hammer" style="display: inline-block; cursor: pointer; vertical-align: middle; margin-right: 2px;" onclick="TW_Calc.startNearestJob(' +
                jsRequirement.id +
                ', {})"></span>';
        }

        return output + originalFn(jsRequirement);
    };
}

function questRenderPatch(window: TheWestWindow, language: Language, config: Config) {
    const { Quest } = window;
    const originalFn = Quest.render;
    Quest.render = function () {
        // Also pass arguments, in case the game will be change
        // @ts-ignore
        originalFn.apply(this, arguments);
        this.el
            .find('.quest_description_container .strong')
            .append(
                '<a class="quest_calclink" style="float: right;" title="' +
                    language.getTranslation(206) +
                    '" href="' +
                    config.website +
                    '/quests/quest/' +
                    this.id +
                    '" target="_blank"><img src="/images/items/yield/book_plain.png" alt="Show Quest" width="22"/></a>',
            );
    };
}
