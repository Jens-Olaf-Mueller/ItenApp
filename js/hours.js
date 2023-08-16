'use strict';
import $, { initDropDownlist } from './library.js';
import { DROPLIST } from './const.js';
import { SETTINGS, PROJECTS, executeWizardEvents } from './app.js';
import { formatField } from './main.js';
import { formatDate, getWeek, isHoliday, dateAdd } from './date.js';
import { FormHandler } from './classes/library_class.js';
import Wizard from './classes/wizard_class.js';
import MessageBox from './classes/messagebox_class.js';

const clsWizard = new Wizard('frmHours', 'hours'),
      frmHOURS = new FormHandler('frmHours'),
      msgBox = new MessageBox('./style/msgbox.css');

const objTouch = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    timeStart: 0,
    timeEnd: 0,
    get direction() {
        if (this.endX > this.startX) return 'right';
        if (this.endX < this.startX ) return 'left';
    },
    get delay() {
        return (this.timeEnd - this.timeStart)  / 1000;
    }
}

export default function initHoursRecording(caption) {
    frmHOURS.show();
    clsWizard.add($('h3Title'), caption);
    clsWizard.showAddButton = 2;
    initDropDownlist('selWorkCategory', DROPLIST.categories);
    loadDefaultSettings();
    clsWizard.updateCaption();
    changeDay();     
    // set event listeners at the end!!!
    frmHOURS.addEvents(
        {element: document, event: 'onwizard', func: executeWizardEvents},
        {element: 'frmHours', event: 'touchstart', func: handleTouchEvents},
        {element: 'frmHours', event: 'touchend', func: handleTouchEvents},
        {element: 'inpCurrentDate', event: 'change', func: changeDay},
        {element: Array.from($('img[id^="btn"]')), 
            event: 'click', func: changeDay},
        {element: Array.from($('[data-autocalc="inpHours"]')),
            event: 'input', func: calcHours},
        {element: 'selBVName', event: 'change', func: siteSelected},
        {element: 'selWorkCategory', event: 'change', func: categorySelected},
        {element: 'selDoneWork', event: 'change', func: function() {
            $('txtOtherWork').toggleAttribute('hidden', (this.value != 0))
        }},
        {element: 'chkExpenses', event: 'change', func: function() {
            $(this.dataset.buddy).value = this.checked ? Number(SETTINGS.expenses).toFixed(2) : '';
        }},
        {element: 'chkMultipleWork', event: 'change', func: showTextareaWork }
    );
    // console.log(PROJECTS)
}
 
/**
 * Fills the form with the defaults from user settings or previous inputs
 */
function loadDefaultSettings() {
    const today = formatDate();
    const objDay = SETTINGS.weekdays[SETTINGS.season][new Date(today).getDay() - 1];
// TODO ---> in changeday verschieben!
    $('inpCurrentDate').value = today;
    if (objDay) {
        $('inpArrival').value = objDay.from;
        $('inpDeparture').value = objDay.until;
        $('inpBreakfast').value = objDay.breakfast;
        $('inpLunch').value = objDay.lunch;  
        $('inpHours').value = SETTINGS.calculateHours(objDay.from, objDay.until, objDay.breakfast, objDay.lunch).toFixed(2);      
    }

    $('divBVNumber').classList.toggle('hidden', !SETTINGS.showSiteID);
    $('div[data-name="drivebox"]').toggleAttribute('hidden', !SETTINGS.showDriveBox);
    
    // calcHours();
}

// async function executeWizardEvent(event) {
//     const wizAction = event.detail.action;
//     if (wizAction == 'send') {
//         const sender = event.detail.source;
//         sender.submitForm('index.html');
//     } else if (wizAction == 'add') {
//         if (await msgBox.show('Weitere Baustelle hinzufügen?','Fortfahren?','Ja, Nein') == 'Ja') {
//             // clsWizard.page = 0;
//             clsWizard.updatePage(-10);
//             debugger
//             //TODO: saving the previous dataset
//         }
//     } else if (wizAction == 'save') {
//         SETTINGS.save();
//     }
// }


