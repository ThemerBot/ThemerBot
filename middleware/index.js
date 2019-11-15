const modules = [
    `storage`,
    `errors`,
    `action`,
    `download`,
    `keyboard`,
    `colors`,
    `i18n`,
    `maketheme`,
];

module.exports = bot =>
    modules.forEach(middleware => require(`./${middleware}`)(bot));
