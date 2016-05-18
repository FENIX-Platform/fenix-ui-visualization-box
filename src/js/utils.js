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

    Utils.prototype._getToolbarConfig = function (Model) {

        return this.fenixTool.toFilter(Model);
    };

    Utils.prototype.getTableToolbarConfig = function (Model) {

        return this._getToolbarConfig(Model);
    };

    Utils.prototype.getChartToolbarConfig = function (Model) {
        return this._getToolbarConfig(Model);
    };

    Utils.prototype.getMapToolbarConfig = function (Model) {

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

        return {};
    };

    return new Utils();

});