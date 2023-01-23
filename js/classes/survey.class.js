class Survey {
    form;
    type = 'Effectiv';
    component = '';     // Boden | Wand | Treppe
    site = '';
    siteLocation = '';  // Etage | Whg | Raum
    dateCreated;
    employee;

    constructor(form) {
        if (typeof form == 'string') {
            this.form = $(form);
        } else if (typeof form == 'object') {
            this.form = form;
        }
    }

    readUserInput() {
        const frmElements = Array.from(this.form.elements);
        frmElements.forEach(elm => {
            if (elm.id == 'inpLength') this.length = elm.value / 1000;

            if (elm.id == 'chkDiagonal') this.diagonal = elm.checked;
        });
    }
}