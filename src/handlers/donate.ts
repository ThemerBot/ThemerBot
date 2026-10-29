import { Composer, InlineKeyboard } from 'grammy';
import env from '../env';
import { I18nContext } from '../types';
import { formatDonationLinks } from '../utils/donation-links';

type Translate = I18nContext['i18n'];

const composer = new Composer<I18nContext>();

const privateFilter = composer.filter(ctx => ctx.chat?.type === 'private');

const amountButtons = (t: Translate) =>
    new InlineKeyboard()
        .text('$5', 'donate:5')
        .text('$10', 'donate:10')
        .row()
        .text('$20', 'donate:20')
        .text('$50', 'donate:50')
        .row()
        .text(t('custom'), 'donate:custom');
const amountRegex = /^(?:USD)?\s*\$?\s*(\d+)(?:\s*\.\s*(\d{2})\d*)?$/i;

export const donationsEnabled = (): boolean =>
    Boolean(env.STRIPE_TOKEN) || env.DONATION_LINKS.length > 0;

const replyWithoutStripe = (ctx: I18nContext) => {
    if (env.DONATION_LINKS.length === 0) {
        return ctx.reply(ctx.i18n('donations_disabled'));
    }

    return ctx.reply(
        ctx.i18n('donate_links', {
            username: ctx.me.username,
            links: formatDonationLinks(env.DONATION_LINKS),
        }),
        { link_preview_options: { prefer_small_media: true } },
    );
};

interface ValidInvoice {
    valid: true;
    title: string;
    description: string;
    payload: string;
    currency: string;
    prices: [
        {
            label: string;
            amount: number;
        },
    ];
    extra: {
        provider_token: string;
        start_parameter: string;
        photo_url: string;
        reply_markup: InlineKeyboard;
    };
}

interface InvalidInvoice {
    valid: false;
    text: string;
}

// Converts a matched amount like "$5" or "12.50" into cents.
export const parseAmount = (text: string): number | null => {
    const match = amountRegex.exec(text.trim());

    if (!match) {
        return null;
    }

    const [, dollars, cents] = match;
    return Number(`${dollars}${(cents ?? '').padStart(2, '0')}`);
};

export const getInvoice = (
    amount: number,
    t: Translate,
): ValidInvoice | InvalidInvoice => {
    if (!env.STRIPE_TOKEN) {
        return { valid: false, text: t('donations_disabled') };
    }

    if (isNaN(amount)) {
        return { valid: false, text: t('donate_invalid_amount') };
    } else if (amount < 100) {
        return { valid: false, text: t('donate_min_amount') };
    } else if (amount > 1000000) {
        return { valid: false, text: t('donate_max_amount') };
    }

    return {
        valid: true,
        title: t('donate'),
        description: t('donate_description'),
        payload: `donate:${amount}`,
        currency: 'USD',
        prices: [
            {
                label: t('donate'),
                amount: amount,
            },
        ],
        extra: {
            provider_token: env.STRIPE_TOKEN,
            start_parameter: `donate_${amount}`,
            photo_url: 'https://telegra.ph/file/f695296a04e5a44c6776b.png',
            reply_markup: new InlineKeyboard().pay(t('donate_button')),
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
        await replyWithoutStripe(ctx);
    } else if (payload.includes('_')) {
        const amount = Number(payload.split('_')[1]);
        const invoice = getInvoice(amount, ctx.i18n);

        if (invoice.valid) {
            await ctx.replyWithInvoice(
                invoice.title,
                invoice.description,
                invoice.payload,
                invoice.currency,
                invoice.prices,
                invoice.extra,
            );
        } else {
            await ctx.reply(invoice.text);
        }
    } else {
        await ctx.reply(
            ctx.i18n('donate_choose_amount', { username: ctx.me.username }),
            { reply_markup: amountButtons(ctx.i18n) },
        );
    }
});

composer.command('donate', async ctx => {
    if (!env.STRIPE_TOKEN) {
        await replyWithoutStripe(ctx);
    } else if (ctx.chat.type === 'private') {
        await ctx.reply(
            ctx.i18n('donate_choose_amount', { username: ctx.me.username }),
            { reply_markup: amountButtons(ctx.i18n) },
        );
    } else {
        await ctx.reply(
            ctx.i18n('donate_in_private', { username: ctx.me.username }),
            {
                reply_markup: new InlineKeyboard().url(
                    ctx.i18n('donate'),
                    `https://t.me/${ctx.me.username}?start=donate`,
                ),
            },
        );
    }
});

composer.callbackQuery(/^donate:(\d+|custom)$/, async ctx => {
    if (!env.STRIPE_TOKEN) {
        await ctx.answerCallbackQuery();
        await replyWithoutStripe(ctx);
        return;
    }

    const [, amount] = ctx.match;

    if (amount === 'custom') {
        await ctx.editMessageText(
            ctx.i18n('donate_custom_amount', { username: ctx.me.username }),
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

    const invoice = getInvoice(_amount, ctx.i18n);

    if (invoice.valid) {
        await ctx.replyWithInvoice(
            invoice.title,
            invoice.description,
            invoice.payload,
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

    const invoice = getInvoice(parseAmount(ctx.match[0]) ?? NaN, ctx.i18n);

    if (invoice.valid) {
        await ctx.replyWithInvoice(
            invoice.title,
            invoice.description,
            invoice.payload,
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

    await ctx.reply(ctx.i18n('donate_thanks', { amount }));
});

export default composer;
