<template>
  <a-modal
    :title="modalData.title"
    :width="800"
    :visible="modalData.visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :layout="formLayout" :form="form">
        <a-form-item label="id" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="false">
          <a-input :disabled="modalData.disabled" v-decorator="['id', {}]" />
        </a-form-item>
        <a-form-item label="河道" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-select
            :disabled="modalData.disabled"
            placeholder=""
            v-decorator="['riverId', {}]" 
            @change="handleRiverChange"
          >
            <a-select-option v-for="(river) in riverListData" :key="river.id" :value="river.id" >
              {{river.riverName}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="断面" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-select
            :disabled="modalData.disabled"
            placeholder=""
            v-decorator="['sectionId', {}]" 
          >
            <a-select-option v-for="(section) in sectionListData" :key="section.id" :value="section.id" >
              {{section.sectionName}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="溶解氧" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['rjy', {}]" />
        </a-form-item>
        <a-form-item label="氨氮" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['ad', {}]" />
        </a-form-item>
        <a-form-item label="总磷" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['zl', {}]" />
        </a-form-item>
        <a-form-item label="高锰酸钾指数" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['gmsj', {}]" />
        </a-form-item>
        <a-form-item label="年份" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['year', {}]" />
        </a-form-item>
        <a-form-item label="月份" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-select
            :disabled="modalData.disabled"
            placeholder=""
            v-decorator="['month', {}]" 
          >
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
            <a-select-option value="3">3</a-select-option>
            <a-select-option value="4">4</a-select-option>
            <a-select-option value="5">5</a-select-option>
            <a-select-option value="6">6</a-select-option>
            <a-select-option value="7">7</a-select-option>
            <a-select-option value="8">8</a-select-option>
            <a-select-option value="9">9</a-select-option>
            <a-select-option value="10">10</a-select-option>
            <a-select-option value="11">11</a-select-option>
            <a-select-option value="12">12</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="水质类别" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <!-- <a-input :disabled="modalData.disabled" v-decorator="['type', {}]" /> -->
          <a-select
            :disabled="modalData.disabled"
            placeholder=""
            v-decorator="['type', {}]" 
          >
            <a-select-option value="0" >I</a-select-option>
            <a-select-option value="1" >II</a-select-option>
            <a-select-option value="2" >III</a-select-option>
            <a-select-option value="3" >IV</a-select-option>
            <a-select-option value="4" >V</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="主要污染因子" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['wryz', {}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { waterPost, waterPut } from '@/api/water'
import { riverList } from '@/api/river'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modalData'],

  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      formLayout: 'inline',
      confirmLoading: false,
      riverListData: [],
      sectionListData: []
    }
  },
  created() {
    this.riverList()
  },
  watch: {
    modalData(modalData) {
      this.form.resetFields()
      if (modalData.visible === true) {
        this.$nextTick(() => {
          delete this.modalData.record.delTag

          this.form.setFieldsValue({ ...this.modalData.record })
          this.handleRiverChange(this.modalData.record.riverId)
        })
      }
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    // console.log('form::', this.form)
  },
  methods: {
    handleRiverChange(riverId) {
      this.riverListData.forEach((river) => {
        if (river.id == riverId) this.sectionListData = river.sections
      })
    },
    handleOk() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          // console.log('form values', values)
          var api = values.id === undefined ? waterPost : waterPut
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
    handleCancel() {
      this.modalData.visible = false
    },
    riverList() {
      riverList().then((res) => {
        this.riverListData = res.result.data
      }).catch((err) => {
        // Do something
      })
    },
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  width: 360px;
}
</style>
