/* global define */
define(function () {

    'use strict';

    return {

        defaultStatus : "loading",
        defaultTab : "chart",
        defaultSize : "large",
        defaultFace : "front", // back || front
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
            },
            'metadata': {
                path:'fx-v-b/js/tabs/metadata'
            },
            'filter': {
                path:'fx-v-b/js/tabs/filter'
            }
        },
        tabs: {
            'blank': {type: 'simple', callback: 'once'},
            'table': {type: 'simple', callback: 'once'},
            'metadata': {type: 'simple', callback: 'once'},
            //'filter': {type: 'simple', callback: 'once'},
            //'map': {type: 'simple', callback: 'always'},
            'chart': {type: 'simple', callback: 'always'}
        },

        FLIPPED_CLASSNAME : "flipped",

        state : {}

    };
});
