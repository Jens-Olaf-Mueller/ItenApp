'use strict';
import $ from './library.js';
import { SETTINGS } from './app.js';
import { initPageMeasure} from './tools_measure.js';
import { Material } from './classes/material_class.js';
import { FormHandler } from './classes/library_class.js';
import { Wizard } from './classes/wizard_class.js';
import Calculator from './classes/calculator_class.js';

const clsMaterialWizard = new Wizard('frmMaterial', 'material');
const frmMATERIAL = new FormHandler('frmMaterial'),
      frmMEASURE = new FormHandler('frmMeasure');

const material = new Material('frmMaterial');
const calculator = new Calculator();

export default function initTools(tool) {
    switch (tool) {
        case 'material':
            frmMATERIAL.show(); 
            initMaterialCalcuator('Materialrechner');        
            break;

        case 'measure': 
        debugger
            frmMEASURE.show();
            initPageMeasure('Ausmass');        
            break;
        default: return;
    }
}


function initMaterialCalcuator(title) {
    $('h3Title').innerHTML = title;
    loadDefaultSettings();
    // set event listeners at the end!!!
    frmMATERIAL.addEvents(
        {element: 'inpArea', event: 'input', func: toggleCalculationButton},
        {element: 'btnCalculate', event: 'click', func: displayResult},
        {element: 'imgCalcButton', event: 'click', func: showCalculator},
        {element: 'btnCloseResult', event: 'click', func: function() {
            $('divResult').classList.add('hidden');
        }},
        {element: 'btnReset', event: 'click', func: function() {
            window.location.reload();
        }},
        {element: Array.from($('[data-autocalc="inpArea"]')), 
            event: 'input', func: displayCalculatedArea},
        {element: window.document, event: 'onresult', func: function() {
            toggleCalculationButton($('inpArea'));
        }},
        {element: Array.from($('select[name="unit"]')),
            event: 'change', func: changeUnits}
    );
}


/**
 * Fills the form with the defaults from user settings or previous inputs
 */
function loadDefaultSettings() {
    $('inpTileLength').value = SETTINGS.defaultlength;
    $('inpTileWidth').value = SETTINGS.defaultwidth;
    $('inpJointWidth').value = SETTINGS.jointWidth;
    $('inpJointDepth').value = SETTINGS.jointDepth;
    $('inpOffcut').value = SETTINGS.offcut;
    if (SETTINGS.showCalculatorIcon) {
        $('imgCalcButton').removeAttribute('hidden');
    } else {
        $('imgCalcButton').setAttribute('hidden');
    }
}


/**
 * Displays the calculated area from input length and width.
 * Switches the calculation button on | off depending on the result is greater than 0.01
 */
function displayCalculatedArea() {
    material.applyChanges();
    const input = $('inpArea');
    input.value = (material.area > 0.01) ? material.area.toFixed(2) : '';
    toggleCalculationButton(input);
}


/**
 * Displays the calculated material as an overlayed table
 */
function displayResult() {
    material.applyChanges();
    if (material.area == 0) return; 
    $('cellArea').innerHTML = `Für ${material.area.toFixed(2)} m² werden benötigt:`;
    $('divResult').classList.remove('hidden');    
    $('cellGlue').innerText = material.glue;
    $('cellBags').innerText = Math.ceil(material.glue / 25) + ' Sack';
    $('cellJoints').innerText = material.grout;
    $('cellTiles').innerText = material.tiles;
    if (material.levelHeight) {
        const unit = (material.levelCompound < 10000) ? 'kg' : 'to';
        $('cellLevelCompound').innerHTML = 'Nivelliermasse';
        $('cellLevel').innerText = (unit == 'kg') ? material.levelCompound : material.levelCompound / 1000;
        $('cellLevelUnit').innerHTML = unit;
        $('cellLevelBags').innerText = Math.ceil(material.levelCompound / 25) + ' Sack';
    }
}


/**
 * Shows the calculator in order to do interim calculations
 */
 function showCalculator() {
    if (this.hasAttribute('disabled')) return;
    const buddy = $('inpArea');
    calculator.stylesheet = './style/' + SETTINGS.calculatorStyle;
    calculator.parent = 'frmMaterial';
    calculator.show(buddy);
}


/**
 * Enables or disables the button to execute the material calculation.
 * If an area greater than 0.01 square metres is computed,
 * the button will be enabled, otherwise disabled.
 */
function toggleCalculationButton(expression) {
    const input = (expression instanceof Event) ? expression.target : expression,
          btnCalc = $('btnCalculate'),
          invalid = (parseFloat(input.value) < 0.020);
    btnCalc.toggleAttribute('disabled', invalid);
}

function changeUnits() {
    Array.from($('select[name="unit"]')).forEach(elmt => elmt.value = this.value);
    displayCalculatedArea();
}