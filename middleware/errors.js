/* eslint-disable quotes, no-console */

module.exports = bot => {
    bot.catch(error => {
        error = error.stack || error.toString();

        if (process.env.LOG_CHANNEL) {
            bot.telegram.sendMessage(
                process.env.LOG_CHANNEL,
                '```\n' + error + '```',
                { parse_mode: `markdown` },
            );
        } else {
            console.error(error.replace(/^/gm, `  `));
        }
    });
};
