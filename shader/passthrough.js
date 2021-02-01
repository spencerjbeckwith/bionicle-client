export default {
    vertex:
   `attribute vec4 a_position;

    void main() {
        gl_Position = a_position;
    }`,
    
    fragment:
   `precision mediump float;
    
    void main() {
        gl_FragColor = vec4(0.5,0.4,0.3,1);
    }`
    }