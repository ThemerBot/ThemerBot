const Sentry = require(`@sentry/node`);

module.exports = bot => {
    bot.catch(error => {
        if (process.env.SENTRY_DSN) {
            Sentry.captureException(error);
        } else {
            console.error(
                (error.stack || error.toString()).replace(/^/gm, `  `),
            );
        }
    });
};
