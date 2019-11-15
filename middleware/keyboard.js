module.exports = bot => {
    const backspaceButton = button(`⬅️`, `-`);

    bot.context.keyboard = function(backspace) {
        const defaultButton = button(this.i18n(`default`), `default`);
        const cancelButton = button(
            this.i18n(`cancel`),
            `cancel,${this.from.id}`
        );
        const lastButton = backspace ? backspaceButton : defaultButton;

        const keys = [
            [button(1), button(2), button(3)],
            [button(4), button(5), lastButton],
            [cancelButton],
        ];

        return { inline_keyboard: keys };
    };

    bot.context.typeKeyboard = function() {
        return {
            reply_markup: {
                inline_keyboard: [`attheme`, `tgx-theme`, `tgios-theme`].map(
                    type => {
                        return [button(`${this.i18n(type)} (.${type})`, type)];
                    }
                ),
            },
        };
    };

    bot.context.createButton = button;

    bot.context.shareKeyboard = function(fileID) {
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
