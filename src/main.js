
import { loadTexture, beginRender, drawGameTexture, } from './shader/gl.js';

import { drawSpriteSwap, spr } from './sprite.js';

// Main loop
function main() {
    // Set rendering on framebuffer and with correct texture
    beginRender(texture);

    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            drawSpriteSwap(spr.head,0,20+(40*x),(40*y),y+1);
            drawSpriteSwap(spr.kanohi,x,20+(40*x),(40*y),y+1);
        }
    }

    // To do next:
    // - migrate to a better project environment
    // - draw some sweet HUD elements built of lego technic parts
    //  - while you're at it, make your own atlas generation script.

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