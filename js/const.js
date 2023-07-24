const APP_NAME = 'StundenApp';
const PAGES = ['index','hours','report','tools','settings'];
// const TILES = ['hours','report','report','tools','tools','settings'];
// const HOME = 0, PREV = 1, CAM  = 2, INFO = 3, NEXT = 4, SEND = 5; // indizes of wizard-buttons

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

const MNU_ITEMS = [
    {   caption: 'Rapport',
        items: ['Wochenrapport','Regierapport','Baustellenrapport'],
        url: 'report.html',
        param: ['weekly','daily','site']
    },
    {   caption: 'Tools',
        items: ['Materialrechner','Ausmass','Taschenrechner'],
        url: 'tools.html',
        param: ['material','measure','calculator']
    }];

const DROPLIST = {
    employees: [
        {   value: -1,
            text: "-- bitte wählen --",
            disabled: '',
            selected: ''
        },
        {   value: 0,
            text: "Lehrling",
        },
        {   value: 1,
            text: "Hilfsarbeiter",
        },
        {   value: 2,
            text: "Kundenmaurer",
        },
        {   value: 3,
            text: "Plattenleger B",
        },
        {   value: 4,
            text: "Plattenleger A",
        },
        {   value: 5,
            text: "Vorarbeiter",
        }],
    units: {
        powder: [{value: 'kg', text: 'kg'}, {value: 'Sack', text: 'Sack'}],
        volume: [{value: 'cbm', text: 'm³'}, {value: 'ltr', text: 'ltr'}, {value: 'psch', text: 'psch'}],
        tiles: [{value: 'Pack', text: 'Pack'}, {value: 'Stk', text: 'Stück'}],
    }
}


const SITES = [
    {   value: -1,
        text: "-- bitte wählen --",
        disabled: '',
        selected: ''
    },
    {   value: "0000-000",
        text: "Magazin"
    },
    {   value: "0000-001",
        text: "Ausstellung / Büro"
    },
    {   value: "2021-001",
        text: "Villa Hotz"
    },
    {   value: "2021-012",
        text: "Eichmattpark"
    },
    {   value: "2021-002",
        text: "Quadrolith"
    },
    {   value: "2022-003",
        text: "Ahornstrasse 22"
    },
    {   value: "2022-004",
        text: "Ahornstrasse 20"
    }
]

export {APP_NAME, DROPLIST};