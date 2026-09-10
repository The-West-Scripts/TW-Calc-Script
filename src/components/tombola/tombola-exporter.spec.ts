import { Config } from '../config/config';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { Mock } from 'ts-mocks';
import { TheWestWindow, WheelofFortuneGambleXHRResponse, WofContext, WofData } from '../../@types/the-west';
import { TombolaExporter } from './tombola-exporter';
import { Storage as TWCalcStorage } from '../storage/storage';

type Response = Partial<WheelofFortuneGambleXHRResponse>;

const tombolaId = 60;

/** Minimal stand-in for the jqXHR that `$.get` returns. */
function fakeJqXHR(): unknown {
    const xhr = {
        done(cb: (resp: unknown) => void) {
            cb({ saved: true });
            return xhr;
        },
        fail() {
            return xhr;
        },
    };
    return xhr;
}

describe('TombolaExporter', () => {
    const website = 'https://tw-calc.net';

    let get: jasmine.Spy;
    let track: jasmine.Spy;
    let wheelPrototype: { process: Function };

    /**
     * Wires the exporter up to a stand-in for the game's wheel of fortune. The stubbed
     * `process` hands `response` straight to its callback, which is the seam the exporter
     * patches itself into, so a call to `spin()` drives the real export path end to end.
     */
    function setup(event: string, response: Response): void {
        const polls: Array<() => void> = [];

        get = jasmine.createSpy('get').and.callFake(() => fakeJqXHR());
        track = jasmine.createSpy('track');

        wheelPrototype = {
            process(_action: string, _data: WofData, callback: Function, context: WofContext) {
                callback.call(context, response);
            },
        };

        const win = {
            $: { get } as unknown as TheWestWindow['$'],
            Game: { sesData: { [event]: {} } },
            west: { wof: { WheelofFortune: { prototype: wheelPrototype } } },
            // collect the polls rather than running them inline: wofPatch clears the interval
            // from inside the callback, which is only initialised once setInterval has returned
            setInterval: ((fn: () => void) => {
                polls.push(fn);
                return 0;
            }) as unknown as Window['setInterval'],
            clearInterval: () => undefined,
        } as unknown as TheWestWindow;

        const exporter = new TombolaExporter(
            win,
            {} as WindowLocalStorage['localStorage'],
            new Mock<TWCalcStorage>({
                has: () => true,
                getObject: <T>() => ({} as T),
                setObject: Mock.ANY_FUNC,
            }).Object,
            new Mock<Logger>({ log: Mock.ANY_FUNC, warn: Mock.ANY_FUNC, error: Mock.ANY_FUNC }).Object,
            new Mock<Config>({ website }).Object,
            new Mock<Language>().Object,
            new Mock<ErrorTracker>({ track, execute: <T>(fn: () => T) => fn() }).Object,
        );

        exporter.init();
        // first poll: applies the wheel of fortune patch. The dotd patch is skipped because this
        // window has no WofDotdCardgameWindow.
        polls.forEach(poll => poll());
    }

    function spin(action: string, data: Partial<WofData>): void {
        wheelPrototype.process.call(
            { id: tombolaId },
            action,
            data as WofData,
            () => undefined,
            {} as WofContext,
            undefined,
            () => undefined,
        );
    }

    function exportedSpin(): Record<string, unknown> {
        expect(get).toHaveBeenCalled();
        const [url, payload] = get.calls.mostRecent().args;
        expect(url).toBe(website + '/service/tombola-export');
        return payload;
    }

    it('exports level 0 for an un-enhanced octoberfest spin', () => {
        // construction_id is 0 on every octoberfest spin, and 0 is also a real level here
        setup('Octoberfest', { construction_id: 0, itemId: 2354000, itemEnhance: 0, failed: false });

        spin('main', { enhance: 0, payid: 2 });

        expect(exportedSpin()).toEqual({ tombolaId, prize: 2354000, category: 0, level: 0 });
        expect(track).not.toHaveBeenCalled();
    });

    it('exports the level from the response for an octoberfest bribe', () => {
        // a bribe/upgrade carries no `enhance` in the request and reports it on the response
        setup('Octoberfest', { outcome: { itemId: 54931000, itemEnhance: 25 }, enhance: 25, failed: false });

        spin('bribe', { payid: 2 });

        expect(exportedSpin()).toEqual({ tombolaId, prize: 54931000, category: 1, level: 25 });
        expect(track).not.toHaveBeenCalled();
    });

    it('ignores construction_id, which is not a tombola level', () => {
        setup('Independence', { construction_id: 3, itemId: 54931000, itemEnhance: 150, failed: false });

        spin('main', { enhance: 0, payid: 2 });

        expect(exportedSpin()).toEqual({ tombolaId, prize: 54931000, category: 2, level: 0 });
    });

    it('prefers the request enhance over the one on the response', () => {
        // the stake the spin was played at is the request's, so the response only stands in when
        // the request carries none - as on a bribe
        setup('Easter', { enhance: 800, itemId: 54931000, itemEnhance: 25, failed: false });

        spin('main', { enhance: 25, payid: 2 });

        expect(exportedSpin()).toEqual({ tombolaId, prize: 54931000, category: 1, level: 25 });
    });
});
