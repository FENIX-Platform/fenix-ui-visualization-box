/* global define */
define(function () {

    'use strict';

    return {

        status : "loading",
        tab : "table",
        size : "full",
        face : "front", // back || front
        faces : ["front", "back"],
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
            },
            'download': {
                path:'fx-v-b/js/tabs/download'
            }
        },
        tabs: {
            //'blank': {type: 'simple', tabOpts : {}},
            'table': {type: 'simple', tabOpts : {}},
            'metadata': {type: 'simple', tabOpts : {}},
            'filter': {type: 'simple', tabOpts : {}},
            'map': {type: 'simple', tabOpts : {}},
            'chart': {type: 'simple', tabOpts : {type : "line"}},
            'download': {type: 'simple', tabOpts : {}}
        },

        flippedClassName : "flipped",

        state : {},

        lang : "EN",

        //Tabs
        toolbarPosition : "up", // up | down

        //Load resource
        d3pQueryParameters : {
            language : "EN"
        },

        sync_tabs_on_toolbar_change : false,

        render_visualization_components : true,

        max_data_size : 7200

    };
});
