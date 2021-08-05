import { Context } from 'grammy';
import { Variables } from 'new-i18n/lib/types';

export interface I18nContext extends Context {
    theme?: Theme;
    i18n: (keyword: string, variables?: Variables) => string;
}

export interface Theme {
    photo: string | Buffer;
    colors: string[];
    using: {
        label: string;
        color: string;
    }[];
}

export type ThemeType = 'attheme' | 'tgios-theme' | 'tgx-theme';
