// (c) 2016 osmcz-app, https://github.com/osmcz/osmcz

var osmcz = osmcz || {};
osmcz.controls = function (map, baseLayers, overlays, controls) {
    // -- constructor --

    controls.layers = osmcz.layerSwitcher(baseLayers, overlays).addTo(map);

    controls.scale = L.control.scale({
        imperial: false
    }).addTo(map);

    controls.zoom = L.control.zoom({
        zoomInTitle: 'Přiblížit',
        zoomOutTitle: 'Oddálit'
    }).addTo(map)

    // leaflet-locate
    controls.locate = L.control.locate({
        follow: true,
        locateOptions: {maxZoom: 15},
        icon: 'glyphicon glyphicon-map-marker',
        strings: {
            title: "Zobrazit moji aktuální polohu"
        }
    }).addTo(map);

    // leaflet-search
    controls.search = new L.Control.Search({
        url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
        jsonpParam: 'json_callback',
        propertyName: 'display_name',
        propertyLoc: ['lat', 'lon'],
        circleLocation: false,
        markerLocation: true,
        autoType: false,
        autoCollapse: true,
        minLength: 2,
        zoom: 10,
        textPlaceholder: 'Hledat…'
    });
    controls.search.addTo(map);


    // leaflet-filelayer - upload GPX, KML a GeoJSON
    var style = {color: 'red', opacity: .6, fillOpacity: .5, weight: 4, clickable: false};
    L.Control.FileLayerLoad.LABEL = '<span class="glyphicon glyphicon-folder-open"></span>';
    L.Control.FileLayerLoad.TITLE = 'Načíst lokální data (GPX, KML, GeoJSON)';

    controls.fileLayerLoad = L.Control.fileLayerLoad({
        fitBounds: true,
        layerOptions: {
            style: style,
            pointToLayer: function (data, latlng) {
                return L.circleMarker(latlng, {style: style});
            }
        }
    }).addTo(map);


    // leaflet-coordinates
    controls.coordinates = L.control.coordinates({
        position: "bottomleft", //optional default "bootomright"
        decimals: 4, //optional default 4
        decimalSeperator: ".", //optional default "."
        labelTemplateLat: "Šířka/délka: {y}", //optional default "Lat: {y}"
        labelTemplateLng: "{x}", //optional default "Lng: {x}"
        enableUserInput: true, //optional default true
        useDMS: false, //optional default false
        useLatLngOrder: true, //ordering of labels, default false-> lng-lat
        markerType: L.marker, //optional default L.marker
        markerProps: {}, //optional default {},
        labelFormatterLng: function (lng) {
            var precision = OSM.zoomPrecision(map.getZoom());
            return lng.toFixed(precision) + "°";
        },
        labelFormatterLat: function (lat) {
            var precision = OSM.zoomPrecision(map.getZoom());
            return lat.toFixed(precision) + "°, ";
        }
        //customLabelFcn: function (latLonObj, opts) {
        //    return "Geohash: " + encodeGeoHash(latLonObj.lat, latLonObj.lng);
        //}
    }).addTo(map);

};
