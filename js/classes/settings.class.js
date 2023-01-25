class Settings {
    setupDone = false;
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
    surname = 'Müller';
    firstname = 'Olaf';
    location = 'Cham';
    // birthday = null;
    birthday = '1970-01-06'; // yyyy-mm-dd
    email = 'jens.olaf.mueller@gmail.com';
    usePrevDayData = true;
    showDriveBox = false;
    showSiteID = false;
    maxSitesPerDay = 4;
    sitesActiveFor = 3; // sites inactivated after xx months
    validateHours = true;
    alertHours = 12;
    summerTime = true;
    workTime = [{from: '07:30', until: '17:00'}, {from: '07:00', until: '17:00'}];
    breaks = {breakfast: 30, lunch: 60};
    // daily = {mon: 8.5, tue: 8.5, wed: 8.5, thur: 8.5, fri: 7, sat: 0};
    daily = [8.5, 8.5, 8.5, 8.5, 7, 0];
    get weeklyHours() {
        let hrs = 0;
        for (let i = 0; i < this.daily.length; i++) { hrs += this.daily[i]; }
        return hrs;
    }


    constructor(key, form) {
        if (key !== undefined) this.key = key;
        this.form = form;

        this.load();
        // if (this.setupDone) this.storeToForm();
    }

    load(key) {
        if (key === undefined) key = this.key;
        const ls = localStorage.getItem(key);
        let tmpSettings = ls ? JSON.parse(ls) : null;
        if (tmpSettings) {
            console.log(tmpSettings)
            this.displaySettings();
        } else {
            console.warn('Settings could not be loaded! Using default settings...');
            this.displaySettings();
        }
    }

    save(key = this.key) {
        // localStorage.setItem(key, JSON.stringify(gameSettings));
    }

    displaySettings() {
        if (this.form == null) return;
        const frmElements = Array.from(this.form.elements);
        frmElements.forEach(elm => {
            if (elm.id == 'inpSurname') elm.value = this.surname;
            if (elm.id == 'inpFirstName') elm.value = this.firstname;
            if (elm.id == 'inpMail') elm.value = this.email;
            if (elm.id == 'inpLocation') elm.value = this.location;
            if (elm.id == 'inpBirthday') elm.value = this.birthday;

            if (elm.id == 'chkUsePreviousDayData') elm.checked = this.usePrevDayData;
            if (elm.id == 'chkShowDriveBox') elm.checked = this.showDriveBox;            
            if (elm.id == 'chkShowSiteID') elm.checked = this.showSiteID;
            if (elm.id == 'inpMaxSitesPerDay') elm.value = this.maxSitesPerDay;
            if (elm.id == 'inpSitesActiveFor') elm.value = this.sitesActiveFor;
            if (elm.id == 'chkValidateHours') elm.checked = this.validateHours;
            if (elm.id == 'inpValidateHours') elm.value = this.alertHours;

            if (elm.id == 'radSummerTime') elm.checked = this.summerTime;
            if (elm.id == 'radWinterTime') elm.checked = !this.summerTime;
            if (elm.id == 'inpStartWork') elm.value = this.summerTime ? this.workTime[1].from : this.workTime[0].from;
            if (elm.id == 'inpEndWork') elm.value = this.summerTime ? this.workTime[1].until : this.workTime[0].until;
            if (elm.id == 'inpBreakfast') elm.value = this.breaks.breakfast;
            if (elm.id == 'inpLunch') elm.value = this.breaks.lunch;

            // if (elm.id == '') elm.value = this;
            // if (elm.id == '') elm.value = this;
            // if (elm.id == '') elm.value = this;
            // if (elm.id == '') elm.value = this;
            if (elm.id == 'inpHoursWeekly') elm.value = this.weeklyHours.toFixed(2);
        });        
    }
}