import { Config } from '../config/config';
import { injectable } from 'tsyringe';

@injectable()
export class Importer {
    constructor(private readonly config: Config) {}

    start(): void {
        $.getScript(this.config.website + '/doImport.js');
    }
}
