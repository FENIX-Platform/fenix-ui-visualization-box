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
        FRONT_CONTENT: "[data-role='front-content']",
        PROCESS_STEPS: "[data-role='process-steps']",
        PROCESS_DETAILS: "[data-role='process-details']",
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

            this._preloadTabSources();

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
        this.process = this.initial.process;

        this.front_tab_instances = {};
        this.back_tab_instances = {};

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
        this._setObjState("resource.steps", this.processSteps);
        this._setObjState("resource.uid", this.initial.uid || this._getNestedProperty("metadata.uid", this.model));
        this._setObjState("resource.version", this.initial.version);
        this._setObjState("resource.values", this.initial.values);

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

        return this._getNestedProperty(path, this.state);
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
                        _.bind(this._onLoadResourceSuccess, this),
                        _.bind(this._onLoadResourceError, this));
                break;
            default :
                this.setStatus("error");
                break;
        }
    };

    Box.prototype._getModelStatus = function () {

        if (!this.model) {

            if (this._getObjState("resource.uid")) {
                return 'to_load';
            }

            return 'no_model';

        } else {

            if (typeof this.model !== 'object') {
                return 'error';
            }

            if (this.model.size === 0) {
                return 'empty';
            }

            if (Array.isArray(this.model.data) && this.model.data.length === 0) {
                return 'empty';
            }

            if (Array.isArray(this.model.data) && this.model.data.length > 0) {
                return 'ready';
            }

            return 'error';
        }

    };

    Box.prototype._loadResource = function (p) {
        log.info("Loading FENIX resource");

        this.setStatus("loading");

        var d3pUrl = C.d3pUrl || CD.d3pUrl,
            url = d3pUrl + this._getObjState("resource.uid"),
            queryParams = C.d3pQueryParameters || CD.d3pQueryParameters,
            process = _.union(Array.isArray(p) ? p : [], this.process);

        if (this._getObjState("resource.version")) {
            url = url.concat("/").concat(this._getObjState("resource.version"));
        }

        if (queryParams && typeof queryParams === 'object') {

            url = url.concat("?");

            _.each(queryParams, function (value, key) {
                url = url.concat(key).concat("=").concat(value).concat("&");
            });

            url = url.substring(0, url.length - 1);
        }

        return Q($.ajax({
            url: url,
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(process)
        }));
    };

    Box.prototype._onLoadResourceSuccess = function (data) {
        log.info("Load resource success");
        this.model = data || {data: []};

        this.setStatus("ready");

        //TODO uncomment during distribution
        //this._flip("front");

        this._checkModelStatus();

    };

    Box.prototype._onLoadResourceError = function () {
        log.info("Impossible to load resource");
        this._setStatus("error");
    };

    Box.prototype._renderBox = function () {
        log.info("Render box start:");

        this._renderBoxFaces();

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

        this._checkModelStatus();
    };

    Box.prototype._renderBoxFaces = function () {

        if (this.frontFaceIsRendered !== true) {

            this._renderBoxFrontFace();

            this.frontFaceIsRendered = true;
        }

        if (this.backFaceIsRendered !== true) {

            this._renderBoxBackFace();

            this.backFaceIsRendered = true;
        }

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
        instance.on('filter', _.bind(this._onTabToolbarChangeEvent, this));

        //cache the plugin instance
        this.front_tab_instances[tab] = instance;
        //this._setObjState("tabs." + tab + ".instance", instance);

        return instance;

    };

    Box.prototype._getTabInstance = function (tab, face) {

        return face === 'back' ? this.back_tab_instances[tab] : this.front_tab_instances[tab];
        //return this._getObjState("tabs." + tab + ".instance")
    };

    Box.prototype._getTabContainer = function (tab) {

        var $container = this.$el.find(s.FRONT_CONTENT).find("[data-section='" + tab + "']");

        if ($container.length === 0) {

            $container = $('<div data-section="' + tab + '"></div>');
            this.$el.find(s.FRONT_CONTENT).append($container)
        }

        return $container;
    };

    Box.prototype._checkSuitableTabs = function () {

        var registeredTabs = this._getObjState("tabRegistry"),
            tabsKeys = Object.keys(this._getObjState("tabs"));
        ;

        _.each(tabsKeys, _.bind(function (tab) {

            var conf = registeredTabs[tab];

            if (!conf) {
                log.error('Registration not found for "' + tab + ' tab".');
            }

            if (conf.path) {

                this._createTabInstance(tab);

                this._setObjState("tabs." + tab + ".suitable", this._callTabInstanceMethod(tab, 'isSuitable'));

                if (this._getObjState("tabs." + tab + ".suitable") === true) {
                    this._showMenuItem(tab);
                } else {
                    this._hideMenuItem(tab);
                }

            } else {
                log.error('Impossible to find path configuration for "' + tab + ' tab".');
            }

        }, this));

        this._showDefaultTab();

    };

    Box.prototype._showDefaultTab = function () {

        var tab = this.defaultTab || C.defaultTab || CD.defaultTab;

        this._setObjState("defaultTab", tab);

        this._showTab(this._getObjState("defaultTab"));
    };

    //Back face

    Box.prototype._renderBoxBackFace = function () {
        log.info("Start rendering box back face");

        this._createProcessSteps();

        this._renderProcessSteps();

    };

    Box.prototype._createProcessSteps = function () {

        var list = [],
            values = this._getObjState("resource.values") || {},
            columnsConfiguration = this._createBackTabConfiguration("columns"),
            aggregationConfiguration = this._createBackTabConfiguration("aggregations");

        list.push(this._createProcessStep({
            tab: "metadata",
            subject: "metadata",
            params: {
                model: $.extend(true, {}, this.model)
            }
        }));

        list.push(this._createProcessStep({
            tab: "filter",
            subject: "rows",
            params: {
                model: $.extend(true, {}, this.model),
                values: values.rows
            },
            labels: {
                title: "Rows"
            }
        }));

        list.push(this._createProcessStep({
            tab: "filter",
            subject: "aggregations",
            params: {
                config: aggregationConfiguration.filter,
                values: values.aggregations
            },
            labels: {
                title: "Aggregations"
            }
        }));

        list.push(this._createProcessStep({
            tab: "filter",
            subject: "columns",
            params: {
                config: columnsConfiguration.filter,
                template: columnsConfiguration.template,
                values: values.columns

            },
            labels: {
                title: "Columns"
            }
        }));

        this._setObjState("resource.steps", list);

    };

    Box.prototype._createBackTabConfiguration = function (tab, include) {

        var configuration;

        switch (tab.toLowerCase()) {
            case 'aggregations':
                configuration = this._createBackAggregationTabConfiguration(include);
                break;
            case 'columns':
                configuration = this._createBackColumnsTabConfiguration(include);
                break;
            default :
                configuration = {};
        }

        return configuration;
    };

    Box.prototype._createBackAggregationTabConfiguration = function () {

        var self = this,
            source = [],
            lang = this.lang || 'EN',
            columns = this._getNestedProperty("metadata.dsd.columns", this.model);

        _.each(columns, function (c) {

            var title = self._getNestedProperty("title", self.model.metadata),
                label;

            if (typeof title === 'object' && title[lang]) {
                label = title[lang];
            } else {
                window.fx_vis_box_missing_title >= 0 ? window.fx_vis_box_missing_title++ : window.fx_vis_box_missing_title = 0;
                label = "Missing dimension title " + window.fx_vis_box_missing_title
            }

            if (!c.id.endsWith("_" + lang.toUpperCase())) {

                source.push({
                    value: c.id,
                    parent: "dimensions",
                    label: label
                });

            }
        });

        return {

            filter: {
                "aggregations": {
                    "selector": {
                        "id": "sortable",
                        "source": source, // Static data
                        "config": {
                            "groups": {
                                dimensions: "Dimensions",
                                group: "Group by",
                                sum: "Sum",
                                avg: "Average",
                                first: "First",
                                last: "Last"
                            }
                        }
                    }
                }
            }
        };
    };

    Box.prototype._createBackColumnsTabConfiguration = function (include) {

        var self = this,
            filter = {},
            lang = this.lang || 'EN',
            columns = this._getNestedProperty("metadata.dsd.columns", this.model);

        _.each(columns, function (c) {

            var title = self._getNestedProperty("title", self.model.metadata),
                label,
                toBeIncluded = include ? _.contains(include, c.id) : true;

            if (typeof title === 'object' && title[lang]) {
                label = title[lang];
            } else {
                window.fx_vis_box_missing_title >= 0 ? window.fx_vis_box_missing_title++ : window.fx_vis_box_missing_title = 0;
                label = "Missing dimension title " + window.fx_vis_box_missing_title
            }

            if (toBeIncluded && !c.id.endsWith("_" + lang.toUpperCase())) {

                var order = {
                    selector: {
                        id: "dropdown",
                        source: [
                            //{value: "include", label: "Include"},
                            {value: "none", label: "No ordering"},
                            {value: "ASC", label: "Ascending"},
                            {value: "DESC", label: "Descending"},
                            //{value: "exclude", label: "Exclude"}
                        ],
                        default: ["none"],
                        config: {
                            "maxItems": 1
                        }
                    },
                    template: {
                        title: label
                    },
                    dependencies: {},
                    className: "col-xs-9"
                };

                order.dependencies[c.id + "_include"] = {id: "disable", event: "select"}

                filter[c.id + "_order"] = order;

                filter[c.id + "_include"] = {
                    selector: {
                        id: "input",
                        type: "checkbox",
                        source: [
                            {value: "true", label: "Include"}
                        ],
                        default: ["true"]
                    },
                    className: "col-xs-3"
                };
            }
        });

        return {
            filter: filter
        };
    };

    Box.prototype._renderProcessSteps = function () {

        var self = this,
            readyEventCounter = 0,
            list = this._getObjState("resource.steps");

        _.each(list, _.bind(function (step, index) {

            var template = Handlebars.compile($(Template).find("[data-role='step-" + step.tab + "']")[0].outerHTML),
                $html = $(template($.extend(true, {}, step, i18nLabels, this.model)));

            this._bindStepLabelEventListeners($html, step);

            this.$processSteps.append($html);

            var registry = this._getObjState("tabRegistry"),
                Tab = require(registry[step.tab].path);

            //Add details container
            var $el = this.$processStepDetails.find("[data-role='" + step.id + "']");
            if ($el.length === 0) {
                $el = $("<li data-role='" + step.id + "'></li>");

                if (index !== 0) {
                    $el.hide();
                }
                this.$processStepDetails.append($el);
            }

            //render tab
            var Instance = new Tab({
                $el: $el,
                box: this,
                model: $.extend(true, {}, this.model),
                config: step.params.config,
                values: step.params.values || {},
                id: "step-" + step.id,
                labels: step.labels,
                template: step.params.template
            });

            Instance.on("ready", _.bind(onTabReady, this));

            this.back_tab_instances[step.subject] = Instance;

            Instance.show();

        }, this));

        function onTabReady() {

            readyEventCounter++;

            if (list.length === readyEventCounter) {
                //Remove disable from query btn
                this.$el.find(s.BACK_CONTENT).find('[data-action="query"]').attr("disabled", false);
                self._bindStepEventListeners();
            }
        }
    };

    Box.prototype._bindStepLabelEventListeners = function ($html, step) {

        $html.on("click", {step: step}, _.bind(function (e) {

            this.$processStepDetails.find(">li").hide();
            this.$processStepDetails.find(">li[data-role='" + e.data.step.id + "']").show();

        }, this));

    };

    Box.prototype._bindStepEventListeners = function () {

        var lastValues,
            self = this,
            aggregationInstance = this.back_tab_instances["aggregations"],
            columnsInstance = this.back_tab_instances["columns"];

        if (aggregationInstance && columnsInstance) {

            aggregationInstance.on("change", function (payload) {

                if (!_.isEqual(payload, lastValues)) {

                    lastValues = payload;

                    var activeColumns = payload.values.aggregations
                        .filter(function (c) {
                            return c.parent !== 'dimensions';
                        })
                        .map(function (c) {
                            return c.value;
                        }),
                        config = self._createBackTabConfiguration("columns", activeColumns);

                    columnsInstance.rebuild({
                        config: config.filter
                    });

                }
                else { log.warn("Abort rebuild"); }

            })
        }

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

        amplify.subscribe(this._getEventTopic("query"), this, this._onQueryEvent);

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
            this.$el.find(s.FLIP_CONTAINER).addClass(C.flippedClassName || CD.flippedClassName);
        } else {
            this.$el.find(s.FLIP_CONTAINER).removeClass(C.flippedClassName || CD.flippedClassName);
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

    Box.prototype._onQueryEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("query"));
        log.trace(payload);

        this._disposeFrontFace();

        var process = this._createQuery();

        log.info("D3P process", process);

        this._loadResource(process)
            .then(
                _.bind(this._onLoadResourceSuccess, this),
                _.bind(this._onLoadResourceError, this));

    };

    Box.prototype._createQuery = function () {

        var self = this,
            filter = [],
            payload = {},
            filterStep,
            groupStep,
            orderStep;

        _.each(this.back_tab_instances, _.bind(function (Instance, key) {

            if ($.isFunction(Instance.getValues)) {
                payload[key] = Instance.getValues();
            }

        }, this));

        this._setObjState("resource.values", $.extend(true, {}, payload));

        if (this.back_tab_instances.hasOwnProperty("rows") && $.isFunction(this.back_tab_instances['rows'].getValues)) {
            payload["rows"] = this.back_tab_instances['rows'].getValues("fenix");
        }

        filterStep = createFilterStep(payload);
        groupStep = createGroupStep(payload);
        orderStep = createOrderStep(payload);

        if (filterStep) {
            filter.push(filterStep);
        }

        if (groupStep) {
            filter.push(groupStep);
        }

        if (orderStep) {
            filter.push(orderStep);
        }

        return filter;

        function createFilterStep(payload) {

            if (!payload.columns || !payload.rows) {
                return;
            }

            var step = {
                    name: "filter",
                    parameters: {}
                },
                hasValues = false,
                columns = [],
                rowValues = payload.rows,
                columnsValues = payload.columns.values,
                columnsSet = self._getNestedProperty("metadata.dsd.columns", self.model)
                    .filter(function (c) {
                        return !c.id.endsWith("_" + self.lang.toUpperCase());
                    })
                    .map(function (c) {
                        return c.id;
                    }).sort();

            if (Object.getOwnPropertyNames(rowValues).length > 0) {
                step.parameters.rows = rowValues;
                hasValues = true;
            } else {
                log.warn("Filter.rows not included");
            }

            _.each(columnsValues, function (obj, key) {

                if (key.endsWith("_include") && Boolean(obj[0]) === true) {
                    columns.push(key.replace("_include", ""));
                }

            });

            //If they are equals it means i want to include all columns so no filter is needed
            columns = columns.sort();

            if (!_.isEqual(columnsSet, columns)) {
                step.parameters.columns = columns;

                hasValues = true;
            } else {
                log.warn("Filter.columns not included");

            }

            return hasValues ? step : null;

        }

        function createGroupStep(payload) {

            if (!payload.aggregations) {
                return;
            }

            var step = {
                    name: "group",
                    parameters: {}
                },
                hasValues = false,
                values = payload.aggregations.values.aggregations || {},
                by = [],
                sum = [],
                avg = [],
                first = [],
                last = [],
                aggregations = [];

            _.each(values, function (obj) {

                switch (obj.parent.toLowerCase()) {
                    case "group":
                        by.push(obj.value);
                        break;
                    case "sum":
                        sum.push(obj.value);
                        break;
                    case "avg":
                        avg.push(obj.value);
                        break;
                    case "first":
                        first.push(obj.value);
                        break;
                    case "last":
                        last.push(obj.value);
                        break;
                }

            });

            sum = cleanArray(sum).map(function (i) {
                return {"columns": [i], "rule": "SUM"};
            });

            avg = cleanArray(avg).map(function (i) {
                return {"columns": [i], "rule": "AVG"};
            });

            first = cleanArray(first).map(function (i) {
                return {"columns": [i], "rule": "FIRST"};
            });

            last = cleanArray(last).map(function (i) {
                return {"columns": [i], "rule": "LAST"};
            });

            //Add group by
            if (by.length > 0) {
                step.parameters.by = cleanArray(by);
                hasValues = true
            }

            //Add aggregations
            _.each([sum, avg, first, last], function (a) {

                if (a.length > 0) {
                    aggregations = _.uniq(_.union(aggregations, a), false);
                }

            });

            if (aggregations.length > 0) {
                step.parameters.aggregations = aggregations;
                hasValues = true
            }

            return hasValues ? step : null;

        }

        function createOrderStep(payload) {

            if (!payload.columns) {
                return;
            }

            var step = {
                    name: "order",
                    parameters: null
                },
                hasValues = false,
                columnsValues = payload.columns.values,
                order = {};

            _.each(columnsValues, function (obj, key) {

                var ordering = (Array.isArray(obj) && obj.length > 0) ? obj[0].toUpperCase() : "none";

                if (key.endsWith("_order") && (ordering === 'ASC' || ordering === 'DESC')) {
                    order[key.replace("_order", "")] = ordering;
                }

            });

            if (Object.getOwnPropertyNames(order).length > 0) {
                step.parameters = order;

                hasValues = true;
            } else {
                log.warn("Filter.order not included");
            }

            return hasValues ? step : null;

        }

        function cleanArray(actual) {
            var newArray = new Array();
            for (var i = 0; i < actual.length; i++) {
                if (actual[i]) {
                    newArray.push(actual[i]);
                }
            }
            return newArray;
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

    Box.prototype._hideMenuItem = function (item) {

        if (this._getObjState("hasMenu")) {
            this.rightMenu.hideItem(item);
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

        this._disposeFrontFace();

        this._disposeBackFace();

        this.$el.remove();

        delete this;

    };

    Box.prototype._disposeFrontFace = function () {

        var tabs = this.front_tab_instances,
            keys = Object.keys(tabs);

        _.each(keys, _.bind(function (tab) {

            this._callTabInstanceMethod(tab, "dispose");

        }, this));

        this.frontFaceIsRendered = false;

    };

    Box.prototype._disposeBackFace = function () {

        var tabs = this.back_tab_instances,
            keys = Object.keys(tabs);

        _.each(keys, _.bind(function (tab) {

            this._callTabInstanceMethod(tab, "dispose");

        }, this));

        this.backFaceIsRendered = false;

    };

    Box.prototype._unbindObjEventListeners = function () {

        amplify.unsubscribe(this._getEventTopic("remove"), this._onRemoveEvent);

        amplify.unsubscribe(this._getEventTopic("resize"), this._onResizeEvent);

        amplify.unsubscribe(this._getEventTopic("clone"), this._onCloneEvent);

        amplify.unsubscribe(this._getEventTopic("flip"), this._onFlipEvent);

        amplify.unsubscribe(this._getEventTopic("metadata"), this._onMetadataEvent);

        amplify.unsubscribe(this._getEventTopic("tab"), this._onTabEvent);

        amplify.unsubscribe(this._getEventTopic("minimize"), this._onMinimizeEvent);

        amplify.unsubscribe(this._getEventTopic("query"), this._onQueryEvent);

        this.$el.find("[data-action]").off();

        this.$el.find(s.RIGHT_MENU).off();

    };

    //Utils
    Box.prototype._registerHandlebarsHelpers = function () {

        Handlebars.registerHelper('i18n', function (keyword) {

            var lang;

            try {
                lang = require.s.contexts._.config.i18n.locale;
            } catch (e) {
                lang = "EN";
            }

            return typeof keyword === 'object' ? keyword[lang.toUpperCase()] : "";
        });

    };

    Box.prototype._getNestedProperty = function (path, obj) {

        var obj = $.extend(true, {}, obj),
            arr = path.split(".");

        while (arr.length && (obj = obj[arr.shift()]));

        return obj;

    };

    return Box;
});