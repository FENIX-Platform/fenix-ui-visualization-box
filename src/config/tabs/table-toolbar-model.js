if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


define([
        'jquery',
        "fx-box/config/tabs/shared-toolbar-model"
    ],
    function ($, Shared) {

        'use strict';

        return $.extend(true, {}, Shared, {show : {

            selector : {
                id : "input",
                type : "checkbox",
                source : [
                    { value : "unit", label : "Unit"},
                    { value : "flag", label : "Flag"},
                    { value : "code", label : "Code"}
                ]
            },

            template : {
                title : "Show"
            }
        }})

    });