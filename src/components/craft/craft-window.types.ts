import { Profession } from './craft.types';

export type CraftWindowTab = Profession;

export interface CraftWindowTabInitOptions {
    showRecipe: { id: number };
}
