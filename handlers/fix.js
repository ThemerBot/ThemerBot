const Attheme = require(`attheme-js`).default;

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
            const typing = ctx.action(`upload_photo`);
            const file = await ctx.downloadFile();
            const fileName = document.file_name;
            const oldTheme = new Attheme(file.toString(`binary`));

            const colors = [
                toHex(oldTheme.get(`actionBarActionModeDefault`)),
                toHex(oldTheme.get(`actionBarActionModeDefaultIcon`)),
                toHex(oldTheme.get(`chat_outVoiceSeekbar`)),
            ];

            const theme = ctx.makeTheme({
                type: fileName.split(`.`).pop(),
                name: fileName,
                image: oldTheme.getWallpaper() || ``,
                colors: colors,
            });

            const reply = await ctx.replyWithDocument(
                {
                    source: Buffer.from(theme.toString(`int`), `binary`),
                    filename: fileName,
                },
                {
                    caption: `#theme ${colors.join(` `)}`,
                    reply_to_message_id: message.message_id,
                },
            );

            await bot.telegram.editMessageReplyMarkup(
                ctx.chat.id,
                reply.message_id,
                null,
                ctx.shareKeyboard(reply.document.file_id),
            );

            typing.stop();
        }

        return next();
    });
};
