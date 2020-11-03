export interface Game {
    locale: string;
}

export interface Dialog {
    addButton(text: string, cb: () => void): Dialog;
    show(): void;
}

export interface DialogConstructor {
    SYS_WARNING: string;
    SYS_OK: string;

    new (title: string, text: string, type: string): Dialog;
}

export interface WestGui {
    Dialog: DialogConstructor;
}

export interface West {
    gui: WestGui;
}

export interface TheWestWindow extends Window {
    Game: Game;
    $: JQueryStatic;
    west: West;
}
