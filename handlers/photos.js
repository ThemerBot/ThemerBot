const Sentry = require(`@sentry/node`);
const debug = require(`debug`)(`themerbot:handler:photos`);

const allowedMimeTypes = [`image/png`, `image/jpeg`];

module.exports = bot => {
    bot.on([`photo`, `document`], async (ctx, next) => {
        const { sender_chat, forward_from } = ctx.message;
        if (forward_from && forward_from.id === ctx.botInfo.id) {
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

        if (sender_chat) {
            await ctx.reply(ctx.i18n(`anonymous_admins`));
            return;
        }

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

            await ctx.saveTheme(message_id, {
                photo,
                colors,
                using: [],
            });
        } catch (error) {
            debug(error);
            Sentry.captureException(error);
            await ctx.reply(ctx.i18n(`error`));
        }
    });
};
