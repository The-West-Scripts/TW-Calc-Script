import { ENV } from '../../constants';
import { singleton } from 'tsyringe';

export type Environment = 'prod' | 'dev' | 'test';

@singleton()
export class Config {
    public readonly scriptName = 'The-West Calc';
    public readonly scriptShortName = 'tw-calc';
    public readonly updateUrl = 'https://tw-calc.net/script/TW-Calc.user.js';
    public readonly githubUrl = 'https://github.com/The-West-Scripts/TW-Calc-Script';
    public readonly discordUrl = 'https://discord.gg/vhNSGhvkwk';
    public readonly version = '<@VERSION@>';
    public readonly author = '<@AUTHOR@>';
    public readonly contributors = '<@CONTRIBUTORS@>'.split(', ');
    public readonly website = 'https://tw-calc.net';
    public readonly showUntranslated = false;
    public readonly logPrefix = 'TW-Calc';
    public readonly birthday = {
        enabled: false,
        date: '2012/12/16',
    };
    public readonly donations = false;
    public readonly cdn = '//westzz.innogamescdn.com/';
    public readonly languages = [
        'sk_SK',
        'cs_CZ',
        'es_ES',
        'pt_BR',
        'pl_PL',
        'sv_SE',
        'hu_HU',
        'ro_RO',
        'tr_TR',
        'nn_NO',
        'it_IT',
        'de_DE',
        'nl_NL',
        'ru_RU',
        'el_GR',
        'fr_FR',
    ];
    public readonly env: Environment = ENV as Environment;
}
