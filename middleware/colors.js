const path = require(`path`);
const fs = require(`promise-fs`);
const { DOMParser, XMLSerializer } = require(`xmldom`);
const { serializeToString: serialize } = new XMLSerializer();
const sharp = require(`sharp`);
const getColors = require(`get-image-colors`);
const svgPath = path.join(__dirname, `../colors.svg`);
const { getFgColor } = require(`../variables/helpers`);

module.exports = bot => {
    bot.context.getImageColors = async (buffer, type) => {
        const colors = await getColors(buffer, type || `image/jpeg`);
        return colors.map(color => color.hex());
    };

    bot.context.makeColorsPreview = async colors => {
        const svgFile = await fs.readFile(svgPath, `utf8`);
        const svg = new DOMParser().parseFromString(svgFile);

        // Get rect
        const rects = svg.getElementsByTagName(`rect`);
        const texts = svg.getElementsByTagName(`text`);
        for (let i = 0; i < 5; i++) {
            const color = colors[i];
            rects[i].setAttribute(`fill`, color);
            texts[i].setAttribute(`fill`, getFgColor(color));
        }

        const defaultColors = svg.getElementsByTagName(`path`);
        defaultColors[0].setAttribute(`fill`, colors[4]);
        defaultColors[1].setAttribute(`fill`, colors[3]);
        defaultColors[2].setAttribute(`fill`, colors[0]);

        const svgBuffer = Buffer.from(serialize(svg), `binary`);
        const image = await sharp(svgBuffer).png().toBuffer();

        return image;
    };
};
