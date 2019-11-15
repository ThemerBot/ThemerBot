module.exports = bot => {
    bot.inlineQuery(/^share (\w+)$/, async ctx => {
        const [, fileID] = ctx.match;

        const results = [
            {
                type: `document`,
                id: fileID,
                title: ctx.i18n(`share`),
                caption: `Made by @CreateAtthemeBot #theme`,
                mime_type: `text/plain`,
                document_url: fileID,
                reply_markup: ctx.shareKeyboard(fileID),
            },
        ];

        ctx.answerInlineQuery(results);
    });
};
