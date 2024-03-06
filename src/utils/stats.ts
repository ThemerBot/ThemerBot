import { Middleware } from 'grammy';
import mysql from 'mysql2/promise';
import env from '../env';
import { I18nContext } from '../types';

export const middleware = async (): Promise<Middleware<I18nContext>> => {
    const connection = await mysql.createConnection({
        host: env.MYSQL_HOST,
        user: env.MYSQL_USER,
        password: env.MYSQL_PASS,
        port: env.MYSQL_PORT,
        database: env.MYSQL_DB,
    });

    return async (ctx, next) => {
        const nextPromise = next();

        if (ctx.from) {
            try {
                await connection.query(
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
        }

        await nextPromise;
    };
};
