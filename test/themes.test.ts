import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Attheme from 'attheme-js';
import { ThemeType } from '../src/types';
import { createTheme, getThemeName } from '../src/utils/themes';
import { adjustBrightness, isLight, themeData } from '../src/variables/helpers';

const colors = ['#223344', '#eeddcc', '#33aa66'];
const image = Buffer.from('wallpaper');

describe('createTheme', () => {
    it('creates an Android theme with the chosen colors and wallpaper', () => {
        const theme = new Attheme(
            createTheme({
                username: 'Bot',
                image,
                name: 'Test',
                colors,
                type: 'attheme',
            }),
        );

        assert.deepEqual(theme.get('actionBarDefault'), {
            red: 0x22,
            green: 0x33,
            blue: 0x44,
            alpha: 255,
        });
        assert.equal(theme.getWallpaper(), image.toString('binary'));
    });

    it('creates iOS and Telegram X themes containing the name', () => {
        for (const type of ['tgios-theme', 'tgx-theme'] as const) {
            const theme = createTheme({
                username: 'Bot',
                image,
                name: 'Test',
                colors,
                type,
            });
            assert.match(theme, /Test/);
        }
    });

    it('rejects unknown theme types', () => {
        assert.throws(
            () =>
                createTheme({
                    username: 'Bot',
                    image,
                    name: 'Test',
                    colors,
                    type: 'unknown' as ThemeType,
                }),
            TypeError,
        );
    });
});

describe('theme helpers', () => {
    it('names themes after the primary and background colors', () => {
        assert.equal(getThemeName('#000000', '#ffffff'), 'White on Black');
    });

    it('detects light and dark colors', () => {
        assert.equal(isLight('#ffffff'), true);
        assert.equal(isLight('#000000'), false);
    });

    it('adjusts lightness in either direction', () => {
        assert.equal(adjustBrightness('#808080', 10), '#9A9A9A');
        assert.equal(adjustBrightness('#808080', 10, true), '#676767');
    });

    it('uses white text on a dark primary color', () => {
        const data = themeData(['#223344', '#eeddcc', '#3366cc']);

        assert.equal(data.themeIsLight, false);
        assert.equal(data.filling, '#223344');
        assert.equal(data.primary, '#3366cc');
        assert.equal(data.textOnPrimary, '#ffffff');
    });

    it('uses darkened text on a light primary color', () => {
        const data = themeData(['#ffffff', '#222222', '#ffcc00']);

        assert.equal(data.themeIsLight, true);
        assert.notEqual(data.textOnPrimary, '#ffffff');
        assert.equal(isLight(data.textOnPrimary), false);
    });
});
