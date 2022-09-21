
<template>
  <div id="map"></div>
  <div id="anchor">
    <img src="../assets/img/anchor/anchor.png" alt="示例锚点" />
  </div>
  
    <span id="zoom">zoom</span>
    <span id="resolution">resolution</span>

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
import olSourceVector from "ol/source/Vector";
import olLayerVector from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import olFeature from "ol/Feature";
import * as olGeom from "ol/geom";
import * as olStyle from "ol/style";
import * as olSource from "ol/source";
import olOverlay from "ol/Overlay";
export default {
  name: "OlMapDemoMarkDiv",
  components: {},
  data() {
    return {};
  },
  mounted() {
    var osmSource = new olSource.OSM();
    var osmLayer = new olLayerTile({
      source: osmSource,
    });
    var view = new View({
      center: [0, 0],
      zoom: 1,
    });
    var target = "map";

    const map = new Map({
      target: target,
      layers: [osmLayer],
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

    //设置到地图上的 东经0°，北纬0°；

    var anchor = new olOverlay({
      element: document.getElementById('anchor')
    });


    //设置到地图上的 东经0°，北纬0°；
    anchor.setPosition([0, 0]);
    map.addOverlay(anchor);

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
