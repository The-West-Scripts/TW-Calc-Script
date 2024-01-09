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
            const settings = JSON.parse(atob(serializedSettings));
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
                try {
                    this.storage.setString(key, value);
                    failures--;
                } catch (e) {
                    this.logger.warn('Unable to set settings!', item, e);
                }
            }
            if (!failures) {
                this.window.MessageSuccess('Success!').show();
            } else {
                this.window.MessageHint(`Unable to import some settings! (${failures})`).show();
            }
        } catch (e) {
            this.logger.error(e);
            this.window.MessageError('Unable to deserialize settings!').show();
            return false;
        }
        return true;
    }

    public getSerializedExportableSettings(): string {
        return btoa(JSON.stringify(this.getExportableSettings()));
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