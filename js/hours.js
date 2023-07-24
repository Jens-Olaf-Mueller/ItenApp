'use strict';
import $ from './library.js';
import { SETTINGS } from './app.js';
import { formatDate, formatField } from './main.js';
import { FormHandler } from './classes/library_class.js';
import { Wizard } from './classes/wizard_class.js';

const clsWizard = new Wizard('frmHours', 'hours'),
      frmHOURS = new FormHandler('frmHours');

function initPageHours(caption) {
    frmHOURS.show();
    clsWizard.add($('h3Title'), caption);
    loadDefaultSettings();       
    // set event listeners at the end!!!
    frmHOURS.addEvents(
        {element: 'inpKommt', event: 'input', func: calcHours},
        {element: 'inpGeht', event: 'input', func: calcHours},
        {element: 'inpPause1', event: 'input', func: calcHours},
        {element: 'inpPause2', event: 'input', func: calcHours},
        {element: document, event: 'onwizard', func: executeWizardEvent}
    );
}

/**
 * Fills the form with the defaults from user settings or previous inputs
 */
function loadDefaultSettings() {
    $('inpCurrentDate').value = formatDate();
    $('inpKommt').value = SETTINGS.workFrom;
    $('inpGeht').value = SETTINGS.workUntil;
    $('inpPause1').value = SETTINGS.breakfast;
    $('inpPause2').value = SETTINGS.lunch;
    $('divBVNumber').classList.toggle('hidden', !SETTINGS.showSiteID);
    $('fldDriveBox').classList.toggle('hidden', !SETTINGS.showDriveBox);
}

function executeWizardEvent(event) {
    const wizAction = event.detail.action;
    if (wizAction == 'send') {
        const sender = event.detail.source;
        sender.submitForm('index.html');
    } else if (wizAction == 'save') {
        SETTINGS.save();
    }
}

function calcHours(event) {
    // new Date(year value, IndexOfMonth, day value, hours, minutes, seconds)
    const sender = event.target, output = $('inpHours'),
          inpFrom = $('inpKommt').value.split(':').map(Number),
          inpUntil = $('inpGeht').value.split(':').map(Number),
          breakfast = Number($('inpPause1').value),
          lunch = Number($('inpPause2').value),
          dtFrom = new Date(2022, 0, 1, inpFrom[0], inpFrom[1]), 
          dtUntil = new Date(2022, 0, 1, inpUntil[0], inpUntil[1]);

    output.classList.remove('input-error');
    if (this.hasAttribute('maxlength')) {
        if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
    }

    let hours = ((dtUntil.getTime() - dtFrom.getTime()) / 1000 / 60 - breakfast - lunch) / 60;
    output.value = hours.toFixed(2);
    if (hours < 0) output.classList.add('input-error');
    return hours;
}

export { initPageHours };