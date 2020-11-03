import { Config } from './components/config/config';
import { Importer } from './components/importer/importer';
import { injectable } from 'tsyringe';

@injectable()
export class Initializer {
    constructor(public readonly config: Config, public readonly importer: Importer) {}
}
