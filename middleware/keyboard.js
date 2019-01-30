module.exports = bot => {
    const defaultButton = button(bot.context.i18n(`default`), `default`);
    const backspaceButton = button(`⬅️`, `-`);

    bot.context.keyboard = function (backspace) {
        const lastButton = backspace ? backspaceButton : defaultButton;

        const keys = [
            [button(1), button(2), button(3)],
            [button(4), button(5), lastButton],
        ];

        if (this.chat.type !== `private`) {
            keys.push([button(this.i18n(`cancel`), `cancel,${this.from.id}`)]);
        }

        return { inline_keyboard: keys };
    };

    bot.context.createButton = button;

    bot.context.shareKeyboard = function (fileID) {
        return {
            inline_keyboard: [
                [
                    {
                        text: this.i18n(`share`),
                        switch_inline_query: `share ${fileID}`,
                    },
                ],
            ],
        };
    };
};

function button(text, data) {
    if (!data && !isNaN(text)) {
        data = text - 1;
    }

    return { text, callback_data: data };
}
