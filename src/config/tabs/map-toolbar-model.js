if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


define([
    'jquery',
     "fx-box/config/tabs/shared-toolbar-model"
],
    function ($, Shared) {

    'use strict';

    return {
        map_boundaries: {
            selector : {
                id : "input",
                type : "checkbox",
                source : [ { value : true, label :"Show Map Boundaries"}]
            }
        },
        map_labels: {
            selector : {
                id : "input",
                type : "checkbox",
                source : [ { value : true, label :"Show Map Labels"}]
            }
        },
        /* //TODO
        "map_layers": {

            selector: {
                id: "sortable",
                source : [
                    {value: "1", label: "layer1"},
                    {value: "2", label: "layer2"},
                    {value: "3", label: "layer3"}
                ],
                config: {
                    itemRender:  function (model) {

                        var $el = $("<h1>[LAYER BOX " +model.label + "]</h1>");

                        $el.on("click", function () {
                            alert('Active layer')
                        })

                        return $el;
                    }
                }
            },
            template: {
                title: "Map Filter"
            }
        }//*/

    };

});