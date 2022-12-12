const APP_NAME = 'StundenApp';
const PAGES = ['index','hours','report','tools','settings'];
const TILES = ['hours','report','report','tools','tools','settings'];

const MENUS = [
    {   // german
        main: ['Stunden erfassen','Stunden-Rapport','Regie-Rapport','Ausmass','Materialrechner','Einstellungen'],
        desktop: ['Home','Stunden','Rapport','Tools','Einstellungen'],
        mobile: []
    },
    {   // italian
        main: ['Inserire le ore','Rapporto orario'],
        desktop: ['Home', 'Orario', 'Rapporto', 'Strumenti', 'Impostazioni'],
        mobile: []
    }
];

// class AppSettings {
//     setupDone = false;
//     language = 0;
//     surname = '';
//     firstname = '';
//     location = '';
//     birthday = null;
//     email = '';
//     showPrevDay = true;
//     showDriveBox = true;
//     showSiteID = false;
//     maxSites = 4;
//     idleAfter = 3;
//     showAlert = true;
//     alertHours = 12;
//     summerTime = true;
//     workTime = {from: '7:00', until: '17:00'};
//     breaks = {breakfast: 30, lunch: 60};
//     // daily = {mon: 8.5, tue: 8.5, wed: 8.5, thur: 8.5, fri: 7, sat: 0};
//     daily = [8.5, 8.5, 8.5, 8.5, 7, 0];
//     weekly = 41

//     constructor() {
//         this.load();
//         if (this.setupDone) this.storeToForm();
//     }

//     load() {
//         let ls = localStorage.getItem(APP_NAME), tmpSettings;
//         if (ls) tmpSettings = JSON.parse(ls);
//         if (tmpSettings) {
//             console.log(tmpSettings)
//         } else {
//             console.log('Settings not loaded!')
//         }
//     }

//     save(key = APP_NAME) {
//         // localStorage.setItem(key, JSON.stringify(gameSettings));
//     }

//     storeToForm(id) {

//     }

//     #calcWeeklyHours() {
//         this.weekly = 0;
//         for (let i = 0; i < this.daily.length; i++) {
//             this.weekly += this.daily[i];            
//         }
//     }
// }

// const SETTINGS = new AppSettings();

const SETTINGS = {
    language: 0,
    surname: '',
    firstname: '',
    location: '',
    birthday: null,
    email: '',
    showPrevDay: true,    
    showSiteID: false,
    maxSites: 4,
    idleAfter: 3,
    showAlert: true,
    alertHours: 12,
    summerTime: true,
    workTime: {from: '7:00', until: '17:00'},
    breaks: {breakfast: 30, lunch: 60},
    daily: {mon: 8.5, tue: 8.5, wed: 8.5, thur: 8.5, fri: 7, sat: 0},
    weekly: 41
}