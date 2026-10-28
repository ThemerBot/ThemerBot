import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';

type Strings = Record<string, string>;

const i18nDir = path.join(__dirname, '../i18n');
const srcDir = path.join(__dirname, '../src');

const languages = Object.fromEntries(
    fs
        .readdirSync(i18nDir)
        .filter(file => file.endsWith('.json'))
        .map(file => [
            file.slice(0, -5),
            JSON.parse(
                fs.readFileSync(path.join(i18nDir, file), 'utf8'),
            ) as Strings,
        ]),
);
const en = languages.en;

const markdownKeys = [
    'choose_color_1',
    'choose_color_2',
    'choose_color_3',
    'choose_color_4',
    'type_of_theme',
    'sponsored_by',
];

const placeholders = (text: string) =>
    (text.match(/\{\{.+?\}\}/g) ?? []).sort();
const htmlTags = (text: string) => text.match(/<\/?[a-z][^>]*>/g) ?? [];
const markdownLinks = (text: string) =>
    (text.match(/\]\([^)]+\)/g) ?? []).sort();

const sourceFiles = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory() ? sourceFiles(fullPath) : [fullPath];
    });

describe('translations', () => {
    it('define every key used in the code in English', () => {
        const used = new Set([
            ...['1', '2', '3', '4'].map(n => `choose_color_${n}`),
            'attheme',
            'tgx-theme',
            'tgios-theme',
        ]);

        for (const file of sourceFiles(srcDir)) {
            const source = fs.readFileSync(file, 'utf8');
            for (const [, key] of source.matchAll(/i18n\(\s*'([\w-]+)'/g)) {
                used.add(key);
            }
        }

        const missing = [...used].filter(key => !(key in en));
        assert.deepEqual(missing, []);
    });

    for (const [language, strings] of Object.entries(languages)) {
        describe(language, () => {
            it('only contains keys that exist in English', () => {
                const unknown = Object.keys(strings).filter(
                    key => !(key in en),
                );
                assert.deepEqual(unknown, []);
            });

            it('keeps the placeholders, HTML tags, and links from English', () => {
                for (const [key, text] of Object.entries(strings)) {
                    if (!(key in en)) {
                        continue;
                    }

                    assert.deepEqual(
                        placeholders(text),
                        placeholders(en[key]),
                        `${language}.${key} placeholders`,
                    );
                    assert.deepEqual(
                        htmlTags(text),
                        htmlTags(en[key]),
                        `${language}.${key} HTML tags`,
                    );
                    assert.deepEqual(
                        markdownLinks(text),
                        markdownLinks(en[key]),
                        `${language}.${key} links`,
                    );
                }
            });

            it('avoids Markdown control characters in Markdown messages', () => {
                for (const key of markdownKeys) {
                    if (key in strings) {
                        assert.doesNotMatch(
                            strings[key],
                            /[_*`[]/,
                            `${language}.${key}`,
                        );
                    }
                }
            });
        });
    }
});
