const Sentry = require(`@sentry/node`);

module.exports = bot => {
    bot.catch(error => {
        console.error((error.stack || error.toString()).replace(/^/gm, `  `));
        Sentry.captureException(error);
    });
};
