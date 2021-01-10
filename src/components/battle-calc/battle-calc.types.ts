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
    BattleCalc: BattleCoreCalc;
}
