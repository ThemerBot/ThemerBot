import { Composer } from 'grammy';
import env from '../env';
import { I18nContext } from '../types';
import { getImageColors } from '../utils/colors';
import { downloadFile, downloadPhoto } from '../utils/download';
import { getKeyboard } from '../utils/keyboard';
import { saveTheme } from '../utils/storage';
import { getSponsor } from '../utils/sponsor';

const composer = new Composer<I18nContext>();

const allowedMimeTypes = ['image/png', 'image/jpeg'];
const mediaGroupIds = new Map(); // chatId => lastGroupId

composer.on('message', async (ctx, next) => {
    if (!ctx.msg.media_group_id) {
        mediaGroupIds.delete(ctx.msg.chat.id);
    }

    await next();
});

composer.on([':photo', ':document'], async (ctx, next) => {
    const { forward_origin, media_group_id } = ctx.msg;

    if (
        forward_origin?.type === 'user' &&
        forward_origin.sender_user.id === ctx.me.id
    ) {
        await next();
        return;
    }

    if (ctx.senderChat) {
        await ctx.reply(ctx.i18n('anonymous_admins'));
        return;
    }

    let mimeType = 'image/jpeg';
    if (ctx.msg.document) {
        mimeType = ctx.msg.document.mime_type ?? mimeType;
        const { file_size } = ctx.msg.document;

        if (!allowedMimeTypes.includes(mimeType)) {
            await next();
            return;
        } else if (file_size && file_size > 1000000) {
            await ctx.reply(ctx.i18n('image_too_big'));
            return;
        }
    }

    if (media_group_id) {
        if (
            mediaGroupIds.has(ctx.chat.id) &&
            mediaGroupIds.get(ctx.chat.id) === media_group_id
        ) {
            await next();
            return;
        }

        mediaGroupIds.set(ctx.chat.id, media_group_id);
    }

    try {
        let photo;
        if (ctx.msg.document) {
            photo = await downloadFile(ctx, true);
        } else {
            photo = await downloadPhoto(ctx, true);
        }

        const colors = await getImageColors(photo, mimeType);
        const keyboard = getKeyboard(ctx);

        const { message_id } = await ctx.replyWithPhoto(
            `${env.SVG_RENDERER_URL}/render/${colors
                .map(color => color.slice(1))
                .join('/')}`,
            {
                reply_markup: keyboard,
                caption: ctx.i18n('choose_color_1') + getSponsor(),
                reply_to_message_id: ctx.msg.message_id,
                parse_mode: 'Markdown',
            },
        );

        await saveTheme(ctx, message_id, {
            photo,
            colors,
            using: [],
        });
    } catch (error) {
        console.error(error);
        await ctx.reply(ctx.i18n('error'), {
            reply_to_message_id: ctx.msg.message_id,
        });
    }
});

export default composer;
