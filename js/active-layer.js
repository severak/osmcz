/*
 active layer for osmcz
 Javascript code for openstreetmap.cz website
 Copyright (C) 2015,2016

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

and

 (c) 2016 osmcz-app, https://github.com/osmcz/osmcz

 */

var osmcz = osmcz || {};
osmcz.activeLayer = function(map, baseLayers, overlays, controls) {
    // -- constructor --

    var layersControl = controls.layers;
    var xhr;
    var activeMarkers = L.markerClusterGroup({code: 'A'});

    var active_icon = L.icon({
      icon: "glyphicon glyphicon-asterisk"
    });

    var layer_activeMarkers = new L.GeoJSON(null, {
        onEachFeature: function (feature, layer) {

            console.log("layer_activeMarkers");
            var html_content = "<table>";

            for (var k in feature.properties) {
                var v = String(feature.properties[k]);
                popupContent += "<tr><td>" + k + "</td><td>" + v + "</td></tr>" ;
            }
            html_content += "</table>";

            layer.setIcon(active_icon);
            layer.bindPopup(html_content);
        }
    });


    map.on('layeradd', function(event) {
        if(event.layer == activeMarkers) {
            load_data()
        }
    });

    map.on('moveend', load_data);
    map.on('drag', function (e) {
        if (!isLayerChosen())
            return;

//         console.log(map.hasLayer(activeMarkers));

        if (typeof xhr !== 'undefined') {
            xhr.abort();
        }
    });
    map.on('movestart', function (e) {
        if (!isLayerChosen())
            return;

        if (typeof xhr !== 'undefined') {
            xhr.abort();
        }
    });

    /* Add overlay to the map */
    layersControl.addOverlay(activeMarkers, "Aktivní vrstva");

    /* Add overlay to the overlays list as well
     * This allows restoration of overlay state on load */
    overlays["Aktivní vrstva"] = activeMarkers;


    // -- methods --

    // Convert to tile coors
    function getTileURL(url, lat, lon, zoom) {
        var xtile = parseInt(Math.floor( (lon + 180) / 360 * (1<<zoom) ));
        var ytile = parseInt(Math.floor( (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * (1<<zoom) ));
        return url + "/" + zoom + "/" + xtile + "/" + ytile;
    }

    function isLayerChosen() {
        return map.hasLayer(activeMarkers);
    }

    function load_data() {
        if (!isLayerChosen())
            return;

        if (typeof xhr !== 'undefined') {
            xhr.abort();
        }

        if (map.getZoom() > 15) {

            var geoJsonUrl = 'http://tile.poloha.net/json';

            // TODO: Get bounds, split to tiles and download json files for all tiles

            // Demo - only center tile ;-)
            console.log("Lat: " + map.getCenter().lat + " / Lon: " + map.getCenter().lng);
            oneTileUrl = getTileURL(geoJsonUrl, map.getCenter().lat, map.getCenter().lng, map.getZoom());

            xhr = $.ajax({
                url: oneTileUrl,
                success: retrieve_geojson,
                error: error_gj
            });

        } else {
            layer_activeMarkers.clearLayers();
        }
    }

    function retrieve_geojson(data) {
        activeMarkers.clearLayers();
        layer_activeMarkers.clearLayers();
        layer_activeMarkers.addData(JSON.parse(data));
        activeMarkers.addLayer(layer_activeMarkers);
        map.addLayer(activeMarkers);
    }

    function error_gj(data) {
        console.log(data);
    }
};

