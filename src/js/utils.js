define([
    "jquery",
    "loglevel",
    "underscore",
    "../config/config",
    "../config/errors",
    "../config/events",
    "fenix-ui-pivotator-utils",
    "../nls/labels"
], function ($, log, _, C, ERR, EVT, FenixTool, i18nLabels) {

    'use strict';

    function Utils() {
        this.fenixTool = new FenixTool();
        return this;
    }

    //Toolbar configurations

    Utils.prototype._getToolbarConfig = function (Model, opts) {

        //log.info("Calling ... to Filter")
        // console.log(JSON.stringify(Model).toString())
        // log.info(opts)
        return this.fenixTool.toFilter(Model, opts);
    };

    Utils.prototype.getTableToolbarConfig = function (Model, opts) {

        log.info("Calling _getToolbarConfig");
        log.info(Model)
        log.info(opts)
        return this._getToolbarConfig(Model, opts);
    };

    Utils.prototype.getChartToolbarConfig = function (Model) {
        return this._getToolbarConfig(Model,  {
            rowLabel: i18nLabels.series,
            columnsLabel: i18nLabels.xAxis,
            valuesLabel: i18nLabels.yAxis
        });
    };

    Utils.prototype.getMapToolbarConfig = function (Model, opts) {

        return {};
    };

    //Creators configurations

    Utils.prototype.getChartCreatorConfiguration = function (values) {

        return this.fenixTool.toChartConfig(values);
    };

    Utils.prototype.getTableCreatorConfiguration = function (values) {

        return this.fenixTool.toTableConfig(values);
    };

    Utils.prototype.getMapCreatorConfiguration = function (values) {

        return this.fenixTool.toTableConfig(values);
    };

    /* COMMONS */

    Utils.prototype.assign = function (obj, prop, value) {
        if (typeof prop === "string")
            prop = prop.split(".");

        if (prop.length > 1) {
            var e = prop.shift();
            this.assign(obj[e] =
                    Object.prototype.toString.call(obj[e]) === "[object Object]"
                        ? obj[e]
                        : {},
                prop,
                value);
        } else {
            obj[prop[0]] = value;
        }
    };

    Utils.prototype.getNestedProperty = function (path, obj) {

        var obj = $.extend(true, {}, obj),
            arr = path.split(".");

        while (arr.length && (obj = obj[arr.shift()]));

        return obj;

    };

    Utils.prototype.cleanArray = function (actual) {
        var newArray = [];
        for (var i = 0; i < actual.length; i++) {
            if (actual[i]) {
                newArray.push(actual[i]);
            }
        }
        return newArray;
    };

    return new Utils();

});