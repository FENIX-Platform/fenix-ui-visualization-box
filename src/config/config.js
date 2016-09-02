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
                path: 'blank'
            },
            'table': {
                path: 'table'
            },
            'map': {
                path: 'map'
            },
            'chart': {
                path:'chart'
            },
            'metadata': {
                path:'metadata'
            },
            'filter': {
                path:'filter'
            },
            'download': {
                path:'download'
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
