import DependencyContainer from 'tsyringe/dist/typings/types/dependency-container';
import { Initializer } from './initializer';
import { TheWestWindow } from './@types/the-west';
import { TWCalcPublicApi } from './tw-calc.types';
import { Updater } from './components/updater/updater';

export function bootstrap(dependencyContainer: DependencyContainer): TWCalcPublicApi {
    const initializer = dependencyContainer.resolve(Initializer);
    const { importer, config, language, updater } = initializer;

    // set updater callback on the global scope
    setUpdaterCallback(dependencyContainer, updater);

    return {
        version: config.version,
        doImport: () => {
            importer.start();
        },
        loadPack: languagePack => {
            language.loadPack(languagePack);
        },
        _window: initializer.westCalc.window,
        _initializer: initializer,
    };
}

function setUpdaterCallback(dependencyContainer: DependencyContainer, updater: Updater) {
    const window = dependencyContainer.resolve<TheWestWindow>('window');
    window['TWCalc_updaterCallback'] = updater.callback.bind(updater);
}
