import { Component } from '../component.types';

export type CatchErrors<TargetObject extends Component = Component> = (
    target: TargetObject,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
) => void;

export interface CatchErrorsOptions<TargetObject extends Component> {
    component?: string;
    callback?: (object: TargetObject) => void;
}

export function CatchErrors(): CatchErrors;
export function CatchErrors(component: string): CatchErrors;
export function CatchErrors<TargetObject extends Component = Component>(
    options: CatchErrorsOptions<TargetObject>,
): CatchErrors<TargetObject>;
export function CatchErrors<TargetObject extends Component = Component>(
    parameter?: string | CatchErrorsOptions<TargetObject>,
): CatchErrors<TargetObject> {
    let component: string | undefined = undefined;
    let callback: ((object: TargetObject) => void) | undefined = undefined;

    if (typeof parameter === 'string') {
        component = parameter;
    } else if (typeof parameter !== 'undefined') {
        ({ component, callback } = parameter);
    }

    return function (_: TargetObject, __: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (this: TargetObject) {
            try {
                return originalMethod.bind(this, ...Array.from(arguments))();
            } catch (e: any) {
                const error = asErrorObject(e);
                this.errorTracker.track(error, component);

                if (typeof callback !== 'undefined') {
                    try {
                        callback(this);
                    } catch (e: any) {
                        const componentCallback = component ? `${component}.errorCallback` : 'errorCallback';
                        this.errorTracker.track(asErrorObject(e), componentCallback);
                    }
                }
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
