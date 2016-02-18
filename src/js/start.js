/*global define, amplify*/

define([
    "loglevel",
    "jquery",
    "underscore",
    "handlebars",
    "fx-v-b/config/config",
    "fx-v-b/config/config-default",
    "fx-v-b/config/errors",
    "fx-v-b/config/events",
    "text!fx-v-b/html/structure.hbs",
    "fx-v-b/js/model",
    "amplify",
    "bootstrap"
], function (log, $, _, Handlebars, C, CD, ERR, EVT, Structure, ModelMng) {

    'use strict';

    var s = {
        BOX: ".fx-box",
        CONTENT_READY : "[data-content='ready']"
    };

    /* API */

    function Box(obj) {
        log.info("Create box");
        log.trace(obj);

        //Extend instance with obj and $el
        $.extend(true, this, C, CD, obj, {$el: $(obj.el)});

        var valid = this._validateInput();

        if (valid === true) {

            this._initObj();

            this._bindObjEventListeners();

            this._checkModelStatus();

            return this;

        } else {

            log.error("Impossible to create visualization box");
            log.error(valid)
        }
    }

    Box.prototype.render = function (obj) {
        log.info("Render model for box [" + this.id + "]:");
        log.info(obj);

        $.extend(true, this, obj);

        this._checkModelStatus();

    };

    Box.prototype.dispose = function () {

        this._unbindObjEventListeners();

        this.$el.remove();

        delete this;

        log.info("Box [" + this.id + "] disposed");
    };

    Box.prototype.setStatus = function (status) {

        //TODO check if status != current status

        this._setStatus(status);
    };

    Box.prototype.showTab = function (tab) {

        //TODO check if tab != current tab

        this._showTab(tab);
    };

    /* END - API */

    Box.prototype._getModelStatus = function () {

        if (!this.hasOwnProperty('model')) {
            return 'no_model';
        }

        if (typeof this.model !== 'object' ) {
            return 'error';
        }

        if (Array.isArray(this.model.data) && this.model.data.length === 0 ) {
            return 'empty';
        }

        if (Array.isArray(this.model.data) && this.model.data.length > 0 ) {
            return 'ready';
        }

        return 'error';
    };

    Box.prototype._checkModelStatus = function () {

        switch (this._getModelStatus().toLowerCase()) {
            case 'ready' :
                this.setStatus("ready");
                this._renderObj();
                break;
            case 'empty' :
                this.setStatus("empty");
                break;
            case 'no_model' :
                this.setStatus("loading");
                break;
            default :
                this.setStatus("error");
                break;
        }
    };

    Box.prototype._renderObj = function () {

        this.modelManager.process({
            model: this.model,
            //config : toolbar.getValues()
        });

    };

    Box.prototype._initObj = function () {

        this.tabs = {};

        //Inject structure
        var template = Handlebars.compile(Structure),
            $html = $(template($.extend(true, {}, this)));

        this.$el.html($html);

        this.modelManager = new ModelMng();

    };

    Box.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if box has an id
        if (!this.id) {

            window.fx_vis_box_id >= 0 ? window.fx_vis_box_id++ : window.fx_vis_box_id = 0;

            this.id = window.fx_vis_box_id;

            log.warn("Impossible to find id. Set auto id to: " + this.id);
        }

        //Check if $el exist
        if (this.$el.length === 0) {

            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find box container");

        }

        return errors.length > 0 ? errors : valid;
    };

    Box.prototype._setStatus = function (status) {

        log.info("Set '" + status + "' status for result id: " + this.id);

        this.status = status;

        this.$el.find(s.BOX).attr("data-status", this.status);
    };

    Box.prototype._showTab = function (tab) {

        log.info("Show '" + tab + "' tab for result id: " + this.id);

        this.tab = tab;

        this.$el.find(s.CONTENT_READY).attr("data-tab", this.tab);
    };

    /* Event binding and callbacks */

    Box.prototype._bindObjEventListeners = function () {

        var self = this;

        amplify.subscribe(this._getEventTopic("remove"), this, this._onRemoveEvent);

        amplify.subscribe(this._getEventTopic("resize"), this, this._onResizeEvent);

        amplify.subscribe(this._getEventTopic("clone"), this, this._onCloneEvent);

        amplify.subscribe(this._getEventTopic("flip"), this, this._onFlipEvent);

        amplify.subscribe(this._getEventTopic("metadata"), this, this._onMetadataEvent);

        this.$el.find("[data-action]").each(function () {

            var $this = $(this),
                action = $this.data("action"),
                event = self._getEventTopic(action);

            $this.on("click", function () {

                log.info("Raise event: " + event);

                amplify.publish(event, {target: this, box: self});

            });
        });

        this.modelManager.subscribe(EVT.model_done, _.bind(this._onModelProcessDone, this));

        this.modelManager.subscribe(EVT.model_error, _.bind(this._onModelError, this));
    };

    Box.prototype._onRemoveEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("remove"));
        log.trace(payload)
    };

    Box.prototype._onResizeEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("resize"));
        log.trace(payload);

        if (payload.target && $(payload.target).data("size")) {
            log.trace("Size: " + $(payload.target).data("size"))
        }
    };

    Box.prototype._onCloneEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("clone"));
        log.trace(payload)
    };

    Box.prototype._onFlipEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("flip"));
        log.trace(payload)
    };

    Box.prototype._onMetadataEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("metadata"));
        log.trace(payload)
    };

    Box.prototype._unbindObjEventListeners = function () {

        amplify.unsubscribe(this._getEventTopic("remove"), this._onRemoveEvent);

        amplify.unsubscribe(this._getEventTopic("resize"), this._onResizeEvent);

        amplify.unsubscribe(this._getEventTopic("clone") + this.id, this._onCloneEvent);

        amplify.unsubscribe(this._getEventTopic("flip"), this._onFlipEvent);

        amplify.unsubscribe(this._getEventTopic("metadata"), this._onMetadataEvent);

        this.$el.find("[data-action]").off();

    };

    Box.prototype._getEventTopic = function (evt) {

        return EVT[evt] + this.id;
    };

    Box.prototype._onModelProcessDone = function (model) {
        log.info("Handling processed model");
        log.trace(model);

        //Create tabs
        //Pass processed model to tab
        //Tab creates the specific creator conf
        //creator.render(conf)
    };

    Box.prototype._onModelError = function (err) {
        log.info("Handling model error " + err);
        this.setStatus("error");
    };

    /* END - Event binding and callbacks */

    return Box;
});
