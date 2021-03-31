declare global {
    export interface Number {
        formatDuration: () => number;
        formatDurationBuffWay(): () => string;
    }

    export interface JQuery {
        addMousePopup(text: string): JQuery;
    }
}

export namespace tw2gui {
    export interface Progressbar {
        divMain: JQuery;

        getValue(): number;
        setMaxValue(value: number): Progressbar;
        setValue(value: number): Progressbar;
        getMainDiv(): JQuery;
    }

    export interface ProgressbarConstructor {
        new (): Progressbar;
    }

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

    export interface Checkbox<T = boolean> {
        setId(id: string): Checkbox<T>;
        setId(id: string, groupClass: string): Checkbox<T>;
        isSelected(): boolean;
        setRadiobutton(): Checkbox<T>;
        setLabel(label: string): Checkbox<T>;
        setSelected(state: boolean, noCallback?: boolean): Checkbox<T>;
        setEnabled(state: boolean): Checkbox<T>;
        setTooltip(tooltip: string): Checkbox<T>;
        setValue(value: T): Checkbox<T>;
        getValue(): T;
        setCallback(cb: (this: Checkbox<T>) => void): Checkbox<T>;
        getMainDiv(): JQuery;
    }

    export interface CheckboxConstructor {
        new <T = boolean>(label: string, group?: string, callback?: (this: Checkbox<T>) => void): Checkbox<T>;
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
        showLoader(): undefined;
        hideLoader(): unknown;
        bringToTop(): Window;
        addEventListener(type: string, callback: (window: Window) => void): Window;
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
        clipPane: JQuery;
        contentPane: JQuery;

        appendContent(content: JQuery | string): Scrollpane;
        getContentPane(): JQuery;
        getMainDiv(): JQuery;
        scrollTo(x: number, y: number, absolute: boolean): Scrollpane;
        scrollToTop(): void;
        scrollToEnd(): void;
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

    export interface Plusminusfield {
        divMain: JQuery;
        enabled: boolean;

        setMin(min: number): Plusminusfield;
        setMax(max: number): Plusminusfield;
        setValue(value: number): Plusminusfield;
        setEnabled(isEnabled: boolean): Plusminusfield;
        getMax(): number;
        getMin(): number;
        getValue(): number;
        togglePlus(): Plusminusfield;
        toggleMinus(): Plusminusfield;
        getMainDiv(): JQuery;
    }

