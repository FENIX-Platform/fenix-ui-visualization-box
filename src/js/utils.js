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

    function Utils() {

        return this;
    }

    Utils.prototype.assign = function(obj, prop, value) {
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


    Utils.prototype.cleanArray = function(actual) {
        var newArray = [];
        for (var i = 0; i < actual.length; i++) {
            if (actual[i]) {
                newArray.push(actual[i]);
            }
        }
        return newArray;
    }


    return new Utils();
});
