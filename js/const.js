const APP_NAME = 'StundenApp';
const PAGES = ['index','hours','report','tools','settings'];
const TILES = ['hours','report','report','tools','tools','settings'];
const HOME = 0, PREV = 1, CAM  = 2, INFO = 3, NEXT = 4, SEND = 5; // indizes of wizard-buttons

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

const SETTINGS = new Settings();