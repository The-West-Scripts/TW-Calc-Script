export interface Tombola {
    key: number | TombolaKey;
    spins: TombolaSpins;
    levels: Record<number, TombolaLevel>;
}

export type TombolaLevel = Record<number, number>;

export interface TombolaKey {
    id: number;
    type: number;
    year: number;
}

export interface TombolaSpins {
    total: number;
    free: number;
}

export type TombolaStorage = Record<number, Tombola>;
