#!/usr/bin/env node
// atlast by Spencer J. Beckwith. MIT license

const fs = require(`fs`);
const Jimp = require(`jimp`);

const config = {
    directory: 'asset/spr',
    atlasWidth: 2048,
    atlasHeight: 2048,
    sepW: 16,
    sepH: 16,
    verticalPlacement: false,
    outputImageName: 'asset/atlas.png',
    outputWhitespace: 2,
    outputName: 'src/data/atlas.js'
}

const sprites = [];
let totalImages = 0;
let loadedImages = 0;
let totalPixels = 0;

let time, loadTime, arrangeTime;

class Sprite {
    constructor(fileNameArray,spriteName) {
        this.spriteName = spriteName;
        this.width = 0;
        this.height = 0;

        this.images = [];
        for (let f = 0; f < fileNameArray.length; f++) {
            totalImages++;
            Jimp.read(fileNameArray[f])
                .then(this.pushImage.bind({
                    sprite: this,
                    iteration: f
                }))
                .catch(function(error) {
                    throw error;
                });
        }
        console.log(`Loading: ${this.spriteName} (${fileNameArray.length} images)`);
    }

    pushImage(image) { //bound to object {sprite, iteration} in constructor
        this.sprite.images[this.iteration] = image;
        this.sprite.width = Math.max(this.sprite.width,image.bitmap.width);
        this.sprite.height = Math.max(this.sprite.height,image.bitmap.height);

        totalPixels += this.sprite.width*this.sprite.height;
        loadedImages++;
        if (loadedImages >= totalImages) {
            loadTime = Date.now()-time;
            arrangeAtlas();
        }
    }

    getSize() {
        return this.width*this.height;
    }
}

function compile() {
    //Handle the configuration
    console.log(`Loading sprite images from directory: ${config.directory}...`);
    console.group();

    //Find all our file paths
    const directory = fs.opendirSync(config.directory);
    let dirent = directory.readSync();
    time = Date.now();

    while (dirent !== null) {
        if (dirent.isDirectory()) {
            //Open inner directory
            const innerDirectory = fs.opendirSync(`${config.directory}\\${dirent.name}`);
            let innerDirent = innerDirectory.readSync();
            let fnArray = [];

            while (innerDirent !== null) {
                if (innerDirent.isDirectory()) {
                    console.warn(`Too many nested directories! Folders nested inside this directory (${dirent.name}) will not be read.`);
                } else if (innerDirent.isFile()) {
                    if (innerDirent.name.endsWith(`.png`)) {
                        fnArray.push(`${config.directory}\\${dirent.name}\\${innerDirent.name}`);
                    }
                }
                innerDirent = innerDirectory.readSync();
            }

            if (fnArray.length > 0) {
                sprites.push(new Sprite(fnArray,dirent.name));
            } else {
                console.warn(`Directory (${dirent.name}) has no images!`);
            }

            innerDirectory.closeSync();
        } else if (dirent.isFile()) {
            if (dirent.name.endsWith(`.png`)) {
                let fnArray = [ `${config.directory}\\${dirent.name}` ];
                sprites.push(new Sprite(fnArray,dirent.name.replace(`.png`,``)));
            }
        }

        dirent = directory.readSync();
    }

    directory.closeSync();
    console.groupEnd();
}

