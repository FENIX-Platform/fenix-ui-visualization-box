define([
    "jquery",
    "loglevel",
    "underscore",
    "../../config/config",
    "../../config/errors",
    "../../config/events",
    'fenix-ui-filter-utils',
    "../../html/tabs/blank.hbs",
    'fenix-ui-filter',
    "../../config/tabs/blank-toolbar-model",
    "amplify-pubsub"
], function ($, log, _, C, ERR, EVT, Utils, tabTemplate, Filter, ToolbarModel, amplify) {

    'use strict';

    var s = {
        TOOLBAR: "[data-role='toolbar']",
        FILTER_BTN: "[data-role='toolbar'] [data-role='filter-btn']"
    };

    function BlankTab(obj) {

        $.extend(true, this, {initial: obj, $el: $(obj.el), box: obj.box, model: obj.model, id: obj.id});

        this.channels = {};
        this.state = {};
        this.lang = this.initial.lang;

        return this;
    }

    /* API */
    /**
     * Tab initialization method
     * Optional method
     */
    BlankTab.prototype.init = function () {
        log.info("Tab initialized successfully");
    };

    /**
     * Method invoked when the tab is shown in the FENIX visualization box
     * Mandatory method
     */
    BlankTab.prototype.show = function (state) {

        var valid = this._validateInput();

        if (valid === true) {

            this._show(state);

            this.ready = true;

            log.info("Tab shown successfully");

            return this;

        } else {

            log.error("Impossible to create show blank tab");
            log.error(valid)
        }
    };

    /**
     * Check if the current model is suitable to be displayed within the tab
     * Mandatory method
     */
    BlankTab.prototype.isSuitable = function () {

        var isSuitable = this._isSuitable();

        log.info("Bank tab: is tab suitable? ", isSuitable);

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
    BlankTab.prototype.dispose = function () {

        this._dispose();

        log.info("Tab disposed successfully");

    };

    /**
     * pub/sub
     * @return {Object} component instance
     */
    BlankTab.prototype.on = function (channel, fn, context) {
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
    BlankTab.prototype.sync = function (state) {
        log.info("Sync tab. State:" + JSON.stringify(state));

        if (state.hasOwnProperty("toolbar") && this.toolbar) {
            this.toolbar.setValues(state.toolbar, true);
        } else {
            log.warn("Abort toolbar sync")
        }
    };

    /* END - API */

    BlankTab.prototype._trigger = function (channel) {
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

    BlankTab.prototype._validateInput = function () {

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

    BlankTab.prototype._show = function (syncModel) {

        if (this.initialized === true) {
            log.info("Tab Blank shown again");

        } else {

            log.info("Tab Blank shown for the first time");

            this.syncModel = syncModel;

            this._attach();

            this._initVariables();

            this._renderComponents();

            this._bindEventListeners();

            this.initialized = true;

            this._trigger('initialized');
        }

    };

    BlankTab.prototype._attach = function () {

        var html = tabTemplate(this);

        this.$el.html(html);
    };

    BlankTab.prototype._initVariables = function () {

        this.$toolbar = this.$el.find(s.TOOLBAR);

        this.$toolbarBtn = this.$el.find(s.FILTER_BTN);

    };

    BlankTab.prototype._bindEventListeners = function () {

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

        if (C.syncTabsOnToolbarChange === true ) {
            this.toolbar.on('change', _.bind(this._onToolbarChangeEvent, this));
        }
    };

    BlankTab.prototype._onToolbarEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("toolbar"));
        log.trace(payload);

        var direction = this.toolbarPosition !== "up" ? "up" : "down";

        this._slideToolbar(direction)

    };

    BlankTab.prototype._slideToolbar = function (direction) {

        if (direction !== "up") {
            this.$toolbar.show();
            this.toolbarPosition = "down";
        } else {
            this.$toolbar.hide();
            this.toolbarPosition = "up";
        }

        this._setState("toolbarPosition", this.toolbarPosition);

    };

    BlankTab.prototype._onToolbarBtnClick = function () {

        this._onToolbarEvent();

        this._onConfigurationChange();

    };

    BlankTab.prototype._onToolbarChangeEvent = function () {

        this._onConfigurationChange();

    };

    BlankTab.prototype._onConfigurationChange = function () {

        this._trigger("filter", this.toolbar.getValues());

    };

    BlankTab.prototype._renderComponents = function () {

        this._renderToolbar();

        //init toolbar position
        this._slideToolbar(this.initial.toolbarPosition || C.toolbarPosition );

        //render creator
    };

    BlankTab.prototype._renderToolbar = function () {
        log.info("Blank tab render toolbar");

        this.toolbar = new Filter({
            selectors: this._createFilterConfiguration(ToolbarModel),
            el: this.$el.find(s.TOOLBAR)
        });

    };

    BlankTab.prototype._createFilterConfiguration = function () {

        var configuration = $.extend(true, {}, Utils.mergeConfigurations(ToolbarModel, this.syncModel || {}));

        return configuration;

    };

    BlankTab.prototype._unbindEventListeners = function () {

        this.$toolbarBtn.off();

        this.$el.find("[data-action]").off();

        amplify.unsubscribe(this._getEventTopic("toolbar"), this._onToolbarEvent);

    };

    BlankTab.prototype._isSuitable = function () {

        var valid = true,
            errors = [];

        //errors.push({code: ERR.MISSING_CONTAINER});

        return errors.length > 0 ? errors : valid;

    };

    BlankTab.prototype._dispose = function () {

        if (this.ready === true) {
            this._unbindEventListeners();
        }
    };

    BlankTab.prototype._getEventTopic = function (evt) {

        return EVT[evt] ? EVT[evt] + this.id : evt + this.id;
    };

    BlankTab.prototype._setState = function (key, val) {

        this._assign(this.state, key, val);

        this._trigger("state", $.extend(true, {}, this.state));
    };

    return BlankTab;

});