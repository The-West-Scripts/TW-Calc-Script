import { AlarmClock } from './alarm-clock';
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
import { TheWestWindow, tw2gui } from '../../@types/the-west';
import { TW2WindowTranslation, TW2WindowView } from '../tw2-window/tw2-window.types';
import { WestCalcWindowTab } from '../west-calc/west-calc-window.types';

@singleton()
export class NotepadView implements TW2WindowView<WestCalcWindowTab>, Component {
    key = WestCalcWindowTab.Notepad;
    title: TW2WindowTranslation = {
        type: 'translation',
        translation: 210,
    };

    constructor(
        @inject('window') private readonly window: TheWestWindow,
        private readonly language: Language,
        private readonly config: Config,
        private readonly storage: Storage,
        private readonly logger: Logger,
        private readonly alarmClock: AlarmClock,
        public readonly errorTracker: ErrorTracker,
    ) {}

    @CatchErrors('NotepadView.clearNotes')
    private clearNotes(notepad: tw2gui.Textarea): void {
        new this.window.west.gui.Dialog(this.language.getTranslation(123), this.language.getTranslation(123))
            .addButton('Ok', () => {
                this.storage.remove(StorageKey.notepad);
                notepad.setContent('');
                this.window.MessageSuccess(this.language.getTranslation(89)).show();
            })
            .addButton('Cancel')
            .show();
    }

    @CatchErrors('NotepadView.saveNotes')
    private saveNotes(notepad: tw2gui.Textarea): void {
        this.storage.setString(StorageKey.notepad, notepad.getContent());
        this.window.MessageSuccess(this.language.getTranslation(88)).show();
    }

    @CatchErrors('NotepadView.setAlarmClock')
    private setAlarmClock(dateInput: tw2gui.Textfield, timeInput: tw2gui.Textfield): void {
        const { west, MessageSuccess, MessageError } = this.window;
        const caption = new west.gui.Textarea().setWidth(480).setHeight(120);
        const date = dateInput.getValue();
        const time = timeInput.getValue();

        if (!date.length) {
            return MessageError('You must set a date for alarm clock!').show();
        } else if (!time.length) {
            return MessageError('You must set a time for alarm clock!').show();
        } else if (this.alarmClock.getDate(date, time) <= Date.now() - 60 * 1000) {
            return MessageError('You cannot set alarm clock with past date!').show();
        }

        new west.gui.Dialog(this.language.getTranslation(93), caption.getMainDiv())
            .addButton('Ok', () => {
                const alarm: AlarmClockAlarm = {
                    date,
                    time,
                    caption: caption.getContent(),
                };
                this.storage.setObject<AlarmClockAlarm>(StorageKey.alarmClock, alarm);
                this.logger.log('alarm clock set ', alarm);
                MessageSuccess(this.language.getTranslation(96)).show();
            })
            .addButton(this.language.getTranslation(92))
            .show();
    }

    init(): any {}

    getMainDiv(): JQuery {
        const { west, $ } = this.window;

        const textarea = new west.gui.Textarea()
            .setWidth(655)
            .setHeight(280)
            .setContent(this.storage.getString(StorageKey.notepad, ''));
        const leftActions = $('<div></div>');
        const rightActions = $('<div></div>');

        leftActions.append(
            new west.gui.Button()
                .setCaption(this.language.getTranslation(36))
                .click(() => this.saveNotes(textarea))
                .getMainDiv(),
        );
        leftActions.append(
            new west.gui.Button()
                .setCaption(this.language.getTranslation(35))
                .click(() => this.clearNotes(textarea))
                .getMainDiv(),
        );

        const datetime = this.storage.getObject<AlarmClockAlarm>(StorageKey.alarmClock, {
            date: '',
            time: '',
            caption: '',
        }); // yyyy-mm-dd hh:mm:ss
        const alarmClockDateInput = new west.gui.Textfield()
            .setValue(datetime.date)
            .setLabel(
                '<img src="' + this.config.cdn + '/images/icons/clock.png" width="20" height="20" alt="Alarm clock" />',
            );
        const alarmClockTimeInput = new west.gui.Textfield().setValue(datetime.time);
        rightActions.append(changeInput(alarmClockDateInput.getMainDiv(), 'date'));
        rightActions.append(changeInput(alarmClockTimeInput.getMainDiv(), 'time'));
        rightActions.append(
            new west.gui.Button()
                .setCaption(this.language.getTranslation(37))
                .click(() => this.setAlarmClock(alarmClockDateInput, alarmClockTimeInput))
                .getMainDiv(),
        );
        // TODO: remove removed translation id 122 from translations (as note from alarm clock was removed)

        const actions = $(
            '<div style="display: flex; flex-direction: row; justify-content: space-between; margin: 5px"></div>',
        );
        actions.append(leftActions);
        actions.append(rightActions);

        return $('<div></div>').append(actions).append(textarea.getMainDiv());
    }
}

function changeInput(element: JQuery, inputType: 'time' | 'date'): JQuery {
    // find an input and change its type
    element.find('input').attr('type', inputType);
    // return original element
    return element;
}
