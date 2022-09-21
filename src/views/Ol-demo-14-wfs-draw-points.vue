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
            <form>
                <label for="type">Geometry type &nbsp;</label>
                <select id="type">
                    <option value="Point">Point</option>
                    <option value="LineString">LineString</option>
                    <option value="Polygon">Polygon</option>
                    <option value="Circle">Circle</option>
                </select>

                <input id="savePoints" type="button" value="保存点" onclick="onSavePoints();" />
            </form>
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
        var lineDash = null;

        var colorPicker = document.getElementById('colorPicker');
        var widthPicker = document.getElementById('widthPicker');

        colorPicker.onchange = function () {
            console.log(this.value);
        }
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
                        color: 'black',
                        width: 5
                    })
                });
            }
        });
        const pointsSource = new olSource.Vector({
            format: new olFormat.GeoJSON({
                geometryName: 'the_geom'
            }),
            url: 'http://localhost:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=sql:points_test&outputFormat=application/json&srsname=EPSG:4326'

        });
        const pointsVector = new olLayerVector({
            source: pointsSource,
            style: {
                'fill-color': 'rgba(255, 255, 255, 0.2)',
                'stroke-color': '#ffcc33',
                'stroke-width': 2,
                'circle-radius': 7,
                'circle-fill-color': '#ffcc33',
            },
        });

        var map = new Map({
            layers: [new olLayer.Tile({
                source: new olSource.OSM()
            }),
                wfsVectorLayer,
                pointsVector
            ],
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
                            color: 'black',
                            width: 5
                        })
                    });
                }
            });
            map.addLayer(wfsVectorLayer);
        }

        colorPicker.onchange = function () {
            if (wfsVectorLayer === null) {
                return;
            }
            console.log(this.value);
            var newStyle = new olStyle.Style({
                stroke: new olStyle.Stroke({
                    color: this.value,
                    width: widthPicker.value,
                    lineCap: 'butt',
                    lineJoin: 'round',
                    lineDash: lineDash
                })
            });
            wfsVectorLayer.setStyle(newStyle);
        };
        widthPicker.onchange = function () {
            if (wfsVectorLayer === null) {
                return;
            }
            console.log(this.value);
            var newStyle = new olStyle.Style({
                stroke: new olStyle.Stroke({
                    color: colorPicker.value,
                    width: this.value,
                    lineCap: 'butt',
                    lineJoin: 'round',
                    lineDash: lineDash
                }),
                //  lineDash的值是一个数组类型，这个值是绘制的虚线重复的最小单位；开始画重点
                // （1）数组中元素个数是奇数的话，数组会默认把组内元素复制一份。
                // （2）数组中下标是奇数的元素是虚线小段的尺寸，下标是偶数的元素则是虚线小段之间的间距
                // 下边举例说明：
                // “lineDash:[6]” === “lineDash:[6,6]” //释义第一个"6"是虚线小段的长度，第二个"6"是虚线的间隔
                // “lineDash:[1,2,3,4]” // 释义 "1"是第一段虚线长度，"2"紧跟着的间隔，"3"是第二段虚线的长度，"4"是第二段虚线后边的间隔
                // 再说一下lineDashOffset：
                // lineDashOffset就是虚线的偏移，注意整体虚线位置不偏移，偏移的是虚线小段的位置，但是间隔不变，这么说吧，就是设置了这个属性，有可能第一个虚线小段就看不见了或者不是在开始位置，默认是是0。

            });
            wfsVectorLayer.setStyle(newStyle);
        };
        document.getElementById('lineDashPicker').onchange = function () {
            console.log('line dash value:' + this.value);
            if (wfsVectorLayer === null) {
                return;
            }
            if (this.value > 0) {
                lineDash = [this.value, this.value];
                console.log('line dash array:' + lineDash);
                var newStyle = new olStyle.Style({
                    stroke: new olStyle.Stroke({
                        color: colorPicker.value,
                        width: widthPicker.value,
                        lineCap: 'butt',
                        lineJoin: 'round',
                        lineDash: lineDash
                    }),
                    //  lineDash的值是一个数组类型，这个值是绘制的虚线重复的最小单位；开始画重点
                    // （1）数组中元素个数是奇数的话，数组会默认把组内元素复制一份。
                    // （2）数组中下标是奇数的元素是虚线小段的尺寸，下标是偶数的元素则是虚线小段之间的间距
                    // 下边举例说明：
                    // “lineDash:[6]” === “lineDash:[6,6]” //释义第一个"6"是虚线小段的长度，第二个"6"是虚线的间隔
                    // “lineDash:[1,2,3,4]” // 释义 "1"是第一段虚线长度，"2"紧跟着的间隔，"3"是第二段虚线的长度，"4"是第二段虚线后边的间隔
                    // 再说一下lineDashOffset：
                    // lineDashOffset就是虚线的偏移，注意整体虚线位置不偏移，偏移的是虚线小段的位置，但是间隔不变，这么说吧，就是设置了这个属性，有可能第一个虚线小段就看不见了或者不是在开始位置，默认是是0。

                })
            }
            else {
                lineDash = null;
                var newStyle = new olStyle.Style({
                    stroke: new olStyle.Stroke({
                        color: colorPicker.value,
                        width: widthPicker.value,
                        lineCap: 'butt',
                        lineJoin: 'round',
                        lineDash: null
                    }),
                    //  lineDash的值是一个数组类型，这个值是绘制的虚线重复的最小单位；开始画重点
                    // （1）数组中元素个数是奇数的话，数组会默认把组内元素复制一份。
                    // （2）数组中下标是奇数的元素是虚线小段的尺寸，下标是偶数的元素则是虚线小段之间的间距
                    // 下边举例说明：
                    // “lineDash:[6]” === “lineDash:[6,6]” //释义第一个"6"是虚线小段的长度，第二个"6"是虚线的间隔
                    // “lineDash:[1,2,3,4]” // 释义 "1"是第一段虚线长度，"2"紧跟着的间隔，"3"是第二段虚线的长度，"4"是第二段虚线后边的间隔
                    // 再说一下lineDashOffset：
                    // lineDashOffset就是虚线的偏移，注意整体虚线位置不偏移，偏移的是虚线小段的位置，但是间隔不变，这么说吧，就是设置了这个属性，有可能第一个虚线小段就看不见了或者不是在开始位置，默认是是0。

                });
            }

            wfsVectorLayer.setStyle(newStyle);
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
            console.log(featString);
            var request = new XMLHttpRequest();

            request.open('POST', 'http://localhost:8080/geoserver/wfs?service=wfs');
            // 指定内容为xml类型
            request.setRequestHeader('Content-Type', 'text/xml');
            request.send(featString.substring(0, featString.length - 1));
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

        var draw, snap; // global so we can remove them later
        const typeSelect = document.getElementById('type');



        draw = new olInteraction.Draw({
            source: pointsSource,
            type: typeSelect.value,
        });
        map.addInteraction(draw);
        snap = new olInteraction.Snap({ source: pointsSource });
        map.addInteraction(snap);
        var drawedFeatures;
        draw.on('drawend', function (e) {
            drawedFeatures = e.feature.getGeometry().clone();
            console.log("Geom Name :" + e.feature.getGeometryName());
            console.log("长度" + drawedFeatures);
            console.log("e:" + e.feature.getGeometry().getCoordinates());
            console.log('saving points:' + drawedFeatures);
            var newFeature = new olFeature();
            newFeature.setId(4);
            newFeature.setGeometryName('the_geom');
            newFeature.set('point_name', 'p2');
            console.log('drawedFeature.getCoordinates()' + drawedFeatures.getCoordinates()[0]);
            
            //交换经纬度的位置，不然后续geoserver中经纬度是不对的
            drawedFeatures.applyTransform(function (coor){
                var tmp = coor[0];
                coor[0] = coor[1];
                coor[1] = tmp;
            });
            console.log("交换后的坐标"+ drawedFeatures.getCoordinates());
            
            
            // var coord = [draw]
            var coordinateOfPoint = new olGeom.Point(drawedFeatures.getCoordinates());
            console.log(coordinateOfPoint);
            newFeature.setGeometry(coordinateOfPoint);
            console.log(newFeature);
            console.log(newFeature.getGeometry());
            modifyWfsPoints([newFeature]);
        });

        // 保存已经编辑的Points
        // document.getElementById('savePoints').onclick = function onSave() {
        //     console.log('saving points:' + drawedFeatures);
        //     var newFeature = new olFeature();
        //     newFeature.setId(4);
        //     newFeature.setGeometryName('the_geom');
        //     newFeature.set('point_name', 'p2');
        //     console.log('drawedFeature.getCoordinates()' + drawedFeatures.getCoordinates()[0]);
            
        //     //交换经纬度的位置，不然后续geoserver中经纬度是不对的
        //     drawedFeatures.applyTransform(function (coor){
        //         var tmp = coor[0];
        //         coor[0] = coor[1];
        //         coor[1] = tmp;
        //     });
        //     console.log("交换后的坐标"+ drawedFeatures.getCoordinates());
            
            
        //     // var coord = [draw]
        //     var coordinateOfPoint = new olGeom.Point(drawedFeatures.getCoordinates());
        //     console.log(coordinateOfPoint);
        //     newFeature.setGeometry(coordinateOfPoint);
        //     console.log(newFeature);
        //     console.log(newFeature.getGeometry());
        //     modifyWfsPoints([newFeature]);
        // }


        // 把修改提交到服务器端
        function modifyWfsPoints(features) {

            console.log(features[0].getGeometry());
            var WFSTSerializer = new olFormat.WFS();
            //             writeTransaction(inserts, updates, deletes, options){Node}
            // format/WFS.js, line 589
            // Encode format as WFS Transaction and return the Node.

            // Name	Type	Description
            // inserts	Array<Feature>	
            // The features to insert.

            // updates	Array<Feature>	
            // The features to update.

            // deletes	Array<Feature>	
            // The features to delete.

            // options	
            // Write options.
            var featObject = WFSTSerializer.writeTransaction(features, null,
                null, {
                featureType: 'points_test',
                featureNS: 'http://geoserver.org/sql',  // 注意这个值必须为创建工作区时的命名空间URI
                // fretureNS: 'http://localhost:8080/sql',    //namespace for features,用localhost不能成功发送xml
                srsName: 'EPSG:4326'
                //
                // version defaults to 1.1.0
            });
            console.log(featObject.textContent);
            // 转换为xml内容发送到服务器端
            var serializer = new XMLSerializer();
            console.log('发送的xml');
            console.log(serializer.serializeToString);
            var featString = serializer.serializeToString(featObject);
            var request = new XMLHttpRequest();

            request.open('POST', 'http://localhost:8080/geoserver/wfs?service=wfs');
            // 指定内容为xml类型
            request.setRequestHeader('Content-Type', 'text/xml');
            request.send(featString);
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
  