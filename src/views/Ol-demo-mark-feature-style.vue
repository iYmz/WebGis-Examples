<template>
    <div id="map"></div>

    <div>
        <span id="zoom">zoom</span>
        <span id="resolution">resolution</span>
    </div>
</template>
  
  
<style type="text/css">
#anchor {
    cursor: pointer;
}
</style>
<script>

import { Map, View } from "ol";
import * as olProj from "ol/proj";
import olLayerTile from "ol/layer/Tile";
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
export default {
    name: "OlMapDemoMarkFeatureStyle",
    components: {},
    data() {
        return {};
    },
    mounted() {
        var layerMarks = new olLayerVector({
            source: new olSourceVector()
        });
        var osmSource = new olSource.OSM();
        var osmLayer = new olLayerTile({
            source: osmSource,
        });
        var view = new View({
            center: [0, 0],
            zoom: 1,
        });
        var target = "map";

        var map = new Map({
            target: target,
            layers: [osmLayer, layerMarks],
            view: view,
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


        /**----------------------------------------------------------------------------------- */

        var anchor = new olFeature({
            geometry: new olGeom.Point([104, 30])
        });
        // 设置样式，在样式中就可以设置图标
        anchor.setStyle(new olStyle.Style({
            image: new olStyle.Icon({
                src: '../src/assets/anchor.png'
            })
        }));
        // 添加到之前的创建的layer中去
        layerMarks.getSource().addFeature(anchor);
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
  