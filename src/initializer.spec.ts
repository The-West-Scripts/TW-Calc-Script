import $ from 'jquery';
import DependencyContainer from 'tsyringe/dist/typings/types/dependency-container';
import { container } from 'tsyringe';
import { Game, GameScript, TheWestWindow } from './@types/the-west';
import { Initializer } from './initializer';
import { Mock } from 'ts-mocks';
import { Updater } from './components/updater/updater';

describe('Initializer', () => {
    let dependencyContainer: DependencyContainer;
    let updaterMock: Mock<Updater>;
    let windowMock: Mock<TheWestWindow>;

    beforeEach(() => {
        dependencyContainer = container.createChildContainer();

        updaterMock = new Mock<Updater>({
            init: Mock.ANY_FUNC,
        });

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

        dependencyContainer.register(Updater, {
            useValue: updaterMock.Object,
        });
        dependencyContainer.register('localStorage', { useValue: localStorage });
        dependencyContainer.register('window', {
            useValue: windowMock.Object,
        });
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

    it('should catch errors in constructor', () => {
        const initializer = dependencyContainer.resolve(Initializer);
        updaterMock.extend({
            init() {
                throw new Error();
            },
        });

        expect(initializer).toBeTruthy();
    });
});
