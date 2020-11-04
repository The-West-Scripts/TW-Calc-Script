import { Config } from '../config/config';
import { ENV } from '../../constants';
import { inject, singleton } from 'tsyringe';
import { LogMethod } from './logger.types';

@singleton()
export class Logger {
    constructor(@inject('window') private window: Window & { console: Console }, private config: Config) {}

    error(...args: any[]): void {
        this.print('error', args);
    }

    log(...args: any[]): void {
        // log is disabled in the production
        if ((ENV as string) !== 'prod') {
            this.print('log', args);
        }
    }

    warn(...args: any[]): void {
        this.print('warn', args);
    }

    debug(...args: any[]): void {
        // debug is disabled in the production
        if ((ENV as string) !== 'prod') {
            this.print('debug', args);
        }
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
