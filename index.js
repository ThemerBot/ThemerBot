/* eslint-disable no-console */

require(`dotenv`).config();

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

    const bot = new Telegraf(process.env.BOT_TOKEN, {
        telegram: {
            apiRoot: process.env.API_ROOT || `https://api.telegram.org`,
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

    await bot.launch();
    console.log(`@${bot.context.botInfo.username} is running...`);
};

main();
