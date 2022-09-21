<template>
    <div id="map"></div>

    <div>
        <span id="zoom">zoom</span>
        <span id="resolution">resolution</span>
        <span>墨卡托坐标系单位：米，WGS84单位是度</span>
    </div>
</template>
  
  
<style type="text/css">
#anchor {
    cursor: pointer;
}
</style>
<script >

import { Map, View } from "ol";
import * as olProj from "ol/proj";
import * as olLayer from "ol/layer";
import olLayerImage from "ol/layer/Image"
import olSourceVector from "ol/source/Vector";
import olLayerVector from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import olFeature from "ol/Feature";
import * as olGeom from "ol/geom";
import * as olStyle from "ol/style";
import * as olSource from "ol/source";
import olOverlay from "ol/Overlay";
import VectorSource from 'ol/source/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorLayer from 'ol/layer/Vector';
import * as olFormat from 'ol/format';
import TileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';
import * as ol from 'ol/'
export default {
    name: "OlMapDemoMarkFeatureStyle",
    components: {},
    data() {
        return {};
    },
    mounted() { 

        var vector = new olLayerVector({
            source: new olSourceVector({
                format: new olFormat.GeoJSON(),
                //http://localhost:8080/geoserver/nyc_roads/wms?service=WMS&version=1.1.0&request=GetFeature&typeNames=nyc_roads:Anyc_roads&srs=EPSG:4326&styles=&format=application/json
                // url: 'http://localhost:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=wfs_workspace:wfs_states&outputFormat=application/json'
                url: 'http://localhost:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=nyc_roads:nyc_roads&outputFormat=application/json&srsname=EPSG:4326'
            }),

            style: function (feature, resolution) {
                return new olStyle.Style({
                    stroke: new olStyle.Stroke({
                        color: 'red',
                        width: 1
                    })
                });
            }
        });
        console.log(vector.getSource().getFeatures())
        var map = new Map({
            layers: [new olLayer.Tile({
                source: new olSource.OSM()
            }),
                ],
            target: 'map',
            view: new View({
                center: [-73.99710639567148, 40.742270050255556],
                maxZoom: 19,
                zoom: 12,
                projection: 'EPSG:4326'
            })
        });

        map.getView().on("change:resolution", function () {
            document.getElementById("zoom").innerHTML =
                "Zoom Level:[" + map.getView().getZoom() + "], ";
            document.getElementById("resolution").innerHTML =
                "Map Resolution:[" + map.getView().getResolution() + "].";
        });

        document.getElementById("zoom").innerHTML =
            "Zoom Level:[" + map.getView().getZoom() + "], ";
        document.getElementById("resolution").innerHTML =
            "Map Resolution:[" + map.getView().getResolution() + "].";

        map.addLayer(vector);

    },
    methods: {},
};
</script>
<style>
#map {
    height: 512px;
    width: 512px;
    display: flex;
    align-items: center;
}
</style>
  