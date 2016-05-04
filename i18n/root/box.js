/*global define*/
define(function () {

    'use strict';

    return {

        confirm_remove : "Are you sure?",
        submit_button : "Submit",
        reset_button : "Reset",
        add_button : "Add",
        remove_button : "Remove",

        back_current_resource : "Current resource",
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

        //back steps
        step_metadata : "Metadata",
        step_filter: "Filter",
        step_aggregations : "Aggregations",
        step_map : "Map Layers"


    }
});