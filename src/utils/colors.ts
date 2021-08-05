import getColors from 'get-image-colors';
import { Theme } from '../types';
import ntc from '@youtwitface/ntcjs';

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
    type?: string,
): Promise<string[]> => {
    let colors;
    if (typeof buffer === 'string') {
        colors = await getColors(buffer);
    } else {
        colors = await getColors(buffer, type ?? 'image/jpeg');
    }

    return colors.map(color => color.hex());
};

export const getColorName = (color: string): string => {
    return ntc(color)[1];
};
