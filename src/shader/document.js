import config from '../data/config.js';

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

export { canvas, canvas2, gl, ctx, scale }