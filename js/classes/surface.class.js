class Surface {
    description = '';    
    length = 0;
    defaultHeight = 0;
    #height = 0;
    #width = 0;
    get width() {return this.#width;}
    set width(value) {
        this.#width = value;
        this.#height = value;
    }
    get height() {return this.#height;}
    get area() { return this.length * this.width;}
    waterproofed = false;
    waterproofedArea = 0;
    
    
    constructor(defHeight) {
        if (defHeight !== undefined) this.defaultHeight = defHeight;
    }
}