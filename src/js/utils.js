/*global define*/

define([
    "loglevel",
    "jquery",
    "underscore",
    "fx-v-b/config/config",
    "fx-v-b/config/config-default",
    "fx-v-b/config/errors",
    "fx-v-b/config/events"
], function (log, $, _, C, CD, ERR, EVT) {

    'use strict';

    /* API */

    function Utils() {

        return this;
    }

    Utils.prototype.mergeConfigurations = function (config, sync) {

        if (sync.toolbar) {

            var values = sync.toolbar.values;

            _.each(values, _.bind(function (obj, key) {
                if (config.hasOwnProperty(key)) {
                    config[key].selector.default = values[key];
                }

            }, this));
        }

        return config;

    };

    /* END API */

    return new Utils();
});
