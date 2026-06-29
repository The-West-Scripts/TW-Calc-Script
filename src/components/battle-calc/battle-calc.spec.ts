import { BattleCalc } from './battle-calc';
import { BattleCalcWindow, BattleCoreCalc } from './battle-calc.types';
import { Config } from '../config/config';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { Logger } from '../logger/logger';
import { Mock } from 'ts-mocks';

type Behavior = 'done' | 'fail' | 'pending';

/**
 * Minimal stand-in for the jqXHR returned by `$.getScript`, with controllable
 * resolution so we can drive the success / failure / in-flight branches.
 */
function fakeJqXHR(behavior: Behavior): unknown {
    const xhr = {
        done(cb: () => void) {
            if (behavior === 'done') {
                cb();
            }
            return xhr;
        },
        fail(cb: () => void) {
            if (behavior === 'fail') {
                cb();
            }
            return xhr;
        },
    };
    return xhr;
}

describe('BattleCalc', () => {
    const website = 'https://tw-calc.net';
    const coreScriptUrl = website + '/js/battle-calculator-core.js';

    let battleCalc: BattleCalc;
    let loggerMock: Mock<Logger>;
    let getScript: jasmine.Spy;
    let setTimeoutSpy: jasmine.Spy;
    let win: BattleCalcWindow & { BattleCalc?: BattleCoreCalc };

    function build(behavior: Behavior): void {
        getScript = jasmine.createSpy('getScript').and.callFake(() => fakeJqXHR(behavior));
        // run scheduled retries synchronously so the whole chain resolves in the test
        setTimeoutSpy = jasmine.createSpy('setTimeout').and.callFake((cb: () => void) => {
            cb();
            return 0;
        });
        loggerMock = new Mock<Logger>({ error: Mock.ANY_FUNC });

        win = {
            $: { getScript } as unknown as BattleCalcWindow['$'],
            setTimeout: setTimeoutSpy as unknown as Window['setTimeout'],
        } as BattleCalcWindow;

        battleCalc = new BattleCalc(
            win,
            new Mock<Config>({ website }).Object,
            loggerMock.Object,
            new Mock<ErrorTracker>({ track: Mock.ANY_FUNC }).Object,
        );
    }

    it('loads the battle calc core script on init', () => {
        build('done');

        battleCalc.init();

        expect(getScript).toHaveBeenCalledTimes(1);
        expect(getScript).toHaveBeenCalledWith(coreScriptUrl);
    });

    it('retries up to 3 times and logs each failure', () => {
        build('fail');

        battleCalc.init();

        expect(getScript).toHaveBeenCalledTimes(3);
        expect(loggerMock.Object.error).toHaveBeenCalledTimes(3);
        // backoff is only scheduled between attempts, not after the final one
        expect(setTimeoutSpy).toHaveBeenCalledTimes(2);
    });

    it('does not start a second load while one is already in progress', () => {
        build('pending');

        battleCalc.load();
        battleCalc.load();

        expect(getScript).toHaveBeenCalledTimes(1);
    });

    it('does not load when the core is already available', () => {
        build('done');
        win.BattleCalc = { coreCalc: () => ({}) } as unknown as BattleCoreCalc;

        battleCalc.load();

        expect(getScript).not.toHaveBeenCalled();
    });

    it('getInstance throws when the core is not loaded', () => {
        build('pending');

        expect(() => battleCalc.getInstance()).toThrowError('Battle calc core is not loaded yet!');
    });

    it('getInstance returns the core once available', () => {
        build('done');
        const core = { coreCalc: () => ({}) } as unknown as BattleCoreCalc;
        win.BattleCalc = core;

        expect(battleCalc.isAvailable()).toBe(true);
        expect(battleCalc.getInstance()).toBe(core);
    });
});
