<template>
  <div>
    <div style="wdith: 100vw;">
      <div id="container"></div>
      <div id="right-container">
        <table>
          <tr>
            <td colspan="3" style="text-align: center;font-size: 16px;">水位</td>
          </tr>
          <tr>
            <td rowspan="2" style="width: 40%;">三闸站</td>
            <td style="width: 40%;">外河水位：</td>
            <td style="width: 20%;">3.79m</td>
          </tr>
          <tr>
            <td>内河水位</td>
            <td>2.28m</td>
          </tr>

          <tr>
            <td rowspan="2">菖蒲泾站</td>
            <td>外河水位：</td>
            <td>4.39m</td>
          </tr>
          <tr>
            <td>内河水位</td>
            <td>1.70m</td>
          </tr>

          <tr>
            <td>西旺泾站</td>
            <td>内河水位：</td>
            <td>1.00m</td>
          </tr>

          <tr>
            <td>界泾河站</td>
            <td>内河水位：</td>
            <td>0.43m</td>
          </tr>

           <tr>
            <td>章基站</td>
            <td>内河水位：</td>
            <td>1.76m</td>
          </tr>
          <tr>
            <td>热电厂站</td>
            <td>内河水位：</td>
            <td>2.08m</td>
          </tr>

          <tr>
            <td>太平港南闸</td>
            <td>内河水位：</td>
            <td>3.56m</td>
          </tr>

          <tr>
            <td>唐巷站</td>
            <td>内河水位：</td>
            <td>3.62m</td>
          </tr>

          <tr>
            <td>蒋巷站</td>
            <td>内河水位：</td>
            <td>3.57m</td>
          </tr>

          <tr>
            <td>东庄站</td>
            <td>内河水位：</td>
            <td>3.58m</td>
          </tr>

          <tr>
            <td>姑里船厂站</td>
            <td>内河水位：</td>
            <td>3.78m</td>
          </tr>

          <tr>
            <td>隔水站</td>
            <td>内河水位：</td>
            <td>3.01m</td>
          </tr>

          <tr>
            <td rowspan="2">新开河站</td>
            <td>外河水位：</td>
            <td>0.00m</td>
          </tr>
          <tr>
            <td>内河水位</td>
            <td>0.00m</td>
          </tr>

          <tr>
            <td>西漳北闸</td>
            <td>内河水位：</td>
            <td>0.00m</td>
          </tr>

          <tr>
            <td>西漳南闸</td>
            <td>内河水位：</td>
            <td>0.00m</td>
          </tr>

          <tr>
            <td>黄金岸站</td>
            <td>内河水位：</td>
            <td>0.00m</td>
          </tr>

          <tr>
            <td>西站</td>
            <td>内河水位：</td>
            <td>0.00m</td>
          </tr>

          <tr>
            <td>塘头站</td>
            <td>内河水位：</td>
            <td>3.76m</td>
          </tr>
        </table>
      </div>
      <a-modal title="河流信息" :width="800" :visible="visible" :maskClosable="false" @cancel="handleCancel">
        <template slot="footer">
          <a-button @click="handleCancel" type="primary"> 关闭 </a-button>
        </template>
        <div id="container2" style="width: 100%; height: 300px"></div>
        <div class="tbl-container">
          <table class="tbl" style="width: 100%;">
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
                <a-select size="small" style="width: 86px;margin: 0 3px;font-size: 12px;" v-model="month" @change="() => this.waterList()">
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
            <tr v-for="(water,index) of waterListData" :key="index">
              <td>{{water.month}}</td>
              <td>{{water.sectionName}}</td>
              <td>{{water.rjy}}</td>
              <td>{{water.ad}}</td>
              <td>{{water.zl}}</td>
              <td>{{water.gmsj}}</td>
              <td>{{water.wryz}}</td>
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
import { waterList2, waterList } from '@/api/water'
import qs from 'qs'
export default {
  data() {
    return {
      visible: false,
      waterListData: [],
      waterListData2: [],
      month: '0',
      record: {}
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
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
            if(dataItem.riverType === 0) {
              return dataItem.riverName + '<br>责任人：' + managerName + '<br>'+ '水位：1.35mm'
            } else {
              var text = dataItem.riverName + '<br>责任人：' + managerName + '<br>断面：'
              dataItem.sections.forEach(section => {
                text += section.sectionName + '，'
              })
              return text;
            }
            
            //return '<div style="background: red;">123</div>'
          },
          renderOptions: {
            //点的样式
            pointStyle: {
              //绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent(
                '/img/river2.png',
                function onload() {
                  pointSimplifierIns.renderLater()
                },
                function onerror(e) {
                  alert('图片加载失败！')
                }
              ),
              //宽度
              width: 30,
              //高度
              height: 30,
              //定位点为底部中心
              offset: ['-50%', '-100%'],
              fillStyle: null,
              strokeStyle: null,
            },
          },
        })

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
        year: new Date().getFullYear()
      }
      waterList2( qs.stringify(param) ).then(res => {
        this.waterListData2 = res.result.data
        this.initEcharts(record)
      }).catch(err => {

      })
    },
    waterList() {
      var param = {
        month: this.month,
        riverId: this.record.data.id,
        year: new Date().getFullYear()
      }
      waterList( qs.stringify(param) ).then(res => {
        this.waterListData = res.result.data
      }).catch(err => {

      })
    },
    initEcharts(record) {

      
      var that = this
      var river = record.data
      this.$nextTick(() => {
        var legends = []
        var series = []
        var color = ['#80e673','#ccb33c', '#ec6c6c','#44a4dc','#6244dc']
        that.waterListData2.forEach((section,index) => {
          legends.push(section.sectionName)
          
          series.push({
            name: section.sectionName,
            color: color[index],
            data: section.typeList,
            type: 'line',
            //smooth: true,
          })
        });
        var dom = document.getElementById('container2')
        var myChart = echarts.init(dom)
        var app = {}
        var option = {
          title: {
            text: river.riverName + '-水质折线图',
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}水质: {c}"
          },
          legend: {
            data: legends,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
          },
          yAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['V','IV','III','II','I'],
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
.tbl {
  border-bottom: 1px solid gray;
  border-right: 1px solid gray;
}
.tbl th ,.tbl td {
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
  width: 200px;
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