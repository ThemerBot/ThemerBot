/**
 * Copied from http://chir.ag/projects/ntc/ntc.js
 * http://chir.ag/projects/ntc/
 */

const names = require(`./names`);

const ntc = {
    init() {
        let color, rgb, hsl;
        for (let i = 0; i < names.length; i++) {
            color = `#` + names[i][0];
            rgb = ntc.rgb(color);
            hsl = ntc.hsl(color);
            names[i].push(rgb[0], rgb[1], rgb[2], hsl[0], hsl[1], hsl[2]);
        }
    },

    name(color) {
        color = color.toUpperCase();
        if (color.length < 3 || color.length > 7) {
            return [`#000000`, `Invalid Color: ` + color, false];
        }
        if (color.length % 3 === 0) {
            color = `#` + color;
        }
        if (color.length === 4) {
            color =
                `#` +
                color.substr(1, 1) +
                color.substr(1, 1) +
                color.substr(2, 1) +
                color.substr(2, 1) +
                color.substr(3, 1) +
                color.substr(3, 1);
        }

        const [r, g, b] = ntc.rgb(color);
        const [h, s, l] = ntc.hsl(color);
        let ndf1 = 0,
            ndf2 = 0,
            ndf = 0;
        let cl = -1,
            df = -1;

        for (let i = 0; i < names.length; i++) {
            if (color === `#` + names[i][0]) {
                return [`#` + names[i][0], names[i][1], true];
            }

            ndf1 =
                Math.pow(r - names[i][2], 2) +
                Math.pow(g - names[i][3], 2) +
                Math.pow(b - names[i][4], 2);
            ndf2 =
                Math.pow(h - names[i][5], 2) +
                Math.pow(s - names[i][6], 2) +
                Math.pow(l - names[i][7], 2);
            ndf = ndf1 + ndf2 * 2;
            if (df < 0 || df > ndf) {
                df = ndf;
                cl = i;
            }
        }

        return cl < 0
            ? [`#000000`, `Invalid Color: ` + color, false]
            : [`#` + names[cl][0], names[cl][1], false];
    },

    // adopted from: Farbtastic 1.2
    // http://acko.net/dev/farbtastic
    hsl(color) {
        const rgb = [
            parseInt(`0x` + color.substring(1, 3)) / 255,
            parseInt(`0x` + color.substring(3, 5)) / 255,
            parseInt(`0x` + color.substring(5, 7)) / 255,
        ];
        let h = 0,
            s = 0;
        const min = Math.min(r, Math.min(g, b)),
            max = Math.max(r, Math.max(g, b)),
            delta = max - min,
            l = (min + max) / 2,
            [r, g, b] = rgb;

        if (l > 0 && l < 1) {
            s = delta / (l < 0.5 ? 2 * l : 2 - 2 * l);
        }

        if (delta > 0) {
            if (max === r && max !== g) {
                h += (g - b) / delta;
            }
            if (max === g && max !== b) {
                h += 2 + (b - r) / delta;
            }
            if (max === b && max !== r) {
                h += 4 + (r - g) / delta;
            }
            h /= 6;
        }
        return [parseInt(h * 255), parseInt(s * 255), parseInt(l * 255)];
    },

    // adopted from: Farbtastic 1.2
    // http://acko.net/dev/farbtastic
    rgb(color) {
        return [
            parseInt(`0x` + color.substring(1, 3)),
            parseInt(`0x` + color.substring(3, 5)),
            parseInt(`0x` + color.substring(5, 7)),
        ];
    },
};

ntc.init();

module.exports = ntc;
