import $, { includeHTML } from './library.js';
import { FormHandler } from './classes/library_class.js';
import MessageBox from './classes/messagebox_class.js';

const FRM_SITES = new FormHandler('frmSites'),
      FRM_LOGIN = $('frmLogin');

const LOGIN_PASSWORD = 'Iten', USER_NAME = 'Olaf';

const msgBox = new MessageBox('./style/msgbox.css');

export default function initAdmin() {
    FRM_SITES.show();
    $('btnLogin').addEventListener('click', showAdminScreen);
    $('btnSaveSite').addEventListener('click', saveNewProject);
    $('inpProjectYear').value = new Date().getFullYear();
}

function showAdminScreen() {
    if ($('txtLoginPassword').value == LOGIN_PASSWORD && $('inpUsername').value == USER_NAME) {
        // FRM_LOGIN.classList.add('hidden'); 
        FRM_SITES.classList.remove('hidden');
    }
}

async function saveNewProject() {
    const site = new Project(FRM_SITES);
    // Formulardaten einlesen wie in Class Settings!
    if (await msgBox.show('Änderungen speichern?','Bitte bestätigen!','Ja, Nein') == 'Ja') {
        FRM_SITES.classList.add('hidden');
    }
}