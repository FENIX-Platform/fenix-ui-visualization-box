define([
    'loglevel',
    'fx-v-b/start',
    'text!test/json/uneca_population.json'
],function (log, Box, Model){

    'use strict';

    var s = {
        LARGE : "#box-container-large",
        MEDIUM_1 : "#box-container-medium-1",
        MEDIUM_2 : "#box-container-medium-2"
    };

    function Test(){

    }

    Test.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Test.prototype._render = function () {

        this._renderLargeBox();

        this._renderMediumBoxes();

    };

    Test.prototype._renderLargeBox = function () {

        log.trace("Rendering large box: start");

        var box = new Box({
            el : s.LARGE
        });

        log.trace("Rendering large box: end");

    };

    Test.prototype._renderMediumBoxes = function () {

        log.trace("Rendering medium boxes: start");

        var box1 = new Box({
                el : s.MEDIUM_1
            }),
            box2 = new Box({
                el : s.MEDIUM_2
            });

        log.trace("Rendering medium boxes: end");

    };

    return new Test();

});