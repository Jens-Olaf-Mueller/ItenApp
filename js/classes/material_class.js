import $ from '../library.js';
import FormHandler from './formhandler_class.js';

class Material extends FormHandler {
    unit = '1'; // = m
    areaManual = false;
    areaLength = 0;
    areaWidth = 0;   
    tileLength = 0;
    tileWidth = 0;
    offcut = 0; 
    trowel = 0;
    contactLayer = false;
    diagonal = false;
    levelHeight = 0;
    jointWidth = 0;
    jointDepth = 0;
    get jointLength() { 
        if (this.diagonal) { 
            // diagonal = mehr Fugenlänge! Diagonale eines Rechteckes ist länger!
            return parseInt(Math.SQRT2 / Number(this.tileWidth / 1000) + Math.SQRT2 / Number(this.tileLength / 1000) + Math.SQRT2 / 2);
        } else {
            return parseInt(1 / Number(this.tileWidth / 1000) + 1 / Number(this.tileLength / 1000)); 
        }
    }

    get DENSITY() {return 1700;}  // 1700 ist die Dichte in kg/m³

    #area = 0;
    get area() {
        if (this.areaManual) {
            return Number(this.#area);
        } else {
            const unit = Number(this.unit) || 1;
            return (this.areaLength / unit) * (this.areaWidth / unit);
        }        
    }
    set area (newVal) {
        if (this.areaManual) this.#area = newVal;
    }
    
    get glue() {
        const glue = this.area * this.trowel;
        return this.contactLayer ? Math.roundDec(glue + glue * 0.25) : Math.roundDec(glue);
    }

    get grout() {
        return Math.roundDec(this.area * this.jointLength * this.jointWidth / 1000 * this.jointDepth / 1000 * this.DENSITY * 1.05, 1);
    }

    get levelCompound() {
        return Math.roundDec(this.area * this.levelHeight / 1000 * this.DENSITY);
    }

    get tilesPerSQM() {
        const tileSize = (this.tileLength / 1000) * (this.tileWidth / 1000);
        return (tileSize == 0) ? 0 : 1 / tileSize;
    }
    get tiles() {        
        const amount = Math.ceil(this.tilesPerSQM * this.area);
        return Math.ceil(amount + amount * this.offcut / 100);
    }

    constructor(form) {
        super(form);
    }

    applyChanges() {
        let entries = this.#readFormData();
        const objPb = {}; // create a property object!    
        for (const prop in entries) {
            const value = entries[prop];
            if (value !== undefined) {
                objPb[prop] = (value === 'on') ? true : value;
            }
        }
        this.#assignProperties(objPb);
    }

    // https://stackabuse.com/convert-form-data-to-javascript-object/
    #readFormData() {
        const frmData = new FormData(this.form),
              frmEntries = Object.fromEntries(frmData.entries());
        // handling all named checkboxes to get also UNchecked boxes!
        Array.from($('[type="checkbox"][name]')).map(box => {
            frmEntries[box.name] = box.checked;
        });
        return frmEntries;
    }

    /**
     * Private method.
     * Assigns the passed settings to the class.
     * If no settings are available (i.e. first start), default settings are used.
     * @param {object} settings settings to be assigned to the class
     */
    #assignProperties(settings) {
        if (settings == null) return;
        for (const prop in settings) {
            if (this.hasOwnProperty(prop) || this.hasOwnSetter(prop)) {
                this[prop] = settings[prop];
            }
        }
    }

    /**
     * Helper function for #assignProperties.
     * Checks if the class has a setter with the given name. 
     * @param {string} property Name of the property we want to determine if it has a setter
     * @returns true | false
     */
    hasOwnSetter(property) {
        const setters = Object.entries(Object.getOwnPropertyDescriptors(Material.prototype))
            .filter(([key, descriptor]) => typeof descriptor.set === 'function').map(([key]) => key)
        return setters.includes(property);
    }

}

class Surface extends Material {
    description = '';    
    length = 0;
    defaultHeight = 0;
    
    #width = 0;
    get width() {return this.#width;}
    set width(value) {
        this.#width = value;
    }
    
    #height = 0;
    get height() {return this.#height;}
    set height(value) {
        this.#height = value;
    }
    get area() { return this.length * this.width;}
    waterproofed = false;
    waterproofedArea = 0;
    
    
    constructor(defHeight) {
        super();
        if (defHeight !== undefined) this.defaultHeight = defHeight;
    }
}

class Tiles extends Material {
    offcut = 0;

    get perSQM() {
        if (this.area == 0) return 0;
        return 1 / this.area;
    }
    get count() {        
        const amount = Math.ceil(this.perSQM * this.area);
        return Math.ceil(amount + amount * this.offcut);
    }

    constructor(parent) {
        super();
        this.parent = parent;
    }
}

export { Material, Tiles, Surface };