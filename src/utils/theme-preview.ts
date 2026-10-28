/**
 * https://gitlab.com/AlexStrNik/attheme-preview
 */

import { brightness, RgbColor } from '@snejugal/color';
import {
    DOMParser,
    XMLSerializer,
    type Document as XmlDocument,
    type Element as XmlElement,
    type Node as XmlNode,
} from '@xmldom/xmldom';
import Attheme from 'attheme-js';
import fallbacks from 'attheme-js/lib/fallbacks';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const { serializeToString: serialize } = new XMLSerializer();

const templatePath = path.join(__dirname, '../../assets/theme-preview.svg');
const template = fs.readFileSync(templatePath, 'utf8');
const parser = new DOMParser();

const get = (node: XmlDocument, className: string, tag: string) =>
    Array.from(node.getElementsByTagName(tag)).filter(
        element =>
            element.getAttribute && element.getAttribute('class') === className,
    );

const getElementsByClassName = (node: XmlDocument, className: string) => [
    ...get(node, className, 'rect'),
    ...get(node, className, 'circle'),
    ...get(node, className, 'path'),
    ...get(node, className, 'g'),
    ...get(node, className, 'polygon'),
    ...get(node, className, 'image'),
    ...get(node, className, 'tspan'),
    ...get(node, className, 'stop'),
];

const isElement = (node: XmlNode): node is XmlElement =>
    node.nodeType === node.ELEMENT_NODE;

const fill = (node: XmlElement, color: RgbColor) => {
    const { red, green, blue, alpha } = color;
    const rgba = `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;

    if (node.tagName === 'stop') {
        node.setAttribute('stop-color', rgba);
    } else {
        node.setAttribute('fill', rgba);
    }

    for (const child of Array.from(node.childNodes)) {
        if (isElement(child)) {
            fill(child, color);
        }
    }
};

const createThemePreview = async ({
    name,
    type,
    theme,
}: {
    name: string;
    type: 'attheme';
    theme: string;
}): Promise<Buffer | null> => {
    if (!['attheme'].includes(type)) {
        return null;
    }

    const attheme = new Attheme(theme);
    attheme.fallbackToSelf(fallbacks);

    const preview = parser.parseFromString(template, 'image/svg+xml');

    const inBubble = attheme.get('chat_inBubble');
    const outBubble = attheme.get('chat_outBubble');

    if (inBubble && outBubble && brightness(inBubble) > brightness(outBubble)) {
        attheme.set('chat_{in/out}Bubble__darkest', inBubble);
    } else if (outBubble) {
        attheme.set('chat_{in/out}Bubble__darkest', outBubble);
    }

    for (const [variable, color] of attheme) {
        const elements = getElementsByClassName(preview, variable);

        for (const element of elements) {
            fill(element, color);
        }
    }

    const elements = getElementsByClassName(preview, 'IMG');

    await Promise.all(
        elements.map(async element => {
            const chatWidth = Number(element.getAttribute('width'));
            const chatHeight = Number(element.getAttribute('height'));

            if (attheme.hasWallpaper()) {
                const imageBuffer = Buffer.from(
                    attheme.getWallpaper()!,
                    'binary',
                );

                // sharp's default "cover" fit scales the wallpaper to fill the chat area and crops the overflow around the center.
                const croppedImage = await sharp(imageBuffer)
                    .resize(chatWidth, chatHeight)
                    .png()
                    .toBuffer();

                element.setAttribute(
                    'xlink:href',
                    `data:image/png;base64,${croppedImage.toString('base64')}`,
                );
            }
        }),
    );

    for (const element of getElementsByClassName(preview, 'theme_name')) {
        element.textContent = name;
    }

    for (const element of getElementsByClassName(preview, 'theme_author')) {
        element.textContent = 'by @ThemerBot';
    }

    const templateBuffer = Buffer.from(serialize(preview), 'binary');

    return sharp(templateBuffer, { density: 150 }).png().toBuffer();
};

export default createThemePreview;
