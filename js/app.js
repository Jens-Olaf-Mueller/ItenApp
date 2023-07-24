import $, { includeHTML } from './library.js';
import { Project } from './classes/project_class.js';
import { Settings } from './classes/settings_class.js';
import { FormHandler } from './classes/library_class.js';
import { Calculator } from './classes/calculator_class.js';
import { renderLaunchPad, setCheckboxBuddies, setInputAutoSelection } from './main.js';
import { initSettings } from './settings.js';
import { initTools } from './tools.js';
import { initReports } from './report.js';
import { initPageHours } from './hours.js';

export const SETTINGS = new Settings();
export const CALCULATOR = new Calculator('../style/calculator_apple.css');
export const PROJECTS = [];

/**
 * creates constants containing informations about the current page
 */
 const {host, hostname, href, origin, pathname, port, protocol, search} = window.location;
 const queryString = search.substring(1);

/**
 * This starts the application after all content has been loaded
 */
window.addEventListener('DOMContentLoaded', runApp);
async function runApp() {
    await includeHTML();    
    // SETTINGS.load();
    // console.log(SETTINGS);
    resetForms();    
    if (href.includes('index')) renderLaunchPad(SETTINGS.homescreen);
    if (href.includes('settings')) initSettings('Einstellungen');
    if (href.includes('hours')) initPageHours('Stunden');

    if (href.includes('tools')) initTools(queryString);    
    if (href.includes('report')) initReports(queryString);
    if (href.includes('admin')) initAdmin(queryString);

    if (href.includes('calculator')) {
        $('h3Title').innerHTML = 'Taschenrechner';        
        CALCULATOR.stylesheet = '../style/' + SETTINGS.calculatorStyle;
        CALCULATOR.parent = 'mainCalculatorParent';
        CALCULATOR.show();
        return;
    }
    setCheckboxBuddies();
    setCheckboxBuddies('off'); // for those who switch corresponding controls off!
    setInputAutoSelection();
    loadProjects();
}

/**
 * loads the projects from server...
 */
async function loadProjects() {
    for (let i = 0; i < 2; i++) {
        const proj = new Project(null, PROJECTS.length);
        proj.description = (i == 0) ? 'Magazin' : (i == 1) ? 'Ausstellung / Büro' : '';
        if (i == 1) {
            proj.location.street = 'Zugerstrasse';
            proj.location.location = 'Unterägeri';
        }
        PROJECTS.push(proj); 
    }

    // just for testing...
    ['Villa Hotz','Eichmattpark','Quadrolith','Ahornstrasse 22','Ahornstrasse 20','Sprungstrasse 15'].forEach(prj => {
        const proj = new Project(null, PROJECTS.length);
        proj.description = prj;
        PROJECTS.push(proj); 
    });

    // console.log(PROJECTS)
}

/**
 * Resets all HTML-forms to a defined shape and hides them.
 */
function resetForms() {
    const forms = $('form');
    if (forms == null) return;
    const frmHdl = new FormHandler();
    let arrForms = [];
    if (forms instanceof NodeList || forms instanceof HTMLCollection) {
        arrForms = Array.from(forms);
    } else {
        arrForms.push(forms);
    }
    arrForms.forEach(frm => {
        frmHdl.setAttributes(frm, {
            hidden: '', 
            method: 'get', 
            autocomplete: 'off', 
            onsubmit: 'return false'});
    });
}