import { AlarmClockAlarm } from './alarm-clock.types';
import { CatchErrors } from '../error-tracker/catch-errors';
import { Component } from '../component.types';
import { Config } from '../config/config';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { Storage } from '../storage/storage';
import { StorageKey } from '../storage/storage.types';
import { TheWestWindow } from '../../@types/the-west';

@singleton()
export class AlarmClock implements Component {
    constructor(
        @inject('window') private readonly window: TheWestWindow,
        private readonly storage: Storage,
        private readonly language: Language,
        private readonly config: Config,
        private readonly logger: Logger,
        public readonly errorTracker: ErrorTracker,
    ) {}

    @CatchErrors('AlarmClock.init')
    init(): any {
        this.window.setInterval(() => {
            if (!this.storage.has(StorageKey.alarmClock)) {
                return;
            }
            const datetime = this.storage.getObject<AlarmClockAlarm>(StorageKey.alarmClock);
            const start = this.getDate(datetime.date, datetime.time);
            const end = start + 60 * 1000; // 1 minute tolerance
            const now = Date.now();

            if (now >= start && now <= end) {
                this.logger.log(`show alarm clock (now: ${now}; start: ${start}; end: ${end})'`);
                this.showAlarmClockDialog(datetime);
            }
        }, 1000);
    }

    getDate(dateString: string, timeString: string): number {
        return Date.parse(dateString + ' ' + timeString);
    }

    private showAlarmClockDialog(datetime: AlarmClockAlarm): void {
        this.storage.remove(StorageKey.alarmClock);
        const dialog = new this.window.west.gui.Dialog(
            this.language.getTranslation(83),
            '<div><embed src="' +
                this.config.website +
                '/public/alarm/1.mp3" autostart="true" width="0" height="0"><span><b>' +
                this.language.getTranslation(82) +
                '</b></span>: <span><b>' +
                datetime.date +
                ' ' +
                datetime.time +
                '</b></span><br /><span><b>' +
                this.language.getTranslation(81) +
                ':</b></span><br /><div>' +
                datetime.caption.replace(/\n/g, '<br />') +
                '</div></div>',
            this.window.west.gui.Dialog.SYS_WARNING,
        );
        dialog.addButton('Ok').show();
    }
}
