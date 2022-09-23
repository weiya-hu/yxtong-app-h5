<template>
  <div class="analy-wrapeer">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="analyLoading" v-if="analyLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="chart">
      <!-- 顶部统计 -->
      <div class="chart_top">
        <div class="newtotals">
          <div class="newtotals-scroll">
            <div class="newtotals-scroll-inner" v-if="!analyLoading">
              <ul class="total-item">
                <li class="li1">上市数量</li>
                <li class="li2">总计<span>{{ basic.pizhunwenhao_count }}</span>个</li>
              </ul>
              <ul class="total-item">
                <li class="li1">上市品种</li>
                <li class="li2">总计<span>{{ basic.yaopinmingzi_count }}</span>个</li>
              </ul>
              <ul class="total-item">
                <li class="li1">剂型</li>
                <li class="li2">总计<span>{{ basic.guifanjixing_count }}</span>个</li>
              </ul>
              <ul class="total-item">
                <li class="li1">药品品规</li>
                <li class="li2">总计<span>{{ basic.yaopinmingzi_guige_count }}</span>个</li>
              </ul>
              <ul class="total-item">
                <li class="li1">上市企业</li>
                <li class="li2">总计<span>{{ basic.qiyemingzi_count }}</span>个</li>
              </ul>
              <ul class="total-item">
                <li class="li1">上市年份</li>
                <li class="li2">总计<span>{{ basic.nianfen_count }}</span>个</li>
              </ul>
              <ul class="total-item">
                <li class="li1">上市地区和进口国家</li>
                <li class="li2">总计<span>{{ basic.guojia_count }}</span>个</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="back-list">
        <router-link to="/cfdadrug">返回列表</router-link>
      </div>
      <div class="chart_bottom">
        <div class="chart-boxes">
          <DbEcharts :title="item.title" v-for="(item, i) in chartsArr" :key="item.title">
            <div class="echarts">
              <my-chart @openDialog="handleDialogVisible" :type="item.type" :title="item.title" :eIndex="i"
                :mapCheckLock="mapCheckLock" @changeMapType="changeMapType" :mapType="mapType" :isOpen="dialogVisible"
                :seriesData="item.data.seriesData" :seriesDataMap="item.data.seriesDataMap ? item.data.seriesDataMap : []"
                :yAxisData="item.data.yAxisData ? item.data.yAxisData : []"
                :loading="item.data.loading ? item.data.loading : false">
              </my-chart>
            </div>
          </DbEcharts>
        </div>
      </div>
      <!-- 展开效果 -->
      <div class="dialog" v-if="dialogVisible">
        <div class="menu">
          <div v-for="(ti, index) in chartsArr" v-bind:class="[index == openIndex ? 'active' : '', 'nav']"
            @click="handleOpenIndex(index)" :key="index">
            {{ ti.title }}
          </div>
        </div>
        <div class="echarts-items-wap">
          <div class="echarts-items-title">
            <span class="echart-title">{{ chartsArr[openIndex].title }}</span>
            <a class="esc-btn" href="javascript:;" @click="dialogVisible = false"><i></i><img
                src="/static/imgs/echarts/esc-fullscreen.png" alt="退出全屏"></a>
          </div>
          <div class="echarts-items">
            <!-- 申报趋势 -->
            <div class="echarts-item" v-for="item in chartsArr" :key="item.title">
              <!-- 折线图 -->
              <div class="open-charts">
                <my-chart @openDialog="handleDialogVisible" ref="myChart" :title="item.title" :type="item.type"
                  :mapCheckLock="mapCheckLock" :mapType="mapType" @changeMapType="changeMapType"
                  :seriesData="item.data.seriesData" :isOpen="dialogVisible"
                  :seriesDataMap="item.data.seriesDataMap ? item.data.seriesDataMap : []"
                  :yAxisData="item.data.yAxisData ? item.data.yAxisData : []"
                  :loading="item.data.loading ? item.data.loading : false">
                </my-chart>
              </div>
            </div>
          </div>
          <div class="ctr-actions">
            <el-button class="pre action" @click="handleOpenIndex(openIndex - 1)"><i class="el-icon-arrow-left"></i>
            </el-button>
            <el-button class="next action" @click="handleOpenIndex(openIndex + 1)"><i class="el-icon-arrow-right"></i>
            </el-button>
          </div>
          <div class="nodata-box fullcharts hide">
            <div class="nodata-box"></div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import DbEcharts from "@/components/common/db-echarts"
import MyChart from './children/MyChart'
import { mapState, mapGetters } from "vuex"

