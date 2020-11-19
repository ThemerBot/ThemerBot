const env = require(`../env`);
const fs = require(`promise-fs`);
const request = require(`request-promise`);

module.exports = bot => {
    const getFileLink = async fileID => {
        const file = await bot.telegram.getFile(fileID);

        if (env.LOCAL_API_ROOT) {
            return file.file_path;
        }

        return `${env.API_ROOT}/file/bot${env.BOT_TOKEN}/${file.file_path}`;
    };

    const getPhoto = async (link, forceDownload) => {
        if (env.LOCAL_API_ROOT) {
            if (!forceDownload) {
                return link;
            }

            return await fs.readFile(link);
        }

        return await request({
            uri: link,
            encoding: null,
        });
    };

    bot.context.downloadFile = async function (forceDownload) {
        const message = this.message.reply_to_message || this.message;
        const documentID = message.document.file_id;
        const link = await getFileLink(documentID);

        return await getPhoto(link, forceDownload);
    };

    bot.context.downloadPhoto = async function (forceDownload) {
        const photos = this.message.photo;
        const photo = photos.pop().file_id;
        const link = await getFileLink(photo);

        return await getPhoto(link, forceDownload);
    };
};
