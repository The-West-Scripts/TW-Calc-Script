import { injectable } from 'tsyringe';
import { LogMethod } from './logger.types';

@injectable()
export class Logger {
    constructor(private console: Console = console, private logPrefix: string = 'TW-Calc') {}

    error(...args: any[]): void {
        this.print('error', args);
    }

    log(...args: any[]): void {
        this.print('log', args);
    }

    warn(...args: any[]): void {
        this.print('warn', args);
    }

    debug(...args: any[]): void {
        this.print('debug', args);
    }

    private print(method: LogMethod, args: any[]): void {
        if (typeof args[0] === 'string') {
            args[0] = `${this.getMessagePrefix()} ${args[0]}`;
        } else {
            args.unshift(this.getMessagePrefix());
        }

        this.console[method](...args);
    }

    private getMessagePrefix(): string {
        const date = new Date().toUTCString();
        return `${this.logPrefix} [${date}]`;
    }
}
