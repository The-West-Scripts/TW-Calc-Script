import { TheWestWindow, tw2gui } from '../../@types/the-west';
import { TW2WindowOptions } from './tw2-window.types';

const defaultOptions: TW2WindowOptions = {
    reloadable: true,
};

export class TW2Window {
    protected options: TW2WindowOptions;

    private win?: tw2gui.Window;

    get tw2win(): tw2gui.Window {
        if (!this.win) {
            throw new Error('Window manipulation before initialization!');
        }
        return this.win;
    }

    constructor(public readonly id: string, protected window: TheWestWindow, options: Partial<TW2WindowOptions> = {}) {
        this.options = Object.assign(defaultOptions, options);
    }

    open(): void {
        const additionalClasses = [];
        if (!this.options.reloadable) {
            additionalClasses.push('noreload');
        }
        this.win = this.window.wman.open(this.id, this.options.title || '', additionalClasses.join(' '));
    }

    setOptions(options: Partial<TW2WindowOptions>): void {
        Object.assign(this.options, options);
    }
}
