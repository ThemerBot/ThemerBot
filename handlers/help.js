module.exports = bot => {
    bot.command(`start`, (ctx, next) => {
        if (ctx.startPayload.startsWith(`donate`)) {
            return next();
        }

        if (ctx.chat.type === `private`) {
            const { first_name, last_name } = ctx.from;
            const name = `${first_name} ${last_name || ``}`.trim();

            ctx.reply(ctx.i18n(`start`, { name }));
        }
    });

    bot.command(`help`, () => {
        // TODO
    });

    bot.command(`credits`, ctx => {
        ctx.reply(ctx.i18n(`credits`));
    });

    bot.command(`privacy`, ctx => {
        ctx.reply(ctx.i18n(`privacy`), {
            parse_mode: `markdown`,
            disable_web_page_preview: true,
        });
    });
};
