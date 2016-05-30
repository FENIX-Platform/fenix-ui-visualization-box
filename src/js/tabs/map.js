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
    "fx-v-b/js/utils",
    'fx-common/utils',
    "text!fx-v-b/html/tabs/map.hbs",
    "fx-filter/start",
    "fx-v-b/config/tabs/map-toolbar-model",
    "fx-common/pivotator/functions",
    "fx-m-c/start",
    "amplify"
], function ($, log, _, Handlebars,
    C, CD, ERR, EVT,
    BoxUtils, Utils,
    mapTemplate, Filter,
    ToolbarModel,
    myFunc,
    MapCreator) {

    var defaultOptions = {}, s = {
        TOOLBAR: "[data-role='toolbar']",
        TOOLBAR_BTN: "[data-role='filter-btn']"
    };

    function MapTab(obj) {

        //$.extend(true, this, defaultOptions, o);
        $.extend(true, this, {
            initial: obj,
            $el: $(obj.$el),
            box: obj.box,
            model: obj.model,
            id: obj.id
        });

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

        log.info("Map disposed successfully");
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
                //TODO add layer to map

               console.log('MAP _show',this.syncState.map)

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
    };

    MapTab.prototype._onToolbarEvent = function (payload) {
        log.info("Listen to event: " + this._getEventTopic("toolbar"));
        log.trace(payload);

        var direction = this.toolbarPosition !== "up" ? "up" : "down";


        var map = this.map.leafletMap,
            pxCen = map.latLngToContainerPoint(map.getCenter())
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

        if (C.render_visualization_components === false || CD.render_visualization_components === false) {
            log.warn("Render Visualization component blocked by configuration");
            return;
        }
        
        var $elMap = this.$el.find("#map_" + this.id),
            lang = this.lang ? this.lang.toUpperCase() : "EN";

        this.map = new MapCreator({
            el: $elMap,
            model: self.model,
            lang: lang,
            fenix_ui_map: {
                lang: lang,
                plugins: {
                    fullscreen: false,
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
                    //fontColor: '0x006600',
                    //fontSize: '20',
                    bgColor: '0xFFFFFF'
                }
            }
        });
        //FOR TESTING TOOLBAR DRAGDROP
        
        //this.map.fenixMap.addLayer( this._getTestLayer() );

        window.MapCreator = this;
    };

    MapTab.prototype.addLayersByFilter = function(filter) {
        
        console.log('addLayersByFilter', filter);

        var filter = {
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

            console.log('addLayersByFilter', layerName, layerTitle);
            
            var l = new FM.layer({
                urlWMS: "http://fenix.fao.org/demo/fenix/geoserver/wms",
                layers: layerName,
                layertitle: 'EarthStat Layer: '+layerTitle,
                opacity: '0.8',
                layertype: 'WMS'
            });

            console.log(l)
            this.map.fenixMap.addLayer( l );
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
        var position = this.initial.toolbarPosition || C.toolbarPosition || CD.toolbarPosition;
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

        //errors.push({code: ERR.MISSING_CONTAINER});

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
        var rawData = [["2","Afghanistan","512094.0","tonnes"],["4","Algeria","320.0","tonnes"],["7","Angola","37608.0","tonnes"],["9","Argentina","1563450.0","tonnes"],["10","Australia","1161115.0","tonnes"],["16","Bangladesh","5.15E7","tonnes"],["18","Bhutan","78730.0","tonnes"],["19","Bolivia (Plurinational State of)","426050.6009","tonnes"],["21","Brazil","1.1782549E7","tonnes"],["23","Belize","20505.0","tonnes"],["25","Solomon Islands","4200.0","tonnes"],["26","Brunei Darussalam","1850.0","tonnes"],["27","Bulgaria","54900.0","tonnes"],["28","Myanmar","2.8767E7","tonnes"],["29","Burundi","41454.0","tonnes"],["32","Cameroon","194094.0","tonnes"],["37","Central African Republic","42500.0","tonnes"],["38","Sri Lanka","4620730.0","tonnes"],["39","Chad","330000.0","tonnes"],["40","Chile","130307.0","tonnes"],["41","China, mainland","2.036122E8","tonnes"],["44","Colombia","2048938.0","tonnes"],["45","Comoros","29000.0","tonnes"],["46","Congo","1700.0","tonnes"],["48","Costa Rica","224570.0","tonnes"],["49","Cuba","672600.0","tonnes"],["52","Azerbaijan","4833.0","tonnes"],["53","Benin","206943.0","tonnes"],["56","Dominican Republic","824000.0","tonnes"],["58","Ecuador","1516045.0","tonnes"],["59","Egypt","6100000.0","tonnes"],["60","El Salvador","36254.0","tonnes"],["66","Fiji","5000.0","tonnes"],["68","France","82000.0","tonnes"],["69","French Guiana","2020.0","tonnes"],["74","Gabon","1700.0","tonnes"],["75","Gambia","69704.0","tonnes"],["81","Ghana","569524.0","tonnes"],["84","Greece","227000.0","tonnes"],["89","Guatemala","32051.0","tonnes"],["90","Guinea","2053000.0","tonnes"],["91","Guyana","823800.0","tonnes"],["93","Haiti","169299.66","tonnes"],["95","Honduras","49656.0","tonnes"],["97","Hungary","9800.0","tonnes"],["100","India","1.592E8","tonnes"],["101","Indonesia","7.1279709E7","tonnes"],["102","Iran (Islamic Republic of)","2900000.0","tonnes"],["103","Iraq","451849.0","tonnes"],["106","Italy","1339000.0","tonnes"],["107","Côte d\u0027Ivoire","1934154.0","tonnes"],["108","Kazakhstan","344300.0","tonnes"],["109","Jamaica","31.0","tonnes"],["110","Japan","1.0758E7","tonnes"],["113","Kyrgyzstan","27220.0","tonnes"],["114","Kenya","146696.0","tonnes"],["115","Cambodia","9390000.0","tonnes"],["116","Democratic People\u0027s Republic of Korea","2901000.0","tonnes"],["117","Republic of Korea","5631689.0","tonnes"],["120","Lao People\u0027s Democratic Republic","3415000.0","tonnes"],["123","Liberia","238000.0","tonnes"],["129","Madagascar","3610626.0","tonnes"],["130","Malawi","125156.0","tonnes"],["131","Malaysia","2626881.0","tonnes"],["133","Mali","2211920.0","tonnes"],["136","Mauritania","192000.0","tonnes"],["137","Mauritius","646.0","tonnes"],["138","Mexico","179776.0","tonnes"],["143","Morocco","37716.0","tonnes"],["144","Mozambique","351000.0","tonnes"],["145","Micronesia (Federated States of)","165.0","tonnes"],["149","Nepal","4504503.0","tonnes"],["154","The former Yugoslav Republic of Macedonia","27921.0","tonnes"],["157","Nicaragua","377470.0699","tonnes"],["158","Niger","40000.0","tonnes"],["159","Nigeria","4700000.0","tonnes"],["165","Pakistan","6798100.0","tonnes"],["166","Panama","287395.0","tonnes"],["168","Papua New Guinea","1300.0","tonnes"],["169","Paraguay","617397.0","tonnes"],["170","Peru","3050934.028","tonnes"],["171","Philippines","1.8439406E7","tonnes"],["174","Portugal","168300.0","tonnes"],["175","Guinea-Bissau","209717.0","tonnes"],["176","Timor-Leste","87000.0","tonnes"],["181","Zimbabwe","700.0","tonnes"],["182","Réunion","260.0","tonnes"],["183","Romania","54646.0","tonnes"],["184","Rwanda","93746.0","tonnes"],["185","Russian Federation","934943.0","tonnes"],["195","Senegal","423482.0","tonnes"],["197","Sierra Leone","1255559.0","tonnes"],["201","Somalia","1970.0","tonnes"],["202","South Africa","3000.0","tonnes"],["203","Spain","851500.0","tonnes"],["206","Sudan (former)","25000.0","tonnes"],["207","Suriname","262029.0","tonnes"],["208","Tajikistan","98000.0","tonnes"],["209","Swaziland","105.0","tonnes"],["213","Turkmenistan","130000.0","tonnes"],["214","China, Taiwan Province of","1594320.0","tonnes"],["215","United Republic of Tanzania","2194750.0","tonnes"],["216","Thailand","3.60626E7","tonnes"],["217","Togo","164998.0","tonnes"],["220","Trinidad and Tobago","2859.0","tonnes"],["223","Turkey","900000.0","tonnes"],["226","Uganda","214000.0","tonnes"],["230","Ukraine","145050.0","tonnes"],["231","United States of America","8613094.0","tonnes"],["233","Burkina Faso","305382.0","tonnes"],["234","Uruguay","1359000.0","tonnes"],["235","Uzbekistan","340219.0","tonnes"],["236","Venezuela (Bolivarian Republic of)","1005000.01","tonnes"],["237","Viet Nam","4.403929126E7","tonnes"],["238","Ethiopia","184210.0","tonnes"],["250","Democratic Republic of the Congo","355000.0","tonnes"],["251","Zambia","44747.0","tonnes"],["351","China","2.0520652E8","tonnes"]]
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