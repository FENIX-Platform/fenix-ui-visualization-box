/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    "underscore",
    "fx-v-b/config/config",
    "fx-v-b/config/config-default",
    "fx-v-b/config/errors",
    "fx-v-b/config/events",
    "fx-common/pivotator/fenixtool"
], function ($, log, _, C, CD, ERR, EVT, FenixTool) {

    'use strict';


    function Utils() {
        return this;
    }

    //Toolbar configurations

    Utils.prototype.getToolbarConfig = function (config, mod) {

        var configuration = $.extend(true, {}, config),
            model = $.extend(true, {}, mod);

        var fenixtool = new FenixTool(),
            fxMod = fenixtool.initFXT(model.metadata.dsd, {});

        var aggregations = fxMod.aggregations,
            columns = fxMod.columns,
            rows = fxMod.rows,
            hidden = fxMod.hidden,
            values = fxMod.values;

        if (columns.length !== 0) {
            _.each(columns, function (dim) {
                dim.parent = "columns";
                configuration.sort.selector.source.push(dim)
            });
        } else {
            configuration.sort.selector.source.push({value: "", label: "", parent: "columns"})
        }

        if (rows.length !== 0) {
            _.each(rows, function (dim) {
                dim.parent = "rows";
                configuration.sort.selector.source.push(dim)
            });
        } else {
            configuration.sort.selector.source.push({value: "", label: "", parent: "rows"})

        }

        if (hidden.length !== 0) {
            _.each(rows, function (dim) {
                dim.parent = "hidden";
                configuration.sort.selector.source.push(dim)
            });
        } else {
            configuration.sort.selector.source.push({value: "", label: "", parent: "hidden"})

        }

        return configuration;
    };

    Utils.prototype.getTableToolbarConfig = function (config, mod) {
        return this.getToolbarConfig(config, mod);
    };

    Utils.prototype.getChartToolbarConfig = function (config, mod) {
        return this.getToolbarConfig(config, mod);
    };

    Utils.prototype.getMapToolbarConfig = function (config, mod) {
        return this.getToolbarConfig(config, mod);
    };

    //Creators configurations

    Utils.prototype.getCreatorConfiguration = function (values, dsd) {

        var ret = {
            aggregations: {},
            columns: {},
            rows: {},
            hidden: {},
            values: {},
            aggregationFn : {}
        };

        for (var i in values.values.sort) {
            var sorttemp = values.values.sort[i]
            if (sorttemp.parent == "rows") {
                ret.rows[sorttemp.value] = true;
            }
            else if (sorttemp.parent == "columns") {
                ret.columns[sorttemp.value] = true;
            }
        }
        ret.aggregationFn["value"] = true;
        ret.valueOutputType = "classicToNumber";
        ret.formatter = "value";
        ret.decimals = 2;
        ret.showUnit = false;
        ret.showFlag = false;
        ret.showCode = false;
        ret.showRowHeaders = true;

        var myFenixTool = new FenixTool();

        var ret2 = myFenixTool.initFXD(dsd, ret);

        $.extend(ret, ret2);

        return ret;
    };

    Utils.prototype.getChartCreatorConfiguration = function (values, dsd) {

        var creatorConfig = this.getCreatorConfiguration(values, dsd);

        var pc = {};

        pc.aggregationFn = creatorConfig.aggregationFn;

        pc.aggregations = creatorConfig.aggregations || [];
        pc.hidden = creatorConfig.hidden || [];
        pc.x = creatorConfig.columns || [];
        pc.y = creatorConfig.values || ["value"];
        pc.series = creatorConfig.rows;

        pc.formatter = creatorConfig.formatter || "value";
        pc.valueOutputType = creatorConfig.valueOutputType;
        pc.showRowHeaders = creatorConfig.showRowHeaders || false;
        pc.decimals = creatorConfig.decimals || 2;

        pc.showCode = creatorConfig.showCode || false;
        pc.showFlag = creatorConfig.showFlag || false;
        pc.showUnit = creatorConfig.showUnit || false;

        return pc;
    };

    Utils.prototype.getTableCreatorConfiguration = function (values, dsd) {

        var creatorConfig = this.getCreatorConfiguration(values, dsd);

        //convert here

        return creatorConfig;
    };

    Utils.prototype.getMapCreatorConfiguration = function (values, dsd) {

        var creatorConfig = this.getCreatorConfiguration(values, dsd);

        //convert here

        return creatorConfig;
    };

    return new Utils();

});