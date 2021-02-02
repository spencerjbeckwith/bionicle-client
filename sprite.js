import Matrix from './util/matrix.js';
import ATLAST from './atlas.js';
import config from './config.js';

import { imageShader } from './shader/init.js';
import { gl } from './shader/gl.js';

class Sprite {
    constructor(name,width,height,images) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.images = images;

        for (let i = 0; i < this.images.length; i++) {
            // Generate texture matrices for each image
            let mat = Matrix.identity;
            mat = Matrix.translation(mat, images[i].x/config.atlasWidth, images[i].y/config.atlasHeight);
            mat = Matrix.scaling(mat, this.width/config.atlasWidth, this.height/config.atlasHeight);
            this.images[i].textureMatrix = mat;
        }
    }
}

function drawSprite(sprite,image,x,y,a = 1,r = 1,g = 1,b = 1) {
    imageShader.use();

    // Set position matrix
    let mat = Matrix.projection;
    mat = Matrix.translation(mat,x,y);
    mat = Matrix.scaling(mat,sprite.width,sprite.height);
    gl.uniformMatrix3fv(imageShader.positionMatrix,false,mat);

    // Set texture matrix
    gl.uniformMatrix3fv(imageShader.textureMatrix,false,sprite.images[image].textureMatrix);

    // Set blend
    gl.uniform4f(imageShader.blendUniform,r,g,b,a);

    gl.drawArrays(gl.TRIANGLES,0,6);
}

// More sprite drawing goes here - functions with transformations build in
// Or even better: make a "startDraw" and an "endDraw" that allows you to apply whatever transformations you want.

// Load all sprites from our atlas map
const spr = {};
for (let index in ATLAST) {
    const sprite = ATLAST[index];
    spr[sprite.name] = new Sprite(sprite.name,sprite.width,sprite.height,sprite.images);
}

export {
    Sprite,
    drawSprite,
    spr,
}