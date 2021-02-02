import Matrix from './util/matrix.js';

import { currentShader, imageShader } from './shader/init.js';
import { gl, loadTexture, beginRender, drawGameTexture, drawLine, drawRectangle, drawCircle, drawPrimitive} from './shader/gl.js';

// Main loop
function main() {
    // Set rendering on framebuffer and with correct texture
    beginRender(texture);

    // // //
    
    // Texture example
    // Set position matrix
    let mat = Matrix.projection;
    mat = Matrix.translation(mat,0,0);
    mat = Matrix.scaling(mat,400,240);

    gl.uniformMatrix3fv(imageShader.positionMatrix,false,mat);

    // Set texture matrix
    mat = Matrix.identity;
    mat = Matrix.translation(mat,1/5,1/5);
    mat = Matrix.scaling(mat,40/100,40/100);

    gl.uniformMatrix3fv(imageShader.textureMatrix,false,mat);

    gl.drawArrays(gl.TRIANGLES,0,6);

    // Primitive shape examples

    drawLine(80,80,100,200,1,0,0,1);
    drawLine(100,200,300,40,0,1,0,1);
    drawLine(300,40,80,80,0,0,1,1);

    drawRectangle(20,20,80,80,0,0.3,1,1);
    
    drawCircle(160,160,30,30,1,0,0,1,false);

    drawPrimitive(gl.TRIANGLE_FAN,[300,60, 320,80, 360,10, 380,40, 300,100, 340,120],0,1,0,1);

    // // //

    drawGameTexture();
    requestAnimationFrame(main);
}

// Launch
let texture = null;
(async () => {

    // Loading resources here
    texture = await loadTexture('tex.png');

    main();
})();