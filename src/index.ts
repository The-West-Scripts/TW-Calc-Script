// IMPORTANT! DO NOT REORDER THIS IMPORT, ./path MUST BE IMPORTED FIRST!
import './patch';
import 'reflect-metadata';
import 'regenerator-runtime/runtime';

import { bootstrap } from './bootstrap';
import { container } from 'tsyringe';
import { inject } from './inject';
import { tw2patch } from './tw2-patch';
import { TWCalcPublicApi } from './tw-calc.types';

container.register('window', { useValue: window });
container.register('localStorage', { useValue: localStorage });
container.register('tw2patch', { useValue: tw2patch });

inject<TWCalcPublicApi>(bootstrap, window, location);
