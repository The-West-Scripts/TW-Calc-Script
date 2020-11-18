// IMPORTANT! DO NOT REORDER THIS IMPORT, ./path MUST BE IMPORTED FIRST!
import './patch';
import 'reflect-metadata';
import 'regenerator-runtime/runtime';

import DependencyContainer from 'tsyringe/dist/typings/types/dependency-container';
import { bootstrap } from './bootstrap';
import { container } from 'tsyringe';
import { TWCalcPublicApi } from './tw-calc.types';

container.register('window', { useValue: window });
container.register('localStorage', { useValue: localStorage });

export default window['TW_Calc'] = injectScript<TWCalcPublicApi>(bootstrap, location);

function injectScript<T>(script: (dependencyContainer: DependencyContainer) => T, location: Location): T {
    const { href } = location;
    if ((href.indexOf('.the-west.') != -1 || href.indexOf('.tw.innogames.') != -1) && href.indexOf('game.php') != -1) {
        return script(container);
    }
    throw new Error('TW-Calc must be loaded in the game!');
}
