const Attheme = require(`attheme-js`).default;

const atthemeVariables = require(`../variables/attheme`);
const tgxVariables = require(`../variables/tgx-theme`);
const tgiosVariables = require(`../variables/tgios-theme`);

module.exports = bot => {
    bot.context.makeThemeName = function (background, primary) {
        return `${this.getColorName(primary)} on ${this.getColorName(background)}`;
    };

    bot.context.makeTheme = function ({ image, name, colors, type }) {
        const _colors = colors.map(x => x.color);

        switch (type) {
            case `attheme`: {
                const variables = atthemeVariables(_colors)
                    .split(`\n`)
                    .map(line => line.trim())
                    .join(`\n`);

                const theme = new Attheme(variables);
                theme.setWallpaper(image.toString(`binary`));

                return theme.toString(`int`);
            }

            case `tgx-theme`: {
                const theme = tgxVariables(name, _colors, this.botInfo.username);

                return theme
                    .split(`\n`)
                    .map(line => line.trim())
                    .slice(1)
                    .join(`\n`);
            }

            case `tgios-theme`: {
                const theme = tgiosVariables(name, _colors);

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
