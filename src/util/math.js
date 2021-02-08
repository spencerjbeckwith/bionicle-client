/**
 * Linearly interpolate one value towards another by a factor of their difference.
 * @param {number} a 
 * @param {number} b 
 * @param {number} factor 
 * @returns {number}
 */
function lerp(a,b,factor) {
    return a+(factor*(b-a));
}

/**
 * Linearly interpolate one value towards another by a factor of their difference.
 * After a threshold is passed, the values are set to be equal.
 * @param {number} a 
 * @param {number} b 
 * @param {number} factor 
 * @param {number} [threshold] Difference at which the values are set to be equal
 * @returns {number}
 */
function lerpTo(a,b,factor,threshold = 0.1) {
    if (a === b) {
        return a;
    }
    a = lerp(a,b,factor);
    if (Math.abs(a-b) < threshold) {
        a = b;
    }
    return a;
}

export { lerp, lerpTo }