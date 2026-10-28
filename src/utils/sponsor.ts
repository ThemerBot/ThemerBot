import env from '../env';
import { I18nContext } from '../types';

export const getSponsor = (ctx: I18nContext): string =>
    env.SPONSORED_BY && env.SPONSOR_MESSAGE
        ? `\n\n*${ctx.i18n('sponsored_by', { sponsor: env.SPONSORED_BY })}*\n${env.SPONSOR_MESSAGE}`
        : '';
