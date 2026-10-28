declare module 'get-rgba-palette' {
    function getRgbaPalette(
        pixels: Uint8Array,
        count?: number,
        quality?: number,
    ): number[][];

    export = getRgbaPalette;
}
