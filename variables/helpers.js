const Color = require(`color`);

const isLight = c => Color(c).isLight();

/**
 * Changes to brightness of a color.
 * @param {number} ratio A number between -100 and 100 (if it is negative, `color` will be darkened)
 * @param {boolean} [invert] if true, ratio is negated.
 * @returns {string} A color with lightness of `color.lightness() + ratio`
 */
function adjustBrightness(color, ratio, invert = false) {
    const object = Color(color);
    return object.lightness(
        object.lightness() + (invert ? -ratio : ratio)
    ).hex();
}

const getFgColor = bg => (isLight(bg) ? adjustBrightness(bg, -45) : `#ffffff`);

function themeData([filling, text, secondaryText, primary]) {
    const themeIsLight = isLight(filling),
        textOnPrimary = getFgColor(primary),
        background = adjustBrightness(filling, -6.5),
        backgroundText = adjustBrightness(secondaryText, 5, themeIsLight),
        bubbleOutColor = adjustBrightness(
            themeIsLight ? primary : filling,
            themeIsLight ? 41 : -3
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
        author: process.env.BOT_USERNAME,
    };
}

module.exports = {
    isLight,
    adjustBrightness,
    getFgColor,
    themeData,
};
