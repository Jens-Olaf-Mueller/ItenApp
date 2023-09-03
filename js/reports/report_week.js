'use strict';
import $ from '../library.js';
import FormHandler from '../classes/formhandler_class.js';
import { formatDate, getWeek, firstDayOfWeek, dateAdd, getAge } from '../date.js';
import { PROJECTS, SETTINGS } from '../app.js';

export function initWeekReport(caption = 'Wochenrapport') {
    const FRM_WEEKLY = new FormHandler('frmWeeklyReport');
    FRM_WEEKLY.show();
    FRM_WEEKLY.wizard.caption = caption;
    FRM_WEEKLY.wizard.buttonsVisible = 'send';        
    $('chkThisWeek').addEventListener('click', setCurrentWeek);
    $('inpWeekFromDate').addEventListener('input', setCurrentSunday);
    $('legendKW').innerText = '  Kalenderwoche ' + getWeek(Date.now());
}


function setCurrentWeek(event) {
    let monday = firstDayOfWeek(),
        sunday = formatDate(new Date(dateAdd(monday, 6)));
    $('inpWeekFromDate').value = event.target.checked ? monday : null;
    $('inpWeekUntilDate').value = event.target.checked ? sunday : null;
}


function setCurrentSunday(event) {
    let monday = firstDayOfWeek(event.target.value),
    sunday = formatDate(new Date(dateAdd(monday, 6)));
    $('inpWeekFromDate').value = monday;
    $('inpWeekUntilDate').value = sunday;
}