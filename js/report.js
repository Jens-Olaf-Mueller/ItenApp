'use strict';
import $, { initDropDownlist } from './library.js';
import { formatField, formatDate } from './main.js';
import { DROPLIST } from './const.js';
import { Wizard } from './classes/wizard_class.js';
import { PROJECTS, SETTINGS } from './app.js';

const FRM_SITE = $('frmSiteReport'),
      FRM_EXAM = $('frmCM'),
      FRM_REGIE = $('frmRegie'),
      FRM_WEEKLY = $('frmWeeklyReport');

const clsWizard = new Wizard(FRM_EXAM, 'exam');
const wizRegie = new Wizard(FRM_REGIE, 'commission');

export function initReports(report) {
    document.addEventListener('onwizard', executeWizardEvent);
    switch (report) {
        case 'weekly':
            $('h3Title').innerHTML = 'Wochenrapport';
            FRM_WEEKLY.classList.remove('hidden');
            $('chkThisWeek').addEventListener('click', setCurrentWeek);
            $('inpWeekFromDate').addEventListener('input', setCurrentSunday);
            $('legendKW').innerText = '  Kalenderwoche ' + getKW();
            break;
        case 'ordered':
            FRM_REGIE.removeAttribute('hidden');
            wizRegie.add($('h3Title'), 'Regierapport');
            $('selTools').addEventListener('change', enableTextBox);
            // load all dropdown-units (kg, Sack, etc.)
            $('[data-units="powder"]').forEach(drop => initDropDownlist(drop, DROPLIST.units.powder));
            $('[data-units="volume"]').forEach(drop => initDropDownlist(drop, DROPLIST.units.volume));
            // format all numeric fields with 2 decimals!
            const numFields = $('input[type="number"]:not(.inp-short)');            
            numFields.forEach(fld => {
                fld.addEventListener('blur', formatField);
            });

            $('txtWorkDesription').addEventListener('input', enableAddButton);
            $('inpRegieDate').value = formatDate();
        // initDropDownlist('selRegieSites', SITES);
        // initDropDownlist('selEmployeeType', EMPLOYEES);
            $('selEmployeeType').value = SETTINGS.employeetype;
            $('inpWorker').value = SETTINGS.fullname;
            break;
        case 'site':
            $('h3Title').innerHTML = 'Baustellenrapport';
            FRM_SITE.classList.remove('hidden');
            $('inpReportUntilDate').value = formatDate();
            break;
        case 'exam':
            FRM_EXAM.classList.remove('hidden');
            clsWizard.add($('h3Title'), 'CM-Messung');
            clsWizard.showCamButton = true;
            clsWizard.showInfoButton = true;
            $('inpExaminationDate').value = formatDate();
            $('inpExaminer').value = SETTINGS.fullname;
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
        buddy.removeAttribute('disabled');
        buddy.focus();
    } else {
        buddy.value = value == 0 ? '' : value;
        buddy.setAttribute('disabled', '');
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

function executeWizardEvent(event) {
    if (event.detail.action == 'send') {
        clsWizard.submitForm();
    } else if (event.detail.action == 'save') {
        SETTINGS.save();
    }
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