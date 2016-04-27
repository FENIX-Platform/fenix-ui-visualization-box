/* global define */
define(function () {

    'use strict';

    return {

        status : "loading",
        tab : "download",
        size : "large",
        face : "front", // back || front
        faces : ["front"],
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
            //'blank': {type: 'simple', callback: 'once'},
            'table': {type: 'simple', callback: 'once'},
            'metadata': {type: 'simple', callback: 'once'},
            'filter': {type: 'simple', callback: 'once'},
            'map': {type: 'simple', callback: 'always'},
            'chart': {type: 'simple', callback: 'always'},
            'download': {type: 'simple', callback: 'always'}
        },

        flippedClassName : "flipped",

        state : {},

        lang : "EN",

        //Tabs
        toolbarPosition : "up", // up | down

        //Load resource
        d3pQueryParameters : {
            language : "EN"
        }

    };
});
