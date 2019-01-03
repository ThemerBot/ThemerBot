const request = require(`request-promise`);

module.exports = (bot) => {
    const downloadUrl = `https://api.telegram.org/file/bot${bot.token}`;

    bot.context.downloadFile = async function () {
        const documentID = this.message.document.file_id;
        const file = await bot.telegram.getFile(documentID);

        return await request({
            uri: `${downloadUrl}/${file.file_path}`,
            encoding: null,
        });
    };

    bot.context.downloadPhoto = async function () {
        const photos = this.message.photo;
        const photo = photos.pop().file_id;
        const file = await bot.telegram.getFile(photo);

        return await request({
            uri: `${downloadUrl}/${file.file_path}`,
            encoding: null,
        });
    };
};
