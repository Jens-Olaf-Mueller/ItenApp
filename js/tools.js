'use strict';
import $ from './library.js';
import { SETTINGS } from './app.js';
import { initPageMeasure} from './tools_measure.js';
import { Material } from './classes/material_class.js';
import { FormHandler } from './classes/library_class.js';
import { Wizard } from './classes/wizard_class.js';

const clsMaterialWizard = new Wizard('frmMaterial', 'material');
const frmMATERIAL = new FormHandler('frmMaterial'),
      frmMEASURE = new FormHandler('frmMeasure');

      const clsInput = new Material('frmMaterial');

function initTools(tool) {
    switch (tool) {
        case 'material':
            frmMATERIAL.show(); 
            initMaterialCalcuator('Materialrechner');        
            break;
        case 'measure': 
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
        {element: 'btnCalculate', event: 'click', func: displayCalculationResult},
        {element: 'btnCloseResult', event: 'click', func: function() {
            $('divResult').classList.add('hidden');
        }},
        {element: 'btnReset', event: 'click', func: function() {
            window.location.reload();
        }},
        {element: Array.from($('[data-autocalc="inpArea"]')), 
         event: 'input', func: displayArea}
    );
}


/**
 * Fills the form with the defaults from user settings or previous inputs
 */
function loadDefaultSettings() {
    $('inpTileLength').value = SETTINGS.defaultlength;
    $('inpTileWidth').value = SETTINGS.defaultwidth;
}


function displayArea() {
    clsInput.applyChanges();
    const input = $('inpArea');
    input.value = (clsInput.area > 0.01) ? clsInput.area.toFixed(2) : '';
    toggleCalculationButton(input);
}

function displayCalculationResult() {
    clsInput.applyChanges();
    if (clsInput.area == 0) return; 
    $('divResult').classList.remove('hidden');    
    $('cellGlue').innerText = clsInput.glue;
    $('cellBags').innerText = Math.ceil(clsInput.glue / 25) + ' Sack';
    $('cellJoints').innerText = clsInput.grout;
    $('cellTiles').innerText = clsInput.tiles;
}


/**
 * Enables or disables the button to execute the material calculation.
 * If an area greater than 0.01 square metres is computed,
 * the button will be enabled, otherwise disabled.
 */
function toggleCalculationButton(expression) {
    const input = (expression instanceof Event) ? expression.target : expression,
          btnCalc = $('btnCalculate');
    // if (parseFloat(this.value) > 0.01) {
    if (parseFloat(input.value) > 0.01) {
        btnCalc.removeAttribute('disabled');        
    } else {
        btnCalc.setAttribute('disabled','');
    }
}

export { initTools };