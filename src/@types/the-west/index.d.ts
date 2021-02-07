import ClickEvent = JQuery.ClickEvent;

declare global {
    interface Number {
        formatDuration: () => number;
    }
}

export namespace tw2gui {
    export interface Dialog {
        divMain: JQuery;

        addButton(text: string, cb?: () => void): Dialog;
        setTitle(title: string): Dialog;
        setText(text: string): Dialog;
        setWidth(width: number): Dialog;
        setHeight(height: number): Dialog;
        getMainDiv(): JQuery;
        show(): Dialog;
    }

    export interface TextInputDialog {
        addButton(text: string, cb?: (value: string) => void): TextInputDialog;
        setTitle(title: string): TextInputDialog;
        setText(text: string): TextInputDialog;
        setPlaceholder(placeholder: string): TextInputDialog;
        show(): void;
    }

    export interface Groupframe {
        appendToContentPane(content: JQuery | string): Groupframe;
        getMainDiv(): JQuery;
    }

    export interface GroupframeConstructor {
        new (): Groupframe;
    }

    export interface DialogConstructor {
        SYS_ERROR: string;
        SYS_WARNING: string;
        SYS_OK: string;

        new (title?: string, text?: string | JQuery, type?: string): Dialog;
    }

    export interface TextInputDialogConstructor {
        new (title?: string, text?: string | JQuery, type?: string): TextInputDialog;
    }

    export interface Combobox<T> {
        setWidth(width: number): Combobox<T>;
        addItem(value: T, label: string): Combobox<T>;
        select(option: T): Combobox<T>;
        getMainDiv(): JQuery;
        getValue(): T;
        addListener(cb: (this: Combobox<T>, value: T) => void): Combobox<T>;
    }

    export interface ComboboxConstructor {
        new <T>(id: string): Combobox<T>;
    }

    export interface Textfield {
        setId(id: string): Textfield;
        setWidth(width: number): Textfield;
        setPlaceholder(text: string): Textfield;
        getMainDiv(): JQuery;
        onlyNumeric(): Textfield;
        getValue(): string;
        setValue(val: string | number): Textfield;
        setLabel(label: JQuery | string): Textfield;
        addKeyUpListener(cb: () => void): Textfield;
        addListener(cb: (this: Textfield) => void, ctx?: unknown, data?: unknown): Textfield;
    }

    export interface TextfieldConstructor {
        new (): Textfield;
    }

    export interface Selectbox<ValueType = number> {
        divMain: JQuery;

        setHeader(title: string): Selectbox<ValueType>;
        addItem(value: ValueType, label: string): Selectbox<ValueType>;
        addListener(callback: (value: ValueType) => void): Selectbox<ValueType>;
        setWidth(width: ValueType): Selectbox<ValueType>;
        show(element: JQuery.ClickEvent): Selectbox<ValueType>;
    }

    export interface SelectboxConstructor {
        new (): Selectbox;
    }

    export interface Checkbox {
        setId(id: string): Checkbox;
        setId(id: string, groupClass: string): Checkbox;
        isSelected(): boolean;
        setRadiobutton(): Checkbox;
        setLabel(label: string): Checkbox;
        setSelected(state: boolean): Checkbox;
        setEnabled(state: boolean): Checkbox;
        getValue(): boolean;
        setCallback(cb: (this: Checkbox) => void): Checkbox;
        getMainDiv(): JQuery;
    }

    export interface CheckboxConstructor {
        new (label: string): Checkbox;
    }

    export interface Button {
        setCaption(text: string): Button;
        click(cb: () => void): Button;
        getMainDiv(): JQuery;
    }

    export interface ButtonConstructor {
        new (): Button;
    }

    export interface UserMessage {
        show: () => void;
    }

    export interface UserMessageConstructor {
        TYPE_SUCCESS: 'success';
        TYPE_ERROR: 'error';
        TYPE_HINT: 'hint';

        new (data: any, type?: 'success' | 'error' | 'hint'): UserMessage;
    }

    export interface Window {
        divMain: JQuery;
        draggable: boolean;
        id: string;
        sizeRange: { x: Array<number>; y: Array<number> };

        setMiniTitle(title: string): Window;
        setTitle(title: string): Window;
        addTab(title: string, id: string): Window;
        addTab(title: string, id: string, onActivate: () => void): Window;
        activateTab(id: string): Window;
        appendToContentPane(content: JQuery | string): Window;
        destroy(): Window;
        setSize(width: number, height: number): Window;
        bringToTop(): Window;
    }

