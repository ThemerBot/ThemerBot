const handlers = [`start`, `photos`];

module.exports = (bot) =>
    handlers.forEach(handler =>
        require(`./${handler}`)(bot)
    );
