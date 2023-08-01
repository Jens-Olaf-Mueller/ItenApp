'use strict';
import $ from './library.js';
import { SETTINGS } from './app.js';
import { formatDate, formatField } from './main.js';
import { FormHandler } from './classes/library_class.js';
import { Wizard } from './classes/wizard_class.js';

const clsWizard = new Wizard('frmHours', 'hours'),
      frmHOURS = new FormHandler('frmHours');


export default function initHoursRecording(caption) {
    frmHOURS.show();
    clsWizard.add($('h3Title'), caption);
    loadDefaultSettings();
    changeDay();     
    // set event listeners at the end!!!
    frmHOURS.addEvents(
        {element: document, event: 'onwizard', func: executeWizardEvent},
        {element: 'inpCurrentDate', event: 'change', func: changeDay},
        {element: Array.from($('img[id^="btn"]')), 
            event: 'click', func: changeDay},
        {element: Array.from($('[data-autocalc="inpHours"]')),
            event: 'input', func: calcHours},
        {element: 'selBVName', event: 'change', func: toggleControls}
    );
}
 
/**
 * Fills the form with the defaults from user settings or previous inputs
 */
function loadDefaultSettings() {
    $('inpCurrentDate').value = formatDate();
    $('inpArrival').value = SETTINGS.workFrom;
    $('inpDeparture').value = SETTINGS.workUntil;
    $('inpBreakfast').value = SETTINGS.breakfast;
    $('inpLunch').value = SETTINGS.lunch;
    $('divBVNumber').classList.toggle('hidden', !SETTINGS.showSiteID);
    $('fldDriveBox').classList.toggle('hidden', !SETTINGS.showDriveBox);
    calcHours();
}

async function executeWizardEvent(event) {
    const wizAction = event.detail.action;
    if (wizAction == 'send') {
        const sender = event.detail.source;
        sender.submitForm('index.html');
    } else if (wizAction == 'save') {
        SETTINGS.save();
    }
}

function calcHours() {
    const output = $('inpHours'),
          inpFrom = $('inpArrival').value.split(':').map(Number),
          inpUntil = $('inpDeparture').value.split(':').map(Number),
          breakfast = Number($('inpBreakfast').value),
          lunch = Number($('inpLunch').value),
          dtFrom = new Date(2022, 0, 1, inpFrom[0], inpFrom[1]), 
          dtUntil = new Date(2022, 0, 1, inpUntil[0], inpUntil[1]);

    output.classList.remove('input-error');
    if (this && this.hasAttribute('maxlength')) {
        if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
    }
    let hours = ((dtUntil.getTime() - dtFrom.getTime()) / 1000 / 60 - breakfast - lunch) / 60;
    output.value = hours.toFixed(2);
    if (hours < 0 || hours > Number(SETTINGS.alertHours)) output.classList.add('input-error');
    $('chkRegie').toggleAttribute('disabled', (hours <= 0));
    return hours;
}

function changeDay() {
    const currDate = $('inpCurrentDate'),
          dtToday = new Date(currDate.value),
          step = (this instanceof HTMLImageElement) ? Number(this.alt) : 0,          
          dayType = $('selDayType');

    dtToday.setDate(dtToday.getDate() + step);
    const isSunday = (dtToday.getDay() == 0); // after adding date!!!
    currDate.value = formatDate(dtToday);
    const opts = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
    $('lgdCurrentDay').innerHTML = `  ${dtToday.toLocaleString('de-DE', opts)}  -  KW ${getWeek(dtToday)}`;
    currDate.classList.toggle('sunday', isSunday);
    if (isSunday) {
        dayType.setAttribute('disabled','');
        dayType.value = 'Sonntag';
    } else {
        dayType.removeAttribute('disabled');
        dayType.value = 'Werktag';
        // TODO check for Holiday...!
    }
}

function toggleControls() {
    const controls = $('[data-autocalc="inpHours"][disabled], label[disabled]');
    const state = (this.value == -1);
    controls.forEach(ctrl => ctrl.toggleAttribute('disabled', state));
}

function getWeek(date) {
    let tdt = new Date(date.valueOf());
    let dayn = (date.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    let firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}