import config from '../data/config.js';
import '../data/typedefs.js';

import { ctx } from '../shader/gl.js';
import { drawSpriteSwap, spr } from '../sprite.js';
import { Panel } from './panel.js';
import { lerpTo } from '../util/math.js';

// Open position: y = 80
// Closed position: y = 158
export default class AllyPanel extends Panel {
    constructor(x,fighter) {
        super(x,300+x);

        /** @type {Fighter} */
        this.fighter = fighter;
        
        this.ready = false;
        this.opened = false;

        // For effects
        this.faceImage = 0;
        this.faceSpeed = 0;
        this.blinkTimer = getBlinkTime();
    }

    step() {
        super.step();

        this.effectStep();
        this.draw();
    }

    effectStep() {
        // Lerp onscreen
        if (!this.ready) {
            this.y = lerpTo(this.y,158,0.12,1);
            if (this.y === 158) {
                this.ready = true;
            }
        }

        // Blinking
        this.blinkTimer--;
        if (this.blinkTimer <= 0) {
            this.faceSpeed = 0.2;
            this.blinkTimer = getBlinkTime();
        }
        if (this.faceSpeed !== 0) {
            this.faceImage += this.faceSpeed;
            if (this.faceImage >= 4) {
                this.faceImage = 0;
                this.faceSpeed = 0;
            }
        }
    }

    draw() {
        // Draw panel
        drawSpriteSwap(spr.allyPanel,0,this.x,this.y,this.fighter.palette);

        // Draw name
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = config.font;
        ctx.fillStyle = 'white';
        ctx.fillText(this.fighter.name,this.x+32,this.y+61,50);

        // Draw head
        drawSpriteSwap(spr.head,this.ready? this.faceImage : 2,this.x+12,this.y+12,this.fighter.palette);
        // Draw mask
        if (this.fighter.currentMask) {
            drawSpriteSwap(spr.kanohi,this.fighter.currentMask.image,this.x+12,this.y+12,this.fighter.palette);
        }
    }
}

function getBlinkTime() {
    return 15+Math.round(500*Math.random());
}