/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    "underscore",
    "fx-v-b/config/config",
    "fx-v-b/config/config-default",
    "fx-v-b/config/errors",
    "fx-v-b/config/events",
    "text!fx-v-b/html/tabs/table.hbs",
    'fx-filter/start',
    "fx-v-b/config/tabs/table-toolbar-model",
    "handlebars",
    'fx-pivot/start',
    "amplify"
], function ($, log, _, C, CD, ERR, EVT, tabTemplate, Filter, ToolbarModel, Handlebars, Olap) {

    'use strict';

    var defaultOptions = {}, s = {
        TOOLBAR: "[data-role='toolbar']",
        TOOLBAR_BTN: "[data-role='toolbar'] [data-role='toolbar-btn']"
    };

    function TableTab(o) {

        $.extend(true, this, defaultOptions, o);

        this.channels = {};

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
    TableTab.prototype.show = function () {

        var valid = this._validateInput();

        if (valid === true) {

            this._show();

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

        log.info("Is tab suitable? " + isSuitable);

        return isSuitable;

    };

    /**
     * Disposition method
     * Mandatory method
     */
    TableTab.prototype.dispose = function () {

        this._dispose();

        log.info("Tab disposed successfully");

    };

    /**
     * pub/sub
     * @return {Object} filter instance
     */
    TableTab.prototype.on = function (channel, fn) {

        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: this, callback: fn});

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

    TableTab.prototype._show = function () {

        this._attach();

        this._initVariables();

        this._renderComponents();

        this._bindEventListeners();
    };

    TableTab.prototype._attach = function () {

        var template = Handlebars.compile(tabTemplate),
            html = template(this);

        this.$el.html(html);
    };

    TableTab.prototype._initVariables = function () {

        this.$toolbar = this.$el.find(s.TOOLBAR);

        this.$toolbarBtn = this.$el.find(s.TOOLBAR_BTN);

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

        //Toolbar events
        this.toolbar.on('change', _.bind(this._onToolbarChangeEvent, this));
    };

    TableTab.prototype._onToolbarEvent = function (payload) {
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

    TableTab.prototype._onToolbarBtnClick = function () {

        console.log(this.toolbar.getValues())

    };

    TableTab.prototype._onToolbarChangeEvent = function () {

        this._trigger("toolbar.change", this.toolbar.getValues());

    };

    TableTab.prototype._renderComponents = function () {

        this._renderToolbar();

        //render creator
    };

    TableTab.prototype._renderToolbar = function () {
        log.info("Table tab render toolbar");

        this.toolbar = new Filter({
            items: ToolbarModel,
            $el: s.TOOLBAR
        });

    };

    TableTab.prototype._createFilterConfiguration = function () {

        var configuration = ToolbarModel;

        //TODO process here

        return configuration;

    };

    TableTab.prototype._unbindEventListeners = function () {

        this.$toolbarBtn.off();

        this.$el.find("[data-action]").off();

        amplify.unsubscribe(this._getEventTopic("toolbar"), this._onToolbarEvent);

    };

    TableTab.prototype._isSuitable = function () {

        return true;
    };

    TableTab.prototype._dispose = function () {

        this._unbindEventListeners();
    };

    TableTab.prototype._getEventTopic = function (evt) {

        return EVT[evt] ? EVT[evt] + this.id : evt + this.id;
    };

    return TableTab;

});