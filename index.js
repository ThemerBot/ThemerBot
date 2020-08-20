/* eslint-disable no-console */

if (!process.env.TOKEN) {
    require(`dotenv`).config();
}

const { TOKEN, BOT_USERNAME = ``, API_ROOT } = process.env;

const fs = require(`fs`);
const path = require(`path`);
const downloadTranslations = require(`./scripts/download-translations`);
const Telegraf = require(`telegraf`);
const Sentry = require(`@sentry/node`);

const main = async () => {
    if (process.env.SENTRY_DSN) {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
        });
    }

    const bot = new Telegraf(TOKEN, {
        username: BOT_USERNAME,
        telegram: {
            ...API_ROOT && {
                apiRoot: API_ROOT,
            },
        },
    });

    if (!fs.existsSync(path.join(__dirname, `i18n`))) {
        console.log(`Downloading i18n files`);
        await downloadTranslations();
    }

    bot.command(`status`, ctx => {
        // Ignore the message if it's older than 2 seconds
        if (Date.now() / 1000 - ctx.message.date < 2) {
            ctx.reply(`The bot is up.`);
        }
    });

    require(`./middleware`)(bot);
    require(`./handlers`)(bot);

    bot.startPolling();

    console.log(`@${BOT_USERNAME} is running...`);
};

main();
