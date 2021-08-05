import { Context } from 'grammy';
import env from '../env';
import fs from 'fs/promises';
import fetch from 'node-fetch';

const getFileLink = async (ctx: Context, fileId: string) => {
    const file = await ctx.api.getFile(fileId);

    if (env.LOCAL_API_ROOT && file.file_path) {
        return file.file_path;
    }

    return `${env.API_ROOT}/file/bot${env.BOT_TOKEN}/${file.file_path}`;
};

const getPhoto = async (link: string, forceDownload = false) => {
    if (env.LOCAL_API_ROOT) {
        if (!forceDownload) {
            return link;
        }

        return fs.readFile(link);
    }

    const response = await fetch(link);
    return response.buffer();
};

export const downloadFile = async (
    ctx: Context,
    forceDownload = false,
): Promise<string | Buffer> => {
    if (!ctx.msg) {
        throw new Error('Missing `ctx.msg`');
    }

    const message = ctx.msg.reply_to_message ?? ctx.msg;

    if (!message.document) {
        throw new Error('Missing `message.document`');
    }

    const documentId = message.document.file_id;
    const link = await getFileLink(ctx, documentId);

    return getPhoto(link, forceDownload);
};

export const downloadPhoto = async (
    ctx: Context,
    forceDownload = false,
): Promise<string | Buffer> => {
    if (!ctx.msg) {
        throw new Error('Missing `ctx.msg`');
    } else if (!ctx.msg.photo || ctx.msg.photo.length === 0) {
        throw new Error('Missing `ctx.msg.photo`');
    }

    const photos = ctx.msg.photo;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const photo = photos.pop()!.file_id;
    const link = await getFileLink(ctx, photo);

    return getPhoto(link, forceDownload);
};
