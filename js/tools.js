
console.log('Settings in Tools', SETTINGS )

initPage();

function initPage() {
    let form;
    switch (queryString) {
        case 'material': form = $('frmMaterial');           
            break;
        case 'measure': form = $('frmMeasure');           
            break;
        case 'calculator': form = $('frmCalculator');           
            break;
    }
    form.classList.remove('hidden');
}

function round(value, decimals = 0) {
    const dec = decimals * 10;
    if (dec == 0) return Math.round(value + Number.EPSILON);
    return Math.round((value + Number.EPSILON) * dec) / dec;
}