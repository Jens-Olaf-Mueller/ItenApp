const CLASS_PROPERTIES = {
    // properties for address class:
    address: ['salutation','surname','firstname', {birthday: null},
              'street','streetNumber','zip','location','country',
              'mail','phone', 'mobile'],
    // properties for settings class:
    settings: ['user', {employeetype: -1}, {setupDone: false}, {language: 0}, {copyPreviousDay: true}, 
            {showDriveBox: false}, {showSiteID: false}, {maxSitesPerDay: 4}, {sitesActiveFor: 3},
            {validateHours: true}, {alertHours: 12}, 
            {weekdays: {
                summer: [
                    {from: '07:00', until: '17:00', breakfast: 30, lunch: 60},
                    {from: '07:00', until: '17:00', breakfast: 30, lunch: 60},
                    {from: '07:00', until: '17:00', breakfast: 30, lunch: 60},
                    {from: '07:00', until: '17:00', breakfast: 30, lunch: 60},
                    {from: '07:00', until: '16:00', breakfast: 30, lunch: 60}
                ],
                winter: [
                    {from: '07:30', until: '17:00', breakfast: 30, lunch: 60},
                    {from: '07:30', until: '17:00', breakfast: 30, lunch: 60},
                    {from: '07:30', until: '17:00', breakfast: 30, lunch: 60},
                    {from: '07:30', until: '17:00', breakfast: 30, lunch: 60},
                    {from: '07:30', until: '16:00', breakfast: 30, lunch: 60}
                ]}
            }, 
            {defaultlength: 600}, {defaultwidth: 300}, {offcut: 3}, {jointDepth: 10}, {jointWidth: 3},
            {homescreen: ['clock.png|hours.html|Stundenerfassung','tiles.png|tools.html?material|Materialrechner','calculator.png|calculator.html|Taschenrechner','settings.png|settings.html|Einstellungen']},
            {calculatorStyle: 'calculator_apple.css'}, {showCalculatorIcon: false}
            // evl. objects: {image: 'clock512.png', link: 'hours.html' }...
    ]
}

const ERR_TYPEMISMATCH = 'Wrong parameter type.'

class Library {
    #cssSheet = null;
    #parentElement = null;
    #visible = true;
    #styleSheetChanged = false;


