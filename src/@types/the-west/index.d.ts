export interface Game {
    locale: string;
}

export interface TheWestWindow extends Window {
    Game: Game;
    $: JQueryStatic;
}
