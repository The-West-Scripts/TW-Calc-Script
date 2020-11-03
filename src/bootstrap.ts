import { container } from 'tsyringe';
import { Initializer } from './initializer';
import { TWCalcPublicApi } from './tw-calc.types';

export function bootstrap(): TWCalcPublicApi {
    const { importer, config } = container.resolve(Initializer);

    return {
        version: config.version,
        doImport: () => {
            importer.start();
        },
    };
}
