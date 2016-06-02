/*global define*/

define([
        'jquery',
        "fx-v-b/config/tabs/shared-toolbar-model"
    ],
    function ($, Shared) {

        'use strict';

        return $.extend(true, {}, Shared,{show : {

            selector : {
                id : "input",
                type : "checkbox",
                source : [
                   
                    { value : "code", label : "Code"}
                ]
            },

            template : {
                title : "Show"
            }
        }})

    });