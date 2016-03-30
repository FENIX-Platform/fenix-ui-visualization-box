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
    "i18n!fx-v-b/nls/box",
    "amplify",
    "bootstrap"
], function (log, require, $, _, Handlebars, C, CD, ERR, EVT, Structure, JsonMenu, RightMenuModel, i18nLabels) {

    'use strict';

    var s = {
        BOX: ".fx-box",
        CONTENT_READY: "[data-content='ready']",
        RIGHT_MENU: "[data-role='right-menu']",
        FLIP_CONTAINER: ".flip-container"
    };

    /* API */

    /**
     * Constructor
     * @param {Object} obj
     * @return {Object} box instance
     */
    function Box(obj) {
        log.info("Create box");
        log.trace(obj);

        //Extend instance with obj and $el
        $.extend(true, this, C, CD, {initial: obj || {}, $el: $(obj.el)});

        var valid = this._validateInput();

        if (valid === true) {

            this._setObjState("valid", true);

            this._initVariables();

            this._initObjState();

            this._initObj();

            this._renderMenu();

            this._bindObjEventListeners();

            this._checkModelStatus();

            return this;

        } else {

            this._setObjState("valid", false);
            this._setObjState("error", valid);

            log.error("Impossible to create visualization box");
            log.error(valid)
        }
    }

    /**
     * Set box status
     * @param {Object} obj
     * @return {Object} box instance
     */
    Box.prototype.render = function (obj) {
        log.info("Render model for box [" + this._getObjState("id") + "]:");
        log.info(obj);

        $.extend(true, this, obj);

        this._checkModelStatus();

    };

    /**
     * Dispose box
     * @return {null}
     */
    Box.prototype.dispose = function () {

        this._dispose();

        log.info("Box [" + this.id + "] disposed");
    };

    /**
     * Set box status
     * @param {String} status
     * @return {null}
     */
    Box.prototype.setStatus = function (status) {

        //TODO check if status != current status

        this._setStatus(status);
    };

    /**
     * Show a box's tab
     * @param {String} tab. tab'sid
     * @param {Object} opts. Options passed to tab instance
     * @return {null}
     */
    Box.prototype.showTab = function (tab, opts) {

        this._showTab(tab, opts);
    };

    /**
     * Set box width
     * @param {String} size
     * @return {null}
     */
    Box.prototype.setSize = function (size) {

        this._setSize(size);
    };

    /**
     * Flip the visualization box
     * @param {String} side
     * @return {null}
     */
    Box.prototype.flip = function (side) {
        return this._flip(side);
    };

    /**
     * pub/sub
     * @return {Object} filter instance
     */
    Box.prototype.on = function (channel, fn) {
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: this, callback: fn});
        return this;
    };

    /**
     * get box state
     * @return {Object} box state
     */
    Box.prototype.getState = function () {

        /*
         * TODO remove
         * tabs[tab].instance
         * */

        return this.state;
    };


    /* END - API */

    Box.prototype._trigger = function (channel) {
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

    Box.prototype._initVariables = function () {

        this._setObjState("valid", true);

        this.model = this.initial.model;

    };

    Box.prototype._initObjState = function () {

        //template options
        this._setObjState("hideToolbar", !!this.initial.hideToolbar);
        this._setObjState("hideMenu", !!this.initial.hideMenu);
        this._setObjState("hideMetadataButton", !!this.initial.hideMetadataButton);
        this._setObjState("hideRemoveButton", !!this.initial.hideRemoveButton);
        this._setObjState("hideResizeButton", !!this.initial.hideResizeButton);
        this._setObjState("hideCloneButton", !!this.initial.hideCloneButton);
        this._setObjState("hideFlipButton", !!this.initial.hideFlipButton);

        //tabs
        this._setObjState("tabRegistry", this.tabRegistry);
        this._setObjState("tabs", this.tabs);

        //flip side
        this._setObjState("face", this.initial.face);

    };

    Box.prototype._setObjState = function (key, val) {

        //var property = this._getObjState(key);
        //assign(this.state, key, typeof val === 'object' ? $.extend(true, property, val) : val);
        assign(this.state, key, val);

        function assign(obj, prop, value) {
            if (typeof prop === "string")
                prop = prop.split(".");

            if (prop.length > 1) {
                var e = prop.shift();
                assign(obj[e] =
                        Object.prototype.toString.call(obj[e]) === "[object Object]"
                            ? obj[e]
                            : {},
                    prop,
                    value);
            } else
                obj[prop[0]] = value;
        }
    };

    Box.prototype._getObjState = function (path) {

        var obj = $.extend(true, {}, this.state),
            arr = path.split(".");

        while (arr.length && (obj = obj[arr.shift()]));

        return obj;

    };

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

        var size = this.initial.size || C.defaultSize || CD.defaultSize,
            status = this.initial.status || C.defaultStatus || CD.defaultStatus;

        this._setObjState("size", size);
        this._setObjState("status", status);

        //Inject box blank template
        var template = Handlebars.compile(Structure),
            $html = $(template($.extend(true, {}, this.state)));

        this.$el.html($html);

        //pub/sub
        this.channels = {};

        this._setObjState("hasMenu", this.$el.find(s.RIGHT_MENU).length > 0);

        //set flip side
        this.flip(this._getObjState("face"));

    };

    Box.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if box has an id
        if (!this.id) {

            window.fx_vis_box_id >= 0 ? window.fx_vis_box_id++ : window.fx_vis_box_id = 0;

            this._setObjState("id", window.fx_vis_box_id);
            this.id = this._getObjState("id");

            log.warn("Impossible to find id. Set auto id to: " + this._getObjState("id"));
        }

        //Check if $el exist
        if (this.$el.length === 0) {

            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find box container");

        }

        return errors.length > 0 ? errors : valid;
    };

    Box.prototype._setStatus = function (status) {

        log.info("Set '" + status + "' status for result id: " + this._getObjState("id"));

        this._setObjState("status", status);

        this.$el.find(s.BOX).attr("data-status", this._getObjState("status"));
    };

    Box.prototype._showTab = function (tab, opts) {
        log.info('Show tab ' + tab);
        log.info(opts);

        //TODO check if it is a valid tab

        var currentTab = this._getObjState("tab");

        //TODO check if currentTab is undefined

        if (currentTab === tab) {
            log.info("Aborting show tab current tab is equal to selected one");
            return;
        }

        if (this._getObjState("tabs." + tab + ".suitable") !== true) {
            log.warn("Aborting show tab because selected tab is not suitable with current model");
            //TODO find first suitable tab and then raise error
            return;
        }

        log.info("Show '" + tab + "' tab for result id: " + this._getObjState("id"));

        this._setObjState("tab", tab);

        this.$el.find(s.CONTENT_READY).attr("data-tab", this._getObjState("tab"));

        this._showTabContent(opts);
    };

    Box.prototype._showTabContent = function () {

        var tabs = this._getObjState("tabs"),
            tab = this._getObjState("tab");

        if (!tabs[tab] || tabs[tab].initialized === true) {
            log.error("Error on show tab content: " + tab);

            this._setStatus("error");

            return;
        }

        if (tabs[tab].callback === 'once') {
            this._setObjState("tabs." + tab + ".initialized", true);
        }

        this._callTabInstanceMethod(tab, "show");

    };

    Box.prototype._createTabInstance = function (tab) {

        var registry = this._getObjState("tabRegistry"),
        //Note that for sync call the argument of require() is not an array but a string
            Tab = require(registry[tab].path),
            instance = new Tab({
                $el: this._getTabContainer(tab),
                box: this,
                model: $.extend(true, {}, this.model),
                id: tab + "_" + this._getObjState("id")
            });

        //Subscribe to tab events
        instance.on('toolbar.change', _.bind(this._onTabToolbarChangeEvent, this));

        //cache the plugin instance
        this._setObjState("tabs." + tab + ".instance", instance);
        this._setObjState("tabs." + tab + ".suitable", this._callTabInstanceMethod(tab, 'isSuitable'));

        if (this._getObjState("tabs." + tab + ".suitable") === true) {
            this._showMenuItem(tab);
        }

        return instance;

    };

    Box.prototype._getTabInstance = function (tab) {

        return this._getObjState("tabs." + tab + ".instance")
    };

    Box.prototype._getTabContainer = function (tab) {

        return this.$el.find(s.BOX).find("[data-section='" + tab + "']");
    };

    Box.prototype._setSize = function (size) {

        //TODO check if it is a valid size

        if (this._getObjState("size") === size) {
            log.info("Aborting resize because current size is equal to selected one");
            return;
        }

        this._setObjState("size", size);

        this.$el.find(s.BOX).attr("data-size", this._getObjState("size"));

        amplify.publish(EVT["resize"], this)

    };

    Box.prototype._showMenuItem = function (item) {

        if (this._getObjState("hasMenu")) {
            this.rightMenu.showItem(item);
        }

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

            $this.on("click", {event: event, box: self}, function (e) {
                e.preventDefault();

                log.info("Raise event: " + e.data.event);

                amplify.publish(event, {target: this, box: e.data.box});

            });
        });

        this.$el.find(s.RIGHT_MENU).on('click', "a", function (e) {
            e.preventDefault();
        });

    };

    Box.prototype._onRemoveEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("remove"));
        log.trace(payload);

        var r = confirm(i18nLabels.confirm_remove);

        if (r == true) {
            amplify.publish(EVT['remove'], this);
            this._dispose();
        } else {
            log.info("Abort remove");
        }

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

        if (this._getObjState('face') !== "back") {
            this._flip("back");
        } else {
            this._flip("front");
        }

        log.trace("Set box face to: " + this._getObjState('face'));

    };

    Box.prototype._flip = function (side) {

        var face = side || "front";

        if (face !== "front") {
            this.$el.find(s.FLIP_CONTAINER).addClass(C.FLIPPED_CLASSNAME || CD.FLIPPED_CLASSNAME);
        } else {
            this.$el.find(s.FLIP_CONTAINER).removeClass(C.FLIPPED_CLASSNAME || CD.FLIPPED_CLASSNAME);
        }

        this._setObjState('face', face);

    };

    Box.prototype._onMetadataEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("metadata"));
        log.trace(payload)
    };

    Box.prototype._onTabEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("tab"));
        log.trace(payload);

        var opts = {};
        opts.type = $(payload.target).data("type");

        this._showTab($(payload.target).data("tab"), opts);

    };

    Box.prototype._onTabToolbarChangeEvent = function (values) {
        //pass values to each tab to sync toolbars
        console.log(values)
    };

    Box.prototype._unbindObjEventListeners = function () {

        amplify.unsubscribe(this._getEventTopic("remove"), this._onRemoveEvent);

        amplify.unsubscribe(this._getEventTopic("resize"), this._onResizeEvent);

        amplify.unsubscribe(this._getEventTopic("clone"), this._onCloneEvent);

        amplify.unsubscribe(this._getEventTopic("flip"), this._onFlipEvent);

        amplify.unsubscribe(this._getEventTopic("metadata"), this._onMetadataEvent);

        amplify.unsubscribe(this._getEventTopic("tab"), this._onTabEvent);

        this.$el.find("[data-action]").off();

        this.$el.find(s.RIGHT_MENU).off();

    };

    Box.prototype._getEventTopic = function (evt) {

        return EVT[evt] ? EVT[evt] + this.id : evt + this.id;
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

        var registeredTabs = $.extend(true, {}, this._getObjState("tabRegistry")),
            tabs = this._getObjState("tabs"),
            tabsKeys = Object.keys(tabs),
            paths = [];

        _.each(tabsKeys, _.bind(function (tab) {

            var conf = registeredTabs[tab];

            if (!conf) {
                log.error('Registration not found for "' + tab + ' tab".');
            }

            if (!$.isPlainObject(tabs[tab])) {
                this._setObjState("tabs." + tab, {});
            }

            this._setObjState("tabs." + tab + ".suitable", false);

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

        var registeredTabs = this._getObjState("tabRegistry"),
            tabsKeys = Object.keys(this._getObjState("tabs")),
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

        var tab = this.defaultTab || C.defaultTab || CD.defaultTab;

        this._setObjState("defaultTab", tab);

        this._showTab(this._getObjState("defaultTab"));
    };

    Box.prototype._onModelError = function (err) {
        log.info("Handling model error " + err);
        this.setStatus("error");
    };

    Box.prototype._renderMenu = function () {

        if (this._getObjState("hasMenu") === true) {

            this.rightMenu = new JsonMenu({
                el: this.$el.find(s.RIGHT_MENU),
                model: RightMenuModel
            });

        } else {
            log.warn("Menu will not be rendered. Impossible to find container.")
        }

    };

    /* END - Event binding and callbacks */
    Box.prototype._disposeTabs = function () {

        var tabs = this._getObjState("tabs"),
            keys = Object.keys(tabs);

        _.each(keys, _.bind(function (tab) {

            this._callTabInstanceMethod(tab, "dispose");

        }, this));

    };

    Box.prototype._dispose = function () {

        this._unbindObjEventListeners();

        this._disposeTabs();

        this.$el.remove();

        delete this;

    };

    // Utils

    Box.prototype._callTabInstanceMethod = function (name, method, opts) {

        var Instance = this._getTabInstance(name);

        if ($.isFunction(Instance[method])) {

            return Instance[method](opts);

        } else {
            log.error(name + " tab does not implement the mandatory " + method + "() fn");
        }

    };

    return Box;
});
