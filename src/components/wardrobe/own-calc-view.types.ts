import { SkillKey } from '../../@types/the-west';

export interface OwnCalcWearable {
    id: number;
    name: string;
    config: Record<SkillKey, number>;
}

export type OwnCalcWearableV1 = { name: string } & Record<SkillKey, number>;
