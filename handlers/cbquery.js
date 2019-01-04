module.exports = bot => {
    const typeKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    bot.context.createButton(`attheme`, `attheme`),
                    bot.context.createButton(`tgx-theme`, `tgx-theme`),
                ],
            ],
        },
    };

    bot.on(`callback_query`, async ctx => {
        const { data, message } = ctx.callbackQuery;

        if (data.startsWith(`cancel`)) {
            if (data.split(`,`).pop() == ctx.from.id) {
                await ctx.deleteMessage();
                delete ctx.theme;
            } else {
                await ctx.answerCbQuery(ctx.i18n(`not_your_theme`));
            }

            return;
        }

        if (!ctx.theme || message.message_id !== ctx.theme.message_id) {
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
                    await ctx.editMessageCaption(ctx.i18n(`type_of_theme`), typeKeyboard);
                }
            }
        }

        await ctx.answerCbQuery();
    });
};
