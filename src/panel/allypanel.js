import config from '../data/config.js';
import '../data/typedefs.js';

import { ctx } from '../shader/gl.js';
import { drawSpriteSwap, spr } from '../sprite.js';
import { Panel } from './panel.js';
import { lerpTo } from '../util/math.js';
import Input from '../input.js';

// Open position: y = 80
// Closed position: y = 158
const openY = 80;
const closedY = 158;

const hoverMarginX = 2;
const hoverMarginY = 8;

const readyLerpFactor = 0.12;
const openLerpFactor = 0.18;
const closeLerpFactor = 0.2;

export default class AllyPanel extends Panel {
    constructor(x,fighter) {
        super(x,300+x);

        /** @type {Fighter} */
        this.fighter = fighter;
        
        this.ready = false;
        this.canOpen = true;
        this.opened = false;

        // For effects
        this.faceImage = 0;
        this.faceSpeed = 0;
        this.blinkTimer = getBlinkTime();
    }

    step() {
        super.step();

        this.effectStep();

        if (this.ready) {
            if (!this.opened) {
                // Not opened
                // Do close animation if we were just open
                if (this.y !== closedY) {
                    this.y = lerpTo(this.y,closedY,openLerpFactor,1);
                } else {
                    // See if we ought to open
                    if (this.canOpen) {
                        if (Input.mouseWithin(this.x+hoverMarginX,this.y+hoverMarginY,this.x+64-hoverMarginX,240)) {
                            this.opened = true;
                        }
                    }
                }
            } else {
                // Opened
                // Do open animation
                if (this.y !== openY) {
                    this.y = lerpTo(this.y,openY,closeLerpFactor,1);
                }
                // See if we ought to close
                if (!this.canOpen || !Input.mouseWithin(this.x+hoverMarginX,this.y+hoverMarginY,this.x+64-hoverMarginX,240)) {
                    this.opened = false;
                }
            }
        }

        this.draw();
    }

    effectStep() {
        // Lerp onscreen
        if (!this.ready) {
            this.y = lerpTo(this.y,closedY,readyLerpFactor,1);
            if (this.y === closedY) {
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