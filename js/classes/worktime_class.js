export default class DayRecordset {
    #display = null;
    get outputElement() { return this.#display; }
    set outputElement(display) {
         if (typeof display == 'string') {
            this.#display = document.getElementById(display);
        } else if (display instanceof HTMLInputElement) {
            this.#display = display;
        } else {
            this.#display = null;
        }       
    }

    #date =new Date();
    get date() { return this.#date; }
    set date(newDate) { this.#date = newDate; }
    
    #from = '07:00';
    get from() { return this.#from; }
    set from(newVal) { this.#from = newVal; }

    #until = '17:00';
    get until() { return this.#until; }
    set until(newVal) { this.#until = newVal; }
    
    #breakfast = 30;
    get breakfast() { return this.#breakfast; }
    set breakfast(newVal) { this.#breakfast = newVal; }

    #lunch = 60;
    get lunch() { return this.#lunch; }
    set lunch(newVal) { this.#lunch = newVal; }
    
    set setRecord(newRecord) {

    }

    employeeName = '';

    constructor(displayAt) {
        this.outputElement = displayAt;
    }

    calculateHours(from = this.from, until = this.until, breakfast = this.breakfast, lunch = this.lunch) {
        const start = from.split(':').map(Number),
              end = until.split(':').map(Number),
              dtFrom = new Date(2020, 0, 1, start[0], start[1]), 
              dtUntil = new Date(2020, 0, 1, end[0], end[1]);
        return ((dtUntil.getTime() - dtFrom.getTime()) / 1000 / 60 - Number(breakfast) - Number(lunch)) / 60;
    }
}