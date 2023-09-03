import $ from '../library.js';

export default class Wizard {
    get ID() { return 'divWizard' + this.name.charAt(0).toUpperCase() + this.name.slice(1); }
    get form() { return this.parent.form || null; }

    get lastPage() { return this.pages.length - 1; }   
    get pages() { 
        let pages = $(`[data-wizard="${this.name}"]:not([hidden])`);
        if (pages instanceof NodeList) {
            return Array.from(pages);
        } else { // we got only a single element and convert it to an array!
            let arrPages = [];
            arrPages.push(pages);
            return arrPages; 
        }
    }    

    // #buttonsVisible = 2**0 + 2**1 + 2**2 + 2**11; // = 1027
    #buttonsVisible = 0;
    get buttonsVisible() { return this.#buttonsVisible; }
    set buttonsVisible(buttons) {
        if (typeof buttons == 'string') {
            this.#buttonsVisible = 0;
            for (let i = 0; i < WIZ_BUTTONS.length; i++) {
                if (buttons.includes(WIZ_BUTTONS[i].type)) {
                    this.#buttonsVisible = this.#buttonsVisible | 2**i;
                }
            }            
        } else if (typeof buttons == 'number') {
            this.#buttonsVisible = buttons;
        }
        this.#renderWizard();
        this.#updateButtons();
    }


    // #btnInfo = false
    // get showInfoButton() { return this.#btnInfo; }
    // set showInfoButton(state) {
    //     this.#btnInfo = state;
    //     this.#updateButtons();
    // }
    // #btnCam = false;
    // get showCamButton() { return this.#btnCam; }  
    // set showCamButton(state) {
    //     this.#btnCam = state;
    //     this.#updateButtons();
    // }   
    // #btnAdd = false;
    // get showAddButton() { return this.#btnAdd; }
    // set showAddButton(state) {
    //     this.#btnAdd = state;
    //     this.#updateButtons();
    // }

    // #btnSubmit = 'last'; // 'last' | 'always'
    // get showSubmitButton() { return this.#btnSubmit; }
    // set showSubmitButton(state) {
    //     this.#btnSubmit = state;
    //     this.#updateButtons();
    // }

    #caption = '';
    get caption() { return this.#caption; }
    set caption(text) {
        this.#caption = text;
        this.updateCaption(text);
    }

    page = 0;
    buttons = [];
    title = $('h3Title') || null;
    parent = null; 
    name;


    constructor(parent, name) {
        this.parent = parent;
        this.name = name ? name : '';
        this.buttonsVisible = 'home|prev|next|send'; // set default buttons!
        this.#createButtons();
    }

    // remove() {
    //     this.parent.form.removeChild($(this.ID));
    // }   

    showButton(button, page = 'all') {        
        let changed = false;
        for (let i = 0; i < this.buttons.length; i++) {
            const oBtn = this.buttons[i];
            if (Object.keys(oBtn)[0] == button) {
                const btn = oBtn[button];
                if (page) {
                    btn.page = page == 'all' ? null : page;
                    btn.visible = true;
                    this.buttonsVisible = (this.buttonsVisible | btn.key);                  
                } else if (page === false) {
                    btn.page = null;
                    btn.visible = false;
                    this.buttonsVisible = (this.buttonsVisible - btn.key);
                }
                changed = true;
            }
        } 
        if (changed) this.#updateButtons();
    }
    
    #createButtons() {        
        for (let i = 0; i < WIZ_BUTTONS.length; i++) {
            const btn = WIZ_BUTTONS[i];
            const button = new WizardButton(btn.type, i);
            button.page = btn.page;   
            const oBtn = {};
            oBtn[btn.type] = button;
            this.buttons.push(oBtn);
        }
        this.#renderWizard();
        this.#updateButtons();
    }

    #raiseButtonEvent(event, $this) {
        if (event.target.hasAttribute('disabled')) return;
        const action = event.target.alt,
              step = parseInt(action); 
        document.dispatchEvent(new CustomEvent('onwizard', {
            detail: {
                action: action, 
                source: this,
                parent: this.parent,
                form: this.form
            }}
        ));
    }

    
    switchPage(step) {
        this.page += step;
        if (this.page < 1 || step == 0) this.page = 0;
        if (this.page > this.lastPage) this.page = this.lastPage;        
        this.pages.forEach(pge => pge.classList.add('hidden'));
        this.pages[this.page].classList.remove('hidden');
        this.updateCaption();
        this.#updateButtons();
    }


