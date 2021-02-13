import { TheWestWindow, tw2gui } from './@types/the-west';

export function tw2patch(window: TheWestWindow): void {
    patchPlusminusField(window);
}

function patchPlusminusField(window: TheWestWindow): void {
    window.west.gui.Plusminusfield.prototype.setEnabled = function (
        this: tw2gui.Plusminusfield,
        isEnabled: boolean,
    ): tw2gui.Plusminusfield {
        this.enabled = isEnabled;
        return this;
    };
}
