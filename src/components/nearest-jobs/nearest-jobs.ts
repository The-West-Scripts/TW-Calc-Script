import { Component } from '../component.types';
import { inject, singleton } from 'tsyringe';
import { SettingNumber } from '../settings/settings.types';
import { Settings } from '../settings/settings';
import { TheWest, TheWestWindow } from '../../@types/the-west';

@singleton()
export class NearestJobs implements Component {
    constructor(@inject('window') private window: TheWestWindow, private readonly settings: Settings) {}

    init(): any {
        // nearest job bar is hidden
        if (this.settings.get(SettingNumber.NearestJobsBar) === 4) {
            return;
        }
        this.fetchMap();
    }

    fetchMap(cb?: (map: TheWest.Map) => void): void {
        this.window.Ajax.get<TheWest.Map>('map', 'get_minimap', {}, (data): void => {
            if (data.error) {
                return new this.window.UserMessage(data.msg).show();
            }
            if (typeof cb === 'function') {
                cb(data);
            }
        });
    }
}
