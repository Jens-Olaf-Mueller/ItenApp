import $ from './library.js';

/**
 * Renders all tiles on the home-screen for quick launch access.
 * @param {object} tiles from settings to be rendered
 */
 export function renderLaunchPad(tiles) {
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


/**
 * Installing event listeners, causing that the text of an input field is selected,
 * when the element gets the focus.
 */
export function setInputAutoSelection() {
    const txtBoxes = Array.from($('input[type="text"], [type="number"], [type="email"]'));
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
export function setCheckboxBuddies(off = '') {
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
            // switch corresponding controls ON !
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
            // switch corresponding controls OFF !
            document.getElementById(buddy).disabled = !state;
        });
    }    
}

export function formatField(field, digits = 2) {
    const input = (field instanceof Event) ? field.target : $(field);
    input.value = Number(input.value).toFixed(digits);
}