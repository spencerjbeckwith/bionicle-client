(function(){'use strict';var n=Math.max,o=Math.floor;function a(){// Option here: fill screen (stretch pixels) or keep to scale (fill or overflow)
// Reset scale
u=window.innerWidth<window.innerHeight?window.innerWidth/p.width:window.innerHeight/p.height,u=n(o(u),1),q.width=p.width*u,q.height=p.height*u,r.width=q.width,r.height=q.height,t.imageSmoothingEnabled=!1,t.setTransform(1,0,0,1,0,0),t.scale(u,u)}/**
     * Returns an array of RGB values from a hex color, for use in a shader or as a blend.
     * @param {string} hexString Six-character HTML color
     * @param {number} factor A decimal to show how far to scale this color, must be between -1 and 1 though values around 0.2 work best
     * @returns {number[]}
     */function b(a,c){var d=Math.min;let e=parseInt(a.slice(0,2),16)/255,f=parseInt(a.slice(2,4),16)/255,h=parseInt(a.slice(4,6),16)/255;return c&&(e=n(0,d(1,e+c)),f=n(0,d(1,f+c)),h=n(0,d(1,h+c))),[e,f,h]}/**
     * Creates a new nine-color palette given three base colors (for the primary, secondary, and eye) and three optional change factors to scale for lighter and darker versions of the colors.
     * If change factors aren't provided, it defaults to 0.2.
     * @constructor
     * @param {string} primaryHex 
     * @param {string} secondaryHex 
     * @param {string} eyeHex 
     * @param {number} [primaryChangeFactor]
     * @param {number} [secondaryChangeFactor]
     * @param {number} [eyeChangeFactor]
     */function c(a,c,d,e=.2,f=.2,g=.2){// Each palette has three colors for three areas, nine colors total.
// Each area has a light area, medium area, and dark area to look like shadows
// These nine colors only replace the nine colors in our default swap.gpl palette
// Each palette has three arrays, each of which holds three arrays, each of which holds RGB from 0 to 1
this.primary=[b(a,0),b(a,e),b(a,-e)],this.secondary=[b(c,0),b(c,f),b(c,-g)],this.eye=[b(d,0),b(d,g),b(d,-g)]}function d(a){const b=new F(a.vertex,a.fragment);// Get attributes and uniforms
b.positionAttribute=s.getAttribLocation(b.program,"a_position"),b.textureAttribute=s.getAttribLocation(b.program,"a_texcoord"),b.positionMatrix=s.getUniformLocation(b.program,"u_positionMatrix"),b.textureMatrix=s.getUniformLocation(b.program,"u_texcoordMatrix"),b.blendUniform=s.getUniformLocation(b.program,"u_blend"),b.buffer=s.createBuffer();const c=new Float32Array([0,0,0,1,1,1,1,1,1,0,0,0]);return s.bindBuffer(s.ARRAY_BUFFER,b.buffer),s.bufferData(s.ARRAY_BUFFER,c,s.STATIC_DRAW),s.enableVertexAttribArray(b.positionAttribute),s.vertexAttribPointer(b.positionAttribute,2,s.FLOAT,!1,0,0),s.enableVertexAttribArray(b.textureAttribute),s.vertexAttribPointer(b.textureAttribute,2,s.FLOAT,!1,0,0),b.use=function(){E!==this&&(E=this,s.useProgram(this.program),s.bindBuffer(s.ARRAY_BUFFER,b.buffer),s.bufferData(s.ARRAY_BUFFER,new Float32Array(c),s.STATIC_DRAW),s.vertexAttribPointer(G.positionAttribute,2,s.FLOAT,!1,0,0))},b}/**
     * Asynchronously loads a new texture and configures it.
     * @param {string} url 
     * @returns {WebGLTexture}
     */async function e(a){return new Promise(function(b,c){const d=s.createTexture();s.bindTexture(s.TEXTURE_2D,d),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE);const e=new Image;e.src=a,e.addEventListener("load",function(){s.bindTexture(s.TEXTURE_2D,d),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,e),b(d)}),e.addEventListener("error",function(a){c(a)})})}// Set up drawing
