const OVERLAY_ID = 'msg-BoxOverlay',
      Z_INDEX_TOP = 2147483647,
      BTN_ID = 'msg-btn-';

export default class MessageBox {
    #prompt;
    get prompt() { return this.#prompt };
    set prompt(text) {
        this.#prompt = (text == null) ? '' : text;
    }
    #title;
    get title() { return this.#title };
    set title(text) {         
        if (text == null || text.trim() == '') {
            this.#title = document.getElementsByTagName('title')[0].innerHTML;
        } else {
            this.#title = text;
        }
    }
    modal = true;       // box is per default ALWAYS modal!
    gradient = true;
    #gradientFrom ='000A6D';
    get gradientColorFrom() { return this.#gradientFrom; } 
    set gradientColorFrom(value) { 
        this.#gradientFrom = value;
        this.#setCSSVar('msg-gradient-color-from', value);
    }
    #gradientTo = 'whitesmoke';
    get gradientColorTo() { return this.#gradientTo; }
    set gradientColorTo(value) {
        this.#gradientTo = value;
        this.#setCSSVar('msg-gradient-color-to', value);
    }
    #backGround = 'whitesmoke';
    get backGroundColor() { return this.#backGround; }
    set backGroundColor(value) {
        this.#backGround = value;
        this.#setCSSVar('msg-background-color', value);
    }

    #btnColor ='buttonface';
    get buttonColor() { return this.#btnColor; } 
    set buttonColor(value) {
        this.#btnColor = value;
        this.#setCSSVar('msg-button-color', value);
    }

    #borderRadius = 8;
    get borderRadius() { return this.#borderRadius; } 
    set borderRadius(value) {
        if (value.substr(-2) != 'px') debugger
        this.#borderRadius = value;
        this.#setCSSVar('msg-border-radius', value);        
    }
    titleColor = 'whitesmoke';
    textColor = 'black';
    

    get cssClassOverlay() {
        return this.modal ? 'msg-overlay msg-modal' : 'msg-overlay';
    }
    #overlayBG = '#00000040';
    get overlayBackground() { return this.modal ? this.#overlayBG : 'transparent'; }
    set overlayBackground(color) { this.#overlayBG = color; }

    // parses the submitted buttons
    // could be a simple string, separetd by comma or an array or ''
    #arrButtons = ['Ok'];
    get buttons() { return this.#arrButtons; }
    set buttons(buttons) {        
        if (buttons == null) {
            this. #arrButtons = ['Ok'];
        } else if (Array.isArray(buttons)) {
            this.#arrButtons = buttons;
        } else {
            if (buttons.trim().length == 0) buttons = 'Ok';
            // eliminate white spaces!
            this.#arrButtons = buttons.split(',').map(btn => btn.trim());               
        }
    }

    #cssSheet = null;
    get styleSheet() { return this.#cssSheet; }
    set styleSheet(href) {
        if (href == null) return;
        // avoid duplicates
        for(let i = 0; i < document.styleSheets.length; i++){
            if (document.styleSheets[i].href == href) return;
        }
        this.#cssSheet = href;
        const link  = document.createElement('link');
        this.#setAttributes(link, {
            rel: 'stylesheet',
            type: 'text/css',
            href: href
        });
        document.head.appendChild(link);
    }

    constructor(styleSheet) {
        this.styleSheet = styleSheet;
    }

    async show(prompt, title, buttons, modal, gradient) {
        this.#setParams(prompt, title, buttons, modal, gradient);
        this.#createOverlay();
        this.#renderBox();
        const modular = this.modal;
        // now we create a promise with an event listener
        return new Promise(function(resolve, reject) {
            document.body.addEventListener('click', function btnHandler(event) {
                const clickedOn = event.target.id;
                if (clickedOn.startsWith(BTN_ID)) {                
                    resolve(document.getElementById(clickedOn).innerHTML);
                    document.body.removeEventListener('click', btnHandler);
                    document.getElementById(OVERLAY_ID).remove();
                } else if (event.target.id == OVERLAY_ID && !modular) {                
                    resolve('false');
                    document.body.removeEventListener('click', btnHandler);
                    document.getElementById(OVERLAY_ID).remove();
                }       
            });        
        });
    }

    // generates the actual box
    #renderBox() {
        // titlebar with gradient ?
        let dlgClass = this.gradient ? 'msg-titlebar msg-gradient' : 'msg-titlebar';
        // set a white caption when gradient exists!
        let captionStyle = this.gradient ? `style="color: whitesmoke !important"` : '';
        document.getElementById(OVERLAY_ID).innerHTML = `
        <div class="msg-dialog">
            <div class ="${dlgClass}">
                <h2 id="msgCaption" ${captionStyle}>${this.title}</h2>
            </div>
            <p class="msg-Prompt">${this.prompt}</p>
            ${this.#renderButtons()}
        </div>`;
    }

    /**
     * Renders the required buttons for the messagebox.
     * @returns HTML code of the buttons.
     */
    #renderButtons() {
        let btnCode = '';            
        for (let i = 0; i < this.buttons.length; i++) {
            btnCode += `<button id="${BTN_ID}${i}" class="msg-button">${this.buttons[i]}</button>`;
        }
        return btnCode;
    }

    // parse defaults...
    #setParams(prompt, title, buttons, modal, gradient) { 
        this.prompt = prompt;
        this.title = title;
        this.buttons = buttons;
        this.modal = (modal == null) ? true : modal;
        if (gradient) {
            if (typeof gradient == 'boolean') this.gradient = gradient;
        }
    }

    // creates the dialog wrapper
    #createOverlay() {
        const parentBox = document.createElement('div');
        this.#setAttributes(parentBox, {
            id: OVERLAY_ID,
            style: `z-index: ${Z_INDEX_TOP} !important; 
                    background-color: ${this.overlayBackground};
                    position: fixed;
                    inset: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;`,
            class: this.cssClassOverlay});
        document.body.appendChild(parentBox);
    }

    /**
     * Assigns a list of attributes in the given object as key-value pairs to the element.
     * @param {object} element HTML-element to assign the attributes
     * @param {object} objAttributes 
     * @usage  setAttributes (element, {id: "myDivId", height: "100%", ...})
     */
    #setAttributes(element, objAttributes) {
        for(const key in objAttributes) {
          element.setAttribute(key, objAttributes[key]);
        }
    }

    // Set the value of css variables to another value
    #setCSSVar(varName, value) {
        document.querySelector(':root').style.setProperty(`--${varName}`, value);
    }
}