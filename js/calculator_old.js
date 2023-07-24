class Calculator {
    currOperandDisplay;
    prevOperandDisplay;
    currentOperand;
    previousOperand;
    memDisplay;
    operation;
    memory = null;
    error = false;
    calcDone = false;
    seperator = ',';
    immediateOperators = 'n! x² √ ± % 1/x';

    get opIsPending() {return this.operation !== null;}

    constructor(currOperandID, prevOperandID, memDisplayID) {
        this.currOperandDisplay = $(currOperandID);
        this.prevOperandDisplay = $(prevOperandID);        
        this.memDisplay = $(memDisplayID);
        this.seperator = this.getDecimalSeparator();
        this.clear();
    }


    /**
     * reset the calculator to a defined state
     */
    clear() {
        this.currentOperand = '0';
        // this.currentOperand = 'Math.sqrt((12 + 8)* 4 + 20)'; // testing eval
        this.previousOperand = '';
        this.operation = null;
        this.error = false;
        this.calcDone = false;
        this.updateDisplay();
    }


    /**
     * delete the last input
     */
    delete() {
        if (this.error) return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand.length == 0) this.currentOperand = '0';
        this.updateDisplay();
    }


    /**
     * appends a number as a current digit to the display
     * @param {string} number numerical string or PI
     */
    appendNumber(number) {
        if (this.error) return;
        if (number === 'π') {
            number = Math.PI.toString().replace('.', this.seperator);
            this.currentOperand = ''; // don't add PI behind existing digits!
        }
        // allow only ONE decimal separator!
        if (number === this.seperator) {
            if (this.currentOperand.includes(this.seperator) && this.currentOperand != this.previousOperand) return;
            number = this.seperator;            
        } 
        // make sure that first operator keeps in correct place in display
        if (!this.opIsPending || this.currentOperand != this.previousOperand) {
            if (this.calcDone) {
                this.currentOperand = '';
                this.calcDone = false;
            }
            if (this.currentOperand === '0') this.currentOperand = ''; // avoid inputs like 0815...
            this.currentOperand = this.currentOperand.toString() + number.toString();
        } else {
            // add a leading 0 if input is just the decimal seperator
            if (number === this.seperator) number = '0' + this.seperator;
            this.currentOperand = number.toString();
        }        
        this.updateDisplay();
    }

    evaluateOperation(operation) {
        if (this.error || this.currentOperand === '') return;
        if (this.immediateOperators.includes(operation)) {            
            this.compute(operation);
            return;
        }
        if (this.previousOperand !== '') {
            this.compute(); 
            this.calcDone = false; // allow chain computing with previous result!
        } 
        if (operation == ')' || operation == '(') {
            // if (!this.previousOperand.includes('(') || this.getValue(this.previousOperand) == 0) return;
        //     debugger
        // } else if (operation == '(') {            
        //     // if (parseFloat(+this.currentOperand) == 0) return;
        //     
            // if(!this.checkForBrackets()) return;
            operation = this.checkForBrackets(operation)
            debugger
            this.currentOperand = operation + this.currentOperand;
            operation = null;
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.updateDisplay();
    }

    checkForBrackets() {
        if (this.previousOperand.indexOf('(') == -1 || 
            this.previousOperand.indexOf('(') != -1 && 
            this.previousOperand.indexOf(')') != -1 && 
            this.previousOperand.lastIndexOf('(') < this.previousOperand.lastIndexOf(')'))
            return '(';
        if (this.previousOperand.indexOf('(') != -1 && 
            this.previousOperand.indexOf(')') == -1 || 
            this.previousOperand.indexOf('(') != -1 &&
            this.previousOperand.indexOf(')') != -1 &&
            this.previousOperand.lastIndexOf('(') > this.previousOperand.lastIndexOf(')'))
            return ')';
        return '';
    }

    compute(operation) {
        if (operation !== undefined) {
            this.executeSingleOpCalculation(operation);
            return;
        }      
        const prevOp = this.getValue(this.previousOperand),
              currOp = this.getValue(this.currentOperand);      
        if (isNaN(prevOp) || isNaN(currOp)) return; // make sure we got some operands
        let result;
        switch (this.operation.charCodeAt(0)) {            
            case 43: result = prevOp + currOp;  // add              
                break;
            case 45: result = prevOp - currOp;  // minus            
                break;
            case 215: result = prevOp * currOp; // times             
                break;
            case 247:                           // divide
                result = prevOp / currOp;  
                if (result === Infinity) {
                    result = 'Division by zero'; 
                    this.error = true;
                }
                break;
            default: return;
        }
        if (this.error == false) this.currentOperand = this.round(result, 16).toString();
        this.operation = null;
        this.previousOperand = ''
        this.calcDone = true;
        this.updateDisplay();
    }

    executeSingleOpCalculation(operation) {
        const currOp = this.getValue(this.currentOperand);
        switch (operation) {
            case 'x²': 
                this.currentOperand = this.round(Math.pow(currOp, 2), 16).toString();  
                this.calcDone = true;             
                break;
            case '±': this.currentOperand = (currOp * -1).toString();
                break;
            case '1/x': 
                if (currOp == 0) {
                    this.currentOperand = 'Division by zero';
                    this.error = true;
                } else {
                    this.currentOperand = (1 / currOp).toString();
                    this.calcDone = true;
                } 
                break;
            case '%': 
                this.currentOperand = (currOp / 100).toString();
                this.compute();
                this.calcDone = true;
                break;
            case '√': 
                if (currOp < 0) {
                    this.currentOperand = 'Negative root';
                    this.error = true;
                } else {
                    this.currentOperand = Math.sqrt(currOp).toString();
                    this.calcDone = true;
                }                
                break;
            case 'n!': 
                this.currentOperand = this.factorial(currOp);
                this.calcDone = true;
                break;
            default:
                break;
        }
        this.updateDisplay();
    }

    round(value, decimals = 0) {
        const dec = decimals * 10;
        if (dec == 0) return Math.round(value + Number.EPSILON);
        // let retval = Math.round((value + Number.EPSILON) * dec) / dec;
        let v1 = Math.round((value * dec)/dec);
        let retval = Math.round((value * dec)) / dec;
        console.log(retval)
        return retval;
    }

    getValue(strValue) {
        return parseFloat(strValue.replace(this.seperator, '.'))
    }

    evaluate(expression) {
        return Function(`'use strict'; return (${expression})`)()
    }

    factorial(number) {
        let result = number;
        if (number.toLocaleString().includes(this.seperator) || number < 0) {
            this.error = true;
            return 'Not defined';
        }
        if (number === 0 || number === 1) return 1;        
        while (number > 1) { 
            number--;
            result *= number;
        }
        return result;
    }

    updateDisplay() {
        if (!this.error) {
            this.currOperandDisplay.innerText = this.getDisplayNumber(this.currentOperand);
        } else {
            this.currOperandDisplay.innerText = this.currentOperand;
        }

        if (this.operation != null) {
            this.prevOperandDisplay.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.prevOperandDisplay.innerText = this.error ? 'Error' : '';
        }
        this.memDisplay.innerText = this.memory ? 'M' : '';
    }

    getDisplayNumber(number) {
        // console.log(this.evaluate(this.currentOperand))
        const term = number.toString().replace('.', this.seperator),
              openBracket = term.indexOf('('),
              closeBracket = term.indexOf(')'),
              stringNumber = term.replace(/[()]/g, ''),
              integerDigits = parseFloat(stringNumber.split(this.seperator)[0]),
              decimalDigits = stringNumber.split(this.seperator)[1];

        let integer = '';
        if (!isNaN(integerDigits)) {
            integer = integerDigits.toLocaleString('de', {maximumFractionDigits: 0});
        }

        // adding the removed brackets again:
        if (openBracket != -1) {
            integer = integer.substring(0, openBracket) + '(' + integer.substring(openBracket);
            if (closeBracket != -1 && !decimalDigits) {
                integer = integer.substring(0, closeBracket) + ')' + integer.substring(closeBracket);
            }
        }

        if (!decimalDigits) return integer;
        let output = `${integer}${this.seperator}${decimalDigits}`;
        if (closeBracket != -1) output = output.substring(0, closeBracket) + ')' + output.substring(closeBracket);
        return output;

        // if (decimalDigits != null) {
        //     return `${integer}${this.seperator}${decimalDigits}`;
        // } else {
        //     return integer;
        // }
    }

    executeMemoryOperation(memOp) {
        switch (memOp) {
            case 'R':  if (this.memory) this.currentOperand = this.memory;               
                break;
            case 'S': this.memory = parseFloat(this.currentOperand);
                break;
            case 'C': this.memory = null;
                break;
            case '+': this.memory += parseFloat(this.currentOperand);
                break;
            case '-': this.memory -= parseFloat(this.currentOperand);
                break;
            default:
                break;
        }
        this.updateDisplay();
    }


    getDecimalSeparator() {
        let decSep = '.'; // fallback
        // this works in FF, Chrome, IE, Safari and Opera
        try {            
            let sep = parseFloat(3/2).toLocaleString().substring(1,2);
            if (sep === '.' || sep === ',') decSep = sep;  
        } catch(err) {
            console.warn('local decimal separator is ' + sep);
        }
        return decSep;
    }
}