    export interface VerticalBar {
        divMain: JQuery;
        currentPosition: number;
        horizontal: boolean;

        hide(): void;
    }

    export interface Scrollpane {
        divMain: JQuery;
        verticalBar: VerticalBar;

        appendContent(content: JQuery): Scrollpane;
        getMainDiv(): JQuery;
    }

    export interface ScrollpaneConstructor {
        new (): Scrollpane;
    }

    export type MessageSuccessConstructor = (text?: string) => tw2gui.UserMessage;
    export type MessageErrorConstructor = (text?: string) => tw2gui.UserMessage;
    export type MessageHintConstructor = (text?: string) => tw2gui.UserMessage;

    export interface Textarea {
        setWidth(width: number): Textarea;
        setHeight(height: number): Textarea;
        setReadonly(): Textarea;
        setContent(content: string): Textarea;
        setId(id: string): Textarea;
        getMainDiv(): JQuery;
        getContent(): string;
    }

    export interface TextareaConstructor {
        new (): Textarea;
    }
}

export interface WestGui {
    Dialog: tw2gui.DialogConstructor;
    Combobox: tw2gui.ComboboxConstructor;
    Checkbox: tw2gui.CheckboxConstructor;
    Button: tw2gui.ButtonConstructor;
    Scrollpane: tw2gui.ScrollpaneConstructor;
    Textfield: tw2gui.TextfieldConstructor;
    Selectbox: tw2gui.SelectboxConstructor;
    Groupframe: tw2gui.GroupframeConstructor;
    Textarea: tw2gui.TextareaConstructor;
    TextInputDialog: tw2gui.TextInputDialogConstructor;
}

export interface West {
    gui: WestGui;
    item: WestItemUtilities;
}

export interface WindowManager {
    open(id: string, title: string, classes: string): tw2gui.Window;
    getById(id: string): tw2gui.Window | undefined;
}

export interface Game {
    locale: string;
    version: string;
    gameURL: string;
}

export interface Task {
    wayData: {
        date_done: number;
        date_start: number;
        queueId: number;
        x?: number;
        y?: number;
    };
}

export type Map = {
    PopupHandler: {
        getJobPopup(job: Job): string;
    };
    calcWayTime: (a: { x: number; y: number }, b: { x: number; y: number }) => number;
};

export interface Character {
    name: string;
    playerId: number;
    position: { x: number; y: number };
    duelLevel: number;
    duelMotivation: number;
    professionId: number | null;
    health: number;
    maxHealth: number;
    healthRegen: number;
    energy: number;
    maxEnergy: number;
    energyRegen: number;
    charClass: string;
    level: number;
    getExperience4Level(): number;
    getMaxExperience4Level(): number;
}

export interface TaskQueue {
    queue: Task[];

    add(tasks: Task): void;
}

export interface Job {
    id: number;
    groupid: number;
    name: string;
    shortname: string;
}

export interface JobList {
    getJobById(id: number): Job;
    getSortedJobs(prop: string): Array<Job>;
}

export interface Premium {
    hasBonus(name: string): boolean;
}

export interface Item {
    item_id: number;
    type: string;
}

export interface ItemManager {
    isLoaded(): boolean;
    get(id: number): Item;
}

export interface TheWestApi {
    register: (
        key: string,
        name: string,
        minVersion: string,
        maxVersion: string,
        author: string,
        website: string,
    ) => GameScript;
}

export interface GameScript {
    key: string;
    name: string;
    minVersion: string;
    maxVersion: string;
    author: string;
    website: string;

    setGui(content: JQuery): void;
}

export interface Ajax {
    get: <T extends any>(
        window: string,
        ajax: string,
        param: Record<string, string>,
        callback: (data: T) => void,
    ) => void;
}

export interface MapAjaxResponse {
    error: boolean;
    job_groups: any;
}

export interface JobWindow {
    open(jobId: number, x: number, y: number): void;
}

export type TaskJob = Task;

export interface TaskJobConstructor {
    new (jobId: number, x: number, y: number, duration: number): TaskJob;
}

export interface OnGoingEntry {
    init(
        image?: string,
        callback?: () => void,
        priority?: number,
        tick_end?: unknown,
        tick_interval?: unknown,
    ): OnGoingEntry;
    setTooltip(tooltip: string): OnGoingEntry;
    setImageClass(cls: string): OnGoingEntry;
}

export interface OnGoingEntryConstructor {
    new (): OnGoingEntry;
}

export interface NotiBar {
    add(entry: OnGoingEntry): void;
}

