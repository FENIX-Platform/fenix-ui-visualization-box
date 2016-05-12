/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    "underscore",
    "handlebars",
    "fx-v-b/config/config",
    "fx-v-b/config/config-default",
    "fx-v-b/config/errors",
    "fx-v-b/config/events",
    'fx-common/utils',
    "text!fx-v-b/html/tabs/map.hbs",
    "fx-filter/start",
    "fx-v-b/config/tabs/map-toolbar-model",
    "fx-common/pivotator/functions",
    "fx-m-c/start",
    "amplify"
], function ($, log, _, Handlebars, C, CD, ERR, EVT, Utils,
             mapTemplate, Filter, ToolbarModel, myFunc, MapCreator) {

    var defaultOptions = {}, s = {
        TOOLBAR: "[data-role='toolbar']",
        TOOLBAR_BTN: "[data-role='toolbar'] [data-role='toolbar-btn']"
    };

    function MapTab(obj) {

        //$.extend(true, this, defaultOptions, o);
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
    MapTab.prototype.init = function () {

        log.info("Map initialized successfully");
    };

    /**
     * Method invoked when the tab is shown in the FENIX visualization box
     * Mandatory method
     */
    MapTab.prototype.show = function (opts) {

        var valid = this._validateInput();

        if (valid === true) {

            this._show(opts);

            log.info("Map tab shown successfully");

            return this;

        } else {

            log.error("Impossible to create show map tab");
            log.error(valid)
        }
    };

    /**
     * Check if the current model is suitable to be displayed within the tab
     * Mandatory method
     */
    MapTab.prototype.isSuitable = function () {

        var isSuitable = this._isSuitable();

        log.info("Map tab: is tab suitable? " + isSuitable);

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
    MapTab.prototype.dispose = function () {

        this._dispose();

        log.info("Tab disposed successfully");
    };

    /**
     * pub/sub
     * @return {Object} filter instance
     */
    MapTab.prototype.on = function (channel, fn) {

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
    MapTab.prototype.sync = function (state) {
        log.info("Sync tab. State:" + JSON.stringify(state));

        this.syncState = state;

        this.toSync = true;

        return this;
    };

    MapTab.prototype.update = function ( obj ) {

       alert("Update")
    };

    /* END - API */

    MapTab.prototype._trigger = function (channel) {
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

    MapTab.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if $el exist
        if (this.$el.length === 0) {

            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find tab container");

        }

        return errors.length > 0 ? errors : valid;
    };

    MapTab.prototype._show = function (opts) {

        //opts contain visualization options

        if (this.initialized !== true) {

            log.info("Table table shown for the first time");

            this._attach();

            this._initVariables();

            this._renderComponents();

            this._bindEventListeners();

            this.initialized = true;

        } else {
            log.info("Tab chart shown again");
        }

        if (this.toSync === true) {
            log.info("Sync tab. State:" + JSON.stringify(this.syncState));

            if (this.syncState.hasOwnProperty("toolbar") && this.toolbar) {
                this.toolbar.setValues(this.syncState.toolbar, true);
            }

        }

        return this;
    };

    MapTab.prototype._attach = function () {

        var template = Handlebars.compile(mapTemplate),
            html = template(this);

        this.$el.html(html);
    };

    MapTab.prototype._initVariables = function () {

        this.$toolbar = this.$el.find(s.TOOLBAR);

        this.$toolbarBtn = this.$el.find(s.TOOLBAR_BTN);
    };

    MapTab.prototype._bindEventListeners = function () {

        var self = this;

        amplify.subscribe(this._getEventTopic("toolbar"), this, this._onToolbarEvent);

        this.$el.find("[data-action]").each(function () {

            var $this = $(this),
                action = $this.data("action"),
                event = self._getEventTopic(action);

            $this.on("click", {event: event, tab: self}, function (e) {
                e.preventDefault();

                log.info("Raise event: " + e.data.event);

                amplify.publish(event, {target: this, tab: e.data.tab});

            });
        });


        this.$toolbarBtn.on("click", _.bind(this._onToolbarBtnClick, this));

        //this.toolbar.on('change', _.bind(this._onToolbarChangeEvent, this));

    };

    MapTab.prototype._onToolbarEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("toolbar"));
        log.trace(payload);

        var direction = this.toolbarPosition !== "up" ? "up" : "down";

        this._slideToolbar(direction)

    };

    MapTab.prototype._slideToolbar = function (direction) {

        if (direction !== "up") {
            this.$toolbar.show();
            this.toolbarPosition = "down";
        } else {
            this.$toolbar.hide();
            this.toolbarPosition = "up";
        }

        this._setState("toolbarPosition", this.toolbarPosition);
    };

    MapTab.prototype._onToolbarBtnClick = function () {

        this._renderMap();
    };

    MapTab.prototype._renderMap = function () {

        var self = this,
            mapCreator = new MapCreator();

        mapCreator.render({
            container: self.$el.find("#map_" + this.id),
            fenix_ui_map: {
                plugins: {
                    fullscreen: false
                },
                guiController: {
                    container: self.$el.find(s.TOOLBAR),
                },
                baselayers: {
                    "cartodb": {
                        title_en: "CartoDB light",
                        url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                        subdomains: 'abcd',
                        maxZoom: 19
                    },            
                    "esri_grayscale": {
                        url: "http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
                        title_en: "Esri WorldGrayCanvas",
                        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
                        maxZoom: 16
                    }
                }                
            },
            onReady: function(w) {
                console.log('mapCreator onReady', w)
                mapCreator.addLayer( self.model );
            }
        });

        
    };

    MapTab.prototype._renderToolbar = function () {
        log.info("Table tab render toolbar");

        /*this.toolbar = new Filter({
            items: this._createFilterConfiguration(ToolbarModel),
            $el: this.$el.find(s.TOOLBAR)
        });*/

        /*this.toolbar.on("ready", _.bind(
            this._renderMap,
        this));*/

    };

    MapTab.prototype._createFilterConfiguration = function () {

        var configuration = $.extend(true, {}, Utils.mergeConfigurations(ToolbarModel, this.syncModel || {}));

        try {

            var aggregatorLists = new myFunc().getListAggregator(),
                FX = this.model.metadata.dsd;

            for (var i in aggregatorLists) {
                if (aggregatorLists.hasOwnProperty(i)) {
                    configuration.aggregation.selector.source
                        .push({"value": aggregatorLists[i], "label": aggregatorLists[i]})
                }
            }

            for (i in FX.columns) {
                if (FX.columns.hasOwnProperty(i)) {
                    if (FX.columns[i].subject == "value") {
                        configuration.sort.selector.source.push({
                            "value": FX.columns[i].id,
                            "label": FX.columns[i].id,
                            parent: 'HIDDEN'
                        })
                    }
                    else if (FX.columns[i].subject != "time") {
                        configuration.sort.selector.source.push({
                            "value": FX.columns[i].id,
                            "label": FX.columns[i].id,
                            parent: 'ROWS'
                        })
                    }
                    else if (FX.columns[i].subject == "time") {

                        configuration.sort.selector.source.push({
                            "value": FX.columns[i].id,
                            "label": FX.columns[i].id,
                            parent: 'COLS'
                        })
                    }
                }

            }
        } catch (e) {
            log.error("Table tab: Error on _createFilterConfiguration() ");
            log.error(e);
            return configuration;
        }

        return configuration;

    };


    MapTab.prototype._onToolbarChangeEvent = function () {

        this._trigger("filter", this.toolbar.getValues());

        this._renderMap();
    };

    MapTab.prototype._renderComponents = function () {

        this._renderToolbar();

        this._renderMap();

        //Table will be create when filter is 'ready'

        //init toolbar position
        var position = this.initial.toolbarPosition || C.toolbarPosition || CD.toolbarPosition;
        if (position === 'up') {
            this.toolbarPosition = 'up';
            this.$toolbar.hide();
        } else {
            this.toolbarPosition = 'down';
        }

    };


    MapTab.prototype._unbindEventListeners = function () {

        this.$toolbarBtn.off();
        this.$el.find("[data-action]").off();

        amplify.unsubscribe(this._getEventTopic("toolbar"), this._onToolbarEvent);

    };

    MapTab.prototype._isSuitable = function () {

        var valid = true,
            errors = [];

        //errors.push({code: ERR.MISSING_CONTAINER});

        return errors.length > 0 ? errors : valid;
    };

    MapTab.prototype._dispose = function () {

        if (this.ready === true) {
            this._unbindEventListeners();
        }
    };

    MapTab.prototype._getEventTopic = function (evt) {

        return EVT[evt] ? EVT[evt] + this.id : evt + this.id;
    };

    MapTab.prototype._setState = function (key, val) {

        Utils.assign(this.state, key, val);

        this._trigger("state", $.extend(true, {}, this.state));
    };

    return MapTab;

});