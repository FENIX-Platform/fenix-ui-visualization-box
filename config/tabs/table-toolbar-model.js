/*global define*/

define(function () {

    'use strict';

    return {

        "sort": {

            "selector": {
                "id": "sortable",
                "source": [
                    {"value": "", "label": "", parent: 'AGG'}
                ], // Static data
                "config": { //SortableJS configuration
                    //disabled: true
                }
            },

            "template": {
                //"hideHeader": true,
                "hideSwitch": true,
                "hideRemoveButton": true,
                "title": "Sort dimension"
            },

            "className": "col-xs-6"

        },

        "aggregation": {

            "selector": {
                "id": "dropdown",
                "source": [], // Static data
                "config": { //Selectize configuration
                    "maxItems": 1
                }
            },

            "template": {
                //"hideHeader": true,
                "hideSwitch": true,
                "hideRemoveButton": true,
                "title": "Aggregation function"
            },

            "className": "col-xs-6"

        },

        "renderer": {

            "selector": {
                "id": "dropdown",
                "source": [

                    {"value": "table", "label": "Grid"},
                    {"value": "chart", "label": "Chart"},


                ], // Static data
                "config": { //Selectize configuration
                    "maxItems": 1
                }
            },

            "template": {
                //"hideHeader": true,
                "hideSwitch": true,
                "hideRemoveButton": true,
                "title": "Renderer function"
            },

            "className": "col-xs-6"

        },

        "decimal_separator": {

            "selector": {
                "id": "input",
                "type": "radio",
                "default": ["dot"],
                "source": [
                    {"value": "dot", "label": "Dot"},
                    {"value": "comma", "label": "Comma"}

                ]
            },

            "template": {
                //"hideHeader": true,
                "hideSwitch": true,
                "hideRemoveButton": true,
                "title": "Decimal separator"
            },


            "className": "col-xs-6"

        },

        "thousand": {

            "selector": {
                "id": "input",
                "type": "radio",
                "default": ["enable"],
                "source": [
                    {"value": "enable", "label": "Enable"},
                    {"value": "disable", "label": "Disable"}
                ]
            },

            "template": {
                //"hideHeader": true,
                "hideSwitch": true,
                "hideRemoveButton": true,
                "title": "Thousand"
            },

            "className": "col-xs-6"

        },

        "decimal_digit": {

            "selector": {
                "id": "input",
                "type": "number",
                "source": [
                    {"value": "2"}
                ],
                "config" : {
                    "min" : 0
                }
            },

            "template": {
                //"hideHeader": true,
                "hideSwitch": true,
                "hideRemoveButton": true,
                "title": "Decimal digit"
            },

            "className": "col-xs-6"

        }

    }

});