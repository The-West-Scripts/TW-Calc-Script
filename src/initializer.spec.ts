import $ from 'jquery';
import DependencyContainer from 'tsyringe/dist/typings/types/dependency-container';
import { BattleCalc } from './components/battle-calc/battle-calc';
import { Birthday } from './components/birthday/birthday';
import { Character, Game, GameScript, NotiBar, TheWestApi, TheWestWindow, WestUi } from './@types/the-west';
import { container } from 'tsyringe';
import { DuelBar } from './components/duel-bar/duel-bar';
import { Gui } from './components/gui/gui';
import { Initializer } from './initializer';
import { Language } from './components/language/language';
import { Mock } from 'ts-mocks';
import { NearestJobs } from './components/nearest-jobs/nearest-jobs';
import { TombolaExporter } from './components/tombola/tombola-exporter';
import { Updater } from './components/updater/updater';

describe('Initializer', () => {
    let dependencyContainer: DependencyContainer;
    let updaterMock: Mock<Updater>;
    let guiMock: Mock<Gui>;
    let birthdayMock: Mock<Birthday>;
    let nearestJobsMock: Mock<NearestJobs>;
    let duelBarMock: Mock<DuelBar>;
    let tombolaExporterMock: Mock<TombolaExporter>;
    let languageMock: Mock<Language>;
    let battleCalcMock: Mock<BattleCalc>;
    let windowMock: Mock<TheWestWindow>;
    let languageInitCallback: () => void;

    beforeEach(() => {
        dependencyContainer = container.createChildContainer();

        updaterMock = new Mock<Updater>({
            init: Mock.ANY_FUNC,
        });
        guiMock = new Mock<Gui>({
            init: Mock.ANY_FUNC,
        });
        birthdayMock = new Mock<Birthday>({
            init: Mock.ANY_FUNC,
        });
        nearestJobsMock = new Mock<NearestJobs>({
            init: Mock.ANY_FUNC,
        });
        duelBarMock = new Mock<DuelBar>({
            init: Mock.ANY_FUNC,
        });
        tombolaExporterMock = new Mock<TombolaExporter>({
            init: Mock.ANY_FUNC,
        });
        languageMock = new Mock<Language>({
            init: (cb: () => void) => (languageInitCallback = cb),
        });
        battleCalcMock = new Mock<BattleCalc>({
            init: Mock.ANY_FUNC,
        });

        windowMock = new Mock<TheWestWindow>({
            Character: new Mock<Character>().Object,
            Game: new Mock<Game>({ version: '2.136' }).Object,
            $: $,
            TheWestApi: {
                register: () =>
                    new Mock<GameScript>({
                        setGui: () => undefined,
                    }).Object,
            },
            WestUi: new Mock<WestUi>({
                NotiBar: new Mock<NotiBar>({
                    add: Mock.ANY_FUNC,
                }).Object,
            }).Object,
            console: console,
        });

        dependencyContainer.register(Updater, {
            useValue: updaterMock.Object,
        });
        dependencyContainer.register(Gui, { useValue: guiMock.Object });
        dependencyContainer.register(Birthday, { useValue: birthdayMock.Object });
        dependencyContainer.register(NearestJobs, { useValue: nearestJobsMock.Object });
        dependencyContainer.register(DuelBar, { useValue: duelBarMock.Object });
        dependencyContainer.register(TombolaExporter, { useValue: tombolaExporterMock.Object });
        dependencyContainer.register(Language, { useValue: languageMock.Object });
        dependencyContainer.register(BattleCalc, { useValue: battleCalcMock.Object });
        dependencyContainer.register('localStorage', { useValue: localStorage });
        dependencyContainer.register('window', {
            useValue: windowMock.Object,
        });
        dependencyContainer.register('onGoingEntry', { useValue: Mock.ANY_FUNC });
    });

    afterEach(() => {
        container.clearInstances();
    });

    it('should catch errors in constructor', () => {
        const initializer = dependencyContainer.resolve(Initializer);
        updaterMock.extend({
            init() {
                throw new Error();
            },
        });

        expect(initializer).toBeTruthy();
    });

    it('should catch errors in init', () => {
        const initializer = dependencyContainer.resolve(Initializer);
        windowMock.extend({
            TheWestApi: new Mock<TheWestApi>({
                register() {
                    throw new Error();
                },
            }).Object,
        });

        expect(initializer).toBeTruthy();
    });

    it('should initialize other components', () => {
        dependencyContainer.resolve(Initializer);
        const initFunctions = [
            guiMock,
            birthdayMock,
            nearestJobsMock,
            duelBarMock,
            tombolaExporterMock,
            battleCalcMock,
        ].map(component => component.Object.init);

        expect(languageMock.Object.init).toHaveBeenCalled();
        initFunctions.forEach(fn => expect(fn).not.toHaveBeenCalled());

        expect(languageInitCallback).toBeDefined();
        languageInitCallback();

        initFunctions.forEach(fn => expect(fn).toHaveBeenCalled());
    });
});