const types = ['yaopingpaihang', 'qiyepaihang', 'shangshiqushi', 'guojia', 'zhiliaolinyu', 'xinji', 'yb', 'yaopingleibie']

export default {
  components: {
    DbEcharts,
    MyChart,
    LoadingGif
  },
  data() {
    return {
      itemWidth: 700,
      mapType: 'world',
      promise: null,
      loading: true,
      dialogVisible: false,
      initopen: false, //控制渲染一次
      openIndex: 0, //控制展开第几个图形
      basic: {
        pizhunwenhao_count: '',
        yaopinmingzi_count: '',
        guifanjixing_count: '',
        yaopinmingzi_guige_count: '',
        qiyemingzi_count: '',
        nianfen_count: '',
        guojia_count: ''
      },
      qiyepaihang: {
        yAxisData: [],
        seriesData: [],
        loading: false
      },
      yaopingpaihang: {
        yAxisData: [],
        seriesData: [],
        loading: false
      },
      shangshiqushi: {
        yAxisData: [],
        seriesData: [],
        loading: false
      },
      guojia: {
        yAxisData: [],
        seriesData: [],
        seriesDataMap: [],
        loading: false
      },
      world: {
        yAxisData: [],
        seriesData: [],
        seriesDataMap: [],
        loading: false
      },
      xinji: {
        yAxisData: [],
        seriesData: [],
        seriesDataMap: [],
        loading: false
      },
      yaopingleibie: {
        yAxisData: [],
        seriesData: [],
        seriesDataMap: [],
        loading: false
      },
      yb: {
        yAxisData: [],
        seriesData: [],
        seriesDataMap: [],
        loading: false
      },
      zhiliaolinyu: {
        yAxisData: [],
        seriesData: [],
        seriesDataMap: [],
        loading: false
      },
      mapCheckLock: false
    }
  },
  computed: {
    ...mapState({
      kshRes: state => state.CfdaDrug.kshRes,
      nopms: state => state.CfdaDrug.nopms,
      analyLoading: state => state.CfdaDrug.analyLoading,
      analyCount: state => state.CfdaDrug.analyCount,
      allBase: state => state.CfdaDrug.allBase,
      activeTabName: state => state.CfdaDrug.tabname,
      res1: state => state.CfdaDrug.res1,
      res2: state => state.CfdaDrug.res2,
      res3: state => state.CfdaDrug.res3,
    }),
    noData() {
      return !this.res1.res && !this.res2.res && !this.res3.res
    },
    chartsArr() {
      return [
        {
          title: '药品排行',
          type: 'bar',
          data: this.yaopingpaihang
        },
        {
          title: '企业排行',
          type: 'bar',
          data: this.qiyepaihang
        },
        // {
        //   title:'上市趋势',
        //   type: 'line',
        //   data: this.shangshiqushi
        // },
        {
          title: '上市地区和进口国家',
          type: 'map',
          data: this.mapType !== 'world' ? this.guojia : this.world
        },
        {
          title: 'ATC分类',
          type: 'bar',
          data: this.zhiliaolinyu
        }, {
          title: '剂型',
          type: 'bar',
          data: this.xinji
        }, {
          title: '医保分类',
          type: 'pie',
          data: this.yb
        }, {
          title: '药品类别',
          type: 'pie',
          data: this.yaopingleibie
        }
      ]
    }
  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {
        this.$nextTick(() => {
          this.initLayout()
          this.$refs.myChart.forEach((item) => {
            item.myChart && item.myChart.resize()
          })
        })
      }
    },
    $route: {
      handler(val) {
        if (val.path === '/cfdadrug/analy' && this.kshRes) {
          this.getAllKshRes()
          this.$store.commit('CfdaDrug/kshRes', false)
        }
        if (this.$route.path === '/cfdadrug/analy') {
          window.addEventListener('resize', this.echartsResizeHandler);
        } else {
          window.removeEventListener('resize', this.echartsResizeHandler);
        }
        if (this.$route.path === '/cfdadrug/list') {
          //智能分析重新搜索清空列表数据tab无法自动复位
          let tabname = this.activeTabName
          Store.commit('CfdaDrug/tabname', '')
          Store.commit('CfdaDrug/tabname', tabname)
          this.noData && Store.dispatch('CfdaDrug/nomalSearch', { queryToPutong: false, tabs: true })
        }
      },
      deep: true
    },
    kshRes: {
      handler(val) {
        if (val && this.$route.path === '/cfdadrug/analy') {
          this.getAllKshRes()
          this.$store.commit('CfdaDrug/kshRes', false)
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    initLayout() {
      let screen_width = window.innerWidth;
      let screen_height = window.innerHeight;
      this.itemWidth = screen_width - 244;
      $(".dialog .echarts-items-wap").css("height", screen_height - 50);
      $(".dialog .echarts-items-wap").css("width", screen_width - 244);
      $(".dialog .echarts-items").width((this.itemWidth + 12) * 10);
      $(".dialog .echarts-item").width(this.itemWidth - 100);
      $(".echarts-items").css("margin-left", -this.openIndex * this.itemWidth);
    },
    handleOpenIndex(index) {
      if (index > 0 && index < this.chartsArr.length) {
        this.openIndex = index;
      } else {
        this.openIndex = 0;
      }
      $(".echarts-items").css("margin-left", -this.openIndex * this.itemWidth);
    },
    getAllKshRes() {
      this.$store.dispatch('CfdaDrug/getKshResMethods').then(res => {
        this.basic = res.BasicCount
        this.getKsh(0)
      })
    },
    getKsh(i) {
      const count_type = types[i]
      this[count_type].loading = true
      this.$store.dispatch('CfdaDrug/getKshResMethods', { count_type }).then(res => {
        this[count_type].loading = false
        if (i !== types.length - 1) {
          this.getKsh(i + 1)
        }
        if (count_type === 'shangshiqushi') {
          this[count_type] = this.getLineData(res[count_type])
        } else if (count_type === 'yaopingpaihang') {
          this[count_type] = this.getBarData(res[count_type], 'yaopinmingzi', 'yaopinmingzi_count')
        } else if (count_type === "qiyepaihang") {
          this[count_type] = this.getBarData(res[count_type], 'qiye', 'num')
        } else {
          let set = {}
          switch (count_type) {
            case 'guojia':
              set = ['guojia', 'guojia_count']
              break
            case 'yb':
              set = ['yblb', 'yblb_count']
              break
            case 'yaopingleibie':
              set = ['yaopingleibie', 'yaopingleibie_count']
              break
            case 'xinji':
              set = ['guifanjixing', 'guifanjixing_count']
              break
            case 'zhiliaolinyu':
              set = ['name', 'num']
              break
          }
          if (count_type === 'guojia') {
            this.world = this.getPieData(res[count_type].jk, set[0], set[1])
            this.guojia = this.getPieData(res[count_type].gc, set[0], set[1])
            if (this.world.seriesData.length === 0) {
              this.mapType = 'china'
            }
            try {
              this.mapCheckLock = res[count_type].jk.length === 0 || res[count_type].gc.length === 0
                ? true
                : false
            } catch (e) {
              this.mapCheckLock = false
            }
          } else {
            this[count_type] = this.getPieData(res[count_type], set[0], set[1])
          }
        }
      })
    },
    changeMapType(val) {
      this.mapType = val
    },
    getLineData(data) {
      let yAxisData = []
      let seriesData = data instanceof Array ? [] : [[], [], []]
      Object.keys(data).forEach(key => {
        yAxisData.push(key)
        seriesData[0].push(data[key].total)
        seriesData[1].push(data[key].gc)
        seriesData[2].push(data[key].jk)
      })
      return {
        seriesData,
        yAxisData
      }
    },
    handleDialogVisible(index) {
      this.dialogVisible = true;
      this.openIndex = index
    },
    getBarData(data, key, value) {
      data.sort((a, b) => {
        return a[value] - b[value]
      })
      let seriesData = []
      let yAxisData = []
      data.forEach(item => {
        seriesData.push(item[value])
        yAxisData.push(item[key])
      })
      return {
        seriesData,
        yAxisData
      }
    },
    getPieData(data, key, value) {
      data = data ? data : []
      data.sort((a, b) => {
        return a[value] - b[value]
      })
      let seriesData = []
      let yAxisData = []
      let seriesDataMap = data.map(item => {
        seriesData.push(item[value])
        yAxisData.push(item[key])
        item.value = item[value]
        item.name = item[key]
        return item
      })
      return {
        seriesData,
        yAxisData,
        seriesDataMap
      }
    }
  },
  created() {
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', this.allBase.dbname])
    }, 1000);
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.ksh)
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.ksh)
    this.vueTogglePmsTooltip()
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.pc-cfdadrug-analy {

  .nodata,
  .nodata-box,
  .nodata-box-atc {
    width: 100%;
    height: 100%;
  }

  .nodata-box-atc {
    background: url(/static/imgs/nodata_atc.png) center center no-repeat;
  }

  .nodata-box,
  .nodata {
    background: url(/static/imgs/nodata.png) center center no-repeat;
  }

  .fullcharts.nodata-box {
    position: absolute;
    top: 40px;
    height: calc(100vh - 40px - 48px - 80px);
    background: #fff;
  }

  .chart {
    .chart_top {
      position: relative;

      .newtotals {
        // margin-top: 20px!important;
        height: 130px;
        background-color: @White;
        box-shadow: 0 0;
        // border-top: 1px solid #dfe5f1;
        overflow: hidden;
        display: flex;
        justify-content: center;
        position: relative;

        .newtotals-scroll {
          width: 100%;
          overflow: hidden;
          position: relative;

          .newtotals-scroll-inner {
            position: absolute;
            width: 100%;
            top: 0px;
            left: 0px;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            flex-wrap: nowrap;

            .total-item {
              flex: 1;
            }
          }
        }

        .newtotals-arrow {
          display: none;
          height: 170px;
          line-height: 170px;
          width: 30px;
          color: @PrimaryColor;
          font-size: 20px;
          text-align: center;
          position: absolute;
          top: 0px;
          cursor: pointer;

          &:hover {
            background-color: rgba(222, 222, 222, 0.5);
          }
        }

        .newtotals-left {
          left: 0px
        }

        .newtotals-right {
          right: 0px
        }

        .newtotals-disabled {
          color: #aaa;
          cursor: normal;

          &:hover {
            background-color: transparent;
          }
        }

        .total-item {
          float: left;
          box-sizing: border-box;
          width: 150px;
          height: 130px;
          text-align: center;
          vertical-align: text-bottom;
          border-bottom: 3px solid @White;

          &:hover {
            color: @PrimaryColor;
            background-color: #eff2fa;
            border-bottom: 3px solid @PrimaryColor;
          }

          .li1 {
            padding-top: 30px;
            font-size: 13px;
            font-weight: 600;
          }

          .li2 {
            font-size: 14px;

            span {
              font-size: 24px;
              color: @PrimaryColor;
            }
          }
        }
      }
    }

    .chart-boxes {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .echarts {
      box-sizing: border-box;
      display: inline-block;
      margin: 50px 10px 20px 10px;
      width: calc(100% - 20px);
      height: 400px;
    }

    .hide {
      display: none;
    }

    .dialog {
      position: fixed;
      z-index: 99999;
      top: 48px;
      left: 0px;
      width: 100%;
      height: calc(100% - 48px);
      background-color: @PrimaryBackgroundColor;

      .menu {
        position: fixed;
        left: 0px;
        top: 48px;

        .nav {
          width: 220px;
          padding-left: 20px;
          line-height: 40px;
          border-left: 4px solid @PrimaryBackgroundColor;
          border-bottom: 1px dashed @BorderColor;
          cursor: pointer;

          &.active,
          &:hover {
            border-left: 4px solid @PrimaryColor;
            border-bottom: 0px;
            background-color: #fff;
            color: @PrimaryColor;
            box-shadow: @BoxShadow;
          }
        }
      }

      .echarts-items-wap {
        width: calc(100% - 250px) !important;
        height: 100% !important;
        position: absolute;
        // overflow-y: scroll;
        overflow-x: hidden;
        top: 0px;
        left: 250px;
        background-color: #fff;
        box-shadow: @BoxShadow;

        .echarts-items-title {
          position: relative;
          padding-right: 40px;
          background-color: @PrimaryBackgroundColor;
          line-height: 40px;
          text-align: right;

          .echart-title {
            position: absolute;
            left: 18px;
          }

          .esc-btn {
            display: inline-block;
            height: 100%;
            font-size: 13px;

            img {
              display: inline-block;
              margin-top: 10px;
            }
          }
        }

        .echarts-items {
          width: 1414px * 10;
          height: 700px;
          overflow-y: scroll;
          overflow-x: hidden;

          .echarts-item {
            display: inline-block;
            margin: 0px 50px;
            width: 1300px;
            height: 100%;
          }

          .open-charts {
            width: 100%;
            height: 700px;
          }
        }

        .ctr-actions {
          padding: 100px 0px 20px;
          text-align: center;

          .action {
            cursor: pointer;
            padding: 5px;
          }
        }
      }
    }

    .chart_top {
      background-color: #eff2fa;
    }

    .chart_bottom {
      background-color: #eff2fa;
      padding: 0;
    }

    .back-list {
      width: 100%;
      line-height: 30px;
      height: 22px;
      text-align: right;
      background: #eff2fa;
      padding-right: 40px;
      box-sizing: border-box;
      font-size: 14px;

      a:hover {
        color: #4877e8;
      }
    }
  }
}
</style>
