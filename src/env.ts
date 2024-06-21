import { cleanEnv, str, bool, url, host, port } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

export default cleanEnv(process.env, {
    BOT_TOKEN: str({ desc: 'The Telegram bot API token' }),

    SVG_RENDERER_URL: str(),
    IMAGES_PATH: str({
        desc: 'The path where images are stored (this is ignored if LOCAL_API_ROOT is true)',
        default: '/tmp/ThemerBot',
    }),
    API_ROOT: url({ default: 'https://api.telegram.org' }),
    LOCAL_API_ROOT: bool({ default: false }),
    REDIS_HOST: host({ default: '127.0.0.1' }),
    REDIS_PORT: port({ default: 6379 }),

    MYSQL_HOST: host({ default: '127.0.0.1' }),
    MYSQL_USER: str({ default: 'themerbot' }),
    MYSQL_PASS: str({ default: 'themerbot' }),
    MYSQL_DB: str({ default: 'themerbot' }),
    MYSQL_PORT: port({ default: 3306 }),

    STRIPE_TOKEN: str({ default: undefined }),
    ENABLE_STATS: bool({ default: false }),

    SPONSORED_BY: str({ default: undefined }),
    SPONSOR_MESSAGE: str({ default: undefined }),
});
