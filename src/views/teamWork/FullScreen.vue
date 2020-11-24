<template>
  <div>
    <div id="container"></div>
    <a-modal
      title="河流信息"
      :width="800"
      :visible="visible"
      :maskClosable="false"
      @cancel="handleCancel"
    >
      <template slot="footer">
        <a-button @click="handleCancel" type="primary"> 关闭 </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import {riverList} from '@/api/river'
export default {
  data() {
    return {
      visible: false
    }
  },
  mounted() {
    
    this.initMap();
  },
  methods: {
    handleCancel() {
      this.visible = false
    },
    riverList() {
      riverList().then(res => {
        var data = []
        res.result.data.forEach(river => {
          data.push(river.lng + ',' + river.lat + ',' + river.riverName)
        });
        window.pointSimplifierIns.setData(data)
        $('#loadingTip').remove()
      }).catch(err => {

      })
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

            var parts = item.split(',')

            return [parseFloat(parts[0]), parseFloat(parts[1])]
          },
          getHoverTitle: function (dataItem, idx) {
            
            return dataItem.split(',')[2]
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
              height: 31,
              //定位点为底部中心
              offset: ['-50%', '-100%'],
              fillStyle: null,
              strokeStyle: null,
            },
          },
        })

        window.pointSimplifierIns = pointSimplifierIns

        $('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body)
        that.riverList()
         //监听事件
        // pointSimplifierIns.on('pointClick pointMouseover pointMouseout', function(e, record) {
        pointSimplifierIns.on('pointClick', function(e, record) {
          that.visible = true
          console.log(e.type, record);
        });
        // $.get('https://a.amap.com/amap-ui/static/data/10w.txt', function (csv) {
        //   var data = csv.split('\n')
        //   pointSimplifierIns.setData(data)
        //   $('#loadingTip').remove()
        // })
      })
    },
  },
}
</script>

<style>
 html,
    body,
    #container {
        width: 100%;
        height: calc(100vh - 100px);
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