const { cleanEnv, str, bool, url } = require(`envalid`);
const dotenv = require(`dotenv`);

dotenv.config();

module.exports = cleanEnv(process.env, {
    BOT_TOKEN: str({ desc: `The Telegram bot API token` }),

    SENTRY_DSN: str({ default: undefined }),
    IMAGES_PATH: str({
        desc: `The path where images are stored`,
        default: `/tmp/ThemerBot`,
    }),
    API_ROOT: url({ default: `https://api.telegram.org` }),
    ENABLE_STATS: bool({ default: false }),
});
