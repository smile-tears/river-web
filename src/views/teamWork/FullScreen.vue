<template>
  <div>
    <div style="wdith: 100vw">
      <div id="container"></div>
      <div id="right-container">
        <table>
          <colgroup>
            <col width="40%"/>
            <col width="40%"/>
            <col width="20%"/>
          </colgroup>
          <tr>
            <td colspan="3" style="text-align: center; font-size: 16px">水位</td>
          </tr>
          <template v-for="(item,index) of swList" >
            <tr v-for="(item2,index2) of item.children" :key="index+'-'+index2" style="height: 40px;">
              <td v-if="index2 == 0" :rowspan="item.children.length">{{item.prefix}}</td>
              <td>{{item2.suffix}}</td>
              <td>{{item2.sw}}m</td>
            </tr>
          </template>
        </table>
      </div>
      <a-modal title="河流信息" :width="800" :visible="visible" :maskClosable="false" @cancel="handleCancel">
        <template slot="footer">
          <a-button @click="handleCancel" type="primary"> 关闭 </a-button>
        </template>
        <div id="container2" style="width: 100%; height: 300px"></div>
        <div class="tbl-container">
          <table class="tbl" style="width: 100%">
            <colgroup>
              <col width="10%" />
              <col width="15%" />
              <col width="15%" />
              <col width="15%" />
              <col width="15%" />
              <col width="15%" />
              <col width="15%" />
            </colgroup>
            <tr>
              <th colspan="7">
                <a-select
                  size="small"
                  style="width: 86px; margin: 0 3px; font-size: 12px"
                  v-model="year"
                  @change="() => {this.waterList2(this.record);this.waterList()}"
                >
                  <a-select-option key="0">请选择</a-select-option>
                  <a-select-option v-for="i in years" :key="i">{{ i }}</a-select-option>
                </a-select>
                年
                <a-select
                  size="small"
                  style="width: 86px; margin: 0 3px; font-size: 12px"
                  v-model="month"
                  @change="() => this.waterList()"
                >
                  <a-select-option key="0">请选择</a-select-option>
                  <a-select-option v-for="i in 12" :key="i">{{ i }}</a-select-option>
                </a-select>
                <span>月监测结果（单位：mg/L)</span>
              </th>
            </tr>
            <tr>
              <th>月份</th>
              <th>断面</th>
              <th>溶解氧</th>
              <th>氨氮</th>
              <th>总磷</th>
              <th>高锰酸盐指数</th>
              <th>主要污染因子</th>
            </tr>
            <tr v-for="(water, index) of waterListData" :key="index">
              <td>{{ water.month }}</td>
              <td>{{ water.sectionName }}</td>
              <td>{{ water.rjy }}</td>
              <td>{{ water.ad }}</td>
              <td>{{ water.zl }}</td>
              <td>{{ water.gmsj }}</td>
              <td>{{ water.wryz }}</td>
            </tr>
          </table>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { riverList } from '@/api/river'
