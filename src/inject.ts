import DependencyContainer from 'tsyringe/dist/typings/types/dependency-container';
import { container } from 'tsyringe';

export function isGameReady(window: Window): boolean {
    // jquery must be loaded
    return typeof window['$'] !== 'undefined';
}

export function isAlreadyInjected(window: Window): boolean {
    return typeof window['TW_Calc'] !== 'undefined';
}

// inject script when the game is ready
export function inject<T>(
    bootstrapper: (dependencyContainer: DependencyContainer) => T,
    window: Window,
    location: Location,
): ReturnType<typeof setInterval> {
    const injectInterval = setInterval(() => {
        if (!isGameReady(window)) {
            return;
        }
        // clear the injector interval
        clearInterval(injectInterval);
        // the script may be injected more than once on the page (e.g. re-injection or an
        // iframe); only bootstrap once, otherwise TheWestApi.register throws "already registered"
        if (isAlreadyInjected(window)) {
            return;
        }
        // inject the script
        window['TW_Calc'] = injectScript<T>(bootstrapper, location);
    }, 250);
    return injectInterval;
}

export function injectScript<T>(bootstrapper: (dependencyContainer: DependencyContainer) => T, location: Location): T {
    const { href } = location;
    if ((href.indexOf('.the-west.') != -1 || href.indexOf('.tw.innogames.') != -1) && href.indexOf('game.php') != -1) {
        return bootstrapper(container);
    }
    throw new Error('TW-Calc must be loaded in the game!');
}
