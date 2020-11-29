const Sentry = require(`@sentry/node`);
const debug = require(`debug`)(`themerbot:middleware:errors`);

const handleError = error => {
    debug(error);
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