/**
     * Sets framebuffer and viewport for drawing to the game texture.
     * @param {WebGLTexture} atlasTexture Texture to use as atlas for all further draw calls
     */function f(a){s.bindFramebuffer(s.FRAMEBUFFER,N),s.viewport(0,0,p.width,p.height),s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT),t.clearRect(0,0,p.width,p.height),t.save(),s.bindTexture(s.TEXTURE_2D,a),I.use(),s.uniform4f(I.blendUniform,1,1,1,1)}/**
     * Draws what's on the game texture to the screen.
     */function g(){// Switch to right framebuffer and texture
// Use the right shader and set our precalculated matrices
// Update our bound buffer to the correct type
// Update uniforms and draw the arrays
s.bindFramebuffer(s.FRAMEBUFFER,null),s.viewport(0,0,q.width,q.height),s.clearColor(0,0,0,0),s.clear(s.COLOR_BUFFER_BIT),s.bindTexture(s.TEXTURE_2D,J),I.use(),s.bindBuffer(s.ARRAY_BUFFER,I.buffer),s.enableVertexAttribArray(I.positionAttribute),s.vertexAttribPointer(I.positionAttribute,2,s.FLOAT,!1,0,0),s.uniformMatrix3fv(I.positionMatrix,!1,K),s.uniformMatrix3fv(I.textureMatrix,!1,L),s.uniform4fv(I.blendUniform,M),s.drawArrays(s.TRIANGLES,0,6),t.restore()}function h(a,b){return b=o(b),a.images[b]||(b-=a.images.length),b}/**
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
     */function i(c,d,e,f,i,j=1,a=1,k=1,g=1,b=null){H.use(),d=h(c,d);// Set position matrix
let l=z.projection;// Set texture matrix
// Set blend
// Set palette index
l=z.translation(l,e,f),l=z.scaling(l,c.width,c.height),b&&(l=b(l)),s.uniformMatrix3fv(H.positionMatrix,!1,l),s.uniformMatrix3fv(H.textureMatrix,!1,c.images[d].textureMatrix),s.uniform4f(H.blendUniform,a,k,g,j),H.setPalette(i),s.drawArrays(s.TRIANGLES,0,6)}// More sprite drawing goes here - functions with transformations build in
// Or even better: make a "startDraw" and an "endDraw" that allows you to apply whatever transformations you want.
// Load all sprites from our atlas map
/**
     * Linearly interpolate one value towards another by a factor of their difference.
     * @param {number} a 
     * @param {number} b 
     * @param {number} factor 
     * @returns {number}
     */function j(c,a,b){return c+b*(a-c)}/**
     * Linearly interpolate one value towards another by a factor of their difference.
     * After a threshold is passed, the values are set to be equal.
     * @param {number} a 
     * @param {number} b 
     * @param {number} factor 
     * @param {number} [threshold] Difference at which the values are set to be equal
     * @returns {number}
     */function k(c,d,b,e=.1){var f=Math.abs;return c===d?c:(c=j(c,d,b),f(c-d)<e&&(c=d),c)}// Open position: y = 80
// Closed position: y = 158
function l(){return 15+Math.round(500*Math.random())}/** @type {KanohiMask[]} */ // Main loop
function m(){// Set rendering on framebuffer and with correct texture
/*
        function drawMasks(bx,by,startMask,pal,head) {
            if (!head) {head = spr.head;}
            for (let x = 0; x < 6; x++) {
                drawSpriteSwap(head,0,bx+(32*x),by,pal);
                drawSpriteSwap(spr.kanohi,startMask+x,bx+(32*x),by,pal);
            }
        }

        drawMasks(0,0,0,palettes.tahu);
        drawMasks(200,0,6,palettes.vakama,spr.headSecondary);
        drawMasks(0,40,0,palettes.pohatu);
        drawMasks(200,40,6,palettes.onewa,spr.headSecondary);
        drawMasks(0,80,0,palettes.onua);
        drawMasks(200,80,6,palettes.whenua,spr.headSecondary);
        drawMasks(0,120,0,palettes.kopaka);
        drawMasks(200,120,6,palettes.nuju,spr.headSecondary);
        drawMasks(0,160,0,palettes.gali);
        drawMasks(200,160,6,palettes.nokama,spr.headSecondary);
        drawMasks(0,200,0,palettes.lewa);
        drawMasks(200,200,6,palettes.matau,spr.headSecondary);

        */f(Y),W.step(),g(),X.reset(),requestAnimationFrame(m)}// Launch
