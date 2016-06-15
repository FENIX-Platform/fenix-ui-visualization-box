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
                path: 'fx-box/js/tabs/blank'
            },
            'table': {
                path: 'fx-box/js/tabs/table'
            },
            'map': {
                path: 'fx-box/js/tabs/map'
            },
            'chart': {
                path:'fx-box/js/tabs/chart'
            },
            'metadata': {
                path:'fx-box/js/tabs/metadata'
            },
            'filter': {
                path:'fx-box/js/tabs/filter'
            },
            'download': {
                path:'fx-box/js/tabs/download'
            }
        },
        tabs: {
            //'blank': {tabOpts : {}},
            'table': {tabOpts : {}},
            'metadata': {tabOpts : {}},
            'filter': {tabOpts : {}},
            'map': {tabOpts : {}},
            'chart': {tabOpts : {type : "line"}},
            'download': { tabOpts : {}}
        },

        flippedClassName : "flipped",

        state : {},

        lang : "EN",

        //Tabs
        toolbarPosition : "up", // up | down

        //Load resource
        d3pQueryParameters : {
            language : "EN",
            dsd : true
        },

        syncTabsOnToolbarChange : false,

        renderVisualizationComponents : true,

        maxDataSize : 7200,

        minDataSize : 0,

        cache : false

    };
});
