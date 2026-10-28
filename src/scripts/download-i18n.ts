import fs from 'fs/promises';
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
    const { error, bundle_url } = await downloadResponse.json();

    if (!downloadResponse.ok || error) {
        throw new Error(
            `Error downloading i18n: ${error?.message ?? downloadResponse.statusText}`,
        );
    }

    const zipResponse = await fetch(bundle_url);

    if (!zipResponse.ok) {
        throw new Error(
            `Error downloading i18n bundle: ${zipResponse.status} ${zipResponse.statusText}`,
        );
    }

    const zip = Buffer.from(await zipResponse.arrayBuffer());
    const { files } = await unzip.buffer(zip);

    const i18nDir = path.join(__dirname, '../../i18n');
    const tempDir = `${i18nDir}.tmp-${process.pid}`;

    await fs.rm(tempDir, { recursive: true, force: true });
    await fs.mkdir(tempDir, { recursive: true });

    try {
        await Promise.all(
            files
                .filter(file => file.type === 'File')
                .map(async file => {
                    const filePath = path.join(
                        tempDir,
                        path.basename(file.path),
                    );
                    await fs.writeFile(filePath, await file.buffer());
                }),
        );

        await fs.rm(i18nDir, { recursive: true, force: true });
        await fs.rename(tempDir, i18nDir);
    } catch (writeError) {
        await fs.rm(tempDir, { recursive: true, force: true });
        throw writeError;
    }
};

if (require.main === module) {
    download().catch(error => {
        console.error(error);
        process.exitCode = 1;
    });
}

export default download;
