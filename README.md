# ThemerBot

## Instructions

-   Requires Node.js 24 or newer.
-   Copy `.env.example` to `.env`
-   Run `npm start`

`npm start` builds the TypeScript source before starting the bot.

## Docker

-   Set `REDIS_HOST=redis` and `MYSQL_HOST=mysql` in `.env`
-   Run `docker compose up -d`

`database.sql` is applied automatically only when the MySQL volume is first created. For an existing volume, apply it manually if the `stats` table doesn't exist.

## Translations

Translation files are downloaded from [Lokalise](https://lokalise.com/public/188240255de857128aa437.31917744/) when you run the bot for the first time. If you would like to redownload them, you can either delete the `i18n` directory and restart the bot or run `npm run i18n`.

> Thank you to [Lokalise](https://lokalise.com) for providing me with a free open source license.
