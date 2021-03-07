import { Config } from '../config/config';
import { inject, singleton } from 'tsyringe';
import { LogMethod } from './logger.types';
import { Storage } from '../storage/storage';
import { StorageKey } from '../storage/storage.types';

@singleton()
export class Logger {
    constructor(
        @inject('window') private window: Window & { console: Console },
        private config: Config,
        private storage: Storage,
    ) {}

    error(...args: any[]): void {
        this.print('error', args);
    }

    log(...args: any[]): void {
        // log is disabled in the production
        if (this.canShowLogs()) {
            this.print('log', args);
        }
    }

    warn(...args: any[]): void {
        this.print('warn', args);
    }

    debug(...args: any[]): void {
        // debug is disabled in the production
        if (this.canShowLogs()) {
            this.print('debug', args);
        }
    }

    private canShowLogs(): boolean {
        return this.config.env !== 'prod' || this.isDebugEnabled();
    }

    private isDebugEnabled(): boolean {
        if (this.storage.has(StorageKey.debug)) {
            return true;
        }
        return !!this.window.location.href.match(/tw-calc--debug=true/);
    }

    private print(method: LogMethod, args: any[]): void {
        if (typeof args[0] === 'string') {
            args[0] = `${this.getMessagePrefix()} ${args[0]}`;
        } else {
            args.unshift(this.getMessagePrefix());
        }

        this.window.console[method](...args);
    }

    private getMessagePrefix(): string {
        const date = new Date().toUTCString();
        return `${this.config.logPrefix} [${date}]`;
    }
}
