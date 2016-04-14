/* global define */
define(function () {

    'use strict';

    return [
        {
            "name": "Metadata",
            "url": "#",
            "parent_id": "-1",
            "id": "0",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "metadata",
                "class" : "hidden"
            }
        },
        {
            "name": "Download",
            "url": "#",
            "parent_id": "-1",
            "id": "1",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "download",
                "class" : "hidden"
            }
        }, {
            "name": "Widget layout",
            "url": "#",
            "parent_id": "-1",
            "id": "2"
        }, {
            "name": "1/2 - 1/2",
            "url": "#",
            "parent_id": "2",
            "id": "3",
            "a_attrs": {
                "data-action": "resize",
                "data-size": "1"
            }
        },
        {
            "name": "2/2 - 1/2",
            "url": "#",
            "parent_id": "2",
            "id": "4",
            "a_attrs": {
                "data-action": "resize",
                "data-size": "3"
            }
        },
        {
            "name": "1/2 - 2/2",
            "url": "#",
            "parent_id": "2",
            "id": "5",
            "a_attrs": {
                "data-action": "resize",
                "data-size": "4"
            }
        },
        {
            "name": "2/2 - 2/2",
            "url": "#",
            "parent_id": "2",
            "id": "6",
            "a_attrs": {
                "data-action": "resize",
                "data-size": "7"
            }
        },
        {
            "name": "Fullscreen",
            "url": "#",
            "parent_id": "2",
            "id": "7",
            "a_attrs": {
                "data-action": "resize",
                "data-size": "full"
            }
        },
        {
            "name": "Visualize as",
            "url": "#",
            "parent_id": "-1",
            "id": "8"
        },
        {
            "name": "Chart",
            "url": "#",
            "parent_id": "8",
            "id": "9",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "blank",
                "class" : "hidden"
            }
        },
        {
            "name": "Pie chart",
            "url": "#",
            "parent_id": "9",
            "id": "9-1",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "chart",
                "data-type": "pie"
            }
        },
        {
            "name": "Time series",
            "url": "#",
            "parent_id": "9",
            "id": "9-2",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "chart",
                "data-type": "timeseries"
            }
        },{
            "name": "Blank",
            "url": "#",
            "parent_id": "8",
            "id": "blank",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "blank",
                "class" : "hidden"
            }
        },
        {
            "name": "Map",
            "url": "#",
            "parent_id": "8",
            "id": "10",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "map",
                "class" : "hidden"
            }
        },
        {
            "name": "Table",
            "url": "#",
            "parent_id": "8",
            "id": "11",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "table",
                "data-type": "standard",  
                "class" : "hidden"
            }
        }, {
            "name": "Standard",
            "url": "#",
            "parent_id": "11",
            "id": "11-1",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "table",
                "data-type": "standard",
            }
        },
        {
            "name": "Pivot",
            "url": "#",
            "parent_id": "11",
            "id": "11-2",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "table",
                "data-type": "standard"
            }
        }
    ];
});
