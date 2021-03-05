const Waves = {
    waves: [0,0,0,0,0],
    array: [0,0,0,0,0],
    fastest: 0,
    fast: 0,
    normal: 0,
    slow: 0,
    slowest: 0,
}

Waves.increment = function() {
    let divisor = 8;
    for (let w = 0; w < 5; w++) {
        this.waves[w] += Math.PI/divisor;
        if (this.waves[w] > Math.PI*2) {
            this.waves[w] -= Math.PI*2;
        }
        divisor *= 2;
    }

    // Think this'll be slow?
    this.fastest = Math.sin(this.waves[0]);
    this.fast = Math.sin(this.waves[1]);
    this.normal = Math.sin(this.waves[2]);
    this.slow = Math.sin(this.waves[3]);
    this.slowest = Math.sin(this.waves[4]);
    this.array = [ this.fastest, this.fast, this.normal, this.slow, this.slowest ] ;
}

export default Waves;