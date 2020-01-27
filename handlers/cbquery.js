const messageNotModified = `Bad Request: message is not modified: specified new message content and reply markup are exactly the same as a current content and reply markup of the message`;
const queryTooOld = `Bad Request: query is too old and response timeout expired or query ID is invalid`;

async function saveColorToTheme(ctx, theme, themeId, color) {
    if (theme.using[0] === color) {
        try {
            return ctx.answerCbQuery(ctx.i18n(`cant_reuse_bg`));
        } catch (e) {
            if (e.description !== queryTooOld) {
                throw e;
            }
        }
    }

    theme.using.push(color);
    ctx.saveTheme(themeId, theme);

    const keyboard = ctx.keyboard(true);
    const { length } = theme.using;

    if (length < 3) {
        await ctx.editMessageCaption(
            ctx.i18n(`choose_color_${length + 1}`, {
                colors: theme.using.join(`, `),
            }),
            { reply_markup: keyboard },
        );
    } else {
        try {
            await ctx.editMessageCaption(
                ctx.i18n(`type_of_theme`),
                ctx.typeKeyboard(),
            );
        } catch (e) {
            if (e.description === messageNotModified) {
                try {
                    return await ctx.answerCbQuery(
                        ctx.i18n(`dont_click`),
                        true,
                    );
                } catch (e) {
                    if (e.description !== queryTooOld) {
                        throw e;
                    }
                }
            }
        }
    }
}

module.exports = bot => {
    bot.on(`callback_query`, async ctx => {
        const { data } = ctx.callbackQuery;
        const { message_id: themeId } = ctx.callbackQuery.message;
        const theme = ctx.getTheme(themeId);

        if (data.startsWith(`cancel`)) {
            if (Number(data.split(`,`).pop()) === ctx.from.id) {
                await ctx.deleteMessage();
                ctx.saveTheme(themeId, null);
            } else {
                try {
                    await ctx.answerCbQuery(ctx.i18n(`not_your_theme`));
                } catch (e) {
                    if (e.description !== queryTooOld) {
                        throw e;
                    }
                }
            }

            return;
        }

        if (!theme) {
            try {
                await ctx.answerCbQuery(ctx.i18n(`no_theme_found`), true);
            } catch (e) {
                if (e.description !== queryTooOld) {
                    throw e;
                }
            }

            return;
        }

        switch (data) {
            // Default button
            case `default`: {
                await ctx.editMessageCaption(
                    ctx.i18n(`type_of_theme`),
                    ctx.typeKeyboard(),
                );

                const { colors } = theme;

                // eslint-disable-next-line require-atomic-updates
                theme.using = [colors[0], colors[4], colors[3], colors[1]];

                ctx.saveTheme(themeId, theme);

                break;
            }

            // Backspace
            case `-`: {
                theme.using.pop();
                ctx.saveTheme(themeId, theme);

                const { length } = theme.using;
                const keyboard = ctx.keyboard(length > 0);

                await ctx.editMessageCaption(
                    ctx.i18n(`choose_color_${length + 1}`, {
                        colors: theme.using.join(`, `),
                    }),
                    { reply_markup: keyboard },
                );

                break;
            }

            case `white`: {
                await saveColorToTheme(ctx, theme, themeId, `#ffffff`);
                break;
            }

            case `black`: {
                await saveColorToTheme(ctx, theme, themeId, `#000000`);
                break;
            }

            case `tgios-theme`:
            case `tgx-theme`:
            case `attheme`: {
                const typing = ctx.action(`upload_photo`);
                const { photo, using } = theme;
                const name = ctx.makeThemeName(using[0], using[2]);

                const completedTheme = ctx.makeTheme({
                    type: data,
                    name: name,
                    image: photo,
                    colors: using,
                });

                const { message_id, document } = await ctx.editMessageMedia({
                    caption: `Made by @${
                        process.env.BOT_USERNAME
                    }\n#theme ${using.join(` `)}`,
                    type: `document`,
                    media: {
                        source: Buffer.from(completedTheme, `binary`),
                        filename: `${name} by @${process.env.BOT_USERNAME}.${data}`,
                    },
                });

                let preview = ctx.createThemePreview({
                    name,
                    type: data,
                    theme: completedTheme,
                });

                await bot.telegram.editMessageReplyMarkup(
                    ctx.chat.id,
                    message_id,
                    null,
                    ctx.shareKeyboard(document.file_id),
                );

                preview = await preview;
                if (preview) {
                    await ctx.replyWithPhoto(
                        { source: preview },
                        {
                            caption: `Preview by @ThemePreviewBot`,
                            reply_to_message_id: message_id,
                        },
                    );
                }

                typing.stop();
                ctx.saveTheme(themeId, null);
                break;
            }

            // All colors and type
            default:
                await saveColorToTheme(ctx, theme, themeId, theme.colors[data]);
        }

        try {
            await ctx.answerCbQuery();
        } catch (e) {
            if (e.description !== queryTooOld) {
                throw e;
            }
        }
    });
};
