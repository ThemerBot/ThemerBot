module.exports = bot => {
    bot.catch(error => {
        // Use .split instead of converting to regex and add the global flag
        error = (error.stack || error.toString())
            .split(bot.token)
            .join(`[TOKEN]`);

        if (process.env.LOG_CHANNEL) {
            /* eslint-disable quotes, no-console */
            bot.telegram.sendMessage(
                process.env.LOG_CHANNEL,
                '```\n' + error + '```',
                { parse_mode: `markdown` },
            );
            /* eslint-enable */
        } else {
            console.error(error.replace(/^/gm, `  `));
        }
    });
};
