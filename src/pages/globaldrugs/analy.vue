<template>
  <div class="analy-wrapeer">
    <div class="globaldrugs-container">
      <div class="title-container">
        <div class="title">全球药物-智能分析</div>
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="allBase.dbname">
          <span style="float:left;font-weight:400;">当前位置：</span>
          <el-breadcrumb-item><a href="/home" style="font-weight:400;" @click.prevent.stop="tongjiHandler('首页')">首页</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="this.route.indexOf('analysis')>-1"><a style="font-weight:400;"
              :href="'/'+allBase.dbename" @click.prevent.stop="tongjiHandler(allBase.dbename)">{{ allBase.dbname
              }}</a></el-breadcrumb-item>
          <el-breadcrumb-item v-else style="font-weight:400;">{{ allBase.dbname}}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="this.route.indexOf('analysis')>-1" style="font-weight:400;">智能分析
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 条件筛选面板开始 -->
      <div class="filter-panel" v-waiting="filtersAnalyLoading">
        <Optioned @showSavedPop="showSavedPop" @clearTheLeft="clearTheLeft" @clearLeft="clearLeft"
          vuex_name="Globaldrugs" route1="list" route2="analysis" route3="qb"></Optioned>
        <!-- 普通搜索项 -->
        <div class="normal-container">
          <div class="normal" v-for="(item,index) in vueHandleInitPutong(nomal_filedAnaly)" :key="index">
            <Normal @nomalSearch="nomalSearch" vuex_name="Globaldrugs" api_name="globaldrugs" :item="item"
              route1="analysis" route2="qb" :key="index" ref="ileft"></Normal>
          </div>
          <!-- <div class="high" @click="showHighModal">高级搜索</div> -->
        </div>
        <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->
        <Filters ref="filterAnaly" vuex_name="Globaldrugs" route1="list" route2="analysis" @clearPhase="clearPhase">
        </Filters>
        <img src="@/assets/imgs/globaldrugs/shouqi.png" class="toggle-icon" :style="{
          transform: toggleStatus? 'rotate(180deg)':'rotate(0)','transform-origin': 'center'
        }" width="60" height="10" @click="togglePanel" />
      </div>
      <!-- 条件筛选面板结束 -->

      <!-- 图表开始 -->
      <div class="echarts-panel">
        <div class="analy-type fl">
          <div :class="['analy-type-item',panelIndex==0? 'checked':'']" @click="showEchartPanel(0)">
            药品分析
          </div>
          <div class="line"></div>
          <div :class="['analy-type-item',panelIndex==1? 'checked':'']" @click="showEchartPanel(1)">
            靶点分析
          </div>
          <div class="line"></div>
          <div :class="['analy-type-item',panelIndex==2? 'checked':'']" @click="showEchartPanel(2)">
            适应症分析
          </div>
        </div>

        <!-- 药品分析开始 -->
        <!-- <div v-show="panelIndex === 0" class="panel">
          <div class="chart_bottom">
            <div class="chart-boxes">
              <DbEcharts title="最高研发阶段">
                <div id="zgyfjd-bar-globaldrugs" class="echarts">
                  <div class="nodata-box"></div>
                </div>
              </DbEcharts>
              <DbEcharts title="药品分类">
                <div id="ypfl-dought-globaldrugs" class="echarts">
                  <div class="nodata-box"></div>
                </div>
              </DbEcharts>
              <DbEcharts title="药品类型">
                <div id="yplx-pie-globaldrugs" class="echarts">
                  <div class="nodata-box"></div>
                </div>
              </DbEcharts>
              <DbEcharts title="特殊审评">
                <div id="tssp-dought-globaldrugs" class="echarts">
                  <div class="nodata-box"></div>
                </div>
              </DbEcharts>
              <DbEcharts title="治疗领域">
                <div id="zlly-stackbar-globaldrugs" class="echarts">
                  <div class="nodata-box"></div>
                </div>
              </DbEcharts>
              <DbEcharts title="靶点排行">
                <div id="bdph-stackbar-globaldrugs" class="echarts">
                  <div class="nodata-box"></div>
                </div>
              </DbEcharts>
              <keep-alive>
                <div class="chart-box">
                  <div class="analy-type chart-title fl">
                    <div :class="['analy-type-item', panelChildIndex === 0 ? 'check' : '']"
                      @click="showEchartChildPanel(0)">
                      已批准适应症排行
                    </div>
                    <div class="line"></div>
                    <div :class="['analy-type-item', panelChildIndex === 1 ? 'check' : '']"
                      @click="showEchartChildPanel(1)">
                      在研适应症排行
                    </div>
                    <div class="line"></div>
                    <div :class="['analy-type-item', panelChildIndex === 2 ? 'check' : '']"
                      @click="showEchartChildPanel(2)">
                      终止适应症排行
                    </div>
                  </div>

                  <div v-show="panelChildIndex === 0" id="ypzsyzph-stackbar-globaldrugs" class="echarts">
                    <div class="nodata-box"></div>
                  </div>
                  <div v-show="panelChildIndex === 1" id="zysyzph-stackbar-globaldrugs" class="echarts">
                    <div class="nodata-box"></div>
                  </div>
                  <div v-show="panelChildIndex === 2" id="zzsyzph-stackbar-globaldrugs" class="echarts">
                    <div class="nodata-box"></div>
                  </div>
                </div>
              </keep-alive>
              <DbEcharts title="原研单位排行">
                <div id="yydwph-stackbar-globaldrugs" class="echarts">
                  <div class="nodata-box"></div>
                </div>
              </DbEcharts>
            </div>
          </div>
        </div> -->
        <keep-alive>
          <!-- 药品分析 -->
          <Ywfx v-if="panelIndex===0" />

          <!-- 靶点分析 -->
          <Bdfx ref="bdfx" v-else-if="panelIndex===1" />

          <!-- 适应症分析 -->
          <Syzfx ref="syzfx" v-else-if="panelIndex===2" />
        </keep-alive>
      </div>
      <!-- 图表结束 -->
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import { mapState } from "vuex";
import Normal from '@/components/common/globaldrugs/analy/normal'
import Optioned from "@/components/common/globaldrugs/analy/options";
import Filters from '@/components/common/globaldrugs/analy/filters-config'
import Ywfx from "./analy/ywfx";
import Bdfx from "./analy/bdfx";
import Syzfx from "./analy/syzfx";

