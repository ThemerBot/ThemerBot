const fs = require(`fs`);
const path = require(`path`);
const newI18n = require(`new-i18n`);

const i18nDir = path.join(__dirname, `../i18n`);
const languages = fs
    .readdirSync(i18nDir)
    .filter(file => file.endsWith(`.json`))
    .map(file => file.slice(0, -5));
const i18n = newI18n(i18nDir, languages, `en`);

module.exports = bot => {
    bot.context.i18n = function(keyword, variables) {
        let lang = this.from.language_code;
        lang = i18n.languages.includes(lang) ? lang : `en`;

        return i18n(lang, keyword, variables);
    };
};
