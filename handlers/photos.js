`use strict`;

const colorsImage = require(`../colors`);

module.exports = async (bot, themes) => {
    bot.on(`photo`, async (ctx) => {
        const { forward_from } = ctx.message;

        if (forward_from && forward_from.username === `createAtthemeBot`) return;

        const typing = ctx.action(`upload_photo`);
        const { id, type } = ctx.message.chat;

        try {
            const photo = await ctx.downloadPhoto();
            const colors = await functions.getImageColors(photo);

            const reply = await ctx.replyWithPhoto({
                source: await colorsImage(colors),
            }, keyboard(colors, type !== `private`));

            themes[id] = {
                photo,
                colors,
                using: [],
                msgID: reply.message_id,
            };
        } catch (e) {
            console.log(e);
            console.log(JSON.stringify(themes[id] || {}, null, 2));
            ctx.reply(`There was an error. Please try with a different picture.`);
        } finally {
            typing.stop();
        }
    });
};
