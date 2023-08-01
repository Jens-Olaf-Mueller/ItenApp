'use strict';
import $ from './library.js';
import { initDropDownlist } from './library.js';
import { SETTINGS } from './app.js';
import { formatField } from './main.js';
import { DROPLIST } from './const.js';
import { Wizard } from './classes/wizard_class.js';
import MessageBox from './classes/messagebox_class.js';
import Worktime from './classes/worktime_class.js';


const clsWizard = new Wizard('frmSettings', 'settings'), 
      msgBox = new MessageBox('../style/msgbox.css'),
      HOURS = new Worktime();

export default function initSettings(caption) {
    clsWizard.action = 'save';
    clsWizard.add($('h3Title'), caption);
    initDropDownlist('selProfession', DROPLIST.employees); // before settings !!
    renderWeekdays();
    SETTINGS.form = 'frmSettings';
    SETTINGS.show();
    SETTINGS.load();
    applyWeekdaySettings();
    // Event listeners AFTER settings are loaded!!!
    SETTINGS.addEvents(
        {element: document, event: 'onwizard', func: executeWizardEvent},
        {element: Array.from($('.image-button, [data-edit]')), 
            event: 'click', func: showTimeEditor},
        {element: Array.from($('input[data-autocalc]')),
            event: 'input', func: calculateHours},
        {element: Array.from($('input[name="season"]')),
            event: 'change', func: displaySeasonWeekdays},
        {element: Array.from($('input[name="calculatorStyle"]')),
            event: 'change', func: setCalculatorPreviewImage}
    );
    displaySeasonWeekdays($('input[name="season"]:checked'));
    setCalculatorPreviewImage($('input[name="calculatorStyle"]:checked'));
}


/**
 * Displays the input fields depending on the choosen season (summer | winter)
 * @param {event | HTMLInputElement} season Param is passed either
 * by click event of the radio button or after loading settings.
 */
function displaySeasonWeekdays(season) {    
    const input = (season instanceof Event) ? season.target.value : season.value,
          weekdays = $('[data-season]');
    hideTimeEditor();
    for (let i = 0; i < weekdays.length; i++) {
        const visible = weekdays[i].dataset.season !== input;
        weekdays[i].toggleAttribute('hidden', visible)
    };
}


function applyWorkingHours() {
    const output = $(this.alt);
    const inputs = Array.from($('input[data-autocalc]')).map(inp => inp.value);
    let i = 0;
    ['from','until','breakfast','lunch'].forEach(set => {
        output.setAttribute(`data-${set}`, inputs[i]);
        i++;
    });
    output.value = HOURS.hours(inputs[0],inputs[1],inputs[2],inputs[3]).toFixed(2);
    hideTimeEditor();
}


function calculateHours(source) {
    console.log(this)
    debugger

    const inputs = Array.from($('input[data-autocalc]')).map(inp => inp.value),
          output = $(this.dataset.autocalc);
    output.value = HOURS.hours(inputs[0],inputs[1],inputs[2],inputs[3]).toFixed(2);
    updateWeeklyHours();
}

function updateWeeklyHours() {
    const season = $('input[name="season"]:checked').value;
    const weekDays = Array.from($(`input[name="weekdays"][data-season=${season}]`));
    let hours = 0;
    for (let i = 0; i < weekDays.length; i++) {
        hours += Number(weekDays[i].value);       
    }
    $('inpHoursWeekly').value = hours.toFixed(2);
}

function hideTimeEditor(source) {
    $('divDropEditWorktime').setAttribute('hidden','');
    Array.from($('.image-button, [data-edit]')).forEach(pen => 
        pen.removeAttribute('disabled')
    );
    $('.edit-mode').forEach(elmt => elmt.classList.remove('edit-mode'));
    $('imgCancelEditor').removeEventListener('click', hideTimeEditor);  // ???
    $('imgCancelEditor').removeEventListener('click', applyWorkingHours);  // ???
    if (source instanceof Event && source.target.id == 'imgCancelEditor') {
        // restore old settings: 'alt'-attribute of cancel-image contains destination-ID!
        $($('imgCancelEditor').alt).value = $('inpCache').value;
    }
    updateWeeklyHours();    
}


