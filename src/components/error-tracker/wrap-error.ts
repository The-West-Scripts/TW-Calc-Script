import { asErrorObject } from './catch-errors';

export function wrapError(error: unknown, message: string) {
    const e = asErrorObject(error);
    const wrapped = new Error(`${message}\n\n${e.message}`);
    wrapped.stack += '\nCaused by: ' + e.stack;
    return wrapped;
}
