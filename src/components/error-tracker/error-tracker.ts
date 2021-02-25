import { asErrorObject } from './catch-errors';
import { Config } from '../config/config';
import { ErrorLogWindow } from './error-log-window';
import { ErrorWindow } from './error-window';
import { inject, registry, singleton } from 'tsyringe';
import { InvisibleError } from './invisible-error';
import { Logger } from '../logger/logger';
import { OnGoingEntry, TheWestWindow } from '../../@types/the-west';

@singleton()
@registry([{ token: 'onGoingEntry', useValue: onGoingEntry }])
export class ErrorTracker {
    private readonly log: Array<Error> = [];

    private readonly errorWindow: ErrorWindow;
    private readonly errorLogWindow: ErrorLogWindow;

    constructor(
        @inject('window') private readonly window: TheWestWindow,
        @inject('onGoingEntry') private readonly onGoingEntryFunction: typeof onGoingEntry,
        private readonly logger: Logger,
        private readonly config: Config,
    ) {
        this.errorWindow = new ErrorWindow(window, this, logger);
        this.errorLogWindow = new ErrorLogWindow(window, this, logger);
    }

    private static isErrorNoficationVisible(error: Error): boolean {
        return !(error instanceof InvisibleError);
    }

    track(error: Error, component?: string): void {
        this.logger.debug('tracking error...', error);
        this.log.push(error);
        this.logger.error(error);
        // show error notification (if not an invisible error)
        if (ErrorTracker.isErrorNoficationVisible(error)) {
            this.window.WestUi.NotiBar.add(
                this.onGoingEntryFunction(this.window, () => {
                    this.errorWindow.show(error, component);
                }),
            );
        }
        // send to tw-calc net
        this.window.$.get(
            this.config.website + '/service/send-error',
            {
                errorCode: component ? `${component} | ${toString(error)}` : toString(error),
                name: this.window.Character.name,
                id: this.window.Character.playerId,
                server: this.window.Game.gameURL,
                locale: this.window.Game.locale,
                WestCalcVersion: this.config.version,
                GameVersion: this.window.Game.version,
            },
            function () {},
            'jsonp',
        );
    }

    /**
     * Execute a function immediately and catch errors.
     * @param fn
     */
    execute<T>(fn: () => T): T | undefined {
        try {
            return fn();
        } catch (e: any) {
            const error = asErrorObject(e);
            this.track(error);
            return undefined;
        }
    }

    open(): void {
        this.errorLogWindow.show(this.log);
    }
}

function toString(error: Error): string {
    // Trim the length to 1024 because of URL length limitation
    return `${error.toString()}\n${error.stack}`.substr(0, 1024);
}

function onGoingEntry(window: TheWestWindow, cb: () => void): OnGoingEntry {
    const entry = new window.OnGoingEntry();
    entry.init('', cb);
    entry.setTooltip('TW-Calc Error');
    entry.setImageClass('hint');
    return entry;
}
