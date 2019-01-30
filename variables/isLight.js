// Brightness and isLight are copied from:
// https://www.npmjs.com/package/@snejugal/color

const brightness = hex => {
    const { red, green, blue } = {
        red: parseInt(hex.slice(0, 2), 16),
        green: parseInt(hex.slice(2, 4), 16),
        blue: parseInt(hex.slice(4, 6), 16),
    };

    const redPart = 0.2126 * (red / 255);
    const greenPart = 0.7152 * (green / 255);
    const bluePart = 0.0722 * (blue / 255);

    return redPart + greenPart + bluePart;
};

const isLight = color => brightness(color) > 0.6;

module.exports = isLight;
