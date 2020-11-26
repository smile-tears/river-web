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
      </a-modal>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { riverList } from '@/api/river'
import { waterList2 } from '@/api/water'
import qs from 'qs'
export default {
  data() {
    return {
      visible: false,
      waterListData: [],
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
            return dataItem.riverName + '（责任人：'+dataItem.managerName + '）'
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
          that.visible = true
          that.waterList2(record)
          

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
        riverId: record.data.id
      }
      waterList2( qs.stringify(param) ).then(res => {
        this.waterListData = res.result.data
        this.initEcharts(record)
      }).catch(err => {

      })
    },
    initEcharts(record) {

      
      var that = this
      var river = record.data
      this.$nextTick(() => {
        var legends = []
        var series = []
        that.waterListData.forEach(section => {
          legends.push(section.sectionName)
          series.push({
            name: section.sectionName,
            color: 'green',
            data: section.type.split(','),
            type: 'line',
            smooth: true,
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
            trigger: 'axis',
          },
          legend: {
            data: legends,
          },
          xAxis: {
            type: 'category',
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
          },
          yAxis: {
            type: 'category',
            data: ['V','IV','III','II','I']
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