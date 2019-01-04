const modules = [
    `action`,
    `download`,
    `i18n`,
];

module.exports = (bot) =>
    modules.forEach(middleware =>
        require(`./${middleware}`)(bot)
    );
