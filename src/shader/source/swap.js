export default {
vertex:`
// No change from image shader here
attribute vec2 a_position;
attribute vec2 a_texcoord;

uniform mat3 u_positionMatrix;
uniform mat3 u_texcoordMatrix;

varying vec2 v_texcoord;

void main() {
    gl_Position = vec4((u_positionMatrix*vec3(a_position,1)).xy,0,1);
    v_texcoord = (u_texcoordMatrix*vec3(a_texcoord,1.0)).xy;
}`,

fragment: function(palLength,colorCount,injection) {return`
precision mediump float;

uniform sampler2D u_image;
uniform vec4 u_blend;
uniform vec3 palette[${palLength}];

uniform int u_paletteIndex;

varying vec2 v_texcoord;

void main() {
    // Get current frag color from texture
    vec4 color = texture2D(u_image,v_texcoord);

    // If color equals a value in our palette index...
    for (int i = 0; i < ${colorCount}; i++) {
        if (color.rgb == palette[i].rgb) {
            // Set color to be equal to palette color
            vec3 newCol = color.rgb;

            // ew
            // A conditional is injected for each palette, because array indices must be constant in glsl
            ${injection}

            color = vec4(newCol,color.a); // Preserve old alpha
            break;
        }
    }

    // Blend it and set
    gl_FragColor = color*u_blend;
}`
}}