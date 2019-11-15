/* eslint-disable quotes, no-console */

module.exports = bot => {
    bot.catch(error => {
        if (process.env.LOG_CHANNEL) {
            bot.telegram.sendMessage(
                process.env.LOG_CHANNEL,
                '```\n' + error.toString() + '```',
                { parse_mode: `markdown` }
            );
        } else {
            console.error(
                (error.stack || error.toString()).replace(/^/gm, `  `)
            );
        }
    });
};
