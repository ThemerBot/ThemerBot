const handlers = [
    `start`,
    `photos`,
    `documents`,
    `cbquery`,
    `rename`,
    `share`,
    `fix`,
];

module.exports = bot =>
    handlers.forEach(handler =>
        require(`./${handler}`)(bot)
    );
