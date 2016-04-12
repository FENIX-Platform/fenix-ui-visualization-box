/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    "underscore",
    "fx-v-b/config/config",
    "fx-v-b/config/config-default",
    "fx-v-b/config/errors",
    "fx-v-b/config/events",
    'fx-filter/js/utils',
    "text!fx-v-b/html/tabs/chart.hbs",
    'fx-filter/start',
    "fx-v-b/config/tabs/chart-toolbar-model",
    "handlebars",
    'fx-c-c/start',
    "fx-common/pivotator/functions",
    "amplify"
], function ($, log, _, C, CD, ERR, EVT, Utils, tabTemplate, Filter, ToolbarModel, Handlebars, ChartCreator, myFunc) {

    'use strict';

    var defaultOptions = {}, s = {
        TOOLBAR: "[data-role='toolbar']",
        TOOLBAR_BTN: "[data-role='toolbar'] [data-role='toolbar-btn']"
    };

    function ChartTab(o) {

        $.extend(true, this, defaultOptions, o);

        this.channels = {};
        this.status = {};

        this.chartCreator= new ChartCreator();

        return this;
    }

    /* API */
    /**
     * Tab initialization method
     * Optional method
     */
    ChartTab.prototype.init = function () {
        log.info("Tab initialized successfully");
    };

    /**
     * Method invoked when the tab is shown in the FENIX visualization box
     * Mandatory method
     */
    ChartTab.prototype.show = function (state) {

        var valid = this._validateInput();

        if (valid === true) {

            this._show(state);

            log.info("Tab shown successfully");

            return this;

        } else {

            log.error("Impossible to create show table tab");
            log.error(valid)
        }
    };

    /**
     * Check if the current model is suitable to be displayed within the tab
     * Mandatory method
     */
    ChartTab.prototype.isSuitable = function () {

        var isSuitable = this._isSuitable();

        log.info("Is tab suitable? " + isSuitable);

        return isSuitable;

    };

    /**
     * Disposition method
     * Mandatory method
     */
    ChartTab.prototype.dispose = function () {

        this._dispose();

        log.info("Tab disposed successfully");

    };

    /**
     * pub/sub
     * @return {Object} filter instance
     */
    ChartTab.prototype.on = function (channel, fn) {

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
    ChartTab.prototype.sync = function (state) {
        log.info("Sync tab. State:" + JSON.stringify(state));

        if (state.hasOwnProperty("toolbar") && this.toolbar) {
            this.toolbar.setValues(state.toolbar, true);
        } else {
            log.warn("Abort toolbar sync");
        }

        return this;
    };

    /* END - API */

    ChartTab.prototype._trigger = function (channel) {
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

    ChartTab.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if box has an id
        /*        if (!this.id) {

         window.fx_vis_box_id >= 0 ? window.fx_vis_box_id++ : window.fx_vis_box_id = 0;

         this.id = window.fx_vis_box_id;

         log.warn("Impossible to find id. Set auto id to: " + this.id);
         }         */

        //Check if $el exist
        if (this.$el.length === 0) {

            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find tab container");

        }

        return errors.length > 0 ? errors : valid;

    };

    ChartTab.prototype._show = function (syncModel) {

        if (this.initialized === true) {

            log.info("Tab table shown again");

        } else {

            log.info("Tab table shown for the first time");

            this.syncModel = syncModel;

            this._attach();

            this._initVariables();

            this._renderComponents();

            this._bindEventListeners();

            this.initialized = true;
        }

    };

    ChartTab.prototype._attach = function () {

        var template = Handlebars.compile(tabTemplate),
            html = template(this);

        this.$el.html(html);
    };

    ChartTab.prototype._initVariables = function () {

        this.$toolbar = this.$el.find(s.TOOLBAR);

        this.$toolbarBtn = this.$el.find(s.TOOLBAR_BTN);

    };

    ChartTab.prototype._bindEventListeners = function () {

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

    ChartTab.prototype._onToolbarEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("toolbar"));
        log.trace(payload);

        if (this.toolbarIsHidden !== true) {
            this.$toolbar.slideUp();
            this.toolbarIsHidden = true;
        } else {
            this.$toolbar.slideDown();
            this.toolbarIsHidden = false;
        }

    };

    ChartTab.prototype._onToolbarBtnClick = function () {

        this._renderChart();

    };

    ChartTab.prototype._renderChart = function () {

        var tempConf = this.toolbar.getValues();
        var optGr = {
            Aggregator: tempConf.values.aggregation[0],
            Formater: "value",
            GetValue: "ClassicToNumber",
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


        this.chartCreator.render({
            //$el : "id",
            adapter: {
                type: "line",
                model: this.model,
                config : optGr
            },
            template: {},
            creator: {
                container: "#chart_" + this.id,
                config : optGr

            }

        });

/*        var myrenderer = new myRenderer();
        var tempConf = this.toolbar.getValues();
        var optGr = {
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
        myrenderer.rendererGridFX(this.model, "chart_" + this.id, optGr);
        //	myrenderer.rendererGridFX(this.model,"result",optGr);

        //id olap "table-" + this.id*/

    };

    ChartTab.prototype._renderToolbar = function () {
        log.info("Table tab render toolbar");

        this.toolbar = new Filter({
            items: this._createFilterConfiguration(ToolbarModel),
            $el: this.$el.find(s.TOOLBAR)
        });

        this.toolbar.on("ready", _.bind(this._renderChart, this))

    };

    ChartTab.prototype._createFilterConfiguration = function () {

        var configuration = $.extend(true, {}, Utils.mergeConfigurations(ToolbarModel, this.syncModel || {}));

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


    ChartTab.prototype._onToolbarChangeEvent = function () {

        this._trigger("filter", this.toolbar.getValues());

        //this._renderChart();

    };

    ChartTab.prototype._renderComponents = function () {

        this._renderToolbar();

        //Table will be create when filter is 'ready'
    };


    ChartTab.prototype._unbindEventListeners = function () {

        this.$toolbarBtn.off();
        this.$el.find("[data-action]").off();

        amplify.unsubscribe(this._getEventTopic("toolbar"), this._onToolbarEvent);

    };

    ChartTab.prototype._isSuitable = function () {

        return true;
    };

    ChartTab.prototype._dispose = function () {

        if (this.status.ready === true) {
            this._unbindEventListeners();
        }
    };

    ChartTab.prototype._getEventTopic = function (evt) {

        return EVT[evt] ? EVT[evt] + this.id : evt + this.id;
    };

    return ChartTab;

});