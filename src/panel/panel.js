import { drawSpriteSwap, spr } from "../sprite.js";

class Panel {
    constructor(x,y) {
        this.parent = null;
        this.children = [];

        this.x = x;
        this.y = y;
        this.sprite = null;

        this.opened = false;

        // Panels must be provided the following:
        //      function to do each step
        //      function to do when hovered/unhovered
        //      function to do when clicked (left or right)
        // ... or should CLICK functionality be applied to a button class?
    }

    addChild() { // Add coordinates to this function
        const pan = new Panel();
        this.children.push(pan);
        pan.parent = this;
    }

    step() {
        // Do our functions here?
        for (const index in this.children) {
            this.children[index].step();
        }
    }

    // Interacting functions?
}

// Panel types
class Statusbar extends Panel {
    constructor(palette) {
        super(87,0);
        this.palette = palette;
    }
    step() {
        super.step();
        drawSpriteSwap(spr.statusbar,0,this.x,this.y,this.palette);
    }
}

class TurnTimer extends Panel {
    constructor(x,y) {
        super(x,y);
    }
    //...?
}

class EnemyPanel extends Panel {
    constructor(x,y) {
        super(x,y);
    }
    //...?
}

export {
    Panel,
    Statusbar,
    TurnTimer,
    EnemyPanel,
    // More panel types here
}
// Split the exports into multiple files if this becomes unwieldly