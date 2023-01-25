//  #######################################################################################################
//  PURPOSE		: Universal 'all-in-one' function that unites the DOM-functions
//                => document.getElementById
//                => document.getElementsByTagName
//                => document.getElementsByClassName
//                => document.getElementsByName
//                => document.querySelectorAll
//   			  
//  PARAMETER 	: selector 	= ID | classname | .class | [type] | >sub-element or <tag>
//                            if ID is not found as a valid selector, search continues 
//                            in the order: HTML-tags ==> classNames ===> names
//                            So if there is no ID matching to 'selector' but a valid
//                            HTML-tag or a class, they will be returned
//  			: [child]           	=   optional. Ignored if valid ID was found!
//              : omitted               =   a node list or HTML-collection will be returned!
//              : '~' or ':last-child'  =   returns the last child of the nodelist
//              : 0                     =   returns the first child of the nodelist
//              : number | numeric string = child[number] will be returned
//  			
//  RETURNS 	: a single element (if selector is a valid ID or child is specified)
//                in all other cases a zero-based nodelist or HTML-collection,
//                matching the selector-parameter
//                If the list contains ONLY ONE element, this element is returned only!
//
//  CALL        : $('main-content')     -   returns an element with ID 'main-content'
//                $('div','~')          -   returns the last div-container of the document
//                $('a',0)              -   returns the first link (<a>-element)
//                $('div.myClass')      -   returns a list with all div's containing class 'myClass'
//                $('div.myClass','~')  -   returns last div containing class 'myClass'
//                $('.clsNames',3)      -   returns the 4th(!) child of the wanted class list
//                $('input[type=text]') -   returns a list with all input elements, being text fields
//                $('[name]')           -   returns a list with all elements, having a 'name' attribute
//  #######################################################################################################
// prepend 'export' if you wanna import the function in a module 
function $(selector, child) {
    let clsNames;
    // is last-child wanted?
    let getLastChild = (child == '~' || child == ':last-child') ? true : false;
    // check, if 'child' is numeric!
    if (!isNumeric(child,true) || child < 0 ) {child = false}

    // query-selector provided?
    if (selector.includes('[') || selector.includes('.') || selector.includes('#')  || selector.includes(':') || selector.includes('>')) {
        let elements = document.querySelectorAll(selector);
        if (elements.length == 1) {return elements[0]}
        child = getLastChild ? elements.length - 1 : child;
        return (child === false) ? elements : elements[child];
    }

    // now search for ID...
    let element = document.getElementById(selector);
    if (element) { // ID was found!
        return element;     
    } else { // no ID found: continue in HTML-tags...
        let htmlTags = document.getElementsByTagName(selector);
        if (htmlTags.length > 0) {
            // don't return a collection or list, if only 1 child is contained, 
            // return this single element instead
            if (htmlTags.length == 1) {return htmlTags[0]} 
            child = getLastChild ? htmlTags.length - 1 : child;
            return (child === false) ? htmlTags : htmlTags[child];
        } else { // is the selector a class...?            
            clsNames = document.getElementsByClassName(selector);
            if (clsNames.length > 0) { 
                if (clsNames.length == 1) {return clsNames[0]}
                child = getLastChild ? clsNames.length - 1 : child;          
                return (child === false) ?  clsNames : clsNames[child];
            } else {
                // ...or is it a name finally?
                let elNames = document.getElementsByName(selector);
                if (elNames.length > 0) {
                    if (elNames.length == 1) {return elNames[0]}
                    child = getLastChild ? elNames.length - 1 : child;
                    return (child === false) ?  elNames : elNames[child];
                }                
            }
        }
    }
}

//  #####################################################################################
//  PURPOSE 	: Checks properly(!!!), if 'expression' is numeric
//   			  recognizes: undefined, NaN, Null, infinity etc.
//  PARAMETER 	: expression    -   expression to be ckecked
//              : [strAllowed]  -   boolean, optional
//                                  tells if string literals are allowed or not (default)
//  RETURNS 	: true | false
//  #####################################################################################
// prepend 'export' if you wanna import the function in a module 
// function isNumeric(expression, strAllowed) { 
function isNumeric(expression, strAllowed) {
    if (!strAllowed) {
        return Number.isFinite(expression); 
    } else {
        return Number.isFinite(parseFloat(expression)); 
    }
    
}


/**
 * loads HTML-templates at run time to the page.
 * Iterates through all elements containing the attribute 'w3-include-html'.
 * i.e.: 
 *  
 * header w3-include-html="templates/header.html" will load a given header
 */
