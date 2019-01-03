module.exports = (bot) => {
    bot.command(`start`, async (ctx) => {
        const typing = ctx.action();
        const { first_name, last_name } = ctx.from;
        const name = `${first_name} ${last_name || ``}`.trim();

        await ctx.reply(`Hi ${name}! Send me a photo.`);
        typing.stop();
    });
};
