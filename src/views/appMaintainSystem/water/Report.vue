<template>
  <div>
    <h3 style="text-align: center">
      <span>堰桥街道镇级河道</span>
      <a-select style="width: 80px;margin: 0 3px;" size="small" v-model="year" @change="() => this.waterReport()">
        <a-select-option v-for="i in yearArr" :key="i">
          {{ i }}
        </a-select-option>
      </a-select>
      <span>年</span>
      <a-select style="width: 60px;margin: 0 3px;" size="small" v-model="month" @change="() => this.waterReport()">
        <a-select-option v-for="i in 12" :key="i">
          {{ i }}
        </a-select-option>
      </a-select>
      <span>月水质情况</span>
      <a-button type="primary" size="small" style="margin-left: 10px;font-size: 12px;" @click="download">导出EXCEL</a-button>
    </h3>
    <table class="tbl" cellpadding="0" cellspacing="0">
      <colgroup>
        <col width="5%" />
        <col width="3%" />
        <col width="8%" />
        <col width="10%" />
        <col width="5%" />
        <col width="5%" />
        <col width="5%" />
        <col width="5%" />
        <col width="5%" />
        <col width="5%" />
        <col width="5%" />
        <col width="5%" />
        <col width="5%" />
        <col width="5%" />
        <col width="5%" />
        <col width="5%" />
      </colgroup>
      <tr class="header">
        <td rowspan="2">考核乡镇</td>
        <td rowspan="2">序号</td>
        <td rowspan="2">河流名称</td>
        <td rowspan="2">监测断面名称</td>
        <td rowspan="2">责任人</td>
        <td colspan="4">监测结果(单位：mg/L)</td>

        <td rowspan="2">{{year}}年{{month}}月水质类别</td>
        <td rowspan="2">2019年12月水质类别</td>
        <td rowspan="2">水质变化（环比）</td>
        <td rowspan="2">2020年01月水质类别</td>
        <td rowspan="2">2019年同期均值水质类别</td>
        <td rowspan="2">水质变化同比</td>
        <td rowspan="2">2020年01月主要污染因子（黑体为污染严重因子）</td>
      </tr>
      <tr class="header">
        <td>溶解氧</td>
        <td>氨氮</td>
        <td>总磷</td>
        <td>高猛酸钾指数</td>
      </tr>

      <template v-for="(river, index) in data">
        <tr v-for="(water, index2) in river.children" :key="index * 100 + index2">
          <td v-if="index === 0 && index2 === 0" :rowspan="total">堰桥</td>
          <td v-if="index2 === 0" :rowspan="river.children.length">{{ river.index }}</td>
          <td v-if="index2 === 0" :rowspan="river.children.length">{{ river.riverName }}</td>
          <td>{{ water.sectionName }}</td>
          <td v-if="index2 === 0" :rowspan="river.children.length">{{ river.managerName }}</td>
          <td>{{ water.rjy }}</td>
          <td>{{ water.ad }}</td>
          <td>{{ water.zl }}</td>
          <td>{{ water.gmsj }}</td>
          <td>{{ water.typeName }}</td>
          <td>III</td>
          <td>恶化</td>
          <td>V</td>
          <td>劣V</td>
          <td>好转</td>
          <td>无</td>
        </tr>
      </template>
      <tr>
        <td rowspan="3" colspan="3">
          《地表水环境质量标准》<br />
          （GB3838-2002）水质标准
        </td>
        <td>III类</td>
        <td></td>
        <td>≥5</td>
        <td>≤1.0</td>
        <td>≤0.2</td>
        <td>≤6</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>IV类</td>
        <td></td>
        <td>≥3</td>
        <td>≤1.5</td>
        <td>≤0.3</td>
        <td>≤10</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>V类</td>
        <td></td>
        <td>≥2</td>
        <td>≤2.0</td>
        <td>≤0.4</td>
        <td>≤15</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>
  </div>
</template>

<script>
import { waterReport } from '@/api/water'
import qs from 'qs'
export default {
  data() {
    return {
      data: [],
      total: 0,
      yearArr: [],
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    }
  },
  created() {
    this.waterReport()
    var currentYear = new Date().getFullYear()
    for (var i=currentYear; i>=2020;i--) {
        this.yearArr.push(i)
    }
  },
  methods: {
    waterReport() {
      waterReport(
        qs.stringify({
          year: this.year,
          month: this.month,
        })
      )
        .then((res) => {
          this.data = res.result.data
          this.total = res.result.totalCount
        })
        .catch((err) => {})
    },
    download() {
      window.open('/water/download?year=' + this.year + '&month=' + this.month)
    }
  },
}
</script>

<style lang="less" scoped>
.tbl {
  border-right: 1px solid gray;
  border-bottom: 1px solid gray;
  background: white !important;
}

.tbl tr {
  height: 25px !important;
}
.tbl td {
  font-size: 11px;
  text-align: center;
  border-top: 1px solid gray;
  border-left: 1px solid gray;
}
</style>