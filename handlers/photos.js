module.exports = bot => {
    bot.on(`photo`, async ctx => {
        const { forward_from } = ctx.message;
        if (forward_from && forward_from.username === process.env.USERNAME) return;

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
                }
            );

            ctx.theme = {
                photo,
                colors,
                using: [],
                message_id,
            };
        } catch (e) {
            await ctx.reply(ctx.i18n(`error`));
        } finally {
            typing.stop();
        }
    });
};
