const path = require(`path`);
const fs = require(`promise-fs`);
const { default: querySelector } = require(`query-selector`);
const { DOMParser, XMLSerializer } = require(`xmldom`);
const { serializeToString: serialize } = new XMLSerializer();
const getColors = require(`get-image-colors`);
const svgPath = path.join(__dirname, `../assets/colors.svg`);
const { isLight } = require(`../variables/helpers`);

const querySelectorAll = (context, query) => querySelector(query, context);

module.exports = bot => {
    bot.context.getImageColors = async (buffer, type) => {
        const colors = await getColors(buffer, type || `image/jpeg`);
        return colors.map(color => color.hex());
    };

    bot.context.makeColorsPreview = async function (colors) {
        const svgFile = await fs.readFile(svgPath, `utf8`);
        const document = new DOMParser().parseFromString(svgFile);

        const backgrounds = querySelectorAll(document, `.color .bg`);
        const texts = querySelectorAll(document, `.color .text`);

        colors.forEach((color, index) => {
            const background = backgrounds[index];
            const text = texts[index];

            background.setAttribute(`fill`, color);
            text.setAttribute(`fill`, isLight(color) ? `#000000` : `#ffffff`);
        });

        const autoBackgrounds = querySelectorAll(document, `.bg-auto`);
        const [autoText] = querySelectorAll(document, `.text-auto`);

        autoText.setAttribute(`fill`, isLight(colors[4]) ? `#000000` : `#ffffff`);

        autoBackgrounds[0].setAttribute(`fill`, colors[4]);
        autoBackgrounds[1].setAttribute(`fill`, colors[3]);
        autoBackgrounds[2].setAttribute(`fill`, colors[0]);

        const svg = document.getElementsByTagName(`svg`)[0];
        const width = Number(svg.getAttribute(`width`).replace(`px`, ``));
        const height = Number(svg.getAttribute(`height`).replace(`px`, ``));

        const page = await this.browser.newPage();
        await page.setViewport({
            width,
            height,
            deviceScaleFactor: 0,
        });

        await page.goto(`data:text/html,`);
        await page.setContent(`
            <style>
                * {
                    margin: 0;
                }
            </style>
            ${serialize(document)}
        `);

        const screenshot = await page.screenshot();
        await page.close();

        return screenshot;
    };
};
