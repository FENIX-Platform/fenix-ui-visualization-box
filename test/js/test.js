define([
    'loglevel',
    'jquery',
    'underscore',
    'fx-v-b/start',
    'fx-v-b/config/events',
    'text!test/json/uneca_population.json'
], function (log, $, _, Box, EVT, Model) {

    'use strict';

    var s = {
            LARGE: "#box-container-large",
            MEDIUM_1: "#box-container-medium-1",
            MEDIUM_2: "#box-container-medium-2",
            DESTROY: "#box-container-destroy",
            DESTROY_BTN: "#btn-destroy",
            STATUS: "#box-container-status",
            STATuS_BTNS: "#status-btns [data-status]",
            ASYNC: "#box-container-async",
            ASYNC_BTN: "#btn-async",
            TAB: "#box-container-tabs",
            TAB_BTNS: "#tabs-btns [data-tab]",
            FLIP: "#flip-container",
            FLIP_BTNS: "#flip-btns [data-flip]",
            STATE: "#state-container",
            STATE_BTN: "#state-btn",
            CLONE : "#box-clone",
            CLONE_LIST : "#clone-list"
        },
        empty_model = {data: []},
        error_model = {},
        valid_model = JSON.parse(Model),
        boxes = [],
        //environment = "production";
        environment = "develop";

    function Test() {

    }

    Test.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Test.prototype._render = function () {

        this._renderLargeBox();

        return;

        this._renderClone();

        this._renderMediumBoxes();

        this._renderDestroyBox();

        this._renderStatusBox();

        this._renderAsyncBox();

        this._renderTabBox();

        this._renderFlipBox();

        this._renderStateBox();

    };

    Test.prototype._renderClone = function () {

        log.trace("Rendering clone box: start");

        //add 'Clone' event listeners
        amplify.subscribe(EVT.clone, _.bind(function ( state ) {

            log.info("Start cloning");
            log.info(state);

            var $el = $('<li>Clone item</li>');

            $(s.CLONE_LIST).prepend($el);

            var clone = this.createBox($.extend(true, state, { el: $el }));

        }, this));

        var box = this.createBox({
                el: s.CLONE,
                environment : environment,
                uid: "UNECA_Education",
            });

        log.trace("Rendering clone box: end");

    };

    Test.prototype._renderLargeBox = function () {

        log.trace("Rendering large box: start");

        var box = this.createBox({
            environment : environment,
            el: s.LARGE,
            //model: valid_model,
            //uid: "UNECA_Education",
            uid: "uneca_rivers_3857",
            //version: null,
            //values: {"rows":{"valid":true,"labels":{"countryname":{"Fabrizio":""},"countrycode":{"913":"African Development Bank [AfDB]","1012":"Adaptation Fund"},"indicatorname":{"Daniele":""},"indicatorcode":{"AGRI.LAND.PERC":"% of Agricultural land","NY.GNP.ATLS.CD":"GNI, Atlas method (current US$ Million)","INCOME.LEVEL.H":"High-income"},"itemname":{"Francesca cuoricina":""},"itemcode":{},"period":{"":""},"unitcode":{},"unitname":{"":""},"source":{"":""},"note":{"":""},"link":{"":""}},"values":{"countryname":["Fabrizio"],"countrycode":["1012","913"],"indicatorname":["Daniele"],"indicatorcode":["AGRI.LAND.PERC","NY.GNP.ATLS.CD","INCOME.LEVEL.H"],"itemname":["Francesca cuoricina"],"itemcode":[],"period":[""],"unitcode":[],"unitname":[""],"source":[""],"note":[""],"link":[""]}},"aggregations":{"valid":true,"labels":{"aggregations":{"countryname":"Country name","countrycode":"Country code","indicatorname":"Indicator name","indicatorcode":"Indicator code","value":"Value","unitcode":"Measurement unit","source":"Source","note":"Note","link":"Link","period":"Period","itemcode":"Item code","unitname":"Measurement unit name","itemname":"Item name"}},"values":{"aggregations":[{"value":"countryname","parent":"dimensions","label":"Country name"},{"value":"countrycode","parent":"dimensions","label":"Country code"},{"value":"indicatorname","parent":"dimensions","label":"Indicator name"},{"value":"indicatorcode","parent":"dimensions","label":"Indicator code"},{"value":"value","parent":"dimensions","label":"Value"},{"value":"unitcode","parent":"dimensions","label":"Measurement unit"},{"value":"source","parent":"dimensions","label":"Source"},{"value":"note","parent":"dimensions","label":"Note"},{"value":"link","parent":"group","label":"Link"},{"value":"period","parent":"group","label":"Period"},{"value":"itemcode","parent":"group","label":"Item code"},{"value":"unitname","parent":"group","label":"Measurement unit name"},{"value":"itemname","parent":"group","label":"Item name"}]}},"columns":{"valid":true,"labels":{"itemname":{"ASC":"Ascending"},"itemcode":{"ASC":"Ascending"},"period":{"ASC":"Ascending"},"unitname":{"ASC":"Ascending"},"link":{"ASC":"Ascending"}},"values":{"itemname":["ASC"],"itemcode":["ASC"],"period":["ASC"],"unitname":["ASC"],"link":["ASC"]}}},
            //hideToolbar: true,
            //hideMenu: true,
            //hideMetadataButton: true,
            //hideRemoveButton: true,
            //hideDownloadButton: true,
            //hideCloneButton: true,
            //hideFlipButton: true,
            //hideMinimizeButton: true,
            //face: "back",

            /*            process: [
             {
             "name": "filter",
             "parameters": {
             "rows": {
             "year": {"time": [{"from": 2015, "to": 2015}]},
             "indicator": {"codes": [{"uid": "FLUDE_INDICATORS", "codes": ["Forest"]}]}
             }
             }
             },
             {
             "name": "group",
             "parameters": {
             "by": ["incomes", "indicator"],
             "aggregations": [{"columns": ["value"], "rule": "AVG"}]
             }
             },
             {"name": "order", "parameters": {"incomes": "ASC"}}
             ],*/
        });

        log.trace("Rendering large box: end");

    };

    Test.prototype._renderMediumBoxes = function () {

        log.trace("Rendering medium boxes: start");

        var box1 = this.createBox({
                el: s.MEDIUM_1,
                model: empty_model
            }),
            box2 = this.createBox({
                el: s.MEDIUM_2,
                model: valid_model
            });

        log.trace("Rendering medium boxes: end");

    };

    Test.prototype._renderDestroyBox = function () {

        log.trace("Rendering destroy box: start");

        var box = this.createBox({
            el: s.DESTROY,
            model: valid_model
        });

        $(s.DESTROY_BTN).on("click", function () {
            log.warn("Destroy click");

            box.dispose();
        });

        log.trace("Rendering destroy boxes: end");

    };

    Test.prototype._renderStatusBox = function () {

        log.trace("Rendering status box: start");

        var box = this.createBox({
            el: s.STATUS,
            model: valid_model
        });

        $(s.STATUS_BTNS).on("click", function () {

            var status = $(this).data('status');

            log.info("Change status click: " + status);

            box.setStatus(status);

        });

        log.trace("Rendering status boxes: end");

    };

    Test.prototype._renderAsyncBox = function () {

        log.trace("Rendering async box: start");

        var box = this.createBox({
            el: s.ASYNC
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

        var box = this.createBox({
            el: s.TAB,
            model: valid_model
        });

        $(s.TAB_BTNS).on("click", function () {

            var tab = $(this).data('tab');

            log.info("Change tab click: " + tab);

            box.showTab(tab);

        });

        log.trace("Rendering tab boxes: end");

    };

    Test.prototype._renderFlipBox = function () {

        log.trace("Rendering flip box: start");

        var box = this.createBox({
            el: s.FLIP,
            model: valid_model
        });

        $(s.FLIP_BTNS).on("click", function () {

            var flip = $(this).data('flip');

            log.info("Change flip: " + flip);

            box.flip(flip);

        });

        log.trace("Rendering flip boxes: end");

    };

    Test.prototype._renderStateBox = function () {

        log.trace("Rendering state box: start");

        var box = this.createBox({
            el: s.STATE,
            model: valid_model
        });

        $(s.STATE_BTN).on("click", function () {

            var state = box.getState();

            log.warn("State:");
            log.warn(state);
        });

        log.trace("Rendering state boxes: end");

    };

    Test.prototype.createBox = function (params) {

        var instance = new Box(params);

        boxes.push(instance);

        return instance;
    };

    return new Test();

});