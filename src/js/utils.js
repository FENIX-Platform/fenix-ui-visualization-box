/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    "underscore",
    "fx-v-b/config/config",
    "fx-v-b/config/config-default",
    "fx-v-b/config/errors",
    "fx-v-b/config/events",
    "fx-common/pivotator/fenixtool"
], function ($, log, _, C, CD, ERR, EVT, FenixTool) {

    'use strict';
    

    function Utils() {
        return this;
    }

    Utils.prototype.createToolbarConfig = function ( config, mod ) {

        var configuration = $.extend(true, {}, config),
            model = $.extend(true, {}, mod);

        var fenixtool = new FenixTool(),
            fxMod = fenixtool.initFXT(model.metadata.dsd,{});

        var aggregations = fxMod.AGG,
            columns = fxMod.COLS,
            rows = fxMod.ROWS,
            hidden = fxMod.HIDDEN,
            values = fxMod.VALS;

        if (columns.length !== 0 ) {
            _.each(columns, function (dim) {
                dim.parent = "columns";
                configuration.sort.selector.source.push(dim)
            });
        } else {
            configuration.sort.selector.source.push({value: "", label : "", parent : "columns"})
        }

        if (rows.length !== 0 ) {
            _.each(rows, function (dim) {
                dim.parent = "rows";
                configuration.sort.selector.source.push(dim)
            });
        } else {
            configuration.sort.selector.source.push({value: "", label : "", parent : "rows"})

        }

        if (hidden.length !== 0 ) {
            _.each(rows, function (dim) {
                dim.parent = "hidden";
                configuration.sort.selector.source.push(dim)
            });
        } else {
            configuration.sort.selector.source.push({value: "", label : "", parent : "hidden"})

        }

        return configuration;
    };

    Utils.prototype.getCreatorConfiguration = function ( values, dsd ) {

        var ret = {AGG: {}, COLS: {}, ROWS: {}, HIDDEN: {}, VALS: {}};
  
        for(var i in values.values.sort)
        {
            var sorttemp= values.values.sort[i]
            if(sorttemp.parent=="rows")
            {ret.ROWS[sorttemp.value]=true;}
            else if(sorttemp.parent=="columns")
            {ret.COLS[sorttemp.value]=true;}
                }
        ret.VALS["value"]=true;

        ret.Aggregator = "sum";
        ret.GetValue = "classicToNumber";
        ret.Formater = "value";
        ret.nbDecimal = 2;
        ret.showUnit = false;
        ret.showFlag = false;
        ret.showCode = false;

        var myFenixTool=new FenixTool();

        var ret2 = myFenixTool.initFXD(dsd, ret);
        $.extend(ret, ret2);

        var model = {};

        model.aggregationFn = ret.Aggregator;

        model.aggregations = ret.AGG.slice(0);
        model.columns = ret.COLS.slice(0);
        model.rows = ret.ROWS.slice(0);
        model.hidden = ret.HIDDEN.slice(0);
        model.values = ret.VALS.slice(0);

        model.formatter = ret.Formater;
        model.valueOutputType = ret.GetValue;
        model.showRowHeaders = ret.fulldataformat;
        model.decimals = ret.nbDecimal;

        model.showCode = ret.showCode;
        model.showFlag = ret.showFlag;
        model.showUnit = ret.showUnit;
        model.showRowHeaders=true;
        return model;
    };

    return new Utils();

});