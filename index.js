if (!process.env.TOKEN) {
    require(`dotenv`).load();
}

const {
    TOKEN,
    USERNAME = ``,
    LOG_CHANNEL,
} = process.env;

const Telegraf = require(`telegraf`);
const bot = new Telegraf(TOKEN, {
    username: USERNAME,
});

require(`./middleware`)(bot);
require(`./handlers`)(bot);

bot.startPolling();

if (LOG_CHANNEL) {
    bot.telegram.sendMessage(LOG_CHANNEL, `@${USERNAME} is running...`);
} else {
    // eslint-disable-next-line no-console
    console.log(`@${USERNAME} is running...`);
}
