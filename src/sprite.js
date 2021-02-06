import Matrix from './util/matrix.js';
import ATLAST from './atlas.js';
import config from './config.js';

import { imageShader, swapShader } from './shader/init.js';
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

function limitImage(spr,image) {
    image = Math.floor(image);
    if (!spr.images[image]) {
        image -= spr.images.length;
    }
    return image;
}

/**
 * @callback transformFnCallback
 * @param {number[]} matrix
 * @returns {number[]}
 * The transform callback is your chance to modify a sprite's position matrix before it is drawn.
 * It is provided the matrix as an argument, and it must return a matrix (with your transformations applied)
 * You will use the Matrix methods to transform it via translation, scaling, or rotation.
 * Note that translation occurs in intervals of the sprite's width, NOT pixels.
 * For example: 0.5 is half the sprite's distance.
 * 
 * Example: 
 * drawSpriteSwap(spr.kanohi,1,x,y,5,1,1,1,1,function(mat) {
        mat = Matrix.translation(mat,0.5,0.5);      // put origin in center
        mat = Matrix.scaling(mat,0.5,0.5);          // scale
        mat = Matrix.rotation(mat,Math.PI/2);       // rotate
        mat = Matrix.translation(mat,-0.5,-0.5);    // put origin back in corner - meaning we did a rotation/scaling around the center of the sprite.
        return mat;
    });
 */

/**
 * Draws a sprite to the WebGL canvas.
 * @param {Sprite} sprite Sprite resource to draw
 * @param {number} image Image index of the sprite to draw
 * @param {number} x Absolute x on canvas
 * @param {number} y Absolute y on canvas
 * @param {number} [a] Alpha channel
 * @param {number} [r] Red channel blend
 * @param {number} [g] Green channel blend
 * @param {number} [b] Blue channel blend
 * @param {transformFnCallback} [transformFn] Callback to apply transformations to the position matrix
 */
function drawSprite(sprite,image,x,y,a = 1,r = 1,g = 1,b = 1,transformFn = null) {
    imageShader.use();
    image = limitImage(sprite,image);

    // Set position matrix
    let mat = Matrix.projection;
    mat = Matrix.translation(mat,x,y);
    mat = Matrix.scaling(mat,sprite.width,sprite.height);

    // Optional transformation
    if (transformFn) {
        mat = transformFn(mat);
    }

    gl.uniformMatrix3fv(imageShader.positionMatrix,false,mat);

    // Set texture matrix
    gl.uniformMatrix3fv(imageShader.textureMatrix,false,sprite.images[image].textureMatrix);

    // Set blend
    gl.uniform4f(imageShader.blendUniform,r,g,b,a);

    gl.drawArrays(gl.TRIANGLES,0,6);
}

/**
 * Draws a sprite to the WebGL canvas, recolored by a given palette index.
 * @param {Sprite} sprite Sprite resource to draw
 * @param {number} image Image index of the sprite to draw
 * @param {number} x Absolute x on canvas
 * @param {number} y Absolute y on canvas
 * @param {Palette} palette Palette to recolor the sprite to
 * @param {number} a Alpha channel
 * @param {number} [r] Red channel blend
 * @param {number} [g] Green channel blend
 * @param {number} [b] Blue channel blend
 * @param {transformFnCallback} [transformFn] Callback to apply transformations to the position matrix
 */
function drawSpriteSwap(sprite,image,x,y,palette,a = 1,r = 1,g = 1,b = 1,transformFn = null) {
    swapShader.use();
    image = limitImage(sprite,image);

    // Set position matrix
    let mat = Matrix.projection;
    mat = Matrix.translation(mat,x,y);
    mat = Matrix.scaling(mat,sprite.width,sprite.height);
    
    // Optional transformation
    if (transformFn) {
        mat = transformFn(mat);
    }

    gl.uniformMatrix3fv(swapShader.positionMatrix,false,mat);

    // Set texture matrix
    gl.uniformMatrix3fv(swapShader.textureMatrix,false,sprite.images[image].textureMatrix);

    // Set blend
    gl.uniform4f(swapShader.blendUniform,r,g,b,a);

    // Set palette index
    swapShader.setPalette(palette);

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
    drawSpriteSwap,
    spr,
}