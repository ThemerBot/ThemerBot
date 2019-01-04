const modules = [
    `action`,
    `download`,
    `keyboard`,
    `colors`,
    `i18n`,
];

module.exports = (bot) =>
    modules.forEach(middleware =>
        require(`./${middleware}`)(bot)
    );