    /**
     * Flag that indicates whether a new stylesheet was assigned or not.
     */
    get styleSheetChanged() { return this.#styleSheetChanged; }
    set styleSheetChanged(flag) {
        if (typeof flag == 'boolean') this.#styleSheetChanged = flag;
    }

    /**
     * Assigns a stylesheet from the passed path or returns it.
     * If no path is submitted, the value is null!
     */
    get stylesheet() { return this.#cssSheet; }
    set stylesheet(href) {
        if (href == null) return;      
        // avoid duplicates!
        if (this.#cssSheet) {
            const sheetName = this.#cssSheet.replace(/^.*[\\\/]/, ''),
                  oldSheet = document.querySelector(`link[href*="${sheetName}"]`),
                  defaultSheet = document.querySelector(`link[href*="msgbox"]`);
                //   debugger
            if (oldSheet) oldSheet.remove();
            if (defaultSheet) defaultSheet.remove();
        }
        const filename = href.replace(/^.*[\\\/]/, ''); // avoid duplicates!
        for (let i = 0; i < document.styleSheets.length; i++) {
            // console.log('Sheet '+ Number(i+1), document.styleSheets[i])
            const href = document.styleSheets[i].href;
            if (href && href.includes(filename)) return;
        }
        this.#cssSheet = href;
        const link  = document.createElement('link');
        this.setAttributes(link, {
            rel: 'stylesheet',
            type: 'text/css',
            href: href
        });
        document.head.appendChild(link);
        this.styleSheetChanged = true;
    }


    /**
     * Assigns a parent element or returns it.
     * The new parameter may be a string, representing the id of the HTML-element,
     * or the element itself.
     */
    get parent() { return this.#parentElement; }
    set parent(newElement) {
        const element = this.getElement(newElement);
        if (element instanceof HTMLElement) this.#parentElement = element;
    }

    /**
     * The property returns the current time.
     */
    get now() { return new Date().getTime(); }

    /**
     * Sets or returns the visibility of the child class.<br>
     * Child classes must have a .show() and .hide() method!
     * The property has the same effect like the show() method (true) 
     * or like the hide() method (false).
     */
    get visible() { return this.#visible; }
    set visible(value) {
        if (typeof value == 'boolean') {
            this.#visible = value;
            if (value) {
                try {
                    this.show();
                } catch (error) {
                    throw 'Missing show() method.'
                }                
            } else {
                try {
                    this.hide();
                } catch (error) {
                    throw 'Missing hide() method.'
                }                
            }
        }
    }


    /**
     * Creates a new Library, which is the parent of the following child classes: <br>
     * - Calculator <br>
     * - MessageBox <br>
     * - Timer <br>
     * - Table
     * @param {string?} styleSheet [Optional] Path to the stylesheet in order to style other components as favoured.
     */
    constructor(styleSheet) {
        this.stylesheet = styleSheet;
    }

    isClass(object) {
        if (object === undefined) return false;
        // const isConstructorClass = object.constructor && object.constructor.toString().substring(0, 5) === 'class';
        const isConstructorClass = object.constructor && object.constructor.toString().startsWith('class');
        if (object.prototype === undefined) return isConstructorClass;
        
        const objPC = object.prototype.constructor,
              isProtoClass = objPC && objPC.toString && objPC.toString().startsWith('class');
        return isConstructorClass || isProtoClass;
    }

    /**
     * PUBLIC helper function. <br>
     * 
     * Determines if the passed expression is a string-id or an HTML-element. 
     * If it is an HTML-element, the method returns this element.
     * If the parameter is a string, the method assumes that the parameter is
     * the id of the element we're looking for. In case the expression is from another type 
     * or the passed id does not exist, the method returns null.
     * @param {string | HTMLElement} expression The id of the wanted HTML-element, or the element itself
     * @returns {HTMLElement | null} The wanted HTML-element.
     */
    getElement(expression) {
        if (typeof expression == 'string') return document.getElementById(expression);
        if (expression instanceof HTMLElement) return expression;
        return null;
    }

    /**
     * PUBLIC helper function. <br>
     * 
     * Assigns a list of attributes as key-value pairs to the passed element.
     * @param {HTMLElement} element Element to assign the attributes to.
     * @param {object} attributes Object that contains key-value-pair(s) to be assigned to the passed element.
     * @usage  setAttributes (myDivContainer, { id: "myDivId", height: "100%", ...} )
     */
    setAttributes(element, attributes) {
        if (!element instanceof HTMLElement) return new Error(ERR_TYPEMISMATCH + 
            '{element} must be a valid HTML-element');
        if (typeof attributes !== 'object')  return new Error(ERR_TYPEMISMATCH + 
            '{attributes} must be an object, holding key-value pairs');
        for(const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
    }

    
    /**
     * Adds a new style property to the passed elements
     * @param {HTMLElement | HTMLElement[]} elements Array of HTML elements or single HTML element to be styled.
     * @param {string} style CSS-conform style property
     */
    cssAddStyle(elements, style) {
        if (elements instanceof Array) {
            elements.forEach(element => {
                element.style.cssText += style;
            });
        } else {
            elements.style.cssText += style;
        }
    }
}

class FormHandler {
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

    // TODO wenn Form zugewiesen wird, dann Properties aus Form der Klasse zuweisen!
    // Eventlisteners an Form-members zuweisen: 
    // {element: id | html-elmt, event: 'click', handler: fnc}
    constructor(form, properties) {
        this.form = form;
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

export { Library, FormHandler, Address, Employee, CLASS_PROPERTIES };
