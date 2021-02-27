import { Config } from '../config/config';
import { ErrorTracker } from './error-tracker';
import { Logger } from '../logger/logger';
import { TheWestWindow } from '../../@types/the-west';
import { TW2Window } from '../tw2-window/tw2-window';

export class ErrorWindow extends TW2Window {
    constructor(window: TheWestWindow, errorTracker: ErrorTracker, logger: Logger, private config: Config) {
        // do not import language service because of circular dependencies
        super('TWCalcError', errorTracker, window, null, logger, {
            title: 'TW-Calc Error',
            size: { width: 400, height: 360 },
        });
    }

    show(error: Error, component?: string): void {
        super.open();
        const { $ } = this.window;
        const div = this.window.$('<div></div>');

        div.append(
            $(
                '<p>The error below occurred during TW-Calc execution.' +
                    '<b>You can let us now on our <a href="' +
                    this.config.discordUrl +
                    '" target="_blank">Discord</a> server.</b></p><br /><hr><br />',
            ),
        );

        if (component) {
            div.append($(`<h2>${component}</h2>`));
        }

        div.append($(`<p><b>${error.name}</b>: ${error.message}</p>`));

        if (error.stack && error.stack.length) {
            const textarea = new this.window.west.gui.Textarea();
            textarea.setHeight(150);
            textarea.setWidth(325);
            textarea.setReadonly();
            textarea.setContent(`<p>${error.stack}</p>`);
            div.append(textarea.getMainDiv());
        }

        this.tw2win.appendToContentPane(div);
    }
}
