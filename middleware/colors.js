const path = require(`path`);
const fs = require(`promise-fs`);
const { default: querySelector } = require(`query-selector`);
const { DOMParser, XMLSerializer } = require(`xmldom`);
const { serializeToString: serialize } = new XMLSerializer();
const sharp = require(`sharp`);
const getColors = require(`get-image-colors`);
const ntc = require(`./ntc`);
const svgPath = path.join(__dirname, `../assets/colors.svg`);
const { isLight } = require(`../variables/helpers`);

const querySelectorAll = (context, query) => querySelector(query, context);

module.exports = bot => {
    bot.context.labelColors = (colors, includeLabel = true) => {
        return colors.map(x => {
            const color = x.color.toUpperCase();
            return includeLabel && x.label ? `${x.label} (${color})` : color;
        });
    };

    bot.context.getColorName = color => {
        return ntc.name(color)[1];
    };

    bot.context.getImageColors = async (buffer, type) => {
        const colors = await getColors(buffer, type || `image/jpeg`);
        return colors.map(color => color.hex());
    };

    bot.context.makeColorsPreview = async colors => {
        const svgFile = await fs.readFile(svgPath, `utf8`);
        const svg = new DOMParser().parseFromString(svgFile);

        const backgrounds = querySelectorAll(svg, `.color .bg`);
        const texts = querySelectorAll(svg, `.color .text`);

        colors.forEach((color, index) => {
            const background = backgrounds[index];
            const text = texts[index];

            background.setAttribute(`fill`, color);
            text.setAttribute(`fill`, isLight(color) ? `#000000` : `#ffffff`);
        });

        const autoBackgrounds = querySelectorAll(svg, `.bg-auto`);
        const [autoText] = querySelectorAll(svg, `.text-auto`);

        autoText.setAttribute(`fill`, isLight(colors[4]) ? `#000000` : `#ffffff`);

        autoBackgrounds[0].setAttribute(`fill`, colors[4]);
        autoBackgrounds[1].setAttribute(`fill`, colors[3]);
        autoBackgrounds[2].setAttribute(`fill`, colors[0]);

        const svgBuffer = Buffer.from(serialize(svg), `binary`);
        const image = await sharp(svgBuffer).png().toBuffer();

        return image;
    };
};
