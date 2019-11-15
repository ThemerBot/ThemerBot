const request = require(`request-promise`);

module.exports = bot => {
    bot.context.downloadFile = async function() {
        const message = this.message.reply_to_message || this.message;
        const documentID = message.document.file_id;
        const link = await bot.telegram.getFileLink(documentID);

        return await request({
            uri: link,
            encoding: null,
        });
    };

    bot.context.downloadPhoto = async function() {
        const photos = this.message.photo;
        const photo = photos.pop().file_id;
        const link = await bot.telegram.getFileLink(photo);

        return await request({
            uri: link,
            encoding: null,
        });
    };
};
