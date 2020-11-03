import en_us from './en_us';
import { Component } from '../component.types';
import { Config } from '../config/config';
import { inject, injectable } from 'tsyringe';
import { LanguagePack } from './language.types';
import { Logger } from '../logger/logger';
import { Storage } from '../storage/storage';
import { StorageKey } from '../storage/storage.types';
import { TheWestWindow } from '../../@types/the-west';

@injectable()
export class Language implements Component {
    private languagePack?: LanguagePack;
    private cb?: () => void;

    constructor(
        @inject('window') private readonly window: TheWestWindow,
        private readonly config: Config,
        private readonly storage: Storage,
        private readonly logger: Logger,
    ) {}

    /**
     * Initialize the language service.
     * Fetch the language pack from server.
     */
    init(cb: () => void): void {
        this.cb = cb;

        if (!this.storage.has(StorageKey.languagePackLastUpdate) || !this.storage.has(StorageKey.languagePack)) {
            // fetch lang pack
            this.fetch();
            return;
        }

        this.languagePack = this.storage.getObject<LanguagePack>(StorageKey.languagePack);
        const updateDate = new Date(this.storage.getString(StorageKey.languagePackLastUpdate));
        const today = new Date();
        const diffDays = Math.ceil(Math.abs(today.getTime() - updateDate.getTime()) / (1000 * 3600 * 24));

        if (diffDays > 5) {
            // fetch lang pack
            this.fetch();
            return;
        }
        // use old lang pack from local storage
        this.use(this.storage.getObject(StorageKey.languagePack));
    }

    /**
     * Returns a translation. If the language pack is not loaded yet
     * return en_us translation.
     * @param id
     */
    getTranslation(id: number): string {
        const languagePack = this.languagePack;
        if (languagePack && languagePack[`lang_${id}`]) {
            return languagePack[`lang_${id}`];
        }
        if (this.config.showUntranslated) {
            return 'untranslated';
        }
        return en_us[`lang_${id}`] || 'undefined';
    }

    /**
     * Loads language pack from the server and saves it to storage.
     * @param languagePack
     */
    loadPack(languagePack: LanguagePack): void {
        if (this.languagePack) {
            return this.logger.warn('not overwriting language pack since it is already loaded');
        }

        this.storage.setObject(StorageKey.languagePack, languagePack);

        const today = new Date();
        const updateDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        this.storage.setString(StorageKey.languagePackLastUpdate, updateDate);
        this.use(languagePack);
    }

    private use(languagePack: LanguagePack): void {
        this.languagePack = languagePack;
        if (!this.cb) {
            throw new Error('callback is not defined, was init method called?');
        }
        this.cb();
    }

    private fetch(): void {
        const locale = this.getAvailableLocale();

        this.window.$.ajax({
            url:
                this.config.website +
                '/service/get-script-language-pack?lang=' +
                locale +
                '&' +
                new Date().toDateString() +
                '&' +
                this.config.version,
            dataType: 'jsonp',
            timeout: 4000,
            complete: (_, status) => {
                if (status === 'success' || status === 'notmodified') {
                    // a callback from jsonp request will call TW_Calc.loadPack
                    return;
                }
                this.logger.error(`unable to fetch language pack from the server, en_US will be used`);
                this.use(en_us);
            },
        });
    }

    private getAvailableLocale(): string {
        return this.config.languages.indexOf(this.window.Game.locale) !== -1 ? this.window.Game.locale : 'en_US';
    }
}
