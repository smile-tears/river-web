<template>
  <a-modal
    :title="modalData.title"
    :width="600"
    :visible="modalData.visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :layout="formLayout" :form="form" >
        <div class="caseDetailTitle">河道信息</div>
        <a-form-item label="id" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="false">
          <a-input :disabled="modalData.disabled" v-decorator="['id', {}]" />
        </a-form-item>
        <a-form-item label="河道名称" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['riverName', {}]" />
        </a-form-item>
        <!-- <a-form-item label="责任人" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['manager', {}]" />
        </a-form-item> -->
        <a-form-item label="责任人" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-tree-select
            :disabled="modalData.disabled"
            v-decorator="['manager', {}]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="personTreeData"
            placeholder
            tree-default-expand-all
          ></a-tree-select>
        </a-form-item>
        <a-form-item label="经度" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="width: 606px;">
          <a-input :disabled="modalData.disabled" v-decorator="['lng', {}]" style="width: 110px" />
          <span style="margin-left: 10px">纬度：</span>
          <a-input :disabled="modalData.disabled" v-decorator="['lat', {}]" style="width: 110px" />
          <a-button v-if="!modalData.disabled" @click="selectPosition" style="margin-left: 10px">位置</a-button>
          <a-modal
            title="地图定位"
            :width="1000"
            :visible="mapVisible"
            :maskClosable="false"
            @cancel="
              () => {
                this.mapVisible = false
              }
            "
            @ok="handleMapOk"
            class="mapModal"
          >
            <div id="container1" class="map" style="width: 100%; height: 600px"></div>
            <div class="search">
              <span>请输入关键字：</span> <br />
              <a-input id="tipinput" />
            </div>
            <div class="position">
              <span>经度：</span>
              <a-input v-decorator="['lnglat.lng', {}]" style="width: 140px" />
              <div class="line"></div>
              <span>纬度：</span>
              <a-input v-decorator="['lnglat.lat', {}]" style="width: 140px" />
            </div>
          </a-modal>
        </a-form-item>
        <a-form-item label="显示顺序" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['showOrder', {}]" />
        </a-form-item>
        <div class="caseDetailTitle">
          <span>河道断面</span>
          
          <a-icon v-if="!modalData.disabled" @click="() => { modalData.record.sections.push({sectionName: '', showOrder: ''}) }" type="plus-circle" style="font-size: 23px;float: right;cursor: pointer;color: #1890ff;" />
        </div>
        <div>
          <a-row style="background: rgb(149, 194, 250);height: 30px;line-height: 30px;color: white;margin-bottom: 16px;">
            <a-col :span="14" style="text-align: center;">
              断面名称
            </a-col>
            <a-col :span="8" style="text-align: center;color: white;">
              顺序
            </a-col>
            <a-col :span="2">
            </a-col>
          </a-row>
          <a-row :gutter="16" style="height: 36px;margin-bottom: 6px;border-bottom: 1px solid #e4dfdf;" v-for="(section,index) of modalData.record.sections" :key="index">
            
            <a-col :span="14" >
              <a-input :disabled="modalData.disabled" v-model='section.sectionName' />
            </a-col>
            <a-col :span="8" >
              <a-input :disabled="modalData.disabled" v-model='section.showOrder'/>
            </a-col>
            <a-col :span="2" style="text-align: center;">
              <a-icon v-if="!modalData.disabled" @click="() => {modalData.record.sections.splice(index,1);}" type="minus-circle" style="font-size: 23px;cursor: pointer;color: #ff4d4f;" />
            </a-col>
            
          </a-row>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { riverPost, riverPut } from '@/api/river'
import { getSubCompanyTree, getSubCompanyUserTree } from '@/api/manage'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modalData'],
  data() {
    return {
      mapVisible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      formLayout: 'inline',
      confirmLoading: false,
      treeData: [],
      personTreeData: []
    }
  },
  watch: {
    modalData(modalData) {
      this.form.resetFields()
      if (modalData.visible === true) {
        this.$nextTick(() => {
          delete this.modalData.record.delTag
          this.form.setFieldsValue({ ...this.modalData.record })
        })
      }
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    
    // console.log('form::', this.form)
  },
  created() {
    this.getSubCompanyUserTree()
  },
  methods: {
    handleOk() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          // console.log('form values', values)
          var api = values.id === undefined ? riverPost : riverPut
          values.sections = this.modalData.record.sections
          api(values)
            .then((res) => {
              if (res.code === 200) {
                this.$emit('handleModalEvent', res)
                this.handleCancel()
              } else {
                this.$message.error(res.message)
              }
            })
            .catch(() => {})
        }
      })
    },
    selectPosition() {
      this.mapVisible = true
      var that = this
      this.$nextTick(() => {
        // eslint-disable-next-line no-undef
        var config = {
          zoom: 13,
          resizeEnable: true,
        }
        if (that.lnglat && that.lnglat.lng && that.lnglat.lat) config.center = [that.lnglat.lng, that.lnglat.lat]
        // eslint-disable-next-line no-undef
        var map = new AMap.Map('container1', config)
        // 为地图注册click事件获取鼠标点击出的经纬度坐标
        var marker
        var offset = new AMap.Pixel(-13, -30)
        map.on('click', function (e) {
          var lnglat = {
            lng: e.lnglat.getLng(),
            lat: e.lnglat.getLat(),
          }
          that.lnglat = lnglat
          that.form.setFieldsValue({ lnglat: lnglat })
          // 重新添加标记
          if (marker) {
            marker.setMap(null)
            marker = null
          }
          marker = new AMap.Marker({
            icon: '/img/poi-marker-red.png',
            position: [e.lnglat.getLng(), e.lnglat.getLat()],
            offset: offset,
          })
          marker.setMap(map)
        })
        // 初始化标记
        if (that.lnglat && that.lnglat.lng && that.lnglat.lat) {
          marker = new AMap.Marker({
            icon: '/img/poi-marker-red.png',
            position: [that.lnglat.lng, that.lnglat.lat],
            offset: offset,
          })
          marker.setMap(map)
        }
        // 输入提示
        var autoOptions = {
          input: 'tipinput',
        }
        // eslint-disable-next-line no-undef
        AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], function () {
          // eslint-disable-next-line no-undef
          var auto = new AMap.AutoComplete(autoOptions)
          // eslint-disable-next-line no-undef
          var placeSearch = new AMap.PlaceSearch({
            map: map,
          }) // 构造地点查询类
          auto.on('select', select) // 注册监听，当选中某条记录时会触发
          function select(e) {
            placeSearch.setCity(e.poi.adcode)
            placeSearch.search(e.poi.name) // 关键字查询查询
          }
        })
      })
    },
    handleMapOk() {
      this.mapVisible = false
      this.form.setFieldsValue(this.lnglat)
    },
    handleCancel() {
      this.modalData.visible = false
    },
    getSubCompanyUserTree() {
      getSubCompanyUserTree()
        .then((res) => {
          if (res.code === 200) {
            this.personTreeData = res.result
          }
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  width: 360px;
}
.caseDetailTitle {
  background: #f0f2f5;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  padding: 10px 24px;
}
.search {
  background: white;
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px;
  width: 216px;
}
.search span {
  font-weight: bold;
}
.position {
  background: white;
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 10px;
}
.position span {
  font-weight: bold;
}
.position .line {
  height: 10px;
}
</style>