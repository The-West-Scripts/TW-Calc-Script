export interface WearableViewConfig {
    remove(id: number): void;
    add(callback: (id: number) => void): void;
    list(): Array<Wearable>;
    show(id: number, actions: WearableViewActions): WearableConfig | null;
}

export interface Wearable {
    id: number;
    name: string;
}

export interface WearableConfig extends Wearable {
    items: Array<number>;
}

export type WearableViewActions = JQuery;
