import { Config } from '../config/config';
import { inject, singleton } from 'tsyringe';
import { Logger } from '../logger/logger';
import { Storage } from '../storage/storage';
import { StorageKey } from '../storage/storage.types';
import { TheWestWindow } from '../../@types/the-west';

@singleton()
export class Birthday {
    private readonly date: Date;

    constructor(
        @inject('window') private window: TheWestWindow,
        private config: Config,
        private storage: Storage,
        private logger: Logger,
    ) {
        this.date = new Date(config.birthday.date);
    }

    init(): void {
        if (!this.config.birthday.enabled) {
            return;
        }
        // if user seen the popup this year, do not show it
        if (this.isSeen()) {
            return;
        }

        if (!this.isBirthdayToday()) {
            return;
        }

        this.logger.log(`it's TW-Calc birthday today!`);
        this.showBirthdayDialog();
    }

    private isSeen(): boolean {
        return (
            this.storage.has(StorageKey.birthday) &&
            this.storage.getNumber(StorageKey.birthday) === new Date().getFullYear()
        );
    }

    private isBirthdayToday(): boolean {
        const date = new Date();
        return date.getMonth() === this.date.getMonth() && date.getDate() === this.date.getDate();
    }

    private showBirthdayDialog(): void {
        const thisYear = new Date().getFullYear();
        const age = thisYear - this.date.getFullYear();

        new this.window.west.gui.Dialog()
            .setTitle(`It's TW-Calc ${age}th birthday!`)
            .setText(
                `<div style="display: flex; flex-direction: column; padding: 8px; align-items: center">
                    <div style="padding: 8px">
                        <img alt="" src="${this.config.cdn}/images/items/yield/5_year_cake.png?1">
                    </div>
                    <div style="padding: 8px; font-size: 16px; text-align: center">
                        <div>
                            Thank you for using this script and visiting our website!</br>
                            If you like our webpage, please donate for server costs and further development, we'll be very grateful to you. We are funding everything from our own resources. All your donations will be appreciated and used in best way possible to ensure future development of our page and script.
                        </div>
                        <div style="margin: 24px; font-size: 28px; font-weight: bold; font-family: Georgia, 'Times New Roman';">Thank you!</div>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="LRG4X3PGMYHZY"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form>
                    </div>
                </div>`,
            )
            .addButton('Visit Website', () => {
                this.storage.setNumber(StorageKey.birthday, thisYear);
                this.window.open(this.config.website);
            })
            .addButton('Close', () => {
                this.storage.setNumber(StorageKey.birthday, thisYear);
            })
            .show();
    }
}
