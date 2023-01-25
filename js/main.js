/**
 * creates constants containing informations about the current page
 */
const {host, hostname, href, origin, pathname, port, protocol, search} = window.location;
const queryString = search.substring(1);

window.addEventListener('DOMContentLoaded', runApp);

/**
 * extends the Math-Object by a special round-function that allows to
 * round a given number toa given amount of decimal digits
 * @param {number} number numeric expression
 * @param {number} decimals count of decimal digits
 * @returns the rounded number with assignet decimal digits
 */
Math.roundDec = function(number, decimals = 0) {
    const dec = decimals * 10;
    if (dec == 0) return Math.round(number + Number.EPSILON);
    return Math.round((number + Number.EPSILON) * dec) / dec;
}

async function runApp() {
    await includeHTML();
    loadSettings();
    if (href.includes('hours')) initPageHours('Stunden');
    if (href.includes('tools')) initTools(queryString);
    if (href.includes('settings')) initSettings('Einstellungen');
    if (href.includes('report')) initReports(queryString);
    if (href.includes('calculator')) $('.title').innerHTML = 'Taschenrechner';
    setCheckboxBuddies();
    setCheckboxBuddies('off'); // for those who switch corresponding controls off!
    setInputAutoSelection();
}

function loadSettings() {
    //
}


function setInputAutoSelection() {
    const txtBoxes = Array.from($('input[type="text"], [type="number"]'));
    txtBoxes.forEach(txt => {
        txt.addEventListener('click', function() {
            this.select();
        })
    });
}


function setCheckboxBuddies(off = '') {
    let tmpBoxes = $(`input[data-buddy${off}]`);
    if (tmpBoxes instanceof NodeList) {
        const checkBoxes = Array.from(tmpBoxes);
        checkBoxes.forEach(chk => {
            chk.addEventListener('click', switchBuddy);
        });
    } else { 
        tmpBoxes.addEventListener('click', switchBuddy);
    }
}

/**
 * Enables | disables a list of correspondending controls (buddies)
 * provided in the data-buddy attribute depending on the objects checked-state.
 * i.e.: <input id="chkBox" type="checkbox" data-buddy="buddyID1 buddyID2">
 * Calling elements must be connected by an event listener: 
 * CHK_SWITCHBOX.addEventListener('click', switchBuddy);
 * @param {object} checkbox 
 */
 function switchBuddy(checkbox) {
    const chkBuddy = checkbox.target.dataset.buddy,
          chkBuddyOff = checkbox.target.dataset.buddyoff,
          state = checkbox.target.checked;
    if (chkBuddy) {
        const buddies = chkBuddy.split(' ');
        buddies.forEach(buddy => {
            // this switches corresponding controls ON !
            document.getElementById(buddy).disabled = !state;
        }); 
    } else if (chkBuddyOff) {
        const buddies = chkBuddyOff.split(' ');
        buddies.forEach(buddy => {
            // this switches corresponding controls OFF !
            document.getElementById(buddy).disabled = state;
        });
    }    
}

function getCurrentDate(date = new Date()) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate())].join('-');
}

function getKW (date = new Date()) {
    const startDate = new Date(date.getFullYear(), 0, 1),
          MS_PER_DAY = (24 * 60 * 60 * 1000);
    let days = Math.floor((date - startDate) / MS_PER_DAY);
    return padTo2Digits(Math.ceil(days / 7));
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}