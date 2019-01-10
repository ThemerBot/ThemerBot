const handlers = [
    `start`,
    `photos`,
    `documents`,
    `cbquery`,
    `rename`,
];

module.exports = bot =>
    handlers.forEach(handler =>
        require(`./${handler}`)(bot)
    );
