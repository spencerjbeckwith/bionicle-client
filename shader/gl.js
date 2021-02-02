import config from '../config.js';
import { gl, ctx, canvas } from './document.js';
import { imageShader } from './init.js';

/**
 * Asynchronously loads a new texture and configures it.
 * @param {string} url 
 * @returns {WebGLTexture}
 */
async function loadTexture(url) {
    return new Promise(function(resolve,reject) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);

        const image = new Image();
        image.src = url;
        image.addEventListener('load',function() {
            gl.bindTexture(gl.TEXTURE_2D,texture);
            gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
            resolve(texture);
        });
        image.addEventListener('error',function(err) {
            reject(err);
        });
    });
}

// Set up drawing
gl.clearColor(0,0,0,1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.disable(gl.DEPTH_TEST);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

// Set up game texture
const gameTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D,gameTexture);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,config.width,config.height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
let gameTexturePositionMatrix = [2, 0, 0, 0, -2, 0, -1, 1, 1];
let gameTextureIdentityMatrix = [1, 0, 0, 0, -1, 0, 0, 1, 1];

// Set up our framebuffer
const frameBuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER,frameBuffer);
gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,gameTexture,0);

/**
 * Sets framebuffer and viewport for drawing to the game texture.
 * @param {WebGLTexture} atlasTexture Texture to use as atlas for all further draw calls
 */
function beginRender(atlasTexture) {
    gl.bindFramebuffer(gl.FRAMEBUFFER,frameBuffer);
    gl.viewport(0,0,config.width,config.height);
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    ctx.clearRect(0,0,config.width,config.height);
    ctx.save();
    gl.bindTexture(gl.TEXTURE_2D,atlasTexture);
    imageShader.use();
}

/**
 * Draws what's on the game texture to the screen.
 */
function drawGameTexture() {
    // Switch to right framebuffer and texture
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D,gameTexture);
    
    // Use the right shader and set our precalculated matrices
    imageShader.use();
    gl.uniformMatrix3fv(imageShader.positionMatrix,false,gameTexturePositionMatrix);
    gl.uniformMatrix3fv(imageShader.textureMatrix,false,gameTextureIdentityMatrix);
    gl.drawArrays(gl.TRIANGLES,0,6);
    ctx.restore();
}

export { 
    gl,
    ctx,
    loadTexture,
    beginRender,
    drawGameTexture
};