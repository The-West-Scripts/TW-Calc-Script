import { bootstrap } from './bootstrap';

describe('bootstrap', () => {
    it('should bootstrap components', () => {
        const twCalcObject = bootstrap();

        expect(twCalcObject.version).toBeTruthy();
    });
});
