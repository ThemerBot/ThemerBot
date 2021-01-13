const { cleanEnv, str, bool, url, host, port } = require(`envalid`);
const dotenv = require(`dotenv`);

dotenv.config();

module.exports = cleanEnv(process.env, {
    BOT_TOKEN: str({ desc: `The Telegram bot API token` }),

    SENTRY_DSN: str({ default: undefined }),
    IMAGES_PATH: str({
        desc: `The path where images are stored (this is ignored if LOCAL_API_ROOT is true)`,
        default: `/tmp/ThemerBot`,
    }),
    API_ROOT: url({ default: `https://api.telegram.org` }),
    LOCAL_API_ROOT: bool({ default: false }),
    ENABLE_STATS: bool({ default: false }),
    TGAN_API_URL: url({ default: undefined }),
    REDIS_HOST: host({ default: `127.0.0.1` }),
    REDIS_PORT: port({ default: 6379 }),
});
