import { Initializer } from './initializer';
import { LanguagePack } from './components/language/language.types';

export interface TWCalcPublicApi {
    version: string;
    doImport: () => void;
    loadPack: (languagePack: LanguagePack) => void;
    _initializer: Initializer;
}
