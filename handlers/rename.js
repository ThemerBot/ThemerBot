module.exports = bot => {
    const isThemeFileRegex = /\.(?:at|tgx-)theme$/;

    bot.on(`text`, async ctx => {
        const { text, reply_to_message: reply } = ctx.message;

        if (reply) {
            const { from, document } = reply;

            const isFromBot = from.username === process.env.BOT_USERNAME;
            const isThemeFile =
                document && isThemeFileRegex.test(document.file_name);

            if (isFromBot && isThemeFile) {
                const file = await ctx.downloadFile();
                const fileExt = document.file_name.split(`.`).pop();

                await ctx.replyWithDocument(
                    {
                        source: Buffer.from(file, `binary`),
                        filename: `${text} by @${process.env.BOT_USERNAME}.${fileExt}`,
                    },
                    {
                        caption: reply.caption,
                        reply_to_message_id: reply.message_id,
                    }
                );
            }
        }
    });
};
