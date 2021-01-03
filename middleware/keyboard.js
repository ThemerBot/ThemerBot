module.exports = bot => {
    const backspaceButton = button(`⬅️`, `-`);

    bot.context.keyboard = function (backspace) {
        const autoButton = button(this.i18n(`auto`), `default`);
        const lastButton = backspace ? backspaceButton : autoButton;
        const cancelButton = button(this.i18n(`cancel`), `cancel,${this.from.id}`);

        const whiteButton = button(this.i18n(`white`), `white`);
        const blackButton = button(this.i18n(`black`), `black`);

        const keys = [
            [button(1), button(2), button(3), button(4), button(5)],
            [whiteButton, blackButton, lastButton],
            [cancelButton],
        ];

        return { inline_keyboard: keys };
    };

    bot.context.typeKeyboard = function () {
        return {
            inline_keyboard: [`attheme`, `tgx-theme`, `tgios-theme`].map(type => {
                return [button(`${this.i18n(type)} (.${type})`, type)];
            }),
        };
    };

    bot.context.createButton = button;
};

function button(text, data) {
    if (!data && typeof text === `number`) {
        data = text - 1;
    }

    return {
        text: text.toString(),
        callback_data: data.toString(),
    };
}
