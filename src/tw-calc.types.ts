import { Initializer } from './initializer';
import { ItemUseWindowXHRResponse } from './@types/the-west';
import { LanguagePack } from './components/language/language.types';
import { WestCalcWindow } from './components/west-calc/west-calc-window';

export interface TWCalcPublicApi {
    version: string;
    website: string;
    doImport: () => void;
    loadPack: (languagePack: LanguagePack) => void;
    trackChest: (chestId: number, resOb: ItemUseWindowXHRResponse) => void;
    _window: WestCalcWindow;
    _initializer: Initializer;
}
