// TODO: remove this at some point

const { asyncHandler } = require(`../middleware/errors`);

module.exports = bot => {
    bot.inlineQuery(/^share (\S+)$/, asyncHandler(async ctx => {
        const [, fileID] = ctx.match;

        const results = [
            {
                type: `document`,
                id: `share`,
                title: ctx.i18n(`share`),
                caption: `Made by @${ctx.botInfo.username} #theme`,
                mime_type: `text/plain`,
                document_url: fileID,
            },
        ];

        await ctx.answerInlineQuery(results);
    }));
};
