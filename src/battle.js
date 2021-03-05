import config from './data/config.js';
import * as Panels from './panel/panel.js';
import Fighter from './fighter.js';
import Enemy from './enemy.js';
import AllyPanel from './panel/allypanel.js';
import { palettes } from './shader/color.js';
import Kanohi from './data/kanohi.js';
import { drawSprite, drawSpriteSwap, spr } from './sprite.js';
import Enemies from './data/enemies.js';
import Waves from './util/waves.js';

const Battle = new function() {
    this.init = function() {
        // Init variables
        this.active = false;

        /** @type {Fighter[]} */
        this.allies = [];

        /** @type {Enemy[]} */
        this.enemies = [];
        this.panels = {
            statusbar: null,
            allyPanels: [],
            enemyPanels: [],
        }

    }.bind(this);

    this.begin = function(allyFighterArray,enemyFighterArray) {
        // Set variables to default state when entering a battle
        this.active = true;
        this.allies = allyFighterArray; // Up to 6 toa
        this.enemies = enemyFighterArray;
        this.panels.statusbar = new Panels.Statusbar(this.allies[0].palette);

        for (let i = 0; i < this.allies.length; i++) {
            this.panels.allyPanels[i] = new AllyPanel(3+(66*i),this.allies[i]);
        }

        // Place enemies on screen
        const screenMargin = 64;
        let placementDist = (config.width-screenMargin)/this.enemies.length;
        let placeX = (screenMargin/2)+(placementDist/2);
        for (let e = 0; e < this.enemies.length; e++) {
            this.enemies[e].x = placeX;
            placeX += placementDist;
        }
    }.bind(this);

    this.end = function() {
        // Set variables to inactive state
        this.active = false;
        this.init([],[]);

    }.bind(this);

    this.step = function() {
        drawSprite(spr.kini,0,0,0);

        // Draw enemies
        for (let i = 0; i < this.enemies.length; i++) {
            const temp = this.enemies[i].template;
            drawSpriteSwap(temp.sprite,0,
                this.enemies[i].x-(temp.sprite.width/2),
                110-(temp.sprite.height/2)+(Waves.array[temp.wave.type]*temp.wave.dist),
                this.enemies[i].palette);
        }

        if (this.active) {
            // Step for each panel
            this.panels.statusbar.step();
            for (const index in this.panels.allyPanels) {
                this.panels.allyPanels[index].step();
            }
        }
    }.bind(this);
}
Battle.init();

// Later: extract me to my own file? Provide a level as an argument? psh i dunno
/**
 * @returns {Stats}
 */
function generateStats() {
    return {
        hp: 10,
        maxhp: 10,
        nova: 10,
        maxnova: 10,
        agility: 10,
        strength: 10,
        toughness: 10,
        mind: 10,
        accuracy: 10,
        critical: 10
    }
}

// For testing
Battle.begin([
    new Fighter('Tahu',palettes.tahu,[ Kanohi.hau ],generateStats()),
    new Fighter('Gali',palettes.gali,[ Kanohi.kaukau ],generateStats()),
    new Fighter('Lewa',palettes.lewa,[ Kanohi.miru ],generateStats()),
    new Fighter('Pohatu',palettes.pohatu,[ Kanohi.kakama ],generateStats()),
    new Fighter('Onua',palettes.onua,[ Kanohi.pakari ],generateStats()),
    new Fighter('Kopaka',palettes.kopaka,[ Kanohi.akaku ],generateStats()),
],[
    new Enemy(Enemies.nuiJaga),
    new Enemy(Enemies.muaka),
    new Enemy(Enemies.nuiJaga),
    new Enemy(Enemies.nuiJaga),
    new Enemy(Enemies.nuiJaga),
    new Enemy(Enemies.nuiJaga),
]);

export default Battle;