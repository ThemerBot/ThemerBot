const tgan = require(`telegraf-plugin-tgan`);

const modules = [
    `storage`,
    `errors`,
    `action`,
    `download`,
    `keyboard`,
    `colors`,
    `i18n`,
    `maketheme`,
    `theme-preview`,
];

module.exports = bot => {
    bot.use(tgan());

    modules.forEach(middleware => require(`./${middleware}`)(bot));
};
