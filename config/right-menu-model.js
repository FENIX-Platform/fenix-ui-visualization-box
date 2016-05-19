/*global define*/
define(function () {

    'use strict';

    return [
        //Metadata
        {
            "label": "Metadata",
            "url": "#",
            "parent_id": "-1",
            "id": "0",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "metadata"
            }
        },
        //Download
        {
            "label": "Download",
            "url": "#",
            "parent_id": "-1",
            "id": "1",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "download"
            }
        },
        //Layout
        {
            "label": "Widget layout",
            "url": "#",
            "parent_id": "-1",
            "id": "2"
        },
        {
            "label": "1/2 - 1/2",
            "url": "#",
            "parent_id": "2",
            "id": "3",
            "a_attrs": {
                "data-action": "resize",
                "data-size": "1"
            }
        },
        {
            "label": "2/2 - 1/2",
            "url": "#",
            "parent_id": "2",
            "id": "4",
            "a_attrs": {
                "data-action": "resize",
                "data-size": "3"
            }
        },
        {
            "label": "1/2 - 2/2",
            "url": "#",
            "parent_id": "2",
            "id": "5",
            "a_attrs": {
                "data-action": "resize",
                "data-size": "4"
            }
        },
        {
            "label": "2/2 - 2/2",
            "url": "#",
            "parent_id": "2",
            "id": "6",
            "a_attrs": {
                "data-action": "resize",
                "data-size": "7"
            }
        },
        {
            "label": "Fullscreen",
            "url": "#",
            "parent_id": "2",
            "id": "7",
            "a_attrs": {
                "data-action": "resize",
                "data-size": "full"
            }
        },
        //Visualize as
        {"class": "hidden"
            "label": "Visualize as",
            "url": "#",
            "parent_id": "-1",
            "id": "8"
        },
        {
            "label": "Blank",
            "url": "#",
            "parent_id": "8",
            "id": "blank",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "blank",
                "class": "hidden"
            }
        },
        //Chart
        {
            "label": "Chart",
            "url": "#",
            "parent_id": "8",
            "id": "9",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "chart",
                "class": "hidden"
            }
        },
        {
            "label": "Pie chart",
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
            "label": "Time series",
            "url": "#",
            "parent_id": "9",
            "id": "9-2",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "chart",
                "data-type": "timeseries"
            }
        },
        //Map
        {
            "label": "Map",
            "url": "#",
            "parent_id": "8",
            "id": "10",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "map",
                "class": "hidden"
            }
        },
        //Table
        {
            "label": "Table",
            "url": "#",
            "parent_id": "8",
            "id": "11",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "table",
                "data-type": "standard",
                "class": "hidden"
            }
        },
        {
            "label": "Standard",
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
            "label": "Pivot",
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
