(function(){'use strict';var j=Math.max,k=Math.floor;function a(){// Option here: fill screen (stretch pixels) or keep to scale (fill or overflow)
// Reset scale
p=window.innerWidth<window.innerHeight?window.innerWidth/l.width:window.innerHeight/l.height,p=j(k(p),1),m.width=l.width*p,m.height=l.height*p,n.width=m.width,n.height=m.height,i.imageSmoothingEnabled=!1,i.setTransform(1,0,0,1,0,0),i.scale(p,p)}function b(a){const b=new v(a.vertex,a.fragment);// Get attributes and uniforms
b.positionAttribute=o.getAttribLocation(b.program,"a_position"),b.textureAttribute=o.getAttribLocation(b.program,"a_texcoord"),b.positionMatrix=o.getUniformLocation(b.program,"u_positionMatrix"),b.textureMatrix=o.getUniformLocation(b.program,"u_texcoordMatrix"),b.blendUniform=o.getUniformLocation(b.program,"u_blend"),b.buffer=o.createBuffer();const c=new Float32Array([0,0,0,1,1,1,1,1,1,0,0,0]);return o.bindBuffer(o.ARRAY_BUFFER,b.buffer),o.bufferData(o.ARRAY_BUFFER,c,o.STATIC_DRAW),o.enableVertexAttribArray(b.positionAttribute),o.vertexAttribPointer(b.positionAttribute,2,o.FLOAT,!1,0,0),o.enableVertexAttribArray(b.textureAttribute),o.vertexAttribPointer(b.textureAttribute,2,o.FLOAT,!1,0,0),b.use=function(){u!==this&&(u=this,o.useProgram(this.program),o.bindBuffer(o.ARRAY_BUFFER,b.buffer),o.bufferData(o.ARRAY_BUFFER,new Float32Array(c),o.STATIC_DRAW),o.vertexAttribPointer(w.positionAttribute,2,o.FLOAT,!1,0,0))},b}/**
     * Asynchronously loads a new texture and configures it.
     * @param {string} url 
     * @returns {WebGLTexture}
     */async function c(a){return new Promise(function(b,c){const d=o.createTexture();o.bindTexture(o.TEXTURE_2D,d),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE);const e=new Image;e.src=a,e.addEventListener("load",function(){o.bindTexture(o.TEXTURE_2D,d),o.texImage2D(o.TEXTURE_2D,0,o.RGBA,o.RGBA,o.UNSIGNED_BYTE,e),b(d)}),e.addEventListener("error",function(a){c(a)})})}// Set up drawing
/**
     * Sets framebuffer and viewport for drawing to the game texture.
     * @param {WebGLTexture} atlasTexture Texture to use as atlas for all further draw calls
     */function d(a){o.bindFramebuffer(o.FRAMEBUFFER,F),o.viewport(0,0,l.width,l.height),o.clearColor(0,0,0,1),o.clear(o.COLOR_BUFFER_BIT),i.clearRect(0,0,l.width,l.height),i.save(),o.bindTexture(o.TEXTURE_2D,a),A.use(),o.uniform4f(A.blendUniform,1,1,1,1)}/**
     * Draws what's on the game texture to the screen.
     */function e(){// Switch to right framebuffer and texture
// Use the right shader and set our precalculated matrices
// Update our bound buffer to the correct type
// Update uniforms and draw the arrays
o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,m.width,m.height),o.clearColor(0,0,0,0),o.clear(o.COLOR_BUFFER_BIT),o.bindTexture(o.TEXTURE_2D,B),A.use(),o.bindBuffer(o.ARRAY_BUFFER,A.buffer),o.enableVertexAttribArray(A.positionAttribute),o.vertexAttribPointer(A.positionAttribute,2,o.FLOAT,!1,0,0),o.uniformMatrix3fv(A.positionMatrix,!1,C),o.uniformMatrix3fv(A.textureMatrix,!1,D),o.uniform4fv(A.blendUniform,E),o.drawArrays(o.TRIANGLES,0,6),i.restore()}function f(a,b){return b=k(b),a.images[b]||(b-=a.images.length),b}/**
     * Draws a sprite to the WebGL canvas, recolored by a given palette index.
     * @param {Sprite} sprite Sprite resource to draw
     * @param {number} image Image index of the sprite to draw
     * @param {number} x Absolute x on canvas
     * @param {number} y Absolute y on canvas
     * @param {number} palette Palette index to recolor the sprite to
     * @param {number} a Alpha channel
     * @param {number} [r] Red channel blend
     * @param {number} [g] Green channel blend
     * @param {number} [b] Blue channel blend
     * @param {transformFnCallback} [transformFn] Callback to apply transformations to the position matrix
     */function g(c,d,e,h,i=0,j=1,a=1,k=1,g=1,b=null){z.use(),d=f(c,d);// Set position matrix
let l=t.projection;// Set texture matrix
// Set blend
// Set palette index
l=t.translation(l,e,h),l=t.scaling(l,c.width,c.height),b&&(l=b(l)),o.uniformMatrix3fv(z.positionMatrix,!1,l),o.uniformMatrix3fv(z.textureMatrix,!1,c.images[d].textureMatrix),o.uniform4f(z.blendUniform,a,k,g,j),o.uniform1i(z.paletteUniform,i),o.drawArrays(o.TRIANGLES,0,6)}// More sprite drawing goes here - functions with transformations build in
// Or even better: make a "startDraw" and an "endDraw" that allows you to apply whatever transformations you want.
// Load all sprites from our atlas map
// Main loop
function h(){d(J);for(let a=0;6>a;a++)for(let b=0;6>b;b++)g(I.head,0,20+40*b,40*a,a+1),g(I.kanohi,b,20+40*b,40*a,a+1);// To do next:
// - migrate to a better project environment
// - draw some sweet HUD elements built of lego technic parts
//  - while you're at it, make your own atlas generation script.
e(),requestAnimationFrame(h)}// Launch
var l={width:400,height:240,atlasWidth:2048,atlasHeight:2048};// Set up our document
const m=document.createElement("canvas"),n=document.createElement("canvas");document.body.appendChild(m),document.body.appendChild(n),m.width=l.width,m.height=l.height,n.width=l.width,n.height=l.height;// Get GL Context
const o=m.getContext("webgl",{antialias:!1});if(null===o)throw new Error("Could not initialize WebGL!");// Get 2D context
const i=n.getContext("2d");i.imageSmoothingEnabled=!1;// Resize canvas with the window
let p=1;a(),window.addEventListener("resize",a),window.addEventListener("orientationchange",a);var q={vertex:`
attribute vec2 a_position;

uniform mat3 u_positionMatrix;

void main() {
    gl_Position = vec4((u_positionMatrix*vec3(a_position,1)).xy,0,1);
}`,fragment:`
precision mediump float;

uniform vec4 u_color;

void main() {
    gl_FragColor = u_color;
}`},r={vertex:`
// No change from image shader here
attribute vec2 a_position;
attribute vec2 a_texcoord;

uniform mat3 u_positionMatrix;
uniform mat3 u_texcoordMatrix;

varying vec2 v_texcoord;

void main() {
    gl_Position = vec4((u_positionMatrix*vec3(a_position,1)).xy,0,1);
    v_texcoord = (u_texcoordMatrix*vec3(a_texcoord,1.0)).xy;
}`,fragment:function(a,b,c){return`
precision mediump float;

uniform sampler2D u_image;
uniform vec4 u_blend;
uniform vec3 palette[${a}];

uniform int u_paletteIndex;

varying vec2 v_texcoord;

void main() {
    // Get current frag color from texture
    vec4 color = texture2D(u_image,v_texcoord);

    // If color equals a value in our palette index...
    for (int i = 0; i < ${b}; i++) {
        if (color.rgb == palette[i].rgb) {
            // Set color to be equal to palette color
            vec3 newCol = color.rgb;

            // ew
            // A conditional is injected for each palette, because array indices must be constant in glsl
            ${c}

            color = vec4(newCol,color.a); // Preserve old alpha
            break;
        }
    }

    // Blend it and set
    gl_FragColor = color*u_blend;
}`}};const t={/**
         * Multiplies two 3x3 matrices together
         * @param {number[]} a First matrix
         * @param {number[]} b Second matrix
         * @returns {number[]}
         */multiply:function(c,a){var b=c[0],d=c[1],e=c[2],f=c[3],g=c[4],h=c[5],i=c[6],j=c[7],k=c[8],l=a[0],m=a[1],n=a[2],o=a[3],p=a[4],q=a[5],r=a[6],s=a[7],t=a[8];return[l*b+m*f+n*i,l*d+m*g+n*j,l*e+m*h+n*k,o*b+p*f+q*i,o*d+p*g+q*j,o*e+p*h+q*k,r*b+s*f+t*i,r*d+s*g+t*j,r*e+s*h+t*k]},/**
         * Translates a matrix.
         * @param {number[]} mat Matrix to translate
         * @param {number} tx X-translation
         * @param {number} ty Y-translation
         * @returns {number[]}
         */translation:function(a,b,c){return t.multiply(a,[1,0,0,0,1,0,b,c,1])},/**
         * Rotates a matrix.
         * @param {number[]} mat Matrix to rotate
         * @param {number} angleInRadians 
         * @returns {number[]}
         */rotation:function(a,b){var d=Math.cos(b),c=Math.sin(b);return t.multiply(a,[d,-c,0,c,d,0,0,0,1])},/**
         * Scales a matrix.
         * @param {number[]} mat Matrix to scale
         * @param {number} sx Scale factor X
         * @param {number} sy Scale factor Y
         * @returns {number[]}
         */scaling:function(a,b,c){return t.multiply(a,[b,0,0,0,c,0,0,0,1])},projection:[2/l.width,0,0,0,-2/l.height,0,-1,1,1],identity:[1,0,0,0,1,0,0,0,1]};// Shader class
