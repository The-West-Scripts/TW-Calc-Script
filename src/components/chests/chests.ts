import { CatchErrors } from '../error-tracker/catch-errors';
import { Component } from '../component.types';
import { Config } from '../config/config';
import { ErrorTracker } from '../error-tracker/error-tracker';
import { inject, singleton } from 'tsyringe';
import { InvisibleError } from '../error-tracker/invisible-error';
import { ItemUseWindowXHRResponse, TheWestWindow } from '../../@types/the-west';
import { Logger } from '../logger/logger';

@singleton()
export class Chests implements Component {
    constructor(
        @inject('window') private window: TheWestWindow,
        private readonly logger: Logger,
        private readonly config: Config,
        public readonly errorTracker: ErrorTracker,
    ) {}

    @CatchErrors('Chests.init')
    init(): any {
        const toolkit = this.window.ItemUse.doItOrigin ? 'doItOrigin' : 'doIt';
        const originalFn = this.window.ItemUse[toolkit];
        if (typeof originalFn === 'undefined') {
            return;
        }
        let newStr: string | undefined;
        try {
            const str = originalFn.toString();
            const pos = str.indexOf("EventHandler.signal('item_used'");
            const body = str.substr(0, pos) + 'TW_Calc.trackChest(itemId,res);' + str.substr(pos);
            this.logger.log('patching the chest handler...', body);
            newStr = 'ItemUse.doIt = ' + body;
            eval(newStr);
        } catch (e: unknown) {
            const error = e as Error;
            this.logger.error('error while patching the chest handler', newStr);
            // rollback
            this.window.ItemUse[toolkit] = originalFn;
            // add the patched code to the error message
            error.message = `${error.message}\n\n${newStr}`;
            // propagate error, so it is caught and tracked later
            throw InvisibleError.of(error);
        }
    }

    @CatchErrors('Chests.trackChest')
    trackChest(chestId: number, resObj: ItemUseWindowXHRResponse): void {
        this.logger.log('tracking chest...', chestId, resObj);
        const { Game, $ } = this.window;
        if (!resObj.msg || !resObj.msg.effects) {
            return this.logger.log('not tracking chest because there are no effect in response object');
        }
        resObj.msg.effects.forEach(effect => {
            if (effect.type == 'lottery' || effect.type == 'content') {
                const url = this.config.website + '/service/chest-export';
                const data = {
                    chest: chestId,
                    count: 1,
                    content: {},
                    version: Game.version,
                };
                (effect.items || []).forEach(item => {
                    data.content[item.item_id] = item.count;
                });
                this.logger.log('sending a request to ' + url + ' with data', data);
                $.get(
                    url,
                    data,
                    () => {
                        this.logger.log('chest successfully tracked');
                    },
                    'jsonp',
                );
            }
        });
    }
}
