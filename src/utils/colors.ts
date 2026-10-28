import ntc from '@youtwitface/ntcjs';
import Color from 'color';
import getPalette from 'get-rgba-palette';
import sharp from 'sharp';
import { Theme } from '../types';

const PALETTE_SIZE = 5;

export const labelColors = (
    colors: Theme['using'],
    includeLabel = true,
): string[] => {
    return colors.map(x => {
        const color = x.color.toUpperCase();
        return includeLabel && x.label ? `${x.label} (${color})` : color;
    });
};

export const getImageColors = async (
    buffer: string | Buffer,
): Promise<string[]> => {
    const pixels = await sharp(buffer)
        .toColourspace('srgb')
        .ensureAlpha()
        .raw()
        .toBuffer();

    const colors = getPalette(pixels, PALETTE_SIZE).map(([red, green, blue]) =>
        Color({ r: red, g: green, b: blue }).hex().toLowerCase(),
    );

    if (colors.length === 0) {
        throw new Error('Unable to extract any colors from the image');
    }

    return Array.from(
        { length: PALETTE_SIZE },
        (_, i) => colors[i % colors.length],
    );
};

export const getColorName = (color: string): string => {
    return ntc(color)[1];
};
