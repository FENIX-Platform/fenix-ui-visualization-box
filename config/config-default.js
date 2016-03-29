/* global define */
define(function () {

    'use strict';

    return {

        defaultStatus : "loading",
        defaultTab : "blank",
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
            'blank': {type: 'simple', callback: 'always'},
            //'table': {type: 'simple', callback: 'always'},
            //'map': {type: 'simple', callback: 'always'},
            //'chart': {type: 'simple', callback: 'always'}
        },

        FLIPPED_CLASSNAME : "flipped",

        state : {}

    };
});
