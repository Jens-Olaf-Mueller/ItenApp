import $ from './library.js';
import Calculator from './classes/calculator_class.js';
import { SETTINGS } from './app.js';

export default function initCalculator(title = 'Taschenrechner') {
    $('h3Title').innerHTML = title; 
    const CALCULATOR = new Calculator('./style/' + SETTINGS.calculatorStyle, 'mainCalculatorParent');
    CALCULATOR.show();
}