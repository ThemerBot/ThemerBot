export interface DonationLink {
    label: string;
    url: string;
}

export const parseDonationLinks = (input: string): DonationLink[] =>
    input
        .split(/[,\n]/)
        .map(entry => entry.trim())
        .filter(entry => entry !== '')
        .map(entry => {
            const separator = entry.indexOf('=');
            const label = entry.slice(0, separator).trim();
            const url = entry.slice(separator + 1).trim();

            if (separator === -1 || !label || !url || /\s/.test(url)) {
                throw new Error(
                    `Invalid donation link "${entry}", expected "Label=URL"`,
                );
            }

            return { label, url };
        });

export const formatDonationLinks = (links: DonationLink[]): string =>
    links.map(({ label, url }) => `${label}: ${url}`).join('\n');
