// More frequently-modified container objects should be closer to the top here.
/**
 * An object containing all Sprites, image resources to be drawn to the screen via drawSprite() or other methods. May contain multiple images that can be animated.
 * Be sure to add new sprites here (data/typedefs.js) if you want them to show up as tooltips.
 * @typedef {Object} SpriteObject
 * @property {Sprite} head
 * @property {Sprite} headSecondary
 * @property {Sprite} kanohi
 * @property {Sprite} allyPanel
 * @property {Sprite} statusBar
 * @property {Sprite} kini
 * @property {Sprite} muaka
 * @property {Sprite} nuiJaga
*/

/**
 * Object containing all EnemyTemplates.
 * Be sure to add new enemies here (data.typedefs.js) if you want them to show up as tooltips.
 * @typedef {Object} EnemyTemplateObject
 * @property {EnemyTemplate} muaka
 * @property {EnemyTemplate} nuiJaga
*/

/**
 * Object containing all palettes.
 * Be sure to add new palettes here (data/typedefs.js) if you want them to show up as tooltips.
 * @typedef {Object} PaletteObject
 * @property {Palette} tahu
 * @property {Palette} pohatu
 * @property {Palette} onua
 * @property {Palette} kopaka
 * @property {Palette} gali
 * @property {Palette} lewa
 * @property {Palette} vakama
 * @property {Palette} onewa
 * @property {Palette} whenua
 * @property {Palette} nuju
 * @property {Palette} nokama
 * @property {Palette} matau
 * @property {Palette} muaka
 * @property {Palette} nuiJaga1
 * @property {Palette} nuiJaga2
*/

/**
 * Object containing all Kanohi masks.
 * @typedef KanohiMaskObject
 * @property {KanohiMask} hau
 * @property {KanohiMask} kakama
 * @property {KanohiMask} pakari
 * @property {KanohiMask} akaku
 * @property {KanohiMask} kaukau
 * @property {KanohiMask} miru
 * @property {KanohiMask} huna
 * @property {KanohiMask} komau
 * @property {KanohiMask} ruru
 * @property {KanohiMask} matatu
 * @property {KanohiMask} rau
 * @property {KanohiMask} mahiki
*/

// Below this point are the actual types that fill these previous objects.

/**
 * A Kanohi mask of power, to be worn by all fighters and used in battle.
 * @typedef KanohiMask
 * @property {string} name Name of the mask
 * @property {number} image Image of the mask in spr.kanohi
*/

/**
 * Collection of images to animate... or not.
 * @typedef Sprite
 * @property {string} name
 * @property {number} width
 * @property {number} height
 * @property {SpriteImage[]} images
*/

/**
 * One image of a sprite
 * @typedef SpriteImage
 * @property {number} x X-location on the atlas
 * @property {number} y Y-location on the atlas
 * @property {number[]} textureMatrix Pre-calculated clipspace coordinates of this image for shaders
*/

/**
 * An ally or an enemy in battle.
 * @typedef Fighter
 * @property {string} name
 * @property {Palette} palette
 * @property {number} level
 * @property {number} xp
 * @property {KanohiMask[]} masks
 * @property {KanohiMask} currentMask
 *  <element array>
 *  <status array>
 * @property {Stats} stats
*/

/**
 * Collection of stats used to either create fighters or enemies or to control them in battle
 * @typedef Stats
 * @property {number} hp Current health
 * @property {number} maxhp Maximum health
 * @property {number} nova Current magic power (mana)
 * @property {number} maxnova Maximum magic power
 * @property {number} agility Determines speed and evasion
 * @property {number} strength Determines damage dealt physically
 * @property {number} toughness Determines damage resisted
 * @property {number} mind Determines damage damage dealt magically
 * @property {number} accuracy Percent chance to land hits
 * @property {number} critical Percent chance to land critical hits
*/

/**
 * A set of three colors, each in three different shades, that swap defautl colors of drawn sprites via shader uniform.
 * @typedef Palette
 * @property {string[]} primary
 * @property {string[]} secondary
 * @property {string[]} eye
*/

/**
 * Collection of stats/data that enemies are based on.
 * @typedef EnemyTemplate
 * @property {string} name
 * @property {Sprite} sprite
 * @property {Palette[]} possiblePalettes
 * @property {KanohiMask[]} possibleMasks Should be an array of mask arrays.
 * @property {Stats} baseStats
 * @property {WaveDef} wave
*/

/**
 * Definition of how an enemy image waves/pulses on screen
 * @typedef {WaveDef}
 * @property {number} type Which index of Waves.array to use (0-4) - higher = slower
 * @property {number} dist How many pixels
 */