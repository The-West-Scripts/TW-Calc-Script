import { Logger } from '../logger/logger';
import { TheWestWindow } from '../../@types/the-west';
import { TW2Window } from '../tw2-window/tw2-window';

export class ErrorLogWindow extends TW2Window {
    constructor(window: TheWestWindow, logger: Logger) {
        // do not import language service because of circular dependencies
        super('TWCalcErrorLog', window, null, logger, {
            title: 'TW-Calc ErrorLog',
        });
    }

    show(log: Array<Error>): void {
        super.open();
        const div = this.window.$('<div></div>');
        const textarea = new this.window.west.gui.Textarea();

        textarea.setHeight(355);
        textarea.setWidth(675);
        textarea.setReadonly();
        textarea.setContent(
            log
                .reverse()
                .map(err => {
                    const row: Array<string> = [err.name];
                    if (err.message.length) {
                        row.push(err.message);
                    }
                    if (err.stack && err.stack.length) {
                        row.push(err.stack);
                    }
                    return row.join('| ');
                })
                .join('\n'),
        );

        div.append(textarea.getMainDiv());

        this.tw2win.appendToContentPane(div);
    }
}
