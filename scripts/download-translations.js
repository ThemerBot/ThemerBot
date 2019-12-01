/* eslint-disable no-console */

const fs = require(`fs`);
const path = require(`path`);
const request = require(`request-promise`);

const getResponse = async (apiPath, data) => {
    const { PO_API_TOKEN, PO_PROJECT_ID = 235195 } = process.env;

    const { response, result } = await request({
        method: `POST`,
        uri: `https://api.poeditor.com/v2${apiPath}`,
        json: true,
        formData: {
            api_token: PO_API_TOKEN,
            id: PO_PROJECT_ID,
            ...data,
        },
    });

    if (response.code !== `200`) {
        console.log(response.message);
        process.exit();
    }

    return result;
};

const main = async () => {
    const { languages } = await getResponse(`/languages/list`);
    const dirPath = path.join(__dirname, `../i18n`);

    try {
        fs.mkdirSync(dirPath);
    } catch (_) {
        // Ignore errors
    }

    return new Promise(resolve => {
        for (const index in languages) {
            const { name, code } = languages[index];
            const filePath = path.join(dirPath, `${code}.json`);

            getResponse(`/projects/export`, {
                language: code,
                type: `key_value_json`,
            }).then(({ url }) => {
                request(url)
                    .pipe(fs.createWriteStream(filePath))
                    .on(`close`, () => {
                        console.log(`Saved ${name}`);

                        if (Number(index) === languages.length - 1) {
                            resolve();
                        }
                    });
            });
        }
    });
};

if (require.main === module) {
    require(`dotenv`).config();
    main();
} else {
    module.exports = main;
}
