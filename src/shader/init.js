import ImageSource from './source/image.js';
import PrimitiveSource from './source/primitive.js';
import SwapSource from './source/swap.js';

import { gl } from './document.js';
import Matrix from '../util/matrix.js';

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

function makeImageShader(src) {
    const shader = new Shader(src.vertex,src.fragment);
    // Get attributes and uniforms
    shader.positionAttribute = gl.getAttribLocation(shader.program,'a_position');
    shader.textureAttribute = gl.getAttribLocation(shader.program,'a_texcoord');
    shader.positionMatrix = gl.getUniformLocation(shader.program,'u_positionMatrix');
    shader.textureMatrix = gl.getUniformLocation(shader.program,'u_texcoordMatrix');
    shader.blendUniform = gl.getUniformLocation(shader.program,'u_blend');

    // Put the same buffer data into each attribute
    // This will not change, since each image is drawn the same way.
    shader.buffer = gl.createBuffer();
    const positionOrder = new Float32Array([
        0, 0,  0, 1,  1, 1,
        1, 1,  1, 0,  0, 0,
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER,shader.buffer);
    gl.bufferData(gl.ARRAY_BUFFER,positionOrder,gl.STATIC_DRAW);

    gl.enableVertexAttribArray(shader.positionAttribute);
    gl.vertexAttribPointer(shader.positionAttribute,2,gl.FLOAT,false,0,0);

    gl.enableVertexAttribArray(shader.textureAttribute);
    gl.vertexAttribPointer(shader.textureAttribute,2,gl.FLOAT,false,0,0);

    shader.use = function() {
        // Override's class use function to reset properly
        if (currentShader !== this) {
            currentShader = this;
            gl.useProgram(this.program);

            // Reset proper attributes, in case we were last using the primitive shader
            gl.bindBuffer(gl.ARRAY_BUFFER,shader.buffer);
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positionOrder),gl.STATIC_DRAW);
            gl.vertexAttribPointer(primitiveShader.positionAttribute,2,gl.FLOAT,false,0,0);
        }
    }

    return shader;
}

function makePrimitiveShader() {
    const shader = new Shader(PrimitiveSource.vertex,PrimitiveSource.fragment);
    shader.positionAttribute = gl.getAttribLocation(shader.program,'a_position');
    shader.positionMatrix = gl.getUniformLocation(shader.program,'u_positionMatrix');
    shader.colorUniform = gl.getUniformLocation(shader.program,'u_color');

    shader.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,shader.buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0, 0.5,0.5]),gl.DYNAMIC_DRAW);

    gl.enableVertexAttribArray(shader.positionAttribute);
    gl.vertexAttribPointer(shader.positionAttribute,2,gl.FLOAT,false,0,0);

    // Set the position uniform once here. All the position does it change to clipspace
    shader.use();
    gl.uniformMatrix3fv(shader.positionMatrix,false,Matrix.projection);

    return shader;
}

function makeSwapShader() {
    // Reconfigure these options if you want to change palettes at any point
    const paletteCount = 7;
    const colorCount = 9;
    /* Current palettes:
      0 - default colors
      1 - Tahu
      2 - Pohatu
      3 - Onua
      4 - Kopaka
      5 - Gali
      6 - Lewa

      ... Maybe one more Matoran palette?
      This way, every Toa/Matoran/Rahi can have any of four palettes and any of 12 masks. Thats 48 possible Matoran per Koro

      In the long run, life would be MUCH better if you make the shader so you provide it the colors to swap.
      So you provide the shader three base colors - if set, the shader will change each color to those colors - primary, eyes, secondary
      Palette types can then be built on top of that
    
    Current colors per palette (IN THIS ORDER):
      0 - light primary
      1 - primary
      2 - dark primary
      3 - light eye
      4 - eye color
      5 - dark eye
      6 - light secondary
      7 - secondary
      8 - dark secondary
    */

    const paletteLength = paletteCount*colorCount;
    const colors = new Array(paletteLength);

    let i = 0;
    let factor = 0.2;
    function feed(hexString) {
        // Feeds in one color as an array from a hex string
        const r = parseInt(hexString.slice(0,2),16) / 255;
        const g = parseInt(hexString.slice(2,4),16) / 255;
        const b = parseInt(hexString.slice(4,6),16) / 255;
        colors[i] = [r,g,b];
        i++;
    }
    function feed3(hexString) {
        // Feeds three colors in based on one: first color is lighter, middle is the argument, third is darker
        let r = parseInt(hexString.slice(0,2),16) / 255;
        let g = parseInt(hexString.slice(2,4),16) / 255;
        let b = parseInt(hexString.slice(4,6),16) / 255;
        colors[i] = [Math.min(1,r+factor), Math.min(1,g+factor), Math.min(1,b+factor)];
        colors[i+1] = [r, g, b];
        colors[i+2] = [Math.max(0,r-factor), Math.max(0,g-factor), Math.max(0,b-factor)];
        i += 3;
    }
    let startTime = Date.now();

    // SET COLORS HERE
    // default palette: these MUST match colors in sprites you swap in the atlas!
    feed('ffffff');
    feed('ababab');
    feed('545454');
    feed('ddf097');
    feed('a4bd46');
    feed('61702a');
    feed('010101'); //placeholder
    feed('010102');
    feed('010103');
    
    // Tahu
    feed3('c4281b');
    feed3('c470a0');
    feed3('da8540');

    // Pohatu
    feed3('675237');
    feed3('da8540');
    feed3('d7c599');

    // Onua
    feed3('1b2a34');
    feed3('287f46');
    feed3('6d6e6c');

    // Kopaka
    feed3('d0d1d0');
    feed3('6e99c9');
    feed3('a1a5a2');

    // Gali
    feed3('0d69ab');
    feed3('f5cd2f');
    feed3('6e99c9');

    // Lewa
    feed3('287f46');
    feed3('c7d23c');
    feed3('a4bd46');

    let injection = '';
    for (let i = 1; i < paletteCount; i++) {
        // Inject a conditional for each possible palette
        // We have to do this because we can't use a uniform in array index in glsl, yikes.
        injection += `if (u_paletteIndex == ${i}) {
            newCol = palette[i+(${i}*${colorCount})];
        }\n`;
    }

    // babel wouldn't let me just throw vertex/fragment in as arguments
    // so instead let's overwrite fragment function with the proper fragment source
    const temp = SwapSource.fragment(paletteLength,colorCount,injection);
    SwapSource.fragment = temp;
    const shader = makeImageShader(SwapSource);
    shader.use();

    // Load the uniform
    for (let i = 0; i < paletteLength; i++) {
        // This has to happen for every color... dozens of times. Because there's no way to set a full glsl array
        // Each array index has to be set individually. yikes.
        // Grab the location for this index of our palette
        const location = gl.getUniformLocation(shader.program,`palette[${i}]`);

        // Load it with our four channels for each color
        gl.uniform3fv(location,colors[i]);
    }

    shader.paletteUniform = gl.getUniformLocation(shader.program,`u_paletteIndex`);

    // To do later: pre-compile the full color list when you're deploying
    // Also to-do later: figure out a better way to palette swap.
    //  Because this is tedious and far from optimal, but hey it works
    console.log(`Compiled, calculated and placed ${paletteLength} colors in shader uniform in ${Date.now()-startTime}ms`);

    return shader;
}

// More shader make functions here

const primitiveShader = makePrimitiveShader();
const swapShader = makeSwapShader();
const imageShader = makeImageShader(ImageSource);
export { 
    Shader, 
    currentShader, 
    imageShader,
    primitiveShader,
    swapShader,
}