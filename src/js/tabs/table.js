define([
    "jquery",
    "loglevel",
    "underscore",
    "../../config/config",
    "../../config/errors",
    "../../config/events",
    "../../js/utils",
    'fenix-ui-filter-utils',
    "../../html/tabs/table.hbs",
    'fenix-ui-filter',
    "../../config/tabs/table-toolbar-model",
    "../../nls/labels",
    'fenix-ui-table-creator',
    "amplify-pubsub"
], function ($, log, _, C, ERR, EVT, BoxUtils, Utils, tabTemplate, Filter, ToolbarModel, i18nLabels, Table, amplify) {

    'use strict';

    var s = {
        TOOLBAR: "[data-role='toolbar']",
        FILTER_BTN: "[data-role='filter-btn']"
    };

    function TableTab(obj) {

        $.extend(true, this, {initial: obj, $el: $(obj.el), box: obj.box, model: obj.model, id: obj.id});

        this.channels = {};
        this.state = {};

        this.cache = this.initial.cache;
        this.lang = this.initial.lang;

        return this;
    }

    /* API */
    /**
     * Tab initialization method
     * Optional method
     */
    TableTab.prototype.init = function () {
        log.info("Tab initialized successfully");
    };

    /**
     * Method invoked when the tab is shown in the FENIX visualization box
     * Mandatory method
     */
    TableTab.prototype.show = function (opts) {

        var valid = this._validateInput();

        if (valid === true) {

            this._show(opts);

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
    TableTab.prototype.isSuitable = function () {
        var isSuitable = this._isSuitable();

        log.info("Table tab: is tab suitable?", isSuitable);

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
    TableTab.prototype.dispose = function () {

        this._dispose();

        log.info("Table tab disposed successfully");

    };

    /**
     * pub/sub
     * @return {Object} component instance
     */
    TableTab.prototype.on = function (channel, fn, context) {
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
     * @return {Object} filter instance
     */
    TableTab.prototype.sync = function (state) {
        log.info("Sync tab. State:" + JSON.stringify(state));

        this.syncState = state;

        this.toSync = true;

        return this;
    };

    /* END - API */

    TableTab.prototype._trigger = function (channel) {

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

    TableTab.prototype._validateInput = function () {

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

    TableTab.prototype._show = function (opts) {

        //TODO opts contain the chart type

        if (this.initialized !== true) {

            log.info("Tab table shown for the first time");

            this._attach();

            this._initVariables();

            this._renderComponents();

            this._bindEventListeners();

            this.initialized = true;

        } else {
            log.info("Tab table shown again");
        }

        if (this.toSync === true) {
            log.info("Sync tab. State:" + JSON.stringify(this.syncState));

            if (this.syncState.hasOwnProperty("toolbar") && this.toolbar) {

                this.toolbar.setValues(this.syncState.toolbar, true);

                this._renderTable();
            }
        }

        return this;
    };

    TableTab.prototype._attach = function () {
        var html = tabTemplate($.extend(true, {}, this, i18nLabels[this.lang.toLowerCase()]));

        this.$el.html(html);
    };

    TableTab.prototype._initVariables = function () {

        this.$toolbar = this.$el.find(s.TOOLBAR);

        this.$toolbarBtn = this.$el.find(s.FILTER_BTN);


    };

    TableTab.prototype._bindEventListeners = function () {

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

        if (C.syncTabsOnToolbarChange === true) {
            this.toolbar.on('change', _.bind(this._onToolbarChangeEvent, this));
        }

        this.$el.find('[data-toggle="tooltip"]').tooltip();

    };

    TableTab.prototype._onToolbarEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("toolbar"));
        log.trace(payload);

        var direction = this.toolbarPosition !== "up" ? "up" : "down";

        this._slideToolbar(direction)

    };

    TableTab.prototype._slideToolbar = function (direction) {

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

    TableTab.prototype._onToolbarBtnClick = function () {

        this._onToolbarEvent();

        this._onConfigurationChange();

    };

    TableTab.prototype._renderTable = function () {

        var toolbarValues = this.toolbar.getValues(),
            configuration = BoxUtils.getTableCreatorConfiguration(toolbarValues);

        if (C.renderVisualizationComponents === false) {
            log.warn("Render Visualization component blocked by configuration");
            return;
        }

        var config = $.extend(true, {}, {
            model: this.model,
            el: "#table_" + this.id,
            lang : this.lang.toUpperCase()
        }, configuration);

        this.table = new Table(config);
    };

    TableTab.prototype._renderToolbar = function () {
        log.info("Table tab render toolbar");

        var self = this,
            model = {
            selectors: this._createFilterConfiguration(ToolbarModel),
            cache: this.cache,
            el: this.$el.find(s.TOOLBAR),
            environment: this.initial.environment
        };

        //force labels

        var labeled = {};

        if (model.selectors.hasOwnProperty("dimensionsSort")) {

            _.each(model.selectors.dimensionsSort.selector.config.groups,function(value, key) {
                labeled[key] = i18nLabels[self.lang.toLowerCase()]["tab_table_toolbar_" + key];
            });

            model.selectors.dimensionsSort.selector.config.groups =labeled;
        }

        this.toolbar = new Filter(model);

        this.toolbar.on("ready", _.bind(this._renderTable, this))

    };

    TableTab.prototype._createFilterConfiguration = function () {

        log.info("Create toolbar config");

        var configurationFromFenixTool,
            configuration,
            result,
            self = this;

        configurationFromFenixTool = BoxUtils.getTableToolbarConfig(this.model, {lang : this.lang.toUpperCase()});

        log.info(configurationFromFenixTool);

        configuration = $.extend(true, {}, ToolbarModel, configurationFromFenixTool);

        log.info(configuration);

        result = $.extend(true, {}, Utils.mergeConfigurations(configuration, this.syncState.toolbar || {}));

        _.each(result, _.bind(function (value, key) {
            value.template.title = i18nLabels[self.lang.toLowerCase()]["tab_table_toolbar_" + key];
        }, this));

        log.info(result);

        return result;

    };

    TableTab.prototype._onToolbarChangeEvent = function () {

        this._onConfigurationChange();

    };

    TableTab.prototype._onConfigurationChange = function () {

        this._trigger("filter", this.toolbar.getValues());

        this._renderTable();
    };

    TableTab.prototype._renderComponents = function () {

        this._renderToolbar();

        //Table will be create when filter is 'ready'

        //init toolbar position
        var position = this.initial.toolbarPosition || C.toolbarPosition;
        if (position === 'up') {
            this.toolbarPosition = 'up';
        } else {
            this.toolbarPosition = 'down';
        }

    };

    TableTab.prototype._unbindEventListeners = function () {

        this.$toolbarBtn.off();
        this.$el.find("[data-action]").off();

        amplify.unsubscribe(this._getEventTopic("toolbar"), this._onToolbarEvent);

    };

    TableTab.prototype._isSuitable = function () {

        var valid = true,
            errors = [];

        var resourceType = BoxUtils.getNestedProperty("metadata.meContent.resourceRepresentationType", this.model);

        if (resourceType !== "dataset") {
            errors.push({code: ERR.INCOMPATIBLE_RESOURCE_TYPE});
        }

        return errors.length > 0 ? errors : valid;
    };

    TableTab.prototype._dispose = function () {

        if (this.state.ready === true) {
            this._unbindEventListeners();
        }
    };

    TableTab.prototype._getEventTopic = function (evt) {

        return EVT[evt] ? EVT[evt] + this.id : evt + this.id;
    };

    TableTab.prototype._setState = function (key, val) {

        BoxUtils.assign(this.state, key, val);

        this._trigger("state", $.extend(true, {}, this.state));
    };

    return TableTab;

});