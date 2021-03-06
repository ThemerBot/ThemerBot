const Attheme = require(`attheme-js`).default;
const debug = require(`debug`)(`themerbot:handlers:fix`);

const toHex = ({ red, green, blue }) =>
    `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;

module.exports = bot => {
    // Only support attheme for now
    const isThemeFileRegex = /\.attheme$/;

    bot.on(`document`, async (ctx, next) => {
        const { document, ...message } = ctx.message;

        const isThemeFile =
            document && isThemeFileRegex.test(document.file_name);

        if (isThemeFile) {
            debug(`Downloading theme file`);
            const file = await ctx.downloadFile(true);
            debug(`Theme downloaded successfully`);
            const fileName = document.file_name;
            const oldTheme = new Attheme(file.toString(`binary`));

            let colors = [
                oldTheme.get(`actionBarActionModeDefault`),
                oldTheme.get(`actionBarActionModeDefaultIcon`),
                oldTheme.get(`chat_outVoiceSeekbar`),
            ];

            if (colors.some(color => !color)) {
                await ctx.reply(ctx.i18n(`cannot_fix`));
                return next();
            }

            colors = colors.map(color => toHex(color));

            debug(`Recreating theme`);
            const theme = ctx.makeTheme({
                type: fileName.split(`.`).pop(),
                name: fileName,
                image: oldTheme.getWallpaper() || ``,
                colors: colors,
            });

            debug(`Sending theme`);
            await ctx.replyWithDocument(
                {
                    source: Buffer.from(theme.toString(`int`), `binary`),
                    filename: fileName,
                },
                {
                    caption: `#theme ${colors.join(` `)}`,
                    reply_to_message_id: message.message_id,
                },
            );
        }

        return next();
    });
};
