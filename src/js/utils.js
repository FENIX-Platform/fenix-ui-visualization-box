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

    Utils.prototype.getChartToolbarConfig = function (Model, opts) {
        return this._getToolbarConfig(Model, opts);
    };

    Utils.prototype.getMapToolbarConfig = function (Model, opts) {

        return this._getToolbarConfig(Model, opts);
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