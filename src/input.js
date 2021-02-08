import { canvas2, scale } from './shader/document.js';

/*
    To check mouse position: Input.mouseX and Input.mouseY
    To check if mouse is over an area: Input.mouseWithin(...)
    To check a button: Input.mousePressed[Input.mb.left], etc.
*/

const Input = new function() {
    this.mb = {
        left: 0,
        middle: 1,
        right: 2,
        back: 3,
        forward: 4
    };

    this.mouseX = 0;
    this.mouseY = 0;

    // Mouse button arrays
    this.mousePressed = new Array(5);
    this.mouseHeld = new Array(5);
    this.mouseReleased = new Array(5);

    // Wipe
    this.mousePressed.fill(false);
    this.mouseHeld.fill(false);
    this.mouseReleased.fill(false);

    // Event listeners for input
    canvas2.addEventListener('mousemove',function(ev) {
        this.mouseX = Math.floor(ev.offsetX/scale);
        this.mouseY = Math.floor(ev.offsetY/scale);
    }.bind(this));
    canvas2.addEventListener('mousedown',function(ev) {
        this.mousePressed[ev.button] = true;
        this.mouseHeld[ev.button] = true;
    }.bind(this));
    canvas2.addEventListener('mouseup',function(ev) {
        this.mouseReleased[ev.button] = true;
        this.mouseHeld[ev.button] = false;
    }.bind(this));
    canvas2.addEventListener('contextmenu',function(ev) {
        // No context menu pls
        ev.preventDefault();
    });

    /**
     * Checks if the mouse is within a certain region of the canvas.
     * @param {number} x1 X of top-left corner (inclusive)
     * @param {number} y1 Y of top-left corner (inclusive)
     * @param {number} x2 X of bottom-right corner (exclusive)
     * @param {number} y2 Y of bottom-right corner (exclusive)
     * @returns {boolean}
     */
    this.mouseWithin = function(x1,y1,x2,y2) {
        if (this.mouseX >= x1 && this.mouseX < x2 && this.mouseY >= y1 && this.mouseY < y2) {
            return true;
        }
        return false;
    }.bind(this);

    /**
     * Resets frame-specific input, such as button/mouse presses and releases
     */
    this.reset = function() {
        this.mousePressed.fill(false);
        this.mouseReleased.fill(false);
        // Keyboard press
        // Keyboard release
    }.bind(this);
}

export default Input;