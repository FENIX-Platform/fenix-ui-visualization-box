/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    "underscore",
    "fx-v-b/config/config",
    "fx-v-b/config/config-default",
    "fx-v-b/config/errors",
    "fx-v-b/config/events",
    'fx-common/utils',
    "text!fx-v-b/html/tabs/download.hbs",
    "fx-reports/start",
    "handlebars",
    "amplify"
], function ($, log, _, C, CD, ERR, EVT, Utils, tabTemplate, Report, Handlebars) {

    'use strict';

    var s = {
        CONTAINER: '[data-role="download"]',
        DOWNLOAD_BTN: '[data-action="download"]'
    };

    function DownloadTab(obj) {

        $.extend(true, this, {initial: obj, $el: $(obj.$el), box: obj.box, model: obj.model, id: obj.id});

        this.channels = {};
        this.state = {};

        this.report = new Report();

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

        log.info("Download tab: is tab suitable? " + isSuitable);

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

        this.$el.find(s.DOWNLOAD_BTN).on("click", _.bind(function (e) {

            var $this = $(e.target);

            var format = $this.data('format');
            (format== 'pdf')? this._downloadMetadata(format): this._downloadData(format);

        }, this));

    };

    DownloadTab.prototype._downloadData = function (format) {

        //check if uid exist
        var resource = (this.model.data) ? this.model :
        {
            "metadata": {
                "uid": this.model.metadata.uid
            },
            "data": []
        };

        var payload = {
            resource: resource,
            input: {
                config: {}
            },
            output: {
                config: {
                    lang: this.box.lang.toUpperCase()
                }
            }
        };

        this.report.init('tableExport');

        this.report.exportData({
            config: payload
        });

    };

    DownloadTab.prototype._downloadMetadata = function (format) {
        
        //check if uid exist
        var fileName = this.model.metadata.title['EN'].replace(/[^a-z0-9]/gi, '_').toLowerCase();

        var template = this.model.metadata.dsd && this.model.metadata.dsd.contextSystem && this.model.metadata.dsd.contextSystem  === 'uneca'?
            'uneca' : 'fao';

        var payload = {
            resource: {
                metadata: {
                    uid: this.model.metadata.uid
                },
                data: []
            },
            input: {
                config: {}
            },
            output: {
                config: {
                    template : template,
                    lang: this.box.lang.toUpperCase(),
                    fileName: fileName+'.pdf'
                }
            }
        };

        this.report.init('metadataExport');

        this.report.exportData({
            config: payload
        });

    };

    DownloadTab.prototype._renderComponents = function () {

    };

    DownloadTab.prototype._unbindEventListeners = function () {

        this.$el.find(s.DOWNLOAD_BTN).off();

    };

    DownloadTab.prototype._isSuitable = function () {


        var valid = true,
            errors = [];

        var resourceType = Utils.getNestedProperty("metadata.meContent.resourceRepresentationType", this.model);

        if (resourceType !== "dataset") {
            errors.push({code: ERR.INCOMPATIBLE_RESOURCE_TYPE});
        }

        return errors.length > 0 ? errors : valid;
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