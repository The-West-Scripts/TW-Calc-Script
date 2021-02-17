import { CatchErrors } from '../error-tracker/catch-errors';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { OwnCalcView } from './own-calc-view';
import { TheWestWindow } from '../../@types/the-west';
import { WardrobeView } from './wardrobe-view';
import { WardrobeWindow } from './wardrobe-window';

@singleton()
export class Wardrobe {
    private readonly wardrobeWindow: WardrobeWindow;

    constructor(
        @inject('window') private readonly window: TheWestWindow,
        public readonly errorTracker: ErrorTracker,
        language: Language,
        logger: Logger,
        wardrobeView: WardrobeView,
        ownCalcView: OwnCalcView,
    ) {
        this.wardrobeWindow = new WardrobeWindow(window, errorTracker, language, logger, wardrobeView, ownCalcView);
    }

    @CatchErrors('Wardrobe.open')
    open(): void {
        const { wman, Wear } = this.window;
        const wearWindow = wman.getById('wear');

        // if not already opened, open wear window
        if (typeof wearWindow === 'undefined') {
            Wear.open();
        } else {
            // otherwise, bring it to top
            wearWindow.bringToTop();
        }

        // and destroy inventory window
        setTimeout(() => {
            const inventoryWindow = wman.getById('inventory');
            if (typeof inventoryWindow !== 'undefined') {
                inventoryWindow.destroy();
            }
        });

        this.wardrobeWindow.open({ position: this.getWearWindowPosition() });
    }

    private getWearWindowPosition(): { x: number; y: number } {
        const win = this.window.$('.tw2gui_window.tw2gui_win2.' + this.window.Wear.window.id);

        return {
            x: Number(win.css('left').split('px')[0]) + Number(win.css('width').split('px')[0]),
            y: Number(win.css('top').split('px')[0]),
        };
    }
}
