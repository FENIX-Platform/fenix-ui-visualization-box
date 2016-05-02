/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    "underscore",
    "fx-v-b/config/config",
    "fx-v-b/config/config-default",
    "fx-v-b/config/errors",
    "fx-v-b/config/events"
], function ($, log, _, C, CD, ERR, EVT) {

    'use strict';
    

    function Utils() {
        return this;
    }

    Utils.prototype.createToolbarConfig = function ( config, mod ) {

        var configuration = $.extend(true, {}, config),
            model = $.extend(true, {}, mod);

        try {

            var FX = model.metadata.dsd; //transform to fenixMod

            for (var i in FX.columns) {
                if (FX.columns.hasOwnProperty(i)) {
                    if (FX.columns[i].subject == "value") {
                        configuration.sort.selector.source.push({
                            "value": FX.columns[i].id,
                            "label": FX.columns[i].id,
                            parent: 'HIDDEN',
                            parentLabel: 'Hidden'
                        })
                    } else if (FX.columns[i].subject == "time" || FX.columns[i].id == "period") {

                        configuration.sort.selector.source.push({
                            "value": FX.columns[i].id,
                            "label": FX.columns[i].id,
                            parent: 'COLS',
                            parentLabel: 'Columns'
                        })
                    }
                    else if (FX.columns[i].key && FX.columns[i].key == true) {
                        configuration.sort.selector.source.push({
                            "value": FX.columns[i].id,
                            "label": FX.columns[i].id,
                            parent: 'ROWS',
                            parentLabel: 'Rows'
                        })
                    }
                    else {
                        configuration.sort.selector.source.push({
                            "value": FX.columns[i].id,
                            "label": FX.columns[i].id,
                            parent: 'AGG'
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

    return new Utils();

});