/**
 * Displays the schedule editor for the selected day.
 * Day will be highlighted and the pen set to green color to indicate the editor mode.
 */
 function showTimeEditor() {
    if (this.hasAttribute('disabled')) return;
    const day = Number(this.dataset.edit),
          editor = $('divDropEditWorktime'), parent = this.closest('div.control'),
          label = this.nextElementSibling,
          btnOK = $('imgApplyChanges'), btnCancel = $('imgCancelEditor'),
          outputID = 'inp' + $('input[name="season"]:checked').value + day;
    btnOK.alt = outputID;
    btnCancel.alt = outputID;
    editor.removeAttribute('hidden');
    editor.style.top = 13 + day * 2.74 + 'rem';
        // TODO Evl. anders lösen --> element.clientTop...?
        const top = 10.74 + day * 2.74 + 'rem';
        document.querySelector(':root').style.setProperty('--edit-top', top);
    // switch background to lightgreen
    [this, parent, label].forEach(elmt => elmt.classList.add('edit-mode'));
    // disabling the pens!
    Array.from($('.image-button, [data-edit]')).forEach(pen => pen.setAttribute('disabled',''));
    // search the correct input field for the calculated hours
    Array.from($('input[data-autocalc]')).forEach(inp => inp.setAttribute('data-autocalc', outputID));
    // load data-set-informations from input element
    applyDatasToEditor($(outputID));
    // add listener to close- and confirmation button ONCE!    
    btnCancel.addEventListener('click', hideTimeEditor);
    btnOK.addEventListener('click', applyWorkingHours);
}


function applyDatasToEditor(output) {
    $('inpCache').value = output.value; // save old input value
    $('inpStartWork').value = output.dataset.from;
    $('inpEndWork').value = output.dataset.until;
    $('inpBreakfast').value = output.dataset.breakfast;
    $('inpLunch').value = output.dataset.lunch;
}


/**
 * Displays the preview image of the selected calculator.
 * This can be triggered from loading the settings or selecting another image.
 * @param {object | event} expression the object or event that triggers this function
 */
function setCalculatorPreviewImage(expression) {
    const input = (expression instanceof Event) ? expression.target : expression;
    $('imgCalcPreview').src = './img/' + input.value.slice(0,-3) + 'jpg';
}

async function executeWizardEvent(event) {
    if (await msgBox.show('Einstellungen speichern?','Bitte bestätigen!','Ja, Nein') == 'Ja') {
        if (event.detail.action == 'send') {
            clsWizard.submitForm();
        } else if (event.detail.action == 'save') {
            SETTINGS.save();
            window.location.replace('index.html');  
        }
    }
}

/**
 * Renders 2 x 6 controls for input of daily schedule.
 * Depending on winter- or summer time, the required input fields will be displayed.
 * The information about the working time per day is stored in data-attributes:
 * @param {string} data.from Start time - default = '07:00'
 * @param {string} data.until Start time - default = '17:00'
 * @param {string} data.breakfast Breakfast in minutes - default = '30'
 * @param {string} data.lunch Lunch in minutes - default = '60'
 */
function renderWeekdays() {
    const weekdays = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
          seasons = ['summer', 'winter'],
          divWeekdays = $('fldWeekdays');

    divWeekdays.innerHTML = '';
    for (let z = 0; z < seasons.length; z++) {
        const season = seasons[z];
        for (let i = 0; i < weekdays.length; i++) {
            const day = `
                <div class="control counter inline flx-btw" data-season="${season}">
                    <span>
                        <img class="image-button" src="./img/edit.png" data-edit="${i+1}">
                        <label for="inp${season}${i+1}" class="short" >${weekdays[i]}</label>
                    </span>      
                    <span>
                        <input id="inp${season}${i+1}" type="number" name="weekdays" data-season="${season}"
                        data-from="07:00" data-until="17:00" data-breakfast="30" data-lunch="60" disabled>  Std
                    </span> 
                </div>`;   
            divWeekdays.innerHTML += day;     
        }        
    }
}

/**
 * Stores the workday informations into the dataset-attributes of 
 * the editor's input fields: <br>
 * - [data-from] 
 * - [data-until]
 * - [data-breakfast]
 * - [data-lunch]
 */
function applyWeekdaySettings() {
    const weekdays = $('input[name="weekdays"]');
    ['summer','winter'].forEach(season => {
        for (let i = 0; i < SETTINGS.weekdays[season].length; i++) {
            const input = $(`inp${season}${i+1}`),
                  day = SETTINGS.weekdays[season][i];            
            for (const key in day) {
                input.dataset[key] = day[key];
            }    
            const data = input.dataset;   
            // now calculate the daily hours...
            input.value = HOURS.hours(data.from, data.until, data.breakfast, data.lunch).toFixed(2);                 
        }
    });
}