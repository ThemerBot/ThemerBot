import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    formatDonationLinks,
    parseDonationLinks,
} from '../src/utils/donation-links';

describe('parseDonationLinks', () => {
    it('parses comma or newline separated Label=URL pairs', () => {
        assert.deepEqual(
            parseDonationLinks(
                'ko-fi=ko-fi.com/name, PayPal = https://paypal.me/name\nBuy Me a Coffee=buymeacoffee.com/name',
            ),
            [
                { label: 'ko-fi', url: 'ko-fi.com/name' },
                { label: 'PayPal', url: 'https://paypal.me/name' },
                { label: 'Buy Me a Coffee', url: 'buymeacoffee.com/name' },
            ],
        );
    });

    it('keeps "=" characters inside URLs', () => {
        assert.deepEqual(parseDonationLinks('Site=https://x.com/?a=1'), [
            { label: 'Site', url: 'https://x.com/?a=1' },
        ]);
    });

    it('returns no links for empty input', () => {
        assert.deepEqual(parseDonationLinks(' , '), []);
    });

    it('rejects malformed entries', () => {
        for (const input of ['ko-fi', '=url', 'ko-fi=', 'a=b c']) {
            assert.throws(() => parseDonationLinks(input), /Label=URL/);
        }
    });
});

describe('formatDonationLinks', () => {
    it('lists one link per line', () => {
        assert.equal(
            formatDonationLinks([
                { label: 'ko-fi', url: 'ko-fi.com/name' },
                { label: 'PayPal', url: 'paypal.me/name' },
            ]),
            'ko-fi: ko-fi.com/name\nPayPal: paypal.me/name',
        );
    });
});
