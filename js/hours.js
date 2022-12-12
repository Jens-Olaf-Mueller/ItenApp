const SITE_ID = $('divBVNumber'),
      DRIVEBOX = $('fldDriveBox');

runInput();
console.log('href ist: ', href)

function runInput() {
    if (SETTINGS.showSiteID) {
        SITE_ID.classList.remove('hidden');
    } else {
        SITE_ID.classList.add('hidden');
    }

    DRIVEBOX.classList.toggle('hidden', !SETTINGS.showDriveBox);
}