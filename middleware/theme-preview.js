/**
 * https://gitlab.com/AlexStrNik/attheme-preview
 */

const fs = require(`fs`);
const path = require(`path`);
const Attheme = require(`attheme-js`).default;
const Color = require(`@snejugal/color`);
const fallbacks = require(`attheme-js/lib/fallbacks`).default;
const sharp = require(`sharp`);
const sizeOf = require(`image-size`);
const { DOMParser, XMLSerializer } = require(`xmldom`);
const { serializeToString: serialize } = new XMLSerializer();

const templatePath = path.join(__dirname, `../assets/theme-preview.svg`);
const template = fs.readFileSync(templatePath, `utf8`);
const parser = new DOMParser();

const get = (node, className, tag) =>
    Array.from(node.getElementsByTagName(tag)).filter(
        element =>
            element.getAttribute && element.getAttribute(`class`) === className,
    );

const getElementsByClassName = (node, className) => [
    ...get(node, className, `rect`),
    ...get(node, className, `circle`),
    ...get(node, className, `path`),
    ...get(node, className, `g`),
    ...get(node, className, `polygon`),
    ...get(node, className, `image`),
    ...get(node, className, `tspan`),
    ...get(node, className, `stop`),
];

const fill = (node, color) => {
    const { red, green, blue, alpha } = color;
    const rgba = `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;

    if (node.tagName === `stop`) {
        node.setAttribute(`stop-color`, rgba);
    } else {
        node.setAttribute(`fill`, rgba);
    }

    if (node.childNodes) {
        for (const child of Array.from(node.childNodes)) {
            if (child.setAttribute) {
                fill(child, color);
            }
        }
    }
};

const createPreview = async ({ name, type, theme }) => {
    if (![`attheme`].includes(type)) {
        return null;
    }

    const attheme = new Attheme(theme);
    attheme.fallbackToSelf(fallbacks);

    const preview = parser.parseFromString(template);

    const inBubble = attheme.get(`chat_inBubble`);
    const outBubble = attheme.get(`chat_outBubble`);

    if (
        inBubble &&
        outBubble &&
        Color.brightness(inBubble) > Color.brightness(outBubble)
    ) {
        attheme.set(`chat_{in/out}Bubble__darkest`, inBubble);
    } else if (outBubble) {
        attheme.set(`chat_{in/out}Bubble__darkest`, outBubble);
    }

    for (const [variable, color] of attheme) {
        const elements = getElementsByClassName(preview, variable);

        for (const element of elements) {
            fill(element, color);
        }
    }

    const elements = getElementsByClassName(preview, `IMG`);

    await Promise.all(
        elements.map(async element => {
            const chatWidth = Number(element.getAttribute(`width`));
            const chatHeight = Number(element.getAttribute(`height`));
            const ratio = chatHeight / chatWidth;

            if (attheme.hasWallpaper()) {
                const imageBuffer = Buffer.from(
                    attheme.getWallpaper(),
                    `binary`,
                );

                const { width, height } = sizeOf(imageBuffer);
                const imageRatio = height / width;

                let finalHeight;
                let finalWidth;

                if (ratio > imageRatio) {
                    finalHeight = chatHeight;
                    finalWidth = Math.round(chatHeight / imageRatio);
                } else {
                    finalWidth = chatWidth;
                    finalHeight = Math.round(chatWidth * imageRatio);
                }

                const resizedImage = await sharp(imageBuffer)
                    .resize(finalWidth, finalHeight)
                    .png()
                    .toBuffer();

                const croppedImage = await sharp(resizedImage)
                    .resize(chatWidth, chatHeight)
                    .png()
                    .toBuffer();

                element.setAttribute(
                    `xlink:href`,
                    `data:image/png;base64,${croppedImage.toString(`base64`)}`,
                );
            }
        }),
    );

    for (const element of getElementsByClassName(preview, `theme_name`)) {
        element.textContent = name;
    }

    for (const element of getElementsByClassName(preview, `theme_author`)) {
        element.textContent = `by @ThemerBot`;
    }

    const templateBuffer = Buffer.from(serialize(preview), `binary`);

    return sharp(templateBuffer, { density: 150 }).png().toBuffer();
};

module.exports = bot => {
    bot.context.createThemePreview = createPreview;
};
