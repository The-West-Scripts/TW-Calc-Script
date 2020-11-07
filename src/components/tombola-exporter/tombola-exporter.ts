import { Component } from '../component.types';
import { inject, singleton } from 'tsyringe';
import { Logger } from '../logger/logger';
import { StorageKey } from '../storage/storage.types';
import { Tombola, TombolaKey, TombolaLevel } from './tombola-exporter.types';
import { Storage as TWCalcStorage } from '../storage/storage';

@singleton()
export class TombolaExporter implements Component {
    constructor(
        @inject('localStorage') private readonly localStorage: WindowLocalStorage['localStorage'],
        private readonly storage: TWCalcStorage,
        private readonly logger: Logger,
    ) {}

    init(): void {
        this.migrate();
    }

    /**
     * Migrates from v1 to v2.
     * @private
     */
    private migrate(): void {
        if (this.storage.has(StorageKey.tombola)) {
            return;
        }
        this.logger.log('migrating from tombola v1...');
        const data: Record<string, Tombola> = {};
        const localStorage = this.localStorage;

        for (const key in localStorage) {
            if (!localStorage.hasOwnProperty(key)) {
                continue;
            }

            const match = key.match(/^TWCalc_Tombola_(\d+_\d+_\d+|\d+)$/);
            if (!match) {
                continue;
            }
            const rawKey = match[1];
            const tombolaKey = parseKey(rawKey);
            if (!tombolaKey) {
                this.logger.log(`could not parse tombola key ${rawKey}...`);
                continue;
            }

            let tombola: Array<Record<string, number>> | undefined;
            let tombolaSpins: { total: number; free: number } | undefined;

            // parse tombola items
            try {
                tombola = JSON.parse(localStorage.getItem(key) || '[]');
            } catch (e) {
                // pass
            }
            // if tombola is not travelling circus
            if (typeof tombolaKey !== 'number') {
                // parse tombola spins
                try {
                    tombolaSpins = JSON.parse(
                        localStorage.getItem(`TWCalc_Tombola_Spins_${tombolaKey.id}_${tombolaKey.year}`) || '{}',
                    );
                } catch (e) {
                    // pass
                }
            }

            if (typeof tombola === 'undefined' || typeof tombolaSpins === 'undefined') {
                this.logger.log('invalid tombola data...', tombolaKey, tombola, tombolaSpins);
                continue;
            }

            const levels: Record<number, TombolaLevel> = {};
            tombola.forEach((items, level) => (levels[level] = items));

            data[getId(tombolaKey)] = {
                key: tombolaKey,
                spins: tombolaSpins,
                levels,
            };
        }

        this.storage.setObject<Record<string, Tombola>>(StorageKey.tombola, data);
        this.logger.log('migration finished!', data);
    }
}

function getId(key: number | TombolaKey) {
    if (typeof key === 'number') {
        return key;
    }
    return key.id;
}

function parseKey(key: string): number | TombolaKey | undefined {
    if (key.match(/^1$/)) {
        return 1;
    }
    const match = key.match(/^(\d+)_(\d+)_(\d+)$/);
    if (!match) {
        return;
    }
    return {
        id: Number(match[1]),
        year: Number(match[2]),
        type: Number(match[3]),
    };
}
