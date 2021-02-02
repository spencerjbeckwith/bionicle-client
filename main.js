import config from './config.js';
import ImageSource from './shader/image.js';
import Matrix from './util/matrix.js';

// Set up our document
const canvas = document.createElement('canvas');
const canvas2 = document.createElement('canvas');
document.body.appendChild(canvas);
document.body.appendChild(canvas2);
canvas.width = config.width;
canvas.height = config.height;
canvas2.width = config.width;
canvas2.height = config.height;

// Get GL Context
const gl = canvas.getContext('webgl',{
    antialias: false
});
if (gl === null) {
    throw new Error('Could not initialize WebGL!');
}

// Get 2D context
const ctx = canvas2.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Resize canvas with the window
let scale = 1;
function resizeCanvas() {
    if (window.innerWidth < window.innerHeight) {
        scale = window.innerWidth/config.width;
    } else {
        scale = window.innerHeight/config.height;
    }

    // Option here: fill screen (stretch pixels) or keep to scale (fill or overflow)
    scale = Math.max(Math.floor(scale),1);
    canvas.width = config.width*scale;
    canvas.height = config.height*scale;
    canvas2.width = canvas.width;
    canvas2.height = canvas.height;

    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(1,0,0,1,0,0); // Reset scale
    ctx.scale(scale,scale);
}
resizeCanvas();
window.addEventListener('resize',resizeCanvas);
window.addEventListener('orientationchange',resizeCanvas);

// Shader class
/** @type {Shader} */
let currentShader = null;
class Shader {
    constructor(vertexSource,fragmentSource) {
        this.program = this.createShaderProgram(vertexSource,fragmentSource);
    }

    use() {
        if (currentShader !== this) {
            currentShader = this;
            gl.useProgram(this.program);
        }
    }

    createShaderProgram(vertexSource,fragmentSource) {
        const vertexShader = this.createShader(gl.VERTEX_SHADER,vertexSource);
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER,fragmentSource);
        const program = gl.createProgram();
        gl.attachShader(program,vertexShader);
        gl.attachShader(program,fragmentShader);
        gl.linkProgram(program);

        if (gl.getProgramParameter(program,gl.LINK_STATUS)) {
            // Success
            return program;
        } else {
            // Failure
            const error = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(`Could not link shader program: ${error}`);
        }
    }

    createShader(type,source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader,source);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader,gl.COMPILE_STATUS)) {
            // Success
            return shader;
        } else {
            // Failure
            const error = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(`Could not compile shader: ${error}`);
        }
    }
}

function makeImageShader() {
    const shader = new Shader(ImageSource.vertex,ImageSource.fragment);
    // Get attributes and uniforms
    shader.positionAttribute = gl.getAttribLocation(shader.program,'a_position');
    shader.textureAttribute = gl.getAttribLocation(shader.program,'a_texcoord');
    shader.positionMatrix = gl.getUniformLocation(shader.program,'u_positionMatrix');
    shader.textureMatrix = gl.getUniformLocation(shader.program,'u_texcoordMatrix');

    // Put the same buffer data into each attribute
    // This will not change, since each image is drawn the same way.
    const buffer = gl.createBuffer();
    const positionOrder = new Float32Array([
        0, 0,  0, 1,  1, 1,
        1, 1,  1, 0,  0, 0,
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,positionOrder,gl.STATIC_DRAW);

    gl.enableVertexAttribArray(shader.positionAttribute);
    gl.vertexAttribPointer(shader.positionAttribute,2,gl.FLOAT,false,0,0);

    gl.enableVertexAttribArray(shader.textureAttribute);
    gl.vertexAttribPointer(shader.textureAttribute,2,gl.FLOAT,false,0,0);

    return shader;
}

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

// Main loop
function main() {
    // Set rendering on framebuffer and with correct texture
    gl.bindFramebuffer(gl.FRAMEBUFFER,frameBuffer);
    gl.viewport(0,0,config.width,config.height);
    gl.clearColor(0.8,0,0.5,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    ctx.clearRect(0,0,config.width,config.height);
    ctx.save();
    gl.bindTexture(gl.TEXTURE_2D,texture);

    // // //
    
    //  Set position matrix
    let mat = Matrix.projection;
    mat = Matrix.translation(mat,0,0);
    mat = Matrix.scaling(mat,400,240);

    gl.uniformMatrix3fv(ImageShader.positionMatrix,false,mat);

    // Set texture matrix
    mat = Matrix.identity;
    //mat = Matrix.translation(mat,1/5,1/5);
    //mat = Matrix.scaling(mat,40/100,40/100);

    gl.uniformMatrix3fv(ImageShader.textureMatrix,false,mat);

    gl.drawArrays(gl.TRIANGLES,0,6);

    // // //

    drawGameTexture();
    ctx.restore();
    requestAnimationFrame(main);
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

function drawGameTexture() {
    // Switch to right framebuffer and texture
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D,gameTexture);
    
    // Use the right shader and set our precalculated matrices
    ImageShader.use();
    gl.uniformMatrix3fv(ImageShader.positionMatrix,false,gameTexturePositionMatrix);
    gl.uniformMatrix3fv(ImageShader.textureMatrix,false,gameTextureIdentityMatrix);
    gl.drawArrays(gl.TRIANGLES,0,6);
}

// Launch
let texture = null;
let ImageShader = null;
(async () => {

    // Loading here
    texture = await loadTexture('tex.png');

    ImageShader = makeImageShader();
    ImageShader.use();

    main();
})();