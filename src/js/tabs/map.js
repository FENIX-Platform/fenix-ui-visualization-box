/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    "underscore",
    "handlebars",
    "fx-v-b/config/config",
    "fx-v-b/config/config-default",
    "fx-v-b/config/errors",
    "fx-v-b/config/events",
    "fx-v-b/js/utils",
    "fx-filter/js/utils",
    "text!fx-v-b/html/tabs/map.hbs",
    "fx-filter/start",
    "fx-v-b/config/tabs/map-toolbar-model",

    "fx-common/pivotator/functions",
    "fx-m-c/start",
    "amplify"
], function ($, log, _, Handlebars,
        C, CD, ERR, EVT, Utils, FilterUtils,
        mapTemplate,
        Filter,
        ToolbarModel,

        myFunc,
        MapCreator) {

    var defaultOptions = {}, s = {
        TOOLBAR: "[data-role='toolbar']",
        TOOLBAR_BTN: "[data-role='toolbar'] [data-role='toolbar-btn']"
    };

    function MapTab(o) {

        $.extend(true, this, defaultOptions, o);

        this.channels = {};
        this.state = {};

        return this;
    }

    /* API */
    /**
     * Tab initialization method
     * Optional method
     */
    MapTab.prototype.init = function () {

        log.info("Map initialized successfully");
    };

    /**
     * Method invoked when the tab is shown in the FENIX visualization box
     * Mandatory method
     */
    MapTab.prototype.show = function () {

        var valid = this._validateInput();

        if (valid === true) {

            this._show();

            log.info("Map tab shown successfully");

            return this;

        } else {

            log.error("Impossible to create show map tab");
            log.error(valid)
        }
    };

    /**
     * Check if the current model is suitable to be displayed within the tab
     * Mandatory method
     */
    MapTab.prototype.isSuitable = function () {

        var isSuitable = this._isSuitable();

        log.info("Map tab: is tab suitable? " + isSuitable);

        if (isSuitable === true) {
            return true;
        } else {
            this._setState("errors", isSuitable);
            return false;
        }
    };

    /**
     * Disposition method
     * Mandatory method
     */
    MapTab.prototype.dispose = function () {

        this._dispose();

        log.info("Tab disposed successfully");
    };

    /**
     * pub/sub
     * @return {Object} filter instance
     */
    MapTab.prototype.on = function (channel, fn) {

        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: this, callback: fn});

        return this;
    };

    /**
     * Sync tab to passed state
     * @param {Object} state
     * @return {Object} filter instance
     */
    MapTab.prototype.sync = function (state) {
        log.info("Sync tab. State:" + JSON.stringify(state));

        this.syncState = state;

        this.toSync = true;

        return this;
    };

    /* END - API */

    MapTab.prototype._trigger = function (channel) {
        if (!this.channels[channel]) {
            return false;
        }

        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }
        return this;
    };

    MapTab.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if $el exist
        if (this.$el.length === 0) {

            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find tab container");

        }

        return errors.length > 0 ? errors : valid;
    };

    MapTab.prototype._show = function () {

        if (this.initialized !== true) {

            log.info("Table table shown for the first time");

            this._attach();

            this._initVariables();

            this._renderComponents();

            this._bindEventListeners();

            this.initialized = true;

        } else {
            log.info("Tab chart shown again");
        }

        if (this.toSync === true) {
            log.info("Sync tab. State:" + JSON.stringify(this.syncState));

            if (this.syncState.hasOwnProperty("toolbar") && this.toolbar) {
                this.toolbar.setValues(this.syncState.toolbar, true);
            }

        }

        return this;
    };

    MapTab.prototype._attach = function () {

        var template = Handlebars.compile(mapTemplate),
            html = template(this);

        this.$el.html(html);
    };

    MapTab.prototype._initVariables = function () {

        this.$toolbar = this.$el.find(s.TOOLBAR);

        this.$toolbarBtn = this.$el.find(s.TOOLBAR_BTN);
    };

    MapTab.prototype._bindEventListeners = function () {

        var self = this;

        amplify.subscribe(this._getEventTopic("toolbar"), this, this._onToolbarEvent);

        this.$el.find("[data-action]").each(function () {

            var $this = $(this),
                action = $this.data("action"),
                event = self._getEventTopic(action);

            $this.on("click", {event: event, tab: self}, function (e) {
                e.preventDefault();

                log.info("Raise event: " + e.data.event);

                amplify.publish(event, {target: this, tab: e.data.tab});

            });
        });

        this.$toolbarBtn.on("click", _.bind(this._onToolbarBtnClick, this));

        //Toolbar events
        this.toolbar.on('ready', _.bind(function () {
            this.toolbar.on('change', _.bind(this._onToolbarChangeEvent, this));
        }, this));
    };

    MapTab.prototype._onToolbarEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("toolbar"));
        log.trace(payload);

        var direction = this.toolbarPosition !== "up" ? "up" : "down";

        this._slideToolbar(direction)

    };

    MapTab.prototype._slideToolbar = function (direction) {

        if (direction !== "up") {
            this.$toolbar.slideDown();
            this.toolbarPosition = "down";
        } else {
            this.$toolbar.slideUp();
            this.toolbarPosition = "up";
        }

        this._setState("toolbarPosition", this.toolbarPosition);
    };

    MapTab.prototype._onToolbarBtnClick = function () {

        this._renderMap();
    };

    MapTab.prototype._renderMap = function () {


        var mapCreator = new MapCreator();
        
        var tempConf = this.toolbar.getValues();
        //var model = this.model;

        mapCreator.render({
            container: "map_" + this.id
        });

        // TODO: add map to existing map

        // TODO: add JOIN from catalog to the map
        amplify.subscribe('fx.component.map.ready', function () {

/*            $.get('http://fenix.fao.org/d3s/msd/resources/uid/FAOSTAT_fertilizer_test?full=true&dsd=true', function (model) {

                mapCreator.addLayer(model, { colorramp: 'Greens' });
                mapCreator.addCountryBoundaries();
            });*/

            $.get('dataset/bangkok.json', function (model) {

                mapCreator.addLayer(model, { colorramp: 'Greens' });
                mapCreator.addCountryBoundaries();
                //mapCreator.addCountryLabels();
            });

        });
/*      var optGr = {
            Aggregator: tempConf.values.aggregation[0],
            Formater: "localstring",
            GetValue: "Classic",
            nbDecimal: 5,
            AGG: [],
            COLS: [],
            ROWS: [],
            HIDDEN: []
        };
        for (var i in tempConf.values.sort) {
            optGr[tempConf.values.sort[i].parent].push(tempConf.values.sort[i].value)
            //console.log("CREATE CONF",tempConf.values.sort[i].parent,tempConf.values.sort[i].value)
        }

        console.log("optGr",optGr)
        myrenderer.rendererGridFX(this.model, "table_" + this.id, optGr);
        //	myrenderer.rendererGridFX(this.model,"result",optGr);

        //id olap "table-" + this.id*/

    };

    MapTab.prototype._renderToolbar = function () {
        log.info("Table tab render toolbar");

        this.toolbar = new Filter({
            items: this._createFilterConfiguration(ToolbarModel),
            $el: this.$el.find(s.TOOLBAR)
        });

        this.toolbar.on("ready", _.bind(
            this._renderMap,
        this))

    };

    MapTab.prototype._createFilterConfiguration = function () {

        var configuration = $.extend(true, {}, FilterUtils.mergeConfigurations(ToolbarModel, this.syncModel || {}));

        try {

            var aggregatorLists = new myFunc().getListAggregator(),
                FX = this.model.metadata.dsd;

            for (var i in aggregatorLists) {
                if (aggregatorLists.hasOwnProperty(i)) {
                    configuration.aggregation.selector.source
                        .push({"value": aggregatorLists[i], "label": aggregatorLists[i]})
                }
            }

            for (i in FX.columns) {
                if (FX.columns.hasOwnProperty(i)) {
                    if (FX.columns[i].subject == "value") {
                        configuration.sort.selector.source.push({
                            "value": FX.columns[i].id,
                            "label": FX.columns[i].id,
                            parent: 'HIDDEN'
                        })
                    }
                    else if (FX.columns[i].subject != "time") {
                        configuration.sort.selector.source.push({
                            "value": FX.columns[i].id,
                            "label": FX.columns[i].id,
                            parent: 'ROWS'
                        })
                    }
                    else if (FX.columns[i].subject == "time") {

                        configuration.sort.selector.source.push({
                            "value": FX.columns[i].id,
                            "label": FX.columns[i].id,
                            parent: 'COLS'
                        })
                    }
                }

            }
        } catch (e) {
            log.error("Table tab: Error on _createFilterConfiguration() ");
            log.error(e);
            return configuration;
        }

        return configuration;

    };


    MapTab.prototype._onToolbarChangeEvent = function () {

        this._trigger("toolbar.change", this.toolbar.getValues());

    };

    MapTab.prototype._renderComponents = function () {

        this._renderToolbar();

        //Table will be create when filter is 'ready'

        //init toolbar position
        var position = this.initial.toolbarPosition || C.toolbarPosition || CD.toolbarPosition;
        if (position === 'up') {
            this.toolbarPosition = 'up';
            this.$toolbar.hide();
        } else {
            this.toolbarPosition = 'down';
        }

    };


    MapTab.prototype._unbindEventListeners = function () {

        this.$toolbarBtn.off();
        this.$el.find("[data-action]").off();

        amplify.unsubscribe(this._getEventTopic("toolbar"), this._onToolbarEvent);

    };

    MapTab.prototype._isSuitable = function () {

        var valid = true,
            errors = [];

        //errors.push({code: ERR.MISSING_CONTAINER});

        return errors.length > 0 ? errors : valid;
    };

    MapTab.prototype._dispose = function () {

        if (this.ready === true) {
            this._unbindEventListeners();
        }
    };

    MapTab.prototype._getEventTopic = function (evt) {

        return EVT[evt] ? EVT[evt] + this.id : evt + this.id;
    };

    MapTab.prototype._setState = function (key, val) {

        Utils.assign(this.state, key, val);

        this._trigger("state", $.extend(true, {}, this.state));
    };

    return MapTab;

});