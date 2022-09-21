<template>
    <div id="map"></div>
</template>
<script>
import { Map, View } from 'ol';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import * as olSource from 'ol/source';
import OSM from 'ol/source/OSM';
export default {
    name: "OlDemoMapDebug",
    components: {},
    data() {
        return {
            openMap: null,
        };
    },
    mounted() {
        var omSource = new OSM();
        this.openMap = new Map({
                target: "map",
                layers: [
                    new TileLayer({
                        source: omSource,
                        }),
                    
                    new TileLayer({
                        source: new olSource.TileDebug({
                            projection: 'EPSG:3857',
                            tiledGrid: omSource.getTileGrid(),
                        })
                    }
                )],
                view: new View({
                    center: olProj.transform([104,30],'EPSG:4326', 'EPSG:3857'),
                    zoom: 10,
                })
            });
    },
    methods: {
        
    },
};



</script>
<style>
@media (min-width: 1024px) {
    #map {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>
  