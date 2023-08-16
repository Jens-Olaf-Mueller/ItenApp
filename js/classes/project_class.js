import { FormHandler, Address } from "./library_class.js";

export class Project extends FormHandler {
    #id = null;
    get id() { return this.#id; }    

    #createdAt = new Date();
    get created() { return this.#createdAt.toLocaleDateString("de-DE"); }
    set created(newDate) {
        if (newDate instanceof Date) {
            this.#createdAt = newDate;
        } else if (typeof newDate == 'string') {
            this.#createdAt = Date.parse(newDate);
        }
    }

    lastUpdate = new Date();
    startDate = null;
    status = null;
    address = new Address();
    client = new Address();
    supervisor = new Address();
    employees = [];
    description;
    comments;
    
    /**
     * Creates a new project class.
     * @param {HTMLFormElement} form The form assigned to the class in order to display datas.
     * @param {number} serial Serial number of the project.
     */
    constructor(form, serial) {
        super(form);

        if (serial < 2) {
            this.#id = '0000-00' + serial; // create default sites for store + office!
        } else {
            this.#id = new Date().getFullYear() + '-' + ('0000' + (serial + 1)).slice(-3);
        }
    }
}