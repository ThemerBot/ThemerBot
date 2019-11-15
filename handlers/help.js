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
        await ctx.reply(
            `This bot is created and maintained by @twitface. I would like to thank the following users for helping with translations:\n\n@ericksonx for Spanish\n@Lulzx for Hindi\n@droidOSuser for Italian\n@sh_sh_dev & @hkh12 for Farsi\n@hkh12 for the tgx template\n@Meh7an for the iOS template`,
            {
                disable_web_page_preview: true,
            }
        );
    });
};
