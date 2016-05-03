/*global define*/

define(function () {

    'use strict';

    return {

        sort: {

            "selector": {
                "id": "sortable",
                "source": [ ], // Static data
                "config": { //SortableJS configuration
                    //disabled: true
                    groups : {
                        rows : "Rows",
                        columns : "Columns",
                        hidden : "Hidden"
                    }
                }
            },

            "template": {
                //"hideHeader": true,
                "hideSwitch": true,
                "hideRemoveButton": true,
                "title": "Sort dimension"
            }

        },

        format : {

            selector : {
                id : 'dropdown',
                source : [
                    { value : "localstring", label : "Local String"},
                    { value : "value", label : "Raw Value"}
                ],
                config : {
                    maxItems : 1
                },
                default : ['localstring']
            },

            template : {
                title : "Format"
            }
        },

        show : {

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
        }

    }

});