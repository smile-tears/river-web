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
      <a-form :layout="formLayout" :form="form">
        <a-form-item label="id" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="false">
          <a-input :disabled="modalData.disabled" v-decorator="['id', {}]" />
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
          <a-input :disabled="modalData.disabled" v-decorator="['month', {}]" />
        </a-form-item>
        <a-form-item label="水质类别" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['type', {}]" />
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
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modalData'],

  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      formLayout: 'horizontal',
      confirmLoading: false
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
  methods: {
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
    }
  }
}
</script>
