class Output {
    #parent;
    set parent(id) {
        this.#parent = document.getElementById(id);
    }
    get parent() {return this.#parent;}
    
    display(id, value, unit = '') {
        document.getElementById(id).innerHTML = value + unit;
    }
}

class Tiles {
    parent; // the parent class
    length = 0; 
    width = 0; 
    waste = 0;
    get area() {return this.length * this.width};
    get perSQM() {
        if (this.area == 0) return 0;
        return 1 / this.area;
    }
    get count() {        
        const amount = Math.ceil(this.perSQM * this.parent.area);
        return Math.ceil(amount + amount * this.waste);
    }

    constructor(parent) {
        this.parent = parent;
    }
}

class Material {
    length = 0;
    width = 0;
    areaManual = false;
    #area = 0;
    get area() {
        if (this.areaManual) {
            return this.#area;
        } else {
            return this.length * this.width;
        }        
    }
    get DENSITY() {return 1700;}  // 1700 ist die Dichte in kg/m³
    get glue() {
        const glue = this.area * this.trowel;
        return this.buttering ? Math.roundDec(glue + glue * 0.25) : Math.roundDec(glue);
    }
    get grout() {
        return Math.roundDec(this.area * this.joints.length * this.joints.width * this.joints.depths * this.DENSITY * 1.05, 1);
    }
    trowel = 0;
    buttering = false;
    diagonal = false;
    joints = {length: 0, width: 0, depths: 0};
    unit = 'mm';
    tiles = new Tiles(this);
    form;

    constructor(form) {
        if (typeof form == 'string') {
            this.form = $(form);
        } else if (typeof form == 'object') {
            this.form = form;
        }
    }

    readUserInput() {
        const frmElements = Array.from(this.form.elements);
        frmElements.forEach(elm => {
            if (elm.id == 'inpLength') this.length = elm.value / 1000;
            if (elm.id == 'inpWidth') this.width = elm.value / 1000;
            if (elm.id == 'chkArea') this.areaManual = elm.checked;
            if (elm.id == 'inpArea') this.#area = elm.value;
            if (elm.id == 'selTrowel') this.trowel = elm.value;
            if (elm.id == 'chkContact') this.buttering = elm.checked;
            if (elm.id == 'inpTileLenght') this.tiles.length = elm.value / 1000;
            if (elm.id == 'inpTileWidth') this.tiles.width = elm.value / 1000;
            if (elm.id == 'inpWaste') this.tiles.waste = elm.value / 100;
            if (elm.id == 'inpJointWidth') this.joints.width = elm.value / 1000;
            if (elm.id == 'inpJointDepth') this.joints.depths = elm.value / 1000;
            if (elm.id == 'chkDiagonal') this.diagonal = elm.checked;
        });
        this.#calcJoints();
    }

    #calcJoints() { 
        if (this.diagonal) { // diagonal = mehr Fugenlänge! Diagonale eines Rechteckes ist länger!
            this.joints.length = parseInt(Math.SQRT2 / this.tiles.width + Math.SQRT2 / this.tiles.length + Math.SQRT2 / 2);
        } else {
            this.joints.length = parseInt(1 / this.tiles.width + 1 / this.tiles.length); 
        }
    }
}