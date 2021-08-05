import { Composer } from 'grammy';
import { Chat, InputFile } from 'grammy/out/platform';
import { I18nContext } from '../types';
import { downloadFile } from '../utils/download';

const composer = new Composer<I18nContext>();

const isThemeFileRegex = /\.(?:at|tgx-)theme$/;

composer
    .filter(
        (
            ctx,
        ): ctx is I18nContext & {
            chat: Chat.PrivateChat;
            msg: {
                reply_to_message: {
                    from: object;
                    document: { file_name: string };
                };
            };
        } => {
            return !!(
                ctx.chat?.type === 'private' &&
                ctx.msg?.reply_to_message?.from?.id === ctx.me.id &&
                isThemeFileRegex.test(
                    ctx.msg?.reply_to_message?.document?.file_name ?? '',
                )
            );
        },
    )
    .on(':text', async ctx => {
        const { text, reply_to_message: reply } = ctx.msg;
        const { document } = reply;

        const file = await downloadFile(ctx, true);
        const fileExt = document.file_name.split('.').pop();

        await ctx.replyWithDocument(
            new InputFile(file, `${text} by @${ctx.me.username}.${fileExt}`),
            {
                caption: reply.caption,
                caption_entities: reply.caption_entities,
                reply_to_message_id: reply.message_id,
            },
        );
    });

export default composer;
