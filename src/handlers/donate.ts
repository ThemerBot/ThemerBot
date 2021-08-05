import env from '../env';
import { Composer, InlineKeyboard } from 'grammy';

const composer = new Composer();

const privateFilter = composer.filter(ctx => ctx.chat?.type === 'private');

const amountButtons = new InlineKeyboard()
    .text('$5', 'donate:5')
    .text('$10', 'donate:10')
    .row()
    .text('$20', 'donate:20')
    .text('$50', 'donate:50')
    .row()
    .text('Custom', 'donate:custom');
const replyButtons = new InlineKeyboard().pay('Donate ❤️');
const amountRegex = /^(?:USD)?\s*\$?\s*(\d+)(?:\s*\.\s*(\d{2})\d*)?$/i;

interface ValidInvoice {
    valid: true;
    title: string;
    description: string;
    payload: string;
    provider_token: string;
    currency: string;
    prices: [
        {
            label: string;
            amount: number;
        },
    ];
    extra: {
        start_parameter: string;
        photo_url: string;
        reply_markup: InlineKeyboard;
    };
}

interface InvalidInvoice {
    valid: false;
    text: string;
}

const getInvoice = (amount: number): ValidInvoice | InvalidInvoice => {
    if (isNaN(amount)) {
        return {
            valid: false,
            text: 'Please specify a proper amount.',
        };
    } else if (amount < 100) {
        return {
            valid: false,
            text: 'Sorry, Telegram has a minimum of $1.',
        };
    } else if (amount > 1000000) {
        return {
            valid: false,
            text: 'Sorry, Telegram doesn\'t allow more than $10,000.',
        };
    }

    return {
        valid: true,
        title: 'Donate',
        description: 'Do you enjoy this bot and want to help cover the costs of running a popular bot? Donate now!',
        payload: `donate:${amount}`,
        provider_token: env.STRIPE_TOKEN,
        currency: 'USD',
        prices: [
            {
                label: 'Donate',
                amount: amount,
            },
        ],
        extra: {
            start_parameter: `donate_${amount}`,
            photo_url: 'https://telegra.ph/file/f695296a04e5a44c6776b.png',
            reply_markup: replyButtons,
        },
    };
};

privateFilter.command('start', async (ctx, next) => {
    if (typeof ctx.match !== 'string') {
        return next();
    }

    const payload = ctx.match.trim();

    if (!payload.startsWith('donate')) {
        return next();
    }

    if (!env.STRIPE_TOKEN) {
        await ctx.reply('Sorry, donations aren\'t enabled for this bot.');
    } else if (payload.includes('_')) {
        const amount = Number(payload.split('_')[1]);
        const invoice = getInvoice(amount);

        if (invoice.valid) {
            await ctx.replyWithInvoice(
                invoice.title,
                invoice.description,
                invoice.payload,
                invoice.provider_token,
                invoice.currency,
                invoice.prices,
                invoice.extra,
            );
        } else {
            await ctx.reply(invoice.text);
        }
    } else {
        await ctx.reply(
            `Thanks for helping support @${ctx.me.username}! How much would you like to donate? (All amounts are in USD)`,
            { reply_markup: amountButtons },
        );
    }
});

composer.command('donate', async ctx => {
    if (!env.STRIPE_TOKEN) {
        await ctx.reply('Sorry, donations aren\'t enabled for this bot.');
    } else if (ctx.chat.type === 'private') {
        await ctx.reply(
            `Thanks for helping support @${ctx.me.username}! How much would you like to donate? (All amounts are in USD)`,
            { reply_markup: amountButtons },
        );
    } else {
        await ctx.reply(
            `Thanks for your interest in helping support @${ctx.me.username}! Please contact me in PM to donate.`,
            {
                reply_markup: new InlineKeyboard().url(
                    'Donate',
                    `https://t.me/${ctx.me.username}?start=donate`,
                ),
            },
        );
    }
});

composer.callbackQuery(/^donate:(\d+|custom)$/, async ctx => {
    if (!env.STRIPE_TOKEN) {
        await ctx.answerCallbackQuery({
            text: 'Sorry, donations aren\'t enabled for this bot.',
        });
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [, amount] = ctx.match!;

    if (amount === 'custom') {
        await ctx.editMessageText(
            `Thanks for helping support @${ctx.me.username}! Please specify the amount you want to donate (in USD).`,
        );
        await ctx.answerCallbackQuery();
        return;
    }

    let _amount;
    switch (amount) {
        case '5':
        default:
            _amount = 500;
            break;
        case '10':
            _amount = 1000;
            break;
        case '20':
            _amount = 2000;
            break;
        case '50':
            _amount = 5000;
            break;
    }

    const invoice = getInvoice(_amount);

    if (invoice.valid) {
        await ctx.replyWithInvoice(
            invoice.title,
            invoice.description,
            invoice.payload,
            invoice.provider_token,
            invoice.currency,
            invoice.prices,
            invoice.extra,
        );
    } else {
        await ctx.reply(invoice.text);
    }

    await ctx.answerCallbackQuery();
});

privateFilter.hears(amountRegex, async (ctx, next) => {
    if (!env.STRIPE_TOKEN) {
        return next();
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [, dollars, cents] = ctx.match!;
    const amount = Number(`${dollars || 0}${(cents || '').padStart(2, '0')}`);
    const invoice = getInvoice(amount);

    if (invoice.valid) {
        await ctx.replyWithInvoice(
            invoice.title,
            invoice.description,
            invoice.payload,
            invoice.provider_token,
            invoice.currency,
            invoice.prices,
            invoice.extra,
        );
    } else {
        await ctx.reply(invoice.text);
    }
});

composer.on('pre_checkout_query', ctx => ctx.answerPreCheckoutQuery(true));

composer.on(':successful_payment', async ctx => {
    const { total_amount } = ctx.msg.successful_payment;
    const amount = (total_amount / Math.pow(10, 2)).toFixed(2);

    await ctx.reply(`Thanks for donating $${amount}!`);
});

export default composer;
