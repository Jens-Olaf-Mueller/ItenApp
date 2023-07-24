import {APP_NAME} from '../const.js';
import $ from '../library.js';
import {FormHandler, Address, CLASS_PROPERTIES} from './library_class.js';

class Settings extends FormHandler {
    #lsKey = null;
    get key() { return this.#lsKey }
    set key(value = APP_NAME) { this.#lsKey = value }

    get weeklyHours() {
        let hrs = 0;
        for (let i = 0; i < this.weekdays.length; i++) { hrs += +this.weekdays[i]; }
        return hrs;
    }

    constructor(key, form) {
        super(form, CLASS_PROPERTIES.settings);
        this.key = key;
        this.user = new Address();
        this.load();
    }

    load(key) {
        if (key === undefined) key = this.key;
        const ls = localStorage.getItem(key), settings = [];
        let jsonSettings = ls ? JSON.parse(ls) : null;
        // convert json-file into a settings-object
        if (jsonSettings) {
            for (const [key, value] of Object.entries(jsonSettings)) { 
                let obj = {};
                obj[key] = value;
                settings.push(obj); 
            } 
            this.#assignProperties(settings);
        } else {
            console.warn('Settings could not be loaded! Using default settings...');
            this.#assignProperties(DEFAULT_SETTINGS);
            // this.#assignProperties(CLASS_PROPERTIES.settings);
        }
    }

    save(key = this.key) {
        this.setupDone = this.validate();
        let pbBag = this.#applyChanges();         
        pbBag.key = key;
        localStorage.setItem(key, JSON.stringify(pbBag));
        if (this.form) this.form.submit();
    }

    #applyChanges() {
        let entries = this.#readFormData();
        const objPb = {}; // create a property object!    
        this.properties.forEach(prop => {
            const value = entries[prop];
            if (value !== undefined) {
                objPb[prop] = (value === 'on') ? true : value;
            }        
        })
        return objPb;
    }

    // https://stackabuse.com/convert-form-data-to-javascript-object/
    #readFormData(form = this.form) {
        const frmData = new FormData(form),
              frmEntries = Object.fromEntries(frmData.entries());
            //   console.log(frmEntries)
            //   debugger

        frmEntries.weekdays = frmData.getAll('weekdays');
        // handling the radio buttons separately!!! it sucks! :-(
        frmEntries.summerTime = Array.from($('[name="summerTime"]')).map(elm => {
            return elm.checked;
        });
        // handling all named checkboxes to get also UNchecked boxes!
        Array.from($('[type="checkbox"][name]')).map(box => {
            frmEntries[box.name] = box.checked;
        });
        // handling icons on the home screen must be last!!!
        frmEntries.homescreen = frmData.getAll('homescreen');
        return frmEntries;
    }


    /**
     * Private method.
     * Assigns the passed settings to the class.
     * If no settings are available (i.e. first start), default settings are used.
     * @param {object} settings settings to be assigned to the class and form (if available)
     */
    #assignProperties(settings = DEFAULT_SETTINGS) {
        settings.forEach(setting => {
            // assign the setting to the class property...
            for (const key in setting) {
                if (setting.hasOwnProperty(key)) this[key] = setting[key];
            }      
        });
        // ...and if a form is connected we display the settings!
        if (this.form) this.#displaySettings(settings);
    }

    // => https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_form_elements_nameditem
    #displaySettings(settings) {  
        const frmElements = this.form.elements;
        settings.forEach(setting => {
            for (const key in setting) {
                if (setting.hasOwnProperty(key)) {
                    const element = frmElements.namedItem(key), value = setting[key];
                    if (element instanceof RadioNodeList && element[0].type == 'radio') {
                        // iterating over the radio group.
                        // if the values match, we check the element
                        [...element].forEach(function(radio) {
                            if (radio.value == value) radio.checked = true;
                        });
                    } else if (element) {
                        this.#assignValue(element, value);
                    } else {
                        this[key] = value; // assign the setting to the class itself!!!
                    }                    
                }
            }      
        });
        frmElements.namedItem('weeklyhours').value = this.weeklyHours.toFixed(2);
    }

    /**
     * Assigns a value to the given control.
     * If 'control' is a NodeList, the method calls itself recursively.
     * @param {object | NodeList} control form control (input, checkbox, etc.) or a list of form controls
     * @param {any} value value to be assigned to the control.
     */
    #assignValue(control, value) {
        if (control instanceof NodeList) {
            for (let i = 0; i < control.length; i++) {
                const ctr = control[i], val = value[i];
                this.#assignValue(ctr, val); // recursive call
            }
        } else if (control.type == 'checkbox' || control.type == 'radio') {
            control.checked = value;        
        } else {
            control.value = value == 0 ? '' : value;
        }
    }
}

export { Settings };

const DEFAULT_SETTINGS = [
    {surname: ''},
    {firstname: ''},
    {location: ''},
    {birthday: null},
    {email: ''},
    {employeetype: -1},
    {copyPreviousDay: true},
    {showDriveBox: false},
    {showSiteID: false},
    {maxSitesPerDay: 4},
    {sitesActiveFor: 3},
    {validateHours: true},
    {alertHours: '12.00'},
    {summerTime: [true, false]},
    {workFrom: '07:00'},
    {workUntil: '17:00'},
    {breakfast: 30},
    {lunch: 60},
    {weekdays: ['8.50', '8.50', '8.50', '8.50', '7.00', 0]},
    {saturday: false},
    {defaultlength: 600},
    {defaultwidth: 300},
    {homescreen: ['clock512.png|hours.html','tiles512.png|tools.html?material','calculator512.png|calculator.html']}   
];