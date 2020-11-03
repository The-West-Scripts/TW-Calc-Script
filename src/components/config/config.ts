import { injectable } from 'tsyringe';

@injectable()
export class Config {
    public readonly scriptName = 'The-West Calc';
    public readonly scriptShortName = 'tw-calc';
    public readonly updateUrl = 'https://tw-calc.net/script/TW-Calc.user.js';
    public readonly version = '<@VERSION@>';
    public readonly author = '<@AUTHOR@>';
    public readonly contributors = '<@CONTRIBUTORS@>'.split(', ');
    public readonly website = 'https://tw-calc.net';
    public readonly showUntranslated = false;
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
}
