import { Config } from '../config/config';
import { inject, injectable } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { Storage } from '../storage/storage';
import { StorageKey } from '../storage/storage.types';
import { TheWestWindow } from '../../@types/the-west';
import { UpdaterResponse } from './updater.types';

@injectable()
export class Updater {
    constructor(
        @inject('window') private window: TheWestWindow,
        private readonly config: Config,
        private readonly logger: Logger,
        private readonly language: Language,
        private readonly storage: Storage,
    ) {}

    callback(updaterResponse: UpdaterResponse): void {
        try {
            if (
                updaterResponse.version !== this.config.version &&
                updaterResponse.beta_version != this.config.version
            ) {
                this.showUpdaterWindow(updaterResponse);
            }

            if (
                !this.storage.has(StorageKey.languagePackReset) ||
                this.storage.getNumber(StorageKey.languagePackReset) !== updaterResponse.reset_language_pack
            ) {
                this.storage.remove(StorageKey.languagePackLastUpdate);
                this.storage.setNumber(StorageKey.languagePackLastUpdate, updaterResponse.reset_language_pack);
                this.logger.log('language pack reset');
            }
        } catch (err) {
            this.logger.error(
                'Updater error. Your TW-Calc might be updated, check the latest version on the website!',
                err,
            );
        }
    }

    private showUpdaterWindow(updaterResponse: UpdaterResponse): void {
        const { west } = this.window;
        const currentVersion = this.config.version;

        if (west.gui.Dialog !== undefined) {
            new west.gui.Dialog(
                this.language.getTranslation(78),
                `<div class="txcenter">${this.language.getTranslation(
                    77,
                )}</div><div><br />${this.language.getTranslation(
                    79,
                )}: ${currentVersion}<br />${this.language.getTranslation(111)}: ${
                    updaterResponse.version
                }<br/></br><b>${this.language.getTranslation(112)}?</b></br>${updaterResponse.news}</div>`,
                west.gui.Dialog.SYS_WARNING,
            )
                .addButton('Download', () => this.window.open(this.config.updateUrl))
                .addButton(this.language.getTranslation(80), () => undefined)
                .show();
        } else {
            const doUpdate = confirm(
                this.language.getTranslation(77) +
                    '\n\n' +
                    this.language.getTranslation(79) +
                    ': ' +
                    this.config.version +
                    '\n' +
                    this.language.getTranslation(111) +
                    ': ' +
                    updaterResponse.version,
            );

            if (!doUpdate) {
                return;
            }

            this.window.open(this.config.updateUrl);
        }
    }
}
