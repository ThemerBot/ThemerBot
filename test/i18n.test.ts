import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createTranslator } from '../src/utils/i18n';

const translate = createTranslator();

describe('translator', () => {
    it('uses the exact language when available', () => {
        assert.equal(translate('es', 'cancel'), 'Cancelar');
    });

    it('falls back to the base language for regional codes', () => {
        assert.equal(translate('es-419', 'cancel'), 'Cancelar');
        assert.equal(translate('ES', 'cancel'), 'Cancelar');
    });

    it('falls back to English for unknown or missing languages', () => {
        assert.equal(translate('xx', 'cancel'), 'Cancel');
        assert.equal(translate(undefined, 'cancel'), 'Cancel');
    });

    it('fills in variables', () => {
        assert.match(translate('en', 'start', { name: 'Ada' }), /^Hi Ada,/);
    });
});
