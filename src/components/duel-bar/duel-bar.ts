import { DuelBarPosition } from './duel-bar.types';
import { SettingNumber } from '../settings/settings.types';
import { Settings } from '../settings/settings';
import { singleton } from 'tsyringe';

@singleton()
export class DuelBar {
    constructor(private settings: Settings) {}

    isPosition(position: 'up' | 'down'): boolean {
        const settings = this.settings.get(SettingNumber.DuelBar);
        if (position === 'down') {
            return settings === DuelBarPosition.down;
        }
        return settings === DuelBarPosition.up;
    }
}
