const SITE_ID = $('divBVNumber'),
      DRIVEBOX = $('fldDriveBox'),
      HOURS_TODAY = $('lblHours'),
      FROM = $('inpKommt'), UNTIL = $('inpGeht');


FROM.addEventListener('change', calcHours);
UNTIL.addEventListener('change', calcHours);

initPage();

function initPage() {
    if (SETTINGS.showSiteID) {
        SITE_ID.classList.remove('hidden');
    } else {
        SITE_ID.classList.add('hidden');
    }
    DRIVEBOX.classList.toggle('hidden', !SETTINGS.showDriveBox);
    $('inpCurrentDate').value = getCurrentDate();
    HOURS_TODAY.innerHTML = calcHours(FROM.value, UNTIL.value) + ' Std.';
}

function calcHours(from, until, outputID = 'lblHours') {
    if (typeof(from) != 'string') from = FROM.value;
    if (typeof(until) != 'string') until = UNTIL.value;

    from = from.split(':');
    until = until.split(':');
    let startDate = new Date(0, 0, 0, from[0], from[1], 0),
        endDate = new Date(0, 0, 0, until[0], until[1], 0),
        diff = endDate.getTime() - startDate.getTime(),
        hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    let minutes = Math.floor(diff / 1000 / 60),
        retVal = (hours < 9 ? '0' : '') + hours + ':' + (minutes < 9 ? '0' : '') + minutes;
    
    if (outputID) $(outputID).innerHTML = retVal + ' Std.'
    return retVal;
}