import ImageSource from './source/image.js';
import PrimitiveSource from './source/primitive.js';
import SwapSource from './source/swap.js';

import { gl } from './document.js';
import Matrix from '../util/matrix.js';
import { replacePalette } from './color.js';

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
    const shader = makeImageShader(SwapSource);
    shader.use();
    // This is a bit nasty... but not as nasty as it was before

    // Set the initial nine palette replace uniform colors
    gl.uniform3fv(gl.getUniformLocation(shader.program,'u_replacedPrimary'),replacePalette.primary[0]);
    gl.uniform3fv(gl.getUniformLocation(shader.program,'u_replacedPrimaryLight'),replacePalette.primary[1]);
    gl.uniform3fv(gl.getUniformLocation(shader.program,'u_replacedPrimaryDark'),replacePalette.primary[2]);

    gl.uniform3fv(gl.getUniformLocation(shader.program,'u_replacedSecondary'),replacePalette.secondary[0]);
    gl.uniform3fv(gl.getUniformLocation(shader.program,'u_replacedSecondaryLight'),replacePalette.secondary[1]);
    gl.uniform3fv(gl.getUniformLocation(shader.program,'u_replacedSecondaryDark'),replacePalette.secondary[2]);

    gl.uniform3fv(gl.getUniformLocation(shader.program,'u_replacedEye'),replacePalette.eye[0]);
    gl.uniform3fv(gl.getUniformLocation(shader.program,'u_replacedEyeLight'),replacePalette.eye[1]);
    gl.uniform3fv(gl.getUniformLocation(shader.program,'u_replacedEyeDark'),replacePalette.eye[2]);

    // Store swap color uniforms
    shader.uniformPrimary = gl.getUniformLocation(shader.program,'u_primary');
    shader.uniformPrimaryLight = gl.getUniformLocation(shader.program,'u_primaryLight');
    shader.uniformPrimaryDark = gl.getUniformLocation(shader.program,'u_primaryDark');

    shader.uniformSecondary = gl.getUniformLocation(shader.program,'u_secondary');
    shader.uniformSecondaryLight = gl.getUniformLocation(shader.program,'u_secondaryLight');
    shader.uniformSecondaryDark = gl.getUniformLocation(shader.program,'u_secondaryDark');

    shader.uniformEye = gl.getUniformLocation(shader.program,'u_eye');
    shader.uniformEyeLight = gl.getUniformLocation(shader.program,'u_eyeLight');
    shader.uniformEyeDark = gl.getUniformLocation(shader.program,'u_eyeDark');

    // Create our palette setting function on the shader
    shader.setPalette = function(palette) {
        gl.uniform3fv(shader.uniformPrimary,palette.primary[0]);
        gl.uniform3fv(shader.uniformPrimaryLight,palette.primary[1]);
        gl.uniform3fv(shader.uniformPrimaryDark,palette.primary[2]);

        gl.uniform3fv(shader.uniformSecondary,palette.secondary[0]);
        gl.uniform3fv(shader.uniformSecondaryLight,palette.secondary[1]);
        gl.uniform3fv(shader.uniformSecondaryDark,palette.secondary[2]);
        
        gl.uniform3fv(shader.uniformEye,palette.eye[0]);
        gl.uniform3fv(shader.uniformEyeLight,palette.eye[1]);
        gl.uniform3fv(shader.uniformEyeDark,palette.eye[2]);
    }

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