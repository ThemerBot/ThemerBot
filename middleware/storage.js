const store = new Map();

const getKey = ctx => `${ctx.chat.id}:${ctx.from.id}`;

const removeTheme = (key, messageId) => {
    const usersThemes = store.get(key) || {};

    if (usersThemes[messageId]) {
        delete usersThemes[messageId];
    }

    if (Object.keys(usersThemes).length === 0) {
        store.delete(key);
    } else {
        store.set(key, usersThemes);
    }
};

module.exports = bot => {
    bot.context.saveTheme = function (messageId, theme) {
        const key = getKey(this);
        const usersThemes = store.get(key) || {};

        if (usersThemes[messageId]) {
            clearTimeout(usersThemes[messageId].timeout);
        }

        if (theme === null) {
            delete usersThemes[messageId];
        } else {
            const timeout = setTimeout(
                removeTheme,
                1000 * 60 * 5, // 5 minutes
                key,
                messageId,
            );

            usersThemes[messageId] = { ...theme, timeout };
        }

        if (Object.keys(usersThemes).length === 0) {
            store.delete(key);
        } else {
            store.set(key, usersThemes);
        }
    };

    bot.context.getTheme = function (messageId) {
        const key = getKey(this);
        const usersThemes = store.get(key) || {};
        const theme = usersThemes[messageId];

        return theme ? { ...theme } : null;
    };
};
