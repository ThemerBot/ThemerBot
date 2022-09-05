import fs from 'fs/promises';
import { Composer, InputFile } from 'grammy';
import env from '../env';
import { I18nContext, ThemeType } from '../types';
import { labelColors } from '../utils/colors';
import { getKeyboard, getTypeKeyboard } from '../utils/keyboard';
import { getTheme, saveTheme } from '../utils/storage';
import createThemePreview from '../utils/theme-preview';
import { createTheme, getThemeName } from '../utils/themes';

const composer = new Composer<I18nContext>();

composer.callbackQuery(/^cancel,(\d+)$/, async ctx => {
    if (Number(ctx.match![1]) === ctx.from.id) {
        await ctx.deleteMessage();
        await ctx.answerCallbackQuery();

        if (ctx.msg) {
            await saveTheme(ctx, ctx.msg.message_id, null);
        }
    } else {
        await ctx.answerCallbackQuery({ text: ctx.i18n('not_your_theme') });
    }
});

const requireTheme = composer.filter(
    (ctx): ctx is I18nContext & { msg: object; theme: object } => {
        if (!ctx.msg) {
            return false;
        }

        return true;
    },
);

requireTheme.on('callback_query', async (ctx, next) => {
    const { message_id: themeId } = ctx.msg;
    const theme = await getTheme(ctx, themeId);

    if (!theme) {
        await ctx.answerCallbackQuery({
            text: ctx.i18n('no_theme_found'),
            show_alert: true,
        });
        return;
    }

    ctx.theme = theme;
    await next();
});

requireTheme.callbackQuery('default', async ctx => {
    ctx.theme.using = [
        { label: '1', color: ctx.theme.colors[0] },
        { label: '5', color: ctx.theme.colors[4] },
        { label: '4', color: ctx.theme.colors[3] },
    ];

    await saveTheme(ctx, ctx.msg.message_id, ctx.theme);
    await ctx.editMessageCaption({
        caption: ctx.i18n('type_of_theme'),
        reply_markup: getTypeKeyboard(ctx),
    });
});

requireTheme.callbackQuery('-', async ctx => {
    ctx.theme.using.pop();
    await saveTheme(ctx, ctx.msg.message_id, ctx.theme);

    const { length } = ctx.theme.using;
    const keyboard = getKeyboard(ctx, length > 0);

    await ctx.editMessageCaption({
        caption: ctx.i18n(`choose_color_${length + 1}`, {
            colors: labelColors(ctx.theme.using).join(', '),
        }),
        reply_markup: keyboard,
    });
});

requireTheme.callbackQuery(
    ['attheme', 'tgios-theme', 'tgx-theme'],
    async ctx => {
        const { photo, using } = ctx.theme;
        const name = getThemeName(using[0].color, using[2].color);

        const theme = createTheme({
            username: ctx.me.username,
            type: ctx.callbackQuery.data as ThemeType,
            name,
            image: await fs.readFile(photo),
            colors: using.map(c => c.color),
        });

        const caption = [
            `Made by @${ctx.me.username}`,
            `#theme ${labelColors(using, false).join(' ')}`,
        ];

        if (ctx.callbackQuery.data === 'tgx-theme') {
            caption.push('');
            caption.push(ctx.i18n('tgx_wallpaper'));
        }

        if (env.STRIPE_TOKEN) {
            caption.push('');
            caption.push(
                `If you'd like to help support the bot, please <a href="https://t.me/${ctx.me.username}?start=donate">donate</a>.`,
            );
        }

        await ctx.editMessageMedia({
            type: 'document',
            media: new InputFile(
                Buffer.from(theme, 'binary'),
                `${name} by @${ctx.me.username}.${ctx.callbackQuery.data}`,
            ),
            caption: caption.join('\n'),
            parse_mode: 'HTML',
        });

        await saveTheme(ctx, ctx.msg.message_id, null);

        if (ctx.callbackQuery.data === 'attheme') {
            // TODO: possibly move the preview generator to the svg renderer api
            const preview = await createThemePreview({
                name,
                type: 'attheme',
                theme,
            });

            if (preview) {
                await ctx.replyWithPhoto(new InputFile(preview), {
                    caption: 'Preview by @ThemePreviewBot',
                    reply_to_message_id: ctx.msg.message_id,
                });
            }
        }
    },
);

requireTheme.on('callback_query', async ctx => {
    const themeId = ctx.msg.message_id;
    const { data } = ctx.callbackQuery;

    let color;
    let label;

    switch (data) {
        case 'black':
            color = '#000000';
            label = 'Black';
            break;

        case 'white':
            color = '#ffffff';
            label = 'White';
            break;

        default: {
            const _data = Number(data);
            color = ctx.theme.colors[_data];
            label = (_data + 1).toString();
        }
    }

    if (ctx.theme.using[0]?.color === color) {
        await ctx.answerCallbackQuery({ text: ctx.i18n('cant_reuse_bg') });
        return;
    }

    ctx.theme.using.push({ color, label });
    await saveTheme(ctx, themeId, ctx.theme);

    const keyboard = getKeyboard(ctx, true);
    const { length } = ctx.theme.using;

    if (length < 3) {
        await ctx.editMessageCaption({
            caption: ctx.i18n(`choose_color_${length + 1}`, {
                colors: labelColors(ctx.theme.using).join(', '),
            }),
            reply_markup: keyboard,
        });
    } else {
        await ctx.editMessageCaption({
            caption: ctx.i18n('type_of_theme'),
            reply_markup: getTypeKeyboard(ctx),
        });
    }
});

export default composer;
