<template>
  <div class="chart-wrapper">
    <LoadingGif :className="'chart-loading'" :loadFlag="loading" :delayTime="0" v-if="loading"></LoadingGif>
    <div class="nodata-box-atc" v-else-if="isNoAtc"></div>
    <div ref="chart" class="charts" v-else-if="seriesData.length > 0"></div>
    <div class="nodata-box" v-if="!loaded ? false : (seriesData.length === 0 ? true : false)"></div>
  </div>
</template>

<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import * as func from './chart'
import loginVue from '../../../login/login.vue'
const list = ['epyp_analy_pinzhongpaihang_', 'epyp_analy_jigoupaihang_', 'epyp_analy_shangshiqushi_', 'epyp_analy_jixing_', 'epyp_analy_atc_']
export default {
  components: {
    LoadingGif
  },
  props: {
    title: String,
    seriesData: {
      type: Array,
      default() {
        return []
      }
    },
    yAxisData: {
      type: Array,
      default() {
        return []
      }
    },
    seriesDataMap: {
      type: Array,
      default() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default() {
        return false
      }
    },
    eIndex: {
      type: Number,
      default() {
        return 0
      }
    },
    isOpen: {
      type: Boolean,
      default() {
        return false
      }
    },
    type: {
      type: String
    },
    mapType: {
      type: String,
      default: 'world'
    },
    mapCheckLock: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      myChart: null,
      cType: '',
      loaded: false
    }
  },
  watch: {
    seriesData() {
      this.myChart && this.myChart.clear()
      if (this.seriesData.length > 0) {
        this.$nextTick(() => {
          this.loaded = true;
          this.initChart()
        })
      }
    },
    loading() {
      this.myChart && this.myChart.clear()
    },
    cType() {
      if (this.seriesData.length > 0) {
        this.myChart && this.myChart.clear()
        this.initChart()
      }
    },
    $route() {
      if (this.$route.path.includes('/analy')) {
        window.addEventListener('resize', this.echartsResizeHandler);
      } else {
        window.removeEventListener('resize', this.echartsResizeHandler);
        this.echartsClear('open-charts');
        this.echartsClear('echarts');
      }
    }
  },
  computed: {
    conditions() {
      return this.$store.state.Epyp.conditions
    },
    isNoAtc() {
      let atcs_sel = false
      _.forEach(this.conditions, (item) => {
        if (item.name === 'atc') {
          if (item.atcs_sel) {
            atcs_sel = true
          };
        };
      })
      return atcs_sel && this.eIndex === 6
    }
  },
  methods: {
    getImgName() {
      return `药智数据企业版-${document.title}-智能分析-${this.title}`
    },
    initChart() {
      let el = this.$refs.chart
      const { seriesData, seriesDataMap, yAxisData, changeType, openDialog } = this
      switch (this.cType) {
        case ('line'):
          this.myChart = func.initLine(el, yAxisData, seriesData, openDialog, this)
          break;
        case ('pie'):
          this.myChart = func.initPie(el, yAxisData, seriesDataMap, changeType, openDialog, this)
          break;
        case ('bar'):
          this.myChart = func.initBar(el, yAxisData, seriesData, changeType, openDialog, this)
          break;
      }
    },
    openDialog(i) {
      this.$emit('openDialog', i)
      window.ga("send", "event", "button", "click", list[i] + 'quanping')
      window._paq.push(['trackEvent', 'button', 'click', list[i] + 'quanping',])

    },
    changeType(value) {
      let gatype = ''
      if (value === 'bar') {
        gatype = 'zhuxingtu'
      } else if (value === 'pie') {
        gatype = 'bingzhuangtu'
      }
      if (gatype) {
        window.ga("send", "event", "button", "click", list[this.eIndex] + gatype)
        window._paq.push(['trackEvent', 'button', 'click', list[this.eIndex] + gatype,])

      }
      this.cType = value
    },
    changeMapType() {
      window.ga("send", "event", "button", "click", "epyp_analy_diqu_qiehuan")
      window._paq.push(['trackEvent', 'button', 'click', 'epyp_analy_diqu_qiehuan',])

      let val = this.mapType === 'world' ? 'china' : 'world'
      this.$emit('changeMapType', val)
    },
    echartsResizeHandler() {
      if (this.isOpen) {
        this.$parent.initLayout && this.$parent.initLayout()
      }
      this.myChart && this.myChart.resize()
    }
  },
  created() {
    this.cType = this.type
  },
  mounted() {
    window.addEventListener('resize', this.echartsResizeHandler);
  }
}
</script>

<style scoped lang="less">
.chart-wrapper {
  width: calc(100%);
  height: 400PX;

  .charts {
    width: calc((100vw - 240px - 10px - 16px - 40px)/2);
    height: 400PX;
  }
}

.nodata-box {
  background: url(/static/imgs/nodata.png) center center no-repeat;
  width: 100%;
  height: 100%;
}

.nodata-box-atc {
  background: url(/static/imgs/nodata_atc.png) center center no-repeat;
  width: 100%;
  height: 100%;
}

.chart-loading {
  transition: all 300ms 50ms;
  z-index: 2000;
  width: 100%;
  height: 100%;
  background: rgba(254, 254, 254, 0.7);
  text-align: center;
  overflow: hidden;
  position: relative;

  /deep/.normal-size-loading {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}

@media screen and (max-width: 1500px) {
  .chart-wrapper {

    .charts {
      width: calc(100vw - 240px - 10px - 16px);
      height: 400PX;
    }
  }
}
</style>
