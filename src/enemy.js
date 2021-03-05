import Fighter from './fighter.js';
import { choose } from './util/math.js';

export default class Enemy extends Fighter {
    /**
     * Makes a new enemy for battle based off a template.
     * @param {EnemyTemplate} template 
     */
    constructor(template) {
        super(template.name,choose(template.possiblePalettes),choose(template.possibleMasks),template.baseStats);

        /** @type {EnemyTemplate} */
        this.template = template;
        
        this.x = 0;
    }
}