
import { loadTexture, beginRender, drawGameTexture, } from './shader/gl.js';

import { drawSprite, drawSpriteSwap, spr } from './sprite.js';

import { palettes } from './shader/color.js';

import { ctx } from './shader/gl.js';
import config from './config.js';

// Main loop
function main() {
    // Set rendering on framebuffer and with correct texture
    beginRender(texture);

    /*
    function drawMasks(bx,by,startMask,pal,head) {
        if (!head) {head = spr.head;}
        for (let x = 0; x < 6; x++) {
            drawSpriteSwap(head,0,bx+(32*x),by,pal);
            drawSpriteSwap(spr.kanohi,startMask+x,bx+(32*x),by,pal);
        }
    }

    drawMasks(0,0,0,palettes.tahu);
    drawMasks(200,0,6,palettes.vakama,spr.headSecondary);
    drawMasks(0,40,0,palettes.pohatu);
    drawMasks(200,40,6,palettes.onewa,spr.headSecondary);
    drawMasks(0,80,0,palettes.onua);
    drawMasks(200,80,6,palettes.whenua,spr.headSecondary);
    drawMasks(0,120,0,palettes.kopaka);
    drawMasks(200,120,6,palettes.nuju,spr.headSecondary);
    drawMasks(0,160,0,palettes.gali);
    drawMasks(200,160,6,palettes.nokama,spr.headSecondary);
    drawMasks(0,200,0,palettes.lewa);
    drawMasks(200,200,6,palettes.matau,spr.headSecondary);

    */
    drawSpriteSwap(spr.statusbar,0,0,0,palettes.tahu);
    drawSpriteSwap(spr.statusbar,0,0,64,palettes.pohatu);
    drawSpriteSwap(spr.statusbar,0,0,128,palettes.onua);
    drawSpriteSwap(spr.statusbar,0,226,0,palettes.kopaka);
    drawSpriteSwap(spr.statusbar,0,226,64,palettes.gali);
    drawSpriteSwap(spr.statusbar,0,226,128,palettes.lewa);

    ctx.fillStyle = 'white';
    ctx.font = config.font;
    ctx.fillText('Hello world!',16,16);
    ctx.font = '10px metru';
    ctx.fillText('Hello world!',16,80);
    ctx.font = '10px voya';
    ctx.fillText('Hello world!',16,144)

    drawGameTexture();
    requestAnimationFrame(main);
}

// Launch
let texture = null;
(async () => {

    // Loading resources here
    texture = await loadTexture('../asset/atlas.png');

    main();
})();