import $ from './library.js';

/**
 * Renders all tiles on the home-screen for quick launch access.
 * @param {object} tiles from settings to be rendered
 */
function renderLaunchPad(tiles) {
    const board = $('divTiles');
    board.innerHTML = '';
    for (let i = 0; i < tiles.length; i++) {
        const values = tiles[i].split('|'),
              path = values[0], link = values[1], caption = values[2];
        board.innerHTML += `
            <a href="${link}">
                <figure class="tiles">
                    <img src="./img/${path}" width="100%">
                    <figcaption>${caption}</figcaption>
                </figure>
            </a>`;
    }
}


function setInputAutoSelection() {
    const txtBoxes = Array.from($('input[type="text"], [type="number"]'));
    txtBoxes.forEach(txt => {
        txt.addEventListener('click', function() {
            this.select();
        });
    });
}

/**
 * Installs event listeners to checkboxes switching corresponding input fields on or off.
 * @param {string} off empty string or 'off'
 */
function setCheckboxBuddies(off = '') {
    const chkBoxes = $(`input[data-buddy${off}]`);
    if (chkBoxes instanceof NodeList) {
        Array.from(chkBoxes).forEach(chk => {
            chk.addEventListener('click', switchBuddy);
        });
    } else { 
        chkBoxes.addEventListener('click', switchBuddy);
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
          state = !checkbox.target.checked;
    if (chkBuddy) {
        const buddies = chkBuddy.split(' ');
        buddies.forEach(buddy => {
            // this switches corresponding controls ON !
            const ctrl = document.getElementById(buddy);
            if (ctrl instanceof HTMLImageElement) {
                ctrl.toggleAttribute('disabled', state);
            } else {
                ctrl.disabled = state;
            }            
        });
    }
    // some checkbox can execute BOTH functions! (i.e. mass calculator, area vs. length + width)
    if (chkBuddyOff) {
        const buddies = chkBuddyOff.split(' ');
        buddies.forEach(buddy => {
            // this switches corresponding controls OFF !
            document.getElementById(buddy).disabled = !state;
        });
    }    
}

function dateAdd(date, days) {
    if (typeof date == 'string') date = new Date(date);
    if (date == undefined) date = new Date();
    let endDate = new Date(date);
    return endDate.setDate(endDate.getDate() + days);
    // return endDate;
  }

function formatDate(date = new Date()) {
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

/**
 * returns the first day (monday) of a given date in a week
 * @param {object} date if omitted the currend date is used
 * @param {number} firstDayOfWeek 0 sunday | 1 monday | 2 tuesday | 3 wednesday | 4 thursday | 5 friday | 6 saturday
 * @returns 
 */
function firstDayOfWeek(date, firstDayOfWeek = 1) {
    if (typeof date == 'string') date = new Date(date);
    if (date == undefined) date = new Date();
    const dayOfWeek = date.getDay(),
        mondayOfWeek = new Date(date),
        diff = dayOfWeek >= firstDayOfWeek ? dayOfWeek - firstDayOfWeek : 6 - dayOfWeek;
    mondayOfWeek.setDate(date.getDate() - diff)
    mondayOfWeek.setHours(0,0,0,0)
    return formatDate(mondayOfWeek);
}


function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatField(field, digits = 2) {
    const input = (field instanceof Event) ? field.target : $(field);
    input.value = Number(input.value).toFixed(digits);
}

export { renderLaunchPad, setCheckboxBuddies, setInputAutoSelection, formatField, formatDate };