import { Logger } from '../components/logger/logger';

interface Loggable {
    logger: Logger;
}

export type WaitUntilDecorator<TargetObject> = (
    target: TargetObject,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
) => void;

/**
 * WaitUntil waits until the condition is met.
 * @param condition
 * @param interval
 * @param timeout
 * @param w
 * @constructor
 */
export function WaitUntil<TargetObject extends Loggable = Loggable>(
    condition: (this: TargetObject) => boolean,
    interval = 100,
    timeout: number | false = 4000,
    w: Window = window,
): WaitUntilDecorator<TargetObject> {
    return function (_: TargetObject, __: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        let start = 0;
        let handle: number | undefined;

        descriptor.value = function (this: TargetObject) {
            start = Date.now();
            handle = w.setInterval(() => {
                if (!satisfies(condition.bind(this))) {
                    if (timeout && timeout > 0 && Date.now() - start > timeout) {
                        this.logger.warn('wait until timeout exceeded');
                        // timeout exceeded
                        w.clearInterval(handle);
                    }
                    return;
                }
                w.clearInterval(handle);
                return originalMethod.bind(this, ...Array.from(arguments))();
            }, interval);
        };
    };
}

function satisfies(condition: () => boolean): boolean {
    try {
        return condition();
    } catch (_) {
        return false;
    }
}
