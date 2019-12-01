module.exports = bot => {
    bot.on(`photo`, async ctx => {
        const { forward_from } = ctx.message;
        if (
            forward_from &&
            forward_from.username === process.env.BOT_USERNAME
        ) {
            return;
        }

        const typing = ctx.action(`upload_photo`);

        try {
            const photo = await ctx.downloadPhoto();
            const colors = await ctx.getImageColors(photo);
            const previewPhoto = await ctx.makeColorsPreview(colors);
            const keyboard = ctx.keyboard();

            const { message_id } = await ctx.replyWithPhoto(
                { source: previewPhoto },
                {
                    reply_markup: keyboard,
                    caption: ctx.i18n(`choose_color_1`),
                    reply_to_message_id: ctx.message.message_id,
                },
            );

            ctx.saveTheme(message_id, {
                photo,
                colors,
                using: [],
            });
        } catch (e) {
            await ctx.reply(ctx.i18n(`error`));
        } finally {
            typing.stop();
        }
    });
};
