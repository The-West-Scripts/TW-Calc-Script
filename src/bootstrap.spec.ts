import $ from 'jquery';
import { bootstrap } from './bootstrap';
import { container } from 'tsyringe';

describe('bootstrap', () => {
    beforeEach(() => {
        container.register('localStorage', { useValue: localStorage });
        container.register('window', {
            useValue: {
                Game: { version: '2.136' },
                $: $,
                TheWestApi: {
                    register: () => ({
                        setGui: () => undefined,
                    }),
                },
            },
        });
    });

    it('should bootstrap components', () => {
        const twCalcObject = bootstrap();

        expect(twCalcObject.version).toBeTruthy();
    });
});
