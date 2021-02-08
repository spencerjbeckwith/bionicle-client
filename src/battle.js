import * as Panels from './panel/panel.js';
import Fighter from './fighter.js';
import AllyPanel from './panel/allypanel.js';
import { palettes } from './shader/color.js';
import Kanohi from './data/kanohi.js';

const Battle = new function() {
    this.init = function() {
        // Init variables
        this.active = false;
        this.allies = [];
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
        this.panels.statusbar = new Panels.Statusbar(80,0);

        for (let i = 0; i < this.allies.length; i++) {
            this.panels.allyPanels[i] = new AllyPanel(64*i,this.allies[i]);
        }
    }.bind(this);

    this.end = function() {
        // Set variables to inactive state
        this.active = false;
        this.init([],[]);

    }.bind(this);

    this.step = function() {
        if (this.active) {
            // Step for each panel
            for (const index in this.panels.allyPanels) {
                this.panels.allyPanels[index].step();
            }
        }
    }.bind(this);
}
Battle.init();

// For testing
Battle.begin([
    new Fighter('Tahu',palettes.tahu,[ Kanohi.hau ]),
    new Fighter('Gali',palettes.gali,[ Kanohi.kaukau ]),
    new Fighter('Lewa',palettes.lewa,[ Kanohi.miru ]),
    new Fighter('Pohatu',palettes.pohatu,[ Kanohi.kakama ]),
    new Fighter('Onua',palettes.onua,[ Kanohi.pakari ]),
    new Fighter('Kopaka',palettes.kopaka,[ Kanohi.akaku ]),
]);

export default Battle;