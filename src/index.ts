// IMPORTANT! DO NOT REORDER THIS IMPORT, ./path MUST BE IMPORTED FIRST!
import './patch';
import 'reflect-metadata';
import 'regenerator-runtime/runtime';

import DependencyContainer from 'tsyringe/dist/typings/types/dependency-container';
import { bootstrap } from './bootstrap';
import { container } from 'tsyringe';
import { tw2patch } from './tw2-patch';
import { TWCalcPublicApi } from './tw-calc.types';

container.register('window', { useValue: window });
container.register('localStorage', { useValue: localStorage });
container.register('tw2patch', { useValue: tw2patch });

inject<TWCalcPublicApi>(bootstrap, window, location);

// inject script when the game is ready
function inject<T>(
    bootstrapper: (dependencyContainer: DependencyContainer) => T,
    window: Window,
    location: Location,
): NodeJS.Timeout {
    const injectInterval = setInterval(() => {
        if (!isGameReady(window)) {
            return;
        }
        // clear the injector interval
        clearInterval(injectInterval);
        // inject the script
        window['TW_Calc'] = injectScript<T>(bootstrapper, location);
    }, 250);
    return injectInterval;
}

function isGameReady(window: Window): boolean {
    // jquery must be loaded
    return typeof window['$'] !== 'undefined';
}

function injectScript<T>(bootstrapper: (dependencyContainer: DependencyContainer) => T, location: Location): T {
    const { href } = location;
    if ((href.indexOf('.the-west.') != -1 || href.indexOf('.tw.innogames.') != -1) && href.indexOf('game.php') != -1) {
        return bootstrapper(container);
    }
    throw new Error('TW-Calc must be loaded in the game!');
}
