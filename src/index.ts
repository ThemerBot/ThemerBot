import { Bot } from 'grammy';
import { apiThrottler } from '@grammyjs/transformer-throttler';
import { run } from '@grammyjs/runner';
import env from './env';
import fs from 'fs';
import handlers from './handlers';
import path from 'path';
import { middleware as i18n } from './utils/i18n';
import { middleware as stats } from './utils/stats';
import { I18nContext } from './types';
import downloadI18n from './scripts/download-i18n';

const main = async () => {
    if (!fs.existsSync(path.join(__dirname, 'i18n'))) {
        await downloadI18n();
    }

    const bot = new Bot<I18nContext>(env.BOT_TOKEN, {
        client: {
            apiRoot: env.API_ROOT,
        },
    });

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
        bot.use(await stats());
    }
    bot.use(i18n());
    bot.use(handlers);

    run(bot);
    console.log('Bot started');
};

main();
