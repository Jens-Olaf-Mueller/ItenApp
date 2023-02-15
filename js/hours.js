const FRM_HOURS = $('frmHours');
const clsWizard = new Wizard(FRM_HOURS, href, 'hours');

function initPageHours(caption) {
    FRM_HOURS.classList.remove('hidden');
    setEventListeners();    
    clsWizard.add($('.title'), caption);

    // if (SETTINGS.showSiteID) {
    //     $('divBVNumber').classList.remove('hidden');
    // } else {
    //     $('divBVNumber').classList.add('hidden');
    // }

    $('divBVNumber').classList.toggle('hidden', !SETTINGS.showSiteID);
    $('fldDriveBox').classList.toggle('hidden', !SETTINGS.showDriveBox);
    $('inpCurrentDate').value = getCurrentDate();
    // $('inpHours').innerHTML = calcHours(FROM.value, UNTIL.value) + ' Std.';
}

function setEventListeners() {
    document.addEventListener('onwizard', executeWizardEvent);
    $('inpKommt').addEventListener('change', calcHours);
    $('inpGeht').addEventListener('change', calcHours);
}

function executeWizardEvent(event) {
    if (event.detail.action == 'send') {
        clsWizard.submitForm();
    } else if (event.detail.action == 'save') {
        SETTINGS.save();
    }
}

function calcHours(from, until, outputID = 'inpHours') {
    const secPerHour = 1000 * 60 * 60;
    if (typeof(from) != 'string') from = FROM.value;
    if (typeof(until) != 'string') until = UNTIL.value;

    from = from.split(':');
    until = until.split(':');
    let startDate = new Date(0, 0, 0, from[0], from[1], 0),
        endDate = new Date(0, 0, 0, until[0], until[1], 0),
        diff = endDate.getTime() - startDate.getTime(),
        hours = Math.floor(diff / secPerHour);
    diff -= hours * secPerHour;
    // debugger
    let minutes = Math.floor(diff / 1000 / 60),
        retVal = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
    
    if (outputID) $(outputID).value = retVal;
    return retVal;
}