define([
    "loglevel",
    "jquery",
    "underscore",
    "underscore.string",
    "../config/config",
    "../config/errors",
    "../config/events",
    "./utils",
    "fenix-ui-filter-utils",
    "fenix-ui-metadata-viewer",
    "../html/template.hbs",
    "../html/filter-filter-template.hbs",
    "../html/filter-map-template.hbs",
    "../html/filter-aggregation-template.hbs",
    "../html/steps/step-filter.hbs",
    "../html/steps/step-map.hbs",
    "../html/steps/step-metadata.hbs",
    "fenix-ui-dropdown",
    "../config/right-menu-model",
    "../config/tabs/map-earthstat-layers", //for map backtab
    "../nls/labels",
    "fenix-ui-bridge",
    "fenix-ui-reports",
    "swiper",
    "amplify-pubsub"
], function (log, $, _, _str, C, ERR, EVT, BoxUtils, Utils, MetadataViewer, Template, FilterFilterTemplate, FilterMapTemplate,
             FilterAggregationTemplate, StepFilterTemplate, StepMapTemplate, StepMetadataTemplate, JsonMenu, menuModel,
             mapEarthstatLayers, i18nLabels, Bridge, Report, Swiper, amplify) {

    'use strict';

    var steps = {
        filter: StepFilterTemplate,
        map: StepMapTemplate,
        metadata: StepMetadataTemplate
    }, s = {
        BOX: "[data-role='box']",
        CONTENT_READY: "[data-content='ready']",
        RIGHT_MENU: "[data-role='right-menu']",
        FLIP_CONTAINER: "[data-role='flip-container']",
        FLIP_BUTTONS: "[data-action='flip']",
        FRONT_CONTENT: "[data-role='front-content']",
        FRONT_TOOLBAR: "[data-role='front-toolbar']",
        BACK_TOOLBAR: "[data-role='back-toolbar']",
        PROCESS_STEPS: "[data-role='process-steps']",
        PROCESS_DETAILS: "[data-role='process-details']",
        BACK_CONTENT: "[data-role='back-content']",
        BOX_TITLE: "[data-role='box-title']",
        QUERY_BUTTON: "[data-action='query']",
        ERROR_TEXT: "[data-role='error-text']",
        EMPTY_FILTER_BUTTON: "[data-content='empty'] [data-action='filter'], [data-content='error'] [data-action='filter']",
        BACK_FILTER_ERRORS: "[data-role='filter-error']",
        FILTER_AGGREGATION_TEMPLATE: "[data-role='filter-aggregation-template']",
        FILTER_FILTER_TEMPLATE: "[data-role='filter-filter-template']",
        FILTER_MAP_TEMPLATE: "[data-role='filter-map-template']",
        ROWS_SWIPER: "[data-role='filter-rows-swiper']",
        BTN_SIDEBAR: "[data-action='show-back-sidebar']",
        SIDEBAR: "[data-role='back-sidebar']",
        FRONT_FACE: "[data-face='front']",
        BACK_FACE: "[data-face='back']",
        OTHER_CONTENT: "[data-content='empty'], [data-content='error'], [data-content='huge']"
    }, pluginFolder = "./tabs/";

    /* API */

    /**
     * Constructor
     * @param {Object} obj
     * @return {Object} box instance
     */
    function Box(obj) {
        log.info("Create box");
        log.info(obj);

        //import css
        require("../css/fenix-ui-visualization-box.css");
        require("../css/sandboxed-fenix-ui-visualization-box.css");

        //Extend instance with obj and $el
        $.extend(true, this, C, {initial: obj || {}, $el: $(obj.el)});

        var valid = this._validateInput();

        if (valid === true) {

            this._initState();

            this._initVariables();

            this._initObj();

            this._setStatus("loading");

            this._renderMenu();

            this._bindEventListeners();

            this._initTabSources();

            this.valid = true;

            this._getModelInfo();

            this._reactToModelStatus();

            return this;

        } else {

            this.valid = false;

            log.error("Impossible to create visualization box");
            log.error(valid);

            this._setObjState("error", valid);

        }
    }

    /**
     * Set box status
     * @param {Object} obj
     * @return {Object} box instance
     */
    Box.prototype.render = function (obj) {
        log.info("Render model for box [" + this.id + "]:");
        log.info(obj);

        $.extend(true, this, obj);

        this._reactToModelStatus();
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

        this._setStatus(status);
    };

    /**
     * Show a box's tab
     * @param {String} tab. tab'sid
     * @param {Object} opts. Options passed to tab instance
     * @return {null}
     */
    Box.prototype.showTab = function (tab, opts) {

        this._showFrontTab(tab, opts);
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
     * @param {String} face
     * @return {null}
     */
    Box.prototype.flip = function (face) {
        return this._flip(face);
    };

    /**
     * pub/sub
     * @return {Object} component instance
     */
    Box.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    /**
     * get box state
     * @return {Object} box state
     */
    Box.prototype.getState = function () {

        return this.state;
    };

    Box.prototype.setTitle = function (title) {
        log.info("Set box title: " + title);

        this._updateBoxTitle(title);

    };

    /* Internal fns*/

    Box.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if box has a valid id
        if (!this.id) {

            window.fx_vis_box_id >= 0 ? window.fx_vis_box_id++ : window.fx_vis_box_id = 0;

            this.id = "fx-box-" + window.fx_vis_box_id;

            this._setObjState("id", this.id);

            log.info("Set box id: " + this.id);
        }

        //Check if $el exist
        if (this.$el.length === 0) {

            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find box container");

        }

        return errors.length > 0 ? errors : valid;
    };

    Box.prototype._initVariables = function () {

        this.front_tab_instances = {};
        this.back_tab_instances = {};

        this.bridge = new Bridge({
            environment: this._getObjState("environment"),
            cache: this._getObjState("cache")
        });

        this.report = new Report({
            environment: this._getObjState("environment"),
            cache: this._getObjState("cache")
        });
    };

    Box.prototype._initObj = function () {

        //Inject box blank template
        var $html = $(Template($.extend(true, {}, this.getState(), this._getObjState("nls"))));

        this.$el.html($html);

        //pub/sub
        this.channels = {};

        //this._setObjState("hasMenu", this.$el.find(s.RIGHT_MENU).length > 0);
        this.hasMenu = this.$el.find(s.RIGHT_MENU).length > 0;

        //set flip side
        this.flip(this._getObjState("face"));

        //step process list
        this.$processSteps = this.$el.find(s.PROCESS_STEPS);
        this.$processStepDetails = this.$el.find(s.PROCESS_DETAILS);

        this.$boxTitle = this.$el.find(s.BOX_TITLE);

    };

    Box.prototype._initState = function () {

        var lang = this.initial.lang || C.lang;

        lang = lang.toLowerCase();
        this._setObjState("lang", lang);

        //template options
        this._setObjState("hideToolbar", !!this.initial.hideToolbar);
        this._setObjState("hideMenu", !!this.initial.hideMenu);
        this._setObjState("hideMetadataButton", !!this.initial.hideMetadataButton);
        this._setObjState("hideRemoveButton", !!this.initial.hideRemoveButton);
        this._setObjState("hideDownloadButton", !!this.initial.hideDownloadButton);
        this._setObjState("hideCloneButton", !!this.initial.hideCloneButton);
        this._setObjState("hideFlipButton", !!this.initial.hideFlipButton);
        this._setObjState("hideMinimizeButton", !!this.initial.hideMinimizeButton);

        //tabs
        this._setObjState("tabStates", this.initial.tabStates || {});
        this._setObjState("tabOptions", this.initial.tabOptions || {});
        this._setObjState("tab", this.initial.tab);
        this._setObjState("tabConfig", this.initial.tabConfig || C.tabConfig);

        //flip side
        this._setObjState("face", this.initial.face || C.face);
        this._setObjState("faces", this.initial.faces || C.faces);

        //resource process steps
        this._setObjState("model", this.initial.model);
        this._setObjState("version", this.initial.version ? this.initial.version : undefined);
        this._setObjState("values", this.initial.values);
        this._setObjState("process", this.initial.process || []);
        this._setObjState("uid", this.initial.uid || BoxUtils.getNestedProperty("metadata.uid", this._getObjState("model")));

        this._setObjState("size", this.initial.size || C.size);
        this._setObjState("status", this.initial.status || C.status);
        this._setObjState("environment", this.initial.environment);

        //data validation
        this._setObjState("maxDataSize", this.initial.maxDataSize || C.maxDataSize);
        this._setObjState("minDataSize", this.initial.minDataSize || C.minDataSize);
        this._setObjState("cache", typeof this.initial.cache === "boolean" ? this.initial.cache : C.cache);

        // back filter values
        this._setObjState("backFilter", this.initial.backFilter);
        this._setObjState("backMap", this.initial.backMap);

        var loadResourceServiceQueryParams = $.extend(true, this.initial.loadResourceServiceQueryParams || C.loadResourceServiceQueryParams, {
            language: this._getObjState("lang").toUpperCase() !== "EN" ? "EN," + this._getObjState("lang").toUpperCase() : "EN"
        });

        this._setObjState("loadResourceServiceQueryParams", loadResourceServiceQueryParams);

        this._setObjState("menuModel", this.initial.menu || menuModel);

        this._setObjState("title", this.initial.title || this._getModelTitle);

        this._setObjState("showFilter", typeof this.initial.showFilter === "boolean" ? this.initial.showFilter : false);

        this._setObjState("nls", $.extend(true, {}, i18nLabels[this._getObjState("lang")], this.initial.nls));

    };

    Box.prototype._setObjState = function (key, val) {

        BoxUtils.assign(this.state, key, val);

        return val;
    };

    Box.prototype._getObjState = function (path) {

        return BoxUtils.getNestedProperty(path, this.getState());
    };

    Box.prototype._reactToModelStatus = function (s) {
        log.info("React to model status: ");
        log.info(s);

        //reset error
        this._setObjState("error", null);

        var status = s || this._getModelStatus();

        log.info("Status found: ");
        log.info(status);

        switch (status) {
            case 'ready' :
                this._getModelInfo();
                this._renderBox();
                break;
            case 'empty' :
                this.setStatus("empty");
                break;
            case 'huge' :
                this.setStatus("huge");
                break;
            case 'no_model' :
                this.setStatus("loading");
                break;
            case 'to_load' :
                this._loadResource()
                    .then(
                        _.bind(this._onLoadResourceSuccess, this),
                        _.bind(this._onLoadResourceError, this));
                break;
            case "missing_metadata":
                this._loadResourceMetadata()
                    .then(
                        _.bind(this._loadResourceMetadataSuccess, this),
                        _.bind(this._loadResourceMetadataError, this));
                break;
            case "to_filter":
                this._forceModelFilter();
                break;
            default :
                this.setStatus("error");
                break;
        }
    };

    Box.prototype._getModelStatus = function () {

        var uid = this._getObjState("uid"),
            process = this._getObjState("process"),
            version = this._getObjState("version"),
            model = this._getObjState("model"),
            metadata = this._getObjState("model.metadata"),
            resourceType = this._getObjState("resourceRepresentationType");

        if (_.isEmpty(metadata)) {
            return 'missing_metadata';
        }

        if (resourceType === 'dataset') {

            if (model) {

                if (typeof model !== 'object') {
                    return 'error';
                }

                if (!model.size || model.size === 0) {
                    return 'empty';
                }

                if (!Array.isArray(model.data)) {
                    return 'to_filter';
                }

                if (Array.isArray(model.data) && model.data.length <= this._getObjState("minDataSize")) {
                    return 'empty';
                }

                if (model.size > this._getObjState("maxDataSize")) {
                    return 'huge';
                }

                if (Array.isArray(model.data) && model.data.length > 0) {
                    return 'ready';
                }
            }
        }

        if (resourceType === 'geographic') {

            var dsd = this._getObjState("model.metadata.dsd"),
                workspace = dsd.workspace,
                layerName = dsd.layerName;

            if (workspace && layerName) {
                return 'ready'
            }

        }

        this._setObjState("error", {code: ERR.RESOURCE_STATUS});

        return 'error';

    };

    Box.prototype._loadResource = function (p) {
        log.info("Loading FENIX resource");

        this.setStatus("loading");

        this._setObjState("showFilter", true);

        var queryParams = this._getObjState("loadResourceServiceQueryParams"),
            process = Array.isArray(p) ? p : [];

        this._setObjState("process", process.slice(0));

        return this.bridge.getProcessedResource({
            body: process,
            uid: this._getObjState("uid"),
            version: this._getObjState("version"),
            params: $.extend(true, {}, queryParams)
        });
    };

    Box.prototype._onLoadResourceError = function (e) {
        log.error("Impossible to load resource");

        log.error(e);

        log.error({code: ERR.LOAD_RESOURCE});

        this._setObjState("error", {code: ERR.LOAD_RESOURCE, filter: true});

        this._setStatus("error");
    };

    Box.prototype._onLoadResourceSuccess = function (resource) {
        log.info("Load resource success");

        this._disposeBoxFaces();

        this._updateModel(resource);

        this._getModelInfo();

        this.setStatus("ready");

        this._reactToModelStatus();

    };

    Box.prototype._updateModel = function (resource) {

        var model = this._getObjState("model") || {},
            newMetadata = BoxUtils.getNestedProperty("metadata", resource),
            newDsd = BoxUtils.getNestedProperty("dsd", newMetadata) || {},
            newData = BoxUtils.getNestedProperty("data", resource),
            newSize = BoxUtils.getNestedProperty("size", resource);

        var dsdWithoutRid = _.without(Object.keys(newDsd), "rid");

        //if metadata exists updated only dsd
        if (dsdWithoutRid.length > 0) {
            BoxUtils.assign(model, "metadata.dsd", newDsd);
        }

        if (Array.isArray(newData)) {
            BoxUtils.assign(model, "data", newData);
        }

        if (model.size !== newSize) {
            BoxUtils.assign(model, "size", newSize);
        }

        this._setObjState("model", model);
    };

    //preload resource info

    Box.prototype._loadResourceMetadata = function () {
        log.info("Loading FENIX resource metadata");

        this.setStatus("loading");

        var queryParams = this._getObjState("loadResourceServiceQueryParams");

        return this.bridge.getMetadata({
            uid: this._getObjState("uid"),
            version: this._getObjState("version"),
            params: $.extend(queryParams, {dsd: true, full: true})
        });
    };

    Box.prototype._loadResourceMetadataError = function () {
        log.error("Impossible to load resource");

        log.error({code: ERR.LOAD_METADATA});

        this._setObjState("error", {code: ERR.LOAD_METADATA});

        this._setStatus("error");
    };

    Box.prototype._loadResourceMetadataSuccess = function (metadata) {
        log.info("Load resource metadata success");
        log.info(metadata);

        this._setObjState("model", {metadata: metadata});

        this._checkResourceType();

    };

    Box.prototype._checkResourceType = function () {
        log.info("Check Resource type");

        this._getModelInfo();

        var resourceType = this._getObjState("resourceRepresentationType");

        log.info("Check resource type: " + resourceType);

        switch (resourceType) {
            case "dataset" :
                var datasources = BoxUtils.getNestedProperty("metadata.dsd.datasources", this._getObjState("model"));

                if (_.isArray(datasources) && datasources.length > 0) {

                    if (this._getObjState("process").length > 0) {
                        log.info("Process present. Load resource instead of fetch()");

                        this._loadResource(this._getObjState("process"))
                            .then(
                                _.bind(this._onLoadResourceSuccess, this),
                                _.bind(this._onLoadResourceError, this));

                    } else {
                        this._fetchResource().then(
                            _.bind(this._fetchResourceSuccess, this),
                            _.bind(this._fetchResourceError, this)
                        );
                    }

                } else {
                    log.error({code: ERR.UNKNOWN_RESOURCE_TYPE});
                    this._setObjState("error", {code: ERR.MISSING_DATASOURCES});
                    this._setStatus("error");
                }
                break;

            case "geographic" :

                this.setStatus("ready");

                this._reactToModelStatus();

                break;
            default :
                log.error({code: ERR.UNKNOWN_RESOURCE_TYPE});
                this._setObjState("error", {code: ERR.UNKNOWN_RESOURCE_TYPE});
                this._setStatus("error")
        }
    };

    Box.prototype._fetchResource = function () {
        log.info("Fetching FENIX resource");

        this.setStatus("loading");

        this._setObjState("showFilter", false);

        return this.bridge.getResource({
            body: [],
            uid: this._getObjState("uid"),
            version: this._getObjState("version"),
            params: $.extend(true, {}, {perPage: 1})
        });
    };

    Box.prototype._fetchResourceError = function (e) {
        log.error("Impossible to fetch resource");
        log.error(e);
        log.error({code: ERR.FETCH_RESOURCE});

        this._setObjState("error", {code: ERR.FETCH_RESOURCE});

        this._setStatus("error");
    };

    Box.prototype._fetchResourceSuccess = function (resource) {
        log.info("Fetch resource success");

        this._updateModel(resource);

        this._checkModelSize();

    };

    Box.prototype._checkModelSize = function () {

        var status = this._getModelStatus();

        switch (status.toLowerCase()) {
            case  "ready" :
                this._reactToModelStatus("to_load");
                break;
            default:
                this._reactToModelStatus(status);
        }

    };

    Box.prototype._getModelInfo = function () {

        var rt = this._getObjState("model.metadata.meContent.resourceRepresentationType") || "",
            resourceType = rt.toLowerCase();

        log.info("Resource type is: ");
        log.info(resourceType);

        this._setObjState("resourceRepresentationType", resourceType);
    };

    Box.prototype._renderBox = function () {
        log.info("Render box start:");

        this._setStatus("ready");

        this._renderBoxFaces();
    };

    Box.prototype._initTabSources = function () {

        var registeredTabs = $.extend(true, {}, this.pluginRegistry),
            tabs = this.tabs,
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

        log.info("Tab paths found: ");
        log.info(paths);
    };

    Box.prototype._renderBoxFaces = function () {

        log.info("Render box faces");

        this._updateBoxTitle();

        this._renderFrontFace();

        this._renderBackFace();

        this._updateBoxTitle();

    };

    Box.prototype._updateBoxTitle = function (tl) {

        var extractTitleFn = this._getObjState("title"),
            title = typeof extractTitleFn === 'function' ? extractTitleFn.call(this, this._getObjState("model")) : extractTitleFn;

        if (this.computed) {
            title = title + i18nLabels[this._getObjState("lang")]["computed_resource"];
        }
        this.$boxTitle.html(tl || title);

    };

    Box.prototype._getModelTitle = function (model) {

        var title = BoxUtils.getNestedProperty("metadata.title", model),
            uid = BoxUtils.getNestedProperty("metadata.uid", model);

        return this._getI18nLabel(title) || uid;

    };

    Box.prototype._getI18nLabel = function (obj) {

        if (typeof obj !== "object") {
            return "";
        }

        var languages = this.langFallbackOrder.slice(0),
            label = "Missing label";

        languages.unshift(this._getObjState("lang"));
        languages = _.uniq(languages);

        for (var i = 0; i < languages.length; i++) {
            label = obj[languages[i]];

            if (label) {
                break;
            }
        }

        return label;

    };

    // Load resource

    Box.prototype._validateValues = function (values) {

        this._hideFilterError();

        var valid = true,
            model = this._getObjState("model"),
            resourceColumns = BoxUtils.getNestedProperty("metadata.dsd.columns", model) || [],
            resourceKeyColumns = BoxUtils.cleanArray(resourceColumns.map(function (c) {
                if (c.key === true) {
                    return c.id;
                }
            })),
            errors = [],
            aggregations = BoxUtils.getNestedProperty("aggregations.values.aggregations", values) || [],
            columns = BoxUtils.getNestedProperty("filter.values", values) || {},
            columnsKey = Object.keys(columns) || [],
            valueDimension = _.findWhere(resourceColumns, {subject: "value"}) || {},
            valueId = valueDimension.id;


        var sum = _.where(aggregations, {parent: 'sum'}).map(function (item) {
                return item.value;
            }),
            avg = _.where(aggregations, {parent: 'avg'}).map(function (item) {
                return item.value;
            }),
            first = _.where(aggregations, {parent: 'first'}).map(function (item) {
                return item.value;
            }),
            last = _.where(aggregations, {parent: 'last'}).map(function (item) {
                return item.value;
            }),
            group = _.where(aggregations, {parent: 'group'}).map(function (item) {
                return item.value;
            }),
            sumLength = parseInt(sum.length, 10),
            avgLength = parseInt(avg.length, 10),
            firstLength = parseInt(first.length, 10),
            lastLength = parseInt(last.length, 10),
            groupLength = parseInt(group.length, 10),
            aggregationRulesLength = sumLength + avgLength + firstLength + lastLength;

        // aggregations on dataType !== number
        _.each(sum, function (dimension) {

            var column = _.findWhere(resourceColumns, {id: dimension}) || {},
                dataType = column.dataType;

            if (dataType !== 'number') {
                errors.push({
                    code: ERR.NO_NUMBER_DATATYPE,
                    value: dimension,
                    label: _.findWhere(aggregations, {value: dimension}).label
                });
            }

        });
        _.each(avg, function (dimension) {

            var column = _.findWhere(resourceColumns, {id: dimension}) || {},
                dataType = column.dataType;

            if (dataType !== 'number') {
                errors.push({
                    code: ERR.NO_NUMBER_DATATYPE,
                    value: dimension,
                    label: _.findWhere(aggregations, {value: dimension}).label
                });
            }

        });

        //no 'value' on group by
        if (_.contains(group, valueId)) {

            var valueInGroupBy = _.findWhere(aggregations, {value: valueId});

            errors.push({
                code: ERR.VALUE_IN_GROUP_BY,
                value: valueInGroupBy.value,
                label: valueInGroupBy.label
            });
        }

        //if aggregation rules -> group has to be populated
        if (aggregationRulesLength > 0 && groupLength === 0) {
            errors.push({
                code: ERR.MISSING_GROUP_BY
            });
        }

        //if group by is populated -> value in aggregation rules
        if (groupLength > 0) {

            var isValueInAggregationRules =
                _.contains(sum, valueId) || _.contains(avg, valueId) || _.contains(first, valueId) || _.contains(last, valueId);

            if (!isValueInAggregationRules) {
                errors.push({
                    code: ERR.MISSING_VALUE_IN_AGGREGATION_RULES
                });
            }
        }

        //no exclude key dimensions
        var excludedColumns = _.difference(resourceKeyColumns, columnsKey);
        if (columnsKey.length > 0 && excludedColumns.length > 0) {

            var labels = _.map(excludedColumns, _.bind(function (dim) {
                return _.findWhere(resourceColumns, {id: dim}).title[this._getObjState("lang")]
            }, this));

            errors.push({
                code: ERR.EXCLUDE_KEY_DIMENSION,
                value: labels,
                label: labels.join(", ")
            });
        }

        return errors.length > 0 ? errors : valid;
    };

    Box.prototype._createQuery = function (payload) {

        var self = this,
            filter = [],
            filterStep,
            groupStep,
            computed = false;

        filterStep = createFilterStep(payload);

        groupStep = createGroupStep(payload);

        if (filterStep) {
            computed = true;
            filter.push(filterStep);
        }

        if (groupStep) {
            computed = true;
            filter.push(groupStep);
        }

        this.computed = computed;

        return filter;

        function createFilterStep(payload) {

            var step = {
                    name: "filter",
                    parameters: {}
                },
                hasValues = false,
                columns = Object.keys(BoxUtils.getNestedProperty('filter.values', payload) || {}),
                rowValues = payload.rows || {},
                resourceColumns = BoxUtils.getNestedProperty("metadata.dsd.columns", self._getObjState("model")) || [],
                columnsSet = resourceColumns
                    .filter(function (c) {
                        return !Utils._endsWith(c.id, "_" + self._getObjState("lang").toUpperCase()) && !Utils._endsWith(c.id,"_EN");
                    })
                    .map(function (c) {
                        return c.id;
                    }).sort(),
                valueDimension = _.findWhere(resourceColumns, {subject: "value"});

            if (Object.getOwnPropertyNames(rowValues).length > 0) {
                step.parameters.rows = rowValues;
                hasValues = true;
            } else {
                log.warn("Filter.rows not included");
            }

            if (columns.length > 0 && !_.contains(columns, valueDimension.id)) {
                columns.push(valueDimension.id);
            }

            //If they are equals it means i want to include all columns so no filter is needed
            columns = columns.sort();

            if (columns.length > 0 && !_.isEqual(columnsSet, columns)) {
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
                values = BoxUtils.getNestedProperty("aggregations.values.aggregations", payload),
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

            sum = BoxUtils.cleanArray(sum).map(function (i) {
                return {"columns": [i], "rule": "SUM"};
            });

            avg = BoxUtils.cleanArray(avg).map(function (i) {
                return {"columns": [i], "rule": "AVG"};
            });

            first = BoxUtils.cleanArray(first).map(function (i) {
                return {"columns": [i], "rule": "FIRST"};
            });

            last = BoxUtils.cleanArray(last).map(function (i) {
                return {"columns": [i], "rule": "LAST"};
            });

            //Add group by
            if (by.length > 0) {
                step.parameters.by = BoxUtils.cleanArray(by);
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
    };

    // Front face

    Box.prototype._renderFrontFace = function () {
        log.info("Start rendering box front face");

        var faces = this._getObjState("faces");

        if (!_.contains(faces, 'front') || this.frontFaceIsRendered === true) {
            log.warn("Abort 'front' face rendering. face is already rendered: " + this.frontFaceIsRendered + ", config render face: " + _.contains(faces, 'front'));
            return;
        }

        this.frontFaceIsRendered = true;

        this._checkSuitableTabs();

        //TODO enforce logic
        //check is resource type is dataset
        if (this._getObjState("resourceRepresentationType") === 'dataset') {
            this._showMenuItem("download");
        } else {
            log.warn("Download menu item not show because resource is not 'dataset'");
        }

        this._showDefaultFrontTab();

    };

    Box.prototype._bindFrameEventListeners = function () {

        var self = this;

        this.$el.find(s.FRONT_FACE).find("[data-action]").each(function () {

            var $this = $(this),
                action = $this.data("action"),
                event = self._getEventTopic(action);

            $this.on("click", {event: event, box: self}, function (e) {
                e.preventDefault();

                log.info("Raise event: " + e.data.event);

                amplify.publish(event, {target: this, box: e.data.box, state: self.getState()});

            });
        });

    };

    Box.prototype._showFrontTab = function (tab, opts, force) {
        log.info('Show tab ' + tab);
        log.info(opts);

        var tabs = this.tabs;

        //check if it is a valid tab
        if (!tabs[tab]) {
            log.error("Error on show tab content: ", tab);

            log.error({code: ERR.MISSING_TAB});

            this._setObjState("error", {code: ERR.MISSING_TAB});

            this._setStatus("error");

            return;
        }

        var currentTab = this._getObjState("tab"),
            currentOpts = this._getObjState("tabOptions")[currentTab];

        //TODO check if currentTab is undefined

        if (!force && currentTab === tab && _.isEqual(currentOpts, opts)) {
            log.info("Aborting show tab current tab is equal to selected one");
            return;
        }

        if (this._getObjState("tabs." + tab + ".suitable") !== true) {
            log.error("Aborting show tab because selected tab is not suitable with current model");
            //TODO find first suitable tab and then raise error
            return;
        }

        log.info("Show '" + tab + "' tab for result id: " + this.id);

        //if opts is empty get default options
        if (!opts) {
            opts = BoxUtils.getNestedProperty("options", this.tabs[tab])
        }

        this._setObjState("tab", tab);
        this._setObjState("tabOptions." + tab, opts);

        //hide all tabs and show the selected one
        this.$el.find(s.CONTENT_READY).attr("data-tab", this._getObjState("tab"));

        this._showTabContent();
    };

    Box.prototype._showTabContent = function () {

        var tabs = this.tabs,
            tab = this._getObjState("tab");

        if (!tabs[tab]) {
            log.error("Error on show tab content: " + tab);

            log.error({code: ERR.MISSING_TAB});

            this._setObjState("error", {code: ERR.MISSING_TAB});

            this._setStatus("error");

            return;
        }

        this._setObjState("tabs." + tab + ".initialized", true);

        this._callTabInstanceMethod({tab: tab, method: "show", opt1: this._getObjState("tabOptions")[tab]});

    };

    Box.prototype._createTabInstance = function (tab) {

        var state = this._getObjState("tabStates." + tab) || {},
            model = $.extend(true, {}, this._getObjState("model")),
            registry = this.pluginRegistry,
            language = this._getObjState("lang") || C.lang,
            //Note that for sync call the argument of require() is not an array but a string
            Tab = require(this._getPluginPath(registry[tab]) + ".js"),
            config = $.extend(true, {}, state, {
                el: this._getTabContainer(tab),
                box: this,
                lang: language,
                model: model,
                id: tab + "_" + this.id,
                environment: this._getObjState("environment"),
                cache: this._getObjState("cache"),
                config: this._getObjState("tabConfig")[tab],
                nls : this._getObjState("nls")
            }),
            instance;

        instance = new Tab(config);
        //Subscribe to tab events
        instance.on('filter', _.bind(this._onTabToolbarChangeEvent, this));

        instance.on('state', _.bind(this._onTabStateChangeEvent, this, tab));

        instance.on('title.change', _.bind(this._onTitleChangeEvent, this, tab));

        //cache the plugin instance
        this.front_tab_instances[tab] = instance;

        return instance;

    };

    Box.prototype._onTitleChangeEvent = function (tab, title) {

        this._updateBoxTitle(title);
    };

    Box.prototype._getTabInstance = function (tab, face) {

        return face === 'back' ? this.back_tab_instances[tab] : this.front_tab_instances[tab];
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

        var registeredTabs = this.pluginRegistry,
            tabsKeys = Object.keys(this.tabs);

        _.each(tabsKeys, _.bind(function (tab) {
            var conf = registeredTabs[tab];

            if (!conf) {
                log.error('Registration not found for "' + tab + ' tab".');
            }

            if (conf.path) {

                this._createTabInstance(tab);

                this._setObjState("tabs." + tab + ".suitable",
                    this._callTabInstanceMethod({tab: tab, method: 'isSuitable'}));

                log.info(tab + " tab is suitable? ", this._callTabInstanceMethod({tab: tab, method: 'isSuitable'}))

                if (this._getObjState("tabs." + tab + ".suitable") === true) {
                    this._showMenuItem(tab);
                } else {
                    this._hideMenuItem(tab);
                }

            } else {
                log.error('Impossible to find path configuration for "' + tab + ' tab".');
            }
        }, this));

        this._syncFrontTabs();

    };

    Box.prototype._showDefaultFrontTab = function () {

        var tab = this._getObjState("tab") || C.tab,
            defaultTabIsSuitable = this._getObjState("tabs." + tab + ".suitable"),
            options = this._getObjState("tabOptions." + tab);

        if (defaultTabIsSuitable !== true) {
            log.warn("Default tab is not suitable. Find first suitable tab to show");

            var tabsKeys = Object.keys(this.tabs),
                found = false;

            _.each(tabsKeys, _.bind(function (t) {

                if (!found === this._getObjState("tabs." + t + ".suitable") === true) {

                    tab = t;
                }

            }, this));

        }

        this._showFrontTab(tab, options, true);
    };

    Box.prototype._syncFrontTabs = function () {
        log.info("Send front 'sync' signal");

        var tabsKeys = Object.keys(this.tabs);

        _.each(tabsKeys, _.bind(function (tab) {

            if (this._getObjState("tabs." + tab + ".suitable") === true) {

                this._callTabInstanceMethod({
                    tab: tab,
                    method: 'sync',
                    opt1: this._getObjState("sync") || {}
                });
            }

        }, this));

    };

    // Back face

    Box.prototype._renderBackFace = function () {
        log.info("Start rendering box back face");

        var faces = this._getObjState("faces");

        if (!_.contains(faces, 'back') || this.backFaceIsRendered === true) {
            log.warn("Abort 'front' face rendering. face is already rendered: " + this.backFaceIsRendered + ", confing render face: " + _.contains(faces, 'front'))
            return;
        }
        this.backFaceIsRendered = true;

        this._hideFilterError();

        this._createProcessSteps();

        this._renderProcessSteps();

        this._bindBackFaceEventListeners();

    };

    Box.prototype._bindBackFaceEventListeners = function () {

        var self = this;

        this.$el.find(s.BTN_SIDEBAR).on("click", _.bind(function () {
            this.$el.find(s.SIDEBAR).toggleClass('hidden-xs hidden-sm');
        }, this));

        this.$el.find(s.BACK_FACE).find("[data-action]").each(function () {

            var $this = $(this),
                action = $this.data("action"),
                event = self._getEventTopic(action);

            $this.on("click", {event: event, box: self}, function (e) {
                e.preventDefault();

                log.info("Raise box event: " + e.data.event);

                amplify.publish(event, {target: this, box: e.data.box, state: self.getState()});
            });
        });
    };

    Box.prototype._createProcessSteps = function () {

        var filterConfiguration,
            aggregationConfiguration,
            mapConfiguration,
            model;

        filterConfiguration = this._createBackTabConfiguration("filter");

        aggregationConfiguration = this._createBackTabConfiguration("aggregations");

        mapConfiguration = this._createBackTabConfiguration("map");

        model = $.extend(true, {}, this._getObjState("model"));

        this.processSteps = [];

        if (this._stepControlAccess("metadata")) {

            var title = BoxUtils.getNestedProperty("metadata.title", model) || {},
                uid = BoxUtils.getNestedProperty("metadata.uid", model),
                label = title[this._getObjState("lang")] ? title[this._getObjState("lang")] : uid;

            this.processSteps.push({
                tab: "metadata",
                id: "metadata",
                model: model,
                labels: {
                    title: label
                }
            });
        }

        if (this._stepControlAccess("filter")) {
            this.processSteps.push({
                id: "filter",
                tab: "filter",
                values: filterConfiguration.values,
                config: filterConfiguration.config,
                template: filterConfiguration.template,
                onReady: filterConfiguration.onReady,
                labels: {
                    title: this._getObjState("nls")["step_filter"]
                }
            });
        }

        if (this._stepControlAccess("aggregations")) {

            this.processSteps.push({
                id: "aggregations",
                tab: "filter",
                values: aggregationConfiguration.values,
                config: aggregationConfiguration.filter,
                template: aggregationConfiguration.template,
                labels: {
                    title: this._getObjState("nls")["step_aggregations"]
                }
            });
        }

        /*if (this._stepControlAccess("map")) {
            this.processSteps.push({
                id: "map",
                tab: "filter",
                values: mapConfiguration.values,
                config: mapConfiguration.filter,
                template: mapConfiguration.template,
                onReady: mapConfiguration.onReady,
                labels: {
                    title: this._getObjState("nls")["step_map"]
                }
            });
        }*/
    };

    Box.prototype._stepControlAccess = function (tab) {

        var resourceType = this._getObjState("resourceRepresentationType");

        switch (tab.toLowerCase()) {
            case "metadata" :
                return true;
            case "filter" :
                return resourceType === 'dataset';
            case "aggregations" :
                return resourceType === 'dataset';
            case "map" :
                return this._getObjState("tabs.map.suitable");
            default :
                return false;
        }
    };

    Box.prototype._createBackTabConfiguration = function (tab) {

        var configuration,
            filterValues = this._getObjState("backFilter") || {},
            mapValues = this._getObjState("backMap") || {};

        switch (tab.toLowerCase()) {
            case 'aggregations':
                configuration = this._createBackAggregationTabConfiguration(filterValues[tab]);
                break;
            case 'filter':
                configuration = this._createBackFilterTabConfiguration(filterValues[tab]);
                break;
            case 'map':
                configuration = this._createBackMapTabConfiguration(mapValues[tab]);
                break;
            default :
                configuration = {};
        }

        return configuration;
    };

    Box.prototype._createBackFilterTabConfiguration = function (values) {

        var self = this,
            forbiddenIds = ["value"],
            forbiddenSubjects = ["value"];

        var columnsFromDsd = BoxUtils.getNestedProperty("metadata.dsd.columns", this._getObjState("model")) || [],
            cols = columnsFromDsd.filter(function (col) {
                return !_.contains(forbiddenSubjects, col.subject);
            }),
            columns = cols
                .filter(function (col) {
                    return !_.contains(forbiddenIds, col.id.toLowerCase());
                })
                .filter(function (c) {                    
                    return !Utils._endsWith(c.id, "_" + self._getObjState("lang").toUpperCase()) && !Utils._endsWith(c.id,"_EN");
                }),
            config;

        config = Utils.createConfiguration({
            model: this._getObjState("model"),
            common: {
                selector: {
                    hideSummary: true
                },
                template: {
                    hideSwitch: true,
                    hideHeader: false
                }
            }
        });

        //TODO remove workaround with default lang in createConfiguration()
        var x = {};
        _.each(config, function (value, key) {
            if ( !Utils._endsWith(key, "_" + self._getObjState("lang").toUpperCase()) && !Utils._endsWith(key,"_EN") ) {
                x[key] = value;
            }
        });

        return {

            values: values,

            config: x,

            template: FilterFilterTemplate({columns: columns}),

            onReady: _.bind(function () {

                var mySwiper = new Swiper(this.$el.find(s.ROWS_SWIPER), {
                    // Optional parameters
                    //direction: 'vertical',
                    //loop: true,

                    // If we need pagination
                    pagination: this.$el.find(s.ROWS_SWIPER).find('.swiper-pagination'),
                    paginationClickable: true,

                    // Navigation arrows
                    nextButton: this.$el.find(s.ROWS_SWIPER).find('.swiper-button-next'),
                    prevButton: this.$el.find(s.ROWS_SWIPER).find('.swiper-button-prev'),

                    slidesPerView: 'auto',
                    //centeredSlides: true,
                    //spaceBetween: 30,
                    //freeMode: true,
                    simulateTouch: false

                    // And if we need scrollbar
                    //scrollbar: '.swiper-scrollbar',
                })

            }, this)

        };
    };

    Box.prototype._createBackMapTabConfiguration = function (values) {

        return $.extend(true, {}, {

            values: values,

            filter: {
                layers: {
                    selector: {
                        id: "tree",
                        source: _.map(mapEarthstatLayers, function (layer) {

                            var title = layer.Title.replace('area', '').replace('3857', '');

                            return {
                                label: _str.humanize(title),
                                value: 'earthstat:' + layer.Name
                            };
                        }),
                        config: {core: {multiple: true}}
                    },
                    dependencies: {
                        "layergroups": {id: "focus", event: "select"}
                    },
                    template: {
                        title: "Select layers to show on map",
                        hideSwitch: true,
                        hideRemoveButton: true
                    }
                }
            },

            template: FilterMapTemplate({layers: []}),

            onReady: _.bind(function (payload) {

            }, this)

        });
    };

    Box.prototype._createBackAggregationTabConfiguration = function (values) {

        var source = this._getSourceForAggregationTabConfiguration();

        return $.extend(true, {}, {

            values: values,

            filter: {
                aggregations: {
                    selector: {
                        id: "sortable",
                        source: source, // Static data
                        config: {
                            groups: {
                                dimensions: this._getObjState("nls")['aggregations_dimensions'],
                                group: this._getObjState("nls")['aggregations_group'],
                                sum: this._getObjState("nls")['aggregations_sum'],
                            }
                        }
                    },
                    template: {
                        hideHeader: true
                    }
                }
            },

            template: FilterAggregationTemplate(this._getObjState("nls"))
        });
    };

    Box.prototype._getSourceForAggregationTabConfiguration = function () {

        //TODO integrate fenixTool

        var source = [],
            lang = this._getObjState("lang").toUpperCase(),
            columns = BoxUtils.getNestedProperty("metadata.dsd.columns", this._getObjState("model"));

        _.each(columns, function (c) {

            var title,
                label,
                isI18n,
                t;

            if (!Utils._endsWith(c.id, "_" + lang) && !Utils._endsWith(c.id, "_EN")) {

                title = BoxUtils.getNestedProperty("title", c);
                isI18n = typeof title === 'object' ? title : {};
                t = isI18n[lang] || isI18n[Object.keys(title)[0]];

                if (t) {
                    label = t;
                } else {
                    window.fx_vis_box_missing_title >= 0 ? window.fx_vis_box_missing_title++ : window.fx_vis_box_missing_title = 0;
                    label = "Missing dimension title [" + c.id + "]";
                }
                source.push($.extend(true, {}, {
                    value: c.id,
                    parent: "dimensions",
                    label: label
                }));
            }
        });

        return source;
    };

    Box.prototype._renderProcessSteps = function () {

        var self = this,
            readyEventCounter = 0,
            list = this.processSteps;

        _.each(list, _.bind(function (step, index) {

            var $html = $(steps[step.tab]($.extend(true, {}, step, this._getObjState("nls"), this._getObjState("model"), this._getObjState("model"))));

            this._bindStepLabelEventListeners($html, step);

            this.$processSteps.append($html);

            var registry = this.pluginRegistry,
                Tab = require(this._getPluginPath(registry[step.tab]) + ".js");

            //Add details container
            var $el = this.$processStepDetails.find("[data-tab='" + step.id + "']");
            if ($el.length === 0) {
                $el = $("<li data-tab='" + step.id + "'></li>");

                if (index !== 0) {
                    $el.hide();
                }
                this.$processStepDetails.append($el);
            }

            //render tab
            var Instance = new Tab({
                el: $el,
                box: this,
                cache: this._getObjState("cache"),
                model: $.extend(true, {}, this._getObjState("model")),
                config: step.config,
                lang: this._getObjState("lang"),
                values: step.values || {},
                id: step.tab + "_" + step.id,
                labels: step.labels,
                template: step.template,
                onReady: step.onReady,
                environment: this._getObjState("environment")
            });

            if (typeof step.onReady === 'function') {
                Instance.on("ready", _.bind(step.onReady, this));
            }

            this.back_tab_instances[step.id] = Instance;

            onTabReady.call(this);

        }, this));

        function onTabReady() {

            readyEventCounter++;

            if (list.length === readyEventCounter) {

                //Remove disable from query btn
                this.$el.find(s.BACK_CONTENT).find(s.QUERY_BUTTON).attr("disabled", false);
                self._bindStepEventListeners();
                self._onBackTabsReady();
            }
        }
    };

    Box.prototype._onBackTabsReady = function () {

        var first = Object.keys(this.back_tab_instances)[0];

        this._showBackTab(first);

    };

    Box.prototype._bindStepLabelEventListeners = function ($html, step) {

        $html.on("click", {step: step}, _.bind(function (e) {

            this._showBackTab(e.data.step.id);

        }, this));
    };

    Box.prototype._showBackTab = function (tab) {

        //show details
        this.$processStepDetails.find(">li").hide();
        this.$processStepDetails.find(">li[data-tab='" + tab + "']").show();

        //active handler
        this.$processSteps.find("[data-tab]").removeClass("active");
        this.$processSteps.find("[data-tab='" + tab + "']").addClass("active");

        this.back_tab_instances[tab].show(this._getBackSyncModel());

    };

    Box.prototype._bindStepEventListeners = function () {

        var aggregationInstance = this.back_tab_instances["aggregations"],
            filterInstance = this.back_tab_instances["filter"];

        if (aggregationInstance && filterInstance) {

            filterInstance.on("change", _.bind(this._onBackFilterChangeEvent, this));

            aggregationInstance.on("change", _.bind(this._onBackFilterChangeEvent, this));
        }
    };

    Box.prototype._onBackFilterChangeEvent = function () {

        var values = this._getBackFilterValues(),
            valid = this._validateValues(values);

        if (valid !== true) {
            this._printFilterError(valid);
            return;
        } else {
            log.warn("Invalid back filter values:");
            log.warn(valid);
        }

        this._syncBackTabs();

    };

    Box.prototype._getBackSyncModel = function () {

        var self = this,
            sync = {},
            source = [],
            values = this._getBackFilterValues(),
            columns = BoxUtils.getNestedProperty("metadata.dsd.columns", self._getObjState("model")) || [],
            columnsSet = columns
                .filter(function (c) {
                    return !Utils._endsWith(c.id, "_" + self._getObjState("lang").toUpperCase());
                })
                .map(function (c) {
                    return c.id;
                }).sort(),
            aggregationsValues = BoxUtils.getNestedProperty("aggregations.values.aggregations", values) || [],
            enabledColumns = BoxUtils.getNestedProperty("filter.values", values) || {},
            enabledColumnsIds = Object.keys(enabledColumns).length > 0 ? Object.keys(enabledColumns) : columnsSet,
            filterIsInitialized = !$.isEmptyObject(enabledColumns),
            resourceColumns = BoxUtils.getNestedProperty("metadata.dsd.columns", this._getObjState("model")) || [],
            resourceColumnsIds = _.map(resourceColumns, function (col) {
                return col.id;
            }),
            disabledColumnsIds = _.without.apply(_, [resourceColumnsIds].concat(enabledColumnsIds)),
            valueDimension = _.findWhere(resourceColumns, {subject: "value"}) || {};

        if (filterIsInitialized === true || aggregationsValues.length > 0) {

            _.each(aggregationsValues, _.bind(function (item) {

                if (!_.contains(disabledColumnsIds, item.value) || valueDimension.id === item.value) {
                    addToSource(item.value);
                }

            }, this));

            _.each(resourceColumnsIds, _.bind(function (id) {

                if (!_.contains(disabledColumnsIds, id) && !_.findWhere(source, {value: id})) {
                    addToSource(id)
                }

            }, this));

        } else {

            // if filter is not initialized get default source
            source = this._getSourceForAggregationTabConfiguration();
        }


        //add value dimension
        addToSource(valueDimension.id);

        //TODO clear the code above because it is a workaround

        if (source.length > 0) {
            var agg = _.uniq(source, function (item, key, a) {
                return item.value;
            }).filter(function (item) {
                return !Utils._endsWith(item.value, "_" + self._getObjState("lang").toUpperCase()) && !Utils._endsWith(item.value, "_EN");
            });

            BoxUtils.assign(sync, "values.aggregations", agg);

        }

        return sync;

        function addToSource(id) {

            var item = _.findWhere(aggregationsValues, {value: id}),
                inSource = _.findWhere(source, {value: id});

            if (!!inSource || !id) {
                log.info("Not include dimension because already present: " + id);
                return;
            }

            if (!item) {

                var col = _.findWhere(resourceColumns, {id: id}),
                    label = col.title[self._getObjState("lang").toUpperCase()] || col.title[Object.keys(col.title)[0]];

                source.push({
                    value: id,
                    parent: "dimensions",
                    label: label
                })
            } else {
                source.push(item);
            }
        }
    };

    Box.prototype._syncBackTabs = function () {

        var aggregationInstance = this.back_tab_instances["aggregations"],
            sync = this._getBackSyncModel();


        if (aggregationInstance) {
            aggregationInstance.setValues(sync);
        }
    };

    // Event binding and callbacks

    Box.prototype._bindEventListeners = function () {

        var self = this;

        amplify.subscribe(this._getEventTopic("remove"), this, this._onRemoveEvent);

        amplify.subscribe(this._getEventTopic("resize"), this, this._onResizeEvent);

        amplify.subscribe(this._getEventTopic("clone"), this, this._onCloneEvent);

        amplify.subscribe(this._getEventTopic("flip"), this, this._onFlipEvent);

        amplify.subscribe(this._getEventTopic("metadata"), this, this._onMetadataEvent);

        amplify.subscribe(this._getEventTopic("tab"), this, this._onTabEvent);

        amplify.subscribe(this._getEventTopic("minimize"), this, this._onMinimizeEvent);

        amplify.subscribe(this._getEventTopic("query"), this, this._onQueryEvent);

        amplify.subscribe(this._getEventTopic("filter"), this, this._onFilterEvent);

        amplify.subscribe(this._getEventTopic("download"), this, this._onDownloadEvent);

        this.$el.find(s.RIGHT_MENU).on('click', "a", function (e) {
            e.preventDefault();
        });

        this.$el.find(s.OTHER_CONTENT).find("[data-action]").each(function () {

            var $this = $(this),
                action = $this.data("action"),
                event = self._getEventTopic(action);

            $this.on("click", {event: event, box: self}, function (e) {
                e.preventDefault();

                log.info("Raise box event: " + e.data.event);

                amplify.publish(event, {target: this, box: e.data.box, state: self.getState()});

            });
        });

        //download events
        this.report.on("export.success", function () {  /* TODO add feedback*/
        });

        this._bindFrameEventListeners();

    };

    Box.prototype._onRemoveEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("remove"));
        log.info(payload);

        var r = confirm(this._getObjState("nls").confirm_remove),
            state = $.extend(true, {}, this.getState());

        if (r == true) {
            amplify.publish(EVT['remove'], this);

            this._dispose();

            this._trigger("remove", state);
        } else {
            log.info("Abort remove");
        }

    };

    Box.prototype._onResizeEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("resize"));
        log.info(payload);

        var size;

        if (payload.target && $(payload.target).data("size")) {

            size = $(payload.target).data("size");
            log.info("Size: " + size);

            this._setSize(size);
        }
    };

    Box.prototype._onCloneEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("clone"));
        log.info(payload);

        var state = $.extend(true, {}, this.getState());

        //Exclude id for publish events
        amplify.publish(this._getEventTopic("clone", true), state);

        this._trigger("clone", state);
    };

    Box.prototype._onFlipEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("flip"));
        log.info(payload);

        if (this._getObjState('face') !== "back") {
            this._flip("back");
        } else {
            this._flip("front");
        }

        log.info("Set box face to: " + this._getObjState('face'));

    };

    Box.prototype._onMetadataEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("metadata"));
        log.info(payload);

        this.showTab('metadata');
    };

    Box.prototype._onMinimizeEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("minimize"));
        log.info(payload);

        var state = $.extend(true, {}, this.getState());

        //Exclude id for publish events
        amplify.publish(this._getEventTopic("minimize", true), state);

        this._trigger("minimize", state);

        this.dispose();
    };

    Box.prototype._onTabEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("tab"));
        log.info(payload);

        var opts = {};
        opts.type = $(payload.target).data("type");

        this._showFrontTab($(payload.target).data("tab"), opts);

    };

    Box.prototype._onTabToolbarChangeEvent = function (values) {

        if (!_.isEmpty(values.values)) {
            this._setObjState("sync.toolbar", values);
            this._syncFrontTabs();
        } else {
            log.warn("Abort sync");
        }

    };

    Box.prototype._onTabStateChangeEvent = function (tab, state) {

        this._setObjState("tabStates." + tab, state);
    };

    Box.prototype._onQueryEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("query"));
        log.info(payload);

        var filterValues = this._getBackFilterValues(),
            valid = this._validateValues(filterValues),
            mapValues = this._getBackMapValues(),
            mapIsEmpty = everyPropertyIsEmptyArray(BoxUtils.getNestedProperty("map.values", mapValues));

        if (valid === true) {

            this._enableFlip();

            // check filter values

            var process = this._createQuery(filterValues) || [];

            if (!_.isEqual(process, this._getObjState("process"))) {

                this._setObjState("backFilter", $.extend(true, {}, filterValues));

                this._setObjState("process", process.slice(0));

                log.info("D3P process", process);

                this._loadResource(process)
                    .then(
                        _.bind(this._onLoadResourceSuccess, this),
                        _.bind(this._onLoadResourceError, this));

            }
            else {
                log.warn("Abort resource filter because process have not changed");
            }

            // check map values

            if (!mapIsEmpty && !_.isEqual(mapValues, this._getObjState("backMap"))) {

                this._setObjState("backMap", $.extend(true, {}, mapValues));

                this._updateMap();

            }
            else {
                log.warn("Abort map update because values have not changed");
            }

            this._flip("front");

        }
        else {
            this._printFilterError(valid);
        }

        function everyPropertyIsEmptyArray(obj) {
            var valid = true;

            _.each(obj, function (key) {

                if (!Array.isArray(key) || key.length > 0) {
                    valid = false;
                }

            });

            return valid;
        }

    };

    Box.prototype._updateMap = function () {

        if (this._getObjState("tabs.map.suitable") !== true) {
            log.warn("Abort map update because map table is not suitable for current resource");
            return;
        }

        var mapValues = this._getObjState("backMap").map;

        this._setObjState("sync.map", mapValues);

        this._syncFrontTabs();

        var currentTab = this._getObjState('tab');

        this._showFrontTab(currentTab);

    };

    Box.prototype._onDownloadEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("download"));
        log.info(payload);

        if (this._getObjState("resourceRepresentationType") !== 'dataset') {
            log.warn("Abort download because resource is not 'dataset'");
            return;
        }

        var target = $(payload.target).attr("data-target") || "";

        switch (target.toLocaleLowerCase()) {
            case "data":
                log.info("Data download");
                this._downloadData();
                break;
            case "metadata":
                log.info("Metadata download");
                this._downloadMetadata();
                break;
            default :
                log.warn("Unknown download target");

        }
    };

    Box.prototype._downloadData = function () {

        var payload = {
            resource: this._getObjState("model"),
            input: {
                config: {}
            },
            output: {
                config: {
                    lang: this._getObjState("lang").toUpperCase()
                }
            }
        };

        log.info("Configure FENIX export: table");

        this._getObjState("lang").toUpperCase()

        if(this.computed) payload.output.config.notes = i18nLabels[this._getObjState("lang").toLowerCase()]['computed_export'];

        log.info(payload);

        this.report.export({
            format: "table",
            config: payload
        });
    };

    Box.prototype._downloadMetadata = function () {

        var model = this._getObjState("model"),
            title = BoxUtils.getNestedProperty("metadata.title", model) || {},
            fileName = title[this._getObjState("lang")] ? title[this._getObjState("lang")] : "fenix_export",
            contextSystem = BoxUtils.getNestedProperty("metadata.dsd.contextSystem", model),
            template = contextSystem === 'uneca' ? contextSystem : 'fao';

        var payload = {
            resource: {
                metadata: {
                    uid: BoxUtils.getNestedProperty("metadata.uid", model)
                },
                data: []
            },
            input: {
                config: {}
            },
            output: {
                config: {
                    template: template,
                    lang: this._getObjState("lang").toUpperCase(),
                    fileName: fileName.replace(/[^a-z0-9]/gi, '_') + '.pdf'
                }
            }
        };

        log.info("Configure FENIX export: metadata");

        log.info(payload);

        this.report.export({
            format: "metadata",
            config: payload
        });
    };

    Box.prototype._onFilterEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("filter"));
        log.info(payload);

        this._forceModelFilter();
    };

    // flip

    Box.prototype._flip = function (f) {

        var face = f || "front";

        switch (face.toLocaleLowerCase()) {
            case "front" :
                this.$el.find(s.FLIP_CONTAINER).removeClass(C.flippedClassName);
                break;
            case "back" :
                this.$el.find(s.FLIP_CONTAINER).addClass(C.flippedClassName);
                break;
        }

        this._setObjState('face', face);

    };

    Box.prototype._disableFlip = function () {
        this.$el.find(s.FLIP_BUTTONS).attr("disabled", true);
    };

    Box.prototype._enableFlip = function () {
        this.$el.find(s.FLIP_BUTTONS).attr("disabled", false);
    };

    // error handling

    Box.prototype._printFilterError = function (errors) {

        var self = this,
            err = {},
            $message = $("<ul class='list-unstyled'></ul>");

        _.each(errors, function (obj) {

            if (!err[obj.code]) {
                err[obj.code] = [];
            }

            err[obj.code].push(obj.label);

        });

        _.each(err, function (values, e) {
            $message.append($('<li>' + self._getObjState("nls")[e] + '</li>'))
        });

        this._showFilterError($message);
    };

    Box.prototype._showFilterError = function (err) {

        this.$el.find(s.BACK_FILTER_ERRORS).html(err).show();
    };

    Box.prototype._hideFilterError = function () {

        this.$el.find(s.BACK_FILTER_ERRORS).hide();
    };

    Box.prototype._getBackFilterValues = function () {

        var prevValues = this.forceModelFilter === true ? {} : this._getObjState('backFilter') || {},
            filterValues = this.back_tab_instances["filter"] ? this.back_tab_instances["filter"].getValues(null) : null,
            aggregationValues = this.back_tab_instances["aggregations"] ? this.back_tab_instances["aggregations"].getValues(null) : null,
            rowValues = this.back_tab_instances["filter"] ? this.back_tab_instances["filter"].getValues('fenix') : null;

        var payload = {
            filter: !_.isEqual(filterValues, prevValues.filter) ? filterValues : prevValues.filter,
            aggregations: !_.isEqual(aggregationValues, prevValues.aggregations) ? aggregationValues : prevValues.aggregations,
            rows: !_.isEqual(rowValues, prevValues.rows) ? rowValues : prevValues.rows
        };

        return $.extend(true, {}, payload);

    };

    Box.prototype._getBackMapValues = function () {

        var prevValues = this._getObjState('backMap') || {},
            mapValues = this.back_tab_instances["map"] ? this.back_tab_instances["map"].getValues(null) : null;

        var payload = {
            map: !_.isEmpty(mapValues) ? mapValues : prevValues
        };

        return $.extend(true, {}, payload);

    };

    // Box menu

    Box.prototype._renderMenu = function () {

        var self = this;

        if (this.hasMenu === true) {

            this.rightMenu = new JsonMenu({
                el: this.$el.find(s.RIGHT_MENU),
                model: this._getObjState("menuModel").map(function (i) {
                    return $.extend(i, {label: i18nLabels[self._getObjState("lang")]["menu_" + i.id]})
                })
            });

        } else {
            log.warn("Menu will not be rendered. Impossible to find container.")
        }

    };

    Box.prototype._showMenuItem = function (item) {

        if (this.hasMenu) {
            this.rightMenu.showItem(item);
        }
    };

    Box.prototype._hideMenuItem = function (item) {

        if (this.hasMenu) {
            this.rightMenu.hideItem(item);
        }
    };

    // Internal methods

    Box.prototype._callTabInstanceMethod = function (obj) {

        var Instance = this._getTabInstance(obj.tab, obj.face);

        if (Instance && $.isFunction(Instance[obj.method])) {
            return Instance[obj.method](obj.opt1, obj.opt2);

        } else {
            log.error(obj.tab + " tab does not implement the " + obj.method + "() fn");
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
        log.info("Set '" + status + "' status for result id: " + this.id);

        this._setObjState("status", status);

        this.$el.find(s.BOX).attr("data-status", this._getObjState("status"));

        switch (this._getObjState("status").toLowerCase()) {
            case "error" :

                var error = this._getObjState("error");

                this.$el.find(s.ERROR_TEXT).html(this._getObjState("nls")[error.code] ? this._getObjState("nls")[error.code] : error.code);

                //hide/show filter button
                if (error.filter === true) {
                    this.$el.find(s.EMPTY_FILTER_BUTTON).show();
                } else {
                    this.$el.find(s.EMPTY_FILTER_BUTTON).hide();
                }

                break;
            case "empty" :

                var $filterBtn = this.$el.find(s.EMPTY_FILTER_BUTTON);

                this._getObjState("showFilter") ?
                    $filterBtn.show() :
                    $filterBtn.hide();

                break;
        }

    };

    Box.prototype._setSize = function (size) {

        //TODO check if it is a valid size

        if (this._getObjState("size") === size) {
            log.info("Aborting resize because current size is equal to selected one");
            return;
        }

        this._setObjState("size", size);

        this.$el.find(s.BOX).attr("data-size", this._getObjState("size"));

        var state = $.extend(true, {}, this.getState());

        amplify.publish(EVT["resize"], this);

        this._trigger("resize", state);

        //keep after trigger for now
        this._redrawTabs();

    };

    Box.prototype._redrawTabs = function () {

        var tab = this._getObjState("tab");

        this._callTabInstanceMethod({tab: tab, method: "redraw"});

        this._syncFrontTabs();

    };

    Box.prototype._getEventTopic = function (evt, excludeId) {

        var baseEvent = EVT[evt] ? EVT[evt] : evt;

        return excludeId === true ? baseEvent : baseEvent + "." + this.id;
    };

    Box.prototype._forceModelFilter = function () {

        log.warn("Force model filter");
        this.forceModelFilter = true;

        this._disableFlip();

        this._flip("back");

        this._renderBackFace();

        this._setStatus("ready");

    };

    // Disposition

    Box.prototype._dispose = function () {

        this._unbindEventListeners();

        this._disposeBoxFaces();

        this.$el.remove();

        this._trigger("dispose");

        delete this;

    };

    Box.prototype._disposeBoxFaces = function () {

        this._disposeFrontFace();

        this._disposeBackFace();

    };

    Box.prototype._disposeFrontFace = function () {

        var tabs = this.front_tab_instances,
            keys = Object.keys(tabs);

        _.each(keys, _.bind(function (tab) {

            this._callTabInstanceMethod({tab: tab, method: "dispose"});

        }, this));

        this.frontFaceIsRendered = false;

    };

    Box.prototype._disposeBackFace = function () {

        var tabs = this.back_tab_instances,
            keys = Object.keys(tabs);

        _.each(keys, _.bind(function (tab) {

            this._callTabInstanceMethod({tab: tab, method: "dispose", face: "back"});

        }, this));

        this.$el.find(s.BACK_FACE).find("[data-action]").off();

        this.$processSteps.empty();

        this.backFaceIsRendered = false;

    };

    Box.prototype._unbindEventListeners = function () {

        amplify.unsubscribe(this._getEventTopic("remove"), this._onRemoveEvent);

        amplify.unsubscribe(this._getEventTopic("resize"), this._onResizeEvent);

        amplify.unsubscribe(this._getEventTopic("clone"), this._onCloneEvent);

        amplify.unsubscribe(this._getEventTopic("flip"), this._onFlipEvent);

        amplify.unsubscribe(this._getEventTopic("metadata"), this._onMetadataEvent);

        amplify.unsubscribe(this._getEventTopic("tab"), this._onTabEvent);

        amplify.unsubscribe(this._getEventTopic("minimize"), this._onMinimizeEvent);

        amplify.unsubscribe(this._getEventTopic("query"), this._onQueryEvent);

        amplify.unsubscribe(this._getEventTopic("filter"), this._onFilterEvent);

        amplify.unsubscribe(this._getEventTopic("download"), this._onDownloadEvent);

        this.$el.find("[data-action]").off();

        this.$el.find(s.RIGHT_MENU).off();

        this.$el.find(s.OTHER_CONTENT).find("[data-action]").off();

        this.$el.find(s.FRONT_FACE).find("[data-action]").off();

    };

    // Utils

    Box.prototype._getPluginPath = function (id) {
        return pluginFolder + id.path;
    };

    return Box;
});