    updateCaption(text = this.#caption) {
        if (this.title) {      
            this.title.innerHTML = (this.pages.length == 1) ? text : text + ' ' + (this.page + 1) + '/' + (this.lastPage + 1);      
        }
    }

    
    #updateButtons() {
        const isFirstPage = (this.page == 0),
              isLastPage = (this.page == this.lastPage);
        for (let i = 0; i < this.buttons.length; i++) {
            const oButton = this.buttons[i], 
                  key = Object.keys(oButton)[0],
                  btn = oButton[key],
                  visible = Boolean(this.buttonsVisible & btn.key),
                  pageValid = (btn.page == this.page || btn.page == null || (btn.page == 'last' && isLastPage)),
                  icon = $(oButton[key].id);
            if (icon) {
                btn.visible = (visible && pageValid);
                icon.hidden = !btn.visible || 
                               btn.action == 'send' && !isLastPage ||
                               btn.action == 1 && isLastPage;
                icon.toggleAttribute('disabled', (isFirstPage && (btn.type == 'home' || btn.type == 'prev')));
            }          
        }
    }


    submitForm(redirect = 'index.html') {
        if (this.parent.form) {
            this.parent.form.submit(); // Submit the form. Preferably do server side validation!
            // Simulate HTTP redirect and avoid back button issues.
            // this is better than: window.location.href("destination.html");
            if (redirect && (typeof redirect == 'string')) {
                window.location.replace(redirect);
            }
        }
    }


    #renderWizard() {
        const wizard = $(this.ID);
        if (wizard) {
            wizard.innerHTML = `
                <div id="${this.ID}Left">
                </div> <div id="${this.ID}Center">
                </div> <div id="${this.ID}Right"></div>`;
        } else if (this.parent.form) {
            this.parent.form.innerHTML += `
                <div id="${this.ID}" class="wizard-bar">
                    <div id="${this.ID}Left"></div> <div id="${this.ID}Center"></div> <div id="${this.ID}Right"></div>
                </div>`;
        } else {
            return;
        }
        this.#renderWizardButtons();
    }

    #renderWizardButtons() {
        const left = $(this.ID + 'Left'), 
              center = $(this.ID + 'Center'), 
              right = $(this.ID + 'Right');
        for (let i = 0; i < this.buttons.length; i++) {
            const oButton = this.buttons[i], key = Object.keys(oButton)[0];
            const btn = oButton[key];
            if ('home|prev|refresh'.includes(btn.type)) {
                left.innerHTML += btn.html;
            } else if ('next|save|send'.includes(btn.type)) {
                right.innerHTML += btn.html;
            } else {
                center.innerHTML += btn.html;
            }
        }
        this.#addButtonEvents();
    }


    // now we add the event-listeners!
    #addButtonEvents() {        
        for (let i = 0; i < this.buttons.length; i++) {
            const oButton = this.buttons[i], key = Object.keys(oButton)[0],
                    icon = $(oButton[key].id);
            if (icon) {
                icon.addEventListener ('click', event => this.#raiseButtonEvent(event, this))
            }
        }
    }
}

class WizardButton {
    type;
    visible = false;
    icon = '';
    html = '';
    id = '';
    key = 0;
    page = null;
    #action = null;
    get action() { return this.#action; }
    set action(value) { this.#initButton(value); }

    constructor(type, key) {
        this.type = type || null;
        if (key != undefined) this.key = Math.pow(2, key);
        this.id = 'img' + type.charAt(0).toUpperCase() + type.slice(1);
        this.icon = './img/' + type + '.png';
        this.#initButton(type);
    }


    #initButton(type) {
        const typeL = type.toLowerCase();
        switch (typeL) {
            case 'home':
                this.#action = 0;
                break;
            case 'prev':
                this.#action = -1;
                break;
            case 'next':
                this.#action = 1;
                break;
            default:
                this.#action = typeL;
                break;
        }
        this.html = `<img id="${this.id}" class="wizard-button" data-wizard-button="${typeL}" src="./img/${typeL}.png" alt="${this.#action}">`;
    }
}

const WIZ_BUTTONS = [
    {type: 'home', page: null},
    {type: 'prev', page: null},    
    {type: 'add', page: null},
    {type: 'minus', page: null},
    {type: 'delete', page: null},
    {type: 'cam', page: null},
    {type: 'info', page: null},
    {type: 'help', page: null},
    {type: 'print', page: null},
    {type: 'save', page: 'last'},
    {type: 'send', page: 'last'},
    {type: 'next', page: null},
    {type: 'refresh', page: null}   
];