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

    const { version, website } = config;

    return {
        version,
        website,
        doImport: () => {
            importer.start();
        },
        loadPack: languagePack => {
            language.loadPack(languagePack);
        },
        trackChest: (...args) => initializer.chests.trackChest(...args),
        openCraftRecipeWindow: (itemId: number) => initializer.craft.openCraftRecipeWindow(itemId),
        openNearestJobWindowByProductId: (itemId: number) =>
            initializer.nearestJobs.openNearestJobWindowByProductId(itemId),
        openShopWindowByItemId: (itemId: number) => initializer.quests.openShopWindowByItemId(itemId),
        findQuestEmployer: (questEmployer: number) => initializer.quests.findQuestEmployer(questEmployer),
        startNearestJob: (jobId: number) => initializer.nearestJobs.startNearestJob(jobId),
        _window: initializer.westCalc.window,
        _initializer: initializer,
    };
}

function setUpdaterCallback(dependencyContainer: DependencyContainer, updater: Updater) {
    const window = dependencyContainer.resolve<TheWestWindow>('window');
    window['TWCalc_updaterCallback'] = updater.callback.bind(updater);
}
