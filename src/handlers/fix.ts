import Attheme from 'attheme-js';
import { Composer, InputFile } from 'grammy';
import Color from 'color';
import { I18nContext, ThemeType } from '../types';
import { Chat } from '@grammyjs/types';
import { downloadFile } from '../utils/download';
import { createTheme } from '../utils/themes';

const composer = new Composer();

const isThemeFileRegex = /\.attheme$/;

composer.filter(
    (
        ctx,
    ): ctx is I18nContext & {
        chat: Chat.PrivateChat;
        msg: { document: { file_name: string } };
    } =>
        ctx.chat?.type === 'private' &&
        isThemeFileRegex.test(ctx.msg?.document?.file_name ?? ''),
    async ctx => {
        const file = await downloadFile(ctx, true);
        const fileName = ctx.msg.document.file_name;
        const oldTheme = new Attheme(file.toString('binary'));

        const colors = [
            oldTheme.get('actionBarActionModeDefault'),
            oldTheme.get('actionBarActionModeDefaultIcon'),
            oldTheme.get('chat_outVoiceSeekbar'),
        ];

        if (colors.some(color => color === null)) {
            await ctx.reply(ctx.i18n('cannot_fix'));
            return;
        }

        const hexColors = colors.map(color =>
            Color({
                r: color?.red,
                g: color?.green,
                b: color?.blue,
            }).hex(),
        );

        const theme = createTheme({
            username: ctx.me.username,
            image: Buffer.from(oldTheme.getWallpaper() ?? ''),
            name: fileName,
            colors: hexColors,
            type: fileName.split('.').pop() as ThemeType,
        });

        await ctx.replyWithDocument(
            new InputFile(Buffer.from(theme), fileName),
            {
                caption: `#theme ${hexColors.join(' ')}`,
                reply_to_message_id: ctx.msg.message_id,
            },
        );
    },
);

export default composer;
