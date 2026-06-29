import { inject, isAlreadyInjected, isGameReady } from './inject';

describe('inject', () => {
    let win: Partial<Window> & { $?: unknown; TW_Calc?: unknown };
    let location: Location;
    let bootstrapper: jasmine.Spy;

    beforeEach(() => {
        jasmine.clock().install();
        bootstrapper = jasmine.createSpy('bootstrap').and.returnValue({});
        location = { href: 'https://en.the-west.net/game.php' } as Location;
        win = {};
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('isGameReady reflects jQuery presence', () => {
        expect(isGameReady({} as Window)).toBe(false);
        expect(isGameReady({ $: () => undefined } as unknown as Window)).toBe(true);
    });

    it('isAlreadyInjected reflects TW_Calc presence', () => {
        expect(isAlreadyInjected({} as Window)).toBe(false);
        expect(isAlreadyInjected({ TW_Calc: {} } as unknown as Window)).toBe(true);
    });

    it('does not bootstrap until the game is ready', () => {
        inject(bootstrapper, win as Window, location);
        jasmine.clock().tick(1000);

        expect(bootstrapper).not.toHaveBeenCalled();
    });

    it('bootstraps once when the game is ready', () => {
        win.$ = () => undefined;

        inject(bootstrapper, win as Window, location);
        jasmine.clock().tick(250);

        expect(bootstrapper).toHaveBeenCalledTimes(1);
        expect(win.TW_Calc).toBeDefined();
    });

    it('does not bootstrap again when the script is already injected', () => {
        win.$ = () => undefined;
        win.TW_Calc = {}; // a previous injection already set this

        inject(bootstrapper, win as Window, location);
        jasmine.clock().tick(1000);

        expect(bootstrapper).not.toHaveBeenCalled();
    });
});
