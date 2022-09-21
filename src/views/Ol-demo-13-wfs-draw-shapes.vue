<template>
    <div id="map"></div>
    <div>
        <input id="getWfs" type="button" value="查询" onclick="queryWfs();" />
        <input id="select" type="checkbox" value="select" />选择
        <input id="modify" type="checkbox" value="modify" />编辑
        <input id="save" type="button" value="保存" onclick="onSave();" />
        <div>
            <input id="colorPicker" type="color">
            <input id="widthPicker" type="number" value="5">粗细
            <input id="lineDashPicker" type="number" value="0">虚线
        </div>

    </div>
    <div>
        <span id="zoom">zoom</span><br>
        <span id="resolution">resolution</span>
        <span><br>墨卡托坐标系单位：米，WGS84单位是度</span>
    </div>
</template>
 
  
<style type="text/css">
#anchor {
    cursor: pointer;
}
</style>
<script >       
import Draw, {
    createBox,
    createRegularPolygon,
  } from 'ol/interaction/Draw';
  import Map from 'ol/Map';
  import Polygon from 'ol/geom/Polygon';
  import View from 'ol/View';
  import {OSM, Vector as VectorSource} from 'ol/source';
  import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
  
import $ from 'jquery';
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
// import Interaction from 'ol/interaction';
import * as olInteraction from 'ol/interaction';
// import olinteraction from 'ol/interaction';
export default {
    name: "OlMapDemoMarkFeatureStyle",
    components: {},
    data() {
        return {};
    },
    mounted() {
raster = new TileLayer({
  source: new OSM(),
});

const source = new VectorSource({wrapX: false});

const vector = new VectorLayer({
  source: source,
});

const map = new Map({
  layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [-11000000, 4600000],
    zoom: 4,
  }),
});

const typeSelect = document.getElementById('type');

let draw; // global so we can remove it later
function addInteraction() {
  let value = 'Circle';
  if (value !== 'None') {
    let geometryFunction;
    if (value === 'Square') {
      value = 'Circle';
      geometryFunction = createRegularPolygon(4);
    } else if (value === 'Box') {
      value = 'Circle';
      geometryFunction = createBox();
    } else if (value === 'Star') {
      value = 'Circle';
      geometryFunction = function (coordinates, geometry) {
        const center = coordinates[0];
        const last = coordinates[coordinates.length - 1];
        const dx = center[0] - last[0];
        const dy = center[1] - last[1];
        const radius = Math.sqrt(dx * dx + dy * dy);
        const rotation = Math.atan2(dy, dx);
        const newCoordinates = [];
        const numPoints = 12;
        for (let i = 0; i < numPoints; ++i) {
          const angle = rotation + (i * 2 * Math.PI) / numPoints;
          const fraction = i % 2 === 0 ? 1 : 0.5;

          
          const offsetX = radius * fraction * Math.cos(angle);
          const offsetY = radius * fraction * Math.sin(angle);
          newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
        }
        newCoordinates.push(newCoordinates[0].slice());
        if (!geometry) {
          geometry = new Polygon([newCoordinates]);
        } else {
          geometry.setCoordinates([newCoordinates]);
        }
        return geometry;
      };
    }
    draw = new Draw({
      source: source,
      type: value,
      geometryFunction: geometryFunction,
    });
    map.addInteraction(draw);
  }
}
 
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
  