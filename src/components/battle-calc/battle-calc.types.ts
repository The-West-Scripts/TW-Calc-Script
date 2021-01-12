import { TheWestWindow } from '../../@types/the-west';

export interface BattleCalcInput {
    charClass: string;
    premium: boolean;
    level: number;
    skills: Record<string, number>;
    mapPosition: number;
    charTower: boolean;
    damage: Array<number>;
    bonus: {
        attack: number;
        defense: number;
        resistance: number;
        damage: number;
    };
}

interface BattleCalcOutput {
    attack: {
        hit: number;
        dodge: number;
        resistance: number;
    };
    defense: {
        hit: number;
        dodge: number;
        resistance: number;
    };
    health: number;
    damage: number;
}

export interface BattleCoreCalc {
    coreCalc: (input: BattleCalcInput, getUserWearBonus: boolean) => BattleCalcOutput;
}

export interface BattleCalcWindow extends TheWestWindow {
    BattleCalc?: BattleCoreCalc;
}

export interface BattleCalcViewInput {
    health: number;
    dodge: number;
    hide: number;
    aim: number;
    pitfall: number;
    leadership: number;
    weaponMin: number;
    weaponMax: number;
    level: number;
    charClass: string;
    mapPosition: number;
    premium: boolean;
    charTower: boolean;
    hitBonus: number;
    dodgeBonus: number;
    resistanceBonus: number;
    damageBonus: number;
}
