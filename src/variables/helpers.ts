import Color from 'color';

interface ThemeData {
    background: string;
    filling: string;
    text: string;
    backgroundText: string;
    secondaryText: string;
    primary: string;
    textOnPrimary: string;
    themeIsLight: boolean;
    bubbleOutColor: string;
}

export const isLight = (color: string): boolean => Color(color).isLight();

export const adjustBrightness = (
    color: string,
    ratio: number,
    invert = false,
): string => {
    const object = Color(color);

    return object
        .lightness(object.lightness() + (invert ? -ratio : ratio))
        .hex();
};

export const getForegroundColor = (background: string): string =>
    isLight(background) ? adjustBrightness(background, -45) : '#ffffff';

export const themeData = ([filling, text, primary]: string[]): ThemeData => {
    const themeIsLight = isLight(filling);
    const textOnPrimary = getForegroundColor(primary);
    const background = adjustBrightness(filling, -6.5);
    const secondaryText = Color(filling).mix(Color(text), 0.4).hex();
    const backgroundText = adjustBrightness(secondaryText, -10, themeIsLight);
    const bubbleOutColor = adjustBrightness(
        themeIsLight ? primary : filling,
        themeIsLight ? 41 : -3,
    );

    return {
        background,
        filling,
        text,
        backgroundText,
        secondaryText,
        primary,
        textOnPrimary,
        themeIsLight,
        bubbleOutColor,
    };
};
