/*global define*/
define(function () {

    'use strict';

    return [
        //Download
        {
            "label": "Download",
            "url": "#",
            "parent_id": "-1",
            "id": "1"
        },
        {
            "label": "Resource",
            "url": "#",
            "parent_id": "1",
            "id": "11",
            "a_attrs": {
                "data-action": "download",
                "data-target": "data"
            }
        },
        {
            "label": "Metadata",
            "url": "#",
            "parent_id": "1",
            "id": "12",
            "a_attrs": {
                "data-action": "download",
                "data-target": "metadata"
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
        {
            "label": "Visualize as",
            "url": "#",
            "parent_id": "-1",
            "id": "8"
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
            "label": "Line",
            "url": "#",
            "parent_id": "9",
            "id": "9-1",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "chart",
                "data-type": "line"
            }
        },
        {
            "label": "Column",
            "url": "#",
            "parent_id": "9",
            "id": "9-2",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "chart",
                "data-type": "column"
            }
        },
        {
            "label": "Column stacked",
            "url": "#",
            "parent_id": "9",
            "id": "9-2",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "chart",
                "data-type": "column_stacked"
            }
        },
        {
            "label": "Area",
            "url": "#",
            "parent_id": "9",
            "id": "9-2",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "chart",
                "data-type": "area"
            }
        },
        {
            "label": "Pie",
            "url": "#",
            "parent_id": "9",
            "id": "9-2",
            "a_attrs": {
                "data-action": "tab",
                "data-tab": "chart",
                "data-type": "pie"
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
                "class": "hidden"
            }
        }
    ];
});
