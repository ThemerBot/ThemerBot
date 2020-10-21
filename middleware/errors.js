const Sentry = require(`@sentry/node`);

const handleError = error => {
    console.error((error.stack || error.toString()).replace(/^/gm, `  `));
    Sentry.captureException(error);
};

module.exports = bot => {
    bot.catch(handleError);
};

module.exports.asyncHandler = handler => (ctx, next) => {
    handler(ctx, next).catch(error => {
        handleError(error);
    });
};
