(function(){'use strict';var k=Math.max,l=Math.floor;function a(){// Option here: fill screen (stretch pixels) or keep to scale (fill or overflow)
// Reset scale
r=window.innerWidth<window.innerHeight?window.innerWidth/m.width:window.innerHeight/m.height,r=k(l(r),1),n.width=m.width*r,n.height=m.height*r,o.width=n.width,o.height=n.height,q.imageSmoothingEnabled=!1,q.setTransform(1,0,0,1,0,0),q.scale(r,r)}/**
     * Returns an array of RGB values from a hex color, for use in a shader or as a blend.
     * @param {string} hexString Six-character HTML color
     * @param {number} factor A decimal to show how far to scale this color, must be between -1 and 1 though values around 0.2 work best
     * @returns {number[]}
     */function b(a,c){var d=Math.min;let e=parseInt(a.slice(0,2),16)/255,f=parseInt(a.slice(2,4),16)/255,h=parseInt(a.slice(4,6),16)/255;return c&&(e=k(0,d(1,e+c)),f=k(0,d(1,f+c)),h=k(0,d(1,h+c))),[e,f,h]}/**
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
this.primary=[b(a,0),b(a,e),b(a,-e)],this.secondary=[b(c,0),b(c,f),b(c,-g)],this.eye=[b(d,0),b(d,g),b(d,-g)]}function d(a){const b=new A(a.vertex,a.fragment);// Get attributes and uniforms
b.positionAttribute=p.getAttribLocation(b.program,"a_position"),b.textureAttribute=p.getAttribLocation(b.program,"a_texcoord"),b.positionMatrix=p.getUniformLocation(b.program,"u_positionMatrix"),b.textureMatrix=p.getUniformLocation(b.program,"u_texcoordMatrix"),b.blendUniform=p.getUniformLocation(b.program,"u_blend"),b.buffer=p.createBuffer();const c=new Float32Array([0,0,0,1,1,1,1,1,1,0,0,0]);return p.bindBuffer(p.ARRAY_BUFFER,b.buffer),p.bufferData(p.ARRAY_BUFFER,c,p.STATIC_DRAW),p.enableVertexAttribArray(b.positionAttribute),p.vertexAttribPointer(b.positionAttribute,2,p.FLOAT,!1,0,0),p.enableVertexAttribArray(b.textureAttribute),p.vertexAttribPointer(b.textureAttribute,2,p.FLOAT,!1,0,0),b.use=function(){z!==this&&(z=this,p.useProgram(this.program),p.bindBuffer(p.ARRAY_BUFFER,b.buffer),p.bufferData(p.ARRAY_BUFFER,new Float32Array(c),p.STATIC_DRAW),p.vertexAttribPointer(B.positionAttribute,2,p.FLOAT,!1,0,0))},b}/**
     * Asynchronously loads a new texture and configures it.
     * @param {string} url 
     * @returns {WebGLTexture}
     */async function e(a){return new Promise(function(b,c){const d=p.createTexture();p.bindTexture(p.TEXTURE_2D,d),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_MAG_FILTER,p.NEAREST),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_MIN_FILTER,p.NEAREST),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_WRAP_S,p.CLAMP_TO_EDGE),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_WRAP_T,p.CLAMP_TO_EDGE);const e=new Image;e.src=a,e.addEventListener("load",function(){p.bindTexture(p.TEXTURE_2D,d),p.texImage2D(p.TEXTURE_2D,0,p.RGBA,p.RGBA,p.UNSIGNED_BYTE,e),b(d)}),e.addEventListener("error",function(a){c(a)})})}// Set up drawing