/** @type {Shader} */let u=null;class v{constructor(a,b){this.program=this.createShaderProgram(a,b)}use(){u!==this&&(u=this,o.useProgram(this.program))}createShaderProgram(a,b){const c=this.createShader(o.VERTEX_SHADER,a),d=this.createShader(o.FRAGMENT_SHADER,b),e=o.createProgram();if(o.attachShader(e,c),o.attachShader(e,d),o.linkProgram(e),o.getProgramParameter(e,o.LINK_STATUS))// Success
return e;else{// Failure
const a=o.getProgramInfoLog(e);throw o.deleteProgram(e),new Error(`Could not link shader program: ${a}`)}}createShader(a,b){const c=o.createShader(a);if(o.shaderSource(c,b),o.compileShader(c),o.getShaderParameter(c,o.COMPILE_STATUS))// Success
return c;else{// Failure
const a=o.getShaderInfoLog(c);throw o.deleteShader(c),new Error(`Could not compile shader: ${a}`)}}}// More shader make functions here
const w=function(){const a=new v(q.vertex,q.fragment);return a.positionAttribute=o.getAttribLocation(a.program,"a_position"),a.positionMatrix=o.getUniformLocation(a.program,"u_positionMatrix"),a.colorUniform=o.getUniformLocation(a.program,"u_color"),a.buffer=o.createBuffer(),o.bindBuffer(o.ARRAY_BUFFER,a.buffer),o.bufferData(o.ARRAY_BUFFER,new Float32Array([0,0,.5,.5]),o.DYNAMIC_DRAW),o.enableVertexAttribArray(a.positionAttribute),o.vertexAttribPointer(a.positionAttribute,2,o.FLOAT,!1,0,0),a.use(),o.uniformMatrix3fv(a.positionMatrix,!1,t.projection),a}(),z=function(){function a(a){// Feeds in one color as an array from a hex string
const c=parseInt(a.slice(0,2),16)/255,d=parseInt(a.slice(2,4),16)/255,e=parseInt(a.slice(4,6),16)/255;f[h]=[c,d,e],h++}function c(a){var c=Math.min;// Feeds three colors in based on one: first color is lighter, middle is the argument, third is darker
let d=parseInt(a.slice(0,2),16)/255,e=parseInt(a.slice(2,4),16)/255,g=parseInt(a.slice(4,6),16)/255;f[h]=[c(1,d+k),c(1,e+k),c(1,g+k)],f[h+1]=[d,e,g],f[h+2]=[j(0,d-k),j(0,e-k),j(0,g-k)],h+=3}// Reconfigure these options if you want to change palettes at any point
const d=9,e=7*d,f=Array(e);// Current palettes:
//  0 - default colors
//  1 - Tahu
//  2 - Pohatu
//  3 - Onua
//  4 - Kopaka
//  5 - Gali
//  6 - Lewa
let h=0,k=.2,l=Date.now();a("ffffff"),a("ababab"),a("545454"),a("ddf097"),a("a4bd46"),a("61702a"),a("010101"),a("010102"),a("010103"),c("c4281b"),c("c470a0"),c("da8540"),c("675237"),c("da8540"),c("d7c599"),c("1b2a34"),c("287f46"),c("6d6e6c"),c("d0d1d0"),c("6e99c9"),c("a1a5a2"),c("0d69ab"),c("f5cd2f"),c("6e99c9"),c("287f46"),c("c7d23c"),c("a4bd46");let m="";for(let a=1;a<7;a++)// Inject a conditional for each possible palette
// We have to do this because we can't use a uniform in array index in glsl, yikes.
m+=`if (u_paletteIndex == ${a}) {
            newCol = palette[i+(${a}*${d})];
        }\n`;// babel wouldn't let me just throw vertex/fragment in as arguments
// so instead let's overwrite fragment function with the proper fragment source
const n=r.fragment(e,d,m);r.fragment=n;const p=b(r);p.use();// Load the uniform
for(let a=0;a<e;a++){// This has to happen for every color... dozens of times. Because there's no way to set a full glsl array
// Each array index has to be set individually. yikes.
// Grab the location for this index of our palette
const b=o.getUniformLocation(p.program,`palette[${a}]`);// Load it with our four channels for each color
o.uniform3fv(b,f[a])}return p.paletteUniform=o.getUniformLocation(p.program,`u_paletteIndex`),console.log(`Compiled, calculated and placed ${e} colors in shader uniform in ${Date.now()-l}ms`),p}(),A=b({vertex:`
attribute vec2 a_position;
attribute vec2 a_texcoord;

uniform mat3 u_positionMatrix;
uniform mat3 u_texcoordMatrix;

varying vec2 v_texcoord;

void main() {
    gl_Position = vec4((u_positionMatrix*vec3(a_position,1)).xy,0,1);
    v_texcoord = (u_texcoordMatrix*vec3(a_texcoord,1.0)).xy;
}`,fragment:`
precision mediump float;

uniform sampler2D u_image;
uniform vec4 u_blend;

varying vec2 v_texcoord;

void main() {
    gl_FragColor = texture2D(u_image,v_texcoord)*u_blend;
}`});o.clearColor(0,0,0,1),o.clear(o.COLOR_BUFFER_BIT),o.disable(o.DEPTH_TEST),o.enable(o.BLEND),o.blendFunc(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA);// Set up game texture
const B=o.createTexture();o.bindTexture(o.TEXTURE_2D,B),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.texImage2D(o.TEXTURE_2D,0,o.RGBA,l.width,l.height,0,o.RGBA,o.UNSIGNED_BYTE,null);const C=[2,0,0,0,-2,0,-1,1,1],D=[1,0,0,0,-1,0,0,1,1];let E=[1,1,1,1];// Set up our framebuffer
const F=o.createFramebuffer();o.bindFramebuffer(o.FRAMEBUFFER,F),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,B,0);var G=[{name:"head",width:40,height:40,images:[{x:0,y:0},{x:48,y:0},{x:96,y:0},{x:144,y:0}]},{name:"kanohi",width:40,height:40,images:[{x:192,y:0},{x:240,y:0},{x:288,y:0},{x:336,y:0},{x:384,y:0},{x:432,y:0}]}];class H{constructor(a,b,c,d){this.name=a,this.width=b,this.height=c,this.images=d;for(let e,f=0;f<this.images.length;f++)// Generate texture matrices for each image
e=t.identity,e=t.translation(e,d[f].x/l.atlasWidth,d[f].y/l.atlasHeight),e=t.scaling(e,this.width/l.atlasWidth,this.height/l.atlasHeight),this.images[f].textureMatrix=e}}const I={};for(let a in G){const b=G[a];I[b.name]=new H(b.name,b.width,b.height,b.images)}let J=null;(async()=>{// Loading resources here
J=await c("../asset/atlas.png"),h()})()})();

//# sourceMappingURL=bionicle.js.map