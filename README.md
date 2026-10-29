# ThemerBot

## Instructions

-   Requires Node.js 22.13+ or 24+.
-   Copy `.env.example` to `.env`
-   Run `npm start`

`npm start` builds the TypeScript source before starting the bot. Run `npm test` to type-check and run the unit tests.

## Donations

-   Set `STRIPE_TOKEN` to accept donations through Telegram payments.
-   Otherwise, set `DONATION_LINKS` to comma-separated `Label=URL` pairs (for example `ko-fi=ko-fi.com/name,PayPal=paypal.me/name`), and `/donate` lists them.
-   With neither set, `/donate` says donations aren't enabled.

## Docker

-   Set `REDIS_HOST=redis` and `MYSQL_HOST=mysql` in `.env`
-   Run `docker compose up -d`

`database.sql` is applied automatically only when the MySQL volume is first created. For an existing volume, apply it manually if the `stats` table doesn't exist.

## Translations

Translation files live in the `i18n` directory. Edit them directly; `en.json` is the source language and the fallback for missing translations.
