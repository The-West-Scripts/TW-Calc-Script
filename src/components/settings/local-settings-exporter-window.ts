import { CatchErrors } from '../error-tracker/catch-errors';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { Language } from '../language/language';
import { LocalSettingsExporter } from './local-settings-exporter';
import { Logger } from '../logger/logger';
import { TheWestWindow, tw2gui } from '../../@types/the-west';
import { TW2Window } from '../tw2-window/tw2-window';
import { TW2WindowOpenOptions, TW2WindowView } from '../tw2-window/tw2-window.types';

export class LocalSettingsExporterWindow extends TW2Window {
    constructor(
        readonly window: TheWestWindow,
        language: Language,
        logger: Logger,
        public readonly errorTracker: ErrorTracker,
        private readonly localSettingsExporter: LocalSettingsExporter,
    ) {
        super('TWCalcSettingImporter', errorTracker, window, language, logger, {
            title: { type: 'translation', translation: 225 },
        });

        this.addView(this.getExportView());
        this.addView(this.getImportView());
    }

    @CatchErrors('SettingsManagerWindow.open')
    open(options?: Partial<TW2WindowOpenOptions<string>>): void {
        super.open(options);
    }

    private getExportView(): TW2WindowView<string> {
        return {
            key: 'Export',
            title: 'Export',
            loader: false,
            getMainDiv: (): JQuery => {
                const exportable = this.localSettingsExporter.getSerializedExportableSettings();
                const textarea = new this.window.west.gui.Textarea()
                    .setHeight(260)
                    .setWidth(650)
                    .setReadonly()
                    .setContent(exportable);

                return $(`<div></div>`)
                    .append(
                        '<div>Copy the text below to export all your TW-Calc settings (Wardrobe, Job List etc.).' +
                            'Open new The-West window, open TW-Calc Settings > Import / Export > Import > paste copied settings to textarea and submit.</div>',
                    )
                    .append(textarea.getMainDiv());
            },
        };
    }

    private getImportView(): TW2WindowView<string> {
        return {
            key: 'Import',
            title: 'Import',
            loader: false,
            getMainDiv: (): JQuery => {
                const textarea = new this.window.west.gui.Textarea().setHeight(260).setWidth(650);
                const submitButton = new this.window.west.gui.Button()
                    .setCaption('Submit')
                    .click(() => this.importSettings(textarea));

                return $(`<div></div>`)
                    .append('<div>Use the textarea below to import TW-Calc settings.</div>')
                    .append(textarea.getMainDiv())
                    .append($('<div style="text-align: right"></div>').append(submitButton.getMainDiv()));
            },
        };
    }

    private importSettings(textarea: tw2gui.Textarea) {
        if (!this.localSettingsExporter.setSettings(textarea.getContent())) return;
        setTimeout(() => this.window.location.reload(), 1000);
    }
}
