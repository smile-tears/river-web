<template>
  <div class="container">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="8">
            <a-form-item label="河道名称">
              <a-input v-model="queryParam.riverName" placeholder="" />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="8" :sm="8">
            <a-form-item label="责任人">
              <a-input v-model="queryParam.manager" placeholder="" />
            </a-form-item>
          </a-col> -->
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
      <span slot="riverType" slot-scope="text, record, index">
        <span v-if="record.riverType === 0"> 闸站</span>
        <span v-else-if="record.riverType === 1"> 河道</span>
      </span>
      <template slot="action" slot-scope="text, record">
        <a @click="info(record)">查看</a>
        <a-divider type="vertical" />
        <a @click="edit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="del('single', record)">删除</a>
      </template>
    </a-table>
    <RiverEdit :modalData="modalData" @handleModalEvent="handleModalEvent"></RiverEdit>
  </div>
</template>
<script>
import { riverList, riverDelete } from '@/api/river'
import RiverEdit from './RiverEdit'
import qs from 'qs'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
  },
  {
    title: '河道名称',
    dataIndex: 'riverName',
    key: 'riverName',
  },
  {
    title: '责任人',
    dataIndex: 'managerName',
    key: 'managerName',
  },
  {
    title: '类型',
    dataIndex: 'riverType',
    key: 'riverType',
    scopedSlots: { customRender: 'riverType' },
  },
  {
    title: '经度',
    dataIndex: 'lng',
    key: 'lng',
  },
  {
    title: '纬度',
    dataIndex: 'lat',
    key: 'lat',
  },
  {
    title: '显示顺序',
    dataIndex: 'showOrder',
    key: 'showOrder',
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
    RiverEdit,
  },
  mounted() {
    this.loadData()
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
      riverNode: {},
      modalData: {},
      queryParam: {},
    }
  },
  methods: {
    loadData() {
      var params = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        ...this.queryParam,
      }
      riverList(qs.stringify(params))
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
          sections: []
        },
        visible: true,
        disabled: false,
        title: '新建河道',
      }
    },
    del(type, record) {
      var ids = type === 'single' ? [record.id] : this.selectedRowKeys
      riverDelete(ids)
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
        title: '编辑河道',
      }
    },
    info(record) {
      this.modalData = {
        record: record,
        visible: true,
        disabled: true,
        title: '查看河道',
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