/**
     * Sets framebuffer and viewport for drawing to the game texture.
     * @param {WebGLTexture} atlasTexture Texture to use as atlas for all further draw calls
     */function f(a){p.bindFramebuffer(p.FRAMEBUFFER,I),p.viewport(0,0,m.width,m.height),p.clearColor(0,0,0,1),p.clear(p.COLOR_BUFFER_BIT),q.clearRect(0,0,m.width,m.height),q.save(),p.bindTexture(p.TEXTURE_2D,a),D.use(),p.uniform4f(D.blendUniform,1,1,1,1)}/**
     * Draws what's on the game texture to the screen.
     */function g(){// Switch to right framebuffer and texture
// Use the right shader and set our precalculated matrices
// Update our bound buffer to the correct type
// Update uniforms and draw the arrays
p.bindFramebuffer(p.FRAMEBUFFER,null),p.viewport(0,0,n.width,n.height),p.clearColor(0,0,0,0),p.clear(p.COLOR_BUFFER_BIT),p.bindTexture(p.TEXTURE_2D,E),D.use(),p.bindBuffer(p.ARRAY_BUFFER,D.buffer),p.enableVertexAttribArray(D.positionAttribute),p.vertexAttribPointer(D.positionAttribute,2,p.FLOAT,!1,0,0),p.uniformMatrix3fv(D.positionMatrix,!1,F),p.uniformMatrix3fv(D.textureMatrix,!1,G),p.uniform4fv(D.blendUniform,H),p.drawArrays(p.TRIANGLES,0,6),q.restore()}function h(a,b){return b=l(b),a.images[b]||(b-=a.images.length),b}/**
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
     */function i(c,d,e,f,i,j=1,a=1,k=1,g=1,b=null){C.use(),d=h(c,d);// Set position matrix
let l=u.projection;// Set texture matrix
// Set blend
// Set palette index
l=u.translation(l,e,f),l=u.scaling(l,c.width,c.height),b&&(l=b(l)),p.uniformMatrix3fv(C.positionMatrix,!1,l),p.uniformMatrix3fv(C.textureMatrix,!1,c.images[d].textureMatrix),p.uniform4f(C.blendUniform,a,k,g,j),C.setPalette(i),p.drawArrays(p.TRIANGLES,0,6)}// More sprite drawing goes here - functions with transformations build in
// Or even better: make a "startDraw" and an "endDraw" that allows you to apply whatever transformations you want.
// Load all sprites from our atlas map
// Main loop
function j(){function a(a,b,c,d,e){e||(e=L.head);for(let f=0;6>f;f++)i(e,0,a+32*f,b,d),i(L.kanohi,c+f,a+32*f,b,d)}// Set rendering on framebuffer and with correct texture
// To do next:
// - migrate to a better project environment
// - draw some sweet HUD elements built of lego technic parts
//  - while you're at it, make your own atlas generation script.
f(M),a(0,0,0,x.tahu),a(200,0,6,x.vakama,L.headSecondary),a(0,40,0,x.pohatu),a(200,40,6,x.onewa,L.headSecondary),a(0,80,0,x.onua),a(200,80,6,x.whenua,L.headSecondary),a(0,120,0,x.kopaka),a(200,120,6,x.nuju,L.headSecondary),a(0,160,0,x.gali),a(200,160,6,x.nokama,L.headSecondary),a(0,200,0,x.lewa),a(200,200,6,x.matau,L.headSecondary),g(),requestAnimationFrame(j)}// Launch
var m={width:400,height:240,atlasWidth:2048,atlasHeight:2048};// Set up our document
const n=document.createElement("canvas"),o=document.createElement("canvas");document.body.appendChild(n),document.body.appendChild(o),n.width=m.width,n.height=m.height,o.width=m.width,o.height=m.height;// Get GL Context
const p=n.getContext("webgl",{antialias:!1});if(null===p)throw new Error("Could not initialize WebGL!");// Get 2D context
const q=o.getContext("2d");q.imageSmoothingEnabled=!1;// Resize canvas with the window
let r=1;a(),window.addEventListener("resize",a),window.addEventListener("orientationchange",a);var s={vertex:`
attribute vec2 a_position;

uniform mat3 u_positionMatrix;

void main() {
    gl_Position = vec4((u_positionMatrix*vec3(a_position,1)).xy,0,1);
}`,fragment:`
precision mediump float;

uniform vec4 u_color;

void main() {
    gl_FragColor = u_color;
}`},t={vertex:`
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
}`};const u={/**
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
         */translation:function(a,b,c){return u.multiply(a,[1,0,0,0,1,0,b,c,1])},/**
         * Rotates a matrix.
         * @param {number[]} mat Matrix to rotate
         * @param {number} angleInRadians 
         * @returns {number[]}
         */rotation:function(a,b){var d=Math.cos(b),c=Math.sin(b);return u.multiply(a,[d,-c,0,c,d,0,0,0,1])},/**
         * Scales a matrix.
         * @param {number[]} mat Matrix to scale
         * @param {number} sx Scale factor X
         * @param {number} sy Scale factor Y
         * @returns {number[]}
         */scaling:function(a,b,c){return u.multiply(a,[b,0,0,0,c,0,0,0,1])},projection:[2/m.width,0,0,0,-2/m.height,0,-1,1,1],identity:[1,0,0,0,1,0,0,0,1]},v={red:"c4281b",darkPink:"c470a0",orange:"da8540",brown:"675237",tan:"d7c599",black:"1b2a34",green:"287f46",darkGray:"6d6e6c",white:"d0d1d0",mediumBlue:"6e99c9",lightGray:"a1a5a2",blue:"0d69ab",yellow:"f5cd2f",lime:"a4bd46",darkOrange:"a05f34",purple:"6b327b",sandBlue:"74869c",darkTurquoise:"008f9b",metallicGold:"dbac34",metallicSilver:"a9a5b4",pearlLightGray:"9ca3a8"// Use color names as they appear on bricklink
// This is a good reference: https://brickshelf.com/gallery/ebindex/MCW/is_colourchart.png
},w={// Change these if for some reason, you have to modify our default atlas and its colors
primary:"b5b5b5",primaryLight:"e6e6e6",primaryDark:"545454",secondary:"2700ad",secondaryLight:"734cfa",secondaryDark:"12004b",eye:"ae0000",eyeLight:"fb4c4c",eyeDark:"4b0000"},x={tahu:new c(v.red,v.orange,v.darkPink),pohatu:new c(v.brown,v.tan,v.orange),onua:new c(v.black,v.darkGray,v.green),kopaka:new c(v.white,v.lightGray,v.mediumBlue),gali:new c(v.blue,v.mediumBlue,v.yellow),lewa:new c(v.green,v.lime,v.lime),vakama:new c(v.orange,v.red,v.darkPink),onewa:new c(v.tan,v.brown,v.orange),whenua:new c(v.darkGray,v.black,v.green),nuju:new c(v.lightGray,v.white,v.mediumBlue),nokama:new c(v.mediumBlue,v.blue,v.yellow),matau:new c(v.lime,v.green,v.lime)// More palettes here!
// You can also use the Palette constructor to make them on the fly for randomly-generated matoran/rahi
};// Lego colors (to swap palettes)
x.tahu.gold=new c(v.metallicGold,v.orange,v.darkPink,.4),x.tahu.silver=new c(v.metallicSilver,v.orange,v.darkPink,.4),x.pohatu.gold=new c(v.metallicGold,v.tan,v.orange,.4),x.pohatu.silver=new c(v.metallicSilver,v.tan,v.orange,.4),x.onua.gold=new c(v.metallicGold,v.darkGray,v.green,.4),x.onua.silver=new c(v.metallicSilver,v.darkGray,v.green,.4),x.kopaka.gold=new c(v.metallicGold,v.lightGray,v.mediumBlue,.4),x.kopaka.silver=new c(v.metallicSilver,v.lightGray,v.mediumBlue,.4),x.gali.gold=new c(v.metallicGold,v.mediumBlue,v.yellow,.4),x.gali.silver=new c(v.metallicSilver,v.mediumBlue,v.yellow,.4),x.lewa.gold=new c(v.metallicGold,v.lime,v.lime,.4),x.lewa.silver=new c(v.metallicSilver,v.lime,v.lime,.4);// More extended palettes here
const y={// Can't use palette constructor because it doesn't let us set all nine colors manually
primary:[b(w.primary,0),b(w.primaryLight,0),b(w.primaryDark,0)],secondary:[b(w.secondary,0),b(w.secondaryLight,0),b(w.secondaryDark,0)],eye:[b(w.eye,0),b(w.eyeLight,0),b(w.eyeDark,0)]};// Shader class
/** @type {Shader} */let z=null;class A{constructor(a,b){this.program=this.createShaderProgram(a,b)}use(){z!==this&&(z=this,p.useProgram(this.program))}createShaderProgram(a,b){const c=this.createShader(p.VERTEX_SHADER,a),d=this.createShader(p.FRAGMENT_SHADER,b),e=p.createProgram();if(p.attachShader(e,c),p.attachShader(e,d),p.linkProgram(e),p.getProgramParameter(e,p.LINK_STATUS))// Success
return e;else{// Failure
const a=p.getProgramInfoLog(e);throw p.deleteProgram(e),new Error(`Could not link shader program: ${a}`)}}createShader(a,b){const c=p.createShader(a);if(p.shaderSource(c,b),p.compileShader(c),p.getShaderParameter(c,p.COMPILE_STATUS))// Success
return c;else{// Failure
const a=p.getShaderInfoLog(c);throw p.deleteShader(c),new Error(`Could not compile shader: ${a}`)}}}// More shader make functions here
const B=function(){const a=new A(s.vertex,s.fragment);return a.positionAttribute=p.getAttribLocation(a.program,"a_position"),a.positionMatrix=p.getUniformLocation(a.program,"u_positionMatrix"),a.colorUniform=p.getUniformLocation(a.program,"u_color"),a.buffer=p.createBuffer(),p.bindBuffer(p.ARRAY_BUFFER,a.buffer),p.bufferData(p.ARRAY_BUFFER,new Float32Array([0,0,.5,.5]),p.DYNAMIC_DRAW),p.enableVertexAttribArray(a.positionAttribute),p.vertexAttribPointer(a.positionAttribute,2,p.FLOAT,!1,0,0),a.use(),p.uniformMatrix3fv(a.positionMatrix,!1,u.projection),a}(),C=function(){const a=d(t);return a.use(),p.uniform3fv(p.getUniformLocation(a.program,"u_replacedPrimary"),y.primary[0]),p.uniform3fv(p.getUniformLocation(a.program,"u_replacedPrimaryLight"),y.primary[1]),p.uniform3fv(p.getUniformLocation(a.program,"u_replacedPrimaryDark"),y.primary[2]),p.uniform3fv(p.getUniformLocation(a.program,"u_replacedSecondary"),y.secondary[0]),p.uniform3fv(p.getUniformLocation(a.program,"u_replacedSecondaryLight"),y.secondary[1]),p.uniform3fv(p.getUniformLocation(a.program,"u_replacedSecondaryDark"),y.secondary[2]),p.uniform3fv(p.getUniformLocation(a.program,"u_replacedEye"),y.eye[0]),p.uniform3fv(p.getUniformLocation(a.program,"u_replacedEyeLight"),y.eye[1]),p.uniform3fv(p.getUniformLocation(a.program,"u_replacedEyeDark"),y.eye[2]),a.uniformPrimary=p.getUniformLocation(a.program,"u_primary"),a.uniformPrimaryLight=p.getUniformLocation(a.program,"u_primaryLight"),a.uniformPrimaryDark=p.getUniformLocation(a.program,"u_primaryDark"),a.uniformSecondary=p.getUniformLocation(a.program,"u_secondary"),a.uniformSecondaryLight=p.getUniformLocation(a.program,"u_secondaryLight"),a.uniformSecondaryDark=p.getUniformLocation(a.program,"u_secondaryDark"),a.uniformEye=p.getUniformLocation(a.program,"u_eye"),a.uniformEyeLight=p.getUniformLocation(a.program,"u_eyeLight"),a.uniformEyeDark=p.getUniformLocation(a.program,"u_eyeDark"),a.setPalette=function(b){p.uniform3fv(a.uniformPrimary,b.primary[0]),p.uniform3fv(a.uniformPrimaryLight,b.primary[1]),p.uniform3fv(a.uniformPrimaryDark,b.primary[2]),p.uniform3fv(a.uniformSecondary,b.secondary[0]),p.uniform3fv(a.uniformSecondaryLight,b.secondary[1]),p.uniform3fv(a.uniformSecondaryDark,b.secondary[2]),p.uniform3fv(a.uniformEye,b.eye[0]),p.uniform3fv(a.uniformEyeLight,b.eye[1]),p.uniform3fv(a.uniformEyeDark,b.eye[2])},a}(),D=d({vertex:`
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
}`});p.clearColor(0,0,0,1),p.clear(p.COLOR_BUFFER_BIT),p.disable(p.DEPTH_TEST),p.enable(p.BLEND),p.blendFunc(p.SRC_ALPHA,p.ONE_MINUS_SRC_ALPHA);// Set up game texture
const E=p.createTexture();p.bindTexture(p.TEXTURE_2D,E),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_MAG_FILTER,p.NEAREST),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_MIN_FILTER,p.NEAREST),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_WRAP_S,p.CLAMP_TO_EDGE),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_WRAP_T,p.CLAMP_TO_EDGE),p.texImage2D(p.TEXTURE_2D,0,p.RGBA,m.width,m.height,0,p.RGBA,p.UNSIGNED_BYTE,null);const F=[2,0,0,0,-2,0,-1,1,1],G=[1,0,0,0,-1,0,0,1,1];let H=[1,1,1,1];// Set up our framebuffer
const I=p.createFramebuffer();p.bindFramebuffer(p.FRAMEBUFFER,I),p.framebufferTexture2D(p.FRAMEBUFFER,p.COLOR_ATTACHMENT0,p.TEXTURE_2D,E,0);var J=[{name:"kanohi",width:40,height:48,images:[{x:0,y:0},{x:48,y:0},{x:96,y:0},{x:144,y:0},{x:192,y:0},{x:240,y:0},{x:288,y:0},{x:336,y:0},{x:384,y:0},{x:432,y:0},{x:480,y:0},{x:528,y:0}]},{name:"head",width:40,height:40,images:[{x:576,y:0},{x:624,y:0},{x:672,y:0},{x:720,y:0}]},{name:"headSecondary",width:40,height:40,images:[{x:768,y:0},{x:816,y:0},{x:864,y:0},{x:912,y:0}]}];class K{constructor(a,b,c,d){this.name=a,this.width=b,this.height=c,this.images=d;for(let e,f=0;f<this.images.length;f++)// Generate texture matrices for each image
e=u.identity,e=u.translation(e,d[f].x/m.atlasWidth,d[f].y/m.atlasHeight),e=u.scaling(e,this.width/m.atlasWidth,this.height/m.atlasHeight),this.images[f].textureMatrix=e}}const L={};for(let a in J){const b=J[a];L[b.name]=new K(b.name,b.width,b.height,b.images)}let M=null;(async()=>{// Loading resources here
M=await e("../asset/atlas.png"),j()})()})();

//# sourceMappingURL=bionicle.js.map