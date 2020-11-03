import { Config } from './components/config/config';
import { Importer } from './components/importer/importer';
import { injectable } from 'tsyringe';
import { Language } from './components/language/language';
import { Updater } from './components/updater/updater';

@injectable()
export class Initializer {
    constructor(
        public readonly language: Language,
        public readonly config: Config,
        public readonly importer: Importer,
        public readonly updater: Updater,
    ) {
        this.language.init(() => {
            // initialize other components
        });
    }
}
