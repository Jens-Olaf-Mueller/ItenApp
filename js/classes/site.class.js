class Address {
    salutation = '';
    surname = '';
    firstname = '';
    street = '';
    streetNumber = '';
    zip = '';
    location = '';
    mail = '';
    phone = '';
    mobile = '';
    
    constructor() {
        //
    }
}

class Project {
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
    id = null;
    description = '';
    created;
    startDate;
    lastUpdate;
    status;
    client = new Address();
    supervisor = new Address();

    constructor(form) {
        this.form = form;
        this.created = new Date();
        this.lastUpdate = new Date();
    }
}