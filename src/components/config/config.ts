import { injectable } from 'tsyringe';

@injectable()
export class Config {
    public readonly version = '<@VERSION@>';
    public readonly website = 'https://tw-calc.net';
}
