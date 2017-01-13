module.exports = {
    "metadata" : {
        "dsd" : {
            "contextSystem" : "cstat_cog",
            "datasources" : [ "D3S" ],
            "columns" : [ {
                "dataType" : "year",
                "key" : true,
                "id" : "DIMENSION0",
                "title" : {
                    "FR" : "Annee",
                    "EN" : "Year"
                },
                "subject" : "time"
            }, {
                "dataType" : "code",
                "key" : true,
                "id" : "DIMENSION1",
                "title" : {
                    "FR" : "Indicateur",
                    "EN" : "Indicator"
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "CountrySTAT_Indicators"
                    } ]
                },
                "subject" : "indicator"
            }, {
                "dataType" : "code",
                "key" : true,
                "id" : "DIMENSION2",
                "title" : {
                    "FR" : "Residence",
                    "EN" : "Residence"
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "CountrySTAT_Residence"
                    } ]
                },
                "subject" : "residence"
            }, {
                "dataType" : "number",
                "key" : false,
                "id" : "VALUE0",
                "title" : {
                    "FR" : "Valeur",
                    "EN" : "Value"
                },
                "subject" : "value"
            }, {
                "dataType" : "code",
                "key" : false,
                "id" : "OTHER0",
                "title" : {
                    "FR" : "Flag",
                    "EN" : "Flag"
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "Flag"
                    } ]
                },
                "subject" : "flag"
            }, {
                "dataType" : "code",
                "key" : false,
                "id" : "OTHER1",
                "title" : {
                    "FR" : "Unitè",
                    "EN" : "Unit"
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "CountrySTAT_UM"
                    } ]
                },
                "subject" : "um"
            }, {
                "dataType" : "text",
                "key" : false,
                "id" : "DIMENSION1_EN",
                "title" : {
                    "FR" : "Indicateur",
                    "EN" : "Indicator"
                },
                "virtual" : false,
                "transposed" : false
            }, {
                "dataType" : "text",
                "key" : false,
                "id" : "DIMENSION2_EN",
                "title" : {
                    "FR" : "Residence",
                    "EN" : "Residence"
                },
                "virtual" : false,
                "transposed" : false
            }, {
                "dataType" : "text",
                "key" : false,
                "id" : "OTHER0_EN",
                "title" : {
                    "FR" : "Flag",
                    "EN" : "Flag"
                },
                "virtual" : false,
                "transposed" : false
            }, {
                "dataType" : "text",
                "key" : false,
                "id" : "OTHER1_EN",
                "title" : {
                    "FR" : "Unitè",
                    "EN" : "Unit"
                },
                "virtual" : false,
                "transposed" : false
            } ]
        },
        "rid" : "12_1820",
        "uid" : "D3S_28098494212796759517137570446651314719"
    },
    "data" : [ [ 2007, "0501", "7002", 2285551.0, null, "0107", "Population", "Urban", null, "thousands" ], [ 2007, "0501", "7001", 1411939.0, null, "0107", "Population", "Rural", null, "thousands" ], [ 2008, "0501", "7001", 1476674.0, null, "0107", "Population", "Rural", null, "thousands" ], [ 2008, "0501", "7002", 2313112.0, null, "0107", "Population", "Urban", null, "thousands" ], [ 2009, "0501", "7002", 2373495.0, null, "0107", "Population", "Urban", null, "thousands" ], [ 2009, "0501", "7001", 1510717.0, null, "0107", "Population", "Rural", null, "thousands" ], [ 2010, "0501", "7001", 1479196.0, null, "0107", "Population", "Rural", null, "thousands" ], [ 2010, "0501", "7002", 2500862.0, null, "0107", "Population", "Urban", null, "thousands" ] ],
    "size" : 8
};