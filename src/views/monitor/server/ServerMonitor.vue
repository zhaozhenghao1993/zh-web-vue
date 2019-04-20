<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="CPU" :percent="true" :total="cpuInfo.usedPercent">
          <a-tooltip title="CPU使用率" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area :data="cpuData" />
          </div>
          <template slot="footer">
            核心数<span> {{ cpuInfo.cpuNum }}</span>个
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="内存" :percent="true" :total="memInfo.usedPercent">
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
        <chart-card :loading="loading" title="JVM" :percent="true" :total="jvmInfo.usedPercent">
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
        <detail-list-item term="服务器名称">{{ serverInfo.serverName }}</detail-list-item>
        <detail-list-item term="操作系统">{{ serverInfo.osName }}</detail-list-item>
        <detail-list-item term="服务器IP">{{ serverInfo.serverIp }}</detail-list-item>
        <detail-list-item term="系统架构">{{ serverInfo.osArch }}</detail-list-item>
      </detail-list>
    </a-card>

    <a-card title="Java虚拟机信息" style="margin-top: 24px" :bordered="false">
      <detail-list :col="2">
        <detail-list-item term="Java名称">{{ javaInfo.name }}</detail-list-item>
        <detail-list-item term="Java版本">{{ javaInfo.version }}</detail-list-item>
        <detail-list-item term="启动时间">{{ javaInfo.startTime }}</detail-list-item>
        <detail-list-item term="运行时长">{{ javaInfo.runTime }}</detail-list-item>
        <detail-list-item term="安装路径">{{ javaInfo.home }}</detail-list-item>
      </detail-list>
    </a-card>

    <a-card title="平台参数" style="margin-top: 24px" :bordered="false">
      <detail-list :col="1">
        <detail-list-item term="当前工作路径">{{ appInfo.appDir }}</detail-list-item>
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
        rowKey="dirName"
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
import { baseInfo, instantInfo } from '@/api/monitor/server'

const DetailListItem = DetailList.Item

export default {
  name: 'ServerMonitor',
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
      cpuInfo: {},
      memInfo: {},
      jvmInfo: {},
      serverInfo: {},
      javaInfo: {},
      appInfo: {},
      diskColumns: [
        {
          title: '盘符路径',
          dataIndex: 'dirName'
        },
        {
          title: '文件系统',
          dataIndex: 'fileSystem'
        },
        {
          title: '盘符类型',
          dataIndex: 'diskType'
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
          dataIndex: 'usedPercent'
        }
      ],
      diskData: []
    }
  },
  filters: {
  },
  created () {
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
    clearInterval(this.timer)
    this.timer = null
    this.setTimer()
    this.loadBaseInfo()
    this.loadInstantInfo()
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
          this.loadInstantInfo()
        }, 5000)
      }
    },
    loadInstantInfo () {
      instantInfo().then(response => {
        const data = response.data
        this.cpuInfo = data.cpu
        this.memInfo = data.mem
        this.jvmInfo = data.jvm
        this.cpuData.push({
          x: moment(new Date().getTime()).format('YYYY-MM-DD hh:mm:ss'),
          y: data.cpu.usedPercent
        })
        if (this.cpuData.length > 10) {
          this.cpuData = this.cpuData.slice(1)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    loadBaseInfo () {
      baseInfo().then(response => {
        const data = response.data
        this.serverInfo = data.sys
        this.javaInfo = data.jvm
        this.appInfo = data.app
        this.diskData = data.sysDisks
      })
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
