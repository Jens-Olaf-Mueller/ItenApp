export default class Worktime {
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

    from = '07:00';
    until = '17:00';
    breakfast = 30;
    lunch = 60;

    constructor(displayAt) {
        this.outputElement = displayAt;
    }

    hours(from = this.from, until = this.until, breakfast = this.breakfast, lunch = this.lunch) {
        const start = from.split(':').map(Number),
              end = until.split(':').map(Number),
              dtFrom = new Date(2020, 0, 1, start[0], start[1]), 
              dtUntil = new Date(2020, 0, 1, end[0], end[1]);
        return ((dtUntil.getTime() - dtFrom.getTime()) / 1000 / 60 - breakfast - lunch) / 60;
    }
}