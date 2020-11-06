import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { TheWestWindow } from '../../@types/the-west';
import { WardrobeWindow } from './wardrobe-window';

@singleton()
export class Wardrobe {
    public readonly window: WardrobeWindow;

    constructor(@inject('window') window: TheWestWindow, language: Language, logger: Logger) {
        this.window = new WardrobeWindow(window, language, logger);
    }
}