var p={font:"10px Yusei Magic",width:400,height:240,atlasWidth:2048,atlasHeight:2048};// Set up our document
const q=document.createElement("canvas"),r=document.createElement("canvas");document.body.appendChild(q),document.body.appendChild(r),q.width=p.width,q.height=p.height,r.width=p.width,r.height=p.height;// Get GL Context
const s=q.getContext("webgl",{antialias:!1});if(null===s)throw new Error("Could not initialize WebGL!");// Get 2D context
const t=r.getContext("2d");t.imageSmoothingEnabled=!1;// Resize canvas with the window
let u=1;a(),window.addEventListener("resize",a),window.addEventListener("orientationchange",a);var v={vertex:`
attribute vec2 a_position;

uniform mat3 u_positionMatrix;

void main() {
    gl_Position = vec4((u_positionMatrix*vec3(a_position,1)).xy,0,1);
}`,fragment:`
precision mediump float;

uniform vec4 u_color;

void main() {
    gl_FragColor = u_color;
}`},w={vertex:`
// No change from image shader here
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

// Colors to swap
uniform vec3 u_replacedPrimary;
uniform vec3 u_replacedPrimaryLight;
uniform vec3 u_replacedPrimaryDark;
uniform vec3 u_replacedSecondary;
uniform vec3 u_replacedSecondaryLight;
uniform vec3 u_replacedSecondaryDark;
uniform vec3 u_replacedEye;
uniform vec3 u_replacedEyeLight;
uniform vec3 u_replacedEyeDark;

// What to swap to
uniform vec3 u_primary;
uniform vec3 u_primaryLight;
uniform vec3 u_primaryDark;
uniform vec3 u_secondary;
uniform vec3 u_secondaryLight;
uniform vec3 u_secondaryDark;
uniform vec3 u_eye;
uniform vec3 u_eyeLight;
uniform vec3 u_eyeDark;

varying vec2 v_texcoord;

void main() {
    // Get current frag color from texture
    vec4 color = texture2D(u_image,v_texcoord);

    // If color equals a value to swap...
    if (color.rgb == u_replacedPrimary) {
        // Set it to the new replacement
        color = vec4(u_primary.rgb,color.a);
    } else if (color.rgb == u_replacedPrimaryLight) {
        color = vec4(u_primaryLight.rgb,color.a);
    } else if (color.rgb == u_replacedPrimaryDark) {
        color = vec4(u_primaryDark.rgb,color.a);
    } else if (color.rgb == u_replacedSecondary) {
        color = vec4(u_secondary.rgb,color.a);
    } else if (color.rgb == u_replacedSecondaryLight) {
        color = vec4(u_secondaryLight.rgb,color.a);
    } else if (color.rgb == u_replacedSecondaryDark) {
        color = vec4(u_secondaryDark.rgb,color.a);
    } else if (color.rgb == u_replacedEye) {
        color = vec4(u_eye.rgb,color.a);
    } else if (color.rgb == u_replacedEyeLight) {
        color = vec4(u_eyeLight.rgb,color.a);
    } else if (color.rgb == u_replacedEyeDark) {
        color = vec4(u_eyeDark.rgb,color.a);
    }

    // Blend and set
    gl_FragColor = color*u_blend;
}`};const z={/**
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
         */translation:function(a,b,c){return z.multiply(a,[1,0,0,0,1,0,b,c,1])},/**
         * Rotates a matrix.
         * @param {number[]} mat Matrix to rotate
         * @param {number} angleInRadians 
         * @returns {number[]}
         */rotation:function(a,b){var d=Math.cos(b),c=Math.sin(b);return z.multiply(a,[d,-c,0,c,d,0,0,0,1])},/**
         * Scales a matrix.
         * @param {number[]} mat Matrix to scale
         * @param {number} sx Scale factor X
         * @param {number} sy Scale factor Y
         * @returns {number[]}
         */scaling:function(a,b,c){return z.multiply(a,[b,0,0,0,c,0,0,0,1])},projection:[2/p.width,0,0,0,-2/p.height,0,-1,1,1],identity:[1,0,0,0,1,0,0,0,1]},A={red:"c4281b",darkPink:"c470a0",orange:"da8540",brown:"675237",tan:"d7c599",black:"1b2a34",green:"287f46",darkGray:"6d6e6c",white:"d0d1d0",mediumBlue:"6e99c9",lightGray:"a1a5a2",blue:"0d69ab",yellow:"f5cd2f",lime:"a4bd46",darkOrange:"a05f34",purple:"6b327b",sandBlue:"74869c",darkTurquoise:"008f9b",metallicGold:"dbac34",metallicSilver:"a9a5b4",pearlLightGray:"9ca3a8"// Use color names as they appear on bricklink
// This is a good reference: https://brickshelf.com/gallery/ebindex/MCW/is_colourchart.png
},B={// Change these if for some reason, you have to modify our default atlas and its colors
primary:"b5b5b5",primaryLight:"e6e6e6",primaryDark:"545454",secondary:"2700ad",secondaryLight:"734cfa",secondaryDark:"12004b",eye:"ae0000",eyeLight:"fb4c4c",eyeDark:"4b0000"},C={tahu:new c(A.red,A.orange,A.darkPink),pohatu:new c(A.brown,A.tan,A.orange),onua:new c(A.black,A.darkGray,A.green),kopaka:new c(A.white,A.lightGray,A.mediumBlue),gali:new c(A.blue,A.mediumBlue,A.yellow),lewa:new c(A.green,A.lime,A.lime),vakama:new c(A.orange,A.red,A.darkPink),onewa:new c(A.tan,A.brown,A.orange),whenua:new c(A.darkGray,A.black,A.green),nuju:new c(A.lightGray,A.white,A.mediumBlue),nokama:new c(A.mediumBlue,A.blue,A.yellow),matau:new c(A.lime,A.green,A.lime)// More palettes here!
// You can also use the Palette constructor to make them on the fly for randomly-generated matoran/rahi
};// Lego colors (to swap palettes)
C.tahu.gold=new c(A.metallicGold,A.orange,A.darkPink,.4),C.tahu.silver=new c(A.metallicSilver,A.orange,A.darkPink,.4),C.pohatu.gold=new c(A.metallicGold,A.tan,A.orange,.4),C.pohatu.silver=new c(A.metallicSilver,A.tan,A.orange,.4),C.onua.gold=new c(A.metallicGold,A.darkGray,A.green,.4),C.onua.silver=new c(A.metallicSilver,A.darkGray,A.green,.4),C.kopaka.gold=new c(A.metallicGold,A.lightGray,A.mediumBlue,.4),C.kopaka.silver=new c(A.metallicSilver,A.lightGray,A.mediumBlue,.4),C.gali.gold=new c(A.metallicGold,A.mediumBlue,A.yellow,.4),C.gali.silver=new c(A.metallicSilver,A.mediumBlue,A.yellow,.4),C.lewa.gold=new c(A.metallicGold,A.lime,A.lime,.4),C.lewa.silver=new c(A.metallicSilver,A.lime,A.lime,.4);// More extended palettes here
const D={// Can't use palette constructor because it doesn't let us set all nine colors manually
primary:[b(B.primary,0),b(B.primaryLight,0),b(B.primaryDark,0)],secondary:[b(B.secondary,0),b(B.secondaryLight,0),b(B.secondaryDark,0)],eye:[b(B.eye,0),b(B.eyeLight,0),b(B.eyeDark,0)]};// Shader class
/** @type {Shader} */let E=null;class F{constructor(a,b){this.program=this.createShaderProgram(a,b)}use(){E!==this&&(E=this,s.useProgram(this.program))}createShaderProgram(a,b){const c=this.createShader(s.VERTEX_SHADER,a),d=this.createShader(s.FRAGMENT_SHADER,b),e=s.createProgram();if(s.attachShader(e,c),s.attachShader(e,d),s.linkProgram(e),s.getProgramParameter(e,s.LINK_STATUS))// Success
return e;else{// Failure
const a=s.getProgramInfoLog(e);throw s.deleteProgram(e),new Error(`Could not link shader program: ${a}`)}}createShader(a,b){const c=s.createShader(a);if(s.shaderSource(c,b),s.compileShader(c),s.getShaderParameter(c,s.COMPILE_STATUS))// Success
return c;else{// Failure
const a=s.getShaderInfoLog(c);throw s.deleteShader(c),new Error(`Could not compile shader: ${a}`)}}}// More shader make functions here
const G=function(){const a=new F(v.vertex,v.fragment);return a.positionAttribute=s.getAttribLocation(a.program,"a_position"),a.positionMatrix=s.getUniformLocation(a.program,"u_positionMatrix"),a.colorUniform=s.getUniformLocation(a.program,"u_color"),a.buffer=s.createBuffer(),s.bindBuffer(s.ARRAY_BUFFER,a.buffer),s.bufferData(s.ARRAY_BUFFER,new Float32Array([0,0,.5,.5]),s.DYNAMIC_DRAW),s.enableVertexAttribArray(a.positionAttribute),s.vertexAttribPointer(a.positionAttribute,2,s.FLOAT,!1,0,0),a.use(),s.uniformMatrix3fv(a.positionMatrix,!1,z.projection),a}(),H=function(){const a=d(w);return a.use(),s.uniform3fv(s.getUniformLocation(a.program,"u_replacedPrimary"),D.primary[0]),s.uniform3fv(s.getUniformLocation(a.program,"u_replacedPrimaryLight"),D.primary[1]),s.uniform3fv(s.getUniformLocation(a.program,"u_replacedPrimaryDark"),D.primary[2]),s.uniform3fv(s.getUniformLocation(a.program,"u_replacedSecondary"),D.secondary[0]),s.uniform3fv(s.getUniformLocation(a.program,"u_replacedSecondaryLight"),D.secondary[1]),s.uniform3fv(s.getUniformLocation(a.program,"u_replacedSecondaryDark"),D.secondary[2]),s.uniform3fv(s.getUniformLocation(a.program,"u_replacedEye"),D.eye[0]),s.uniform3fv(s.getUniformLocation(a.program,"u_replacedEyeLight"),D.eye[1]),s.uniform3fv(s.getUniformLocation(a.program,"u_replacedEyeDark"),D.eye[2]),a.uniformPrimary=s.getUniformLocation(a.program,"u_primary"),a.uniformPrimaryLight=s.getUniformLocation(a.program,"u_primaryLight"),a.uniformPrimaryDark=s.getUniformLocation(a.program,"u_primaryDark"),a.uniformSecondary=s.getUniformLocation(a.program,"u_secondary"),a.uniformSecondaryLight=s.getUniformLocation(a.program,"u_secondaryLight"),a.uniformSecondaryDark=s.getUniformLocation(a.program,"u_secondaryDark"),a.uniformEye=s.getUniformLocation(a.program,"u_eye"),a.uniformEyeLight=s.getUniformLocation(a.program,"u_eyeLight"),a.uniformEyeDark=s.getUniformLocation(a.program,"u_eyeDark"),a.setPalette=function(b){s.uniform3fv(a.uniformPrimary,b.primary[0]),s.uniform3fv(a.uniformPrimaryLight,b.primary[1]),s.uniform3fv(a.uniformPrimaryDark,b.primary[2]),s.uniform3fv(a.uniformSecondary,b.secondary[0]),s.uniform3fv(a.uniformSecondaryLight,b.secondary[1]),s.uniform3fv(a.uniformSecondaryDark,b.secondary[2]),s.uniform3fv(a.uniformEye,b.eye[0]),s.uniform3fv(a.uniformEyeLight,b.eye[1]),s.uniform3fv(a.uniformEyeDark,b.eye[2])},a}(),I=d({vertex:`
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
}`});s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT),s.disable(s.DEPTH_TEST),s.enable(s.BLEND),s.blendFunc(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA);// Set up game texture
const J=s.createTexture();s.bindTexture(s.TEXTURE_2D,J),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,p.width,p.height,0,s.RGBA,s.UNSIGNED_BYTE,null);const K=[2,0,0,0,-2,0,-1,1,1],L=[1,0,0,0,-1,0,0,1,1];let M=[1,1,1,1];// Set up our framebuffer
const N=s.createFramebuffer();s.bindFramebuffer(s.FRAMEBUFFER,N),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,J,0);class O{constructor(a,b){this.parent=null,this.children=[],this.x=a,this.y=b,this.sprite=null,this.opened=!1}addChild(){// Add coordinates to this function
const a=new O;this.children.push(a),a.parent=this}step(){// Do our functions here?
for(const a in this.children)this.children[a].step()}// Interacting functions?
}// Panel types
class P extends O{constructor(a,b){super(a,b)}//...?
}// Split the exports into multiple files if this becomes unwieldly
class Q{constructor(a,b,c){// Initialze stats
/** @type {KanohiMask[]} */ /** @type {KanohiMask} */ // do @type element
// do @type status
// Evasion / speed
// Damage dealt physically
// Damage resisted
// Damage dealt w/ elements
// Likelyhood to land hits
this.name=a,this.palette=b,this.level=1,this.xp=0,this.masks=c,this.currentMask=this.masks[0]||null,this.elements=[],this.status=[],this.hp=10,this.maxhp=10,this.nova=10,this.maxnova=10,this.agility=10,this.strength=10,this.toughness=10,this.mind=10,this.accuracy=10,this.critical=10}// What methods?
}// Later: figure out if this actually has to be a class
// And also figure out how the stats ought to be set per fighter
// Fighter generation functions? Pre-defined stat lists for toa or rahi? idk yet
var R=[{name:"statusbar",width:225,height:64,images:[{x:0,y:0}]},{name:"allyPanel",width:64,height:160,images:[{x:240,y:0}]},{name:"kanohi",width:40,height:48,images:[{x:304,y:0},{x:352,y:0},{x:400,y:0},{x:448,y:0},{x:496,y:0},{x:544,y:0},{x:592,y:0},{x:640,y:0},{x:688,y:0},{x:736,y:0},{x:784,y:0},{x:832,y:0}]},{name:"head",width:40,height:40,images:[{x:880,y:0},{x:928,y:0},{x:976,y:0},{x:1024,y:0}]},{name:"headSecondary",width:40,height:40,images:[{x:1072,y:0},{x:1120,y:0},{x:1168,y:0},{x:1216,y:0}]}];class S{constructor(a,b,c,d){this.name=a,this.width=b,this.height=c,this.images=d;for(let e,f=0;f<this.images.length;f++)// Generate texture matrices for each image
e=z.identity,e=z.translation(e,d[f].x/p.atlasWidth,d[f].y/p.atlasHeight),e=z.scaling(e,this.width/p.atlasWidth,this.height/p.atlasHeight),this.images[f].textureMatrix=e}}const T={};for(let a in R){const b=R[a];T[b.name]=new S(b.name,b.width,b.height,b.images)}class U extends O{constructor(a,b){/** @type {Fighter} */ // For effects
super(a,300+a),this.fighter=b,this.ready=!1,this.opened=!1,this.faceImage=0,this.faceSpeed=0,this.blinkTimer=l()}step(){super.step(),this.effectStep(),this.draw()}effectStep(){// Blinking
this.ready||(this.y=k(this.y,158,.12,1),158===this.y&&(this.ready=!0)),this.blinkTimer--,0>=this.blinkTimer&&(this.faceSpeed=.2,this.blinkTimer=l()),0!==this.faceSpeed&&(this.faceImage+=this.faceSpeed,4<=this.faceImage&&(this.faceImage=0,this.faceSpeed=0))}draw(){// Draw panel
// Draw name
// Draw head
i(T.allyPanel,0,this.x,this.y,this.fighter.palette),t.textAlign="center",t.textBaseline="top",t.font=p.font,t.fillStyle="white",t.fillText(this.fighter.name,this.x+32,this.y+61,50),i(T.head,this.ready?this.faceImage:2,this.x+12,this.y+12,this.fighter.palette),this.fighter.currentMask&&i(T.kanohi,this.fighter.currentMask.image,this.x+12,this.y+12,this.fighter.palette)}}const V={hau:{name:"Hau",image:0},kakama:{name:"Kakama",image:1},pakari:{name:"Pakari",image:2},akaku:{name:"Akaku",image:3},kaukau:{name:"Kaukau",image:4},miru:{name:"Miru",image:5},huna:{name:"Huna",image:6},komau:{name:"Komau",image:7},ruru:{name:"Ruru",image:8},matatu:{name:"Matatu",image:9},rau:{name:"Rau",image:10},mahiki:{name:"Mahiki",image:11}// More masks?
// Don't forget to add new masks/properties to typedefs.js
},W=new function(){this.init=function(){// Init variables
this.active=!1,this.allies=[],this.enemies=[],this.panels={statusbar:null,allyPanels:[],enemyPanels:[]}}.bind(this),this.begin=function(a,b){this.active=!0,this.allies=a,this.enemies=b,this.panels.statusbar=new P(80,0);for(let c=0;c<this.allies.length;c++)this.panels.allyPanels[c]=new U(64*c,this.allies[c])}.bind(this),this.end=function(){// Set variables to inactive state
this.active=!1,this.init([],[])}.bind(this),this.step=function(){if(this.active)// Step for each panel
for(const a in this.panels.allyPanels)this.panels.allyPanels[a].step()}.bind(this)};W.init(),W.begin([new Q("Tahu",C.tahu,[V.hau]),new Q("Gali",C.gali,[V.kaukau]),new Q("Lewa",C.lewa,[V.miru]),new Q("Pohatu",C.pohatu,[V.kakama]),new Q("Onua",C.onua,[V.pakari]),new Q("Kopaka",C.kopaka,[V.akaku])]);/*
        To check mouse position: Input.mouseX and Input.mouseY
        To check if mouse is over an area: Input.mouseWithin(...)
        To check a button: Input.mousePressed[Input.mb.left], etc.
    */const X=new function(){// Mouse button arrays
// Wipe
// Event listeners for input
/**
         * Checks if the mouse is within a certain region of the canvas.
         * @param {number} x1 X of top-left corner (inclusive)
         * @param {number} y1 Y of top-left corner (inclusive)
         * @param {number} x2 X of bottom-right corner (exclusive)
         * @param {number} y2 Y of bottom-right corner (exclusive)
         * @returns {boolean}
         */ /**
         * Resets frame-specific input, such as button/mouse presses and releases
         */this.mb={left:0,middle:1,right:2,back:3,forward:4},this.mouseX=0,this.mouseY=0,this.mousePressed=[,,,,,],this.mouseHeld=[,,,,,],this.mouseReleased=[,,,,,],this.mousePressed.fill(!1),this.mouseHeld.fill(!1),this.mouseReleased.fill(!1),r.addEventListener("mousemove",function(a){this.mouseX=o(a.offsetX/u),this.mouseY=o(a.offsetY/u)}.bind(this)),r.addEventListener("mousedown",function(a){this.mousePressed[a.button]=!0,this.mouseHeld[a.button]=!0}.bind(this)),r.addEventListener("mouseup",function(a){this.mouseReleased[a.button]=!0,this.mouseHeld[a.button]=!1}.bind(this)),r.addEventListener("contextmenu",function(a){// No context menu pls
a.preventDefault()}),this.mouseWithin=function(a,b,c,d){return!!(this.mouseX>=a&&this.mouseX<c&&this.mouseY>=b&&this.mouseY<d)}.bind(this),this.reset=function(){this.mousePressed.fill(!1),this.mouseReleased.fill(!1)}.bind(this)};let Y=null;(async()=>{// Loading resources here
Y=await e("../asset/atlas.png"),m()})()})();

//# sourceMappingURL=bionicle.js.map