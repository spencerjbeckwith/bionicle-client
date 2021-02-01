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

        this.positionAttribute = gl.getAttribLocation(this.program,'a_position');
        this.textureAttribute = gl.getAttribLocation(this.program,'a_texcoord');

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.positionBuffer);
        const positions = [
            0, 0,  0, 1,  1, 1,
            1, 1,  1, 0,  0, 0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW);
    
        gl.enableVertexAttribArray(this.positionAttribute);
        gl.vertexAttribPointer(this.positionAttribute,2,gl.FLOAT,false,0,0);
    
        // // //
    
        this.textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.textureBuffer);
        const texcoords = [
            0, 0,  0, 1,  1, 1,
            1, 1,  1, 0,  0, 0, 
        ];
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(texcoords),gl.STATIC_DRAW);
    
        gl.enableVertexAttribArray(this.textureAttribute);
        gl.vertexAttribPointer(this.textureAttribute,2,gl.FLOAT,false,0,0);

        this.positionMatrix = gl.getUniformLocation(this.program,'u_positionMatrix');
        this.textureMatrix = gl.getUniformLocation(this.program,'u_texcoordMatrix');
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

    // Run

    gl.viewport(0,0,canvas.width,canvas.height);

    gl.clearColor(0.8,0,0.5,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //  Set position matrix
    let mat = Matrix.projection;
    mat = Matrix.translation(mat,100,100);
    mat = Matrix.scaling(mat,100,100);

    gl.uniformMatrix3fv(ImageShader.positionMatrix,false,mat);

    // Set texture matrix
    mat = Matrix.identity;
    mat = Matrix.translation(mat,1/5,1/5);
    mat = Matrix.scaling(mat,40/100,40/100);

    gl.uniformMatrix3fv(ImageShader.textureMatrix,false,mat);

    gl.drawArrays(gl.TRIANGLES,0,6);

    requestAnimationFrame(main);
}

function drawTexturePart() {
    // Steps to drawing...

    /*
    So if I want to make my own drawingbuffer...
    When you call a draw command... you know, i dont know if it'll be practical to mesh multiple sprite calls into one.
    Because hwne you call the shader, yo ucan only set the matrices once. Unless you're drawing the same sprite multiple times...

    The other thing I could do, is not use matrices, and just multiply the data and put it straight into the gl buffers for position and texcoords
    
    */
    // call draw arrays
}

// Launch
let texture = null;
let ImageShader = null;
(async () => {

    // Loading here
    texture = await loadTexture('tex.png');

    ImageShader = new Shader(ImageSource.vertex,ImageSource.fragment);
    ImageShader.use();

    main();
})();