`use strict`;

const {
    token,
    username = ``,
} = require(`./config`);

const Telegraf = require(`telegraf`);
const bot = new Telegraf(token, { username });

require(`./middleware`)(bot);
require(`./handlers`)(bot);

bot.startPolling();
