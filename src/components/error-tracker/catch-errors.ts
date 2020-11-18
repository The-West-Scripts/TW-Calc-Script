import { Component } from '../component.types';

export type CatchErrors = (target: Component, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;

export function CatchErrors(component?: string): CatchErrors {
    return function (_: Component, __: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (this: Component) {
            try {
                originalMethod.bind(this, ...Array.from(arguments))();
            } catch (e: any) {
                const error = asErrorObject(e);
                this.errorTracker.track(error, component);
            }
        };

        return descriptor;
    };
}

export function asErrorObject(error: unknown): Error {
    if (error instanceof Error) {
        return error;
    }
    if (typeof error === 'object') {
        try {
            return new Error(JSON.stringify(error));
        } catch (_) {
            // pass
        }
    }
    return new Error(String(error).toString());
}
