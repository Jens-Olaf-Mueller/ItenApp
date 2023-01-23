const clsWizard = new Wizard('frmSettings', href);

// console.log('Settings ', SETTINGS );

function initSettings(caption) {
    clsWizard.add($('.title'), caption);
}