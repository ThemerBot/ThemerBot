const handlers = [
    `start`,
    `photos`,
    `documents`,
    `cbquery`,
    `rename`,
    `share`,
];

module.exports = bot =>
    handlers.forEach(handler =>
        require(`./${handler}`)(bot)
    );
