let inpArea, btnCalc;
const clsInput = new Material(FRM_MATERIAL);
const clsOutput = new Output();

function initMaterialCalcuator(title) {
    $('.title').innerHTML = title;
    clsOutput.parent = 'divResult';

    $('btnCloseResult').addEventListener('click', function() {
        clsOutput.parent.classList.add('hidden');
    });

    $('chkArea').addEventListener('click', toggleFields)
    inpArea = $('inpArea');
    inpArea.addEventListener('input', enableCalculationButton);
    
    btnCalc = $('btnCalculate');
    btnCalc.addEventListener('click', displayResult);

    $('btnReset').addEventListener('click', ()=> {
        window.location.reload();
    });

    Array.from($('[data-autocalc="inpArea"]')).forEach(fld => {
        fld.addEventListener('input', displayArea);
    });
}


function displayArea() {
    clsInput.readUserInput();
    if (clsInput.area > 0.01) {        
        inpArea.value = clsInput.area.toFixed(2);
    } else {
        inpArea.value = '';
    }
    enableCalculationButton();
}

function displayResult() {
    clsInput.readUserInput();
    if (clsInput.area == 0) return;    
    clsOutput.parent.classList.remove('hidden');
    clsOutput.display('cellGlue', clsInput.glue);
    clsOutput.display('cellBags', Math.ceil(clsInput.glue / 25), ' Sack');
    clsOutput.display('cellJoints', clsInput.grout);
    clsOutput.display('cellTiles', clsInput.tiles.count);
}


function enableCalculationButton() {
    if (parseFloat(+inpArea.value) > 0.01) {
        btnCalc.removeAttribute('disabled');        
    } else {
        btnCalc.setAttribute('disabled','');
    }
}

function toggleFields(checkbox) {
    let state = checkbox.target.checked;
    $('inpLength').disabled = state;
    $('inpWidth').disabled = state;
}