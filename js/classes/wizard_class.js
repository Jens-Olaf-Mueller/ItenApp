import $ from '../library.js';
import { FormHandler } from './library_class.js';

// indizes of wizard-buttons
export const ICON = {
    HOME: 0, PREV: 1, ADD: 2, CAM : 3, INFO: 4, SEND: 5, NEXT: 6
    // HOME: 0, PREV: -1, NEXT: 1, ADD: 'add', CAM : 'cam', INFO: 'info', SEND: 'send'
};

export default class Wizard extends FormHandler {
    get ID() { return 'divWizard' + this.name; }

    #page = 0;    
    get page() { return this.#page; }
    get lastPage() { return this.pages.length - 1; }   
    get pages() { 
        let pages = $(`[data-wizard="${this.name}"]:not([hidden])`)
        if (pages instanceof NodeList) {
            return Array.from(pages);
        } else { // we got only a single element and convert it to an array!
            let arrPages = [];
            arrPages.push(pages);
            return arrPages; 
        }
    }    
    #arrButtons = [];
    get buttons() { return this.#arrButtons; }
    set buttons(arr) { this.#arrButtons = arr; }

    #btnInfo = false
    get showInfoButton() { return this.#btnInfo; }
    set showInfoButton(state) {
        this.#btnInfo = state;
        this.#updateButtons();
    }
    #btnCam = false;
    get showCamButton() { return this.#btnCam; }  
    set showCamButton(state) {
        this.#btnCam = state;
        this.#updateButtons();
    }   
    #btnAdd = false;
    get showAddButton() { return this.#btnAdd; }
    set showAddButton(state) {
        this.#btnAdd = state;
        this.#updateButtons();
    }

    #btnSubmit = 'last'; // 'last' | 'always'
    get showSubmitButton() { return this.#btnSubmit; }
    set showSubmitButton(state) {
        this.#btnSubmit = state;
        this.#updateButtons();
    }

    caption = '';
    name; // wizard="commission"
    title;
    action = 'send'; // save   

    constructor(form, name) {
        super(form)
        this.name = name ? name : '';
    }

    remove() {
        this.form.removeChild($(this.ID));
    }   

    add(titleElement, caption = '') {
        this.title = titleElement;
        this.caption = caption;
        this.updateCaption();        
        this.#renderButtons();
        // now we add the event-listeners!
        this.buttons = Array.from($('img[data-wizard-button]'));
        this.buttons.forEach(btn => 
            btn.addEventListener ('click', event => this.#handleButtonEvent(event, this))
        );
        this.#updateButtons(); // and display them depending on their visible-state
    }

    #handleButtonEvent(event, $this) {
        if (event.target.hasAttribute('disabled')) return;
        const step = parseInt(event.target.alt);     
        $this.#updateButtons();
        // raise custom event:
        // TODO Renew the dispatching of events...
        if (step == ICON.SEND) document.dispatchEvent(new CustomEvent('onwizard', {
            detail: {
                action: this.action, 
                source: this
            }}
        ));
        if (step == ICON.ADD) document.dispatchEvent(new CustomEvent('onwizard', {
            detail: {
                action: 'add', 
                source: this
            }}
        ));
        if (step > 1) return;
        $this.updatePage(step);
    }

    
    updatePage(step) {
        const buttons = this.buttons;
        this.#page += step;      
        // const start = (this.#page < 1 || step == 0);
        if (this.#page < 1 || step == 0) this.#page = 0;
        if (this.#page > this.lastPage) this.#page = this.lastPage;
        this.pages.forEach(pge => pge.classList.add('hidden'));
        this.pages[this.#page].classList.remove('hidden');
        this.updateCaption();
        this.#updateButtons();
    }

    updateCaption() {
        this.title.innerHTML = this.caption + ' ' + (this.#page + 1) + '/' + (this.lastPage + 1);
    }

    
    // HOME: 0, PREV: 1, ADD: 2, CAM : 3, INFO: 4, SEND: 5, NEXT: 6
    #updateButtons() {
        const buttons = this.buttons,
              start = (this.#page == 0),
              isLastPage = (this.#page == this.lastPage);
        if (buttons && buttons.length > 0) {
            buttons[ICON.HOME].toggleAttribute('disabled', start);
            buttons[ICON.PREV].toggleAttribute('disabled', start);
            buttons[ICON.NEXT].toggleAttribute('disabled', isLastPage);
            buttons[ICON.NEXT].toggleAttribute('hidden', isLastPage);

            const onPage = (this.#page === this.showAddButton);
            // buttons[ICON.ADD].toggleAttribute('disabled', !isLastPage);
            // buttons[ICON.ADD].toggleAttribute('hidden', !this.showAddButton); 
            buttons[ICON.ADD].toggleAttribute('hidden', !onPage); 

            buttons[ICON.INFO].toggleAttribute('hidden', !this.showInfoButton);
            buttons[ICON.CAM].toggleAttribute('hidden', !this.showCamButton);
            buttons[ICON.SEND].toggleAttribute('hidden', this.showSubmitButton == 'last' && !isLastPage);
        }
    }

    submitForm(redirect = 'index.html') {
        if (this.form) {
            this.form.submit(); // Submit the form. Preferably do server side validation!
            // Simulate HTTP redirect and avoid back button issues.
            // this is better than: window.location.href("destination.html");
            if (redirect && (typeof redirect == 'string')) {
                window.location.replace(redirect);
            }
        }
    }


    // ICON... HOME: 0, PREV: -1, NEXT: 1, ADD: 'add', CAM : 'cam', INFO: 'info', SEND: 'send'
    #renderButtons() {
        this.form.innerHTML += `
        <div id="${this.ID}" class="wizard-bar">
            <div>
                <img class="wizard-button" data-wizard-button="${ICON.HOME}" src="./img/first.png" alt="${ICON.HOME}" disabled>
                <img class="wizard-button" data-wizard-button="${ICON.PREV}" src="./img/previous.png" alt="-1" disabled>
            </div>      
            <img class="wizard-button" data-wizard-button="${ICON.ADD}" src="./img/add.png" alt="${ICON.ADD}" disabled hidden>    
            <img class="wizard-button" data-wizard-button="${ICON.CAM}" src="./img/camera.png" alt="${ICON.CAM}" hidden>
            <img class="wizard-button" data-wizard-button="${ICON.INFO}" src="./img/info.png" alt="${ICON.INFO}" hidden>
            <div>
                <img class="wizard-button" data-wizard-button="${ICON.SEND}" src="./img/${this.action}.png" alt="${ICON.SEND}">
                <img class="wizard-button" data-wizard-button="${ICON.NEXT}" src="./img/next.png" alt="1">
            </div>          
        </div>`;
    }
}