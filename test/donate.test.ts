import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getInvoice, parseAmount } from '../src/handlers/donate';

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
        assert.equal(getInvoice(99).valid, false);
        assert.equal(getInvoice(1000001).valid, false);
        assert.equal(getInvoice(NaN).valid, false);
    });

    it('creates an invoice for a valid amount', () => {
        const invoice = getInvoice(500);

        assert.equal(invoice.valid, true);
        if (invoice.valid) {
            assert.deepEqual(invoice.prices, [
                { label: 'Donate', amount: 500 },
            ]);
            assert.equal(invoice.extra.provider_token, 'stripe-test-token');
        }
    });
});
