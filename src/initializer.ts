import { Config } from './components/config/config';
import { Importer } from './components/importer/importer';
import { injectable } from 'tsyringe';
import { Language } from './components/language/language';
import { Settings } from './components/settings/settings';
import { Updater } from './components/updater/updater';

@injectable()
export class Initializer {
    constructor(
        public readonly language: Language,
        public readonly config: Config,
        public readonly importer: Importer,
        public readonly updater: Updater,
        public readonly settings: Settings,
    ) {
        this.language.init(() => {
            this.settings.init();
        });
    }
}
