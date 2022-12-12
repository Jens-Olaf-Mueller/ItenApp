const BTN_CALC = $('btnCalculate'),
      BTN_RESET = $('btnReset',)
      RESULT = $('h3Result'),
      INP_LENGHT = $('inpLenght'),
      INP_WIDTH = $('inpWidth'),
      ARR_INPUT = Array.from($('input'));
BTN_CALC.addEventListener('click', calculate);
BTN_RESET.addEventListener('click', resetForm)
INP_LENGHT.addEventListener('input', calcArea);
INP_WIDTH.addEventListener('input', calcArea);

ARR_INPUT.forEach(inp => {
    inp.addEventListener('click', function() {
        this.select();
    })
});

console.log('Settings in Tools', SETTINGS )

let oInput = {
    lenght: 0,
    width: 0,
    area: 0,
    trowel: 0,
    buttering: false,
    unit: 0,
    tiles: {length: 0, width: 0, area: 0, waste: 0},
    joints: {width: 0, depths: 0, sumLength: 0},
    diagonal: false
}



function calculate() {
    calcArea();
    let glue = oInput.area * oInput.trowel,
        tiles = Math.ceil(1/oInput.tiles.area * oInput.area);
    tiles = Math.ceil(tiles + tiles * oInput.tiles.waste);
    // 1700 ist die Dichte in kg/m³
    let jointKg = oInput.area * oInput.joints.sumLength * oInput.joints.width * oInput.joints.depths * 1700;
    jointKg = round(jointKg + jointKg * 0.05, 1);
    glue = oInput.buttering ? round(glue + glue * 0.25,0) : round(glue, 0) ;
    RESULT.innerHTML = `Kleber:            ${glue} kg (= ${Math.ceil(glue/25)} Sack)<br>
                        Fugenmasse:    ${jointKg} kg<br>
                        Platten:          ${tiles} Stk.`;
}

function calcArea() {
    getInput();
    if (oInput.lenght != 0 && oInput.width != 0) {
        oInput.area = oInput.lenght * oInput.width;
    } else if (oInput.area == 0) {
        oInput.area = '';
    }
    $('inpArea').value = oInput.area;
}

function resetForm() {
    window.location.reload();
    RESULT.innerHTML = '';
}

function getInput() {    
    oInput.lenght = $('inpLenght').value / 1000;
    oInput.width = $('inpWidth').value / 1000;
    oInput.area = $('inpArea').value;
    oInput.trowel = $('selTrowel').value;
    oInput.buttering =$('chkContact').checked;
    oInput.tiles.length = $('inpTileLenght').value / 1000;
    oInput.tiles.width = $('inpTileWidth').value / 1000;
    oInput.tiles.waste = $('inpWaste').value / 100;
    oInput.tiles.area = oInput.tiles.length * oInput.tiles.width;
    oInput.joints.width = $('inpJointWidth').value / 1000;
    oInput.joints.depths = $('inpJointDepth').value / 1000;
    oInput.diagonal = $('chkDiagonal').checked;
    calcJoints();
}

function calcJoints() {    
    const SQR2 = Math.sqrt(2);
    if (oInput.diagonal) { // diagonal = mehr Fugenlänge! Diagonale eines Rechteckes ist länger!
        oInput.joints.sumLength = parseInt(SQR2 / oInput.tiles.width + SQR2 / oInput.tiles.length + SQR2 / 2);
    } else {
        oInput.joints.sumLength = parseInt(1 / oInput.tiles.width + 1 / oInput.tiles.length); 
    }
}

function round(value, decimals = 0) {
    const dec = decimals * 10;
    if (dec == 0) return Math.round(value + Number.EPSILON);
    return Math.round((value + Number.EPSILON) * dec) / dec;
}