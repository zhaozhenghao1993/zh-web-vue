<template>
  <div :style="{ padding: '20px 0px 8px 24px' }">
    <div :id="id"></div>
  </div>
</template>

<script>
import G2 from '@antv/g2'

export default {
  name: 'G2Line',
  data () {
    return {
      chart: null
    }
  },
  props: {
    xScale: {
      type: Object,
      required: true
    },
    yScale: {
      type: Object,
      required: true
    },
    dataSource: {
      type: Array,
      required: true,
      default () {
        return {
          data: []
        }
      }
    },
    id: {
      type: String,
      default: 'g2'
    },
    height: {
      type: Number,
      default: 300
    }
  },
  mounted () {
    this.drawChart()
  },
  methods: {
    drawChart () {
      this.chart = new G2.Chart({
        container: this.id,
        forceFit: true,
        height: this.height,
        padding: ['auto', 'auto', '40', '30']
      })
      this.chart.source(this.dataSource)
      this.chart.scale('y', this.yScale)
      this.chart.scale('x', this.xScale)
      this.chart.tooltip({
        crosshairs: {
          type: 'line'
        }
      })
      this.chart.line().position('x*y')
      this.chart.point().position('x*y').size(4).shape('circle').style({
        stroke: '#fff',
        lineWidth: 1
      })
      this.chart.render()
    }
  }
}
</script>
