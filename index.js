if (!process.env.TOKEN) {
    require(`dotenv`).config();
}

const {
    TOKEN,
    BOT_USERNAME = ``,
    LOG_CHANNEL,
    API_ROOT,
} = process.env;

const Telegraf = require(`telegraf/telegraf`);
const bot = new Telegraf(TOKEN, {
    username: BOT_USERNAME,
    telegram: {
        ...API_ROOT && {
            apiRoot: `http://tgp.sh-sh.ir/`,
        },
    },
});

require(`./middleware`)(bot);
require(`./handlers`)(bot);

bot.startPolling();

if (LOG_CHANNEL) {
    bot.telegram.sendMessage(LOG_CHANNEL, `@${BOT_USERNAME} is running...`);
} else {
    // eslint-disable-next-line no-console
    console.log(`@${BOT_USERNAME} is running...`);
}
