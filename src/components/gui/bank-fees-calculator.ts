import { CatchErrors } from '../error-tracker/catch-errors';
import { Component } from '../component.types';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, registry, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { SettingBoolean } from '../settings/settings.types';
import { Settings } from '../settings/settings';
import { TheWestWindow } from '../../@types/the-west';

@singleton()
@registry([
    {
        token: 'timeout',
        useValue: 1000,
    },
])
export class BankFeesCalculator implements Component {
    private interval: number | undefined;

    constructor(
        @inject('window') private readonly window: TheWestWindow,
        private readonly language: Language,
        @inject('timeout') private readonly timeout: number,
        private readonly settings: Settings,
        private readonly logger: Logger,
        public readonly errorTracker: ErrorTracker,
    ) {}

    @CatchErrors<BankFeesCalculator>({
        component: 'BankFeesCalculator.inject',
        callback: object => {
            object.window.clearInterval(object.interval);
        },
    })
    private inject(): void {
        const { BankWindow, format_money } = this.window;

        if (BankWindow.DOM !== '*') {
            const amount = Math.max(Number(this.window.$('#amount').val()), 0);
            const bankFee = Math.round((amount / 100) * BankWindow.Transfer.fee);
            const transferredAmount = Math.round(amount - bankFee);
            const transferInfoDiv = $('div.bank-transfer-info .tw2gui_groupframe_content_pane', BankWindow.DOM);

            if (Number(transferInfoDiv.data('amount')) !== amount) {
                this.logger.log('updating transfer fees...');
                transferInfoDiv.data('amount', amount);
                transferInfoDiv
                    .empty()
                    .append(
                        this.language.getTranslation(105) +
                            ': ' +
                            BankWindow.Transfer.fee +
                            '% <span style="font-size: 9px">(' +
                            this.language.getTranslation(106) +
                            ': - $' +
                            format_money(bankFee) +
                            ', ' +
                            this.language.getTranslation(107) +
                            ': $' +
                            format_money(transferredAmount) +
                            ')</span>',
                    );
            }
        }
    }

    init(): any {
        if (this.settings.get(SettingBoolean.TransferFeeCalc)) {
            this.logger.log('initializing transfer fees calculator...');
            this.interval = this.window.setInterval(this.inject.bind(this), this.timeout);
        }
    }
}