export interface WestUi {
    NotiBar: NotiBar;
}

export interface InventoryItem {
    obj: Item;
    getType(): string;
    getItemBaseId(): number;
    getItemLevel(): number;
    getId(): number;
}

export interface Bag {
    loaded: boolean;
    loadItems: () => void;
    handleChanges(changes: unknown, from: unknown): void;
    updateChanges(changes: unknown, from: unknown): void;
    getItemByItemId(itemId: number): InventoryItem;
    getItemsByItemIds(itemIdList: Array<number>): Array<InventoryItem>;
}

export interface Crafting {
    updateResources: () => void;
}

export interface Player {
    h: string;
}

export interface SaloonWindow {
    startDuel: (playerId: number) => void;
}

export interface PlayerProfileWindow {
    open: (playerId: number) => void;
}

export interface BankWindow {
    DOM: string;
    Transfer: { fee: number };
}

export type FormatMoneyFunction = (number: number) => number;

export type SkillKey =
    | 'aim'
    | 'animal'
    | 'appearance'
    | 'build'
    | 'dodge'
    | 'endurance'
    | 'finger_dexterity'
    | 'health'
    | 'hide'
    | 'leadership'
    | 'pitfall'
    | 'punch'
    | 'reflex'
    | 'repair'
    | 'ride'
    | 'show'
    | 'swim'
    | 'tactic'
    | 'tough'
    | 'trade';

export interface Skill<T extends SkillKey> {
    name: T;
    getPointsWithBonus(): number;
    getSkillPMBox(
        id: string,
        guiStorageObj: any,
        pmOptions: {
            id: string;
            min_value: number;
            start_value: number;
            max_value: number;
            extra_points: number;
            callbackPlus: (event: ClickEvent) => void;
            callbackMinus: (event: ClickEvent) => void;
        },
    ): JQuery;
}

export interface CharacterSkills {
    allSkillKeys: Array<SkillKey>;
    skills: Record<SkillKey, Skill<SkillKey>>;
    getSkill<T extends SkillKey>(key: T): Skill<T>;
}

export type WearSlotKey =
    | 'animal'
    | 'belt'
    | 'body'
    | 'foot'
    | 'head'
    | 'neck'
    | 'pants'
    | 'right_arm'
    | 'yield'
    | 'left_arm';

export interface Wear {
    wear: Record<WearSlotKey, InventoryItem>;
    slots: Array<string>;
    item_ids: Array<number>;
    window: tw2gui.Window;

    open(): void;
    carry(item: InventoryItem): void;
    get(type: string): InventoryItem;
}

export interface TW2WidgetInventoryItem {
    getMainDiv(): JQuery;
}

export interface TW2WidgetInventoryItemConstructor {
    new (item: Item): TW2WidgetInventoryItem;
}

export interface TW2Widget {
    InventoryItem: TW2WidgetInventoryItemConstructor;
}

export interface Set {
    key: string;
}

export interface BestSet {
    items: Array<number>;
    sets: Array<Set>;
    getItems(): Array<number>;
}

export interface Calculator {
    getBestSet(skills: Record<SkillKey, number>, jobId?: number): BestSet;
    getBestItems(skills: Record<SkillKey, number>, onlyWearable: boolean): Array<Item>;
}

export interface WestItemUtilities {
    Calculator: Calculator;
}

export interface TheWestWindow extends Window {
    console: Console;
    Game: Game;
    $: JQueryStatic;
    west: West;
    MessageSuccess: tw2gui.MessageSuccessConstructor;
    MessageHint: tw2gui.MessageHintConstructor;
    MessageError: tw2gui.MessageErrorConstructor;
    wman: WindowManager;
    TheWestApi: TheWestApi;
    Character: Character;
    Ajax: Ajax;
    UserMessage: tw2gui.UserMessageConstructor;
    TaskQueue: TaskQueue;
    JobList: JobList;
    Premium: Premium;
    ItemManager: ItemManager;
    Map: Map;
    JobWindow: JobWindow;
    TaskJob: TaskJobConstructor;
    OnGoingEntry: OnGoingEntryConstructor;
    WestUi: WestUi;
    Bag: Bag;
    Crafting: Crafting;
    Player: Player;
    SaloonWindow: SaloonWindow;
    PlayerProfileWindow: PlayerProfileWindow;
    BankWindow: BankWindow;
    CharacterSkills: CharacterSkills;
    Wear: Wear;
    format_money: FormatMoneyFunction;
    tw2widget: TW2Widget;
}
