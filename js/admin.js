const FRM_ADMIN = $('frmSites'),
      FRM_LOGIN = $('frmLogin');

const LOGIN_PASSWORD = 'Iten', USER_NAME = 'Olaf';

const msgBox = new MessageBox('../style/msgbox.css');

function initAdmin() {
    FRM_ADMIN.classList.remove('hidden');
    // FRM_LOGIN.classList.remove('hidden');
    $('btnLogin').addEventListener('click', showAdminScreen);
    $('btnSaveSite').addEventListener('click', saveNewProject);
    $('inpProjectYear').value = new Date().getFullYear();
}

function showAdminScreen() {
    if ($('txtLoginPassword').value == LOGIN_PASSWORD && $('inpUsername').value == USER_NAME) {
        FRM_LOGIN.classList.add('hidden'); 
        FRM_ADMIN.classList.remove('hidden');
    }
}

async function saveNewProject() {
    const site = new Project(FRM_ADMIN);
    // Formulardaten einlesen wie in Class Settings!
    if (await msgBox.show('Änderungen speichern?','Bitte bestätigen!','Ja, Nein') == 'Ja') {
        FRM_ADMIN.classList.add('hidden');
    }
}