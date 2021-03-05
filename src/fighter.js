import './data/typedefs.js';
export default class Fighter {
    /**
     * Makes a new fighter for battle.
     * @param {string} name 
     * @param {Palette} palette 
     * @param {KanohiMask[]} masksArray Array of masks this fighter can use. First mask is their default
     * @param {Stats} initialStats What stats to initialize the fighter with
     */
    constructor(name,palette,masksArray,initialStats) {
        // Initialze stats
        this.name = name;
        this.palette = palette;

        this.level = 1;
        this.xp = 0;

        /** @type {KanohiMask[]} */
        this.masks = masksArray;
        /** @type {KanohiMask} */
        this.currentMask = this.masks[0] || null;

        // do @type element
        this.elements = [];
        // do @type status
        this.status = [];

        /** @type {Stats} */
        this.stats = {
            hp: initialStats.hp,
            maxhp: initialStats.hp,
            nova: initialStats.nova,
            maxnova: initialStats.nova,

            agility: initialStats.agility,
            strength: initialStats.strength,
            toughness: initialStats.toughness,
            mind: initialStats.mind,
            accuracy: initialStats.accuracy,
            critcial: initialStats.critical
        }

    }

    // What methods?
}



// Later: figure out if this actually has to be a class
// And also figure out how the stats ought to be set per fighter
// Fighter generation functions? Pre-defined stat lists for toa or rahi? idk yet