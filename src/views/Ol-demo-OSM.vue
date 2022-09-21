<template>
    <div id="map"></div>
</template>
<script>
import { Map, View } from 'ol';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';

import OSM from 'ol/source/OSM';
export default {
    name: "OlMapDemoOSM",
    components: {},
    data() {
        return {
            openMap: null,
        };
    },
    mounted() {
        
        this.openMap = new Map({
                target: "map",
                layers: [
                    new TileLayer({
                        source: new OSM
                        }),
                    
                ],
                view: new View({
                    center: [0,0],
                    zoom: 1,
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
  