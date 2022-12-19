const BTN_WIZARD = Array.from($('.btn-wizard'));
const TILETYPES = Array.from($('[name=tiletype]'));

let wizardPage = 0;

initPage();

function initPage() {
    BTN_WIZARD.forEach(btn => {
        btn.addEventListener('click', moveWizard, btn);
    });
    TILETYPES.forEach(type => {
        type.addEventListener('click', getMeasuringType, type);
    });

    $('inpCreatedAt').value = getCurrentDate();
}


function getMeasuringType(radiobox) {
    let concerns;
    if (radiobox == undefined) {
        for (let i = 0; i < TILETYPES.length; i++) {
            if (TILETYPES[i].checked) concerns = TILETYPES[i].value;
        }
    } else {
        concerns = radiobox.target.value;
    }
    return getWizardPages(concerns);
}

function moveWizard(button) {
    const step = parseInt(button.target.value),
          lastPage = getMeasuringType().length - 1;
    wizardPage += step;
    if (wizardPage < 1) {
        wizardPage = 0;
        BTN_WIZARD[0].setAttribute('disabled', 'disabled');
    } else if (wizardPage >= lastPage) {
        wizardPage = lastPage;
        BTN_WIZARD[1].classList.add('hidden');
        $('btnSend').classList.remove('hidden');
    } else {
        BTN_WIZARD[0].removeAttribute('disabled');
        BTN_WIZARD[1].classList.remove('hidden');
        $('btnSend').classList.add('hidden');
    }
    displayWizardPage(wizardPage);

    console.log(wizardPage + ' / ' + lastPage )
}

function displayWizardPage(page) {
    let arrPages = getMeasuringType();
    arrPages.forEach(pge => {
        pge.classList.add('hidden');
    });
    arrPages[page].classList.remove('hidden');
}

function getWizardPages(includes) {
    let arr = Array.from($('.wizard'));
    if (includes == undefined) return arr;

    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item.dataset.concerned.includes(includes) == false) {
            arr.splice(i, 1);
        }
    }
    return arr;
}
