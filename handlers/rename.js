const { asyncHandler } = require(`../middleware/errors`);

module.exports = bot => {
    const isThemeFileRegex = /\.(?:at|tgx-)theme$/;

    bot.on(`text`, asyncHandler(async ctx => {
        if (ctx.chat.type !== `private`) {
            return;
        }

        const { text, reply_to_message: reply } = ctx.message;

        if (reply) {
            const { from, document } = reply;

            const isFromBot = from.id === ctx.botInfo.id;
            const isThemeFile =
                document && isThemeFileRegex.test(document.file_name);

            if (isFromBot && isThemeFile) {
                const file = await ctx.downloadFile(true);
                const fileExt = document.file_name.split(`.`).pop();

                await ctx.replyWithDocument(
                    {
                        source: Buffer.from(file, `binary`),
                        filename: `${text} by @${ctx.botInfo.username}.${fileExt}`,
                    },
                    {
                        caption: reply.caption,
                        reply_to_message_id: reply.message_id,
                    },
                );
            }
        }
    }));
};
