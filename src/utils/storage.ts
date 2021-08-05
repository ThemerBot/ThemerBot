import env from '../env';
import fs from 'fs/promises';
import path from 'path';
import mkdirp from 'mkdirp';
import { promisify } from 'util';
import redis from 'redis';
import { Context } from 'grammy';
import { Theme } from '../types';

const client = redis.createClient({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
});

if (!env.LOCAL_API_ROOT) {
    mkdirp.sync(env.IMAGES_PATH);
}

client.on('error', error => {
    console.error(error);
});

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const del = promisify(client.del).bind(client);

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

        // @ts-expect-error the types seem to be broken when using `util.promisify`
        await del(key);
    } else {
        const _theme = { ...theme };

        if (!env.LOCAL_API_ROOT && typeof theme.photo !== 'string') {
            _theme.photo = path.join(env.IMAGES_PATH, key);
            await fs.writeFile(_theme.photo, theme.photo);
        }

        await set(key, JSON.stringify(_theme));
    }
};

export const getTheme = async (
    ctx: Context,
    messageId: number,
): Promise<Theme | null> => {
    const key = getKey(ctx, messageId);
    const theme = await get(key);

    return theme ? JSON.parse(theme) : null;
};
