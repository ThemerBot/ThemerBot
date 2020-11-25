const { cleanEnv, str, bool, url } = require(`envalid`);
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
});
