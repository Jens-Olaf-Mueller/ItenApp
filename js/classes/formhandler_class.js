import Wizard from './wizard_class.js';
import { CLASS_PROPERTIES } from './library_class.js';


// indizes of wizard-buttons
// export const ICON = {
//     HOME: 0, PREV: 1, ADD: 2, CAM : 3, INFO: 4, SEND: 5, NEXT: 6
//     // HOME: 0, PREV: -1, NEXT: 1, ADD: 'add', CAM : 'cam', INFO: 'info', SEND: 'send'
// };


export default class FormHandler {
    get properties() { return Object.getOwnPropertyNames(this); }

    #form = null;
    get form() { return this.#form }
    set form(frm) { 
        if (typeof frm == 'string') {
            this.#form = document.getElementById(frm);
        } else if (frm instanceof HTMLFormElement) {
            this.#form = frm;
        } else {
            this.#form = null;
        }
    }

    get getFormData() {
        if (this.form) {
            const frmData = new FormData(this.form);
            return Object.fromEntries(frmData.entries());
        }
        return null;
    }


    #wizard = null;
    get wizard() { return this.#wizard; }
    set wizard(form) {
        if (form instanceof HTMLFormElement) {
            this.#wizard = new Wizard(this, form.name)
        }
    }


    // TODO wenn Form zugewiesen wird, dann Properties aus Form an die Klasse zuweisen!
    // Eventlisteners an Form-members zuweisen: 
    // {element: id | html-elmt, event: 'click', handler: fnc}
    constructor(form, properties) {
        this.form = form;
        this.wizard = this.form; // NOT: this.wizard = form, because 'form' can be a string!!!
        if (properties) this.#defineClassProperties(properties);        
    }


    /**
     * Displays the given form element by removing the 'hidden'-attribute.
     * @param {HTMLElement} form form to be displayed. Default is the assigned class form.
     */
    show(form = this.form) {
        if (form) form.removeAttribute('hidden');
    }


    /**
     * Hides the given form element by adding the 'hidden'-attribute.
     * @param {HTMLElement} form form to hide. Default is the assigned class form.
     */
    hide(form = this.form) {
        if (form) form.setAttribute('hidden','');
    }

    validate() {
        return true;
    }    


    addEvents(...elements) { 
        elements.forEach(elmt => {
            // call nodelist-elements recursively!
            if (elmt.element instanceof Array) {
                const list = elmt.element;
                for (let i = 0; i < list.length; i++) {
                    this.addEvents({element: list[i], event: elmt.event, func: elmt.func})
                }
            }
            const target = this.#getElement(elmt.element);
            if (target) {
                target.addEventListener(elmt.event, elmt.func)
            }
        });
    }


    /**
     * Private method.
     * Returns a passed HTML element / Document or determines the element by it's id.
     * @param {HTMLElement | string} elmt HTML element, Document object or a string that represents the element id.
     * @returns {object | null} HTML element or null.
     */
    #getElement(elmt) {
        if (elmt instanceof HTMLElement || elmt instanceof Document) return elmt;
        if (typeof elmt == 'string') return document.getElementById(elmt);
        return null;
    }

    #defineClassProperties(props) {
        props.forEach(property => {
            // assign a key-value-pair to set defaults!
            if (typeof property == 'object') {
                const propName = Object.keys(property)[0];
                Object.defineProperty(this, propName, {
                    value: property[propName], 
                    writable: true,
                });
            } else { // property given only as text
                Object.defineProperty(this, property, {
                    value: '', 
                    writable: true,
                    // get property() {return this.value;},
                    // set property (newVal) {
                    //     this.value = newVal;
                    // },
                    // enumerable: true, // depending on your needs
                    // configurable: true // depending on your needs
                });                
            }
        });
    }
    
    /**
     * Helper function to set one ore more attributes to a single element.
     * @param {HTMLElement} element Element the attributes to be set on.
     * @param {object} attributes Object of attributes and values: {id: 'divID', class: 'active'} etc.
     */
    setAttributes(element, attributes) {
        Object.keys(attributes).forEach(attr => {
            element.setAttribute(attr, attributes[attr]);
        });
    }
}

class Address extends FormHandler {
    get fullname() { 
        const name = this.surname + ', ' + this.firstname;
        return name == ', ' ? '' : name;
    }
    constructor(form) {
        super(form, CLASS_PROPERTIES.address);
    }
}

class Employee extends Address {
    employedAs = '';
    dateOfEntry = new Date();
    get hashKey() {
        const str = this.surname + this.firstname + this.mail + this.birthday;
        return str;
    }

    constructor() {
        super();
    }
}

export { Address, Employee };
