/**
 * creates constants containing informations about the current page
 */
const {
    host, hostname, href, origin, pathname, port, protocol, search
} = window.location;

const queryString = location.search.substring(1);
const ARR_CHECKBOXES = Array.from($('input[type="checkbox"'));


// const menu = document.getElementsByClassName('menuHH')[0];
// const menuItems = document.getElementsByClassName('navbar-links')[0];

// menu.addEventListener('click', () => {
//     menuItems.classList.toggle('active');
// })

runApp();

function runApp() {
    loadHeader();
    setEventListeners();
    // if(href.includes('index.html')) createMainMenu();
}


function createMainMenu() {
    const main = $('main'),
          menu = MENUS[SETTINGS.language].main;
    main.innerHTML = '';
    for (let i = 0; i < menu.length; i++) {
        main.innerHTML += `<a href = "${TILES[i]}.html">
            <div class="tiles flx-ccc">${menu[i]}</div>
        </a>`;
    }
}

function loadHeader() {
    let mnuHH = '', subMenus = [], links = [], title = 'Home';

    for (let mnu = 0; mnu < 2; mnu++) {
        links[mnu] = '';
        for (let i = 0; i < 3; i++) {
            // creating the mobile menu button
            if(mnu) mnuHH += `<span class="bar"></span>`;
            let url = MNU_ITEMS[mnu].url + '?' + MNU_ITEMS[mnu].param[i];
            links[mnu] += `<li><a href="${url}">${MNU_ITEMS[mnu].items[i]}</a></li>`;
        }
        subMenus[mnu] = renderDropdownMenu(MNU_ITEMS[mnu].caption, links[mnu]); 
    }

    $('header').innerHTML = ` 
        <div class="logo"> <a href="index.html"><img src="./img/logo.png" alt="logo"></a></div>
        <h3 class="title">Home</h3><nav>
        <input type="checkbox" id="mnuHH">
        <label for="mnuHH" class="mnuMobile"> ${mnuHH} </label>
        <ul> <li><a href="hours.html">Stunden</a></li> 
            ${subMenus[0]}${subMenus[1]} <li><a href="settings.html">Einstellungen</a></li> 
        </ul></nav>`;
}

function renderDropdownMenu(caption, mnuItem) {
    return `<li class="expandable_li">
                <input type="radio" id="opt${caption}" name="optDropdown">
                <label for="opt${caption}">${caption}</label>
                <ul class="dropdown-mnu"> 
                    ${mnuItem} 
                </ul>
            </li>`;
}

function getCurrentDate(date = new Date()) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function setEventListeners() {
    ARR_CHECKBOXES.forEach(chk => {
        chk.addEventListener('click', switchBuddy);
    });
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
    if (checkbox.target.dataset.buddy === undefined) return;
    const buddies = checkbox.target.dataset.buddy.split(' ');
    buddies.forEach(buddy => {
        document.getElementById(buddy).disabled = !checkbox.target.checked;
    });     
}