class Settings {
    setupDone = false;
    get properties() { return Object.keys(this) }
    #form = null;
    get form() { return this.#form }
    set form(frm) { 
        if (typeof frm == 'string') {
            this.#form = document.getElementById(frm);
        } else if (typeof frm == 'object') {
            this.#form = frm;
        } else {
            this.#form = null;
        }
    }
    #lsKey = APP_NAME;
    get key() { return this.#lsKey }
    set key(value) { this.#lsKey = value }
    language = 0;
    surname = '';
    firstname = '';
    get fullname() { 
        let name = this.surname + ', ' + this.firstname;
        return name == ', ' ? '' : name;
    }
    location = '';
    birthday = null; // yyyy-mm-dd
    email = '';
    copyPreviousDay = true;
    showDriveBox = false;
    showSiteID = false;
    maxSitesPerDay = 4;
    sitesActiveFor = 3; // sites inactivated after xx months
    validateHours = true;
    alertHours = 12;
    summerTime = true;
    workFrom = '07:00';
    workUntil = '17:00';
    breakfast = 30;
    lunch = 60;
    defaultlength = 600;
    defaultwidth = 300;
    saturday = false;
    weekdays = [8.5, 8.5, 8.5, 8.5, 7, 0]; // worktime for monday, tuesday, wednesday... etc.
    get weeklyHours() {
        let hrs = 0;
        for (let i = 0; i < this.weekdays.length; i++) { hrs += +this.weekdays[i]; }
        return hrs;
    }


    constructor(key, form) {
        if (key) this.key = key;
        this.form = form;
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
        }
    }

    save(key = this.key) {
        this.setupDone = this.#validateInputs();
        let pbBag = this.#applyChanges(); 
        pbBag.key = key;
        localStorage.setItem(key, JSON.stringify(pbBag));
        if (this.form) this.form.submit();
    }

    #validateInputs() {
        return true;
    }

    #applyChanges() {
        let entries = this.#readFormData();
        for (const prop of this.properties) {  
            const value = entries[prop];          
            if (value != undefined) {       
                this[prop] = (value === 'on') ? true : value;
            } 
        }
        return {...this}; // create a property object!
    }

    // https://stackabuse.com/convert-form-data-to-javascript-object/
    #readFormData(form = this.form) {
        const frmData = new FormData(form),
              objFormData = Object.fromEntries(frmData.entries());
        objFormData.weekdays = frmData.getAll('weekdays');
        // handling the radio buttons separately!!! it sucks! :-(
        objFormData.summerTime = Array.from($('[name="summerTime"]')).map(elm => {
            return elm.checked;
        });
        // handling all named checkboxes to get also UNchecked boxes!
        Array.from($('[type="checkbox"][name]')).map(box => {
            objFormData[box.name] = box.checked;
        });
        return objFormData;
    }

    #assignProperties(settings = DEFAULT_SETTINGS) {
        settings.forEach(setting => {
            // assign the setting to the class property
            for (const key in setting) {
                if (setting.hasOwnProperty(key)) this[key] = setting[key];
            }      
        });
        if (this.form) this.#displaySettings(settings);
    }

    // => https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_form_elements_nameditem
    #displaySettings(settings) {  
        const frmElements = this.form.elements;
        settings.forEach(setting => {
            for (const key in setting) {
                if (setting.hasOwnProperty(key)) {
                    const element = frmElements.namedItem(key), value = setting[key];
                    if (element) {
                        this.#assignValue(element, value);
                    } else {
                        this[key] = value; // assign the setting to the class itself!!!
                    }                    
                }
            }      
        });
        frmElements.namedItem('weeklyhours').value = this.weeklyHours.toFixed(2);
    }

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
    {surname: ''},
    {firstname: ''},
    {location: ''},
    {birthday: null},
    {email: ''},
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
    {defaultwidth: 300}    
];