<template>
    <div id="map"></div>
    <div>
        <input id="getWfs" type="button" value="查询" onclick="queryWfs();" />
        <input id="select" type="checkbox" value="select" />选择
        <input id="modify" type="checkbox" value="modify" />编辑
        <input id="save" type="button" value="保存" onclick="onSave();" />
    </div>
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

        var wfsVectorLayer = null;
        var modifiedFeatures = null;

        // 选择器
        var selectInteraction = new olInteraction.Select({
            style: new olStyle.Style({
                stroke: new olStyle.Stroke({
                    color: 'red',
                    width: 2
                })
            })
        });

        // 修改器
        var modifyInteraction = new olInteraction.Modify({
            style: new olStyle.Style({
                stroke: new olStyle.Stroke({
                    color: 'red',
                    width: 5
                })
            }),
            features: selectInteraction.getFeatures()
        });
        modifyInteraction.on('modifyend', function (e) {
            // 把修改完成的feature暂存起来
            
            console.log(e.features);
            modifiedFeatures = e.features;
        });

        var map = new Map({
            layers: [new olLayer.Tile({
                source: new olSource.OSM()
            })],
            target: 'map',
            view: new View({
                center: [147, -42],
                // maxZoom: 19,
                zoom: 8,
                projection: 'EPSG:4326'
            })
        });

        // 通过wfs查询所有的要素
        document.getElementById('getWfs').onclick = function queryWfs() {
            // 支持重新查询
            if (wfsVectorLayer) {
                map.removeLayer(wfsVectorLayer);
            }

            // 创建新的图层来加载wfs的要素
            wfsVectorLayer = new olLayer.Vector({
                source: new olSource.Vector({
                    format: new olFormat.GeoJSON({
                        geometryName: 'the_geom' // 因为数据源里面字段the_geom存储的是geometry，所以需要指定
                    }),
                    // url: 'http://localhost:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=nyc_roads:nyc_roads&outputFormat=application/json&srsname=EPSG:4326'
                    url: 'http://localhost:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=topp:tasmania_roads&outputFormat=application/json&srsname=EPSG:4326'

                }),
                style: function (feature, resolution) {
                    return new olStyle.Style({
                        stroke: new olStyle.Stroke({
                            color: 'blue',
                            width: 5
                        })
                    });
                }
            });
            map.addLayer(wfsVectorLayer);
        }

        $('#select').change(function () {
            if (this.checked) {
                // 勾选选择复选框时，添加选择器到地图
                map.removeInteraction(selectInteraction);
                map.addInteraction(selectInteraction);
            } else {
                // 不勾选选择复选框的情况下，移出选择器和修改器
                map.removeInteraction(selectInteraction);
                document.getElementById('modify').checked = false;
                map.removeInteraction(modifyInteraction);
                modifiedFeatures = null;
            }
        });

        $('#modify').change(function () {
            if (this.checked) {
                // 勾选修改复选框时，添加选择器和修改器到地图
                document.getElementById('select').checked = true;
                map.removeInteraction(modifyInteraction);
                map.addInteraction(modifyInteraction);
                map.removeInteraction(selectInteraction);
                map.addInteraction(selectInteraction);
            } else {
                // 不勾选修改复选框时，移出修改器
                map.removeInteraction(modifyInteraction);
                modifiedFeatures = null;
            }
        });

        // 保存已经编辑的要素
        document.getElementById('save').onclick = function onSave() {
            if (modifiedFeatures && modifiedFeatures.getLength() > 0) {
                // 转换坐标
            console.log(modifiedFeature);
                var modifiedFeature = modifiedFeatures.item(0).clone();
                // 注意ID是必须，通过ID才能找到对应修改的feature
                modifiedFeature.setId(modifiedFeatures.item(0).getId());
                // 调换经纬度坐标，以符合wfs协议中经纬度的位置
                modifiedFeature.getGeometry().applyTransform(function (flatCoordinates, flatCoordinates2, stride) {
                    for (var j = 0; j < flatCoordinates.length; j += stride) {
                        var y = flatCoordinates[j];
                        var x = flatCoordinates[j + 1];
                        flatCoordinates[j] = x;
                        flatCoordinates[j + 1] = y;
                    }
                });
                modifyWfs([modifiedFeature]);
            }
        }

        // 把修改提交到服务器端
        function modifyWfs(features) {
            var WFSTSerializer = new olFormat.WFS();
            var featObject = WFSTSerializer.writeTransaction(null,
                features, null, {
                featureType: 'tasmania_roads',
                featureNS: 'http://www.openplans.org/topp',  // 注意这个值必须为创建工作区时的命名空间URI
                // fretureNS: 'http://localhost:8080/sql',    //namespace for features,用localhost不能成功发送xml
                srsName: 'EPSG:4326'
                //
                // version defaults to 1.1.0
            });
            // 转换为xml内容发送到服务器端
            var serializer = new XMLSerializer();
            var featString = serializer.serializeToString(featObject);
            var request = new XMLHttpRequest();
            
            request.open('POST', 'http://localhost:8080/geoserver/wfs?service=wfs');
            // 指定内容为xml类型
            request.setRequestHeader('Content-Type', 'text/xml');
            request.send(featString);
        }

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

        // map.addLayer(vector);

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
  