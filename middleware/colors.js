const getColors = require(`get-image-colors`);

module.exports = (bot) => {
    bot.context.getImageColors = async (buffer, type) => {
        const colors = await getColors(buffer, type || `image/jpeg`);
        return colors.map(color => color.hex());
    };
};
