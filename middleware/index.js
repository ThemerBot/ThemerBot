`use strict`;

const modules = [`action`, `download`];

module.exports = (bot) =>
    modules.forEach(middleware =>
        require(`./${middleware}`)(bot)
    );
