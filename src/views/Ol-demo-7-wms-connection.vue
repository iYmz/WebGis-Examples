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
export default {
    name: "OlMapDemoMarkFeatureStyle",
    components: {},
    data() {
        return {};
    },
    mounted() {
  
        var pureCoverage = false;
      // if this is just a coverage or a group of them, disable a few items,
      // and default to jpeg format
      var format = 'image/png';
      var bounds = [-124.73142200000001, 24.955967,
                    -66.969849, 49.371735];
      if (pureCoverage) {
        document.getElementById('antialiasSelector').disabled = true;
        document.getElementById('jpeg').selected = true;
        format = "image/jpeg";
      }
 
      var untiled = new olLayer.Image({
        source: new olSource.ImageWMS({
          ratio: 1,
          url: 'http://localhost:8080/geoserver/wfs_workspace/wms',
          params: {'FORMAT': format,
                   'VERSION': '1.1.1',  
                "STYLES": '',
                "LAYERS": 'wfs_workspace:wfs_states',
                "exceptions": 'application/vnd.ogc.se_inimage',
          }
        })
      });
      var tiled = new olLayer.Tile({
        visible: false,
        source: new olSource.TileWMS({
          url: 'http://localhost:8080/geoserver/wfs_workspace/wms',
          params: {'FORMAT': format, 
                   'VERSION': '1.1.1',
                   tiled: true,
                "STYLES": '',
                "LAYERS": 'wfs_workspace:wfs_states',
                "exceptions": 'application/vnd.ogc.se_inimage',
             tilesOrigin: -124.73142200000001 + "," + 24.955967
          }
        })
      });
      var projection = new olProj.Projection({
          code: 'EPSG:4326',
          units: 'degrees',
          axisOrientation: 'neu',
          global: true
      });
      var map = new Map({
        target: 'map',
        layers: [
          untiled,
          tiled
        ],
        view: new View({
            
    center: [-95, 40],
            projection: 'EPSG:4326',
            // center: [-40,0],
            zoom: 4,
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
    background: rgb(255, 203, 203);
}
</style>
  