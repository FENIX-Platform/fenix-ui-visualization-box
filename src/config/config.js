/* global define */
define(function () {

    'use strict';

    return {

        status : "loading",
        tab : "table",
        size : "full",
        face : "front", // back || front
        faces : ["front", "back"],
        pluginRegistry: {
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
            //'blank': {options : {}},
            'table': {options : {}},
            'metadata': {options : {}},
            'filter': {options : {}},
            'map': {options : {}},
            'chart': {options : {type : "line"}},
            'download': { options : {}}
        },

        flippedClassName : "flipped",

        state : {},

        lang : "EN",

        langFallbackOrder : ["EN", "FR", "ES", "AR", "PR"],

        //Tabs
        toolbarPosition : "up", // up | down

        //Load resource
        loadResourceServiceQueryParams : {
            dsd : true
        },

        syncTabsOnToolbarChange : false,

        renderVisualizationComponents : true,

        maxDataSize : 7200,

        minDataSize : 0,

        cache : false

    };
});
