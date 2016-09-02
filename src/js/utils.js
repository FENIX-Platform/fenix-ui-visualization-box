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

        return this.fenixTool.toFilter(Model, opts);
    };

    Utils.prototype.getTableToolbarConfig = function (Model, opts) {

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

    return new Utils();

});