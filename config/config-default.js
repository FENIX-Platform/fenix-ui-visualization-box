/* global define */
define(function () {

    'use strict';

    return {

        defaultStatus : "loading",
        defaultTab : "table",
        defaultSize : "large",
        ready : false,
        tabRegistry: {
            'blank': {
                path: 'fx-v-b/js/tabs/blank'
            },
            'table': {
                path: 'fx-v-b/js/tabs/table'
            },
            'map': {
                path: 'fx-v-b/js/tabs/map'
            },
            'chart': {
                path:'fx-v-b/js/tabs/chart'
            }
        },
        tabs: {
            'blank': {type: 'simple', callback: 'once'},
            'table': {type: 'simple', callback: 'once'},
            //'map': {type: 'simple', callback: 'always'},
            //'chart': {type: 'simple', callback: 'always'}
        },

        FLIPPED_CLASSNAME : "flipped",

        state : {}

    };
});
