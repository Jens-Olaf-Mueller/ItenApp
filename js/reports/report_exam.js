'use strict';
import $ from '../library.js';
import FormHandler from '../classes/formhandler_class.js';
import { formatDate } from '../date.js';
import { PROJECTS, SETTINGS } from '../app.js';

export function initExam(caption = 'CM-Messung') {
    const FRM_EXAM = new FormHandler('frmCM');
    FRM_EXAM.show();
    FRM_EXAM.wizard.showButton('cam', 1);
    FRM_EXAM.wizard.caption = caption;
    $('inpExaminationDate').value = formatDate();
    $('inpExaminer').value = SETTINGS.surname + ', ' + SETTINGS.firstname;
    $('inpScreedWeight').addEventListener('input', validateWeight);
    $('selScreedType').addEventListener('change', validateWeight);
}

function validateWeight() {
    const isInput = (this instanceof HTMLInputElement);
    const screedType = isInput ? $('selScreedType').value : this.value;
    const value = isInput ? this.value : $('inpScreedWeight').value;
    const valid = (screedType == 'CT' && value >= 50) || 
                  (screedType != 'CT' && value >= 100) || 
                  $('inpScreedWeight').value == '';
    $('inpScreedWeight').classList.toggle('input-error', !valid);
    clsWizard.showInfoButton = !valid;
}