    export interface PlusminusfieldConstructor {
        new (
            id: string,
            start_value: number,
            min_value: number,
            max_value: number,
            extra_points: number,
            callbackPlus: (event: JQuery.ClickEvent<JQuery, { obj: Plusminusfield }>) => void,
            callbackMinus: (event: JQuery.ClickEvent<JQuery, { obj: Plusminusfield }>) => void,
            callbackWheel: (event: Event, delte: number, button: Plusminusfield) => void,
        ): Plusminusfield;
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
    Progressbar: tw2gui.ProgressbarConstructor;
    Plusminusfield: tw2gui.PlusminusfieldConstructor;
}

export type WofPaySpin = unknown;
export type WofPaySpinHandler = unknown;

export interface Wof {
    id: number;
    mode: unknown;
    name: string;
    notibar: unknown;
    prizes: unknown;
    title: string;
    type: 'heartswof' | string;
    window: tw2gui.Window;
}

export interface WofContext {
    divMain: JQuery;
    paySpin: WofPaySpin;
    paySpinHandler: WofPaySpinHandler;
    rewards: Array<number>;
    title: string;
    type: string;
    window_: tw2gui.Window;
    wof: Wof;
}

export interface WheelofFortuneGambleXHRResponse {
    coupons: number;
    exchange_rewards: Array<Array<number>>;
    free: number;
    nuggets: number;
    payid: string | number; // travelling circus
    // easter
    prize?: {
        itemEnchance: number;
        itemId: number;
    };
    picked?: [number, number]; // travelling fair only
    // easter & independence tombolas: outcome & enhance
    // octoberfest: failed, normal: itemId & itemEnhance, after a bribe: outcome & enhance
    failed?: boolean;
    outcome?: { itemEnhance: number; itemId: number };
    construction_id?: number; // independence day
    streak?: number; // easter
    cost?: unknown; // dotd
    stages?: Array<{ rewards: { item: number } }>; // dotd
    itemId?: number;
    itemEnhance?: number;
}

export interface WheelofFortune {
    process(
        action: string,
        data: WofData,
        callback: (this: WofContext, response: WheelofFortuneGambleXHRResponse) => void,
        context: WofContext,
        window: tw2gui.Window,
        errorCallback: () => void,
    ): void;
}

export interface WheelofFortuneConsructor {
    new (): WheelofFortune;
}

export interface WofData {
    wofid: number;
    action: string;
    enhance: number;
    payid: string | number;
}

export interface WofDotdCardgameWindow {
    requestData(action: string, data: WofData, callback: (response: WheelofFortuneGambleXHRResponse) => void): void;
}

export interface WofDotdCardgameWindowConstructor {
    new (): WofDotdCardgameWindow;
}

export interface WofObject {
    WheelofFortune: WheelofFortuneConsructor;
    WofDotdCardgameWindow: WofDotdCardgameWindowConstructor;
}

export interface West {
    gui: WestGui;
    item: WestItemUtilities;
    wof: WofObject;
}

export interface WindowManager {
    open(id: string, title: string, classes: string): tw2gui.Window;
    getById(id: string): tw2gui.Window | undefined;
}

export interface Game {
    locale: string;
    version: string;
    gameURL: string;
    sesData: Record<string, unknown>;
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
    calcWayTime(a: { x: number; y: number }, b: { x: number; y: number }): number;
    center(x: number, y: number): void;
};

export interface Character {
    name: string;
    playerId: number;
    position: { x: number; y: number };
    duelLevel: number;
    duelMotivation: number;
    professionId: number | null;
    professionSkill: number | null;
    homeTown: {
        town_id: number;
        x: number;
        y: number;
    };
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
    updateDailyTask(type: string, value: number): void;
    setProfessionSkill(value: number): void;
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
    level: number;
}

export interface JobList {
    dropsItem(itemId: number): boolean;
    getJobById(id: number): Job | undefined;
    getSortedJobs(prop: string): Array<Job>;
    getJobsIdsByItemId(itemId: number): Array<number>;
}

export interface Premium {
    hasBonus(name: string): boolean;
}

export interface Item {
    name: string;
    craftitem: number;
    profession_id: number;
    item_id: number;
    item_base_id: number;
    type: 'recipe' | string;
    traderlevel: number;
    spec_type: string;
    skillcolor: unknown;
    max_level: number;
    min_level: number;
    resources?: Array<{ item: number | Item; count: number }>; // recipe resouces
    blocktime?: number; // cooldown after the recipe is crafted
}

export interface ItemManager {
    isLoaded(): boolean;
    get(id: number): Item;
    getByBaseId(id: number): Item;
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
    get<T extends any>(window: string, ajax: string, param: Record<string, string>, callback: (data: T) => void): void;
    remoteCallMode<T extends any, D = Record<string, unknown>>(
        window: string,
        mode: string,
        param: D,
        callback: (data: T) => void,
        view?: string,
    ): void;
    remoteCall<T extends any, D = Record<string, unknown>>(
        window: string,
        action: string,
        param: D,
        callback: (data: T) => void,
        view?: string,
    ): void;
}

export interface Town {
    alliance_id: number;
    member_count: number;
    name: string | null;
    town_id: number;
    town_points: number;
    x: number;
    y: number;
}

export interface MapAjaxResponse {
    error: boolean;
    job_groups: Record<number, Array<[number, number]>>;
    quest_locations: Record<number, Array<Array<number>>>;
    towns: Record<number, Town>;
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

export interface BagChange {
    item_id: 1899000;
    inv_id: 132048195;
    count: 277;
}

export interface Bag {
    loaded: boolean;
    items_by_id: Record<number, InventoryItem>;
    loadItems: () => void;
    handleChanges(changes: Array<BagChange>, from: unknown): void;
    updateChanges(changes: Array<BagChange>, from: unknown): void;
    getItemByItemId(itemId: number): InventoryItem;
    getItemsByItemIds(itemIdList: Array<number>): Array<InventoryItem>;
    getItemCount(item_id: number): number;
}

export type CraftingRecipeDifficulty = 'easy' | 'medium' | 'hard';

export interface Crafting {
    description: string;
    updateResources(): void;
    getRecipeColor(item: Item): CraftingRecipeDifficulty;
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
            callbackPlus: (event: JQuery.ClickEvent) => void;
            callbackMinus: (event: JQuery.ClickEvent) => void;
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

export namespace tw2widget {
    export interface CraftingItem {
        obj: Item;
        setCount(count: number): CraftingItem;
        setRequired(bagCount: number, requiredCount: number): CraftingItem;
        getMainDiv(): JQuery;
    }

