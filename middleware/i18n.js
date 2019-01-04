const newI18n = require(`new-i18n`);
const i18n = newI18n(`${__dirname}/../i18n`, [`en`]);

module.exports = bot => {
    bot.context.i18n = function (keyword, variables) {
        let lang = this.from.language_code;
        lang = i18n.languages.includes(lang) ? lang : `en`;

        return i18n(lang, keyword, variables);
    };
};
