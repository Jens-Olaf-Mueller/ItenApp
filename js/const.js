const APP_NAME = 'StundenApp';
const PAGES = ['index','hours','report','tools','settings'];

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
        param: ['material','survey','calculator']
    }];

const DROPLIST = {
    employees: [
        {   value: -1,
            text: "-- bitte wählen --",
            disabled: '',
            selected: ''
        },
        {   value: 0,
            text: "Lehrling"
        },
        {   value: 1,
            text: "Hilfsarbeiter"
        },
        {   value: 2,
            text: "Kundenmaurer"
        },
        {   value: 3,
            text: "Plattenleger B"
        },
        {   value: 4,
            text: "Plattenleger A"
        },
        {   value: 5,
            text: "Vorarbeiter"
        }],
    units: {
        powder: [{value: 'kg', text: 'kg'}, {value: 'Sack', text: 'Sack'}],
        volume: [{value: 'cbm', text: 'm³'}, {value: 'ltr', text: 'ltr'}, {value: 'psch', text: 'psch'}],
        tiles: [{value: 'Pack', text: 'Pack'}, {value: 'Stk', text: 'Stück'}],
    },
    categories: [
        {   value: -1,
            text: "-- bitte wählen --",
            disabled: '',
            selected: ''
        },
        {   value: 'groundwork',
            text: "Vorarbeiten"
        },
        {   value: 'laying',
            text: "Verlegung"
        },
        {   value: 'jointing',
            text: "Ausfugen / Kittfugen"
        },
        {   value: 'sidework',
            text: "Nebenarbeiten"
        },
        {   value: 'repairs',
            text: "Reparaturen / Restarbeiten"
        }],
    works: {
        groundwork: ['Reinigen / Grundieren','Abdichtung','Gefällsüberzug',
                    'Schleifen','Spachteln / Netzen','Ausnivellieren (+ Reinigen, Grundieren)',
                    'Entkoppeln','Verharzen','Aufdoppeln','Wannenschürzen setzen'],
        laying: ['Wandplatten','Bodenplatten','Treppe','Mosaik','Terassen - Stelzen','Terassen - Schienen',
                'Terassen -  Splitt / Splittbeton','Grossformat - Wand','Grossformat - Boden','Naturstein - Wand','Naturstein - Boden','Fassade','Bodenplatten - Dickbett'],
        jointing: ['Fugen - Wandplatten','Fugen - Bodenplatten','Fugen - Epoxy','Kittfugen'],
        sidework: ['Baustelleneinrichtung / Räumen','Materialtransport','Abdecken', 'Abwaschen / Säuern',
                'Abriss- / Spitzarbeiten','Abfallentsorgung / Aufräumen','Besprechung / Organisation'],
        repairs: ['Platten wechseln / ergänzen','Sockel ergänzen','Kittfugen erneuern','Reparatur (Plattendoktor)']
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