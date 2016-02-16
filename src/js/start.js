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
    "amplify"
], function (log, $, _, Handlebars, C, CD, ERR, EVT, Structure) {

    'use strict';

    function Box(obj) {
        log.info("Create box");
        log.trace(obj);

        //Extend instance with obj and $el
        $.extend(true, this, C, CD, obj, {$el: $(obj.el)});

        var valid = this._validateInput();

        if (valid !== true) {

            this._initObj();

            this._bindObjEventListeners();

            return this;

        } else {

            log.error("Impossible to create visualization box");
            log.error(valid)
        }
    }

    Box.prototype.render = function (obj) {
        log.info("Render model for box [" + this.id + "]:");
        log.info(obj);

        if (!obj.model || !obj.model.data) {

            this._setStatus("empty");

        } else {

            this.model = $.extend(true, {ready: true}, obj.model);

            this._setStatus("ready");

            this._renderObj();
        }
    };

    Box.prototype._renderObj = function () {

        //show default tab
        /* var $tabs = obj.$el.find(s.TABS_CONTROLLERS),
         $candidate = $tabs.filter("[data-visualization='" + AC.resultDefaultTab + "']");

         if ($candidate.length < 1) {
         $candidate = $tabs.first();

         log.warn("Impossible to find default tab '" + AC.resultDefaultTab + "'. Showing first tab instead")
         }

         $candidate.tab('show');*/

    };

    Box.prototype._initObj = function () {

        this.tabs = {};

        //Inject structure
        var template = Handlebars.compile(Structure),
            $html = $(template($.extend(true, {}, this)));

        this.$el.html($html);

    };

    Box.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        if (!this.id) {

            window.fx_vis_box_id >= 0 ? window.fx_vis_box_id++ : window.fx_vis_box_id = 0;

            this.id = window.fx_vis_box_id;

            log.warn("Impossible to find id. Set auto id to: " + this.id);
        }

        if (this.$el.length === 0) {

            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find box container");

        }

        return errors.length > 0 ? valid : errors;
    };

    Box.prototype._setStatus = function (status) {

        log.info("Set '" + status + "' for result id: " + this.id);

        this.status = status;

        this.$el.attr("data-status", this.status);
    };

    Box.prototype._getEventTopic = function (evt) {

        return EVT[evt] + this.id;
    };

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

                amplify.publish(event, self);

            });
        });
    };

    Box.prototype._onRemoveEvent = function (box) {
        log.info("Listen to event: " + this._getEventTopic("remove"));
        log.trace(box)
    };

    Box.prototype._onResizeEvent = function (box) {
        log.info("Listen to event: " + this._getEventTopic("resize"));
        log.trace(box)
    };

    Box.prototype._onCloneEvent = function (box) {
        log.info("Listen to event: " + this._getEventTopic("clone"));
        log.trace(box)
    };

    Box.prototype._onFlipEvent = function (box) {
        log.info("Listen to event: " + this._getEventTopic("flip"));
        log.trace(box)
    };

    Box.prototype._onMetadataEvent = function (box) {
        log.info("Listen to event: " + this._getEventTopic("metadata"));
        log.trace(box)
    };

    Box.prototype._unbindObjEventListeners = function () {

        amplify.unsubscribe(this._getEventTopic("remove"), this._onRemoveEvent);

        amplify.unsubscribe(this._getEventTopic("resize"), this._onResizeEvent);

        amplify.unsubscribe(this._getEventTopic("clone") + this.id, this._onCloneEvent);

        amplify.unsubscribe(this._getEventTopic("flip"), this._onFlipEvent);

        amplify.unsubscribe(this._getEventTopic("metadata"), this._onMetadataEvent);

        this.$el.find("[data-action]").off();

    };

    Box.prototype.dispose = function () {

        this._unbindObjEventListeners();

        this.$el.remove();

        delete this;

        log.info("Box [" + this.id + "] disposed");
    };

    return Box;
});
