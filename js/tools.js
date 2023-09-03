'use strict';
import $ from './library.js';
import { SETTINGS } from './app.js';
import { Material } from './classes/material_class.js';
import FormHandler from './classes/formhandler_class.js';
import Calculator from './classes/calculator_class.js';
      

const material = new Material('frmMaterial');
const calculator = new Calculator();

export default function initTools(tool) {
    switch (tool) {
        case 'material':
            initMaterialCalcuator('Materialrechner');        
            break;
        case 'order':
            initOrder('Bestellung');
            break;
        default: return;
    }
}


function initMaterialCalcuator(caption = 'Materialrechner') {
    const frmMATERIAL = new FormHandler('frmMaterial');
    frmMATERIAL.show();
    frmMATERIAL.wizard.caption = caption;
    frmMATERIAL.wizard.buttonsVisible = 'send|refresh';
    loadDefaultSettings();
    toggleCalculationButton($('inpArea')); // disables send button
    // set event listeners at the end!!!
    frmMATERIAL.addEvents(
        {element: 'inpArea', event: 'input', func: toggleCalculationButton},
        {element: 'imgSend', event: 'click', func: displayResult},
        {element: 'imgCalcButton', event: 'click', func: showCalculator},
        {element: 'btnCloseResult', event: 'click', 
            func: () => $('divResult').classList.add('hidden')},
        {element: 'imgRefresh', event: 'click', func: () => window.location.reload()},
        {element: Array.from($('[data-autocalc="inpArea"]')), 
            event: 'input', func: displayCalculatedArea},
        {element: window.document, event: 'onresult', 
            func: () => toggleCalculationButton($('inpArea'))},
        {element: Array.from($('select[name="unit"]')),
            event: 'change', func: changeUnits}
    );
}


function initOrder(caption = 'Bestellung') {
    const frmORDER = new FormHandler('frmOrder');
    frmORDER.show();
    frmORDER.wizard.caption = caption;
    frmORDER.wizard.buttonsVisible = 'send';
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
    $('imgCalcButton').toggleAttribute('hidden', !SETTINGS.showCalculatorIcon);
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
          btnCalc = $('imgSend'),
          invalid = (input.value == '') || (parseFloat(input.value) < 0.020);
    btnCalc.toggleAttribute('disabled', invalid);
}

function changeUnits() {
    Array.from($('select[name="unit"]')).forEach(elmt => elmt.value = this.value);
    displayCalculatedArea();
}