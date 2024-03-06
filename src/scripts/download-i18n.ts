import fs from 'fs';
import path from 'path';
import { Open as unzip } from 'unzipper';

const LOKALISE_API_TOKEN = '25080e24f2b5608c1137c735b62860b8dde17fdb'; // Read-only
const LOKALISE_PROJECT_ID = '188240255de857128aa437.31917744';

const download = async (): Promise<void> => {
    const downloadResponse = await fetch(
        `https://api.lokalise.com/api2/projects/${LOKALISE_PROJECT_ID}/files/download`,
        {
            method: 'POST',
            headers: {
                'X-Api-Token': LOKALISE_API_TOKEN,
            },
            body: JSON.stringify({
                all_platforms: true,
                bundle_structure: '%LANG_ISO%.%FORMAT%',
                export_empty_as: 'skip',
                export_sort: 'first_added',
                filter_data: ['reviewed_only'],
                format: 'json',
                language_mapping: [
                    {
                        original_language_iso: 'hi_IN',
                        custom_language_iso: 'hi',
                    },
                ],
                original_filenames: false,
                replace_breaks: false,
            }),
        },
    );
    const { bundle_url } = await downloadResponse.json();

    const zipResponse = await fetch(bundle_url);
    const zip = Buffer.from(await zipResponse.arrayBuffer());

    const { files } = await unzip.buffer(zip);
    const i18nDir = path.join(__dirname, '../../i18n');

    fs.mkdirSync(i18nDir, { recursive: true });

    await Promise.all(
        files.map(file => {
            return new Promise<void>((resolve, reject) => {
                if (file.type !== 'File') {
                    return resolve();
                }

                const filePath = path.join(i18nDir, file.path);

                file.buffer().then(buffer => {
                    fs.writeFile(filePath, buffer, error => {
                        if (error) {
                            return reject(error);
                        }

                        resolve();
                    });
                });
            });
        }),
    );
};

if (require.main === module) {
    download();
}

export default download;
