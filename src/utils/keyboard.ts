import { InlineKeyboard } from 'grammy';
import { I18nContext } from '../types';

export const getKeyboard = (
    ctx: I18nContext,
    showBackspace = false,
): InlineKeyboard => {
    const keyboard = new InlineKeyboard()
        .text('1', '0')
        .text('2', '1')
        .text('3', '2')
        .text('4', '3')
        .text('5', '4')
        .row()
        .text(ctx.i18n('white'), 'white')
        .text(ctx.i18n('black'), 'black');

    if (showBackspace) {
        keyboard.text('⬅️', '-');
    } else {
        keyboard.text(ctx.i18n('auto'), 'default');
    }

    if (ctx.from) {
        keyboard.row().text(ctx.i18n('cancel'), `cancel,${ctx.from.id}`);
    }

    return keyboard;
};

export const getTypeKeyboard = (ctx: I18nContext): InlineKeyboard => {
    const keyboard = new InlineKeyboard();

    ['attheme', 'tgx-theme', 'tgios-theme'].forEach(type =>
        keyboard.text(`${ctx.i18n(type)} (.${type})`, type).row(),
    );

    return keyboard;
};
