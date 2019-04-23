module.exports = bot => {
    bot.on(`callback_query`, async ctx => {
        const { data } = ctx.callbackQuery;

        if (data.startsWith(`cancel`)) {
            if (data.split(`,`).pop() == ctx.from.id) {
                await ctx.deleteMessage();
                ctx.theme = null;
            } else {
                await ctx.answerCbQuery(ctx.i18n(`not_your_theme`));
            }

            return;
        }

        // Check if `ctx.theme` has any properties
        if (!ctx.theme || Object.keys(ctx.theme).length === 0) {
            return await ctx.answerCbQuery(ctx.i18n(`no_theme_found`), true);
        }

        switch (data) {
            case `default`: { // Default button
                await ctx.editMessageCaption(ctx.i18n(`type_of_theme`), typeKeyboard);

                const { colors } = ctx.theme;

                ctx.theme.using = [
                    colors[0],
                    colors[4],
                    colors[3],
                ];

                break;
            }

            case `-`: { // Backspace
                ctx.theme.using.pop();

                const length = ctx.theme.using.length;
                const keyboard = ctx.keyboard(length > 0);

                await ctx.editMessageCaption(
                    ctx.i18n(`choose_color_${length + 1}`),
                    { reply_markup: keyboard }
                );

                break;
            }

            case `tgx-theme`:
            case `attheme`: {
                const typing = ctx.action(`upload_photo`);
                const name = ctx.makeThemeName();
                const { photo, using } = ctx.theme;

                const theme = ctx.makeTheme({
                    type: data,
                    name: name,
                    image: photo,
                    colors: using,
                });

                const { message_id, document } = await ctx.editMessageMedia({
                    caption: `Made by @CreateAtthemeBot\n#theme ${using.join(` `)}`,
                    type: `document`,
                    media: {
                        source: Buffer.from(theme, `binary`),
                        filename: `${name} by @CreateAtthemeBot.${data}`,
                    },
                });

                await bot.telegram.editMessageReplyMarkup(
                    ctx.chat.id,
                    message_id,
                    null,
                    ctx.shareKeyboard(document.file_id)
                );

                typing.stop();
                ctx.theme = null;
                break;
            }

            default: { // All colors and type
                const keyboard = ctx.keyboard(true);
                const color = ctx.theme.colors[data];

                if (ctx.theme.using[0] === color) {
                    return ctx.answerCbQuery(ctx.i18n(`cant_reuse_bg`));
                }

                ctx.theme.using.push(color);
                const { length } = ctx.theme.using;

                if (length < 3) {
                    await ctx.editMessageCaption(
                        ctx.i18n(`choose_color_${length + 1}`),
                        { reply_markup: keyboard }
                    );
                } else {
                    await ctx.editMessageCaption(ctx.i18n(`type_of_theme`), ctx.typeKeyboard);
                }
            }
        }

        await ctx.answerCbQuery();
    });
};
