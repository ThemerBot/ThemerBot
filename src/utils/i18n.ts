import { readdirSync } from 'fs';
import { Middleware } from 'grammy';
import { I18nContext } from '../types';
import I18n from 'new-i18n';
import path from 'path';

const folder = path.join(__dirname, '../../i18n');

export const middleware = (): Middleware<I18nContext> => {
    const i18n = new I18n({
        folder,
        languages: readdirSync(folder)
            .filter(file => file.endsWith('.json'))
            .map(file => file.slice(0, -5)),
        fallback: 'en',
    });

    return async (ctx, next) => {
        ctx.i18n = (keyword, variables) =>
            i18n.translate(ctx.from?.language_code ?? '', keyword, variables) ??
            '';

        await next();
    };
};
