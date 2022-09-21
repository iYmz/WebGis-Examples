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

        var wfsVectorLayer = null;
        var newId = 1;
        var drawedFeature = null;
        var drawLayer = new olLayer.Vector({
            source: new olSource.Vector(),
            style: new olStyle.Style({
                stroke: new olStyle.Stroke({
                    color: 'blue',
                    width: 3
                })
            })
        });

        var drawInteraction = new olInteraction.Draw({
            type: 'LineString',
            style: new olStyle.Style({
                stroke: new olStyle.Stroke({
                    color: 'red',
                    width: 3
                })
            }),
            source: drawLayer.getSource()

        });

        drawInteraction.on('drawend', function (e) {
            //暂存绘制完的feature
            drawedFeature = e.feature;
        });



        var map = new Map({
            target: 'map',
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

        // 通过wfs查询所有的要素
        function queryWfs() {
            // 支持重新查询
            console.log("query")
            if (wfsVectorLayer) {
                map.removeLayer(wfsVectorLayer);
            }
            
            console.log("create query")
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
                            width: 3
                        })
                    });
                }
            });
            map.addLayer(wfsVectorLayer);
        }

        document.getElementById('getNew').onclick = queryWfs;
        $('#add').change(function () {
            if (this.checked) {
                console.log('checked')
                // 勾选新增复选框时，添加绘制的Interaction
                map.removeInteraction(drawInteraction);
                map.addInteraction(drawInteraction);
            } else {
                // 取消勾选新增复选框时，移出绘制的Interaction，删除已经绘制的feature
                map.removeInteraction(drawInteraction);
                if (drawedFeature) {
                    drawLayer.getSource().removeFeature(drawedFeature);
                }
                drawedFeature = null;
            }
        });


        // 保存已经编辑的要素
        document.getElementById('saveNew').onclick = function onSave() {
            var geometry = drawedFeature.getGeometry().clone();
            // 调换经纬度坐标，以符合wfs协议中经纬度的位置
            geometry.applyTransform(function (flatCoordinates, flatCoordinates2, stride) {
                for (var j = 0; j < flatCoordinates.length; j += stride) {
                    var y = flatCoordinates[j];
                    var x = flatCoordinates[j + 1];
                    flatCoordinates[j] = x;
                    flatCoordinates[j + 1] = y;
                }
            });
            var newFeature = new olFeature();
            newFeature.setId('nyc_roads.new.' + newId);
            newFeature.setGeometryName('the_geom');
            newFeature.set('the_geom', null);
            newFeature.set('name', newFeature.getId());
            newFeature.set('modified', newFeature.getId());
            newFeature.set('vsam', 0);
            newFeature.set('sourcedate', '');
            newFeature.set('sourcetype', '');
            newFeature.set('source_id', newId);
            newFeature.set('borough', '');
            newFeature.set('feat_code', 0);
            newFeature.set('feat_desc', '11');
            newFeature.set('exported', 'true');
            newFeature.setGeometry(new olGeom.MultiLineString([geometry.getCoordinates()]));
            addWfs([newFeature]);

            newId++;

            setTimeout(function () {
                drawLayer.getSource().clear();
                queryWfs();
            }, 3000);

        };


        // 把修改提交到服务器端
        function addWfs(features) {
            var WFSTSerializer = new olFormat.WFS();
            var featObject = WFSTSerializer.writeTransaction(features, null
                , null, {
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
  