const handlers = [
    `start`,
    `photos`,
    `cbquery`,
];

module.exports = (bot) =>
    handlers.forEach(handler =>
        require(`./${handler}`)(bot)
    );
