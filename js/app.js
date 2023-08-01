import $, { includeHTML } from './library.js'; // import * as Library from './library.js';
import { renderLaunchPad, setCheckboxBuddies, setInputAutoSelection } from './main.js';
import { Project } from './classes/project_class.js';
import Settings from './classes/settings_class.js';
import { FormHandler } from './classes/library_class.js';
import initSettings from './settings.js';
import initTools from './tools.js';
import initHoursRecording from './hours.js';
import initReports from './report.js';
import initCalculator from './calculator.js';

export const SETTINGS = new Settings();
export const PROJECTS = [];
export const EMPLOYEES = [];

export const isDebugmode = true;

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
    resetForms();    
    if (href.includes('index')) {
        if (!SETTINGS.setupDone) window.location.replace('settings.html');
        renderLaunchPad(SETTINGS.homescreen);
        return;
    } else if (href.includes('calculator')) {
        initCalculator();
        return;
    }
    if (href.includes('tools')) initTools(queryString);  

    if (href.includes('settings')) initSettings('Einstellungen');
    if (href.includes('hours')) initHoursRecording('Stunden');
    if (href.includes('report')) initReports(queryString);
    // if (href.includes('admin')) initAdmin(queryString);
    setCheckboxBuddies();
    setCheckboxBuddies('off'); // for those who switch corresponding controls off!
    setInputAutoSelection();
    loadEmployeesFromServer();
    loadProjectsFromServer();
}

async function loadEmployeesFromServer() {
    if (isDebugmode) console.log('Todo: Loading employees from server... ');
}

/**
 * loads the projects from server...
 */
async function loadProjectsFromServer() {
    if (isDebugmode) console.log('Todo: Loading projects from server... ');
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