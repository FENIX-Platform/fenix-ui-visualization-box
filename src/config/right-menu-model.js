define(function () {

    'use strict';

    return [
        //Download
        {
            label: "Download",
            url: "",
            parent_id: "root",
            id: "download",
            a_attrs: {
                "data-id": "download",
                "class": "hidden"
            }
        },
        {
            label: "Resource",
            url: "",
            parent_id: "download",
            id: "download-data",
            a_attrs: {
                "data-action": "download",
                "data-id": "download",
                "data-target": "data"
            }
        },
        {
            label: "Metadata",
            url: "",
            parent_id: "download",
            id: "download-metadata",
            a_attrs: {
                "data-action": "download",
                "data-id": "download",
                "data-target": "metadata"
            }
        },
        //Visualize as
        {
            label: "Visualize as",
            url: "",
            parent_id: "root",
            id: "visualize_as"
        },
        //Chart
        {
            label: "Chart",
            url: "",
            parent_id: "visualize_as",
            id: "visualize_as_chart",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "chart",
                "data-id": "chart",
                "class": "hidden"
            }
        },
        {
            label: "Line",
            url: "",
            parent_id: "visualize_as_chart",
            id: "chart_line",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "chart",
                "data-id": "chart",
                "data-type": "line"
            }
        },
        {
            label: "Column",
            url: "",
            parent_id: "visualize_as_chart",
            id: "chart_column",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "chart",
                "data-id": "chart",
                "data-type": "column"
            }
        },
        {
            label: "Column stacked",
            url: "",
            parent_id: "visualize_as_chart",
            id: "chart_column_stacked",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "chart",
                "data-id": "chart",
                "data-type": "column_stacked"
            }
        },
        {
            label: "Area",
            url: "",
            parent_id: "visualize_as_chart",
            id: "chart_area",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "chart",
                "data-id": "chart",
                "data-type": "area"
            }
        },
/*        {
            label: "Pie",
            url: "",
            parent_id: "visualize_as_chart",
            id: "chart_pied",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "chart",
                "data-id": "chart",
                "data-type": "pie"
            }
        },*/
        //Map
        {
            label: "Map",
            url: "",
            parent_id: "visualize_as",
            id: "visualize_as_map",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "map",
                "data-id": "map",
                "class": "hidden"
            }
        },
        //Table
        {
            label: "Table",
            url: "",
            parent_id: "visualize_as",
            id: "visualize_as_table",
            a_attrs: {
                "data-action": "tab",
                "data-tab": "table",
                "data-id": "table",
                "class": "hidden"
            }
        },
        //Layout
        {
            label: "Set size",
            url: "",
            parent_id: "root",
            id: "size"
        },
        {
            label: "Full",
            url: "",
            parent_id: "size",
            id: "full",
            a_attrs: {
                "data-action": "resize",
                "data-size": "full"
            }
        },
        {
            label: "Half",
            url: "",
            parent_id: "size",
            id: "half",
            a_attrs: {
                "data-action": "resize",
                "data-size": "half"
            }
        },
    ];
});
