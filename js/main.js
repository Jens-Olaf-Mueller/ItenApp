/**
 * creates constants containing informations about the current page
 */
const {
    host, hostname, href, origin, pathname, port, protocol, search
} = window.location;

// includeHTML();

// const menu = document.getElementsByClassName('menuHH')[0];
// const menuItems = document.getElementsByClassName('navbar-links')[0];

// menu.addEventListener('click', () => {
//     menuItems.classList.toggle('active');
// })

runApp();

function runApp() {
    loadHeader();
    if(href.includes('index.html')) createMainMenu();
}

function loadHeader() {
    let mnuHH = '', mnuNavBar = '', title = 'Home';
    for (let i = 0; i < 3; i++) {
        mnuHH += `<span class="bar"></span>`;
    }
    for (let i = 0; i < 5; i++) {
        const caption = MENUS[SETTINGS.language].desktop[i];
        mnuNavBar += `<li><a href="${PAGES[i]}.html">${caption}</a></li>`;
        if (href.includes(PAGES[i])) title = caption;
    }
    $('header').innerHTML = `
        <div class="firma"><img src="./img/logo.jpg" alt="Logo" height="48px"></div>
        <h1 id="menu-title">${title}</h1>
        <a href="#" class="menuHH">${mnuHH}</a>
        <nav class="navbar"><div class="navbar-links"><ul>${mnuNavBar}</ul></div></nav>`;
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
/**
 * Bindet Header & Footer einer Seite ein.
 * @returns 
 */
// function includeHTML() {
//     let colElements, i, element, file, xhttp;
//     // alle HTML-Elemente (Tag-Name = "*") iterativ durchlaufen:
//     colElements = document.getElementsByTagName("*");
//     for (i = 0; i < colElements.length; i++) {
//         element = colElements[i];
//         // Elemente mit Attribut 'w3-include-html' suchen:
//         file = element.getAttribute("w3-include-html");
//         if (file) {
//             // http-Anfrage starten mit Attribut-Wert als Filenamen:
//             xhttp = new XMLHttpRequest();
//             xhttp.onreadystatechange = function() {
//                 if (this.readyState == 4) {
//                     if (this.status == 200) {element.innerHTML = this.responseText;}
//                     if (this.status == 404) {element.innerHTML = "Page not found.";}
//                     // Attribut entfernen und Funktion erneut (rekursiv) aufrufen
//                     element.removeAttribute("w3-include-html");
//                     includeHTML();
//                 }
//             }      
//             xhttp.open("GET", file, true);
//             xhttp.send();
//             return;
//         }
//     }
// };