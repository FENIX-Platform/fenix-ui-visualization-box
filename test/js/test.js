define([
    'loglevel',
    'jquery',
    'fx-v-b/start',
    'text!test/json/uneca_population.json'
],function (log, $, Box, Model){

    'use strict';

    var s = {
        LARGE : "#box-container-large",
        MEDIUM_1 : "#box-container-medium-1",
        MEDIUM_2 : "#box-container-medium-2",
        DESTROY :  "#box-container-destroy",
        DESTROY_BTN :  "#btn-destroy",
        STATE: "#box-container-status",
        STATE_BTNS :  "#status-btns [data-status]",
        ASYNC: "#box-container-async",
        ASYNC_BTN: "#btn-async",
        TAB: "#box-container-tabs",
        TAB_BTNS: "#tabs-btns [data-tab]"
    },
        empty_model = { data : [] },
        error_model = {},
        valid_model = JSON.parse(Model);

    function Test(){

    }

    Test.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Test.prototype._render = function () {

        this._renderLargeBox();

        return;

        this._renderMediumBoxes();

        this._renderDestroyBox();

        this._renderStatusBox();

        this._renderAsyncBox();

        this._renderTabBox();

    };

    Test.prototype._renderLargeBox = function () {

        log.trace("Rendering large box: start");

        var box = new Box({
            el : s.LARGE,
            model : valid_model
        });

        log.trace("Rendering large box: end");

    };

    Test.prototype._renderMediumBoxes = function () {

        log.trace("Rendering medium boxes: start");

        var box1 = new Box({
                el : s.MEDIUM_1,
                model : empty_model
            }),
            box2 = new Box({
                el : s.MEDIUM_2,
                model : valid_model
            });

        log.trace("Rendering medium boxes: end");

    };

    Test.prototype._renderDestroyBox = function () {

        log.trace("Rendering destroy box: start");

        var box = new Box({
                el : s.DESTROY,
                model : valid_model
            });

        $(s.DESTROY_BTN).on("click", function () {
            log.warn("Destroy click");

            box.dispose();
        });

        log.trace("Rendering destroy boxes: end");

    };

    Test.prototype._renderStatusBox = function () {

        log.trace("Rendering status box: start");

        var box = new Box({
            el : s.STATE,
            model : valid_model
        });

        $(s.STATE_BTNS).on("click", function () {

            var status = $(this).data('status');

            log.info("Change status click: " + status);

            box.setStatus(status);

        });

        log.trace("Rendering state boxes: end");

    };

    Test.prototype._renderAsyncBox = function () {

        log.trace("Rendering async box: start");

        var box = new Box({
            el : s.ASYNC
        });

        $(s.ASYNC_BTN).on("click", function () {

            log.info("Add model click");

            box.render({
                model: valid_model
            });

        });

        log.trace("Rendering async boxes: end");

    };

    Test.prototype._renderTabBox = function () {

        log.trace("Rendering tab box: start");

        var box = new Box({
            el : s.TAB,
            model : valid_model
        });

        $(s.TAB_BTNS).on("click", function () {

            var tab = $(this).data('tab');

            log.info("Change tab click: " + tab);

            box.showTab(tab);

        });

        log.trace("Rendering tab boxes: end");

    };

    return new Test();

});