function handleTouchEvents(evt) {
    if (evt.type == 'touchstart') {
        objTouch.startX = evt.changedTouches[0].screenX;
        objTouch.startY = evt.changedTouches[0].screenY;
        objTouch.timeStart = evt.timeStamp;
    } else if (evt.type == 'touchend') {
        objTouch.endX = evt.changedTouches[0].screenX;
        objTouch.endY = evt.changedTouches[0].screenY;
        objTouch.timeEnd = evt.timeStamp;
    }
    const step = objTouch.direction == 'left' ? 1: -1;
    // console.log(objTouch.delay)
    if (objTouch.delay > 0.25) clsWizard.updatePage(step);
    // evt.preventDefault();
    
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

/**
 * Calculates the number of hours to work in the current week.
 * @param {date} today Current date
 * @returns The number of hours in the current week.
 */
function getRequiredWeekHours(today) {    
    // looking for monday...
    while (today.getDay() != 1) {
        today = dateAdd(today, -1);
    }
    let hours = 0;
    while (today.getDay()) {
        // pick the dataset for the weekday from settings...        
        if (!isHoliday(today) && !isVacation(today)) {
            // Monday = 1, but array starts with 0!
            const objDay = SETTINGS.weekdays[SETTINGS.season][today.getDay() - 1]; 
            hours += SETTINGS.calculateHours(objDay.from, objDay.until, objDay.breakfast, objDay.lunch);
        }
        today = dateAdd(today, 1);
    }
    return hours;
}

function getPerformedWeekHours(today) {
    return 0;
}

function getRequiredMonthHours(date) {
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let day = new Date(date.getFullYear(), date.getMonth(), 1), // get the 1st of the month!
        hours = 0;
    while (day.getMonth() == date.getMonth()) {
        // skip holidays, vacation and sundays: day.getDay() == 0!
        if (day.getDay() && !isHoliday(day) && !isVacation(day)) {
            const objDay = SETTINGS.weekdays[SETTINGS.season][day.getDay() - 1];
            hours += SETTINGS.calculateHours(objDay.from, objDay.until, objDay.breakfast, objDay.lunch);
        }
        day = dateAdd(day, 1);
    }
    return hours;
}


function isVacation(date) {
    // TODO: in library verschieben u. Urlaub anhand der eingereichten Tage ermitteln!
    return false;
}

function changeDay() {
    const currDate = $('inpCurrentDate'),
          dtToday = new Date(currDate.value),
          step = (this instanceof HTMLImageElement) ? Number(this.alt) : 0;
    dtToday.setDate(dtToday.getDate() + step);    
    currDate.value = formatDate(dtToday);
    const isSunday = (dtToday.getDay() == 0) || isHoliday(dtToday); // after adding date!!!
    currDate.classList.toggle('sunday', isSunday);    
    updateDayInfo(dtToday);
}

function updateDayInfo(today) { 
    // i. e. Dienstag, 01.08.2023
    const dayType = $('selDayType');
    const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
    $('lgdCurrentDay').innerHTML = `  ${today.toLocaleString('de-DE', options)}  ${isHoliday(today)}`;
    $('lblHoursWeek').innerHTML = `Stunden KW ${getWeek(today)}:`;
    $('inpHoursWeek').value = getPerformedWeekHours(today).toFixed(2).replace('.',',') + ' / ' + getRequiredWeekHours(today).toFixed(2).replace('.',',');
    $('inpHoursMonth').value = '0,00 / ' + getRequiredMonthHours(today).toFixed(2).replace('.',',');
    $('lblHoursMonth').innerHTML = `Stunden ${today.toLocaleString('de-DE', {month: 'long'})}`;

    if (isHoliday(today)) {
        dayType.setAttribute('disabled','');
        dayType.value = 'Feiertag';
    } else if (today.getDay() == 0) {
        dayType.setAttribute('disabled','');
        dayType.value = 'Sonntag';
    } else if (isVacation(today)) {
        dayType.value = 'Urlaubstag';        
    } else {
        dayType.removeAttribute('disabled');
        dayType.value = 'Werktag';
    }
}

function siteSelected() {
    const selected = (this.value != -1),
          index = this.options.selectedIndex;
    // controls.forEach(ctrl => ctrl.toggleAttribute('hidden', state));
    $('div.fieldset').toggleAttribute('hidden', !selected);
    $('inpBVNr').value = selected ? this.value : '';
    $('inpOrt').value = selected ? this.options[index].dataset.site : '';    
}

function categorySelected() {
    const visible = (this.value != -1), category = this.value;
    initDropDownlist('selDoneWork', DROPLIST.works[category],'-- bitte wählen --');
    $('selDoneWork').innerHTML += `<option value="0" data-popup="txtOtherWork">Sonstige Arbeiten...</option>`;
    $(this.dataset.popup).toggleAttribute('hidden', !visible);
}

function showTextareaWork() {
    const selWork = $('selDoneWork');
    selWork.toggleAttribute('multiple', this.checked);
    selWork.size = this.checked ? 8 : 'unset';
    $('option[data-category="-1"][value="-1"]').toggleAttribute('hidden', this.checked);
}