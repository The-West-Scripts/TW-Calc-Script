import { inject, injectable } from 'tsyringe';
import { StorageKey } from './storage.types';

const storagePrefix = 'TWCalc';

@injectable()
export class Storage {
    constructor(@inject('localStorage') private localStorage: WindowLocalStorage['localStorage']) {}

    getString(key: StorageKey, defaultValue?: string): string {
        return this.getValue(key, defaultValue, toString);
    }

    getNumber(key: StorageKey, defaultValue?: number): number {
        return this.getValue(key, defaultValue, Number);
    }

    getObject<T>(key: StorageKey, defaultValue?: T): T {
        return this.getValue(key, defaultValue, JSON.parse);
    }

    setString(key: StorageKey, value: string): void {
        this.addItem(key, value);
    }

    setObject<T>(key: StorageKey, value: T): void {
        this.addItem(key, JSON.stringify(value));
    }

    setNumber(key: StorageKey, value: number): void {
        this.addItem(key, value.toString());
    }

    has(key: StorageKey): boolean {
        return this.getItem(key) !== null;
    }

    remove(key: StorageKey): void {
        this.localStorage.removeItem(getKey(key));
    }

    private getItem(key: StorageKey): string | null {
        return this.localStorage.getItem(getKey(key));
    }

    private addItem(key: StorageKey, value: string) {
        this.localStorage.setItem(getKey(key), value);
    }

    private getValue<T>(key: StorageKey, defaultValue: T | undefined, parseValue: (value: string) => T): T {
        const value = this.getItem(key);
        if (value) {
            return parseValue(value);
        }
        if (defaultValue) {
            return defaultValue;
        }
        throw new Error(`Storage value for key "${key}" does not exist!`);
    }
}

function getKey(key: string): string {
    return `${storagePrefix}_${key}`;
}

function toString(value: any): string {
    return value.toString();
}
