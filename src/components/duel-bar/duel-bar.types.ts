export enum DuelBarPosition {
    up = 1,
    down = 2,
    hidden = 4,
}

export type OnNearbyPlayersChangeCallback = (players: Array<DuelWindowPlayer>) => void;

export interface DuelWindowPlayer {
    player_id: number;
    character_x: number;
    character_y: number;
    dx: number;
    dy: number;
    duellevel: number;
    level: number;
    class: string;
    subclass: string;
    town_id: number;
    alliance_id?: number;
    player_name: string;
    town_name: string;
    town_x: number;
    town_y: number;
    avatar: string;
    own_coord: {
        x: number;
        y: number;
    };
}
