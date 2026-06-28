import { Chests } from './chests';
import { Config } from '../config/config';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { Logger } from '../logger/logger';
import { Mock } from 'ts-mocks';
import { TheWestWindow } from '../../@types/the-west';

/**
 * Builds a stand-in for the game's `ItemUse.doIt` whose `toString()` returns a
 * controlled source, so we can exercise the string-rewriting patch with both
 * quote styles without depending on how the test bundler emits a real function.
 */
function doItWithSource(source: string): () => void {
    const fn = function () {} as unknown as { toString: () => string };
    fn.toString = () => source;
    return fn as unknown as () => void;
}

describe('Chests', () => {
    let chests: Chests;
    let loggerMock: Mock<Logger>;
    let errorTrackerMock: Mock<ErrorTracker>;
    let itemUse: { doIt: () => void; doItOrigin?: () => void };

    function setup(source: string): void {
        itemUse = { doIt: doItWithSource(source) };
        // eval() inside init() resolves the bare `ItemUse` identifier from the
        // global scope, so the injected window and the global must share the object.
        (window as unknown as { ItemUse: typeof itemUse }).ItemUse = itemUse;

        loggerMock = new Mock<Logger>({ log: Mock.ANY_FUNC, error: Mock.ANY_FUNC });
        errorTrackerMock = new Mock<ErrorTracker>({ track: Mock.ANY_FUNC });

        const windowStub = { ItemUse: itemUse } as unknown as TheWestWindow;
        chests = new Chests(windowStub, loggerMock.Object, new Mock<Config>().Object, errorTrackerMock.Object);
    }

    afterEach(() => {
        delete (window as unknown as { ItemUse?: unknown }).ItemUse;
    });

    it('patches the chest handler when the item_used anchor uses single quotes', () => {
        setup("function (itemId, itemCount) { EventHandler.signal('item_used', [itemId]); }");

        chests.init();

        const patched = itemUse.doIt.toString();
        expect(patched).toContain('TW_Calc.trackChest(itemId,res);');
        expect(patched.indexOf('TW_Calc.trackChest')).toBeLessThan(patched.indexOf('EventHandler.signal'));
        expect(errorTrackerMock.Object.track).not.toHaveBeenCalled();
    });

    it('patches the chest handler when the item_used anchor uses double quotes', () => {
        setup('function (itemId, itemCount) { EventHandler.signal("item_used", [itemId]); }');

        chests.init();

        const patched = itemUse.doIt.toString();
        expect(patched).toContain('TW_Calc.trackChest(itemId,res);');
        expect(errorTrackerMock.Object.track).not.toHaveBeenCalled();
    });

    it('tracks an error and leaves the handler untouched when the anchor is missing', () => {
        setup("function (itemId, itemCount) { EventHandler.signal('something_else', [itemId]); }");
        const original = itemUse.doIt;

        chests.init();

        // no broken eval, no rewrite — the original handler is preserved
        expect(itemUse.doIt).toBe(original);
        expect(itemUse.doIt.toString()).not.toContain('TW_Calc.trackChest');
        expect(errorTrackerMock.Object.track).toHaveBeenCalled();
    });
});
