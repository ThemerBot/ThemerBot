module.exports = bot => {
    bot.command(`start`, async ctx => {
        if (ctx.chat.type === `private`) {
            const typing = ctx.action();
            const { first_name, last_name } = ctx.from;
            const name = `${first_name} ${last_name || ``}`.trim();

            await ctx.reply(ctx.i18n(`start`, { name }));
            typing.stop();
        }
    });

    bot.command(`help`, async () => {
        // TODO
    });

    bot.command(`credits`, async ctx => {
        await ctx.reply(ctx.i18n(`credits`));
    });
};
