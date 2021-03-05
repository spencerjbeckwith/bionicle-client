import './typedefs.js';
import { spr } from '../sprite.js';
import { palettes } from '../shader/color.js';
import kanohi from './kanohi.js';

// Don't forget to add new enemies to data/typedefs.js!
/** @type {EnemyTemplateObject} */
const Enemies = {
    muaka: {
        name: 'Muaka',
        sprite: spr.muaka,
        possiblePalettes: [
            palettes.muaka,
        ],
        possibleMasks: [ //NOTICE: array of arrays of masks
            [ kanohi.hau ], 
            [ kanohi.huna ] 
        ],
        baseStats: { // Changes on level
            hp: 40,
            nova: 10,
            agility: 5,
            strength: 20,
            toughness: 15,
            mind: 4,
            accuracy: 90,
            critical: 10,
        },
        wave: {
            type: 4,
            dist: 3,
        },
    },

    nuiJaga: {
        name: 'Nui-Jaga',
        sprite: spr.nuiJaga,
        possiblePalettes: [
            palettes.nuiJaga1,
            palettes.nuiJaga2,
        ],
        possibleMasks: [
            [ kanohi.pakari ],
            [ kanohi.kakama ],
        ],
        baseStats: {
            hp: 20,
            nova: 10,
            agility: 8,
            strength: 12,
            toughness: 8,
            mind: 8,
            accuracy: 85,
            critical: 20,
        },
        wave: {
            type: 3,
            dist: 2,
        },
    }

    // More enemies
}

export default Enemies;