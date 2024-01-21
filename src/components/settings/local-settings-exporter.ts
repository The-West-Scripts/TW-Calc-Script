import { inject, singleton } from 'tsyringe';
import { Logger } from '../logger/logger';
import { Storage } from '../storage/storage';
import { StorageKey } from '../storage/storage.types';
import { TheWestWindow } from '../../@types/the-west';

@singleton()
export class LocalSettingsExporter {
    private exportable: StorageKey[] = [
        StorageKey.alarmClock,
        StorageKey.battleCalc,
        StorageKey.ownCalc,
        StorageKey.jobList,
        StorageKey.notepad,
        StorageKey.settings,
        StorageKey.tombola,
        StorageKey.wardrobe,
    ];

    constructor(
        @inject('window') private readonly window: TheWestWindow,
        private readonly storage: Storage,
        private readonly logger: Logger,
    ) {}

    public setSettings(serializedSettings: string): boolean {
        try {
            this.setSerializedSettings(serializedSettings);
        } catch (e) {
            this.logger.error(e);
            this.window.MessageError('Unable to deserialize settings!').show();
            return false;
        }
        return true;
    }

    public setSerializedSettings(serializedSettings: string) {
        const settings = JSON.parse(serializedSettings);
        if (!Array.isArray(settings)) throw new Error('Array expected!');
        let failures = settings.length;
        for (const item of settings) {
            if (typeof item !== 'object') {
                this.logger.warn('Object expected!');
                continue;
            }
            const key = item['key'];
            const value = item['value'];
            if (!this.isValidKey(key)) {
                this.logger.warn('Invalid key!', item);
                continue;
            }
            this.storage.setString(key, value);
            failures--;
        }
        if (!failures) {
            this.window.MessageSuccess('Successful!').show();
        } else {
            this.window.MessageHint(`Unable to import some settings! (${failures})`).show();
        }
    }

    public getSerializedExportableSettings(): string {
        return JSON.stringify(this.getExportableSettings());
    }

    private getExportableSettings(): { key: StorageKey; value: string }[] {
        return this.exportable
            .filter(storageKey => this.storage.has(storageKey))
            .map(storageKey => ({
                key: storageKey,
                value: this.storage.getString(storageKey),
            }));
    }

    private isValidKey(value: unknown): value is StorageKey {
        if (typeof value != 'string') return false;
        return Object.values(StorageKey).includes(value as StorageKey);
    }
}
