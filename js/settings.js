const FRM_SETTINGS = $('frmSettings'),
      clsWizard = new Wizard(FRM_SETTINGS, href, 'settings');


function initSettings(caption) {
    FRM_SETTINGS.classList.remove('hidden');
    document.addEventListener('onwizard', executeWizardEvent);
    const weekDays = Array.from($('input[name="weekdays"]'));
console.log(weekDays);
    // Array.from($('input[name="weekdays"]')).forEach(fld => {
    weekDays.forEach(fld => {
        fld.addEventListener('input', updateWeeklyHours);
    });

    clsWizard.action = 'save';
    clsWizard.add($('.title'), caption);    
    SETTINGS.form = FRM_SETTINGS;
    SETTINGS.load();
}

function executeWizardEvent(event) {
    if (event.detail.action == 'send') {
        clsWizard.submitForm();
    } else if (event.detail.action == 'save') {
        SETTINGS.save();
    }
}

function updateWeeklyHours() {
    $('inpHoursWeekly').value = SETTINGS.weeklyHours;
}