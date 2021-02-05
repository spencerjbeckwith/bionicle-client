import config from '../config.js';
import { gl, ctx, canvas } from './document.js';
import { imageShader, primitiveShader } from './init.js';

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
const gameTexturePositionMatrix = [2, 0, 0, 0, -2, 0, -1, 1, 1];
const gameTextureIdentityMatrix = [1, 0, 0, 0, -1, 0, 0, 1, 1];
let gameTextureBlend = [1,1,1,1];

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
    gl.uniform4f(imageShader.blendUniform,1,1,1,1);
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

    // Update our bound buffer to the correct type
    gl.bindBuffer(gl.ARRAY_BUFFER,imageShader.buffer);
    gl.enableVertexAttribArray(imageShader.positionAttribute);
    gl.vertexAttribPointer(imageShader.positionAttribute,2,gl.FLOAT,false,0,0);

    // Update uniforms and draw the arrays
    gl.uniformMatrix3fv(imageShader.positionMatrix,false,gameTexturePositionMatrix);
    gl.uniformMatrix3fv(imageShader.textureMatrix,false,gameTextureIdentityMatrix);
    gl.uniform4fv(imageShader.blendUniform,gameTextureBlend);
    gl.drawArrays(gl.TRIANGLES,0,6);
    ctx.restore();
}

/**
 * Draws a line from one point to another in one color.
 * @param {number} x 
 * @param {number} y 
 * @param {number} x2 
 * @param {number} y2 
 * @param {number} r Red component of the line's color
 * @param {number} g Green component of the line's color
 * @param {number} b Blue component of the line's color
 * @param {numa} a Alpha channel of the line's color
 */
function drawLine(x,y,x2,y2,r,g,b,a) {
    const positions = [x,y, x2,y2];

    // Use right shader, update our bound buffer to the right type
    primitiveShader.use();
    gl.bindBuffer(gl.ARRAY_BUFFER,primitiveShader.buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW);
    gl.vertexAttribPointer(primitiveShader.positionAttribute,2,gl.FLOAT,false,0,0);

    // Set the color and draw
    gl.uniform4f(primitiveShader.colorUniform,r,g,b,a);
    gl.drawArrays(gl.LINES,0,2);
}

function drawRectangle(x,y,x2,y2,r,g,b,a) {
    const positions = [x, y2, x, y, x2, y, 
                       x2, y, x2, y2, x, y2 ];

    // Use right shader, update bound buffer to the right type
    primitiveShader.use();
    gl.bindBuffer(gl.ARRAY_BUFFER,primitiveShader.buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW);
    gl.vertexAttribPointer(primitiveShader.positionAttribute,2,gl.FLOAT,false,0,0);

    // Set the color and draw
    gl.uniform4f(primitiveShader.colorUniform,r,g,b,a);
    gl.drawArrays(gl.TRIANGLES,0,6);
}

function drawCircle(x,y,radius,segments,r,g,b,a) {
    const positions = [ x, y ];

    // Push each successive segment onto position attribute
    let theta = 0;
    for (let i = 0; i <= segments; i++) {
        positions.push(x+(radius*Math.cos(theta)));
        positions.push(y+(radius*Math.sin(theta)));
        theta += Math.PI*2/segments;
    }

    // Use right shader, update bound buffer to the right type
    primitiveShader.use();
    gl.bindBuffer(gl.ARRAY_BUFFER,primitiveShader.buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW);
    gl.vertexAttribPointer(primitiveShader.positionAttribute,2,gl.FLOAT,false,0,0);

    // Set the color and draw
    gl.uniform4f(primitiveShader.colorUniform,r,g,b,a);
    gl.drawArrays(gl.TRIANGLE_FAN,0,segments+2);
}

function drawPrimitive(mode,positions,r,g,b,a) {
    // Use right shader, update bound buffer to the right type
    primitiveShader.use();
    gl.bindBuffer(gl.ARRAY_BUFFER,primitiveShader.buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW);
    gl.vertexAttribPointer(primitiveShader.positionAttribute,2,gl.FLOAT,false,0,0);

    // Set the color and draw
    gl.uniform4f(primitiveShader.colorUniform,r,g,b,a);
    gl.drawArrays(mode,0,positions.length/2);
}

export { 
    gl,
    ctx,
    loadTexture,
    beginRender,
    drawGameTexture,
    gameTextureBlend,
    drawLine,
    drawRectangle,
    drawCircle,
    drawPrimitive,
};