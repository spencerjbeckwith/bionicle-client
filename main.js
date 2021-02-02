
import { gl, loadTexture, beginRender, drawGameTexture, drawLine, drawRectangle, drawCircle, drawPrimitive} from './shader/gl.js';
import config from './config.js';

import { drawSprite, spr } from './sprite.js';

// Main loop
function main() {
    // Set rendering on framebuffer and with correct texture
    beginRender(texture);

    // Primitive shape examples

    drawLine(80,80,100,200,1,0,0,1);
    drawLine(100,200,300,40,0,1,0,1);
    drawLine(300,40,80,80,0,0,1,1);

    drawRectangle(20,20,80,80,0,0.3,1,1);
    
    drawCircle(160,160,30,30,1,0,0,1,false);

    drawPrimitive(gl.TRIANGLE_FAN,[300,60, 320,80, 360,10, 380,40, 300,100, 340,120],0,1,0,1);

    // Sprite examples
    
    drawSprite(spr.head,0,20,100);
    drawSprite(spr.head,0,20,140);
    drawSprite(spr.head,0,20,180);

    drawSprite(spr.kanohi,0,20,100,1,196/255,40/255,27/255);
    drawSprite(spr.kanohi,1,20,140,1,98/255,71/255,50/255);
    drawSprite(spr.kanohi,2,20,180,1,1,1,1);

    // To do next:
    // - make sprite transform fns
    // - palette swapping
    //      Now here's the question. You can accomplish palette swaps by blending white sprites to the colors you need,
    //      which works perfectly for sprites of that size. But it would give more control to have specific palette textures,
    //      then you can blend specific colors and leave others unaffected.
    //      See if you can make a palette swap shader, and if not, you can use blending on sprites.
    // - draw more masks
    // - migrate to a better project environment
    //  - while you're at it, make your own atlas generation script.

    // // //

    drawGameTexture();
    requestAnimationFrame(main);
}

// Launch
let texture = null;
(async () => {

    // Loading resources here
    texture = await loadTexture('atlas.png');

    main();
})();