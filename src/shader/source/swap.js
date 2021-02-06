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

fragment: `
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
}`
}