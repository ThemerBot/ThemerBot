`use strict`;

const handlers = [`start`];

module.exports = (bot) =>
    handlers.forEach(handler =>
        require(`./${handler}`)(bot)
    );
