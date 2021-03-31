export interface Tombola {
    key: number | TombolaKey;
    spins: TombolaSpins;
    levels: Record<number, TombolaLevel>;
}

export type ItemId = number;
export type Count = number;
export type TombolaId = number;

export type TombolaLevel = Record<ItemId, Count>;

export interface TombolaKey {
    id: number;
    type: string;
    year: number;
}

export interface TombolaSpins {
    total: number;
    free: number;
}

export type TombolaStorage = Record<TombolaId, Tombola>;

export interface Spin {
    prize: number;
    tombolaId: number;
    category: number;
    level?: number | string;
}

export type TWCalcEventName = 'independence' | 'easter' | 'octoberfest' | 'fair' | 'valentine' | 'dotd';

export interface TombolaInfo {
    id: number;
    tombolaId: string; // tombola id for url
    type: TWCalcEventName;
    year: string;
}

export type AllTombolaInfo = Record<TombolaId, TombolaInfo>;
