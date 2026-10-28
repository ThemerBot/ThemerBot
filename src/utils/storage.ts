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

// unfinished themes (and their saved images) are discarded after this long
const THEME_TTL_SECONDS = 24 * 60 * 60;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
const KEY_PREFIX = 'themerbot_';

const removeExpiredImages = async () => {
    const cutoff = Date.now() - THEME_TTL_SECONDS * 1000;
    const files = await fs.readdir(env.IMAGES_PATH);

    await Promise.all(
        files
            .filter(file => file.startsWith(KEY_PREFIX))
            .map(async file => {
                const filePath = path.join(env.IMAGES_PATH, file);
                const stats = await fs.stat(filePath).catch(() => null);

                if (stats && stats.mtimeMs < cutoff) {
                    await fs.rm(filePath, { force: true });
                }
            }),
    );
};

export const startImageCleanup = ():
    | ReturnType<typeof setInterval>
    | undefined => {
    if (env.LOCAL_API_ROOT) {
        return undefined;
    }

    const cleanup = () => removeExpiredImages().catch(console.error);
    cleanup();

    const timer = setInterval(cleanup, CLEANUP_INTERVAL_MS);
    timer.unref();
    return timer;
};

const getKey = (ctx: Context, messageId: number) =>
    `${KEY_PREFIX}${ctx.chat?.id}_${ctx.from?.id}_${messageId}`;

export const saveTheme = async (
    ctx: Context,
    messageId: number,
    theme: Theme | null,
): Promise<void> => {
    const key = getKey(ctx, messageId);

    if (theme === null) {
        if (!env.LOCAL_API_ROOT) {
            const _theme = await getTheme(ctx, messageId);
            if (typeof _theme?.photo === 'string') {
                await fs.rm(_theme.photo, { force: true });
            }
        }

        await client.del(key);
    } else {
        const _theme = { ...theme };

        if (!env.LOCAL_API_ROOT && typeof theme.photo !== 'string') {
            _theme.photo = path.join(env.IMAGES_PATH, key);
            await fs.writeFile(_theme.photo, theme.photo);
        }

        await client.set(key, JSON.stringify(_theme), {
            expiration: { type: 'EX', value: THEME_TTL_SECONDS },
        });
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
