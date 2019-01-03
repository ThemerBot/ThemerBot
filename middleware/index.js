const modules = [`action`, `download`, `keyboard`, `colors`];

module.exports = (bot) =>
    modules.forEach(middleware =>
        require(`./${middleware}`)(bot)
    );
