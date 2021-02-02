import Matrix from './util/matrix.js';

import { currentShader, imageShader } from './shader/init.js';
import { gl, loadTexture, beginRender, drawGameTexture} from './shader/gl.js';

// Main loop
function main() {
    // Set rendering on framebuffer and with correct texture
    beginRender(texture);

    // // //
    
    //  Set position matrix
    let mat = Matrix.projection;
    mat = Matrix.translation(mat,0,0);
    mat = Matrix.scaling(mat,200,240);

    gl.uniformMatrix3fv(imageShader.positionMatrix,false,mat);

    // Set texture matrix
    mat = Matrix.identity;
    //mat = Matrix.translation(mat,1/5,1/5);
    //mat = Matrix.scaling(mat,40/100,40/100);

    gl.uniformMatrix3fv(imageShader.textureMatrix,false,mat);

    gl.drawArrays(gl.TRIANGLES,0,6);

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