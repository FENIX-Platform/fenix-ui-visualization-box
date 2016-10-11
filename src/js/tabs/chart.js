define([
    "jquery",
    "loglevel",
    "underscore",
    "fx-box/config/config",
    "fx-box/config/errors",
    "fx-box/config/events",
    "fx-box/js/utils",
    'fx-common/utils',
    "text!fx-box/html/tabs/chart.hbs",
    'fx-filter/start',
    "fx-box/config/tabs/chart-toolbar-model",
    "i18n!fx-box/nls/labels",
    "handlebars",
    'fx-chart/start',
    "amplify"
], function ($, log, _, C, ERR, EVT, BoxUtils, Utils, tabTemplate, Filter, ToolbarModel, i18nLabels, Handlebars, ChartCreator) {

    'use strict';

    var s = {
        TOOLBAR: "[data-role='toolbar']",
        FILTER_BTN: "[data-role='filter-btn']"
    };

    function ChartTab(obj) {

        $.extend(true, this, {initial: obj, $el: $(obj.el), box: obj.box, model: obj.model, id: obj.id});

        this.channels = {};
        this.state = {};

        this.nls = $.extend(true, {}, i18nLabels, this.initial.nls);

        this.cache = this.initial.cache;

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
    ChartTab.prototype.show = function (opts) {

        var valid = this._validateInput();

        if (valid === true) {

            this._show(opts);

            log.info("Chart tab shown successfully");

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

        log.info("Chart tab: is tab suitable? ", isSuitable);

        if (isSuitable === true) {
            return true;
        } else {
            log.error(isSuitable);
            this._setState("errors", isSuitable);
            return false;
        }

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
     * @return {Object} component instance
     */
    ChartTab.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    /**
     * Sync tab to passed state
     * @param {Object} state
     * @return {Object} chart tab instance
     */
    ChartTab.prototype.sync = function (state) {
        log.info("Sync tab. State:" + JSON.stringify(state));

        this.syncState = state;

        this.toSync = true;

        return this;
    };

    /**
     * Force redrawing
     * @return {Object} chart tab instance
     */
    ChartTab.prototype.redraw = function () {

        if (this.chart && $.isFunction(this.chart.redraw)){
            this.chart.redraw();
        } else {
            log.warn("Abort redraw");
        }

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

    ChartTab.prototype._show = function (opts) {

        this.type = opts.type;

        if (this.initialized !== true) {

            log.info("Tab chart shown for the first time");

            this._attach();

            this._initVariables();

            this._renderComponents();

            this._bindEventListeners();

            this.initialized = true;

        } else {
            log.info("Tab chart shown again");

            if (this.toSync === true) {
                log.info("Sync tab. State:" + JSON.stringify(this.syncState));

                if (this.syncState.hasOwnProperty("toolbar") && this.toolbar) {
                    this.toolbar.setValues(this.syncState.toolbar, true);
                    this.type = opts.type;
                    this._renderChart();

                } else {
                    this._updateChart()
                }
            }
        }

        return this;

    };

    ChartTab.prototype._attach = function () {

        var template = Handlebars.compile(tabTemplate),
            html = template($.extend(true, {}, this, this.nls));

        this.$el.html(html);

        var initialConfig = this.initial.config || {};

        if (initialConfig.toolbar && initialConfig.toolbar.template) {
            this.$el.find(s.TOOLBAR).html(initialConfig.toolbar.template);
        }

    };

    ChartTab.prototype._initVariables = function () {

        this.$toolbar = this.$el.find(s.TOOLBAR);

        this.$toolbarBtn = this.$el.find(s.FILTER_BTN);

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
        if (C.syncTabsOnToolbarChange === true) {
            this.toolbar.on('change', _.bind(this._onToolbarChangeEvent, this));
        } else {
            log.warn("Tab sync is disabled by configuration")
        }

    };

    ChartTab.prototype._onToolbarEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("toolbar"));
        log.trace(payload);

        var direction = this.toolbarPosition !== "up" ? "up" : "down";

        this._slideToolbar(direction)

    };

    ChartTab.prototype._slideToolbar = function (direction) {

        if (direction !== "up") {
            this.$toolbar.addClass('in');
            this.$toolbarBtn.addClass('in');
            this.toolbarPosition = "down";
        } else {
            this.$toolbar.removeClass('in');
            this.$toolbarBtn.removeClass('in');
            this.toolbarPosition = "up";
        }

        this._setState("toolbarPosition", this.toolbarPosition);

    };

    ChartTab.prototype._onToolbarBtnClick = function () {

        this._onToolbarEvent();

        this._onConfigurationChange();

    };

    ChartTab.prototype._renderChart = function () {

        var toolbarValues = this.toolbar.getValues(),
            initialConfig = this.initial.config || {},
            configuration;

        if (typeof initialConfig.config === "function") {
            configuration = initialConfig.config.call(this, this.model, toolbarValues)
        } else {
            configuration = BoxUtils.getChartCreatorConfiguration(toolbarValues)
        }

        if (C.renderVisualizationComponents === false ) {
            log.warn("Render Visualization component blocked by configuration");
            return;
        }

        this.chart = new ChartCreator($.extend(true, {}, configuration, {
            model: this.model,
            el: "#chart_" + this.id,
            type: this.type
        }));

    };

    ChartTab.prototype._updateChart = function () {

        var toolbarValues = this.toolbar.getValues(),
            configuration = BoxUtils.getChartCreatorConfiguration(toolbarValues);

        if (C.renderVisualizationComponents === false) {
            log.warn("Render Visualization component blocked by configuration");
            return;
        }

        this.chart.update($.extend(true, {}, configuration, {
            model: this.model,
            el: "#chart_" + this.id,
            type: this.type
        }));

    };

    ChartTab.prototype._renderToolbar = function () {
        log.info("Chart tab render toolbar");

        this.toolbar = new Filter({
            items: this._createFilterConfiguration(),
            cache : this.cache,
            el: this.$el.find(s.TOOLBAR),
            environment: this.initial.environment
        });

        this.toolbar.on("ready", _.bind(this._renderChart, this))

    };

    ChartTab.prototype._createFilterConfiguration = function () {

        var initialConfig = this.initial.config || {},
            toolbarConfig = initialConfig.toolbar || {},
            result;

        switch(typeof toolbarConfig.config) {
            case "function" :
                result = toolbarConfig.config(this.model);
                break;
            case "object" :
                result = toolbarConfig.config;
                break;
            default :
                var configurationFromFenixTool = BoxUtils.getChartToolbarConfig(this.model),
                    configuration = $.extend(true, {}, ToolbarModel, configurationFromFenixTool);

                result = $.extend(true, {}, Utils.mergeConfigurations(configuration, this.syncState.toolbar || {}));
        }

        return result;

    };

    ChartTab.prototype._onToolbarChangeEvent = function () {

        this._onConfigurationChange();

    };

    ChartTab.prototype._onConfigurationChange = function () {

        this._trigger("filter", this.toolbar.getValues());

        this._renderChart();

    };

    ChartTab.prototype._renderComponents = function () {

        this._renderToolbar();

        //Chart will be create when filter is 'ready'

        //init toolbar position
        var position = this.initial.toolbarPosition || C.toolbarPosition ;
        if (position === 'up') {
            this.toolbarPosition = 'up';
            //this.$toolbar.hide();
        } else {
            this.toolbarPosition = 'down';
        }
    };

    ChartTab.prototype._unbindEventListeners = function () {

        this.$toolbarBtn.off();
        this.$el.find("[data-action]").off();

        amplify.unsubscribe(this._getEventTopic("toolbar"), this._onToolbarEvent);

    };

    ChartTab.prototype._isSuitable = function () {

        var valid = true,
            errors = [];

        var resourceType = Utils.getNestedProperty("metadata.meContent.resourceRepresentationType", this.model);

        if (resourceType !== "dataset") {
            errors.push({code: ERR.INCOMPATIBLE_RESOURCE_TYPE});
        }

        return errors.length > 0 ? errors : valid;
    };

    ChartTab.prototype._dispose = function () {

        if (this.ready === true) {
            this._unbindEventListeners();
        }
    };

    ChartTab.prototype._getEventTopic = function (evt) {

        return EVT[evt] ? EVT[evt] + this.id : evt + this.id;
    };

    ChartTab.prototype._setState = function (key, val) {

        Utils.assign(this.state, key, val);

        this._trigger("state", $.extend(true, {}, this.state));

    };

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

    /**
     * pub/sub
     * @return {Object} component instance
     */
    ChartTab.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    return ChartTab;

});