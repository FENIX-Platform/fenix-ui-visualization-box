module.exports = {
    "metadata" : {
        "dsd" : {
            "contextSystem" : "cstat_ken",
            "datasources" : [ "D3S" ],
            "columns" : [ {
                "dataType" : "year",
                "key" : true,
                "id" : "TIME",
                "title" : {
                    "EN" : "Year"
                },
                "subject" : "time"
            }, {
                "dataType" : "code",
                "key" : true,
                "id" : "ITEM",
                "title" : {
                    "EN" : "Product"
                },
                "domain" : {
                    "codes" : [ {
                        "version" : "full",
                        "idCodeList" : "HS"
                    } ]
                },
                "subject" : "item"
            }, {
                "dataType" : "number",
                "id" : "VALUE",
                "title" : {
                    "EN" : "Value"
                },
                "subject" : "value"
            }, {
                "dataType" : "code",
                "id" : "FLAG",
                "title" : {
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
                "key" : true,
                "id" : "GEO",
                "title" : {
                    "EN" : "Area"
                },
                "domain" : {
                    "codes" : [ {
                        "version" : "2014",
                        "idCodeList" : "GAUL"
                    } ]
                },
                "subject" : "geo"
            }, {
                "dataType" : "code",
                "id" : "UM",
                "title" : {
                    "EN" : "Unit"
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "CountrySTAT_UM"
                    } ]
                },
                "subject" : "um"
            }, {
                "dataType" : "code",
                "key" : true,
                "id" : "INDICATOR",
                "title" : {
                    "EN" : "Indicator"
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "CountrySTAT_Indicators"
                    } ]
                },
                "subject" : "indicator"
            }, {
                "dataType" : "text",
                "key" : false,
                "id" : "ITEM_EN",
                "title" : {
                    "EN" : "Product"
                },
                "virtual" : false,
                "transposed" : false
            }, {
                "dataType" : "text",
                "key" : false,
                "id" : "FLAG_EN",
                "title" : {
                    "EN" : "Flag"
                },
                "virtual" : false,
                "transposed" : false
            }, {
                "dataType" : "text",
                "key" : false,
                "id" : "GEO_EN",
                "title" : {
                    "EN" : "Area"
                },
                "virtual" : false,
                "transposed" : false
            }, {
                "dataType" : "text",
                "key" : false,
                "id" : "UM_EN",
                "title" : {
                    "EN" : "Unit"
                },
                "virtual" : false,
                "transposed" : false
            }, {
                "dataType" : "text",
                "key" : false,
                "id" : "INDICATOR_EN",
                "title" : {
                    "EN" : "Indicator"
                },
                "virtual" : false,
                "transposed" : false
            } ]
        },
        "rid" : "12_2048",
        "uid" : "114CFE015"
    },
    "data" : [ [ 2011, "281420", 522200.0, null, "133", "0103", "0303", "- ammonia in aqueous solution", null, "Kenya", "ton", "Import quantity" ], [ 2010, "281420", 419732.0, null, "133", "0103", "0303", "- ammonia in aqueous solution", null, "Kenya", "ton", "Import quantity" ], [ 2012, "281420", 425840.0, null, "133", "0103", "0303", "- ammonia in aqueous solution", null, "Kenya", "ton", "Import quantity" ], [ 2007, "281420", 451239.0, null, "133", "0103", "0303", "- ammonia in aqueous solution", null, "Kenya", "ton", "Import quantity" ], [ 2006, "281420", 410214.0, null, "133", "0103", "0303", "- ammonia in aqueous solution", null, "Kenya", "ton", "Import quantity" ], [ 2009, "281420", 448984.0, null, "133", "0103", "0303", "- ammonia in aqueous solution", null, "Kenya", "ton", "Import quantity" ], [ 2008, "281420", 321277.0, null, "133", "0103", "0303", "- ammonia in aqueous solution", null, "Kenya", "ton", "Import quantity" ], [ 2004, "281420", 351776.0, null, "133", "0103", "0303", "- ammonia in aqueous solution", null, "Kenya", "ton", "Import quantity" ], [ 2005, "281420", 383285.0, null, "133", "0103", "0303", "- ammonia in aqueous solution", null, "Kenya", "ton", "Import quantity" ], [ 2002, "281420", 335009.0, null, "133", "0103", "0303", "- ammonia in aqueous solution", null, "Kenya", "ton", "Import quantity" ], [ 2003, "281420", 312400.0, null, "133", "0103", "0303", "- ammonia in aqueous solution", null, "Kenya", "ton", "Import quantity" ], [ 2000, "281420", 317409.0, null, "133", "0103", "0303", "- ammonia in aqueous solution", null, "Kenya", "ton", "Import quantity" ], [ 2001, "281420", 329449.0, null, "133", "0103", "0303", "- ammonia in aqueous solution", null, "Kenya", "ton", "Import quantity" ], [ 1999, "281420", 338644.0, null, "133", "0103", "0303", "- ammonia in aqueous solution", null, "Kenya", "ton", "Import quantity" ] ],
    "size" : 14
};