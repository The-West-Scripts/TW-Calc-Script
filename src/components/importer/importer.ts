import { Config } from '../config/config';
import { singleton } from 'tsyringe';

@singleton()
export class Importer {
    constructor(private readonly config: Config) {}

    start(): void {
        $.getScript(this.config.website + '/doImport.js');
    }
}
