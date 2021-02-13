import $ from 'jquery';
import DependencyContainer from 'tsyringe/dist/typings/types/dependency-container';
import { bootstrap } from './bootstrap';
import { container } from 'tsyringe';
import { Game, GameScript, NotiBar, TheWestWindow, WestUi } from './@types/the-west';
import { Mock } from 'ts-mocks';

describe('bootstrap', () => {
    let dependencyContainer: DependencyContainer;
    let windowMock: Mock<TheWestWindow>;

    beforeEach(() => {
        dependencyContainer = container.createChildContainer();

        windowMock = new Mock<TheWestWindow>({
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

        dependencyContainer.register('localStorage', { useValue: localStorage });
        dependencyContainer.register('window', {
            useValue: windowMock.Object,
        });

        // TODO: remove these registrations by proper mocking of Initializer
        dependencyContainer.register('onGoingEntry', { useValue: Mock.ANY_FUNC });
        dependencyContainer.register('timeout', { useValue: 0 });
        dependencyContainer.register('tw2patch', { useValue: Mock.ANY_FUNC });
    });

    afterEach(() => {
        container.clearInstances();
    });

    it('should bootstrap components', () => {
        const twCalcObject = bootstrap(dependencyContainer);

        expect(twCalcObject.version).toBeTruthy();
    });
});
