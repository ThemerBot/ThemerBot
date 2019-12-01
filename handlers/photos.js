const allowedMimeTypes = [`image/png`, `image/jpeg`];

module.exports = bot => {
    bot.on([`photo`, `document`], async (ctx, next) => {
        const { forward_from } = ctx.message;
        if (
            forward_from &&
            forward_from.username === process.env.BOT_USERNAME
        ) {
            return;
        }

        let mimeType = `image/jpeg`;
        if (ctx.message.document) {
            mimeType = ctx.message.document.mime_type;
            const { file_size: fileSize } = ctx.message.document;

            if (!allowedMimeTypes.includes(mimeType)) {
                return next();
            } else if (fileSize > 1000000) {
                return await ctx.reply(ctx.i18n(`image_too_big`));
            }
        }

        const typing = ctx.action(`upload_photo`);

        try {
            let photo;
            if (ctx.message.document) {
                photo = await ctx.downloadFile();
            } else {
                photo = await ctx.downloadPhoto();
            }

            const colors = await ctx.getImageColors(photo, mimeType);
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
