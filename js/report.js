const FRM_SITE = $('frmSiteReport'),
      FRM_EXAM = $('frmCM'),
      FRM_REGIE = $('frmRegie'),
      FRM_WEEKLY = $('frmWeeklyReport');

const clsWizard = new Wizard(FRM_EXAM, href, 'exam');
const wizRegie = new Wizard(FRM_REGIE, href, 'commission');

function initReports(report) {
    document.addEventListener('onwizard', executeWizardEvent);
    switch (report) {
        case 'weekly':
            $('.title').innerHTML = 'Wochenrapport';
            FRM_WEEKLY.classList.remove('hidden');
            $('chkThisWeek').addEventListener('click', setCurrentWeek);
            $('inpWeekFromDate').addEventListener('input', setCurrentSunday);
            $('legendKW').innerText = '  Kalenderwoche ' + getKW();
            break;
        case 'ordered':
            FRM_REGIE.classList.remove('hidden');
            wizRegie.add($('.title'), 'Regierapport');
            $('selTools').addEventListener('change', enableTextBox);
            $('inpRegieDate').value = getCurrentDate();
            break;
        case 'site':
            $('.title').innerHTML = 'Baustellenrapport';
            FRM_SITE.classList.remove('hidden');
            $('inpReportUntilDate').value = getCurrentDate();
            break;
        case 'exam':
            FRM_EXAM.classList.remove('hidden');
            clsWizard.add($('.title'), 'CM-Messung');
            clsWizard.showCamButton = true;
            clsWizard.showInfoButton = true;
            $('inpExaminationDate').value = getCurrentDate();
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

function executeWizardEvent(event) {
    if (event.detail.action == 'send') {
        clsWizard.submitForm();
    } else if (event.detail.action == 'save') {
        SETTINGS.save();
    }
}

function setCurrentWeek(event) {
    let monday = firstDayOfWeek(),
        sunday = getCurrentDate(new Date(dateAdd(monday, 6)));
    $('inpWeekFromDate').value = event.target.checked ? monday : null;
    $('inpWeekUntilDate').value = event.target.checked ? sunday : null;
}

function setCurrentSunday(event) {
    let monday = firstDayOfWeek(event.target.value),
    sunday = getCurrentDate(new Date(dateAdd(monday, 6)));
    $('inpWeekFromDate').value = monday;
    $('inpWeekUntilDate').value = sunday;
}