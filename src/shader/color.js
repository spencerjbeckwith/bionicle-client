import '../data/typedefs.js';

// Lego colors (to swap palettes)
const colors = {
    red: 'c4281b',
    darkPink: 'c470a0',
    orange: 'da8540',
    brown: '675237',
    tan: 'd7c599',
    black: '1b2a34',
    green: '287f46',
    darkGray: '6d6e6c',
    white: 'd0d1d0',
    mediumBlue: '6e99c9',
    lightGray: 'a1a5a2',
    blue: '0d69ab',
    yellow: 'f5cd2f',
    lime: 'a4bd46',
    darkOrange: 'a05f34',
    purple: '6b327b',
    sandBlue: '74869c',
    darkTurquoise: '008f9b',
    metallicGold: 'dbac34',
    metallicSilver: 'a9a5b4',
    pearlLightGray: '9ca3a8',

    // Use color names as they appear on bricklink
    // This is a good reference: https://brickshelf.com/gallery/ebindex/MCW/is_colourchart.png
}

// Colors to feed into the swap shader - present on the atlas, these will be switched with palette colors
const replaceColors = {
    // Change these if for some reason, you have to modify our default atlas and its colors
    primary: 'b5b5b5',
    primaryLight: 'e6e6e6',
    primaryDark: '545454',
    secondary: '2700ad',
    secondaryLight: '734cfa',
    secondaryDark: '12004b',
    eye: 'ae0000',
    eyeLight: 'fb4c4c',
    eyeDark: '4b0000'
}

/**
 * Returns an array of RGB values from a hex color, for use in a shader or as a blend.
 * @param {string} hexString Six-character HTML color
 * @param {number} factor A decimal to show how far to scale this color, must be between -1 and 1 though values around 0.2 work best
 * @returns {number[]}
 */
function getRGBfromHex(hexString,factor) {
    let r = parseInt(hexString.slice(0,2),16) / 255;
    let g = parseInt(hexString.slice(2,4),16) / 255;
    let b = parseInt(hexString.slice(4,6),16) / 255;
    if (factor) {
        r = Math.max(0,Math.min(1,r+factor));
        g = Math.max(0,Math.min(1,g+factor)),
        b = Math.max(0,Math.min(1,b+factor));
    }
    return [r,g,b];
}

/**
 * Creates a new nine-color palette given three base colors (for the primary, secondary, and eye) and three optional change factors to scale for lighter and darker versions of the colors.
 * If change factors aren't provided, it defaults to 0.2.
 * @constructor
 * @param {string} primaryHex 
 * @param {string} secondaryHex 
 * @param {string} eyeHex 
 * @param {number} [primaryChangeFactor]
 * @param {number} [secondaryChangeFactor]
 * @param {number} [eyeChangeFactor]
 */
function Palette(primaryHex,secondaryHex,eyeHex,primaryChangeFactor = 0.2,secondaryChangeFactor = 0.2,eyeChangeFactor = 0.2) {
    // Each palette has three colors for three areas, nine colors total.
    // Each area has a light area, medium area, and dark area to look like shadows
    // These nine colors only replace the nine colors in our default swap.gpl palette

    // Each palette has three arrays, each of which holds three arrays, each of which holds RGB from 0 to 1
    this.primary = [
        getRGBfromHex(primaryHex,0),
        getRGBfromHex(primaryHex,primaryChangeFactor),
        getRGBfromHex(primaryHex,-primaryChangeFactor)
    ];
    this.secondary = [
        getRGBfromHex(secondaryHex,0),
        getRGBfromHex(secondaryHex,secondaryChangeFactor),
        getRGBfromHex(secondaryHex,-eyeChangeFactor)
    ];
    this.eye = [
        getRGBfromHex(eyeHex,0),
        getRGBfromHex(eyeHex,eyeChangeFactor),
        getRGBfromHex(eyeHex,-eyeChangeFactor)
    ];
}

/** @type {PaletteObject} */
const palettes = {
    tahu: new Palette(colors.red,colors.orange,colors.darkPink),
    pohatu: new Palette(colors.brown,colors.tan,colors.orange),
    onua: new Palette(colors.black,colors.darkGray,colors.green),
    kopaka: new Palette(colors.white,colors.lightGray,colors.mediumBlue),
    gali: new Palette(colors.blue,colors.mediumBlue,colors.yellow),
    lewa: new Palette(colors.green,colors.lime,colors.lime),
    vakama: new Palette(colors.orange,colors.red,colors.darkPink),
    onewa: new Palette(colors.tan,colors.brown,colors.orange),
    whenua: new Palette(colors.darkGray,colors.black,colors.green),
    nuju: new Palette(colors.lightGray,colors.white,colors.mediumBlue),
    nokama: new Palette(colors.mediumBlue,colors.blue,colors.yellow),
    matau: new Palette(colors.lime,colors.green,colors.lime),

    muaka: new Palette(colors.red,colors.metallicSilver,colors.yellow),
    nuiJaga1: new Palette(colors.mediumBlue,colors.red,colors.darkGray),
    nuiJaga2: new Palette(colors.purple,colors.yellow,colors.darkGray),
    // More palettes here! Don't forget to also add them in data/typedefs.js!

    // You can also use the Palette constructor to make them on the fly for randomly-generated matoran/rahi
}

// You can define more palettes that are based on others, like this

// Remember, for palettes that should only affect the mask, only use that palette on the mask.
// Each sprite has a different palette so it shouldn't also make your body gold.
palettes.tahu.gold = new Palette(colors.metallicGold,colors.orange,colors.darkPink,0.4);
palettes.tahu.silver = new Palette(colors.metallicSilver,colors.orange,colors.darkPink,0.4);
palettes.pohatu.gold = new Palette(colors.metallicGold,colors.tan,colors.orange,0.4);
palettes.pohatu.silver = new Palette(colors.metallicSilver,colors.tan,colors.orange,0.4);
palettes.onua.gold = new Palette(colors.metallicGold,colors.darkGray,colors.green,0.4);
palettes.onua.silver = new Palette(colors.metallicSilver,colors.darkGray,colors.green,0.4);
palettes.kopaka.gold = new Palette(colors.metallicGold,colors.lightGray,colors.mediumBlue,0.4);
palettes.kopaka.silver = new Palette(colors.metallicSilver,colors.lightGray,colors.mediumBlue,0.4);
palettes.gali.gold = new Palette(colors.metallicGold,colors.mediumBlue,colors.yellow,0.4);
palettes.gali.silver = new Palette(colors.metallicSilver,colors.mediumBlue,colors.yellow,0.4);
palettes.lewa.gold = new Palette(colors.metallicGold,colors.lime,colors.lime,0.4);
palettes.lewa.silver = new Palette(colors.metallicSilver,colors.lime,colors.lime,0.4);

// More extended palettes here

const replacePalette = {
    // Can't use palette constructor because it doesn't let us set all nine colors manually
    primary: [
        getRGBfromHex(replaceColors.primary,0),
        getRGBfromHex(replaceColors.primaryLight,0),
        getRGBfromHex(replaceColors.primaryDark,0)
    ],
    secondary: [
        getRGBfromHex(replaceColors.secondary,0),
        getRGBfromHex(replaceColors.secondaryLight,0),
        getRGBfromHex(replaceColors.secondaryDark,0)
    ],
    eye: [
        getRGBfromHex(replaceColors.eye,0),
        getRGBfromHex(replaceColors.eyeLight,0),
        getRGBfromHex(replaceColors.eyeDark,0)
    ]
};

export {
    colors,
    palettes,
    replacePalette,
    Palette,
}