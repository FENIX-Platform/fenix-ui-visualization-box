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

    Model.prototype.process = function () {

        this.publish(EVT.model_done, {test: "test"});

        return this;
    };

    /* pub/sub */

    Model.prototype.subscribe = function (channel, fn) {
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }

        log.info("Subscribe for: " + channel);

        this.channels[channel].push({context: this, callback: fn});
        return this;
    };

    Model.prototype.publish = function (channel) {
        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);

        log.info("Publish: " + JSON.stringify(channel));

        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }
        return this;
    };

    /* END API */

    return Model;
});
