const env = require(`../env`);
const { Markup } = require(`telegraf`);
const { asyncHandler } = require(`../middleware/errors`);

module.exports = bot => {
    const amountButtons = Markup.inlineKeyboard([
        [Markup.callbackButton(`$1`, `donate:1`), Markup.callbackButton(`$3`, `donate:3`)],
        [Markup.callbackButton(`$5`, `donate:5`), Markup.callbackButton(`$10`, `donate:10`)],
        [Markup.callbackButton(`Custom`, `donate:custom`)],
    ]).extra();

    const replyOptions = Markup.inlineKeyboard([Markup.payButton(`Donate ❤️`)]).extra();
    const amountRegex = /\b(?:USD)?\$?(\d+)(?:\.(\d{2})\d*)?\b/i;

    const getInvoice = amount => {
        if (isNaN(amount)) {
            return `Please specify a proper amount.`;
        } else if (amount < 100) {
            return `Sorry, Telegram only allows more than $1.`;
        } else if (amount > 1000000) {
            return `Sorry, Telegram doesn't allow more than $10,000.`;
        }

        return {
            provider_token: env.STRIPE_TOKEN,
            start_parameter: `donate_${amount}`,
            title: `Donate`,
            description: `Do you enjoy this bot and want to help cover the costs of running a popular bot? Donate now!`,
            currency: `USD`,
            photo_url: `https://telegra.ph/file/f695296a04e5a44c6776b.png`,
            payload: `donate:${amount}`,
            prices: [
                {
                    label: `Donate`,
                    amount: amount,
                },
            ],
        };
    };

    bot.start(
        asyncHandler(async (ctx, next) => {
            if (!ctx.startPayload.startsWith(`donate`)) {
                return next();
            }

            if (!env.STRIPE_TOKEN) {
                await ctx.reply(`Sorry, donations aren't enabled for this bot.`);
            } else if (ctx.startPayload.includes(`_`)) {
                const amount = Number(ctx.startPayload.split(`_`)[1]);
                await ctx.replyWithInvoice(getInvoice(amount), replyOptions);
            } else {
                await ctx.reply(
                    `Thanks for helping support @${ctx.botInfo.username}! How much would you like to donate? (All amounts are in USD)`,
                    amountButtons,
                );
            }
        }),
    );

    bot.command(
        `donate`,
        asyncHandler(async ctx => {
            if (!env.STRIPE_TOKEN) {
                await ctx.reply(`Sorry, donations aren't enabled for this bot.`);
            } else if (ctx.chat.type === `private`) {
                await ctx.reply(
                    `Thanks for helping support @${ctx.botInfo.username}! How much would you like to donate? (All amounts are in USD)`,
                    amountButtons,
                );
            } else {
                await ctx.reply(
                    `Thanks for your interest in helping support @${ctx.botInfo.username}! Please contact me in PM to donate.`,
                    Markup.inlineKeyboard([
                        Markup.urlButton(`Donate`, `https://t.me/${ctx.botInfo.username}?start=donate`),
                    ]).extra(),
                );
            }
        }),
    );

    bot.action(
        /^donate:(\d+|custom)$/,
        asyncHandler(async ctx => {
            if (!env.STRIPE_TOKEN) {
                await ctx.answerCbQuery(`Sorry, donations aren't enabled for this bot.`);
                return;
            }

            const [, amount] = ctx.match;

            if (amount === `custom`) {
                await ctx.editMessageText(
                    `Thanks for helping support @${ctx.botInfo.username}! Please specify the amount you want to donate (in USD).`,
                );
                await ctx.answerCbQuery();
                return;
            }

            let _amount;
            switch (amount) {
                case `1`:
                    _amount = 100;
                    break;
                case `3`:
                    _amount = 300;
                    break;
                default:
                case `5`:
                    _amount = 500;
                    break;
                case `10`:
                    _amount = 1000;
                    break;
            }

            await ctx.replyWithInvoice(getInvoice(_amount), replyOptions);
            await ctx.answerCbQuery();
        }),
    );

    bot.hears(
        amountRegex,
        asyncHandler(async ctx => {
            if (env.STRIPE_TOKEN && ctx.chat.type === `private`) {
                const [, dollars, cents] = ctx.match;
                const amount = Number(`${dollars || 0}${(cents || ``).padStart(2, `0`)}`);

                await ctx.replyWithInvoice(getInvoice(amount), replyOptions);
            }
        }),
    );

    bot.on(
        `pre_checkout_query`,
        asyncHandler(async ctx => {
            await ctx.answerPreCheckoutQuery(true);
        }),
    );

    bot.on(
        `successful_payment`,
        asyncHandler(async ctx => {
            const { total_amount } = ctx.message.successful_payment;
            const amount = (total_amount / Math.pow(10, 2)).toFixed(2);

            await ctx.reply(`Thanks for donating $${amount}!`);
        }),
    );
};
