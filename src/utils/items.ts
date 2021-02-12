import { ItemManager } from '../@types/the-west';

const itemTypeToShopType: Record<string, string> = {
    head: 'tailor',
    body: 'tailor',
    foot: 'tailor',
    pants: 'tailor',
    right_arm: 'gunsmith',
    left_arm: 'gunsmith',
    neck: 'general',
    animal: 'general',
    belt: 'general',
};

/**
 * Return shop for an item, if it cannot be purchased in shop, return null;
 * @param itemId
 * @param itemManager
 */
export function getItemShopType(itemId: number, itemManager: ItemManager): string | null {
    const item = itemManager.get(itemId);
    // traderlevel - 1 to 20 (max level of gunsmith)
    if (!itemTypeToShopType.hasOwnProperty(item.type) || !item.traderlevel || item.traderlevel > 20) {
        return null;
    }
    return itemTypeToShopType[item.type];
}
