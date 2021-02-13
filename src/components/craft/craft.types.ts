import { Item } from '../../@types/the-west';

export type Recipes = Record<number, Array<number>>;

export enum Profession {
    FieldCook = 1,
    TonicPeddler = 2,
    Blacksmith = 3,
    MasterSaddler = 4,
}

export interface Resource {
    item: Item;
    count: number;
}
