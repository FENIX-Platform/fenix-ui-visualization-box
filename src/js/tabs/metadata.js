/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    "underscore",
    "fx-v-b/config/config",
    "fx-v-b/config/config-default",
    "fx-v-b/config/errors",
    "fx-v-b/config/events",
    "text!fx-v-b/html/tabs/metadata.hbs",
    'fx-md-v/start',
    "handlebars",
    "amplify"
], function ($, log, _, C, CD, ERR, EVT, tabTemplate, MetadataViewer, Handlebars) {

    'use strict';

    var defaultOptions = {}, s = {
        CONTAINER: '[data-role="metadata"]'
    };

    function MetadataTab(o) {

        $.extend(true, this, defaultOptions, o);

        this.channels = {};
        this.status = {};

        return this;
    }

    /* API */
    /**
     * Tab initialization method
     * Optional method
     */
    MetadataTab.prototype.init = function () {
        log.info("Tab initialized successfully");
    };

    /**
     * Method invoked when the tab is shown in the FENIX visualization box
     * Mandatory method
     */
    MetadataTab.prototype.show = function (state) {

        var valid = this._validateInput();

        if (valid === true) {

            this._show(state);

            this.status.ready = true;

            log.info("Tab shown successfully");

            return this;

        } else {

            log.error("Impossible to create show metadata tab");
            log.error(valid)
        }
    };

    /**
     * Check if the current model is suitable to be displayed within the tab
     * Mandatory method
     */
    MetadataTab.prototype.isSuitable = function () {

        var isSuitable = this._isSuitable();

        log.info("Is tab suitable? " + isSuitable);

        return isSuitable;

    };

    /**
     * Disposition method
     * Mandatory method
     */
    MetadataTab.prototype.dispose = function () {

        this._dispose();

        log.info("Tab disposed successfully");

    };

    /**
     * pub/sub
     * @return {Object} filter instance
     */
    MetadataTab.prototype.on = function (channel, fn) {

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
    MetadataTab.prototype.sync = function (state) {
        log.info("Sync tab. State:" + JSON.stringify(state));

        if (state.hasOwnProperty("toolbar") && this.toolbar) {
            this.toolbar.setValues(state.toolbar, true);
        } else {
            log.warn("Abort toolbar sync")
        }
    };

    /* END - API */

    MetadataTab.prototype._trigger = function (channel) {
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

    MetadataTab.prototype._validateInput = function () {

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

    MetadataTab.prototype._show = function (syncModel) {

        if (this.initialized === true) {
            log.info("Tab Metadata shown again");

        } else {

            log.info("Tab Metadata shown for the first time");

            this.syncModel = syncModel;

            this._attach();

            this._initVariables();

            this._renderComponents();

            this._bindEventListeners();

            this.initialized = true;
        }

    };

    MetadataTab.prototype._attach = function () {

        var template = Handlebars.compile(tabTemplate),
            html = template(this);

        this.$el.html(html);
    };

    MetadataTab.prototype._initVariables = function () {

    };

    MetadataTab.prototype._bindEventListeners = function () {

    };

    MetadataTab.prototype._renderComponents = function () {

        log.info("Render metadata viewer");

        this.metadataViewer = new MetadataViewer();

        console.log(this.model)
        console.log(this.$el.find(s.CONTAINER))

        this.metadataViewer.init({
            data: this.model.metadata,
            lang: 'en',
            placeholder: this.$el.find(s.CONTAINER)
        });


    };

    MetadataTab.prototype._unbindEventListeners = function () {

    };

    MetadataTab.prototype._isSuitable = function () {

        return true;
    };

    MetadataTab.prototype._dispose = function () {

        if (this.status.ready === true) {
            this._unbindEventListeners();
        }

    };

    MetadataTab.prototype._getEventTopic = function (evt) {

        return EVT[evt] ? EVT[evt] + this.id : evt + this.id;
    };

    return MetadataTab;

});