function arrangeAtlas() { //Called by a sprite instance when all images are loaded by JIMP.
    console.log(`All sprite images loaded. Writing to the atlas...`);
    console.group();

    //Preliminary check to see if we have enough space
    const maxPixels = config.atlasWidth*config.atlasHeight;
    console.log(`Atlas size: ${config.atlasWidth}, ${config.atlasHeight}, totalling ${maxPixels} pixels.`);
    console.log(`Image expected to use ${totalPixels} pixels, which is ${Math.round((totalPixels/maxPixels)*100)}% of the atlas.`);
    if (totalPixels > maxPixels) {
        throw `Atlas size is too small! Increase the size with "atlast set atlasWidth/atlasHeight <value>"`;
    }

    //Sort the sprite array: largest to smallest
    sprites.sort((sprite1,sprite2) => {
        return (sprite2.getSize() - sprite1.getSize());
    });

    //Do the thing
    time = Date.now();
    new Jimp(config.atlasWidth,config.atlasHeight,(error,image) => {

        //Find open places for each sprite and each of its images, doing larger sprites first
        let placeX = 0; placeY = 0;
        const outputObject = [];
        const occupied = new Array(config.atlasWidth/config.sepW);
        for (let o = 0; o < occupied.length; o++) {
            occupied[o] = new Array(config.atlasHeight/config.sepH);
            occupied[o].fill(false);
        }

        const checkOccupied = function(spr) {
            if (spr.width <= config.sepW && spr.height <= config.sepH) {
                return (occupied[placeX/config.sepW][placeY/config.sepH]);
            }
            if (placeX+spr.width > config.atlasWidth || placeY+spr.height > config.atlasHeight) {
                return true;
            }
            for (let xx = placeX/config.sepW; xx < (placeX+spr.width)/config.sepW; xx++) {
                for (let yy = placeY/config.sepH; yy < (placeY+spr.height)/config.sepH; yy++) {
                    if (occupied[xx][yy]) {
                        return true;
                    }
                }
            }
            return false;
        }

        const setOccupied = function(spr) {
            if (spr.width <= config.sepW && spr.height <= config.sepH) {
                occupied[placeX/config.sepW][placeY/config.sepH] = true;
            } else {
                for (let xx = placeX/config.sepW; xx < (placeX+spr.width)/config.sepW; xx++) {
                    for (let yy = placeY/config.sepH; yy < (placeY+spr.height)/config.sepH; yy++) {
                        occupied[xx][yy] = true;
                    }
                }
            }
        }

        for (let s = 0; s < sprites.length; s++) { // For each sprite
            let spriteTime = Date.now();
            const spriteOutput = {
                name: sprites[s].spriteName,
                width: sprites[s].width,
                height: sprites[s].height,
                images: []
            }
            for (let i = 0; i < sprites[s].images.length; i++) { // For each image
                // Cycle through positions on the atlas
                while (checkOccupied(spriteOutput)) {
                    if (config.verticalPlacement) {
                        // Vertical
                        placeY += config.sepH;
                        if (placeY >= config.atlasHeight) {
                            placeX += config.sepW;
                            placeY = 0;
                            if (placeX >= config.atlasWidth) {
                                throw 'Atlas size too small! Increase the dimensions and try again.';
                            }
                        }
                    } else {
                        // Horizontal
                        placeX += config.sepW;
                        if (placeX >= config.atlasWidth) {
                            placeY += config.sepH;
                            placeX = 0;
                            if (placeY >= config.atlasHeight) {
                                throw 'Atlas size too small! Increase the dimensions and try again.';
                            }
                        }
                    }
                }

                // If we got here, we found an unoccupied spot.
                image.composite(sprites[s].images[i],placeX,placeY);
                setOccupied(spriteOutput);
                spriteOutput.images.push({
                    x: placeX, y: placeY
                });
            }

            // Record full sprite
            outputObject.push(spriteOutput);
            console.log(`${Math.round((s/sprites.length)*100)}% Composited: ${spriteOutput.name} (${Date.now()-spriteTime}ms)`)
        }

        image.write(config.outputImageName);
        fs.writeFileSync(config.outputName,`export default `+JSON.stringify(outputObject,null,Number(config.outputWhitespace)));
        console.groupEnd();
        arrangeTime = Date.now()-time;
        console.log(`Load Time: ${loadTime}ms`);
        console.log(`Arrange Time: ${arrangeTime}ms`);
        console.log(`Atlas complete! Image output: ${config.outputImageName}, JSON output: ${config.outputName}`);
    });
}

compile();