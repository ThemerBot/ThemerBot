const debug = require(`debug`)(`themerbot:core`);
const env = require(`./env`);
const fs = require(`fs`);
const path = require(`path`);
const downloadTranslations = require(`./scripts/download-translations`);
const Telegraf = require(`telegraf`);
const Sentry = require(`@sentry/node`);
const puppeteer = require(`puppeteer`);

const main = async () => {
    if (env.SENTRY_DSN) {
        debug(`Initializing Sentry logs`);
        Sentry.init({
            dsn: env.SENTRY_DSN,
        });
    }

    const bot = new Telegraf(env.BOT_TOKEN, {
        telegram: {
            apiRoot: env.API_ROOT,
        },
    });

    if (!fs.existsSync(path.join(__dirname, `i18n`))) {
        debug(`Downloading i18n files`);
        await downloadTranslations();
    }

    bot.command(`status`, ctx => {
        // Ignore the message if it's older than 2 seconds
        if (Date.now() / 1000 - ctx.message.date < 2) {
            ctx.reply(`The bot is up.`);
        }
    });

    bot.context.browser = await puppeteer.launch();

    debug(`Loading middleware`);
    require(`./middleware`)(bot);
    debug(`Loading handlers`);
    require(`./handlers`)(bot);

    debug(`Launching bot`);
    await bot.launch();
    debug(`@${bot.context.botInfo.username} is running`);
};

main();
