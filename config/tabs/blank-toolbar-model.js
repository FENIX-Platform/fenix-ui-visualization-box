/*global define*/

define(function () {

    'use strict';

    return {

        "sort": {

            "selector": {
                "id": "sortable",
                "source": [
                    {"value": "sort_1", "label": "Sort 1", parent: 'group_1'},
                    {"value": "sort_2", "label": "Sort 2", parent: 'group_1'},
                    {"value": "sort_3", "label": "Sort 3", parent: 'group_2'},
                    {"value": "sort_4", "label": "Sort 4", parent: 'group_3'}
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
                "source": [
                    {"value": "aggregation_1", "label": "Aggregation 1"},
                    {"value": "aggregation_2", "label": "Aggregation 2"},
                    {"value": "aggregation_3", "label": "Aggregation 3"},
                    {"value": "aggregation_4", "label": "Aggregation 4"}
                ], // Static data
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
                ]
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