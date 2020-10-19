const { promises: fs } = require(`fs`);
const path = require(`path`);
const mkdirp = require(`mkdirp`);
const { promisify } = require(`util`);
const Sentry = require(`@sentry/node`);
const redis = require(`redis`);

const client = redis.createClient();
const imagesPath = process.env.IMAGES_PATH || `/tmp/ThemerBot`;

mkdirp.sync(imagesPath);

client.on(`error`, error => {
    console.error(error);
    Sentry.captureException(error);
});

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const del = promisify(client.del).bind(client);
const getKey = (ctx, messageId) => `${ctx.chat.id}:${ctx.from.id}:${messageId}`;

module.exports = bot => {
    bot.context.saveTheme = async function (messageId, theme) {
        const key = getKey(this, messageId);

        if (theme === null) {
            const _theme = await this.getTheme(messageId);
            if (_theme !== null) {
                await fs.unlink(_theme.photo);
            }

            await del(key);
        } else {
            const _theme = { ...theme };

            if (typeof theme.photo !== `string`) {
                _theme.photo = path.join(imagesPath, key);
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
