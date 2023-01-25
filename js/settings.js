const clsWizard = new Wizard('frmSettings', href);

function initSettings(caption) {
    clsWizard.add($('.title'), caption);
    SETTINGS.form = 'frmSettings';
    SETTINGS.load();
    console.log('Settings nach Form:', SETTINGS );
}