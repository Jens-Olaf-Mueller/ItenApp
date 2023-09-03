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

export default class Library {
    #cssSheet = null;
    #parentElement = null;
    #visible = true;
    #styleSheetChanged = false;


    /**
     * Flag that indicates whether a new stylesheet was assigned or not.
     */
    get styleSheetChanged() { return this.#styleSheetChanged; }
    set styleSheetChanged(flag) {
        // if (typeof flag == 'boolean') this.#styleSheetChanged = flag;
        this.#styleSheetChanged = (typeof flag == 'boolean') ? flag : false;
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

export { CLASS_PROPERTIES };