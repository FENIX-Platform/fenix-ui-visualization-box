/*global define*/
define(function () {

    'use strict';

    return {

        confirm_remove : "Remove resource?",
        submit_button : "Submit",
        reset_button : "Reset",
        add_button : "Add",
        remove_button : "Remove",
        cancel_button : "Cancel",

        computed_resource : " (computed)",
        computed_export : "This is a computed resource.",

        back_current_resource : "Resources",
        no_number_datatype : "Impossible to aggregate for [{{ dimensions }}] because the data type is not number",
        value_in_group_by : "'Value' dimension can not be in group by",
        missing_group_by : "Specify at least one 'group by'",
        missing_value_in_aggregation_rules : "'Value' should be in Sum, Average, First or Last",
        group_by_contains_no_key : "'Group by' can contains only key dimensions",
        exclude_key_dimension : "The dimensions [{{ dimensions }}] can not be excluded because keys.",

        aggregations_dimensions : "Dimensions",
        aggregations_group : "Group by",
        aggregations_sum : "Sum",
        aggregations_avg : "Average",
        aggregations_first : "First",
        aggregations_last : "Last",

        map_select_overlay : "Select Overlayer",
        map_baselayers: "Base Layers",
        map_selected_layers: "Selected Layers",
        map_show_bounds: "Show Map Boundaries",
        map_show_labels: "Show Map Labels",

        //back steps
        step_metadata : "Metadata",
        step_filter: "Filter",
        step_aggregations : "Aggregations",
        step_map : "Earthstat Layer Collection",

        series : "Series",
        xAxis : "X Axis",
        yAxis : "Y Axis",

        tooltip_right_menu : "Settings",
        tooltip_remove_button : "Close resource",
        tooltip_resize_button : "Resize resource",
        tooltip_clone_button : "Clone resource",
        tooltip_flip_button : "Resource filtering",
        tooltip_metadata_button : "Visualize metadata",
        tooltip_minimize_button : "Minimize resource",
        tooltip_download_button : "Download resource",
        tooltip_toolbar_button : "Visualization options",

        //Error content
        error_content_title : "An error occurred",
        error_content_text : "You can remove the AVB, please use the button below",
        empty_content_title : "The result is empty",
        empty_content_text : "You can remove the AVB or redo the filtering, please use the button below",
        huge_content_title : "The result is too big for the visualization",
        huge_content_text : "You can redo the filtering, please use the button below",

        //menu
        menu_download : "Download",
        menu_download_data : "Resource",
        menu_download_metadata : "Metadata",
        menu_visualize_as : "Visualize as",
        menu_visualize_as_chart : "Chart",
        menu_chart_line : "Line",
        menu_chart_column : "Column",
        menu_chart_column_stacked : "Column stacked",
        menu_chart_area : "Area",
        menu_visualize_as_map : "Map",
        menu_visualize_as_table : "Table",
        menu_size : "Size",
        menu_full : "Full",
        menu_half : "Half",

        //table toolbar
        tab_table_toolbar_format : "Format",
        tab_table_toolbar_decimals : "Decimals",
        tab_table_toolbar_show : "Show",
        tab_table_toolbar_dimensionsSort : "Sort dimension",
        tab_table_toolbar_aggregationValue : "Aggregator for Value",
        tab_table_toolbar_rows : "Rows",
        tab_table_toolbar_columns : "Columns",
        tab_table_toolbar_hidden : "Hidden",
        tab_table_toolbar_values : "Values",
        tab_table_toolbar_aggregations : "Aggregations",
        tab_table_toolbar_unit : "Unit",
        tab_table_toolbar_flag : "Flag",
        tab_table_toolbar_code : "Code"
    }
});