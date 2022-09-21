<template>
    <div id="map"></div>
    <div>
        <span id="zoom">zoom</span>
        <span id="resolution">resolution</span>
    </div>
</template>
<script>
import { Map, View } from 'ol';
import * as olProj from 'ol/proj';
import olLayerTile from 'ol/layer/Tile';
import olSourceVector from 'ol/source/Vector';
import olLayerVector from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import olFeature from 'ol/Feature';
import * as olGeom from 'ol/geom';
import * as olStyle from 'ol/style'
import * as olSource from 'ol/source';
export default {
    name: "OlMapDemoDrawGeom",
    components: {},
    data() {
        return {
        };
    },
    mounted() {
        var osmSource = new olSource.OSM();
        var osmLayer = new olLayerTile({
            source: osmSource,
        });
        var view = new View({
            center: [0,0],
            zoom:1
        });
        var target = 'map'

        const map = new Map({
            target: target,
            layers: [osmLayer],
            view: view
        });

        map.getView().on('change:resolution', function () {
        document.getElementById('zoom').innerHTML = "Zoom Level:["+map.getView().getZoom()+"], ";
        document.getElementById('resolution').innerHTML = "Map Resolution:[" + map.getView().getResolution()+"].";        
        });
       
       
        document.getElementById('zoom').innerHTML = "Zoom Level:["+map.getView().getZoom()+"], ";
        document.getElementById('resolution').innerHTML = "Map Resolution:[" + map.getView().getResolution()+"].";        
            
        // document.getElementById('zoom').innerHTML = map.getView().getZoom()+",";
    },
    methods: {




    },
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
  