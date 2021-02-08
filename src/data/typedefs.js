/**
 * A Kanohi mask of power, to be worn by all fighters and used in battle.
 * @typedef KanohiMask
 * @property {string} name Name of the mask
 * @property {number} image Image of the mask in spr.kanohi
 */

/**
 * Three arrays of [0,1] RGB values that swap the default colors of drawn sprites via shader uniform.
 * @typedef Palette
 * @property {number[]} primary
 * @property {number[]} secondary
 * @property {number[]} eye
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
  * @property {number} hp
  * @property {number} maxhp
  * @property {number} nova
  * @property {number} maxnova
  * @property {number} agility
  * @property {number} strength
  * @property {number} toughness
  * @property {number} mind
  * @property {number} accuracy
  * @property {number} critical
  */