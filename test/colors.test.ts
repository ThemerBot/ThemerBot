import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import sharp from 'sharp';
import { getImageColors, labelColors } from '../src/utils/colors';

const solidImage = (width: number, height: number, color: string) =>
    sharp({ create: { width, height, channels: 3, background: color } })
        .png()
        .toBuffer();

describe('getImageColors', () => {
    it('returns five lowercase hex colors', async () => {
        const colors = await getImageColors(
            await solidImage(16, 16, '#336699'),
        );

        assert.equal(colors.length, 5);
        for (const color of colors) {
            assert.match(color, /^#[0-9a-f]{6}$/);
        }
    });

    it('fills every slot when the image yields a short palette', async () => {
        const colors = await getImageColors(await solidImage(1, 1, '#ff0000'));

        assert.equal(colors.length, 5);
        assert.equal(new Set(colors).size, 1);
    });

    it('rejects images without any opaque pixels', async () => {
        const transparent = await sharp({
            create: {
                width: 8,
                height: 8,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
        })
            .png()
            .toBuffer();

        await assert.rejects(getImageColors(transparent));
    });
});

describe('labelColors', () => {
    const using = [
        { label: '1', color: '#abcdef' },
        { label: '', color: '#000000' },
    ];

    it('uppercases colors and includes labels', () => {
        assert.deepEqual(labelColors(using), ['1 (#ABCDEF)', '#000000']);
    });

    it('omits labels when asked', () => {
        assert.deepEqual(labelColors(using, false), ['#ABCDEF', '#000000']);
    });
});
