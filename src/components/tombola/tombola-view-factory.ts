import { Config } from '../config/config';
import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { Logger } from '../logger/logger';
import { TheWestWindow } from '../../@types/the-west';
import { TombolaExporter } from './tombola-exporter';
import { TombolaView } from './tombola-view';
import { TW2WindowView } from '../tw2-window/tw2-window.types';
import { WestCalcWindowTab } from '../west-calc/west-calc-window.types';

@singleton()
export class TombolaViewFactory {
    constructor(
        @inject('window') private readonly window: TheWestWindow,
        private readonly logger: Logger,
        private readonly config: Config,
        private readonly language: Language,
        private readonly tombola: TombolaExporter,
    ) {}

    getWindowView(): TW2WindowView<WestCalcWindowTab> {
        let tombolaView: TombolaView;
        return {
            key: WestCalcWindowTab.Tombola,
            title: {
                type: 'translation',
                translation: 213,
            },
            loader: true,
            init({ loadCallback }) {
                tombolaView.show(loadCallback);
            },
            getMainDiv: (): JQuery => {
                tombolaView = TombolaView.of(this.window, this.logger, this.config, this.language, this.tombola);
                return tombolaView.getMainDiv();
            },
        };
    }
}
