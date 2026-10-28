import ntc from '@youtwitface/ntcjs';
import Color from 'color';
import getPalette from 'get-rgba-palette';
import sharp from 'sharp';
import { Theme } from '../types';

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

    return getPalette(pixels, 5).map(([red, green, blue]) =>
        Color({ r: red, g: green, b: blue }).hex(),
    );
};

export const getColorName = (color: string): string => {
    return ntc(color)[1];
};
