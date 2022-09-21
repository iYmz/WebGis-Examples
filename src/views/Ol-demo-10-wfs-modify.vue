<template>
    <div id="map" ref="rootmap">
        <div
            style="position: absolute;z-index: 9999; background: ghostwhite;display: flex;align-items: center;padding: 10px;">
            <input type="checkbox" value="select" ref="select" @click="selectAction" />选择
            <input type="checkbox" value="modify" ref="modify" @click="modifyAction" style="margin-left:10px; " />编辑
            <input type="checkbox" value="add" ref="add" @click="addAction" style="margin-left:10px; " />新增
            <input type="button" value="保存" @click="saveAction" style="margin-left:10px; " />
            <input type="button" value="删除选中" @click="deleteFeature" style="margin-left:10px; " />
        </div>
    </div>
</template>

<script>
import "ol/ol.css";
import { Map, View, Feature } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector"
import { OSM, TileWMS, Vector } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Stroke } from "ol/style";
import Draw from "ol/interaction/Draw";
import { Select, Modify } from "ol/interaction";
import { WFS } from "ol/format";
import { MultiLineString } from "ol/geom";

export default {
    data() {
        return {
            map: null,
            newId: 1,
            action: [],

            wfsVectorLayer: null,
            drawLayer: null,

            selectInteraction: null,
            modifyInteraction: null,
            drawInteraction: null,

            modifiedFeatures: null,
            drewFeature: null
        };
    },
    mounted() {
        let osmLayer = new TileLayer({
            source: new OSM()
        });

        // 创建用于新绘制feature的layer
        this.drawLayer = new VectorLayer({
            source: new Vector(),
            style: new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 5
                })
            })
        });

        // 选取feature的交互类
        this.selectInteraction = new Select({
            style: new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 2
                })
            })
        });
        // 修改feature的交互类
        this.modifyInteraction = new Modify({
            style: new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 5
                })
            }),
            //这个要修改的feature是我们之前通过ol.interaction.Select选中的feature
            features: this.selectInteraction.getFeatures()
        });
        //监听修改feature
        this.modifyInteraction.on('modifyend', this.modifyEnd);

        // 绘制feature的交互类
        this.drawInteraction = new Draw({
            type: 'LineString', // 设定为线条
            style: new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 10
                })
            }),
            source: this.drawLayer.getSource()
        });
        //监听绘制feature
        this.drawInteraction.on('drawend', this.drawEnd);

        this.map = new Map({
            target: "map",
            layers: [
                osmLayer
                , this.drawLayer
            ],
            view: new View({
                center: [-73.99710639567148, 40.742270050255556],
                maxZoom: 19,
                zoom: 14,
                projection: 'EPSG:4326'
            })
        });

        this.queryWfs();

    },

    methods: {
        // 加载wfs图层
        queryWfs() {
            // 如果已经加载过了wfs图层，那我们就移除这个图层，然后重新添加
            if (this.wfsVectorLayer) {
                this.map.removeLayer(this.wfsVectorLayer);
            }

            // 创建新的图层来加载wfs的要素，即重新加载wfs矢量图层
            this.wfsVectorLayer = new VectorLayer({
                source: new Vector({
                    format: new GeoJSON({
                        geometryName: 'the_geom' // 因为数据源里面字段the_geom存储的是geometry，所以需要指定
                    }),
                    url: 'http://localhost:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=nyc_roads:nyc_roads&outputFormat=application/json&srsname=EPSG:4326'
                }),
                //使用style+feature的方式修改添加的矢量图层的feature样式
                style: function (feature, resolution) {
                    return new Style({
                        stroke: new Stroke({
                            color: 'blue',
                            width: 5
                        })
                    });
                }
            });
            this.map.addLayer(this.wfsVectorLayer);
        },
        //选择地图要素时执行的方法
        selectAction() {
            if (this.$refs["select"].checked) {
                this.$refs["add"].checked = false;
                // 勾选选择复选框时，添加选择器到地图。先移除后添加
                this.map.removeInteraction(this.selectInteraction);
                this.map.addInteraction(this.selectInteraction);
            } else {
                // 不勾选选择复选框的情况下，移出选择器和修改器
                //移除选择器
                this.map.removeInteraction(this.selectInteraction);
                //把修改的checkbox置为false
                this.$refs["modify"].checked = false;
                //移除修改选择器
                this.map.removeInteraction(this.modifyInteraction);
                //把修改features置为空
                this.modifiedFeatures = null;
            }
        },
        //修改地图要素时执行的方法
        modifyAction() {
            if (this.$refs["modify"].checked) {
                // 勾选修改复选框时，添加选择器和修改器到地图
                //把选择地图要素的checkbox置为true
                this.$refs["select"].checked = true;
                this.$refs["add"].checked = false;
                //先移除修改器
                this.map.removeInteraction(this.modifyInteraction);
                //再添加修改器
                this.map.addInteraction(this.modifyInteraction);
                //先移除选择器
                this.map.removeInteraction(this.selectInteraction);
                //再添加选择器
                this.map.addInteraction(this.selectInteraction);
            } else {
                // 不勾选修改复选框时，移出修改器
                this.map.removeInteraction(this.modifyInteraction);
                this.modifiedFeatures = null;
            }
        },
        addAction() {
            if (this.$refs["add"].checked) {
                this.$refs["select"].checked = false;
                this.$refs["modify"].checked = false;
                // 勾选新增复选框时，添加绘制的Interaction
                this.map.removeInteraction(this.drawInteraction);
                this.map.addInteraction(this.drawInteraction);
            } else {
                // 取消勾选新增复选框时，移出绘制的Interaction，删除已经绘制的feature
                this.map.removeInteraction(this.drawInteraction);
                if (this.drewFeature) {
                    this.drawLayer.getSource().removeFeature(this.drewFeature);
                }
                this.drewFeature = null;
            }
        },
        modifyEnd(e) {
            console.log(e);
            // 把修改完成的feature暂存起来
            this.modifiedFeatures = e.features;
        },
        drawEnd(e) {
            // 绘制结束时暂存绘制的feature
            this.drewFeature = e.feature;
        },
        saveAction() {
            if (this.$refs["add"].checked) {
                this.onSaveNew();
            }
            if (this.$refs["modify"].checked) {
                this.onSaveModify();
            }
        },
        deleteFeature() {
            // 删选择器选中的feature
            if (this.selectInteraction.getFeatures().getLength() > 0) {
                this.deleteWfs([this.selectInteraction.getFeatures().item(0)]);
                // 3秒后自动更新features
                setTimeout(() => {
                    this.selectInteraction.getFeatures().clear();
                    this.queryWfs();
                }, 3000);
            }
        },
        // 保存已经编辑的要素
        onSaveModify() {
            //如果修改的地图要素不为空
            console.log("save wfs....0")
            if (this.modifiedFeatures && this.modifiedFeatures.getLength() > 0) {
                // 转换坐标
                let modifiedFeature = this.modifiedFeatures.item(0).clone();
                // 注意ID是必须，通过ID才能找到对应修改的feature
                modifiedFeature.setId(this.modifiedFeatures.item(0).getId());
                // 调换经纬度坐标，以符合wfs协议中经纬度的位置
                modifiedFeature.getGeometry().applyTransform(function (flatCoordinates, flatCoordinates2, stride) {
                    for (let j = 0; j < flatCoordinates.length; j += stride) {
                        let y = flatCoordinates[j];
                        let x = flatCoordinates[j + 1];
                        flatCoordinates[j] = x;
                        flatCoordinates[j + 1] = y;
                    }
                });

                console.log("save wfs....1")
                console.log(modifiedFeature);
                //把修改提交到服务端
                this.modifyWfs([modifiedFeature]);
            }
        },
        // 把修改提交到服务器端
        modifyWfs(features) {
            console.log("save wfs....2")
            let WFSTSerializer = new WFS();
            let featObject = WFSTSerializer.writeTransaction(null,
                features, null, {
                featureType: 'nyc_roads',
                featureNS: 'http://geoserver.org/nyc_roads',  // 注意这个值必须为创建工作区时的命名空间URI
                srsName: 'EPSG:4326'      //参考坐标系
            });
            console.log("save wfs....3")
            // 转换为xml内容发送到服务器端
            let serializer = new XMLSerializer();
            let featString = serializer.serializeToString(featObject);
            let request = new XMLHttpRequest();
            
            console.log("save wfs....4")
            request.open('POST', 'http://localhost:8088/geoserver/wfs?service=wfs');
            // 指定内容为xml类型
            
            console.log("save wfs....5")
            request.setRequestHeader('Content-Type', 'text/xml');
            
            console.log("save wfs....6")
            request.send(featString);
        },

        // 保存新绘制的feature
        onSaveNew() {
            // 转换坐标
            let geometry = this.drewFeature.getGeometry().clone();
            geometry.applyTransform(function (flatCoordinates, flatCoordinates2, stride) {
                for (let j = 0; j < flatCoordinates.length; j += stride) {
                    let y = flatCoordinates[j];
                    let x = flatCoordinates[j + 1];
                    flatCoordinates[j] = x;
                    flatCoordinates[j + 1] = y;
                }
            });

            // 设置feature对应的属性，这些属性是根据数据源的字段来设置的
            let newFeature = new Feature();
            newFeature.setId('nyc_roads.new.' + this.newId);
            newFeature.setGeometryName('the_geom');
            newFeature.set('the_geom', null);
            newFeature.set('name', newFeature.getId());
            newFeature.set('modified', newFeature.getId());
            newFeature.set('vsam', 0);
            newFeature.set('sourcedate', '');
            newFeature.set('sourcetype', '');
            newFeature.set('source_id', this.newId);
            newFeature.set('borough', '');
            newFeature.set('feat_code', 0);
            newFeature.set('feat_desc', '11');
            newFeature.set('feat_type', 0);
            newFeature.set('exported', 'true');
            newFeature.setGeometry(new MultiLineString([geometry.getCoordinates()]));

            this.addWfs([newFeature]);
            // 更新id
            this.newId = this.newId + 1;
            // 3秒后，自动刷新页面上的feature
            setTimeout(() => {
                this.drawLayer.getSource().clear();
                this.queryWfs();
            }, 3000);
        },

        // 添加到服务器端
        addWfs(features) {
            let WFSTSerializer = new WFS();
            let featObject = WFSTSerializer.writeTransaction(features,
                null, null, {
                featureType: 'nyc_roads',
                featureNS: 'http://geoserver.org/nyc_roads',
                srsName: 'EPSG:4326'
            });
            let serializer = new XMLSerializer();
            let featString = serializer.serializeToString(featObject);
            let request = new XMLHttpRequest();
            request.open('POST', 'http://localhost:8088/geoserver/wfs?service=wfs');
            request.setRequestHeader('Content-Type', 'text/xml');
            request.send(featString);
        },
        // 在服务器端删除feature
        deleteWfs(features) {
            let WFSTSerializer = new WFS();
            let featObject = WFSTSerializer.writeTransaction(null,
                null, features, {
                featureType: 'nyc_roads',
                featureNS: 'http://geoserver.org/nyc_roads',
                srsName: 'EPSG:4326'
            });
            let serializer = new XMLSerializer();
            let featString = serializer.serializeToString(featObject);
            let request = new XMLHttpRequest();
            request.open('POST', 'http://localhost:8088/geoserver/wfs?service=wfs');
            request.setRequestHeader('Content-Type', 'text/xml');
            request.send(featString);
        }

    }
};
</script>

<style>
#map {
    height: 512px;
    width: 512px;
    display: flex;
    align-items: center;
}

/*隐藏ol的一些自带元素*/
.ol-attribution,
.ol-zoom {
    display: none;
}
</style>  