module.exports = {
    "metadata" : {
        "rid" : "12_2318",
        "uid" : "D3S_68144514928248275487464565488035481621",
        "dsd" : {
            "columns" : [ {
                "title" : {
                    "EN" : "Year"
                },
                "values" : {
                    "timeList" : [ 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011 ]
                },
                "subject" : "time",
                "dataType" : "year",
                "key" : true,
                "id" : "DIMENSION0"
            }, {
                "title" : {
                    "EN" : "Indicator"
                },
                "values" : {
                    "codes" : [ {
                        "codes" : [ {
                            "code" : "0304"
                        }, {
                            "code" : "0302"
                        }, {
                            "code" : "0305"
                        } ],
                        "idCodeList" : "CountrySTAT_Indicators"
                    } ]
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "CountrySTAT_Indicators"
                    } ]
                },
                "subject" : "indicator",
                "dataType" : "code",
                "key" : true,
                "id" : "DIMENSION1"
            }, {
                "title" : {
                    "EN" : "Product"
                },
                "values" : {
                    "codes" : [ {
                        "version" : "2.1",
                        "codes" : [ {
                            "code" : "34661"
                        }, {
                            "code" : "34662"
                        }, {
                            "code" : "34664"
                        }, {
                            "code" : "34663"
                        } ],
                        "idCodeList" : "CPC"
                    } ]
                },
                "domain" : {
                    "codes" : [ {
                        "version" : "2.1",
                        "idCodeList" : "CPC"
                    } ]
                },
                "subject" : "item",
                "dataType" : "code",
                "key" : true,
                "id" : "DIMENSION2"
            }, {
                "title" : {
                    "EN" : "Value"
                },
                "subject" : "value",
                "dataType" : "number",
                "key" : false,
                "id" : "VALUE0"
            }, {
                "title" : {
                    "EN" : "Flag"
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "Flag"
                    } ]
                },
                "subject" : "flag",
                "dataType" : "code",
                "key" : false,
                "id" : "OTHER0"
            }, {
                "title" : {
                    "EN" : "Unit"
                },
                "values" : {
                    "codes" : [ {
                        "codes" : [ {
                            "code" : "0104"
                        } ],
                        "idCodeList" : "CountrySTAT_UM"
                    } ]
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "CountrySTAT_UM"
                    } ]
                },
                "subject" : "um",
                "dataType" : "code",
                "key" : false,
                "id" : "OTHER1"
            }, {
                "title" : {
                    "EN" : "Indicator"
                },
                "dataType" : "text",
                "virtual" : false,
                "transposed" : false,
                "key" : false,
                "id" : "DIMENSION1_EN"
            }, {
                "title" : {
                    "EN" : "Indicator"
                },
                "dataType" : "text",
                "virtual" : false,
                "transposed" : false,
                "key" : false,
                "id" : "DIMENSION1_FR"
            }, {
                "title" : {
                    "EN" : "Product"
                },
                "dataType" : "text",
                "virtual" : false,
                "transposed" : false,
                "key" : false,
                "id" : "DIMENSION2_EN"
            }, {
                "title" : {
                    "EN" : "Product"
                },
                "dataType" : "text",
                "virtual" : false,
                "transposed" : false,
                "key" : false,
                "id" : "DIMENSION2_FR"
            }, {
                "title" : {
                    "EN" : "Flag"
                },
                "dataType" : "text",
                "virtual" : false,
                "transposed" : false,
                "key" : false,
                "id" : "OTHER0_EN"
            }, {
                "title" : {
                    "EN" : "Flag"
                },
                "dataType" : "text",
                "virtual" : false,
                "transposed" : false,
                "key" : false,
                "id" : "OTHER0_FR"
            }, {
                "title" : {
                    "EN" : "Unit"
                },
                "dataType" : "text",
                "virtual" : false,
                "transposed" : false,
                "key" : false,
                "id" : "OTHER1_EN"
            }, {
                "title" : {
                    "EN" : "Unit"
                },
                "dataType" : "text",
                "virtual" : false,
                "transposed" : false,
                "key" : false,
                "id" : "OTHER1_FR"
            } ],
            "datasources" : [ "D3S" ],
            "contextSystem" : "cstat_cmr"
        }
    },
    "data" : [ [ 2015, "0101", "0111", 56482.0, null, "0103", "Production quantity", "Quantité produite", "Wheat", "Wheat", null, null, "ton", "Tonnes" ], [ 2016, "0101", "0111", 354634.0, null, "0103", "Production quantity", "Quantité produite", "Wheat", "Wheat", null, null, "ton", "Tonnes" ], [ 2014, "0101", "0111", 543.0, null, "0103", "Production quantity", "Quantité produite", "Wheat", "Wheat", null, null, "ton", "Tonnes" ] ],
    "size" : 3
}