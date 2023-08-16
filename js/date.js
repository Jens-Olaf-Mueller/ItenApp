export function dateAdd(date, days) {
    if (typeof date == 'string') date = new Date(date);
    if (date == undefined) date = new Date();
    // ATTENTION! The setDate() method mutates the Date object it is called on.
    // That is why we return only a copy!
    let dateCopy = new Date(date);
    return new Date(dateCopy.setDate(dateCopy.getDate() + days));
}

export function getWeek(date) {
    const dtDate = new Date(date.valueOf());
    let dayn = (dtDate.getDay() + 6) % 7;
    dtDate.setDate(dtDate.getDate() - dayn + 3);
    let firstThursday = dtDate.valueOf();
    dtDate.setMonth(0, 1);
    if (dtDate.getDay() !== 4) dtDate.setMonth(0, 1 + ((4 - dtDate.getDay()) + 7) % 7);
    return 1 + Math.ceil((firstThursday - dtDate) / 604800000);
}

export function formatDate(date = new Date()) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate())].join('-');
}

function getKW (date = new Date()) {
    const startDate = new Date(date.getFullYear(), 0, 1),
          MS_PER_DAY = (24 * 60 * 60 * 1000);
    let days = Math.floor((date - startDate) / MS_PER_DAY);
    return padTo2Digits(Math.ceil(days / 7));
}

/**
 * returns the first day (monday) of a given date in a week
 * @param {object} date if omitted the currend date is used
 * @param {number} firstDayOfWeek 0 sunday | 1 monday | 2 tuesday | 3 wednesday | 4 thursday | 5 friday | 6 saturday
 * @returns 
 */
function firstDayOfWeek(date, firstDayOfWeek = 1) {
    if (typeof date == 'string') date = new Date(date);
    if (date == undefined) date = new Date();
    const dayOfWeek = date.getDay(),
        mondayOfWeek = new Date(date),
        diff = dayOfWeek >= firstDayOfWeek ? dayOfWeek - firstDayOfWeek : 6 - dayOfWeek;
    mondayOfWeek.setDate(date.getDate() - diff)
    mondayOfWeek.setHours(0,0,0,0)
    return formatDate(mondayOfWeek);
}


function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

/**
* Calculates Easter in the Gregorian/Western (Catholic and Protestant) calendar 
* based on the algorithm by Oudin (1940) from http://www.tondering.dk/claus/cal/easter.php
* https://gist.github.com/johndyer/0dffbdd98c2046f41180c051f378f343
* @returns {date} Easter sunday
*/
export function getEaster(year) {
	let f = Math.floor,
		// Golden Number - 1
		G = year % 19,
		C = f(year / 100),
		// related to Epact
		H = (C - f(C / 4) - f((8 * C + 13)/25) + 19 * G + 15) % 30,
		// number of days from 21 March to the Paschal full moon
		I = H - f(H/28) * (1 - f(29/(H + 1)) * f((21-G)/11)),
		// weekday for the Paschal full moon
		J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
		// number of days from 21 March to the Sunday on or before the Paschal full moon
		L = I - J,
		month = 3 + f((L + 40)/44),
		day = L + 28 - 31 * f(month / 4);
    return new Date(Number(year), month-1, day, 0, 0, 0, 0);
	// return [month,day];
}

/**
 * Checks if the given date is a holiday.
 * If yes, the name is returned, otherwise an empty string.
 * @param {date} date Date to be checked
 * @returns {string} The holiday name or empty string.
 */
 export function isHoliday(date) {
    // TODO: in library verschieben... - gesetzlich NICHT anerkannte Feiertage + Geburtstage!!!
    const day = date.getDate(), month = date.getMonth() + 1;
    const dtEaster = getEaster(date.getFullYear());
    let easterMonday = dateAdd(dtEaster, 1),
        goodFriday = dateAdd(dtEaster, - 2),
        ascensionDay = dateAdd(dtEaster, 39),
        pentecost = dateAdd(dtEaster, 49),
        pentecostMonday = dateAdd(dtEaster, 50),
        corpusChristi = dateAdd(dtEaster, 60);
    // movable holidays
    if (day == dtEaster.getDate() && month == dtEaster.getMonth() + 1) return 'Ostersonntag';
    // if (easterMonday.getDate() == day && easterMonday.getMonth() + 1 == month) return 'Ostermontag';
    if (goodFriday.getDate() == day && goodFriday.getMonth() + 1 == month) return 'Karfreitag';
    if (ascensionDay.getDate() == day && ascensionDay.getMonth() + 1 == month) return 'Auffahrt';
    if (pentecost.getDate() == day && pentecost.getMonth() + 1 == month) return 'Pfingstsonntag';
    // if (pentecostMonday.getDate() == day && pentecostMonday.getMonth() + 1 == month) return 'Pfingstmontag';
    if (corpusChristi.getDate() == day && corpusChristi.getMonth() + 1 == month) return 'Fronleichnam';
    // fix holidays
    if (day == 1 && month == 1) return 'Neujahr';
    if (day == 1 && month == 8) return 'Nationalfeiertag';    
    if (day == 15 && month == 8) return 'Maria Himmelfahrt';
    if (day == 1 && month == 11) return 'Allerheiligen';
    if (day == 8 && month == 12) return 'Maria Empfängnis';
    if (day == 25 && month == 12) return '1. Weihnachtsfeiertag';
    // if (day == 26 && month == 12) return '2. Weihnachtsfeiertag';
    return '';
}