import { container } from 'tsyringe';
import { Initializer } from './initializer';
import { TheWestWindow } from './@types/the-west';
import { TWCalcPublicApi } from './tw-calc.types';
import { Updater } from './components/updater/updater';

export function bootstrap(): TWCalcPublicApi {
    const { importer, config, language, updater } = container.resolve(Initializer);

    // set updater callback on the global scope
    setUpdaterCallback(updater);

    return {
        version: config.version,
        doImport: () => {
            importer.start();
        },
        loadPack: languagePack => {
            language.loadPack(languagePack);
        },
    };
}

function setUpdaterCallback(updater: Updater) {
    const window = container.resolve<TheWestWindow>('window');
    window['TWCalc_updaterCallback'] = updater.callback;
}
