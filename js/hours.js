const SITE_ID = $('divBVNumber'),
      DRIVEBOX = $('fldDriveBox'),
      HOURS_TODAY = $('inpHours'),
      FROM = $('inpKommt'), UNTIL = $('inpGeht');

const clsWizard = new Wizard('frmHours', href);

FROM.addEventListener('change', calcHours);
UNTIL.addEventListener('change', calcHours);
UNTIL.addEventListener('change', calcHours);

function initPageHours(caption) {
    clsWizard.add($('.title'), caption);
    if (SETTINGS.showSiteID) {
        SITE_ID.classList.remove('hidden');
    } else {
        SITE_ID.classList.add('hidden');
    }
    DRIVEBOX.classList.toggle('hidden', !SETTINGS.showDriveBox);
    $('inpCurrentDate').value = getCurrentDate();
    HOURS_TODAY.innerHTML = calcHours(FROM.value, UNTIL.value) + ' Std.';
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