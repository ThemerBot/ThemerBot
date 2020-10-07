module.exports = bot => {
    bot.inlineQuery(/^share (\w+)$/, async ctx => {
        const [, fileID] = ctx.match;

        const results = [
            {
                type: `document`,
                id: `share`,
                title: ctx.i18n(`share`),
                caption: `Made by @${ctx.botInfo.username} #theme`,
                mime_type: `text/plain`,
                document_url: fileID,
                reply_markup: ctx.shareKeyboard(fileID),
            },
        ];

        await ctx.answerInlineQuery(results);
    });
};
