<template>
  <div class="container">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="8">
            <a-form-item label="标题">
              <!--<a-input v-model="queryParam.datitletetime" placeholder=""/>-->
              <!-- <a-date-picker  v-model="queryParam.title"/> -->
              <a-input v-model="queryParam.title" style="width: 300px;"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-button type="primary" icon="search" @click="loadData">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div v-if="page == 0" class="table-operator">
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
        'show-total': total => `共 ${total} 条`
      }"
      @change="change"
    >
      <span slot="serial" slot-scope="text, record, index">
        <!-- <div style="float: left;margin: auto;">
          <div v-if="parseInt(record.state) === 0" class="dot" style="background: green;width: 8px;height: 8px;border-radius: 6px;"></div>
          <div v-if="parseInt(record.state) === 1" class="dot" style="background: red;width: 8px;height: 8px;border-radius: 6px;"></div>
          <div v-if="parseInt(record.state) === 2" class="dot" style="background: red;width: 8px;height: 8px;border-radius: 6px;"></div>
        </div> -->
        {{ index + 1 }}
      </span>
      <span slot="state" slot-scope="text, record">
        <div v-if="page == 0">
          
        </div>
        <div v-if="page == 1">
          <div v-if="parseInt(record.state) === 0" class="dot" style="background: green;width: 12px;height: 12px;border-radius: 6px;"></div>
          <div v-if="parseInt(record.state) === 1" class="dot" style="background: red;width: 12px;height: 12px;border-radius: 6px;"></div>
          <div v-if="parseInt(record.state) === 2" class="dot" style="background: red;width: 12px;height: 12px;border-radius: 6px;"></div>
        </div>
        <div v-else-if="page == 2">
          {{record.handleState == 0 ? '未处置' : '已处置' }}
        </div>
      </span>
      <template slot="action" slot-scope="text,record">
        <a @click="info(record)">查看</a>
        <a-divider v-if="page == 0 || page == 1" type="vertical" />
        <a v-if="page == 0 || page == 1" @click="edit(record)">{{page == 0 ? '编辑' : '处置'}}</a>
        <a-divider v-if="page == 0" type="vertical" />
        <a v-if="page == 0" @click="del('single',record)">删除</a>
      </template>
    </a-table>
    <ReportEdit :modalData="modalData" @handleModalEvent="handleModalEvent"></ReportEdit>
  </div>
</template>
<script>
import { caseInfoCityList, caseInfoCityList2, caseInfoCityDelete } from '@/api/case'
import ReportEdit from './ReportEdit'
import qs from 'qs'
import { Ellipsis } from '@/components'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '状态',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '上报时间',
    dataIndex: 'reportTime',
    key: 'caseType'
  },
  {
    title: '上报人',
    dataIndex: 'reportorName',
    key: 'reportorName'
  },
  {
    title: '处置时限',
    dataIndex: 'limittimes',
    key: 'limittimes'
  },
  {
    title: '案件截止时间',
    dataIndex: 'endDate',
    key: 'endDate'
  },
  {
    title: '备注',
    dataIndex: 'caseDesc',
    key: 'caseDesc'
  },
  {
    title: '地址',
    dataIndex: 'locationDesc',
    key: 'locationDesc'
  },
  
  {
    title: '操作',
    key: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  props: {
    page: {
      type: String,
      default: '0'
    }
  },
  components: {
    ReportEdit,
    Ellipsis
  },
  watch: {
    page (val) {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  
  data () {
    return {
      data: [],
      columns,
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      modalData: {},
      queryParam: {}
    }
  },
  methods: {
    init() {
      this.loadData()
    },
    loadData () {
      var params = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        status: this.page,
        reportor: window.sessionStorage.getItem('id'),
        ...this.queryParam
      }
      var a = this.$store
      caseInfoCityList2(qs.stringify(params))
        .then(res => {
          this.data = res.result.data
          this.pagination.total = res.result.totalCount
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          // Do something
        })
    },
    del (type, record) {
      var ids = type === 'single' ? [record.id] : this.selectedRowKeys
      caseInfoCityDelete(ids)
        .then(res => {
          this.loadData()
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          // Do something
        })
    },
    add () {
      this.modalData = {
        record: {},
        visible: true,
        view: false,
        title: '案件信息',
        page: this.page
      }
    },
    edit (record) {
      this.modalData = {
        record: record,
        visible: true,
        view: false,
        title: '案件信息',
        page: this.page
      }
    },
    info (record) {
      this.modalData = {
        record: record,
        visible: true,
        view: true,
        title: '案件信息',
        page: this.page
      }
    },
    handleModalEvent (res) {
      this.loadData()
    },
    onSelectChange (selectedRowKeys) {
      // console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys
    },
    change (pagination, filters, sorter) {
      this.pagination = pagination
      this.loadData()
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background: white;
  padding: 24px;
}
</style>
