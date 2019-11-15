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
 * Darkens or brightens a color, depending to a given boolean value, using `adjustBrigtness()`.
 * @param color target color
 * @param {boolean} light if false, `ratio` is negated and resulting color is darker.
 * @param {number} ratio
 */
const mixBrightness = (color, light, ratio) =>
    adjustBrightness(color, light ? ratio : -ratio);

const getFgColor = bg => (isLight(bg) ? adjustBrightness(bg, -45) : `#ffffff`);

const themeData = colors => {
    const [filling, text, secondaryText, primary] = colors,
        themeIsLight = isLight(filling),
        textOnPrimary = getFgColor(primary),
        background = adjustBrightness(filling, -6.5),
        backgroundText = mixBrightness(secondaryText, themeIsLight, 5);

    return {
        background,
        filling,
        text,
        backgroundText,
        secondaryText,
        primary,
        textOnPrimary,
        themeIsLight,
        author: process.env.BOT_USERNAME,
    };
};

module.exports = {
    isLight,
    adjustBrightness,
    mixBrightness,
    getFgColor,
    themeData,
};
