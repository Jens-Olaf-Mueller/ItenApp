let appTitle = '',
    btnAdd,
    tileComponents,
    chkWaterproofed,
    txtDescription,
    arrSurface = [],
    oSurface = new Surface();
    
const clsWizard = new Wizard(FRM_MEASURE, href),
      clsSurvey = new Survey(FRM_MEASURE);

function initPageMeasure(caption) {  
    appTitle = caption;
    clsWizard.add($('.title'), caption);
    $('inpCreatedAt').value = getCurrentDate();
    Array.from($('[data-autocalc="inpAreaResult"]')).forEach(fld => {
        fld.addEventListener('input', displaySurfaceArea);
    });
    tileComponents = Array.from($('[name=tile-component]'));
    tileComponents.forEach(type => {
        type.addEventListener('click', getMeasuringType, type);
    });
    chkWaterproofed = $('chkWaterproved');
    chkWaterproofed.addEventListener('change', handleWaterproofedState);
    txtDescription = $('inpAreaName');
    txtDescription.addEventListener('input', validateSurface);
    btnAdd = $('btnAddArea');
    btnAdd.addEventListener('click', addNewSurface);
}

function displaySurfaceArea() {
    const txtResult = $('inpAreaResult');
    readInput();
    txtResult.value = (oSurface.area > 0.01) ?  oSurface.area.toFixed(2) : '';   
    validateSurface();
}

function handleWaterproofedState() {
    const waterProofedArea = $('inpWaterproved');
    if (chkWaterproofed.checked == false) {
        waterProofedArea.value = '';
    } else if (waterProofedArea.value == '') {
        displaySurfaceArea();
        oSurface.waterproofedArea = oSurface.area;
        waterProofedArea.value = oSurface.waterproofedArea.toFixed(2);
    }    
    validateSurface();
}

function validateSurface() {
    readInput();
    const state = oSurface.description.length > 2 &&
        oSurface.area > 0.01 &&
        (oSurface.waterproofed == false ||
        (oSurface.waterproofed && oSurface.waterproofedArea != 0));
    // btnAdd.innerHTML = arrSurface.length == 0 ? 'Fläche hinzufügen' : 'Weitere Fläche hinzufügen';
    btnAdd.disabled = !state;
    return state;
}

function addNewSurface() {
    let defHeight = oSurface.height,
        txtWaterproofed = $('inpWaterproved'); 
    arrSurface.push(oSurface);
    oSurface = new Surface(defHeight);
    txtDescription.value = '';
    $('inpAreaLenght').value = '';
    $('inpAreaWidth').value = '';
    $('inpAreaResult').value = '';
    chkWaterproofed.checked = false;
    txtWaterproofed.disabled = true;
    txtWaterproofed.value = '';
    btnAdd.disabled = true;
    sumArea();
}

function sumArea() {
    let areaTotal = 0;
    for (let i = 0; i < arrSurface.length; i++) {
        areaTotal += arrSurface[i].area;
    }
    $('inpSumArea').value = areaTotal.toFixed(2);
}

function readInput() {
    oSurface.description = txtDescription.value;
    oSurface.length = $('inpAreaLenght').value / 1000;
    oSurface.width = $('inpAreaWidth').value / 1000;
    oSurface.height = oSurface.width;
    oSurface.waterproofed = $('chkWaterproved').checked;
    oSurface.waterproofedArea = parseFloat(+$('inpWaterproved').value);    
}


function getMeasuringType(radiobox) {
    let concerns;
    if (radiobox == undefined) {
        for (let i = 0; i < tileComponents.length; i++) {
            if (tileComponents[i].checked) concerns = tileComponents[i].value;
        }
    } else {
        concerns = radiobox.target.value;
    }
    enableElements();
    return getWizardPages(concerns);
}



function getWizardPages(concerns) {
    let selector = `div.wizard[data-concerned="${concerns}"]`;
    let arrTest = $(selector);
    console.log(arrTest)
    let arr = Array.from($('.wizard'));
    if (concerns == undefined) return arr;

    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item.dataset.concerned.includes(concerns) == false) {
            console.log('Name: ' + item.dataset.name + ' removed', item.dataset.concerned)
            arr.splice(i, 1);
        }
    }
    enableElements(concerns);
    return arr;
}


function enableElements(concerns) {
    const dataElements = $('[data-concerned]'),
          lblWidth = $('lblWidth');
    // if parameter is omitted, we RESET ALL elements, since the radiobox has changed
    if (concerns === undefined) {
        for (let i = 0; i < dataElements.length; i++) {
            const element = dataElements[i];
            // skip the wizard-pages!
            if (!element.classList.contains('wizard')) {
                element.classList.remove('hidden');
            }
        }
        return;
    }
    
    for (let i = 0; i < dataElements.length; i++) {        
        const element = dataElements[i];
        // we don't hide the parent containers!
        if (!element.classList.contains('wizard')) {
            if (!element.dataset.concerned.includes(concerns)) {
                element.classList.add('hidden');
            }
        }        
    }

    if (concerns == 'wall') {
        lblWidth.innerHTML = 'Höhe';
    } else {
        lblWidth.innerHTML = 'Breite';
    }
     
}