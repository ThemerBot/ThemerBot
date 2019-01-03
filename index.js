if (!process.env.TOKEN) {
    require(`dotenv`).load();
}

const {
    TOKEN,
    USERNAME = ``,
} = process.env;

const Telegraf = require(`telegraf`);
const bot = new Telegraf(TOKEN, {
    username: USERNAME,
});

require(`./middleware`)(bot);
require(`./handlers`)(bot);

bot.startPolling();