import { waterList2, waterList, getCurrentSw } from '@/api/water'
import qs from 'qs'
let years = []
var currentYear = new Date().getFullYear()
for (var i=currentYear;i>=2020;i--) {
  years.push(i)
}
export default {
  data() {
    return {
      visible: false,
      waterListData: [],
      waterListData2: [],
      month: '0',
      year: currentYear,
      years: years,
      record: {},
      swList: [],
      swJo: {}
    }
  },
  mounted() {
    this.initMap(),
    this.getCurrentSw()
    
  },
  methods: {
    getCurrentSw() {
      var that = this
      function getData() {
        that.swList = []
        that.swJo = {}
        getCurrentSw().then(res => {
          var temp = ""; //闸站
          var jo = {};
          res.result.forEach(sw => {
            var item = sw.item
            var prefix = item.substring(0,3);
            var suffix = item.substring(3);
            if (prefix !== temp) {
              if (temp !== '') that.swList.push(jo)
              temp = prefix
              jo = {}
              jo.prefix = prefix
              jo.children = []
            }
            jo.children.push({
              suffix: suffix,
              sw: sw.sw
            })
            that.swJo[prefix] = sw.sw
            
          })
        }).catch((err) => {})
      }
      getData()
      window.setInterval(getData,1000*60)
      
    },
    riverList() {
      riverList()
        .then((res) => {
          // var data = []
          // res.result.data.forEach((river) => {
          //   data.push(river.lng + ',' + river.lat + ',' + river.riverName + '（' + river.managerName + '）')
          // })
          window.pointSimplifierIns.setData(res.result.data)
          // $('#loadingTip').remove()
        })
        .catch((err) => {})
    },

    initMap() {
      //创建地图
      var map = new AMap.Map('container', {
        zoom: 15,
      })
      var that = this
      AMapUI.load(['ui/misc/PointSimplifier', 'lib/$'], function (PointSimplifier, $) {
        if (!PointSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！')
          return
        }

        var groupStyleMap = {
          0: {
            pointStyle: {
              //绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent('/img/river2.png', onIconLoad, onIconError),
              //宽度
              width: 30,
              //高度
              height: 30,
              //定位点为中心
              offset: ['-50%', '-50%'],
              fillStyle: null,
              //strokeStyle: null
            },
          },
          1: {
            pointStyle: {
              //绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent('/img/river.png', onIconLoad, onIconError),
              //宽度
              width: 30,
              //高度
              height: 30,
              //定位点为中心
              offset: ['-50%', '-50%'],
              fillStyle: null,
              // strokeStyle: null
            },
          },
        }

        var pointSimplifierIns = new PointSimplifier({
          zIndex: 300,
          map: map,
          //maxChildrenOfQuadNode:3,
          getPosition: function (item) {
            if (!item) {
              return null
            }
            return [item.lng, item.lat]
          },
          getHoverTitle: function (dataItem, idx) {
            var managerName = dataItem.managerName
            managerName = managerName == null ? '' : managerName
            if (dataItem.riverType === 0) {
              var sw = that.swJo[dataItem.riverName.substring(0,3)]
              if (sw === null || sw === undefined ) {
                sw = 0
              }
              return dataItem.riverName + '<br>责任人：' + managerName + '<br>' + '水位：'+sw + 'm'
            } else {
              var text = dataItem.riverName + '<br>责任人：' + managerName + '<br>断面：'
              dataItem.sections.forEach((section) => {
                text += section.sectionName + '，'
              })
              return text
            }

            //return '<div style="background: red;">123</div>'
          },
          renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
          renderOptions: {
            //点的样式
            pointStyle: {
              //绘制点占据的矩形区域
              // content: PointSimplifier.Render.Canvas.getImageContent(
              //   '/img/river2.png',
              //   function onload() {
              //     pointSimplifierIns.renderLater()
              //   },
              //   function onerror(e) {
              //     alert('图片加载失败！')
              //   }
              // ),
              //宽度
              width: 30,
              //高度
              height: 30,
              //定位点为底部中心
              offset: ['-50%', '-100%'],
              fillStyle: null,
              strokeStyle: null,
            },
            getGroupId: function (item, idx) {
              return item.riverType
            },
            groupStyleOptions: function (gid) {
              return groupStyleMap[gid]
            },
          },
        })
        function onIconLoad() {
          pointSimplifierIns.renderLater()
        }

        function onIconError(e) {
          alert('图片加载失败！')
        }

        window.pointSimplifierIns = pointSimplifierIns

        // $('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body)
        that.riverList()
        //监听事件
        // pointSimplifierIns.on('pointClick pointMouseover pointMouseout', function(e, record) {
        pointSimplifierIns.on('pointClick', function (e, record) {
          if (record.data.riverType !== 1) return
          that.record = record
          that.visible = true
          that.waterList2(record)
          that.waterList()

          //console.log(e.type, record)
        })
        // $.get('https://a.amap.com/amap-ui/static/data/10w.txt', function (csv) {
        //   var data = csv.split('\n')
        //   pointSimplifierIns.setData(data)
        //   $('#loadingTip').remove()
        // })
      })
    },
    waterList2(record) {
      var param = {
        riverId: record.data.id,
        year: this.year,
      }
      waterList2(qs.stringify(param))
        .then((res) => {
          this.waterListData2 = res.result.data
          this.initEcharts(record)
        })
        .catch((err) => {})
    },
    waterList() {
      var param = {
        month: this.month,
        riverId: this.record.data.id,
        year: this.year,
      }
      waterList(qs.stringify(param))
        .then((res) => {
          this.waterListData = res.result.data
        })
        .catch((err) => {})
    },
    initEcharts(record) {
      var that = this
      var river = record.data
      this.$nextTick(() => {
        var legends = []
        var series = []
        var color = ['#80e673', '#ccb33c', '#ec6c6c', '#44a4dc', '#6244dc']
        that.waterListData2.forEach((section, index) => {
          legends.push(section.sectionName)

          series.push({
            name: section.sectionName,
            color: color[index],
            data: section.typeList,
            type: 'line',
            //smooth: true,
          })
        })
        var dom = document.getElementById('container2')
        var myChart = echarts.init(dom)
        var app = {}
        var option = {
          title: {
            text: river.riverName + '-水质折线图',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}水质: {c}',
          },
          legend: {
            data: legends,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          },
          yAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['劣Ⅴ', 'Ⅴ', 'Ⅳ', 'Ⅲ', 'Ⅱ', 'Ⅰ'],
            // axisLabel: {
            //   formatter: '{value} °C'
            // }
          },
          series: series,
        }
        if (option && typeof option === 'object') {
          myChart.setOption(option, true)
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style lang="less" scoped>
table tr {
  height: 28px;
  font-weight: bold;
}
table td {
  font-size: 12px;
}
table tr {
  height: 28px;
}
table {
  border-bottom: 1px solid gray;
  border-right: 1px solid gray;
}
table th,
table td {
  font-size: 12px;
  text-align: center;
  border-top: 1px solid gray;
  border-left: 1px solid gray;
}
#container {
  float: left;
  width: calc(100vw - 300px);
  height: calc(100vh - 100px);
  margin: 0px;

  // border: 1px solid #d3d3d3;
}
#right-container {
  padding: 16px;
  float: left;
  width: 225px;
  /* height: calc(100vh - 100px); */
  margin: 0px;
}

#loadingTip {
  position: absolute;
  z-index: 9999;
  top: 0;
  right: 0;
  padding: 3px 10px;
  background: red;
  color: #fff;
  font-size: 13px;
}
</style>