var _res = {};
const myicon = {
  open:
    "path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891"
};

export default {
  components: {
    LoadingGif,
    Normal,
    Filters,
    Ywfx,
    Bdfx,
    Syzfx,
    Optioned
  },
  data() {
    return {
      savedPopVisible: false,
      marked: false,  // 是否是第一次记录面板高度
      toggleStatus: false, // 默认是展开的
      route: this.$route.path.split('/')[2],
      searchState: {
        putongAnaly: {},
        gaojiAnaly: {},
        shaixuanAnaly: {},
        fourthAnaly: {}
      },
      filterPanelH: 0 // 筛选面板高度 这里是顶部加载完后 获取高度 用于收缩展开的动画设置高度用
    };
  },
  computed: {
    ...mapState({
      ypfxBdrd_param: state => state.Globaldrugs.ypfxBdrd_param,
      syzfxSyzrd_param: state => state.Globaldrugs.syzfxSyzrd_param,
      names: state => state.Normal.names,
      bdfxLoading: state => state.Globaldrugs.bdfxLoading,
      syzfxLoading: state => state.Globaldrugs.syzfxLoading,
      filtersAnalyLoading: state => state.Globaldrugs.filtersAnalyLoading,
      panelIndex: state => state.Globaldrugs.panelIndex,
      showPromtNotice: (state) => state.showPromtNotice,
      nomal_filedAnaly: state => state.Globaldrugs.nomal_filedAnaly,
      allBase: state => state.Globaldrugs.allBase,
      paramAnaly: state => state.Globaldrugs.paramAnaly,
      analyLoading: state => state.Globaldrugs.analyLoading,
      nopms: state => state.Globaldrugs.nopms,
      conditionsAnaly: state => state.Globaldrugs.conditionsAnaly,
      putongAnaly: (state) => state.Globaldrugs.putongAnaly,
      gaojiAnaly: (state) => state.Globaldrugs.gaojiAnaly,
      shaixuanAnaly: (state) => state.Globaldrugs.shaixuanAnaly
    }),
  },
  watch: {
  },
  methods: {
    //获取普通搜索
    nomalSearch() {
      window.ga(
        "send",
        "event",
        "tab",
        "click",
        "企业版_全球药物_智能分析_普通搜索_搜索"
      );
      window._paq.push([
        "trackEvent",
        "tab",
        "click",
        "企业版_全球药物_智能分析_普通搜索_搜索",
      ]);
      //清空高级搜索条件和筛选项
      if (this.route == "analysis") {
        this.$refs.filterAnaly.searchHandler();
      }
    },
    showSavedPop() {
      this.savedPopVisible = true;
    },
    // 高级搜索框中：点击搜索后，清空左侧普通搜索内容（仅肉眼）事件
    clearLeft() {
      this.vueClearLeft();
    },
    // 已选条件部分：点击x后，清空左侧对应的普通搜索内容（仅肉眼）事件
    clearTheLeft(option) {
      this.vueClearTheLeft(option);
    },
    loadingHandler() {
      if (this.panelIndex == 1) {
        return this.bdfxLoading;
      } else if (this.panelIndex == 2) {
        return this.syzfxLoading;
      } else {
        return false;
      }
    },
    clearPhase() {
      Store.commit("Globaldrugs/filtersAnalyLoading", true);
      // 靶点分析
      if (this.panelIndex == 1) {
        this.$refs.bdfx.ypfxBdrdChoose = []
        let tempParam = _.cloneDeep(this.ypfxBdrd_param);
        tempParam.page = 1;
        Store.commit('Globaldrugs/ypfxBdrd_param', tempParam)
      } else if (this.panelIndex == 2) {
        // 适应症分析
        this.$refs.syzfx.syzfxSyzrdChoose = []
        let tempParam = _.cloneDeep(this.syzfxSyzrd_param);
        tempParam.page = 1;
        Store.commit('Globaldrugs/syzfxSyzrd_param', tempParam)
      }
    },
    tongjiHandler(name) {
      window.ga("send", "event", "button", "click", "企业版_" + name);
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_" + name
      ]);

      let routeData = this.$router.resolve({
        path: "/globaldrugs",
        query: {
          ...this.putongAnaly,
        },
      });
      window.open(routeData.href, "_blank");
    },
    getFilterHeight() {
      this.filterPanelH = $(".filter-panel").height();
    },
    setFilterHeight() {
      let speed = 600,
        ease = "swing";
      $(".filter-panel").animate({ 'height': this.filterPanelH }, speed, ease);
    },
    resetFilterHeight() {
      let speed = 600,
        ease = "swing";
      $(".filter-panel").css('transition', `all ${speed} ${ease}`);
      setTimeout(() => {
        $(".filter-panel").css('height', 'auto');
      }, 50);
    },
    togglePanel() {
      let speed = 600,
        ease = "swing";
      if (!this.marked && !this.toggleStatus) {
        this.marked = true;
        this.$nextTick(() => {
          this.getFilterHeight();
          console.log(this.filterPanelH)
        })
      }
      this.toggleStatus = !this.toggleStatus;
      if (this.toggleStatus) {
        window.ga("send", "event", "button", "click", "企业版_全球药物_智能分析_条件筛选_折叠");
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          "企业版_全球药物_智能分析_条件筛选_折叠",
        ]);
        $(".filter-panel").css('min-height', "unset")
        $(".filter-panel").animate({ 'height': "10" }, speed, ease);

      } else {
        window.ga("send", "event", "button", "click", "企业版_全球药物_智能分析_条件筛选_展开");
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          "企业版_全球药物_智能分析_条件筛选_展开",
        ]);
        this.resetFilterHeight();
      }
    },
    showHighModal() { },
    showEchartPanel(index) {
      let name = ['药品分析', '靶点分析', '适应症分析']
      window.ga("send", "event", "button", "click", "企业版_全球药物_智能分析_" + name[index]);
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_智能分析_" + name[index],
      ]);
      Store.commit('Globaldrugs/panelIndex', index);
    },
  },
  created() {
  },
  mounted() {
    // 获取基础信息
    Store.dispatch("Globaldrugs/getBaseInfo").then(() => {
      this.vueTogglePmsTooltip()
      document.title = this.names.globaldrugs + "-智能分析"
    })
    this.vueRouteFromGlobaldrugs("Globaldrugs") // 获取普通搜索字段数组
    $(".select-sort .el-input__inner").attr("UNSELECTABLE", 'on')
  },
  activated() {
    // this.nopms一直为undefined状态，暂时屏蔽，后续再观察是否有其它用处
    this.vueRouteToNoPms(this.nopms.ksh);
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.ksh);
  }
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.pc-globaldrugs-analysis {

  .el-breadcrumb__inner a {
    color: #002FA7 !important;
  }

  .newProjectGuide_prite {
    font-weight: 400;
  }

  .globaldrugs-container {
    padding: 0 10px;
    width: calc(100% - 20px);

    .title-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;

      .title {
        height: 20px;
        line-height: 20px;
        font-size: 20px;
        font-weight: bold;
        color: #333333;
      }

      .el-breadcrumb {
        margin-left: 0;
      }
    }

    .filter-panel {
      width: 100%;
      // height: 100%;
      min-height: 300px;
      background: #FFFFFF;
      box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
      border-radius: 3px;
      position: relative;
      margin-bottom: 10px;
      overflow: hidden;
      // transition: height .6s ease;

      .toggle-icon {
        left: calc(50% - 30px);
        transform: translate(calc(50% - 30px), 0);
        transform-origin: center;
        position: absolute;
        bottom: 0;
        cursor: pointer;
        z-index: 999;
      }

      .normal-container {
        display: flex;
        flex-wrap: wrap;
        align-items: end;
        position: relative;
        margin-bottom: 10px;

        .high {
          width: 56px;
          height: 21px;
          font-size: 14px;
          font-weight: 400;
          color: #002FA7;
          line-height: 21px;
          border-bottom: 1px solid #002FA7;
          cursor: pointer;
        }

        .normal {

          div.el-input {
            width: 224px;
            height: 28px;
            background: #FFFFFF;
            border-radius: 3px;
            border: 1px solid #EBEEF5;
          }
        }
      }
    }

    .echarts-panel {
      padding: 0 10px;
      width: calc(100% - 20px);
      min-height: 1000px;
      background: #FFFFFF;
      box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
      border-radius: 3px;
      margin-bottom: 18px;
      position: relative;

      .panel {
        display: flex;
        width: 100%;
        height: 100%;

        .chart_bottom {
          padding-top: 5px;
          width: 100%;
          height: 100%;

          .go-list {
            height: 22px;
            line-height: 30px;
            text-align: right;
            padding-right: 40px;
            font-size: 14px;

            a:hover {
              color: #4877e8;
            }
          }
        }

        .chart-boxes {
          position: relative;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;

          .chart-title {
            display: flex;
            align-items: center;
            height: 34px;
            background: #EBEEF5;
            font-size: 14px;
            font-weight: bold;
            color: #333333;
          }

          .chart-box {
            border-radius: 3px;

            &,
            &:hover {
              box-shadow: none;
            }

            .chart-title::before {
              background: none;
            }
          }
        }

        .echarts {
          box-sizing: border-box;
          display: inline-block;
          width: calc(100%);
          height: 400px;
        }

        .hide {
          display: none;
        }

        .dialog {
          position: fixed;
          z-index: 99999;
          top: 0;
          left: 0px;
          width: 100%;
          height: calc(100%);
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
              z-index: 9;

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
              display: flex;
              overflow-y: scroll;
              overflow-x: hidden;

              .echarts-item {
                display: inline-block;
                margin: 0px 50px;
                width: 1300px;
                height: 100%;
                overflow: hidden;
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
      }

      .analy-type {
        display: flex;
        align-items: center;
        height: 42px;
        line-height: 42px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;

        .line {
          margin: 0 10px;
          height: 14px;
          border: 0.5px solid #EBEEF5;
        }

        &-item {
          position: relative;
          cursor: pointer;

          &.checked {
            font-weight: bold;
            color: #000F32;

            &::after {
              display: block;
              content: "";
              position: absolute;
              height: 3px;
              width: 100%;
              background-color: #002FA7;
              border-radius: 2px;
              bottom: 2px;
              left: 0;
            }
          }
        }

        &::after {
          display: block;
          width: 100%;
          border-bottom: 1px solid #dfe5f1;
          content: "";
          position: absolute;
          top: 40px;
          left: 0;
        }
      }
    }
  }

  .cl-green {
    color: #002FA7;
  }

  span.el-cascader.la-advenced-cascader {
    line-height: 28px;
  }

  .chart-box {
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    margin: 5px 0px;
    width: calc(50% - 5px);
    background-color: @White;
    box-shadow: @BoxShadow;
    overflow: hidden;
    transition: all 300ms;
    border-radius: 4px;

    canvas {
      width: 100% !important;
    }

    .chart-title {
      box-sizing: border-box;
      // position: absolute;
      // top: 0px;
      // left: 0px;
      width: 100%;
      padding-left: 10px;
      line-height: 40px;
      background-color: @GrayBackgroundColor;
      border-radius: 3px 3px 0 0;

      &::after {
        border-bottom: none !important;
        top: 34px !important;
      }

      .analy-type-item {
        height: 14px;
        line-height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
      }

      .check {
        font-weight: bold;
        color: #333333;
      }
    }

    &:hover {
      transition: all 300ms;
      box-shadow: @BoxShadowHover;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  @media screen and (max-width: 1500px) {
    .chart-box {
      width: 100%;
    }
  }
}

.top-loading {
  transition: all 300ms 50ms;
  //置于提示窗下
  z-index: 1997;
  position: absolute;
  top: 0;
  width: 100%;
  height: 154px;
  background: rgba(254, 254, 254, .8);
  text-align: center;
  overflow: hidden;

  img {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0px !important;
  }
}

.la-main .la-right .sec2 {
  box-shadow: none;
}

.el-loading-mask {
  z-index: 1998 !important;
}
</style>