const BTN_NUMBERS = $('[data-number]'),
      BTN_OPERATIONS = $('[data-operator]'),
      BTN_EQUALS = $('[data-equals]'),
      BTN_DELETE = $('[data-delete]'),
      BTN_AC = $('[data-allclear]'),
      BTN_MEMORY = $('[data-memory]');

const CALC = {
    numbers: '[data-number]',
    operations: '[data-operator]',
    memory: '[data-memory]',
    delete: 'btnDelete'
}

const calculator = new Calculator('divCurrOperand', 'divPrevOperand', 'divMemDisplay');

BTN_NUMBERS.forEach(btn => {
    btn.addEventListener('click', () => {
        calculator.appendNumber(btn.innerText);
    })
})

BTN_OPERATIONS.forEach(btn => {
    btn.addEventListener('click', () => {
        calculator.evaluateOperation(btn.innerText);
    })
})

BTN_EQUALS.addEventListener('click', btn => {
    calculator.compute();
})

BTN_AC.addEventListener('click', btn => {
    calculator.clear();
})

// BTN_DELETE.addEventListener('click', () => calculator.delete);
BTN_DELETE.addEventListener('click', btn => {
    calculator.delete();
})

BTN_MEMORY.forEach(btn => {
    btn.addEventListener('click', () => {
        calculator.executeMemoryOperation(btn.innerText.slice(-1));
    });
});