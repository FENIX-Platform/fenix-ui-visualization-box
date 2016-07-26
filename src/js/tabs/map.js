/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    "underscore",
    "handlebars",
    "fx-box/config/config",
    "fx-box/config/errors",
    "fx-box/config/events",
    "fx-box/js/utils",
    'fx-common/utils',
    "text!fx-box/html/tabs/map.hbs",
    "fx-filter/start",
    "fx-box/config/tabs/map-toolbar-model",
    "i18n!fx-box/nls/box",
    "fx-m-c/start",
    "amplify"
], function ($, log, _, Handlebars,
    C, ERR, EVT,
    BoxUtils, Utils,
    mapTemplate, Filter,
    ToolbarModel,
    i18nLabels,
    MapCreator) {

    var s = {
        TOOLBAR: "[data-role='toolbar']",
        TOOLBAR_BTN: "[data-role='filter-btn']"
    };

    function MapTab(obj) {

        $.extend(true, this, {
            initial: obj,
            $el: $(obj.el),
            box: obj.box,
            model: obj.model,
            id: obj.id
        });

        this.channels = {};
        this.state = {};

        this.cache = this.initial.cache;

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

        log.info("Map tab: is tab suitable?", isSuitable);

        if (isSuitable === true) {
            return true;
        } else {
            log.error(isSuitable);
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

        log.info("Map disposed successfully");
    };

    /**
     * pub/sub
     * @return {Object} component instance
     */
    MapTab.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
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

       console.log("UPDATE MAP SETTINGS",obj)
    };

    /**
     * Force redrawing
     * @return {Object} filter instance
     */
    MapTab.prototype.redraw = function () {

        if (this.map){
            this.map.invalidateSize();
        } else {
            log.warn("Abort redraw");
        }

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

            log.info("Map map shown for the first time");

            this._attach();

            this._initVariables();

            this._renderComponents();

            this._bindEventListeners();

            this.initialized = true;

        } else {
            log.info("Tab Map shown again");
        }

        if (this.toSync === true) {
            log.info("Sync tab. State:" + JSON.stringify(this.syncState));

            if (this.syncState.hasOwnProperty("toolbar") && this.toolbar) {
                this.toolbar.setValues(this.syncState.toolbar, true);
            }

            if (this.syncState.hasOwnProperty("map")) {
                this.addLayersByFilter(this.syncState.map);
            }

        }
        return this;
    };

    MapTab.prototype._attach = function () {

        var template = Handlebars.compile(mapTemplate),
            html = template($.extend(true, {}, this, i18nLabels));

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

    };

    MapTab.prototype._onToolbarEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("toolbar"));
        log.trace(payload);

        var direction = this.toolbarPosition !== "up" ? "up" : "down";


        var map = this.map.leafletMap,
            pxCen = map.latLngToContainerPoint(map.getCenter()),
            newpxCen = pxCen;
            
        if(direction==='down')
            newpxCen.x -= 200;
        else if(direction==='up')
            newpxCen.x += 200;
        
        map.panTo(map.containerPointToLatLng(newpxCen));

        this._slideToolbar(direction)

    };

    MapTab.prototype._slideToolbar = function (direction) {

        if (direction !== "up") {
            this.$toolbar.addClass('in');
            this.$toolbarBtn.addClass('in');
            this.toolbarPosition = "down";
        } else {
            this.$toolbar.removeClass('in');
            this.$toolbarBtn.removeClass('in');
            this.toolbarPosition = "up";
        }

        this._setState("toolbarPosition", this.toolbarPosition);
    };

    MapTab.prototype._onToolbarBtnClick = function () {

        this._onToolbarEvent();

        this._renderMap();
    };

    MapTab.prototype._renderMap = function () {

        var self = this;
        //var toolbarValues = this.toolbar.getValues(),
        //    configuration = BoxUtils.getMapCreatorConfiguration(toolbarValues);

        if (C.renderVisualizationComponents === false ) {
            log.warn("Render Visualization component blocked by configuration");
            return;
        }
        
        var $elMap = this.$el.find("#map_" + this.id),
            lang = this.lang ? this.lang.toUpperCase() : "EN";

            var MapCreatorOPTS = {
                el: $elMap,
                lang: lang,
                fenix_ui_map: {
                    lang: lang,
                    plugins: {
                        fullscreen: true,
                        scalecontrol:'bottomleft'
                    },
                    guiController: {
                        container: this.$el.find(s.TOOLBAR),
                        wmsLoader: false                 
                    },
                    baselayers: {
                        cartodb: {
                            title_en: "CartoDB light",
                            url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
                            subdomains: 'abcd',
                            maxZoom: 19
                        },
                        osm: {
                            //url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            url: "http://{s}.tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png",
                            title_en: "Openstreetmap",
                            maxZoom: 16
                        },
                        world_imagery: {
                            url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                            title_en: "World Imagery"
                        }
                    },
                    legendOptions: {
                        fontColor: '0x000000',
                        fontSize: '12',
                        bgColor: '0xFFFFFF'
                    }
                }
            };

        var resType = Utils.getNestedProperty("metadata.meContent.resourceRepresentationType", self.model);

        if(resType==='dataset') {
            MapCreatorOPTS.model = self.model;
        }
        else if(resType==='geographic') {

            var layerName = Utils.getNestedProperty("metadata.dsd.layerName", self.model),
                workspace = Utils.getNestedProperty("metadata.dsd.workspace", self.model);
            
            MapCreatorOPTS.uid = workspace+':'+layerName;
        }

        this.map = new MapCreator(MapCreatorOPTS);
        //FOR TESTING TOOLBAR DRAGDROP
        
        //this.map.fenixMap.addLayer( this._getTestLayer() );

        window.MMM = this;
        this._filterLayers= {};
    };

    MapTab.prototype.addLayersByFilter = function(filter) {
        
        //console.log('addLayersByFilter', filter);

        /*var filter = {
            "valid": true,
            "labels": {
                "layers": { 
                    "earthstat:abacaarea_3857":"Abaca",
                    "earthstat:agave_area_3857":"Agave"
                }
            },
            "values": {
                "layers": [
                    "earthstat:abacaarea_3857",
                    "earthstat:agave_area_3857"
                ]
            }
        };//*/

        for(var i in filter.values.layers) {
            var layerName = filter.values.layers[i];
                layerTitle = filter.labels.layers[layerName];

            //console.log('addLayersByFilter', layerName, layerTitle);

            if(this._filterLayers && !this._filterLayers.hasOwnProperty(layerName) )
            {
                this._filterLayers[layerName] = new FM.layer({
                    urlWMS: "http://fenix.fao.org/demo/fenix/geoserver/wms",
                    layers: layerName,
                    layertitle: 'EarthStat Layer: '+layerTitle,
                    opacity: '0.8',
                    layertype: 'WMS'
                });
                
                //console.log(this._filterLayers[layerName]);

                this.map.fenixMap.addLayer( this._filterLayers[layerName] );
            }
            
        }
    },

    MapTab.prototype._createFilterConfiguration = function () {

        var configurationFromFenixTool = BoxUtils.getMapToolbarConfig(this.model),
            configuration = $.extend(true, {}, ToolbarModel, configurationFromFenixTool),
            result = $.extend(true, {}, Utils.mergeConfigurations(configuration, this.syncState.toolbar || {}));

        return result;
    };

    MapTab.prototype._renderToolbar = function () {
        log.info("Map tab render toolbar");

        var self = this;

        this.toolbar = new Filter({
            items: this._createFilterConfiguration(),
            el: this.$el.find(s.TOOLBAR),
            cache : this.cache,
            environment : this.initial.environment
        });

        this.toolbar.on('ready', _.bind(this._renderMap, this));
        this.toolbar.on('change', function(e) {
            var o = self.toolbar.getValues();
            if(o.values)
            {
                if(o.values['map_boundaries'][0])
                    self.map.fenixMap.boundariesShow();
                else
                    self.map.fenixMap.boundariesHide();

                if(o.values['map_labels'][0])
                    self.map.fenixMap.labelsShow();
                else
                    self.map.fenixMap.labelsHide();
            }
        });
    };

    MapTab.prototype._renderComponents = function () {

        this._renderToolbar();

        //init toolbar position
        var position = this.initial.toolbarPosition || C.toolbarPosition;
        if (position === 'up') {
            this.toolbarPosition = 'up';
            //this.$toolbar.hide();
        } else {
            this.toolbarPosition = 'down';
        }

    };


    MapTab.prototype._unbindEventListeners = function () {

        //this.$toolbarBtn.off();
        this.$el.find("[data-action]").off();

        amplify.unsubscribe(this._getEventTopic("toolbar"), this._onToolbarEvent);

    };

    MapTab.prototype._isSuitable = function () {

        var valid = true,
            errors = [];

        var resourceType = Utils.getNestedProperty("metadata.meContent.resourceRepresentationType", this.model);

//console.log('MAP _isSuitable', resourceType);

        if (resourceType !== "dataset" && resourceType !== "geographic") {
            errors.push({code: ERR.INCOMPATIBLE_RESOURCE_TYPE});
        }

        return errors.length > 0 ? errors : valid;
    };

    MapTab.prototype._dispose = function () {

        this._unbindEventListeners();
        
    };

    MapTab.prototype._getEventTopic = function (evt) {

        return EVT[evt] ? EVT[evt] + this.id : evt + this.id;
    };

    MapTab.prototype._setState = function (key, val) {

        Utils.assign(this.state, key, val);

        this._trigger("state", $.extend(true, {}, this.state));
    };

    MapTab.prototype._getTestLayer = function() {
        var rawData = [["2","Afghanistan","512094.0","tonnes"]]
        var joinData = _.map(rawData, function(d) {
            var v = {};
            v[d[0]] = parseFloat(d[2])
            return v;
        });

        var joincolumnlabel = 'areanamee',
            joincolumn = 'faost_code',
            mu = 'Tonnes';

        return new FM.layer({
            layers: 'fenix:gaul0_faostat_3857',
            layertitle: 'Rice Paddy Production 2013',
            opacity: '0.5',
            joincolumn: joincolumn,
            joincolumnlabel: joincolumnlabel,
            joindata: joinData,
            mu: mu, measurementunit: mu,
            layertype: 'JOIN',
            jointype: 'shaded',
            openlegend: false,
            defaultgfi: true,
            colorramp: 'Reds',
            lang: 'en',
            customgfi: {
                content: {
                    en: "<div class='fm-popup'>{{" + joincolumnlabel + "}} <div class='fm-popup-join-content'>{{{" + joincolumn + "}}}</div></div>"
                },
                showpopup: true
            }
        });
    };

    return MapTab;

});