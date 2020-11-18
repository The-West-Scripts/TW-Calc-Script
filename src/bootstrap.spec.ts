import $ from 'jquery';
import DependencyContainer from 'tsyringe/dist/typings/types/dependency-container';
import { bootstrap } from './bootstrap';
import { container } from 'tsyringe';
import { Game, GameScript, TheWestWindow } from './@types/the-west';
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
            console: console,
        });

        dependencyContainer.register('localStorage', { useValue: localStorage });
        dependencyContainer.register('window', {
            useValue: windowMock.Object,
        });
    });

    afterEach(() => {
        container.clearInstances();
    });

    it('should bootstrap components', () => {
        const twCalcObject = bootstrap(dependencyContainer);

        expect(twCalcObject.version).toBeTruthy();
    });
});
