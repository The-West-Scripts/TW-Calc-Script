import { Config } from './components/config/config';
import { Importer } from './components/importer/importer';
import { inject, injectable } from 'tsyringe';
import { Language } from './components/language/language';
import { Settings } from './components/settings/settings';
import { Updater } from './components/updater/updater';
import { TheWestWindow } from './@types/the-west';

@injectable()
export class Initializer {
    constructor(
        public readonly language: Language,
        public readonly config: Config,
        public readonly importer: Importer,
        public readonly updater: Updater,
        public readonly settings: Settings,
        @inject('window') public readonly window: TheWestWindow,
    ) {
        this.init();

        this.language.init(() => {
            this.settings.init();
        });
    }

    init(): void {
        const gameMin = '1.36';
        const gameMax = this.window.Game.version.toString();
        const { scriptShortName, scriptName, website, author, contributors } = this.config;
        const authors = `${author}, ${contributors.join(', ')}`;

        const api = this.window.TheWestApi.register(scriptShortName, scriptName, gameMin, gameMax, authors, website);
        const donate = `<div style="font-size: 16px; text-align: center; margin-bottom: 15px">If you like our webpage and script, please donate for server costsand further development, we will be very grateful to you. We are funding everything from our own resources. All your donations will be appreciated and used in best way possible to ensure future development of this script.<div style="font-weight: bold; font-size: 20px;">Thank you!</div></div>
            <div style="text-align: center"><form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="LRG4X3PGMYHZY"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form></div>`;

        api.setGui(
            `<div style="font-size: 20px; font-family: Georgia, \'Times New Roman\', serif; text-align: center; margin: 15px; text-shadow: 1px 1px 0 #FFCC66, 1px 1px 2px #000000;"><a href="${website}">${website}</a></br></br>
                <a href="javascript: TW_Calc.openSettings()">${this.language.getTranslation(3)}'</a></br>
            </div><div>${donate}</div>`,
        );
    }
}
