const store = new Map();

const getKey = ctx => `${ctx.chat.id}:${ctx.from.id}`;

module.exports = bot => {
    bot.context.saveTheme = function(messageId, theme) {
        const key = getKey(this);
        const usersThemes = store.get(key) || {};

        if (theme === null) {
            delete usersThemes[messageId];
        } else {
            usersThemes[messageId] = { ...theme };
        }

        store.set(key, usersThemes);
    };

    bot.context.getTheme = function(messageId) {
        const key = getKey(this);
        const usersThemes = store.get(key) || {};
        const theme = usersThemes[messageId];

        return theme ? { ...theme } : null;
    };
};
