import { inject, singleton } from 'tsyringe';
import { Language } from '../language/language';
import { TheWestWindow, tw2gui } from '../../@types/the-west';
import { TW2WindowTranslation, TW2WindowView } from '../tw2-window/tw2-window.types';
import { WestCalcWindowTab } from '../west-calc/west-calc-window.types';

@singleton()
export class DuelCalcView implements TW2WindowView<WestCalcWindowTab> {
    key = WestCalcWindowTab.DuelCalc;
    title: TW2WindowTranslation = {
        type: 'translation',
        translation: 215,
    };

    constructor(@inject('window') private readonly window: TheWestWindow, private readonly language: Language) {}

    init(): void {
        this.calcMaxDuelLevel();
        this.calcExperience();
    }

    getMainDiv(): JQuery {
        const content = $('<div></div>');
        content.append(this.getMaxDuelLevelCalculatorContent());
        content.append(this.getMotivationCalculatorContent());

        return content;
    }

    private calcMaxDuelLevel: () => void = () => undefined;
    private calcExperience: () => void = () => undefined;

    private getMaxDuelLevelCalculatorContent(): JQuery {
        const groupFrameContent = this.window.$(`<div><div><h4>${this.language.getTranslation(63)}</h4></div></div>`);

        const minDuelLevelOutput = $(`<span style="font-weight: bold"></span>`);
        const maxDuelLevelOutput = $(`<span style="font-weight: bold"></span>`);
        const duelLevelInput = new this.window.west.gui.Textfield()
            .setId('TWCalc_DuelLevel')
            .setWidth(100)
            .setLabel(this.language.getTranslation(66))
            .setValue(this.window.Character.duelLevel.toString());

        this.calcMaxDuelLevel = getMaxDuelLevelFunction(duelLevelInput, maxDuelLevelOutput, minDuelLevelOutput);
        duelLevelInput.addKeyUpListener(this.calcMaxDuelLevel);

        groupFrameContent.append(duelLevelInput.getMainDiv());
        groupFrameContent.append(
            $(`<div><span>${this.language.getTranslation(69)}:&nbsp;</span></div>`).append(minDuelLevelOutput),
        );
        groupFrameContent.append(
            $(`<div><span>${this.language.getTranslation(68)}:&nbsp;</span></div>`).append(maxDuelLevelOutput),
        );

        return new this.window.west.gui.Groupframe().appendToContentPane(groupFrameContent).getMainDiv();
    }

    private getMotivationCalculatorContent(): JQuery {
        const groupFrameContent = this.window.$(`<div><div><h4>${this.language.getTranslation(64)}</h4></div></div>`);

        const duelLevelInput1 = new this.window.west.gui.Textfield()
            .setId('TWCalc_DuelLevel1')
            .setWidth(100)
            .setLabel(this.language.getTranslation(66))
            .onlyNumeric()
            .setValue(this.window.Character.duelLevel.toString());

        const duelLevelInput2 = new this.window.west.gui.Textfield()
            .setId('TWCalc_DuelLevel2')
            .setWidth(100)
            .setLabel(this.language.getTranslation(66))
            .onlyNumeric()
            .setValue(this.window.Character.duelLevel + 10);

        const duelMotivation = this.window.Character.duelMotivation;
        const motivationInput = new this.window.west.gui.Textfield()
            .setId('TWCalc_DuelLevelMotivation')
            .setWidth(100)
            .setLabel(`<img alt="motivation" src="images/job/motivation.png"> ${this.language.getTranslation(71)}`)
            .onlyNumeric()
            .setValue(!duelMotivation ? 100 : duelMotivation * 100);

        const output = $(`<div style="margin-top: 16px"></div>`);

        this.calcExperience = getDuelExperienceFunction(
            duelLevelInput1,
            duelLevelInput1,
            motivationInput,
            output,
            this.language,
        );

        const calcButton = new this.window.west.gui.Button()
            .setCaption(this.language.getTranslation(67))
            .click(this.calcExperience)
            .getMainDiv();

        groupFrameContent.append($(`<div></div>`).append(duelLevelInput1.getMainDiv()));
        groupFrameContent.append($(`<div></div>`).append(duelLevelInput2.getMainDiv()));
        groupFrameContent.append($(`<div></div>`).append(motivationInput.getMainDiv()));
        groupFrameContent.append($(`<div></div>`).append(calcButton));
        groupFrameContent.append($(`<div></div>`).append(output));

        return new this.window.west.gui.Groupframe().appendToContentPane(groupFrameContent).getMainDiv();
    }
}

function getMaxDuelLevelFunction(
    duelLevelInput: tw2gui.Textfield,
    maxDuelLevelOutput: JQuery,
    minDuelLevelOutput: JQuery,
): () => void {
    return function () {
        const level = Number(duelLevelInput.getValue());

        maxDuelLevelOutput.html(Math.floor(level * 1.4).toString());
        minDuelLevelOutput.html(Math.ceil(level / 1.4).toString());
    };
}

function getDuelExperienceFunction(
    duelLevelInput1: tw2gui.Textfield,
    duelLevelInput2: tw2gui.Textfield,
    motivationInput: tw2gui.Textfield,
    duelExperienceOutput: JQuery,
    language: Language,
): () => void {
    return function () {
        const duelLevel1 = Number(duelLevelInput1.getValue());
        const duelLevel2 = Number(duelLevelInput2.getValue());
        const motivation = Number(motivationInput.getValue());

        const experience = (7 * duelLevel2 - 5 * duelLevel1 + 5) * (motivation / 100);
        const gained = Math.round(experience) * 3;
        const lost = Math.round(experience / 3);

        const output = `<div>${language.getTranslation(86)} <b>${gained}</b> ${language.getTranslation(
            87,
        )} <b>${Math.round(experience)}</b> ${language.getTranslation(110)}</div><div>${language.getTranslation(
            199,
        )} <b>${lost}<b> ${language.getTranslation(110)}</div>`;

        duelExperienceOutput.html(output);
    };
}
