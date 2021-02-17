import { TheWestWindow, tw2gui, WheelofFortuneGambleXHRResponse, WofContext, WofData } from '../../@types/the-west';

export type WofSpinCallback = (
    action: string,
    wofid: number,
    data: WofData,
    response: WheelofFortuneGambleXHRResponse,
) => void;

export function wofPatch(window: TheWestWindow, spinCallback: WofSpinCallback): void {
    wofWheelofFortunePatch(window, spinCallback);
    wofDotdCardgameWindowPatch(window, spinCallback);
}

function wofWheelofFortunePatch(window: TheWestWindow, spinCallback: WofSpinCallback) {
    const { west } = window;
    when(
        window,
        () => west.wof.WheelofFortune.prototype.process,
        () => {
            const originalFn = west.wof.WheelofFortune.prototype.process;
            west.wof.WheelofFortune.prototype.process = function (
                action: string,
                data: WofData,
                callback: (this: WofContext, response: WheelofFortuneGambleXHRResponse) => unknown,
                context: WofContext,
                window: tw2gui.Window,
                errorCallback: () => void,
            ) {
                const id = this.id;
                const newCallback = function (this: WofContext, response: WheelofFortuneGambleXHRResponse) {
                    spinCallback(action, id, data, response);
                    callback.call(this, response);
                };
                originalFn.call(this, action, data, newCallback, context, window, errorCallback);
            };
        },
    );
}

function wofDotdCardgameWindowPatch(window: TheWestWindow, spinCallback: WofSpinCallback) {
    const { west } = window;
    when(
        window,
        () => west.wof.WofDotdCardgameWindow.prototype.requestData,
        () => {
            const originalFn = west.wof.WofDotdCardgameWindow.prototype.requestData;
            west.wof.WofDotdCardgameWindow.prototype.requestData = function (
                action: string,
                data: WofData,
                callback: (response: WheelofFortuneGambleXHRResponse) => void,
            ) {
                const id = this.id;
                const newCallback = function (response: WheelofFortuneGambleXHRResponse) {
                    spinCallback(action, id, data, response);
                    callback(response);
                };
                originalFn.call(this, [action, data, newCallback]);
            };
        },
    );
}

function when<T>(window: Window, getter: () => T, callback: (value: T) => void): void {
    const interval = window.setInterval(() => {
        try {
            const value = getter();
            clearInterval(interval);
            callback(value);
        } catch (_) {
            void 0;
        }
    }, 500);
}
