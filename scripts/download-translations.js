/* eslint-disable no-console */

const fs = require(`fs`);
const path = require(`path`);
const {
    Open: { buffer: unzip },
} = require(`unzipper`);
const request = require(`request-promise`);
const Sentry = require(`@sentry/node`);

const LOKALISE_API_TOKEN = `25080e24f2b5608c1137c735b62860b8dde17fdb`; // Read-only
const LOKALISE_PROJECT_ID = `188240255de857128aa437.31917744`;

const main = async () => {
    const { bundle_url } = await request({
        method: `POST`,
        uri: `https://api.lokalise.com/api2/projects/${LOKALISE_PROJECT_ID}/files/download`,
        json: true,
        headers: {
            'X-Api-Token': LOKALISE_API_TOKEN,
        },
        body: {
            all_platforms: true,
            bundle_structure: `%LANG_ISO%.%FORMAT%`,
            export_empty_as: `skip`,
            export_sort: `first_added`,
            filter_data: [`reviewed_only`],
            format: `json`,
            language_mapping: [
                {
                    original_language_iso: `hi_IN`,
                    custom_language_iso: `hi`,
                },
            ],
            original_filenames: false,
            replace_breaks: false,
        },
    });

    const zip = await request({
        method: `GET`,
        uri: bundle_url,
        encoding: null,
    });

    const { files } = await unzip(zip);
    const i18nDir = path.join(__dirname, `../i18n`);

    try {
        fs.mkdirSync(i18nDir);
    } catch (error) {
        if (error.code !== `EEXIST`) {
            throw error;
        } else {
            Sentry.captureException(error);
            console.log(`There was an error`);
            return;
        }
    }

    return Promise.all(
        files.map(file => {
            return new Promise((resolve, reject) => {
                if (file.type !== `File`) {
                    return resolve();
                }

                const filePath = path.join(i18nDir, file.path);

                file.buffer().then(buffer => {
                    fs.writeFile(filePath, buffer, error => {
                        if (error) {
                            console.log(`Failed to save ${file.path}`);
                            return reject(error);
                        }

                        console.log(`Saved ${file.path}`);
                        resolve();
                    });
                });
            });
        }),
    );
};

if (require.main === module) {
    main();
} else {
    module.exports = main;
}
