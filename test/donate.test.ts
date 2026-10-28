import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getInvoice, parseAmount } from '../src/handlers/donate';
import { createTranslator } from '../src/utils/i18n';

const translate = createTranslator();
const t = (keyword: string) => translate('en', keyword);

describe('parseAmount', () => {
    it('parses whole and fractional dollar amounts into cents', () => {
        assert.equal(parseAmount('5'), 500);
        assert.equal(parseAmount('$12.50'), 1250);
        assert.equal(parseAmount('USD 3.999'), 399);
        assert.equal(parseAmount(' usd $ 7 '), 700);
    });

    it('rejects text that is not an amount', () => {
        assert.equal(parseAmount('five dollars'), null);
    });
});

describe('getInvoice', () => {
    it('enforces Telegram limits', () => {
        assert.deepEqual(getInvoice(99, t), {
            valid: false,
            text: 'Sorry, Telegram has a minimum of $1.',
        });
        assert.equal(getInvoice(1000001, t).valid, false);
        assert.equal(getInvoice(NaN, t).valid, false);
    });

    it('creates an invoice for a valid amount', () => {
        const invoice = getInvoice(500, t);

        assert.equal(invoice.valid, true);
        if (invoice.valid) {
            assert.deepEqual(invoice.prices, [
                { label: 'Donate', amount: 500 },
            ]);
            assert.equal(invoice.extra.provider_token, 'stripe-test-token');
        }
    });
});
