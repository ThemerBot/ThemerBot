import { mkdirSync } from 'fs';
import fs from 'fs/promises';
import { Context } from 'grammy';
import path from 'path';
import { createClient } from 'redis';
import env from '../env';
import { Theme } from '../types';

export const client = createClient({
    socket: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
    },
});

if (!env.LOCAL_API_ROOT) {
    mkdirSync(env.IMAGES_PATH, { recursive: true });
}

client.on('error', error => {
    console.error(error);
});

const getKey = (ctx: Context, messageId: number) =>
    `themerbot_${ctx.chat?.id}_${ctx.from?.id}_${messageId}`;

export const saveTheme = async (
    ctx: Context,
    messageId: number,
    theme: Theme | null,
): Promise<void> => {
    const key = getKey(ctx, messageId);

    if (theme === null) {
        if (!env.LOCAL_API_ROOT) {
            const _theme = await getTheme(ctx, messageId);
            if (_theme !== null) {
                await fs.unlink(_theme.photo);
            }
        }

        await client.del(key);
    } else {
        const _theme = { ...theme };

        if (!env.LOCAL_API_ROOT && typeof theme.photo !== 'string') {
            _theme.photo = path.join(env.IMAGES_PATH, key);
            await fs.writeFile(_theme.photo, theme.photo);
        }

        await client.set(key, JSON.stringify(_theme));
    }
};

export const getTheme = async (
    ctx: Context,
    messageId: number,
): Promise<Theme | null> => {
    const key = getKey(ctx, messageId);
    const theme = await client.get(key);

    return theme ? JSON.parse(theme) : null;
};
