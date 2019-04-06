<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="CPU" :percent="true" :total="cpuInfo.usedPerc">
          <a-tooltip title="CPU使用率" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area :data="cpuData" />
          </div>
          <template slot="footer">
            核心数<span> {{ cpuInfo.cpuNum }}</span><a-divider type="vertical" />
            最大功率<span> {{ cpuInfo.maxGhz }}</span><a-divider type="vertical" />
            实时频率<span> {{ cpuInfo.currGhz }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="内存" :percent="true" :total="memInfo.usedPerc">
          <a-tooltip title="内存使用率" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            已用内存<span> {{ memInfo.used }}</span><a-divider type="vertical" />
            剩余内存<span> {{ memInfo.free }}</span>
          </div>
          <template slot="footer">总内存<span>{{ memInfo.total }}</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="JVM" :percent="true" :total="jvmInfo.usedPerc">
          <a-tooltip title="JVM使用率" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            已用内存<span> {{ jvmInfo.used }}</span><a-divider type="vertical" />
            剩余内存<span> {{ jvmInfo.free }}</span>
          </div>
          <template slot="footer">总内存<span>{{ jvmInfo.total }}</span></template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card title="服务器信息" :bordered="false">
      <detail-list :col="2">
        <detail-list-item term="服务器名称">WIN-3E3H6JHL0VD</detail-list-item>
        <detail-list-item term="操作系统">Windows Server 2008 R2, 版本 6.1</detail-list-item>
        <detail-list-item term="服务器IP">192.168.0.104</detail-list-item>
        <detail-list-item term="系统架构">amd64</detail-list-item>
      </detail-list>
    </a-card>

    <a-card title="Java虚拟机信息" style="margin-top: 24px" :bordered="false">
      <detail-list :col="2">
        <detail-list-item term="Java名称">Java HotSpot(TM) 64-Bit Server VM</detail-list-item>
        <detail-list-item term="Java版本">1.8.0_121-b13 / 25.121-b13, 供应商 Oracle Corporation</detail-list-item>
        <detail-list-item term="启动时间">2019-03-21 22:50:58</detail-list-item>
        <detail-list-item term="运行时长">15天17时2分25秒</detail-list-item>
        <detail-list-item term="安装路径">*** 演示模式，不展示数据 ***</detail-list-item>
        <detail-list-item term="启动参数">*** 演示模式，不展示数据 ***</detail-list-item>
      </detail-list>
    </a-card>

    <a-card title="平台参数" style="margin-top: 24px" :bordered="false">
      <detail-list :col="1">
        <detail-list-item term="当前工作路径">*** 演示模式，不展示数据 ***</detail-list-item>
        <detail-list-item term="日志存放路径">*** 演示模式，不展示数据 ***</detail-list-item>
        <detail-list-item term="上传文件路径">*** 演示模式，不展示数据 ***</detail-list-item>
      </detail-list>
    </a-card>

    <!-- 操作 -->
    <a-card
      title="磁盘状态"
      style="margin-top: 24px"
      :bordered="false"
    >
      <a-table
        rowKey="id"
        :columns="diskColumns"
        :dataSource="diskData"
        :pagination="false"
      >
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'
import { PageView } from '@/layouts'
import DetailList from '@/components/tools/DetailList'
import { ChartCard, MiniArea } from '@/components'
import moment from 'moment'

const DetailListItem = DetailList.Item

export default {
  name: 'Advanced',
  components: {
    ChartCard,
    MiniArea,
    PageView,
    DetailList,
    DetailListItem
  },
  mixins: [mixinDevice],
  data () {
    return {
      loading: true,
      timer: null,
      cpuData: [],
      cpuInfo: {
        cpuNum: '2个',
        maxGhz: '2.34Ghz',
        currGhz: '1.79Ghz',
        usedPerc: 12
      },
      memInfo: {
        total: '6.000GB',
        free: '1.503GB',
        used: '4.497GB',
        usedPerc: 75
      },
      jvmInfo: {
        total: '1006MB',
        free: '286.747MB',
        used: '719.253MB',
        usedPerc: 91
      },
      diskColumns: [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '盘符路径',
          dataIndex: 'path'
        },
        {
          title: '文件系统',
          dataIndex: 'system'
        },
        {
          title: '盘符类型',
          dataIndex: 'type'
        },
        {
          title: '总大小',
          dataIndex: 'total'
        },
        {
          title: '可用大小',
          dataIndex: 'free'
        },
        {
          title: '已用大小',
          dataIndex: 'used'
        },
        {
          title: '已用百分比',
          dataIndex: 'usedPerc'
        }
      ],
      diskData: [
        {
          id: 1,
          path: 'C:\\',
          system: 'NTFS',
          type: 'local',
          total: '29.998GB',
          free: '3.580GB',
          used: '26.418GB',
          usedPerc: '89%'
        }
      ]
    }
  },
  filters: {
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
    clearInterval(this.timer)
    this.timer = null
    this.setTimer()
  },
  destroyed: function () {
    // 每次离开当前界面时，清除定时器
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    setTimer () {
      if (this.timer == null) {
        this.timer = setInterval(() => {
          this.loadCpuInfo()
        }, 1000)
      }
    },
    loadCpuInfo () {
      this.cpuData.push({
        x: moment(new Date().getTime()).format('YYYY-MM-DD hh:mm:ss'),
        y: Math.round(Math.random() * 100)
      })
      if (this.cpuData.length > 10) {
        this.cpuData = this.cpuData.slice(1)
      }
      console.log('this.cpuData', this.cpuData)
    }
  }
}
</script>

<style lang="less" scoped>
  .no-data {
    color: rgba(0, 0, 0, .25);
    text-align: center;
    line-height: 64px;
    font-size: 16px;

    i {
      font-size: 24px;
      margin-right: 16px;
      position: relative;
      top: 3px;
    }
  }
</style>
