const { Telegraf } = require(`telegraf`);
const env = require(`./env`);

const bot = new Telegraf(env.BOT_TOKEN, {
    telegram: {
        apiRoot: env.API_ROOT,
    },
});

bot.command(`status`, ctx => {
    // Ignore the message if it's older than 2 seconds
    if (Date.now() / 1000 - ctx.message.date < 2) {
        ctx.reply(`The bot is up.`);
    }
});

require(`./middleware`)(bot);
require(`./handlers`)(bot);

module.exports = bot;
