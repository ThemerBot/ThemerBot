if (!process.env.TOKEN) {
    require(`dotenv`).load();
}

const {
    TOKEN,
    USERNAME = ``,
} = process.env;

const Telegraf = require(`telegraf`);
const session = require(`telegraf/session`);
const bot = new Telegraf(TOKEN, {
    username: USERNAME,
});

bot.use(session({
    property: `theme`,
}));

require(`./middleware`)(bot);
require(`./handlers`)(bot);

bot.startPolling();
// eslint-disable-next-line no-console
console.log(`@${USERNAME} is running...`);
