/* global define */
define(function () {

    'use strict';

    return {

        default_status : "loading",
        default_tab : "blank",
        default_size : "large",
        ready : false,
        tab_registry: {
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
        }

    };
});
