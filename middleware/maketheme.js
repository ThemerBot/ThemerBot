const Attheme = require(`attheme-js`).default;

const ntc = require(`./ntc`);
const atthemeVariables = require(`../variables/attheme`);
const tgxVariables = require(`../variables/tgx-theme`);
const tgiosVariables = require(`../variables/tgios-theme`);

module.exports = bot => {
    bot.context.makeThemeName = (background, primary) => {
        return `${ntc.name(primary)[1]} on ${ntc.name(background)[1]}`;
    };

    bot.context.makeTheme = ({ image, name, colors, type }) => {
        switch (type) {
            case `attheme`: {
                const variables = atthemeVariables(colors)
                    .split(`\n`)
                    .map(line => line.trim())
                    .join(`\n`);

                const theme = new Attheme(variables);
                theme.setWallpaper(image.toString(`binary`));

                return theme.toString(`int`);
            }

            case `tgx-theme`: {
                const theme = tgxVariables(name, colors);

                return theme
                    .split(`\n`)
                    .map(line => line.trim())
                    .slice(1)
                    .join(`\n`);
            }

            case `tgios-theme`: {
                const theme = tgiosVariables(name, colors);

                return theme
                    .split(`\n`)
                    .map(line => line.slice(8))
                    .join(`\n`)
                    .trim();
            }

            default:
                throw new TypeError(`Unknown type: ${type}`);
        }
    };
};
