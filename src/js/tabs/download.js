/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    "underscore",
    "fx-v-b/config/config",
    "fx-v-b/config/config-default",
    "fx-v-b/config/errors",
    "fx-v-b/config/events",
    'fx-v-b/js/utils',
    "text!fx-v-b/html/tabs/download.hbs",
    "handlebars",
    "amplify"
], function ($, log, _, C, CD, ERR, EVT, Utils, tabTemplate, Handlebars) {

    'use strict';

    var s = {
        CONTAINER: '[data-role="download"]'
    };

    function DownloadTab(obj) {

        $.extend(true, this, {initial: obj, $el: $(obj.$el), box: obj.box, model: obj.model, id: obj.id});

        this.channels = {};
        this.state = {};

        return this;
    }

    /* API */
    /**
     * Tab initialization method
     * Optional method
     */
    DownloadTab.prototype.init = function () {
        log.info("Tab initialized successfully");
    };

    /**
     * Method invoked when the tab is shown in the FENIX visualization box
     * Mandatory method
     */
    DownloadTab.prototype.show = function (state) {

        var valid = this._validateInput();

        if (valid === true) {

            this._show(state);

            this.ready = true;

            log.info("trigger 'ready' event");

            this._trigger('ready');

            log.info("Tab shown successfully");

            return this;

        } else {

            log.error("Impossible to create show download tab");
            log.error(valid)
        }
    };

    /**
     * Check if the current model is suitable to be displayed within the tab
     * Mandatory method
     */
    DownloadTab.prototype.isSuitable = function () {

        var isSuitable = this._isSuitable();

        log.info("Is tab suitable? " + isSuitable);

        return isSuitable;

    };

    /**
     * Disposition method
     * Mandatory method
     */
    DownloadTab.prototype.dispose = function () {

        this._dispose();

        log.info("Tab disposed successfully");

    };

    /**
     * pub/sub
     * @return {Object} filter instance
     */
    DownloadTab.prototype.on = function (channel, fn) {

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
    DownloadTab.prototype.sync = function (state) {
        log.info("Sync tab. State:" + JSON.stringify(state));

        if (state.hasOwnProperty("toolbar") && this.toolbar) {
            this.toolbar.setValues(state.toolbar, true);
        } else {
            log.warn("Abort toolbar sync")
        }
    };

    /* END - API */

    DownloadTab.prototype._trigger = function (channel) {
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

    DownloadTab.prototype._validateInput = function () {

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

    DownloadTab.prototype._show = function (syncModel) {

        if (this.initialized === true) {
            log.info("Tab Download shown again");

        } else {

            log.info("Tab Download shown for the first time");

            this.syncModel = syncModel;

            this._attach();

            this._initVariables();

            this._renderComponents();

            this._bindEventListeners();

            this.initialized = true;
        }

    };

    DownloadTab.prototype._attach = function () {

        var template = Handlebars.compile(tabTemplate),
            html = template(this);

        this.$el.html(html);
    };

    DownloadTab.prototype._initVariables = function () {

    };

    DownloadTab.prototype._bindEventListeners = function () {

    };

    DownloadTab.prototype._renderComponents = function () {

    };

    DownloadTab.prototype._unbindEventListeners = function () {

    };

    DownloadTab.prototype._isSuitable = function () {

        return true;
    };

    DownloadTab.prototype._dispose = function () {

        if (this.ready === true) {
            this._unbindEventListeners();
        }

    };

    DownloadTab.prototype._getEventTopic = function (evt) {

        return EVT[evt] ? EVT[evt] + this.id : evt + this.id;
    };

    DownloadTab.prototype._setState = function (key, val) {

        Utils.assign(this.state, key, val);

        this._trigger("state", $.extend(true, {}, this.state));

        
    };

    return DownloadTab;

});