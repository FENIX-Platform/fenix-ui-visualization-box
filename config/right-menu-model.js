/*global define*/
define(function () {

    'use strict';

    return [
        //Download
        {
            label: "Download",
            url: "#",
            parent_id: "-1",
            id: "1",
            a_attrs: {
                "data-id" : "download",
                "class": "hidden"
            }
        },
        {
            label: "Resource",
            url: "#",
            parent_id: "1",
            id: "11",
            a_attrs: {
                "data-action": "download",
                "data-id" : "download",
                "data-target": "data"
            }
        },
        {
            label: "Metadata",
            url: "#",
            parent_id: "1",
            id: "12",
            a_attrs: {
                "data-action": "download",
                "data-id" : "download",
                "data-target": "metadata"
            }
        },
        //Visualize as
        {
            label: "Visualize as",
            url: "#",
            parent_id: "-1",
            id: "8"
        },
        //Chart
        {
            label: "Chart",
            url: "#",
            parent_id: "8",
            id: "9",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "chart",
                "data-id" : "chart",
                "class": "hidden"
            }
        },
        {
            label: "Line",
            url: "#",
            parent_id: "9",
            id: "9-1",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "chart",
                "data-id" : "chart",
                "data-type": "line"
            }
        },
        {
            label: "Column",
            url: "#",
            parent_id: "9",
            id: "9-2",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "chart",
                "data-id" : "chart",
                "data-type": "column"
            }
        },
        {
            label: "Column stacked",
            url: "#",
            parent_id: "9",
            id: "9-2",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "chart",
                "data-id" : "chart",
                "data-type": "column_stacked"
            }
        },
        {
            label: "Area",
            url: "#",
            parent_id: "9",
            id: "9-2",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "chart",
                "data-id" : "chart",
                "data-type": "area"
            }
        },
        {
            label: "Pie",
            url: "#",
            parent_id: "9",
            id: "9-2",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "chart",
                "data-id" : "chart",
                "data-type": "pie"
            }
        },
        //Map
        {
            label: "Map",
            url: "#",
            parent_id: "8",
            id: "10",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "map",
                "data-id" : "map",
                "class": "hidden"
            }
        },
        //Table
        {
            label: "Table",
            url: "#",
            parent_id: "8",
            id: "11",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "table",
                "data-id" : "table",
                "class": "hidden"
            }
        },
        //Layout
        {
            label: "Set size",
            url: "#",
            parent_id: "-1",
            id: "22"
        },
        {
            label: "Full",
            url: "#",
            parent_id: "22",
            id: "3",
            a_attrs: {
                "data-action": "resize",
                "data-size": "full"
            }
        },
        {
            label: "Half",
            url: "#",
            parent_id: "22",
            id: "4",
            a_attrs: {
                "data-action": "resize",
                "data-size": "half"
            }
        },
    ];
});
