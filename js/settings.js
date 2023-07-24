'use strict';
import $ from './library.js';
import { initDropDownlist } from './library.js';
import { SETTINGS } from './app.js';
import { formatField } from './main.js';
import { DROPLIST } from './const.js';
import { Wizard } from './classes/wizard_class.js';
import { MessageBox } from './classes/messagebox_class.js';

const FRM_SETTINGS = $('frmSettings'),
      clsWizard = new Wizard(FRM_SETTINGS, 'settings'), 
      msgBox = new MessageBox('../style/msgbox.css');

function initSettings(caption) {
    FRM_SETTINGS.removeAttribute('hidden');
    initDropDownlist('selProfession', DROPLIST.employees);
    document.addEventListener('onwizard', executeWizardEvent);

    clsWizard.action = 'save';
    clsWizard.add($('h3Title'), caption);
    SETTINGS.form = FRM_SETTINGS;
    SETTINGS.load();

    const calcStyle = Array.from($('input[name="calculatorStyle"]'));
    calcStyle.forEach(btn => {
        btn.addEventListener('change', setCalculatorStyle);
        // display the selected calculator image!
        if (btn.checked) setCalculatorStyle(btn);
    });

    // to make it work, it must be at the END of this function!!!
    const weekDays = Array.from($('input[name="weekdays"]'));
    weekDays.forEach(day => {
        day.addEventListener('input', updateWeeklyHours);
        day.addEventListener('blur', formatField);
    });
}

async function executeWizardEvent(event) {
    if (await msgBox.show('Einstellungen speichern?','Bitte bestätigen!','Ja, Nein') == 'Ja') {
        if (event.detail.action == 'send') {
            clsWizard.submitForm();
        } else if (event.detail.action == 'save') {
            SETTINGS.save();
            window.location.replace('index.html');  
        }
    }
}

function updateWeeklyHours() {
    const weekDays = Array.from($('input[name="weekdays"]'));
    let hours = 0;
    for (let i = 0; i < weekDays.length; i++) {
        hours += Number(weekDays[i].value);       
    }
    $('inpHoursWeekly').value = hours.toFixed(2);
}

function setCalculatorStyle(expression) {
    const input = (expression instanceof Event) ? expression.target : expression;
    $('imgCalcPreview').src = './img/' + input.value.slice(0,-3) + 'jpg';
}

export {initSettings};