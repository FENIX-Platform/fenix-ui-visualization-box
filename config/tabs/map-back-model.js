define(function() {

    'use strict';

    return [
  {
          "Name": "abacaarea_3857",
          "Title": "abacaarea_3857",
          "Abstract": "",
          "KeywordList": [
            "WCS",
            "GeoTIFF",
            "abacaarea_3857"
          ],
          "SRS": [
            "EPSG:3857"
          ],
          "LatLonBoundingBox": [
            -180.00000000000003,
            -85.81552819353568,
            179.95503414565607,
            85.81395348836212
          ],
          "BoundingBox": [
            {
              "crs": "EPSG:3857",
              "extent": [
                -20037508.342789248,
                -21108757.183934048,
                20032502.766780593,
                21106355.272253364
              ],
              "res": [
                null,
                null
              ]
            }
          ],
          "Style": [
            {
              "Name": "earthstat_crop_area_EN",
              "Title": "Rain distribution",
              "Abstract": "",
              "LegendURL": [
                {
                  "Format": "image/png",
                  "OnlineResource": "http://fenix.fao.org:20200/geoserver/earthstat/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=abacaarea_3857",
                  "size": [
                    20,
                    20
                  ]
                }
              ]
            }
          ],
          "queryable": true,
          "opaque": false,
          "noSubsets": false
        },
        {
          "Name": "agave_area_3857",
          "Title": "agave_area_3857",
          "Abstract": "",
          "KeywordList": [
            "WCS",
            "GeoTIFF",
            "agave_area_3857"
          ],
          "SRS": [
            "EPSG:3857"
          ],
          "LatLonBoundingBox": [
            -180.00000000000003,
            -85.81552819353568,
            179.95503414565607,
            85.81395348836212
          ],
          "BoundingBox": [
            {
              "crs": "EPSG:3857",
              "extent": [
                -20037508.342789248,
                -21108757.183934048,
                20032502.766780593,
                21106355.272253364
              ],
              "res": [
                null,
                null
              ]
            }
          ],
          "Style": [
            {
              "Name": "earthstat_crop_area_EN",
              "Title": "Rain distribution",
              "Abstract": "",
              "LegendURL": [
                {
                  "Format": "image/png",
                  "OnlineResource": "http://fenix.fao.org:20200/geoserver/earthstat/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=agave_area_3857",
                  "size": [
                    20,
                    20
                  ]
                }
              ]
            }
          ],
          "queryable": true,
          "opaque": false,
          "noSubsets": false
        },
        {
          "Name": "alfalfa_area_3857",
          "Title": "alfalfa_area_3857",
          "Abstract": "",
          "KeywordList": [
            "WCS",
            "GeoTIFF",
            "alfalfa_area_3857"
          ],
          "SRS": [
            "EPSG:3857"
          ],
          "LatLonBoundingBox": [
            -180.00000000000003,
            -85.81552819353568,
            179.95503414565607,
            85.81395348836212
          ],
          "BoundingBox": [
            {
              "crs": "EPSG:3857",
              "extent": [
                -20037508.342789248,
                -21108757.183934048,
                20032502.766780593,
                21106355.272253364
              ],
              "res": [
                null,
                null
              ]
            }
          ],
          "Style": [
            {
              "Name": "earthstat_crop_area_EN",
              "Title": "Rain distribution",
              "Abstract": "",
              "LegendURL": [
                {
                  "Format": "image/png",
                  "OnlineResource": "http://fenix.fao.org:20200/geoserver/earthstat/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=alfalfa_area_3857",
                  "size": [
                    20,
                    20
                  ]
                }
              ]
            }
          ],
          "queryable": true,
          "opaque": false,
          "noSubsets": false
        }
	];
});