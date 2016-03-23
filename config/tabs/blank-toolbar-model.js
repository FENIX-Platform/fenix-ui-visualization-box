/*global define*/

define(function () {

    'use strict';

    return {

/*        "range": {

            "selector": {
                "id": "range",
                "default": [126],
                "config": { //specific ion.rangeSlider
                    type: "double",
                    min: 100,
                    max: 200
                },
                "hideFooter": true
            },

            "template": {
                "hideHeader": true,
                //"hideSwitch": true
            },

            //dependencies with other selectors
            "dependencies": {
                //@ for special selection
                //"@all": {id: "ensure_unset", event: "disable"} // obj, array of obj
            },

            "format": {
                //"output" : "codes", // codelist || time. if format is FENIX
                //"uid" : "myCodelist", //override codelist uid config
                //"version" : "myVersion", //override codelist version config
                //"dimension" : "myDimension", //override dimension uid, default is the selector id
            }
        },*/

        "donor": {

            //"className" : "col-xs-6",

            "cl": {
                "uid": "crs_donors",
                "version": "2016"
            },

            "selector": {
                "id": "tree",
                //"disabled" : true,
                //"hideSelectAllButton": false,
                //"source": [{"value": "myvalue", "label": "my custom label"}], // Static data
                //"default": [1012],
                //"hideFooter": true,
                "hideSummary" : true
            },

            "template": {
                "hideHeader": true
            },

            "dependencies": {
                //"compare": {id: "focus", event: "select"} //obj or array of obj
            },

            "format": {
                "dimension": "donorcode",
                "type": "dynamic",
                "process": '{"donorcode": { "codes":[{"uid": "{{uid}}", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
            },

            "validation": {
                //"mandatory" : true
            }
        },

        "delivery": {

            "cl": {
                "uid": "crs_channels",
                "version": "2016",
                "level": 3,
                "levels": 3
            },

            "selector": {
                "id": "tree",
                //"hideSelectAllButton": false,
                //"disabled" : true
                // "default": [44006],
                //"hideFooter": true,
                "hideSummary" : true
            },

            "dependencies": {
                //"compare": {id: "focus", event: "select"} //obj or array of obj
            },

            "template": {
                "hideHeader": true,
                //"hideSwitch": true
            },

            "format": {
                "dimension": "channelcode",
                "type": "dynamic",
                "process": '{"channelcode": { "codes":[{"uid": "{{{uid}}}", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
            },

            "validation": {
                //"mandatory" : true
            }
        }

    }

});