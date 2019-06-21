const Color = require(`color`);

const isLight = c => Color(c).lightness() > 60;

/**
 * Changes to brightness of a color.
 * @param {number} ratio A number between -100 and 100 (if it is negative, `color` will be darkened)
 * @returns {string} A color with lightness of `color.lightness() + ratio`
 */
const adjustBrightness = (color, ratio) => {
    const object = Color(color);
    return object.lightness(object.lightness() + ratio).hex();
};

/**
 * Changes the brightness of `a` according to `b` using `adjustBrightness()`. if `b` is false, `ratio` will be negated.
 */
const mixBrightness = (a, b, ratio) => adjustBrightness(a, b ? ratio : -ratio);

const getFgColor = bg => isLight(bg) ? adjustBrightness(bg, -45) : `#ffffff`;

const themeData = colors => {
    const [filling, text, secondaryText, primary] = colors,
        isLightTheme = isLight(filling),
        textOnPrimary = getFgColor(primary),
        background = adjustBrightness(filling, -6.5),
        backgroundText = mixBrightness(text, isLightTheme, 8);

    return {
        background,
        filling,
        text,
        backgroundText,
        secondaryText,
        primary,
        textOnPrimary,
        isLightTheme,
        author: process.env.BOT_USERNAME,
    };
};

module.exports = {
    isLight, adjustBrightness, mixBrightness, getFgColor, themeData,
};
