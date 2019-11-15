const messageNotModified = `Bad Request: message is not modified: specified new message content and reply markup are exactly the same as a current content and reply markup of the message`;

module.exports = bot => {
    bot.on(`callback_query`, async ctx => {
        const { data } = ctx.callbackQuery;
        const { message_id: themeId } = ctx.callbackQuery.message;
        const theme = ctx.getTheme(themeId);

        if (data.startsWith(`cancel`)) {
            if (data.split(`,`).pop() == ctx.from.id) {
                await ctx.deleteMessage();
                ctx.saveTheme(themeId, null);
            } else {
                await ctx.answerCbQuery(ctx.i18n(`not_your_theme`));
            }

            return;
        }

        if (!theme) {
            return await ctx.answerCbQuery(ctx.i18n(`no_theme_found`), true);
        }

        switch (data) {
            case `default`: { // Default button
                await ctx.editMessageCaption(ctx.i18n(`type_of_theme`), ctx.typeKeyboard());

                const { colors } = theme;

                theme.using = [
                    colors[0],
                    colors[4],
                    colors[3],
                    colors[1],
                ];

                ctx.saveTheme(themeId, theme);

                break;
            }

            case `-`: { // Backspace
                theme.using.pop();
                ctx.saveTheme(themeId, theme);

                const { length } = theme.using;
                const keyboard = ctx.keyboard(length > 0);

                await ctx.editMessageCaption(
                    ctx.i18n(`choose_color_${length + 1}`, {
                        colors: theme.using.join(`, `),
                    }),
                    { reply_markup: keyboard }
                );

                break;
            }

            case `tgios-theme`:
            case `tgx-theme`:
            case `attheme`: {
                const typing = ctx.action(`upload_photo`);
                const name = ctx.makeThemeName();
                const { photo, using } = theme;

                const completedTheme = ctx.makeTheme({
                    type: data,
                    name: name,
                    image: photo,
                    colors: using,
                });

                const { message_id, document } = await ctx.editMessageMedia({
                    caption: `Made by @CreateAtthemeBot\n#theme ${using.join(` `)}`,
                    type: `document`,
                    media: {
                        source: Buffer.from(completedTheme, `binary`),
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
                ctx.saveTheme(themeId, null);
                break;
            }

            default: { // All colors and type
                const color = theme.colors[data];

                if (theme.using[0] === color) {
                    return ctx.answerCbQuery(ctx.i18n(`cant_reuse_bg`));
                }

                theme.using.push(color);
                ctx.saveTheme(themeId, theme);

                const keyboard = ctx.keyboard(true);
                const { length } = theme.using;

                if (length < 4) {
                    await ctx.editMessageCaption(
                        ctx.i18n(`choose_color_${length + 1}`, {
                            colors: theme.using.join(`, `),
                        }),
                        { reply_markup: keyboard }
                    );
                } else {
                    try {
                        await ctx.editMessageCaption(ctx.i18n(`type_of_theme`), ctx.typeKeyboard());
                    } catch (e) {
                        if (e.description === messageNotModified) {
                            return await ctx.answerCbQuery(ctx.i18n(`dont_click`), true);
                        }
                    }
                }
            }
        }

        await ctx.answerCbQuery();
    });
};
