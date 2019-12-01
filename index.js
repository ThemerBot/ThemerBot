/* eslint-disable no-console */

if (!process.env.TOKEN) {
    require(`dotenv`).config();
}

const { TOKEN, BOT_USERNAME = ``, LOG_CHANNEL, API_ROOT } = process.env;

const fs = require(`fs`);
const path = require(`path`);
const downloadTranslations = require(`./scripts/download-translations`);
const Telegraf = require(`telegraf`);

const main = async () => {
    const bot = new Telegraf(TOKEN, {
        username: BOT_USERNAME,
        telegram: {
            ...API_ROOT && {
                apiRoot: API_ROOT,
            },
        },
    });

    if (!fs.existsSync(path.join(__dirname, `i18n`))) {
        if (LOG_CHANNEL) {
            bot.telegram.sendMessage(LOG_CHANNEL, `Downloading i18n files`);
        } else {
            console.log(`Downloading i18n files`);
        }

        await downloadTranslations();
    }

    require(`./middleware`)(bot);
    require(`./handlers`)(bot);

    bot.startPolling();

    if (LOG_CHANNEL) {
        bot.telegram.sendMessage(LOG_CHANNEL, `@${BOT_USERNAME} is running...`);
    } else {
        console.log(`@${BOT_USERNAME} is running...`);
    }
};

main();
