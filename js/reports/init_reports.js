'use strict';
import $, { initDropDownlist } from '../library.js';
import { executeWizardEvents } from '../app.js';
import { formatField } from '../main.js';
import { formatDate, getWeek, firstDayOfWeek, dateAdd } from '../date.js';
import { initWeekReport } from './report_week.js'; 
import { initVacationReport } from './report_vacation.js';
import { initSurvey } from './report_survey.js';
import { initExam } from './report_exam.js';
import { DROPLIST } from '../const.js';
import FormHandler from '../classes/formhandler_class.js';
import { PROJECTS, SETTINGS } from '../app.js';



export default function initReports(report) {
    document.addEventListener('onwizard', executeWizardEvents);
    switch (report) {
        case 'weekly':
            initWeekReport('Wochenrapport');
            break;            
        case 'vacation':
            initVacationReport('Urlaub');
            break;
        case 'comission':
            const FRM_REGIE = new FormHandler('frmRegie');
            FRM_REGIE.show();
            FRM_REGIE.wizard.showButton('add', 1);
            FRM_REGIE.wizard.caption = 'Regierapport';
            
            $('selTools').addEventListener('change', enableTextBox);
            initDropDownlist('selEmployeeType', DROPLIST.employees);
            // load all dropdown-units (kg, Sack, etc.)
            $('[data-units="powder"]').forEach(drop => initDropDownlist(drop, DROPLIST.units.powder));
            $('[data-units="volume"]').forEach(drop => initDropDownlist(drop, DROPLIST.units.volume));
            // format all numeric fields with 2 decimals!
            const numFields = $('input[type="number"]:not(.inp-short)');            
            numFields.forEach(fld => {
                fld.addEventListener('blur', formatField);
            });

            $('txtWorkDescription').addEventListener('input', enableAddButton);
            $('inpRegieDate').value = formatDate();
        // initDropDownlist('selRegieSites', SITES);
        // initDropDownlist('selEmployeeType', EMPLOYEES);
            $('selEmployeeType').value = SETTINGS.employeetype;
            $('inpWorker').value = SETTINGS.user.fullname;
            break;
        case 'site':
            const FRM_SITE = new FormHandler('frmSiteReport');
            FRM_SITE.show();
            FRM_SITE.wizard.caption = 'Baustellenrapport';
            FRM_SITE.wizard.buttonsVisible = 'print|send';            
            $('inpReportUntilDate').value = formatDate();
            break;
        case 'exam':
            initExam('CM-Messung');
            break;
        case 'survey':
            initSurvey('Ausmass');
            break;
        default: return;
    }
}

function enableTextBox(event) {
    // getting the buddy by data-buddy = "targetID"
    const buddy = $('inpOtherTool');

    const idx = event.target.selectedIndex,
          value = event.target.options[idx].value;
    if (value == "-1") {
        buddy.value = '';
        // buddy.removeAttribute('disabled');
        buddy.disabled = false;
        buddy.focus();
    } else {
        // buddy.value = value == 0 ? '' : value;
        buddy.value = '';
        // buddy.setAttribute('disabled', '');
        buddy.disabled = true;
    }
}

function enableAddButton(event) {
    const button = $('btnAddEmployee');
    if (event.target.value.length > 16 && Number($('inpCommHours').value) > 0) {
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled','');
    }
}