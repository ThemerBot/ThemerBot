import { readdirSync } from 'fs';
import { Middleware } from 'grammy';
import I18n from 'new-i18n';
import { Variables } from 'new-i18n/lib/types';
import path from 'path';
import { I18nContext } from '../types';

const folder = path.join(__dirname, '../../i18n');
const fallback = 'en';

export type Translate = (
    languageCode: string | undefined,
    keyword: string,
    variables?: Variables,
) => string;

export const createTranslator = (): Translate => {
    const languages = readdirSync(folder)
        .filter(file => file.endsWith('.json'))
        .map(file => file.slice(0, -5));

    const i18n = new I18n({ folder, languages, fallback });

    const resolveLanguage = (languageCode = '') => {
        const code = languageCode.toLowerCase();

        if (languages.includes(code)) {
            return code;
        }

        const [base] = code.split('-');
        return languages.includes(base) ? base : fallback;
    };

    return (languageCode, keyword, variables) =>
        i18n.translate(resolveLanguage(languageCode), keyword, variables) ?? '';
};

export const middleware = (): Middleware<I18nContext> => {
    const translate = createTranslator();

    return async (ctx, next) => {
        ctx.i18n = (keyword, variables) =>
            translate(ctx.from?.language_code, keyword, variables);

        await next();
    };
};
