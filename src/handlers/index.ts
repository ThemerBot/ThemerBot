import { Composer } from 'grammy';
import { I18nContext } from '../types';
import donate from './donate';
import help from './help';
import customColor from './custom-color';
import photos from './photos';
import callbackQuery from './callback-query';
import rename from './rename';
import fix from './fix';

const composer = new Composer<I18nContext>();

composer.use(donate);
composer.use(help);
composer.use(customColor);
composer.use(photos);
composer.use(callbackQuery);
composer.use(rename);
composer.use(fix);

export default composer;
