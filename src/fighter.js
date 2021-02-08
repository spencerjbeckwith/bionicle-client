import './data/typedefs.js';
export default class Fighter {
    constructor(name,palette,masksArray) {
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

        this.hp = 10;
        this.maxhp = 10;
        this.nova = 10;
        this.maxnova = 10;

        this.agility = 10;      // Evasion / speed
        this.strength = 10;     // Damage dealt physically
        this.toughness = 10;    // Damage resisted
        this.mind = 10;         // Damage dealt w/ elements
        this.accuracy = 10;     // Likelyhood to land hits
        this.critical = 10;     // Likelyhood to land critical hits

    }

    // What methods?
}

// Later: figure out if this actually has to be a class
// And also figure out how the stats ought to be set per fighter
// Fighter generation functions? Pre-defined stat lists for toa or rahi? idk yet