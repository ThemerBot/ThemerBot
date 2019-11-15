module.exports = bot => {
    bot.context.sendChatAction = function(action) {
        bot.telegram.sendChatAction(this.chat.id, action);
    };

    bot.context.action = function(action = `typing`) {
        this.sendChatAction(action);

        const interval = setInterval(() => this.sendChatAction(action), 4000);
        const stop = () => clearInterval(interval);

        return { stop };
    };
};
