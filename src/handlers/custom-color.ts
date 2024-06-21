import { Composer } from 'grammy';
import { I18nContext } from '../types';
import { getColorName, labelColors } from '../utils/colors';
import { getKeyboard, getTypeKeyboard } from '../utils/keyboard';
import { getTheme, saveTheme } from '../utils/storage';
import { getSponsor } from '../utils/sponsor';

const composer = new Composer<I18nContext>();

composer.hears(/^#(?:[0-9a-f]{3}){1,2}$/i, async ctx => {
    const { reply_to_message: reply } = ctx.msg;

    if (!reply) {
        await ctx.reply(ctx.i18n('invalid_reply'));
        return;
    }

    const { message_id: themeId } = reply;
    const theme = await getTheme(ctx, themeId);

    if (!theme) {
        await ctx.reply(ctx.i18n('no_theme_found'));
        return;
    }

    let [color] = ctx.match as RegExpMatchArray;
    if (color.length === 4) {
        color = `#${color
            .slice(1)
            .split('')
            .map(c => c.repeat(2))
            .join('')}`;
    }

    if (theme.using[0]?.color === color) {
        await ctx.reply(ctx.i18n('cant_reuse_bg'));
        return;
    }

    theme.using.push({
        label: getColorName(color),
        color,
    });
    await saveTheme(ctx, themeId, theme);

    const keyboard = getKeyboard(ctx, true);
    const { length } = theme.using;

    if (length < 3) {
        await ctx.api.editMessageCaption(ctx.chat.id, themeId, {
            caption:
                ctx.i18n(`choose_color_${length + 1}`, {
                    colors: labelColors(theme.using).join(', '),
                }) + getSponsor(),
            reply_markup: keyboard,
            parse_mode: 'Markdown',
        });
    } else {
        await ctx.api.editMessageCaption(ctx.chat.id, themeId, {
            caption: ctx.i18n('type_of_theme') + getSponsor(),
            reply_markup: getTypeKeyboard(ctx),
            parse_mode: 'Markdown',
        });
    }

    await ctx.deleteMessage().catch(() => {});
});

export default composer;
