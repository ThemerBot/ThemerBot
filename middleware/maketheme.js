const Attheme = require(`attheme-js`).default;

const atthemeVariables = require(`../variables/attheme`);
const tgxVariables = require(`../variables/tgx-theme`);
const tgiosVariables = require(`../variables/tgios-theme`);

const random = max => Math.floor(Math.random() * max);

module.exports = bot => {
    bot.context.makeThemeName = () => {
        const chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;

        return Array.from({ length: 5 }, () =>
            chars.charAt(random(chars.length))
        ).join(``);
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
                throw new TypeError(`Unknow type: ${type}`);
        }
    };
};
