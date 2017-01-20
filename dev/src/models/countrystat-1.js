module.exports = {
    "metadata" : {
        "dsd" : {
            "contextSystem" : "cstat_ago",
            "datasources" : [ "D3S" ],
            "columns" : [ {
                "dataType" : "year",
                "key" : true,
                "id" : "DIMENSION0",
                "title" : {
                    "FR" : "Année",
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
                    "FR" : "Niveau administrative 1",
                    "EN" : "Administrative level 1"
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
                "key" : true,
                "id" : "DIMENSION3",
                "title" : {
                    "FR" : "Produit",
                    "EN" : "Product"
                },
                "domain" : {
                    "codes" : [ {
                        "idCodeList" : "CountrySTAT_Forest_products"
                    } ]
                },
                "subject" : "item"
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
                    "FR" : "Unité",
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
                    "FR" : "Niveau administrative 1",
                    "EN" : "Administrative level 1"
                },
                "virtual" : false,
                "transposed" : false
            }, {
                "dataType" : "text",
                "key" : false,
                "id" : "DIMENSION3_EN",
                "title" : {
                    "FR" : "Produit",
                    "EN" : "Product"
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
                    "FR" : "Unité",
                    "EN" : "Unit"
                },
                "virtual" : false,
                "transposed" : false
            } ]
        },
        "rid" : "12_1736",
        "uid" : "D3S_3282308509609665355720826198320839709"
    },
    "data" : [ [ 2008, "0101", "402", "0109", 228.0, null, "0120", "Production quantity", "Cuando Cubango", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2008, "0101", "412", "0109", 14.0, null, "0120", "Production quantity", "Moxico", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2008, "0101", "409", "0109", 6.0, null, "0120", "Production quantity", "Lunda Norte", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2008, "0101", "404", "0109", 7.0, null, "0120", "Production quantity", "Cunene", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "407", "0109", 71.0, null, "0120", "Production quantity", "Kuanza Norte", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "411", "0109", 495.0, null, "0120", "Production quantity", "Malanje", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "414", "0109", 497.0, null, "0120", "Production quantity", "Uige", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "401", "0109", 40.0, null, "0120", "Production quantity", "Cabinda", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "399", "0109", 943.0, null, "0120", "Production quantity", "Benguela", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "403", "0109", 41.0, null, "0120", "Production quantity", "Cuanza Sul", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "408", "0109", 0.0, null, "0120", "Production quantity", "Luanda", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "398", "0109", 13199.0, null, "0120", "Production quantity", "Bengo", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "404", "0109", 12.0, null, "0120", "Production quantity", "Cunene", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "413", "0109", 207.0, null, "0120", "Production quantity", "Namibe", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "406", "0109", 22917.0, null, "0120", "Production quantity", "Huila", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "400", "0109", 21.0, null, "0120", "Production quantity", "Bie", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2007, "0101", "405", "0109", 1660.0, null, "0120", "Production quantity", "Huambo", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2007, "0101", "406", "0109", 81698.0, null, "0120", "Production quantity", "Huila", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2007, "0101", "403", "0109", 20518.0, null, "0120", "Production quantity", "Cuanza Sul", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2007, "0101", "399", "0109", 77355.0, null, "0120", "Production quantity", "Benguela", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2008, "0101", "401", "0109", 123.0, null, "0120", "Production quantity", "Cabinda", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2008, "0101", "414", "0109", 148.0, null, "0120", "Production quantity", "Uige", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2007, "0101", "404", "0109", 808.0, null, "0120", "Production quantity", "Cunene", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2007, "0101", "412", "0109", 1945.0, null, "0120", "Production quantity", "Moxico", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2008, "0101", "408", "0109", 0.0, null, "0120", "Production quantity", "Luanda", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2008, "0101", "403", "0109", 536.0, null, "0120", "Production quantity", "Cuanza Sul", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2008, "0101", "411", "0109", 300.0, null, "0120", "Production quantity", "Malanje", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2008, "0101", "407", "0109", 10543.0, null, "0120", "Production quantity", "Kuanza Norte", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2008, "0101", "400", "0109", 1992.0, null, "0120", "Production quantity", "Bie", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2008, "0101", "406", "0109", 22000.0, null, "0120", "Production quantity", "Huila", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2008, "0101", "399", "0109", 20295.0, null, "0120", "Production quantity", "Benguela", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2008, "0101", "405", "0109", 4230.0, null, "0120", "Production quantity", "Huambo", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2006, "0101", "398", "0109", 115320.0, null, "0120", "Production quantity", "Bengo", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2006, "0101", "407", "0109", 4142.0, null, "0120", "Production quantity", "Kuanza Norte", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2006, "0101", "403", "0109", 20095.0, null, "0120", "Production quantity", "Cuanza Sul", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2006, "0101", "408", "0109", 0.0, null, "0120", "Production quantity", "Luanda", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2006, "0101", "405", "0109", 1516.0, null, "0120", "Production quantity", "Huambo", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2006, "0101", "399", "0109", 77250.0, null, "0120", "Production quantity", "Benguela", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2006, "0101", "404", "0109", 600.0, null, "0120", "Production quantity", "Cunene", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2006, "0101", "406", "0109", 81480.0, null, "0120", "Production quantity", "Huila", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2007, "0101", "401", "0109", 810.0, null, "0120", "Production quantity", "Cabinda", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2006, "0101", "412", "0109", 1896.0, null, "0120", "Production quantity", "Moxico", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2007, "0101", "414", "0109", 139.0, null, "0120", "Production quantity", "Uige", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2007, "0101", "415", "0109", 542.0, null, "0120", "Production quantity", "Zaire", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2007, "0101", "407", "0109", 4503.0, null, "0120", "Production quantity", "Kuanza Norte", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2007, "0101", "411", "0109", 1429.0, null, "0120", "Production quantity", "Malanje", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2007, "0101", "408", "0109", 0.0, null, "0120", "Production quantity", "Luanda", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2007, "0101", "398", "0109", 115732.0, null, "0120", "Production quantity", "Bengo", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2004, "0101", "412", "0109", 57.0, null, "0120", "Production quantity", "Moxico", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2005, "0101", "401", "0109", 125.0, null, "0120", "Production quantity", "Cabinda", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2005, "0101", "415", "0109", 45.0, null, "0120", "Production quantity", "Zaire", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2005, "0101", "414", "0109", 155.0, null, "0120", "Production quantity", "Uige", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2005, "0101", "411", "0109", 1163.0, null, "0120", "Production quantity", "Malanje", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2005, "0101", "398", "0109", 320.0, null, "0120", "Production quantity", "Bengo", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2005, "0101", "408", "0109", 0.0, null, "0120", "Production quantity", "Luanda", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2005, "0101", "403", "0109", 35095.0, null, "0120", "Production quantity", "Cuanza Sul", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2005, "0101", "399", "0109", 7330.0, null, "0120", "Production quantity", "Benguela", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2005, "0101", "406", "0109", 111480.0, null, "0120", "Production quantity", "Huila", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2005, "0101", "404", "0109", 317.0, null, "0120", "Production quantity", "Cunene", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2005, "0101", "412", "0109", 714.0, null, "0120", "Production quantity", "Moxico", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2006, "0101", "401", "0109", 800.0, null, "0120", "Production quantity", "Cabinda", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2006, "0101", "415", "0109", 450.0, null, "0120", "Production quantity", "Zaire", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2006, "0101", "414", "0109", 292.0, null, "0120", "Production quantity", "Uige", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2006, "0101", "411", "0109", 1075.0, null, "0120", "Production quantity", "Malanje", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2004, "0101", "411", "0109", 568.0, null, "0120", "Production quantity", "Malanje", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2004, "0101", "415", "0109", 94.0, null, "0120", "Production quantity", "Zaire", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2004, "0101", "401", "0109", 17.0, null, "0120", "Production quantity", "Cabinda", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2003, "0101", "412", "0109", 145.0, null, "0120", "Production quantity", "Moxico", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2003, "0101", "404", "0109", 110.0, null, "0120", "Production quantity", "Cunene", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2003, "0101", "405", "0109", 2600.0, null, "0120", "Production quantity", "Huambo", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2003, "0101", "399", "0109", 7171.0, null, "0120", "Production quantity", "Benguela", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2003, "0101", "403", "0109", 6805.0, null, "0120", "Production quantity", "Cuanza Sul", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2004, "0101", "404", "0109", 850.0, null, "0120", "Production quantity", "Cunene", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2004, "0101", "413", "0109", 1237.0, null, "0120", "Production quantity", "Namibe", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2004, "0101", "405", "0109", 1497.0, null, "0120", "Production quantity", "Huambo", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2004, "0101", "399", "0109", 8858.0, null, "0120", "Production quantity", "Benguela", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2004, "0101", "403", "0109", 5059.0, null, "0120", "Production quantity", "Cuanza Sul", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2004, "0101", "408", "0109", 0.0, null, "0120", "Production quantity", "Luanda", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2004, "0101", "398", "0109", 41615.0, null, "0120", "Production quantity", "Bengo", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2004, "0101", "407", "0109", 655.0, null, "0120", "Production quantity", "Kuanza Norte", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2003, "0101", "398", "0109", 11568.0, null, "0120", "Production quantity", "Bengo", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2003, "0101", "408", "0109", 0.0, null, "0120", "Production quantity", "Luanda", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2003, "0101", "411", "0109", 4970.0, null, "0120", "Production quantity", "Malanje", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2003, "0101", "407", "0109", 8079.0, null, "0120", "Production quantity", "Kuanza Norte", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "410", "0109", 56.0, null, "0120", "Production quantity", "Lunda Sul", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "409", "0109", 56.0, null, "0120", "Production quantity", "Lunda Norte", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "402", "0109", 19.0, null, "0120", "Production quantity", "Cuando Cubango", "Wood Charcoal", null, "MT or Cubic meter" ], [ 2009, "0101", "412", "0109", 56.0, null, "0120", "Production quantity", "Moxico", "Wood Charcoal", null, "MT or Cubic meter" ] ],
    "size" : 88
};