async function includeHTML() {
    // let includeElements = $('[w3-include-html]'); 
    // = document.querySelectorAll('[w3-include-html]')
    const W3_ATTR = 'w3-include-html';
    let includeElements = document.querySelectorAll(`[${W3_ATTR}]`)
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        let file = element.getAttribute(W3_ATTR),
            resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
            element.removeAttribute(W3_ATTR);
        } else {
            element.innerHTML = `Page not found: "${file}"`;
        }        
    }
}


function random (min = 0, max = 1) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//  #####################################################################################
//  PURPOSE 	: Pauses the code for the provided amount of milliseconds
//  			  Calling function must be 'async' in order to make it work!
//  PARAMETERS 	: milliseconds 	= time to pause in milliseconds
//  			:  			     
//  CALL		: await sleep(3000);    -   pauses for 3 seconds 			     
//  			:  			 
//  RETURNS 	: -void-
//  #####################################################################################
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function loadArray (path, count, extension = '.png') {
    let arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(path + i + extension)
    }
    return arr;
}


/**
 * returns the filename of a given path
 * @param {string} path full path
 * @param {boolean} extention determines if with or without file extention
 * @returns string filename
 */
function getFilename(path, extention = true) {
    let file = path.match(/[-_\w]+[.][\w]+$/i)[0];
    if (extention) return file;
    //removing extension and returning just the filename
    return file.split('.').shift();     
}


/**
 * returns the path from a given full path
 * (extracts the file name)
 * @param {string} file full path
 * @returns string that contains the path only without filename
 */
function getPath(filename) {
    return filename.substring(0, filename.lastIndexOf('/') + 1);
}

/**
 * function for sound output
 * @param {string} file the sound file to be played without path
 * @param {boolean} soundEnabled global variable, meant to be used in settings od the app
 */
 function playSound (file, soundEnabled = true, vol = 1) {
    if (soundEnabled) {
        if (vol > 1) vol = parseFloat(vol / 100);
        if (typeof file == 'string') {
            let path = './sound/' + file, audio = new Audio(path);
            audio.play();
            audio.volume = vol;
            return audio;
        } else if (typeof file == 'object') {
            file.play();
            file.volume = vol;
            return file;
        } else {
            return 'No valid audio file.'
        }
    } 
    if (typeof file == 'object') {
        file.pause();
        // file.currentTime = 0;
        // file = null;
        // return null;
    }
}

function fadeSound (audio, fadeEnd = true) {
    if (audio instanceof Audio) {        
        const fadePoint = (fadeEnd) ? audio.duration - 5 : audio.currentTime;
        const fadeID = setInterval(() => {
            if ((audio.currentTime >= fadePoint) && (audio.volume !== 0)) {
                audio.volume -= 0.1
            }
            // if (audio.volume < 0.003) {
            if (audio.volume < 0.01) {
                clearInterval(fadeID);
                audio.pause();
            }        
        }, 250);
    }
}

// check if declaration is variable or constant...
// call: 
// const PI = 3.1415;
// let str = "I am a string variable!";
// isConst('PI'); // -> true
// isConst('str'); // -> false

let isConst = function(name, context) {
    // does this thing even exist in context?
    context = context || this;
    if(typeof context[name] === 'undefined') return false;
    // if it does exist, a reassignment should fail, either
    // because of a throw, or because reassignment does nothing.
    try {
      var _a = context[name];
      context[name] = !context[name];
      if (context[name] === _a) return true;
      // make sure to restore after testing!
      context[name] = _a;
    } catch(e) { return true; }
    return false;
}.bind(this);


function cBool(expression) {
    switch(expression?.toLowerCase()?.trim()){
        case 'true': 
        case 'yes':
        case 'on':
        case '1': 
            return true;
        case 'false': 
        case 'no': 
        case 'off':
        case '0': 
        case '':
        case null: 
        case undefined:
            return false;
        default: 
            return JSON.parse(expression);
    }
}

/**
 * Returns a time-string for the given date.
 * If the date is omitted, current date is used.
 * @param {object} dtDate [optional] a valid date-object
 * @returns time string in format dd.mm.yyyy | hh:nn:ss
 */
function getTime$(dtDate) {
    if (dtDate == undefined) dtDate = new Date();
    // arrow function for each part of the date
    const padLeft = (nr, len = 2, chr = `0`) => `${nr}`.padStart(len, chr);
    return `${padLeft(dtDate.getDate())}.
            ${padLeft(dtDate.getMonth()+1)}.            
            ${dtDate.getFullYear()} | 
            ${padLeft(dtDate.getHours())}:
            ${padLeft(dtDate.getMinutes())}:
            ${padLeft(dtDate.getSeconds())}`;
}

// function todo (msgtext, title = 'Coming soon') {
//     playSound('notify.mp3');
//     msgBox(msgtext, title,'Ok',false,true);
// }