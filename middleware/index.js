const env = require(`../env`);

const modules = [
    `errors`,
    `storage`,
    `download`,
    `keyboard`,
    `colors`,
    `i18n`,
    `maketheme`,
    `theme-preview`,
];

module.exports = bot => {
    if (env.ENABLE_STATS) {
        const tgan = require(`telegraf-plugin-tgan`);
        bot.use(tgan());
    }

    modules.forEach(middleware => require(`./${middleware}`)(bot));
};
