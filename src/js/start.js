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
    "text!fx-v-b/html/template.hbs",
    "fx-common/json-menu",
    "fx-v-b/config/right-menu-model",
    "i18n!fx-v-b/nls/box",
    "q",
    "amplify",
    "bootstrap"
], function (log, require, $, _, Handlebars, C, CD, ERR, EVT, Template, JsonMenu, RightMenuModel, i18nLabels, Q) {

    'use strict';

    var s = {
        BOX: "[data-role='box']",
        CONTENT_READY: "[data-content='ready']",
        RIGHT_MENU: "[data-role='right-menu']",
        FLIP_CONTAINER: "[data-role='flip-container']",
        FONT_CONTENT: "[data-role='front-content']",
        PROCESS_STEPS: "[data-role='process-steps']",
        PROCESS_DETAILS : "[data-role='process-details']",
        BACK_CONTENT: "[data-role='back-content']"
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

        this._registerHandlebarsHelpers();

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
         * tabs[tab].initialized
         * */

        return this.state;
    };

    /* Internal fns*/

    Box.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if box has a valid id
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

    Box.prototype._initVariables = function () {

        this._setObjState("valid", true);

        this.model = this.initial.model;

        this.front_tab_instances = {};

        //resource process steps
        this.processSteps = [];

    };

    Box.prototype._initObj = function () {

        var size = this.initial.size || C.defaultSize || CD.defaultSize,
            status = this.initial.status || C.defaultStatus || CD.defaultStatus;

        this._setObjState("size", size);
        this._setObjState("status", status);

        //Inject box blank template
        var template = Handlebars.compile($(Template).find(s.BOX)[0].outerHTML),
            $html = $(template($.extend(true, {}, this.state, i18nLabels)));

        this.$el.html($html);

        //pub/sub
        this.channels = {};

        this._setObjState("hasMenu", this.$el.find(s.RIGHT_MENU).length > 0);

        //set flip side
        this.flip(this._getObjState("face"));

        //step process list
        this.$processSteps = this.$el.find(s.PROCESS_STEPS);
        this.$processStepDetails = this.$el.find(s.PROCESS_DETAILS);

    };

    Box.prototype._initObjState = function () {

        //TODO extend initialization with default values

        //template options
        this._setObjState("hideToolbar", !!this.initial.hideToolbar);
        this._setObjState("hideMenu", !!this.initial.hideMenu);
        this._setObjState("hideMetadataButton", !!this.initial.hideMetadataButton);
        this._setObjState("hideRemoveButton", !!this.initial.hideRemoveButton);
        this._setObjState("hideResizeButton", !!this.initial.hideResizeButton);
        this._setObjState("hideCloneButton", !!this.initial.hideCloneButton);
        this._setObjState("hideFlipButton", !!this.initial.hideFlipButton);
        this._setObjState("hideMinimizeButton", !!this.initial.hideMinimizeButton);

        //tabs
        this._setObjState("tabRegistry", this.tabRegistry);
        this._setObjState("tabs", this.tabs);

        //flip side
        this._setObjState("face", this.initial.face || C.defaultFace || CD.defaultFace);

        //resource process steps
        this._setObjState("process.steps", this.processSteps);

    };

    Box.prototype._setObjState = function (key, val) {

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

    Box.prototype._checkModelStatus = function () {

        switch (this._getModelStatus().toLowerCase()) {
            case 'ready' :
                this.setStatus("ready");
                this._renderBox();
                break;
            case 'empty' :
                this.setStatus("empty");
                break;
            case 'no_model' :
                this.setStatus("loading");
                break;
            case 'to_load' :
                this.setStatus("loading");
                this._loadResource()
                    .then(
                        _.bind(this._renderBox, this),
                        _.bind(this._onLoadResourceError, this));
                break;
            default :
                this.setStatus("error");
                break;
        }
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

        if (typeof this.resource !== 'object' && this.resource.hasOwnProperty("uid")) {
            return 'to_load';
        }

        return 'error';
    };

    Box.prototype._loadResource = function () {
        log.info("Loading FENIX resource");

        return Q.Promise(function (resolve, reject, notify) {
            resolve();
            //reject(new Error("Status code was " + request.status));

        });

    };

    Box.prototype._onLoadResourceError = function () {

        log.info("Impossible to load resouce");
        this._setStatus("error");

    };

    Box.prototype._renderBox = function () {
        log.info("Render box start:");

        this._preloadTabSources();
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

        this._renderBoxFrontFace();

        this._renderBoxBackFace();
    };

    // Front face

    Box.prototype._renderBoxFrontFace = function () {

        log.info("Start rendering box front face");
        this._checkSuitableTabs();

    };

    Box.prototype._showTab = function (tab, opts) {
        log.info('Show tab ' + tab);
        log.info(opts);

        var tabs = this._getObjState("tabs");

        //check if it is a valid tab
        if (!tabs[tab]) {
            log.error("Error on show tab content: " + tab);

            this._setStatus("error");

            return;
        }

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

        //hide all tabs and show the selected one
        //this.$el.find(s.CONTENT_READY).find("[data-section]").hide();
        //this.$el.find(s.CONTENT_READY).find("[data-section='" + tab + "']").show();
        this.$el.find(s.CONTENT_READY).attr("data-tab", this._getObjState("tab"));

        this._showTabContent(opts);
    };

    Box.prototype._showTabContent = function () {

        var tabs = this._getObjState("tabs"),
            tab = this._getObjState("tab");

        if (!tabs[tab]) {
            log.error("Error on show tab content: " + tab);

            this._setStatus("error");

            return;
        }

        if (tabs[tab].callback === 'once') {
            log.info("TODO")
        }

        this._setObjState("tabs." + tab + ".initialized", true);

        this._callTabInstanceMethod(tab, "show", this._getObjState("sync"));

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
        this.front_tab_instances[tab] = instance;
        //this._setObjState("tabs." + tab + ".instance", instance);
        this._setObjState("tabs." + tab + ".suitable", this._callTabInstanceMethod(tab, 'isSuitable'));

        if (this._getObjState("tabs." + tab + ".suitable") === true) {
            this._showMenuItem(tab);
        }

        return instance;

    };

    Box.prototype._getTabInstance = function (tab) {

        return this.front_tab_instances[tab];
        //return this._getObjState("tabs." + tab + ".instance")
    };

    Box.prototype._getTabContainer = function (tab) {

        var $container = this.$el.find(s.FONT_CONTENT).find("[data-section='" + tab + "']");

        if ($container.length === 0) {

            $container = $('<div data-section="' + tab + '"></div>');
            this.$el.find(s.FONT_CONTENT).append($container)
        }

        return $container;
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

    //Back face

    Box.prototype._renderBoxBackFace = function () {
        log.info("Start rendering box front face");

        this._createProcessSteps();

        this._renderProcessSteps();

    };

    Box.prototype._createProcessSteps = function () {

        var list = [];

        list.push(this._createProcessStep({
            tab: "metadata",
            params: {
                model: $.extend(true, {}, this.model)
            }
        }));

        list.push(this._createProcessStep({
            tab: "filter",
            params: {
                model: $.extend(true, {}, this.model)
            },
            template: {
                title : "Rows"
            }
        }));

        list.push(this._createProcessStep({
            tab: "filter",
            params: {
                model: $.extend(true, {}, this.model)
            },
            template: {
                title : "Aggregations"
            }
        }));

        list.push(this._createProcessStep({
            tab: "filter",
            params: {
                model: $.extend(true, {}, this.model)
            },
            template: {
                title : "Columns"
            }
        }));

        this._setObjState("process.steps", list);

    };

    Box.prototype._renderProcessSteps = function () {

        var list = this._getObjState("process.steps");

        _.each(list, _.bind(function (step, index) {

            var template = Handlebars.compile($(Template).find("[data-role='step-" + step.tab + "']")[0].outerHTML),
                $html = $(template($.extend(true, {}, step, i18nLabels, this.model)));

            this._bindStepEventListeners($html, step);

            this.$processSteps.append($html);

            //render tab
            var registry = this._getObjState("tabRegistry");

            require([registry[step.tab].path], _.bind(function (Tab) {

                //Add details container
                var $el = this.$processStepDetails.find("[data-role='" + step.id + "']");
                if ($el.length === 0) {
                    $el = $("<li data-role='" + step.id + "'>daniele</li>");

                    if (index !== 0) {
                        $el.hide();
                    }
                    this.$processStepDetails.append($el);
                }

                new Tab({
                    $el: $el,
                    box: this,
                    model: $.extend(true, {}, this.model),
                    id: "step-" + step.id,
                    template: step.template
                }).show();

            }, this));

        }, this));

    };

    Box.prototype._bindStepEventListeners = function ($html, step) {

        $html.on("click", { step: step }, _.bind(function (e) {
            this.$processStepDetails.find("li").hide();
            this.$processStepDetails.find("li[data-role='"+e.data.step.id+"']").show();

        }, this));

    };

    Box.prototype._createProcessStep = function (obj) {

        window.fx_vis_box_step_id >= 0 ? window.fx_vis_box_step_id++ : window.fx_vis_box_step_id = 0;

        return $.extend(true, obj, {id: "process-step-" + window.fx_vis_box_step_id});

    };

    // Event binding and callbacks

    Box.prototype._bindObjEventListeners = function () {

        var self = this;

        amplify.subscribe(this._getEventTopic("remove"), this, this._onRemoveEvent);

        amplify.subscribe(this._getEventTopic("resize"), this, this._onResizeEvent);

        amplify.subscribe(this._getEventTopic("clone"), this, this._onCloneEvent);

        amplify.subscribe(this._getEventTopic("flip"), this, this._onFlipEvent);

        amplify.subscribe(this._getEventTopic("metadata"), this, this._onMetadataEvent);

        amplify.subscribe(this._getEventTopic("tab"), this, this._onTabEvent);

        amplify.subscribe(this._getEventTopic("minimize"), this, this._onMinimizeEvent);

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

    Box.prototype._onMinimizeEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("minimize"));
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

        if (!_.isEmpty(values.values)) {
            this._setObjState("sync.toolbar", values);
            this._syncTabs();
        } else {
            log.warn("Abort sync");
        }

    };

    Box.prototype._syncTabs = function () {
        log.info("Send 'sync' signal");

        return;

        var tabsKeys = Object.keys(this._getObjState("tabs"));

        _.each(tabsKeys, _.bind(function (tab) {

            if (this._getObjState("tabs." + tab + ".suitable") === true && this._getObjState("tabs." + tab + ".initialized") === true) {
                this._callTabInstanceMethod(tab, 'sync', this._getObjState("sync"));
            }

        }, this));
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

    // Lateral menu

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

    Box.prototype._showMenuItem = function (item) {

        if (this._getObjState("hasMenu")) {
            this.rightMenu.showItem(item);
        }
    };

    // Utils

    Box.prototype._callTabInstanceMethod = function (name, method, opts1, opts2) {

        var Instance = this._getTabInstance(name);

        if ($.isFunction(Instance[method])) {

            this.front_tab_instances[name] = Instance;

            return Instance[method](opts1, opts2);

        } else {
            log.error(name + " tab does not implement the mandatory " + method + "() fn");
        }

    };

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

    Box.prototype._setStatus = function (status) {

        log.info("Set '" + status + "' status for result id: " + this._getObjState("id"));

        this._setObjState("status", status);

        this.$el.find(s.BOX).attr("data-status", this._getObjState("status"));
    };

    Box.prototype._getEventTopic = function (evt) {

        return EVT[evt] ? EVT[evt] + this.id : evt + this.id;
    };

    // Disposition
    Box.prototype._dispose = function () {

        this._unbindObjEventListeners();

        this._disposeTabs();

        this.$el.remove();

        delete this;

    };

    Box.prototype._disposeTabs = function () {

        var tabs = this._getObjState("tabs"),
            keys = Object.keys(tabs);

        _.each(keys, _.bind(function (tab) {

            this._callTabInstanceMethod(tab, "dispose");

        }, this));

    };

    Box.prototype._unbindObjEventListeners = function () {

        amplify.unsubscribe(this._getEventTopic("remove"), this._onRemoveEvent);

        amplify.unsubscribe(this._getEventTopic("resize"), this._onResizeEvent);

        amplify.unsubscribe(this._getEventTopic("clone"), this._onCloneEvent);

        amplify.unsubscribe(this._getEventTopic("flip"), this._onFlipEvent);

        amplify.unsubscribe(this._getEventTopic("metadata"), this._onMetadataEvent);

        amplify.unsubscribe(this._getEventTopic("tab"), this._onTabEvent);

        amplify.unsubscribe(this._getEventTopic("minimize"), this._onMinimizeEvent);

        this.$el.find("[data-action]").off();

        this.$el.find(s.RIGHT_MENU).off();

    };

    //Utils
    Box.prototype._registerHandlebarsHelpers = function () {

        Handlebars.registerHelper('i18n', function (keyword) {

            var lang;

            try {
                lang = require.s.contexts._.config.i18n.locale;
            } catch(e) {
                lang = "EN";
            }

            return keyword[lang.toUpperCase()];
        });

    };

    return Box;
});