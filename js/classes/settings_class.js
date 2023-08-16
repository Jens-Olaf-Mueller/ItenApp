import {APP_NAME} from '../const.js';
import { isDebugmode } from '../app.js';
import $ from '../library.js';
import {FormHandler, Address} from './library_class.js';

export default class Settings extends FormHandler {
    #lsKey = null;
    get key() { return this.#lsKey }
    set key(value = APP_NAME) { this.#lsKey = value }

    setupDone = false;

    constructor(key, form) {
        super(form, DEFAULT_SETTINGS);
        this.key = key;
        this.user = new Address();
        this.load();
    }

    load(key = this.key) {
        // if (key === undefined) key = this.key;
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
        }
    }

    save(key = this.key) {
        this.setupDone = this.validate();
        let pbBag = this.#applyChanges();
        pbBag.weekdays = this.weekdays;  
        pbBag.setupDone = this.validate();       
        pbBag.key = key;
        if (isDebugmode) console.log('Saving changes...', pbBag);
        localStorage.setItem(key, JSON.stringify(pbBag));
        if (this.form) this.form.submit();
    }

    reset(key = this.key) {
        localStorage.removeItem(key);
        this.#assignProperties(DEFAULT_SETTINGS);
    }


    calculateHours(from = '07:00', until = '17:00', breakfast = '30', lunch = '60') {
        const start = from.split(':').map(Number),
              end = until.split(':').map(Number),
              dtFrom = new Date(2020, 0, 1, start[0], start[1]), 
              dtUntil = new Date(2020, 0, 1, end[0], end[1]);
        return ((dtUntil.getTime() - dtFrom.getTime()) / 1000 / 60 - Number(breakfast) - Number(lunch)) / 60;
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
        // handling all named checkboxes to get also UNchecked boxes!
        Array.from($('[type="checkbox"][name]')).map(box => frmEntries[box.name] = box.checked);
        frmEntries.season = $('input[name="season"]:checked').value;
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
                        // iterating over the radio groups.
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

const DEFAULT_SETTINGS = [
    {language: 'german'},
    {user: null},
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
    {expenses: '18.00'},
    {season: 'summer'},
    {weekdays: {
        summer: [
            {from: '07:00', until: '17:00', breakfast: 30, lunch: 60},
            {from: '07:00', until: '17:00', breakfast: 30, lunch: 60},
            {from: '07:00', until: '17:00', breakfast: 30, lunch: 60},
            {from: '07:00', until: '17:00', breakfast: 30, lunch: 60},
            {from: '07:00', until: '16:00', breakfast: 30, lunch: 60},
            {from: '00:00', until: '00:00', breakfast: '', lunch: ''}
        ],
        winter: [
            {from: '07:30', until: '17:00', breakfast: 30, lunch: 60},
            {from: '07:30', until: '17:00', breakfast: 30, lunch: 60},
            {from: '07:30', until: '17:00', breakfast: 30, lunch: 60},
            {from: '07:30', until: '17:00', breakfast: 30, lunch: 60},
            {from: '07:30', until: '16:00', breakfast: 30, lunch: 60},
            {from: '00:00', until: '00:00', breakfast: '', lunch: ''}
        ]}
    },
    {defaultlength: 600},
    {defaultwidth: 300},
    {offcut: 3}, 
    {jointDepth: 10}, 
    {jointWidth: 3},
    {showCalculatorIcon: true},
    {calculatorStyle: 'calculator_apple.css'},
    {homescreen: [
        'clock.png|hours.html|Stundenerfassung',
        'tiles.png|tools.html?material|Materialrechner',
        'calculator.png|calculator.html|Taschenrechner',
        'settings.png|settings.html|Einstellungen'
    ]},   
    // evl. {homescreen: [{image: 'clock.png', link: 'hours.html', caption: 'Stundenerfassung'},...]
];