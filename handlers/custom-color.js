const Sentry = require(`@sentry/node`);
const { asyncHandler } = require(`../middleware/errors`);

module.exports = bot => {
    bot.hears(/^#(?:[\da-f]{3}){1,2}$/i, asyncHandler(async ctx => {
        const { reply_to_message: reply } = ctx.message;

        if (!reply) {
            return await ctx.reply(ctx.i18n(`invalid_reply`));
        }

        const { message_id: themeId } = reply;
        const theme = await ctx.getTheme(themeId);

        if (!theme) {
            return await ctx.reply(ctx.i18n(`no_theme_found`));
        }

        let [color] = ctx.match;
        if (color.length === 4) {
            color =
                `#` +
                color
                    .slice(1)
                    .split(``)
                    .map(c => c.repeat(2))
                    .join(``);
        }

        if (theme.using[0] === color) {
            return ctx.reply(ctx.i18n(`cant_reuse_bg`));
        }

        theme.using.push(color);
        await ctx.saveTheme(themeId, theme);

        const keyboard = ctx.keyboard(true);
        const { length } = theme.using;

        const captionArgs = [ctx.chat.id, themeId, null];

        if (length < 4) {
            await ctx.telegram.editMessageCaption(
                ...captionArgs,
                ctx.i18n(`choose_color_${length + 1}`, {
                    colors: theme.using.join(`, `),
                }),
                { reply_markup: keyboard },
            );
        } else {
            await ctx.telegram.editMessageCaption(
                ...captionArgs,
                ctx.i18n(`type_of_theme`),
                ctx.typeKeyboard(),
            );
        }

        try {
            await ctx.deleteMessage();
        } catch (error) {
            Sentry.captureException(error);
        }
    }));
};
