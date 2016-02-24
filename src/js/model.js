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

    function Model(obj) {
        log.info("Create Model Manager");
        log.trace(obj);

        this.channels = [];

        return this;
    }

    /**
     * Process a model
     * @param {Object} params
     * @return {promise} deferredObject
     */
    Model.prototype.process = function (params) {

        var deferredObject = $.Deferred();

        //sync or async code

        setTimeout(function() {
            var randomValue = Math.random();
            if(randomValue < 0.5) {
                deferredObject.resolve({test: "test"});
            } else {
                deferredObject.reject();
            }
        }, 1000);

        return deferredObject.promise();
    };

    /* END API */

    return Model;
});
