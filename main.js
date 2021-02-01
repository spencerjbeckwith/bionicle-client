import config from './config.js';
import Passthrough from './shader/passthrough.js';
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

        // More attributes go here
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

// Main loop
function main() {

    requestAnimationFrame(main);
}

// Launch
(async () => {

    // Loading here

    main();
})();

// Run

gl.viewport(0,0,canvas.width,canvas.height);

gl.clearColor(0.1,0,0.5,1);
gl.clear(gl.COLOR_BUFFER_BIT);

console.log(Passthrough);
const PassthroughShader = new Shader(Passthrough.vertex,Passthrough.fragment);
PassthroughShader.use();

// // //

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
const positions = [
    0, 0, 0, 0.5, 0.7, 0.1,
    -0.2, -0.2, 0, -0.8, 0.1, 0.3
];
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW);

gl.enableVertexAttribArray(currentShader.positionAttribute);
gl.vertexAttribPointer(currentShader.positionAttribute,2,gl.FLOAT,false,0,0);

gl.drawArrays(gl.TRIANGLES,0,6);