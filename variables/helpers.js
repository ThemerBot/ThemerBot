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

module.exports = {
    isLight, adjustBrightness, mixBrightness, getFgColor,
};
