export default {
vertex:`
attribute vec2 a_position;
attribute vec2 a_texcoord;

uniform mat3 u_positionMatrix;
uniform mat3 u_texcoordMatrix;

varying vec2 v_texcoord;

void main() {
    gl_Position = vec4((u_positionMatrix*vec3(a_position,1)).xy,0,1);
    v_texcoord = (u_texcoordMatrix*vec3(a_texcoord,1.0)).xy;
}`,

fragment:`
precision mediump float;

uniform sampler2D u_image;
varying vec2 v_texcoord;

void main() {
    gl_FragColor = texture2D(u_image,v_texcoord);
}`
}