import { run, sequentialize } from '@grammyjs/runner';
import { apiThrottler } from '@grammyjs/transformer-throttler';
import { Bot } from 'grammy';
import env from './env';
import handlers from './handlers';
import { I18nContext } from './types';
import { middleware as i18n } from './utils/i18n';
import { close as closeStats, middleware as stats } from './utils/stats';
import { client as redisClient, startImageCleanup } from './utils/storage';

const main = async () => {
    const bot = new Bot<I18nContext>(env.BOT_TOKEN, {
        client: {
            apiRoot: env.API_ROOT,
        },
    });

    bot.use(sequentialize(ctx => ctx.chat?.id.toString()));

    bot.catch(err => {
        console.error(
            `Error while handling update ${err.ctx.update.update_id}:`,
        );
        console.error(err.error);
    });

    bot.command('status', ctx => {
        // Ignore the message if it's older than 2 seconds
        if (Date.now() / 1000 - ctx.msg.date < 2) {
            ctx.reply('The bot is up.');
        }
    });

    bot.api.config.use(apiThrottler());

    if (env.ENABLE_STATS) {
        bot.use(stats());
    }
    bot.use(i18n());
    bot.use(handlers);

    await redisClient.connect();
    const cleanupTimer = startImageCleanup();

    const runner = run(bot);
    console.log('Bot started');

    const shutdown = async (signal: NodeJS.Signals) => {
        console.log(`Received ${signal}, shutting down`);

        if (runner.isRunning()) {
            await runner.stop();
        }

        clearInterval(cleanupTimer);
        await Promise.allSettled([redisClient.close(), closeStats()]);
    };

    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
};

main().catch(error => {
    console.error('Failed to start the bot:', error);
    process.exit(1);
});
