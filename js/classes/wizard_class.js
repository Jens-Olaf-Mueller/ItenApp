import $ from '../library.js';
import { FormHandler } from './library_class.js';

// indizes of wizard-buttons
export const WIZ_ICONS = {
    HOME: 0, PREV: 1, CAM : 2, INFO: 3, NEXT: 4, SEND: 5
};

class Wizard extends FormHandler {
    #wizID = 'divWizardbar';
    get ID() { return this.#wizID; }

    #page = 0;    
    get page() { return this.#page; }
    get lastPage() { return this.pages.length - 1; }   
    get pages() { 
        let pages = $(`[data-wizard="${this.name}"]`)
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
        this.#setButtonState();
    }
    #btnCam = false;
    get showCamButton() { return this.#btnCam; }  
    set showCamButton(state) {
        this.#btnCam = state;
        this.#setButtonState();
    }   
    caption = '';
    action = 'send'; // save
    name; // wizard="commission"
    title;

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
        this.#updateCaption();        
        this.#renderButtons();
        // now we add the event-listeners!
        this.buttons = Array.from($('img[data-wizard-button]'));
        this.buttons.forEach(btn => {
            btn.addEventListener ('click', (event) => {
                this.#switchPage(event, this);
            });
        });
        this.#setButtonState(); // and display them depending on their visible-state
    }

    #switchPage(event, $this) {
        if (event.target.hasAttribute('disabled')) return;
        const step = parseInt(event.target.alt);     
        $this.#setButtonState();
        // raise custom event:
        if (step == WIZ_ICONS.SEND) document.dispatchEvent(new CustomEvent('onwizard', {
            detail: {
                action: this.action,
                source: this
            }}
        ));
        if (step > 1) return;
        $this.#updatePage(step);
        $this.#displayWizardPage($this.#page)
    }

    #displayWizardPage(page) {
        this.pages.forEach(pge => {
            pge.classList.add('hidden');
        });
        this.pages[page].classList.remove('hidden');
        this.#updateCaption();
    }

    #setButtonState() {
        const buttons = this.buttons;
        if (buttons && buttons.length > 0) {
            buttons[WIZ_ICONS.SEND].classList.add('hidden');  
            buttons[WIZ_ICONS.NEXT].classList.remove('hidden');   
            if (this.showInfoButton) {
                buttons[WIZ_ICONS.INFO].classList.remove('hidden');
            } else {
                buttons[WIZ_ICONS.INFO].classList.add('hidden');
            }
            if (this.showCamButton) {
                buttons[WIZ_ICONS.CAM].classList.remove('hidden');
            } else {
                buttons[WIZ_ICONS.CAM].classList.add('hidden');
            }
        }
    }

    // WIZ_ICONS.HOME = 0, WIZ_ICONS.PREV = 1, CAM  = 2, INFO = 3, WIZ_ICONS.NEXT = 4, WIZ_ICONS.SEND = 5
    #updatePage(step) {
        const buttons = this.buttons;
        this.#page += step;      
        if (this.#page > this.lastPage) this.#page = this.lastPage;        
        if (this.#page < 1 || step == 0) {
            this.#page = 0;
            buttons[WIZ_ICONS.HOME].setAttribute('disabled', '');
            buttons[WIZ_ICONS.PREV].setAttribute('disabled', '');
        } else {
            buttons[WIZ_ICONS.HOME].removeAttribute('disabled');
            buttons[WIZ_ICONS.PREV].removeAttribute('disabled');
        }
        if (this.#page == this.lastPage) {            
            buttons[WIZ_ICONS.NEXT].classList.add('hidden');
            buttons[WIZ_ICONS.SEND].classList.remove('hidden');
        }
    }

    #updateCaption() {
        this.title.innerHTML = this.caption + ' ' + (this.#page + 1) + '/' + (this.lastPage + 1);
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

    // WIZ_ICONS.HOME = 0, WIZ_ICONS.PREV = 1, CAM  = 2, INFO = 3, WIZ_ICONS.NEXT = 4, WIZ_ICONS.SEND = 5
    #renderButtons() {
        this.form.innerHTML += `
        <div id="${this.ID}" class="wizard-bar">
            <div>
                <img class="wizard-button" data-wizard-button src="./img/first.png" alt="${WIZ_ICONS.HOME}" disabled>
                <img class="wizard-button" data-wizard-button src="./img/previous.png" alt="-1" disabled>
            </div>      
            <img class="wizard-button" data-wizard-button src="./img/camera.png" alt="${WIZ_ICONS.CAM}">    
            <img class="wizard-button" data-wizard-button src="./img/info.png" alt="${WIZ_ICONS.INFO}">
            <img class="wizard-button" data-wizard-button src="./img/next.png" alt="1">
            <img class="wizard-button hidden" data-wizard-button src="./img/${this.action}.png" alt="${WIZ_ICONS.SEND}">
        </div>`;
    }
}

export { Wizard };