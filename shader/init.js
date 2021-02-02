import ImageSource from './source/image.js';
import PrimitiveSource from './source/primitive.js';

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

function makeImageShader() {
    const shader = new Shader(ImageSource.vertex,ImageSource.fragment);
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

// More shader make functions here

const primitiveShader = makePrimitiveShader();
const imageShader = makeImageShader();
export { 
    Shader, 
    currentShader, 
    imageShader,
    primitiveShader,
};