    export interface CraftingItemConstructor {
        new (item: Item): CraftingItem;
    }

    export interface InventoryItem {
        setCount(count: number): InventoryItem;
        setShowcompare(enabled: boolean): InventoryItem;
        getMainDiv(): JQuery;
    }

    export interface InventoryItemConstructor {
        new (item: Item): InventoryItem;
    }
}

export interface TW2Widget {
    InventoryItem: tw2widget.InventoryItemConstructor;
    CraftingItem: tw2widget.CraftingItemConstructor;
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

export interface ItemUse {
    use(itemId: number, callback: () => void, type: string): void;
    doIt(itemId: number, callback: () => void): void;
    doItOrigin?(itemId: number, callback: () => void): void;
}

export interface ItemUseWindowXHRResponse {
    error: false;
    msg?: {
        changes: Array<{ item_id: number; inv_id: number; count: number }>;
        cooldown: number;
        effects?: Array<{ type: string; items?: Array<{ item_id: number; count: number }> }>;
        itemCooldown: number;
        itemLifetime: number;
    };
}

export interface TownShopWindowXHRResponse {
    charge: number;
    image: string;
    level: number;
    town_name: string;
    trader_inv: Array<{ item_id: number }>;
}

export interface CraftingWindowStartCraftXHRResponse {
    error: false;
    msg: {
        profession_skill: number;
        count: number;
        msg: string;
    };
}

export interface CraftingWindowXHRResponse {
    error: false;
    recipes_content: Array<{ item_id: number; last_craft: number | null }>;
    profession_maxskill: number;
    profession_skill: number;
}

export interface XHRErrorResponse {
    error: true;
    msg: string;
}

export interface JobViewWindowXHRResponse {
    id: number;
    prem_cost: number;
    prem_buy: boolean;
    has_prem: boolean;
    itembonus: number;
    jobSkillPoints: number;
    maxdmg: number;
    danger: number;
    minMaxItemVal: number[];
    motivation: number;
    is_gold: boolean;
    is_silver: boolean;
    stage: {
        stage: number;
        progress: number;
        malus: number;
    };
    durations: Array<{
        cost: number;
        money: number;
        xp: number;
        luck: number;
        items: Array<{
            prop: number;
            probBonus: number;
            itemid: number;
            random: boolean;
            buyCost: number;
        }>;
        duration: number;
        featured_money: number;
        featured_xp: number;
    }>;
    stageRewards: Array<{
        cost: number;
        money: number;
        xp: number;
        luck: number;
        items: Array<{
            prop: number;
            probBonus: number;
            itemid: number;
            random: boolean;
            buyCost: number;
        }>;
        duration: number;
    }>;
}

export interface Trader {
    open(shop: string, town_id: number, x: number, y: number): void;
}

export interface Quest {
    id: number;
    el: JQuery;
}

export interface JSRequirement {
    id: number;
    type: string;
    value?: string;
}

export interface QuestConstructor {
    render(this: Quest): void;
    getMinimapLink(jsRequirement: JSRequirement): string;
}

export interface MinimapWindow {
    getQuicklink(id: number, type: string): string;
}

export interface EventHandler {
    signal(event: string): void;
}

export interface ItemPopup {
    bindTo(el: JQuery): void;
    getXHTML(): string;
}

export interface ItemPopupConstructor {
    new (item: Item): ItemPopup;
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
    ItemUse: ItemUse;
    Trader: Trader;
    Quest: QuestConstructor;
    MinimapWindow: MinimapWindow;
    EventHandler: EventHandler;
    ItemPopup: ItemPopupConstructor;
}
