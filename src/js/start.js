/*global define, amplify*/

define([
    "loglevel",
    "require",
    "jquery",
    "underscore",
    "handlebars",
    "fx-v-b/config/config",
    "fx-v-b/config/config-default",
    "fx-v-b/config/errors",
    "fx-v-b/config/events",
    "text!fx-v-b/html/structure.hbs",
    "fx-common/json-menu",
    "fx-v-b/config/right-menu-model",
    "amplify",
    "bootstrap"
], function (log, require, $, _, Handlebars, C, CD, ERR, EVT, Structure, JsonMenu, RightMenuModel) {

    'use strict';

    var s = {
        BOX: ".fx-box",
        CONTENT_READY: "[data-content='ready']",
        RIGHT_MENU: "[data-role='right-menu']",
        FLIP_CONTAINER : ".flip-container"
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

            this._renderMenu();

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

        this._dispose();

        log.info("Box [" + this.id + "] disposed");
    };

    Box.prototype.setStatus = function (status) {

        //TODO check if status != current status

        this._setStatus(status);
    };

    Box.prototype.showTab = function (tab) {

        this._showTab(tab);
    };

    Box.prototype.setSize = function (size) {

        this._setSize(size);
    };

    /* END - API */

    Box.prototype._getModelStatus = function () {

        if (!this.hasOwnProperty('model')) {
            return 'no_model';
        }

        if (typeof this.model !== 'object') {
            return 'error';
        }

        if (Array.isArray(this.model.data) && this.model.data.length === 0) {
            return 'empty';
        }

        if (Array.isArray(this.model.data) && this.model.data.length > 0) {
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

        this._onModelProcessDone();

    };

    Box.prototype._initObj = function () {

        //Inject box blank template
        var template = Handlebars.compile(Structure),
            $html = $(template($.extend(true, {}, this)));

        this.$el.html($html);

        this.tab_instances = {};

        this.size = C.default_size || CD.default_size;

        this.status = C.default_status || CD.default_status;

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

        //TODO check if it is a valid tab

        if (this.tab === tab) {
            log.info("Aborting show tab current tab is equal to selected one");
            return;
        }

        if (this.tabs[tab].suitable !== true) {
            log.warn("Aborting show tab because selected tab is not suitable with current model");
            return;
        }

        log.info("Show '" + tab + "' tab for result id: " + this.id);

        this.tab = tab;

        this.$el.find(s.CONTENT_READY).attr("data-tab", this.tab);

        this._showTabContent();
    };

    Box.prototype._showTabContent = function () {

        if (!this.tabs[this.tab] || this.tabs[this.tab].initialized === true) {
            log.error("Error on show tab content: " + this.tab);

            this._setStatus("error");

            return;
        }

        if (this.tabs[this.tab].callback === 'once') {
            this.tabs[this.tab].initialized = true;
        }

        var instance = this._getTabInstance(this.tab),
            candidateFn = instance.show;

        if (_.isFunction(candidateFn)) {
            candidateFn.call(instance);
        } else {
            log.error(this.tab + " tab does not implement the mandatory show() method");
        }
    };

    Box.prototype._createTabInstance = function (tab) {

        var registry = this.tab_registry,
        //Note that for sync call the argument of require() is not an array but a string
            Tab = require(registry[tab].path),
            instance = new Tab({
                $el: this._getTabContainer(tab),
                box: this,
                model: $.extend(true, {}, this.model),
                id: tab + "_" + this.id
            });

        //cache the plugin instance
        this.tabs[tab].instance = instance;

        if (_.isFunction(instance.isSuitable)) {
            this.tabs[tab].suitable = instance.isSuitable();
        } else {
            log.error(tab + " tab does not implement the mandatory isSuitable() method");
        }

        return instance;

    };

    Box.prototype._getTabInstance = function (tab) {

        return this.tabs[tab].instance;
    };

    Box.prototype._getTabContainer = function (tab) {

        return this.$el.find(s.BOX).find("[data-section='" + tab + "']");
    };

    Box.prototype._setSize = function (size) {

        //TODO check if it is a valid size

        if (this.size === size) {
            log.info("Aborting resize because current size is equal to selected one");
            return;
        }

        this.size = size;

        this.$el.find(s.BOX).attr("data-size", this.size);

        amplify.publish(EVT["resize"], this)

    };

    /* Event binding and callbacks */

    Box.prototype._bindObjEventListeners = function () {

        var self = this;

        amplify.subscribe(this._getEventTopic("remove"), this, this._onRemoveEvent);

        amplify.subscribe(this._getEventTopic("resize"), this, this._onResizeEvent);

        amplify.subscribe(this._getEventTopic("clone"), this, this._onCloneEvent);

        amplify.subscribe(this._getEventTopic("flip"), this, this._onFlipEvent);

        amplify.subscribe(this._getEventTopic("metadata"), this, this._onMetadataEvent);

        amplify.subscribe(this._getEventTopic("tab"), this, this._onTabEvent);

        this.$el.find("[data-action]").each(function () {

            var $this = $(this),
                action = $this.data("action"),
                event = self._getEventTopic(action);

            $this.on("click", {event: event, box : self}, function (e) {
                e.preventDefault();

                log.info("Raise event: " + e.data.event);

                amplify.publish(event, {target: this, box: e.data.box});

            });
        });

    };

    Box.prototype._onRemoveEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("remove"));
        log.trace(payload);

        amplify.publish(EVT['remove'], this);

        this._dispose();
    };

    Box.prototype._onResizeEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("resize"));
        log.trace(payload);

        if (payload.target && $(payload.target).data("size")) {

            var size = $(payload.target).data("size");
            log.trace("Size: " + size);

            this._setSize(size);
        }
    };

    Box.prototype._onCloneEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("clone"));
        log.trace(payload)
    };

    Box.prototype._onFlipEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("flip"));
        log.trace(payload);

        if (this.face !== "front") {
            this.face = "front";
            this.$el.find(s.FLIP_CONTAINER).addClass(C.FLIPPED_CLASSNAME || CD.FLIPPED_CLASSNAME);
        } else {
            this.face = "back";
            this.$el.find(s.FLIP_CONTAINER).removeClass(C.FLIPPED_CLASSNAME || CD.FLIPPED_CLASSNAME);
        }

        log.trace("Set box face to: " + this.face);

    };

    Box.prototype._onMetadataEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("metadata"));
        log.trace(payload)
    };

    Box.prototype._onTabEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("tab"));
        log.trace(payload)
    };

    Box.prototype._unbindObjEventListeners = function () {

        amplify.unsubscribe(this._getEventTopic("remove"), this._onRemoveEvent);

        amplify.unsubscribe(this._getEventTopic("resize"), this._onResizeEvent);

        amplify.unsubscribe(this._getEventTopic("clone"), this._onCloneEvent);

        amplify.unsubscribe(this._getEventTopic("flip"), this._onFlipEvent);

        amplify.unsubscribe(this._getEventTopic("metadata"), this._onMetadataEvent);

        amplify.unsubscribe(this._getEventTopic("tab"), this._onTabEvent);

        this.$el.find("[data-action]").off();

    };

    Box.prototype._getEventTopic = function (evt) {

        return EVT[evt] ?  EVT[evt] + this.id : evt + this.id;
    };

    Box.prototype._onModelProcessDone = function (model) {
        log.info("Handling processed model");
        log.trace(model);

        this._preloadTabSources();

        //Create tabs
        //Pass processed model to tab
        //Tab creates the specific creator conf
        //creator.render(conf)

        //this._showDefaultTab();
    };

    Box.prototype._preloadTabSources = function () {

        var registeredTabs = $.extend(true, {}, this.tab_registry),
            tabsKeys = Object.keys(this.tabs),
            paths = [];

        _.each(tabsKeys, _.bind(function (tab) {

            var conf = registeredTabs[tab];

            if (!conf) {
                log.error('Registration not found for "' + tab + ' tab".');
            }

            if (!$.isPlainObject(this.tabs[tab])) {
                this.tabs[tab] = {};
            }

            this.tabs[tab].suitable = false;

            if (conf.path) {
                paths.push(conf.path);
            } else {
                log.error('Impossible to find path configuration for "' + tab + ' tab".');
            }

        }, this));

        //Async load of plugin js source
        require(paths, _.bind(this._preloadTabSourcesSuccess, this));

    };

    Box.prototype._preloadTabSourcesSuccess = function () {

        this._checkSuitableTabs();
    };

    Box.prototype._checkSuitableTabs = function () {

        var registeredTabs = this.tab_registry,
            tabsKeys = Object.keys(this.tabs),
            self = this;

        _.each(tabsKeys, function (tab) {

            var conf = registeredTabs[tab];

            if (!conf) {
                log.error('Registration not found for "' + tab + ' tab".');
            }

            if (conf.path) {
                self._createTabInstance(tab);
            } else {
                log.error('Impossible to find path configuration for "' + tab + ' tab".');
            }

        });

        this._showDefaultTab();

    };

    Box.prototype._showDefaultTab = function () {

        var tab = C.default_tab || CD.default_tab;

        this._showTab(tab);
    };

    Box.prototype._onModelError = function (err) {
        log.info("Handling model error " + err);
        this.setStatus("error");
    };

    Box.prototype._renderMenu = function () {

        this.rightMenu = new JsonMenu({
            el : this.$el.find(s.RIGHT_MENU),
            model : RightMenuModel
        });

    };

    /* END - Event binding and callbacks */
    Box.prototype._disposeTabs = function () {

        var tabs = this.tabs,
            keys = Object.keys(tabs);

        _.each(keys, _.bind(function (tab) {

            var instance = this._getTabInstance(tab);

            if (!instance || !_.isFunction(instance.dispose)) {
                log.error("Impossible to dispose tab: " + tab);
            } else {
                instance.dispose.call(instance);
            }

        }, this));

    };

    Box.prototype._dispose = function () {

        this._unbindObjEventListeners();

        this.$el.remove();

        this._disposeTabs();

        delete this;

    };

    return Box;
});
