const BTN_CALC = $('btnCalculate'),
      BTN_CLOSE = $('btnClose'),
      BTN_RESET = $('btnReset'),
      INP_LENGHT = $('inpLenght'),
      INP_WIDTH = $('inpWidth'),
      ARR_INPUT = Array.from($('input')),
      RESULT = {
          parent: $('divResult'),
          glue: $('cellGlue'),
          joints: $('cellJoints'),
          tiles: $('cellTiles'),
          bags: $('cellBags')
      };

let oInput = {
    lenght: 0,
    width: 0,
    area: 0,
    trowel: 0,
    buttering: false,
    unit: 0,
    tiles: {length: 0, width: 0, area: 0, waste: 0},
    joints: {width: 0, depths: 0, length: 0},
    diagonal: false
}

initPage();

function initPage() {
    setEventListeners();
}

function setEventListeners() {
    BTN_CLOSE.addEventListener('click', function() {
        RESULT.parent.classList.add('hidden');
    });
    BTN_CALC.addEventListener('click', calculate);
    BTN_RESET.addEventListener('click', ()=> {
        window.location.reload();
    });
    INP_LENGHT.addEventListener('input', calcArea);
    INP_WIDTH.addEventListener('input', calcArea);
    ARR_INPUT.forEach(inp => {
        inp.addEventListener('click', function() {
            this.select();
        })
    });
}

function calculate() {
    calcArea();
    if (oInput.area == 0) return;
    let glue = oInput.area * oInput.trowel,
        tiles = Math.ceil(1/oInput.tiles.area * oInput.area);
    tiles = Math.ceil(tiles + tiles * oInput.tiles.waste);
    // 1700 ist die Dichte in kg/m³
    let grout = oInput.area * oInput.joints.length * oInput.joints.width * oInput.joints.depths * 1700;
    grout = round(grout + grout * 0.05, 1);
    glue = oInput.buttering ? round(glue + glue * 0.25,0) : round(glue, 0);
    displayResult(glue, grout, tiles);
}

function calcArea() {
    readUserInput();
    if (oInput.lenght != 0 && oInput.width != 0) {
        oInput.area = oInput.lenght * oInput.width;
    } else if (oInput.area == 0) {
        oInput.area = '';
    }
    $('inpArea').value = oInput.area;
}

function displayResult(glue, grout, tiles) {
    RESULT.parent.classList.remove('hidden');
    RESULT.glue.innerHTML = glue;
    RESULT.bags.innerHTML = Math.ceil(glue/25) + ' Sack';
    RESULT.joints.innerHTML = grout;
    RESULT.tiles.innerHTML = tiles;
}

function readUserInput() {    
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
        oInput.joints.length = parseInt(SQR2 / oInput.tiles.width + SQR2 / oInput.tiles.length + SQR2 / 2);
    } else {
        oInput.joints.length = parseInt(1 / oInput.tiles.width + 1 / oInput.tiles.length); 
    }
}
