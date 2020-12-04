<template>
  <div class="container">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="8">
            <a-form-item label="年份">
              <a-input v-model="queryParam.year" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="月份">
              <a-input v-model="queryParam.month" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-button type="primary" icon="search" @click="loadData">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="add">新建</a-button>
      <a-button type="danger" icon="delete" @click="del('batch')">删除</a-button>
    </div>

    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="data"
      rowKey="id"
      :pagination="{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        'show-size-changer': true,
        'show-quick-jumper': true,
        'show-total': (total) => `共  条`,
      }"
      @change="change"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="type" slot-scope="text, record">
        <span v-if="record.type == '0'">I</span>
        <span v-if="record.type == '1'">II</span>
        <span v-if="record.type == '2'">III</span>
        <span v-if="record.type == '3'">IV</span>
        <span v-if="record.type == '4'">V</span>
      </span>
      <template slot="action" slot-scope="text, record">
        <a @click="info(record)">查看</a>
        <a-divider type="vertical" />
        <a @click="edit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="del('single', record)">删除</a>
      </template>
    </a-table>
    <WaterEdit :modalData="modalData" @handleModalEvent="handleModalEvent"></WaterEdit>
  </div>
</template>
<script>
import { waterList, waterDelete } from '@/api/water'
import WaterEdit from './WaterEdit'
import qs from 'qs'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
  },
  {
    title: '河道',
    dataIndex: 'riverName',
    key: 'riverName',
  },
  {
    title: '断面',
    dataIndex: 'sectionName',
    key: 'sectionName',
  },
  {
    title: '溶解氧',
    dataIndex: 'rjy',
    key: 'rjy',
  },
  {
    title: '氨氮',
    dataIndex: 'ad',
    key: 'ad',
  },
  {
    title: '总磷',
    dataIndex: 'zl',
    key: 'zl',
  },
  {
    title: '高锰酸钾指数',
    dataIndex: 'gmsj',
    key: 'gmsj',
  },
  {
    title: '年份',
    dataIndex: 'year',
    key: 'year',
  },
  {
    title: '月份',
    dataIndex: 'month',
    key: 'month',
  },
  {
    title: '水质类别',
    dataIndex: 'type',
    key: 'type',
    scopedSlots: { customRender: 'type' },
  },
  {
    title: '主要污染因子',
    dataIndex: 'wryz',
    key: 'wryz',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  components: {
    WaterEdit,
  },
  created() {
    this.loadData()
    
  },
  data() {
    return {
      data: [],
      columns,
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      waterNode: {},
      modalData: {},
      queryParam: {},
      
    }
  },
  methods: {
    loadData() {
      var params = {
        pid: this.waterNode.value,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        ...this.queryParam,
      }
      waterList(qs.stringify(params))
        .then((res) => {
          this.data = res.result.data
          this.pagination.total = res.result.totalCount
        })
        // eslint-disable-next-line handle-callback-err
        .catch((err) => {
          // Do something
        })
    },
    add() {
      this.modalData = {
        record: {
          pid: this.waterNode.value,
        },
        visible: true,
        disabled: false,
        title: '新建水质',
      }
    },
    del(type, record) {
      var ids = type === 'single' ? [record.id] : this.selectedRowKeys
      waterDelete(ids)
        .then((res) => {
          if (res.code === 200) {
            this.loadData()
          } else {
            this.$message.error(res.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch((err) => {
          // Do something
        })
    },
    edit(record) {
      this.modalData = {
        record: record,
        visible: true,
        disabled: false,
        title: '编辑水质',
      }
    },
    info(record) {
      this.modalData = {
        record: record,
        visible: true,
        disabled: true,
        title: '查看水质',
      }
    },
    handleModalEvent(res) {
      this.loadData()
    },
    onSelectChange(selectedRowKeys) {
      // console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys
    },
    change(pagination, filters, sorter) {
      this.pagination = pagination
      this.loadData()
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  background: white;
  padding: 24px;
}
</style>