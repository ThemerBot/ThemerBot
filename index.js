const debug = require(`debug`)(`themerbot:core`);
const env = require(`./env`);
const fs = require(`fs`);
const path = require(`path`);
const downloadTranslations = require(`./scripts/download-translations`);
const Telegraf = require(`telegraf`);
const Sentry = require(`@sentry/node`);
const os = require(`os`);
const cluster = require(`cluster`);

const main = async () => {
    if (env.SENTRY_DSN) {
        debug(`Initializing Sentry logs`);
        Sentry.init({
            dsn: env.SENTRY_DSN,
        });
    }

    if (!fs.existsSync(path.join(__dirname, `i18n`))) {
        debug(`Downloading i18n files`);
        await downloadTranslations();
    }

    if (cluster.isMaster) {
        debug(`Master %d is running`, process.pid);

        const cores = os.cpus().length;
        const workers = [];

        for (let i = 0; i < cores; i++) {
            workers.push(cluster.fork());
        }

        let forks = 0;
        const master = new Telegraf(env.BOT_TOKEN, {
            telegram: {
                apiRoot: env.API_ROOT,
            },
        });

        master.handleUpdate = update => {
            if (forks < 0) {
                forks = cores - 1;
            }

            workers[forks].send(update);
            forks--;

            return Promise.resolve();
        };

        master.launch();
    } else {
        debug(`Worker %d started`, process.pid);

        const bot = require(`./bot`);
        bot.context.botInfo = await bot.telegram.getMe();

        process.on(`message`, update => {
            bot.handleUpdate(update);
        });
    }
};

main();
