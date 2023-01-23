class Wizard {
    parentForm;
    title;
    location;
    #wizID = 'divWizardbar';
    get ID() { return this.#wizID; }
    #page = 0;    
    get page() { return this.#page; }
    get lastPage() { return this.pages.length - 1; }
    get pages() { return Array.from($('.wizard')); }    
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


    constructor(parentID, href) {
        if (typeof parentID == 'string') {
            this.parentForm = $(parentID);
        } else if (typeof parentID == 'object') {
            this.parentForm = parentID;
        }   
        this.location = href;
    }

    remove() {
        this.parentForm.removeChild($(this.ID));
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
        const buttons = $this.#arrButtons,
              step = parseInt(event.target.alt);     
        $this.#setButtonState();        
        if (step == SEND) $this.#submitForm();
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
            buttons[SEND].classList.add('hidden');  
            buttons[NEXT].classList.remove('hidden');   
            if (this.showInfoButton) {
                buttons[INFO].classList.remove('hidden');
            } else {
                buttons[INFO].classList.add('hidden');
            }
            if (this.showCamButton) {
                buttons[CAM].classList.remove('hidden');
            } else {
                buttons[CAM].classList.add('hidden');
            }
        }
    }

    // HOME = 0, PREV = 1, CAM  = 2, INFO = 3, NEXT = 4, SEND = 5
    #updatePage(step) {
        const buttons = this.buttons;
        this.#page += step;      
        if (this.#page > this.lastPage) this.#page = this.lastPage;        
        if (this.#page < 1 || step == 0) {
            this.#page = 0;
            buttons[HOME].setAttribute('disabled', '');
            buttons[PREV].setAttribute('disabled', '');
        } else {
            buttons[HOME].removeAttribute('disabled');
            buttons[PREV].removeAttribute('disabled');
        }
        if (this.#page == this.lastPage) {            
            buttons[NEXT].classList.add('hidden');
            buttons[SEND].classList.remove('hidden');
        }
    }

    #updateCaption() {
        this.title.innerHTML = this.caption + ' ' + (this.#page + 1) + '/' + (this.lastPage + 1);
    }

    #submitForm() {
        this.parentForm.submit(); // Submit the form. Preferably do server side validation!
        // Simulate HTTP redirect and avoid back button issues.
        // this is better than: window.location.href("destination.html"); 
         window.location.replace(this.location);
    }

    // HOME = 0, PREV = 1, CAM  = 2, INFO = 3, NEXT = 4, SEND = 5
    #renderButtons() {
        this.parentForm.innerHTML += `
        <div id="${this.ID}" class="wizard-bar">
            <div>
                <img class="icon-button" data-wizard-button src="./img/first512.png" alt="${HOME}" disabled>
                <img class="icon-button" data-wizard-button src="./img/previous512.png" alt="-1" disabled>
            </div>      
            <img class="icon-button" data-wizard-button src="./img/camera512.png" alt="${CAM}">    
            <img class="icon-button" data-wizard-button src="./img/info512.png" alt="${INFO}">
            <img class="icon-button" data-wizard-button src="./img/next512.png" alt="1">
            <img class="icon-button hidden" data-wizard-button src="./img/send512.png" alt="${SEND}">
        </div>`;
    }
}