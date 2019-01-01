`use strict`;

const modules = [`action`];

module.exports = (bot) =>
    modules.forEach(middleware =>
        require(`./${middleware}`)(bot)
    );
