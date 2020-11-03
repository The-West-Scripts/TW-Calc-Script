import { container } from 'tsyringe';
import { Initializer } from './initializer';
import { TWCalcPublicApi } from './tw-calc.types';

export function bootstrap(): TWCalcPublicApi {
    const { importer, config, language } = container.resolve(Initializer);

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
