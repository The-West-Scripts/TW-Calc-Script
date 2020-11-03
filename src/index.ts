import 'core-js/features/map';
import 'reflect-metadata';

import { bootstrap } from './bootstrap';
import { TWCalcPublicApi } from './tw-calc.types';

export default injectScript<TWCalcPublicApi>(bootstrap, location);

function injectScript<T>(script: () => T, location: Location): T {
    const { href } = location;
    if ((href.indexOf('.the-west.') != -1 || href.indexOf('.tw.innogames.') != -1) && href.indexOf('game.php') != -1) {
        return script();
    }
    throw new Error('TW-Calc must be loaded in the game!');
}
