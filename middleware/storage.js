const env = require(`../env`);
const { promises: fs } = require(`fs`);
const path = require(`path`);
const mkdirp = require(`mkdirp`);
const { promisify } = require(`util`);
const Sentry = require(`@sentry/node`);
const redis = require(`redis`);
const debug = require(`debug`)(`themerbot:middleware:storage`);

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

if (!env.LOCAL_API_ROOT) {
    mkdirp.sync(env.IMAGES_PATH);
}

client.on(`error`, error => {
    debug(error);
    Sentry.captureException(error);
});

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const del = promisify(client.del).bind(client);
const getKey = (ctx, messageId) => `themerbot:${ctx.chat.id}:${ctx.from.id}:${messageId}`;

module.exports = bot => {
    bot.context.saveTheme = async function (messageId, theme) {
        const key = getKey(this, messageId);

        if (theme === null) {
            if (!env.LOCAL_API_ROOT) {
                const _theme = await this.getTheme(messageId);
                if (_theme !== null) {
                    await fs.unlink(_theme.photo);
                }
            }

            await del(key);
        } else {
            const _theme = { ...theme };

            if (!env.LOCAL_API_ROOT && typeof theme.photo !== `string`) {
                _theme.photo = path.join(env.IMAGES_PATH, key);
                await fs.writeFile(_theme.photo, theme.photo);
            }

            await set(key, JSON.stringify(_theme));
        }
    };

    bot.context.getTheme = async function (messageId) {
        const key = getKey(this, messageId);
        const theme = await get(key);

        return theme ? JSON.parse(theme) : null;
    };

    bot.context.getThemePhoto = photo => {
        return fs.readFile(photo);
    };
};
