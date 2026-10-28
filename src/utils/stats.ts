import { Middleware } from 'grammy';
import mysql from 'mysql2/promise';
import env from '../env';
import { I18nContext } from '../types';

export const middleware = (): Middleware<I18nContext> => {
    const pool = mysql.createPool({
        host: env.MYSQL_HOST,
        user: env.MYSQL_USER,
        password: env.MYSQL_PASS,
        port: env.MYSQL_PORT,
        database: env.MYSQL_DB,
    });

    const record = async (ctx: I18nContext) => {
        if (!ctx.from) {
            return;
        }

        try {
            await pool.query(
                'insert into stats (user_id, update_type, created_at) values (?, ?, ?)',
                [
                    ctx.from.id,
                    Object.entries(ctx.update).find(
                        ([, value]) => typeof value === 'object',
                    )?.[0] ?? null,
                    new Date(),
                ],
            );
        } catch (error) {
            console.error(error);
        }
    };

    return async (ctx, next) => {
        await Promise.all([next(), record(ctx)]);
    };
};
