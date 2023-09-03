'use strict';
import $ from '../library.js';
import FormHandler from '../classes/formhandler_class.js';
import { formatDate, getWeek, firstDayOfWeek, dateAdd, getAge } from '../date.js';
import { PROJECTS, SETTINGS } from '../app.js';

export function initVacationReport(caption = 'Urlaub') {
    const FRM_VACATION = new FormHandler('frmVacation');
    FRM_VACATION.show();
    FRM_VACATION.wizard.caption = caption;
    FRM_VACATION.wizard.buttonsVisible = 'add|send';        
    $('inpHolidaysFrom').addEventListener('input', verifyInput);
    $('inpHolidaysUntil').addEventListener('input', verifyInput);
    setHolidayInfo();
}


function setHolidayInfo() {
    $('legendHolidays').innerText = '  Urlaubstage ' + new Date().getFullYear() + '  ';
    const age = getAge(new Date(SETTINGS.birthday)),
          holidaysTotal = age < 50 ? 25 : 27;
    $('lblHolidaysTotal').innerText = holidaysTotal;
    $('lblHolidaysObtained').innerText = 0;
    $('lblHolidaysRemaining').innerText = 0;
}

function verifyInput() {
    // console.log(this)
    const opts = {day: '2-digit', month: '2-digit', year: 'numeric'};
    const today = new Date().toLocaleDateString('de-DE', opts),
          from = new Date($('inpHolidaysFrom').value).toLocaleDateString('de-DE', opts), 
          fromEmpty = $('inpHolidaysFrom').value == '',
          until = new Date($('inpHolidaysUntil').value).toLocaleDateString('de-DE', opts),
          untilEmpty = $('inpHolidaysUntil').value == '',
          isValid = (from >= today || fromEmpty) && 
                    (from < until || fromEmpty || untilEmpty);

    if (this.id == 'inpHolidaysFrom' || from < today) {
        $(this.id).classList.toggle('input-error', !isValid);
        return;
    }
    if (this.id == 'inpHolidaysUntil' || until < today) {
        $(this.id).classList.toggle('input-error', !isValid);
    }
}

