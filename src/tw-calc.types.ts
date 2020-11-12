import { Initializer } from './initializer';
import { LanguagePack } from './components/language/language.types';
import { WestCalcWindow } from './components/west-calc/west-calc-window';

export interface TWCalcPublicApi {
    version: string;
    doImport: () => void;
    loadPack: (languagePack: LanguagePack) => void;
    _window: WestCalcWindow;
    _initializer: Initializer;
}
