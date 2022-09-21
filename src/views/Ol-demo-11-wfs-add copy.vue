<template>
    <div id="map"></div>
    <div>
        <input id="getNew" type="button" value="查询" onclick="queryWfs();" />
        <input id="add" type="checkbox" value="add" />新增
        <input id="saveNew" type="button" value="保存" onclick="onSaveNew();" />
    </div>
    <div>
        <span id="zoom">zoom</span>
        <span id="resolution">resolution</span>
        <span>墨卡托坐标系单位：米，WGS84单位是度</span>
    </div>
</template>
 
  

<script >
import $ from 'jquery';
import { Map, View } from "ol";
import * as olProj from "ol/proj";
import * as olLayer from "ol/layer";
import olLayerImage from "ol/layer/Image";
import olLayerVector from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import olFeature from "ol/Feature";
import * as olGeom from "ol/geom";
import * as olStyle from "ol/style";
import * as olSource from "ol/source";
import * as olFormat from 'ol/format';
import * as olInteraction from 'ol/interaction';
export default {
    name: "OlMapDemoAddFeature",
    components: {},
    data() {
        return {};
    },
    mounted() {





        var map = new Map({
            layers: [
                new olLayer.Tile({
                    source: new olSource.OSM()
                }), drawLayer
            ],
            view: new View({
                center: [147, -42],
                zoom: 8,
                projection: 'EPSG:4326'
            })
        });

       

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
  