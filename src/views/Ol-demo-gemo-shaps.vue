<template>
    <div id="map"></div>
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
export default {
    name: "OlMapDemoDrawGeom",
    components: {},
    data() {
        return {
            openMap: null,
        };
    },
    mounted() {

        var osmLayer = new olLayerTile({
            source: new OSM()
        });

        var pointLayer = new olLayerVector({
            source: new olSourceVector()
        });
        
        var circleLayer = new olLayerVector({
            source: new olSourceVector()
        });

        var openMap = new Map({
            target: "map",
            layers: [osmLayer, pointLayer, circleLayer],
            view: new View({
                center: [0, 0],
                zoom: 1,
            })
        });
         // 添加点
  var point = new olFeature({
      geometry: new olGeom.Point([0, 0])
  });
  point.setStyle(new olStyle.Style({
      image: new olStyle.Circle({
          radius: 1,
          fill: new olStyle.Fill({
              color: 'red'
          }),
          stroke: new olStyle.Stroke({
              color: 'red',
              size: 1
          })
      })
  }));
  pointLayer.getSource().addFeature(point);


  // 添加圆
  var circle = new olFeature({
      geometry: new olGeom.Point([0, 0])
  });
  circle.setStyle(new olStyle.Style({
      image: new olStyle.Circle({
          radius: 10,
          stroke: new olStyle.Stroke({
              color: 'blue',
              size: 1
          })
      })
  }));
  circleLayer.getSource().addFeature(circle);
  console.log(pointLayer.getFeatures());

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
  