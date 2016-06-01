/* global define */
define(function () {

    'use strict';

    var prefix = "";

    return {

        MISSING_CONTAINER : prefix + "missing_container",
        LOAD_RESOURCE : prefix + "load_resource",
        LOAD_METADATA : prefix + "load_metadata",
        MISSING_TAB : prefix + "missing_tab",
        FETCH_RESOURCE : prefix + "fetch_resource",
        MISSING_DATASOURCES :  prefix + "missing_datasources",
        UNKNOWN_RESOURCE_TYPE :  prefix + "unknown_resource_type",

        //Back filter datatype
        NO_NUMBER_DATATYPE : "no_number_datatype",
        VALUE_IN_GROUP_BY : "value_in_group_by",
        MISSING_GROUP_BY : "missing_group_by",
        MISSING_VALUE_IN_AGGREGATION_RULES : "missing_value_in_aggregation_rules",
        GROUP_BY_CONTAINS_NO_KEY : "group_by_contains_no_key",
        EXCLUDE_KEY_DIMENSION: "exclude_key_dimension",

        INCOMPATIBLE_RESOURCE_TYPE : "incompatible_resource_type"
        

    };
});
