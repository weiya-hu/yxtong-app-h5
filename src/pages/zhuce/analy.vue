<template>
  <div class="analy-wrapeer">
    <!-- 加载完成显示部分 -->
    <!-- 顶部统计 -->
    <div class="chart_top">
      <LoadingGif :className="'top-loading'" :loadFlag="topLoading" v-if="topLoading"></LoadingGif>
      <div class="newtotals">
        <div class="iconfont newtotals-arrow newtotals-left" @click="handleShowScrollLeft">&#xe64e;</div>
        <div class="iconfont newtotals-arrow newtotals-right" @click="handleShowScrollRight">&#xe64f;</div>
        <div class="newtotals-scroll">
          <div class="newtotals-scroll-inner">
            <ul class="total-item">
              <li class="li1">申报量</li>
              <li class="li2">
                总计
                <span>{{ basic.total[0] }}</span>个
              </li>
              <li class="li3">报临床{{ basic.total[1] }}个</li>
              <li class="li3">报生产{{ basic.total[2] }}个</li>
            </ul>
            <ul class="total-item">
              <li class="li1">申报最多</li>
              <li class="li2">
                <span>{{ basic.shenbaonum[0] }}年</span>最多
              </li>
              <li class="li3">共{{ basic.shenbaonum[1] }}个</li>
            </ul>
            <ul class="total-item">
              <li class="li1">已批准</li>
              <li class="li2">
                总计
                <span>{{ basic.pizhun[0] }}</span>个
              </li>
              <li class="li3">批准率{{ basic.pizhun[1] }}</li>
            </ul>
            <ul class="total-item">
              <li class="li1">产品</li>
              <li class="li2">
                申报
                <span>{{ basic2.shenbaoname[0] }}</span>个
              </li>
              <li class="li3">独立产品{{ basic2.shenbaoname[1] }}个</li>
              <li class="li3">
                {{ basic2.shenbaoname[2] }}申报最多,共{{
                    basic2.shenbaoname[3]
                }}个
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">省份</li>
              <li class="li2">
                总计
                <span>{{ basic.shenbaoshengfen[0] }}</span>个
              </li>
              <li class="li3">{{ basic.shenbaoshengfen[1] }}最多</li>
              <li class="li3">共{{ basic.shenbaoshengfen[2] }}个</li>
            </ul>
            <ul class="total-item">
              <li class="li1">申报企业</li>
              <li class="li2">
                共
                <span>{{ basic2.shenbaoqiye[0] }}</span>
                家
              </li>
              <li class="li3">{{ basic2.shenbaoqiye[1] }}最多
              </li>
              <li class="li3">共{{ basic2.shenbaoqiye[2] }}个</li>
            </ul>
            <ul class="total-item">
              <li class="li1">优先审评</li>
              <li class="li2">
                总计
                <span>{{ basic.yxsp }}</span>个
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">特殊审批</li>
              <li class="li2">
                总计
                <span>{{ basic.tspz }}</span>个
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">重大专项</li>
              <li class="li2">
                总计
                <span>{{ basic.zdzx }}</span>个
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">一致性评价</li>
              <li class="li2">
                总计
                <span>{{ basic.yzxpj }}</span>个
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="chart_bottom">
      <div class="chart-boxes">
        <!-- 自定义加载界面 -->
        <LoadingGif :className="'top-loading'" style="height: calc(100vh - 223px);" :loadFlag="analyLoading"
          v-if="analyLoading"></LoadingGif>
        <DbEcharts title="申报趋势">
          <div style="display:flex;flex-direction: column-reverse;align-items: flex-end;">
            <div id="sbqs-line-zhuce" style="margin-top: 10px;" class="echarts">
              <div class="nodata-box"></div>
            </div>
            <el-select size="mini" v-model="selectYear" @change="selectChange" class="select-sort"
              popper-class="popper-class">
              <el-option label="按年显示" value="year"></el-option>
              <el-option label="按月显示" value="month"></el-option>
            </el-select>
          </div>
        </DbEcharts>
        <DbEcharts title="申报数量">
          <div id="sbqs-bar-zhuce" class="echarts">
            <div class="nodata-box"></div>
          </div>
        </DbEcharts>
        <DbEcharts title="申请类型">
          <div id="sqlx-bar-zhuce" class="echarts">
            <div class="nodata-box"></div>
          </div>
        </DbEcharts>
        <DbEcharts title="药品类型">
          <div id="yplx-bar-zhuce" class="echarts">
            <div class="nodata-box"></div>
          </div>
        </DbEcharts>
        <DbEcharts title="审评结论">
          <div id="spjl-pie-zhuce" class="echarts">
            <div class="nodata-box"></div>
          </div>
        </DbEcharts>
        <DbEcharts title="办理状态">
          <div id="blzt-bar-zhuce" class="echarts">
            <div class="nodata-box"></div>
          </div>
        </DbEcharts>
        <DbEcharts title="ATC分类">
          <div id="ylfl-pie-zhuce" class="echarts">
            <div :class="atcs_sel ? 'nodata-box-atc' : 'nodata-box'"></div>
          </div>
        </DbEcharts>
        <DbEcharts title="剂型">
          <div id="jx-bar-zhuce" class="echarts">
            <div class="nodata-box"></div>
          </div>
        </DbEcharts>
        <DbEcharts title="企业排名">
          <div id="qypm-bar-zhuce" class="echarts">
            <div class="nodata-box"></div>
          </div>
        </DbEcharts>
        <DbEcharts title="申报地区">
          <div id="sbdq-map-zhuce" class="echarts">
            <div class="nodata-box"></div>
          </div>
        </DbEcharts>
      </div>
    </div>
    <!-- 展开效果 -->
    <div class="dialog" v-show="dialogVisible">
      <div class="menu">
        <div v-for="(ti, index) in title" v-bind:class="[index == openIndex ? 'active' : '', 'nav']"
          @click="handleOpenIndex(index)" :key="index">{{ ti }}</div>
      </div>
      <div class="echarts-items-wap">
        <div class="echarts-items-title">
          <span class="echart-title">{{ title[openIndex] }}</span>
          <a class="esc-btn" href="javascript:;" @click="handleDialogVisible(false)">
            <i></i>
            <img src="/static/imgs/echarts/esc-fullscreen.png" alt="退出全屏" />
          </a>
        </div>
        <div class="echarts-items">
          <div class="echarts-item">
            <!-- 申报趋势 -->
            <div style="display:flex;flex-direction: column-reverse;align-items: flex-end;">
              <!-- 折线图 -->
              <div id="sbqs-line-zhuce-open" style="margin-top: 10px;" class="open-charts">
              </div>
              <el-select size="mini" v-model="selectYear" @change="selectChange" class="select-sort"
                popper-class="popper-class">
                <el-option label="按年显示" value="year"></el-option>
                <el-option label="按月显示" value="month"></el-option>
              </el-select>
            </div>
          </div>
          <div class="echarts-item">
            <!-- 条形图 -->
            <div id="sbqs-bar-zhuce-open" class="open-charts"></div>
          </div>
          <div class="echarts-item">
            <!-- 申请类型 -->
            <div id="sqlx-bar-zhuce-open" class="open-charts"></div>
          </div>
          <div class="echarts-item">
            <!-- 药品类型 -->
            <div id="yplx-bar-zhuce-open" class="open-charts"></div>
          </div>
          <div class="echarts-item">
            <!-- 审评结论 -->
            <div id="spjl-pie-zhuce-open" class="open-charts"></div>
          </div>
          <div class="echarts-item">
            <!-- 办理状态 -->
            <div id="blzt-bar-zhuce-open" class="open-charts"></div>
          </div>
          <div class="echarts-item">
            <!-- ATC分类 -->
            <div id="ylfl-pie-zhuce-open" class="open-charts"></div>
          </div>
          <div class="echarts-item">
            <!-- 剂型 -->
            <div id="jx-bar-zhuce-open" class="open-charts"></div>
          </div>
          <div class="echarts-item">
            <!-- 企业排名 -->
            <div id="qypm-bar-zhuce-open" class="open-charts"></div>
          </div>
          <div class="echarts-item">
            <!-- 申报地区 -->
            <div id="sbdq-map-zhuce-open" class="open-charts"></div>
          </div>
        </div>
        <div class="ctr-actions">
          <el-button class="pre action" @click="handleOpenIndex(openIndex - 1)">
            <i class="el-icon-arrow-left"></i>
          </el-button>
          <el-button class="next action" @click="handleOpenIndex(openIndex + 1)">
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
        <div class="nodata-box fullcharts hide">
          <div :class="atcs_sel ? 'nodata-box-atc' : 'nodata-box'"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import DbEcharts from "@/components/common/db-echarts";

import { mapState, mapGetters, createLogger } from "vuex";

var _res = {};
const myicon = {
  open:
    "path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891"
};

export default {
  components: {
    LoadingGif,
    DbEcharts
  },
  data() {
    return {
      searchState: {
        putong: {},
        gaoji: {},
        shaixuan: {},
        fourth: {},
        hot: {}
      },
      selectYear: "year", // 年月选择
      itemWidth: 700,
      promise: null,
      loading: true,
      dialogVisible: false,
      initopen: false, //控制渲染一次
      openIndex: 0, //控制展开第几个图形
      title: [
        "申报趋势",
        "申报数量",
        "申请类型",
        "药品类型",
        "审评结论",
        "办理状态",
        "ATC分类",
        "剂型",
        "企业排名",
        "申报地区"
      ], //图形标题
      basic: {
        total: [],
        shenbaonum: [],
        pizhun: [],
        shenbaoname: [],
        shenbaoshengfen: [],
        shenbaoqiye: [],
        yxsp: 0,
        tspz: 0,
        zdzx: 0,
        yzxpj: 0
      },
      basic2: {
        shenbaoname: [],
        shenbaoqiye: []
      },
      sbqs_line: {
        echarts: null,
        legend_data: ["申报数量", "批准"],
        xAxis_data: [],
        series_data: [],
        data_error: false
      },
      sbqs_bar: {
        echarts: null,
        legend_data: [
          "CDE承办",
          "新报任务审评中",
          "新报任务审评完成",
          "补充任务审评中",
          "补充任务审评完成",
          "审批中",
          "已完成审批"
        ],
        yAxis_data: [],
        series_data: []
      },
      sqlx_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      yplx_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      spjl_pie: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      blzt_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      // 由于剂型总数量太多，jx_bar用于存储最多15个（在首页显示），jx_open_bar存储全部（在全屏显示）
      jx_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      jx_open_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      ylfl_pie: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      qypm_bar: {
        echarts: null,
        yAxis_data: [],
        series_data: []
      },
      // 申报地区 - map、bar、pie
      sbdq_map: {
        echarts: null,
        xAxis_data: [],
        series_data: [],
        max: 0
      },
      // sbdq_bar包含bar和pie的数据
      sbdq_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      // sbdq_bar包含了bar和pie的数据，sbdq_pie暂不用
      sbdq_pie: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      // 记录大屏智能分析的无数据的选项卡
      recordNoData: new Set(),
      atcs_sel: false, //药理分类是否多分类
      tempType: [],
      tempTotalData: null,
      tempData: [], // 用于关闭全屏的数据传递存储
    };
  },
  computed: {
    ...mapState({
      param: state => state.Zhuce.param,
      // 基础数量统计
      base: state => state.Zhuce.base,
      // 基础数量统计 统计数量较慢的产品和申报企业
      base2: state => state.Zhuce.base2,
      // 申报趋势
      pizhun: state => state.Zhuce.pizhun,
      // 申报趋势
      shenbaoshuliang: state => state.Zhuce.shenbaoshuliang,
      // 申报数量
      shenbaobanli: state => state.Zhuce.shenbaobanli,
      // 申请类型
      shenqingleixing: state => state.Zhuce.shenqingleixing,
      // 药品类型
      yaopinleixing: state => state.Zhuce.yaopinleixing,
      // 审评结论
      xulie: state => state.Zhuce.xulie,
      // 办理状态
      guifanzhuangtaizhongwen: state => state.Zhuce.guifanzhuangtaizhongwen,
      // ATC分类
      atc: state => state.Zhuce.atc,
      // 剂型
      guifanjixing: state => state.Zhuce.guifanjixing,
      // 企业排名
      guifanqiyezhongbiao: state => state.Zhuce.guifanqiyezhongbiao,
      // 申报地区
      shengfen: state => state.Zhuce.shengfen,
      topLoading: state => state.Zhuce.topLoading,
      analyLoading: state => state.Zhuce.analyLoading,
      nopms: state => state.Zhuce.nopms,
      conditions: state => state.Zhuce.conditions,
      res1: state => state.Zhuce.res1,
      res2: state => state.Zhuce.res2,
      res3: state => state.Zhuce.res3,
      activeTabName: state => state.Zhuce.tabname,
      putong: (state) => state.Zhuce.putong,
      gaoji: (state) => state.Zhuce.gaoji,
      shaixuan: (state) => state.Zhuce.shaixuan,
      fourth: (state) => state.Zhuce.fourth,
      hot: (state) => state.Zhuce.hot
    }),
    noData() {
      return !this.res1.res && !this.res2.length && !this.res3.length;
    }
  },
  watch: {
    initopen(val) {
      this.tempType.forEach((item, i) => {
        if (val) {
          switch (i) {
            case 4:
              if (item == 'bar') {
                this.handleToggleBar("spjl-pie-zhuce-open", this.spjl_pie, undefined, 4)
              } else if (item == 'pie') {
                this.tempType[i] = 'pie';
                this.drawSpjlPieOpen();
              }
              break;
            case 5:
              if (item == 'pie') {
                this.handleTogglePie("blzt-bar-zhuce-open", this.blzt_bar, undefined, 5)
              } else if (item == 'bar') {
                this.tempType[i] = 'bar';
                this.drawBlztBarOpen();
              }
              break;
            case 6:
              if (item == 'bar') {
                this.handleToggleBar("ylfl-pie-zhuce-open", this.spjl_pie, undefined, 6)
              } else if (item == 'pie') {
                this.tempType[i] = 'pie';
                this.drawYlflPieOpen();
              }
              break;
            case 7:
              if (item == 'pie') {
                this.handleTogglePie("jx-bar-zhuce-open", this.jx_bar, undefined, 7)
              } else if (item == 'bar') {
                this.tempType[i] = 'bar';
                this.drawJxBarOpen();
              }
              break;
            case 9:
              if (item == 'pie') {
                this.handleTogglePie("sbdq-map-zhuce-open", this.sbdq_map, undefined, 9)
              } else if (item == 'bar') {
                this.handleToggleBar("sbdq-map-zhuce-open", this.sbdq_map, undefined, 9)
              } else if (item == 'map') {
                this.tempType[i] = 'map';
                this.drawSbdqMapOpen();
              }
              break;
          }
        } else {
          switch (i) {
            case 4:
              if (item == 'bar') {
                this.handleToggleBar("spjl-pie-zhuce", this.spjl_pie, 4)
              } else if (item == 'pie') {
                this.tempType[i] = 'pie';
                this.drawSpjlPie();
              }
              break;
            case 5:
              if (item == 'pie') {
                this.handleTogglePie("blzt-bar-zhuce", this.blzt_bar, 5)
              } else if (item == 'bar') {
                this.tempType[i] = 'bar';
                this.drawBlztBar();
              }
              break;
            case 6:
              if (item == 'bar') {
                this.handleToggleBar("ylfl-pie-zhuce", this.spjl_pie, 6)
              } else if (item == 'pie') {
                this.tempType[i] = 'pie';
                this.drawYlflPie();
              }
              break;
            case 7:
              if (item == 'pie') {
                this.handleTogglePie("jx-bar-zhuce", this.jx_bar, 7)
              } else if (item == 'bar') {
                this.tempType[i] = 'bar';
                this.drawJxBar();
              }
              break;
            case 9:
              if (item == 'pie') {
                this.handleTogglePie("sbdq-map-zhuce", this.sbdq_map, 9)
              } else if (item == 'bar') {
                this.handleToggleBar("sbdq-map-zhuce", this.sbdq_map, 9)
              } else if (item == 'map') {
                this.tempType[i] = 'map';
                this.drawSbdqMap();
              }
              break;
          }
        }
      })
    },
    base(newVal) {
      this.diffSearchData();
      Store.commit('Zhuce/chengbanriqiType', this.selectYear);
      if (typeof newVal != "undefined") {
        this.basic = newVal;
      }
    },
    base2(newVal) {
      if (typeof newVal != "undefined") {
        this.basic2 = newVal;
      }
    },
    shenbaoshuliang(newVal) {
      if (this.$route.path == "/zhuce/analy") {
        this.dealSbqsLine(this.pizhun, newVal);
      }
    },
    shenbaobanli(newVal) {
      if (this.$route.path == "/zhuce/analy") {
        this.dealSbqsBar(newVal);
      }
    },
    shenqingleixing(newVal) {
      if (this.$route.path == "/zhuce/analy") {
        this.dealSqlxBar(newVal);
      }
    },
    yaopinleixing(newVal) {
      if (this.$route.path == "/zhuce/analy") {
        this.dealYplxBar(newVal);
      }
    },
    xulie(newVal) {
      if (this.$route.path == "/zhuce/analy") {
        this.dealSpjlPie(newVal);
      }
    },
    guifanzhuangtaizhongwen(newVal) {
      if (this.$route.path == "/zhuce/analy") {
        this.dealBlztBar(newVal);
      }
    },
    atc(newVal) {
      if (this.$route.path == "/zhuce/analy") {
        this.dealYlflPie(newVal);
      }
    },
    guifanjixing(newVal) {
      if (this.$route.path == "/zhuce/analy") {
        this.dealJxBar(newVal);
      }
    },
    guifanqiyezhongbiao(newVal) {
      if (this.$route.path == "/zhuce/analy") {
        this.dealQypmBar(newVal);
      }
    },
    shengfen(newVal) {
      if (this.$route.path == "/zhuce/analy") {
        this.dealSbdqMap(newVal);
      }
    },
    $route(newVal, oldVal) {
      // console.log(newVal.query.type, oldVal.query.type);
      // if (newVal.query.type != oldVal.query.type) {
      //   this.loadData();
      // }
      // if (this.$route.path === "/zhuce/analy" && !this.basic) {
      //   this.loadData();
      // }
      // if (this.$route.path === "/zhuce/analy") {
      //   window.addEventListener("resize", this.echartsResizeHandler);
      // } else {
      //   window.removeEventListener("resize", this.echartsResizeHandler);
      //   this.echartsClear("open-charts");
      //   this.echartsClear("echarts");
      // }
      // if (this.$route.path === "/zhuce/analy") {
      //   //智能分析重新搜索清空列表数据tab无法自动复位
      //   if (this.diffSearchData()) {
      //     Store.dispatch("Zhuce/nomalSearch", {
      //       queryToPutong: false,
      //       tabs: true
      //     })
      //   }
      // }
      // if (this.$route.path === "/zhuce/list") {
      //   if (this.diffSearchData()) {
      //     //智能分析重新搜索清空列表数据tab无法自动复位
      //     let tabname = this.activeTabName;
      //     Store.commit("Zhuce/tabname", "");
      //     Store.commit("Zhuce/tabname", tabname);
      //     console.log(this.noData);
      //     this.noData &&
      //       Store.dispatch("Zhuce/nomalSearch", {
      //         queryToPutong: false,
      //         tabs: true,
      //       });
      //   }
      // }
    },
    dialogVisible() {
      this.selectChange(this.selectYear)
      if (this.dialogVisible) {
        $(".dialog").removeClass("hide");
        this.initLayout();
        this.echartsResize("open-charts");
      } else {
        $(".dialog").addClass("hide");
      }
    }
  },
  methods: {
    async selectChange(chengbanriqiType) {
      Store.commit('Zhuce/chengbanriqiType', this.selectYear);
      Store.commit('Zhuce/param', { ...this.param, chengbanriqiType });
      let params = _.assign(this.param, { chengbanriqiType }),
        axiosList = [
          Store.dispatch("Zhuce/getPizhun", params),
          Store.dispatch("Zhuce/getShenbaoshuliang", params)
        ],
        res = await Promise.all(axiosList);
      console.log(this.param, params);

      if (res[0].data.code === 200 && res[0].data.data) {
        Store.commit('Zhuce/pizhun', res[0].data.data);
      }
      if (res[1].data.code === 200 && res[1].data.data) {
        Store.commit('Zhuce/shenbaoshuliang', res[1].data.data);
        this.dealSbqsLine(this.pizhun, this.shenbaoshuliang);
      }
    },
    getImgName(i) {
      let title = i ? this.title[i] : this.title[this.openIndex];
      return `药智数据企业版-${document.title}-智能分析-按受理号统计-${this.title[i]}`;
    },
    initLayout() {
      let screen_width = window.innerWidth;
      let screen_height = window.innerHeight;
      this.itemWidth = screen_width - 244;
      $(".dialog .echarts-items-wap").css("height", screen_height - 50);
      $(".dialog .echarts-items-wap").css("width", screen_width - 244);
      $(".dialog .echarts-items")
        .width((this.itemWidth + 12) * 10)
        .css("margin-left", -this.openIndex * this.itemWidth);
      $(".dialog .echarts-item").width(this.itemWidth - 100);
    },
    loadData: _.debounce(function () {
      Store.dispatch("Zhuce/getKshRes").then(res => {
        this.update();
      });
    }, 10),
    handleOpenIndex(index) {
      if (index > 0 && index < 10) {
        this.openIndex = index;
      } else {
        this.openIndex = 0;
      }
      // 显示 no-data 提示图片
      if (this.recordNoData.has(this.openIndex)) {
        $(".fullcharts").show();
      } else {
        $(".fullcharts").hide();
      }
      $(".echarts-items").css("margin-left", -this.openIndex * this.itemWidth);
    },
    update() {
      /* Store.commit("Zhuce/extendCount", {
        BaseCount: Number(this.basic.total[0] || 0),
        NameCount: Number(this.basic.shenbaoname[0]),
        QiyeCount: Number(this.basic.shenbaoqiye[0]),
      }) */

      this.dealSbqsLine(this.pizhun, this.shenbaoshuliang);
      this.dealSbqsBar(this.shenbaobanli);
      this.dealSqlxBar(this.shenqingleixing);
      this.dealYplxBar(this.yaopinleixing);
      this.dealSpjlPie(this.xulie);
      this.dealBlztBar(this.guifanzhuangtaizhongwen);
      this.dealYlflPie(this.atc);
      this.dealJxBar(this.guifanjixing);
      this.dealQypmBar(this.guifanqiyezhongbiao);
      this.dealSbdqMap(this.shengfen);

    },
    //初始化全屏图形
    initOpendKsh(index) {
      var _that = this;
      this.loading = true;
      this.dialogVisible = true;
      //使用定时器 解决echarts无法在隐藏元素绘制图形问题
      if (!_that.initopen) {
        _that.loading = false;
        setTimeout(() => {
          _that.initLayout();
          _that.initopen = true;
          _that.drawSbqsLineOpen();
          _that.drawSbqsBarOpen();
          _that.drawSqlxBarOpen();
          _that.drawYplxBarOpen();
          _that.drawSpjlPieOpen();
          _that.drawBlztBarOpen();
          _that.drawYlflPieOpen();
          _that.drawJxBarOpen();
          _that.drawQypmBarOpen();
          _that.drawSbdqMapOpen();

          _that.handleOpenIndex(index);
          this.loading = false;
        }, 500);
      } else {
        this.handleOpenIndex(index);
        this.loading = false;
      }
    },
    // 申报趋势折线图
    dealSbqsLine(pizhun, shenbaoshuliang) {
      var xAxis_data = [];
      var series_data = [[], []];

      var allData =
        pizhun.length > shenbaoshuliang.length ? pizhun : shenbaoshuliang;
      var shortData = allData === shenbaoshuliang ? pizhun : shenbaoshuliang;

      if (shenbaoshuliang.length) {
        allData.forEach(item => {
          let currentIndex = shortData.findIndex(
            el => el.key_as_string == item.key_as_string
          );
          xAxis_data.push(item.key_as_string);
          let shenbaoValue =
            currentIndex !== -1
              ? allData === shenbaoshuliang
                ? item.doc_count
                : shortData[currentIndex].doc_count
              : allData === shenbaoshuliang
                ? item.doc_count
                : "";
          let pizhunValue =
            currentIndex !== -1
              ? shortData === pizhun
                ? shortData[currentIndex].doc_count
                : item.doc_count
              : shortData === pizhun
                ? ""
                : item.doc_count;
          series_data[0].push(shenbaoValue);
          series_data[1].push(pizhunValue);
        });
        this.sbqs_line.xAxis_data = xAxis_data;
        this.sbqs_line.series_data = series_data;
        this.drawSbqsLine();
        this.recordNoData.delete(0);
      } else {
        this.recordNoData.add(0);
        $("#sbqs-line-zhuce").html('<div class="nodata-box"></div>');
        $("#sbqs-line-zhuce").removeAttr("_echarts_instance_");
      }
    },
    drawSbqsLine() {
      var _that = this;
      _that.sbqs_line.echarts = Echarts.init(
        document.getElementById("sbqs-line-zhuce"),
        "yaozh_theme"
      );
      _that.sbqs_line.echarts.clear()
      let option = {
        toolbox: {
          right: "20",
          show: true,
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(0),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.dialogVisible = true;
                _that.initOpendKsh(0);
              }
            }
          }
        },
        legend: {
          show: true,
          bottom: 25,
          data: _that.sbqs_line.legend_data
        },
        tooltip: {
          trigger: "axis",
          position: "right"
        },
        grid: {
          containLabel: true,
          bottom: 60
        },
        dataZoom: {
          id: 'dataZoomX',
          show: true,
          startValue: _that.sbqs_line.xAxis_data.length - 12,
          endValue: _that.sbqs_line.xAxis_data.length - 1,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
          left: 'center', // 组件离容器左侧的距离,'left', 'center', 'right','20%'
          top: 'bottom', // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
          right: 'auto', // 组件离容器右侧的距离,'20%'
          bottom: 'auto', // 组件离容器下侧的距离,'20%'
          height: 25 //这里可以设置dataZoom的尺寸
        },
        xAxis: {
          data: _that.sbqs_line.xAxis_data
        },
        yAxis: {},
        series: [
          {
            name: "申报数量",
            type: "line",
            connectNulls: true,
            data: _that.sbqs_line.series_data[0]
          },
          {
            name: "批准",
            type: "line",
            connectNulls: true,
            data: _that.sbqs_line.series_data[1]
          }
        ]
      };
      if (_that.sbqs_line.xAxis_data.length < 13) {
        option.legend.bottom = 10;
        delete option.grid.bottom;
        option.dataZoom.show = false;
      } else {
        option.legend.bottom = 25;
        option.grid.bottom = 60;
        option.dataZoom.show = true;
      }
      _that.sbqs_line.echarts.setOption(option);
    },
    drawSbqsLineOpen() {
      var _that = this;
      var e = Echarts.init(
        document.getElementById("sbqs-line-zhuce-open"),
        "yaozh_theme"
      );

      let option = {
        toolbox: {
          right: "20",
          show: true,
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(0),
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        title: {},
        legend: {
          show: true,
          bottom: 25,
          data: _that.sbqs_line.legend_data
        },
        tooltip: {
          trigger: "axis",
          position: "right"
        },
        grid: {
          containLabel: true,
          bottom: 60
        },
        dataZoom: {
          id: 'dataZoomX',
          show: true,
          startValue: _that.sbqs_line.xAxis_data.length - 12,
          endValue: _that.sbqs_line.xAxis_data.length - 1,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
          left: 'center', // 组件离容器左侧的距离,'left', 'center', 'right','20%'
          top: 'bottom', // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
          right: 'auto', // 组件离容器右侧的距离,'20%'
          bottom: 'auto', // 组件离容器下侧的距离,'20%'
          height: 25 //这里可以设置dataZoom的尺寸
        },
        xAxis: {
          nameLocation: "end",
          data: _that.sbqs_line.xAxis_data
        },
        yAxis: {},
        series: [
          {
            name: "申报数量",
            type: "line",
            data: _that.sbqs_line.series_data[0]
          },
          {
            name: "批准",
            type: "line",
            data: _that.sbqs_line.series_data[1]
          }
        ]
      };
      if (_that.sbqs_line.xAxis_data.length < 13) {
        option.legend.bottom = 10;
        delete option.grid.bottom;
        option.dataZoom.show = false;
      } else {
        option.legend.bottom = 25;
        option.grid.bottom = 60;
        option.dataZoom.show = true;
      }
      console.log(e, _that.sbqs_line.legend_data);
      e.setOption(option);
    },
    //申报数量堆形图
    dealSbqsBar(shenbaobanli) {
      var _len = shenbaobanli.length;
      var yAxis_data = [];
      var series_data = [[]];
      var series_data_result = [];
      var legend_data = this.sbqs_bar.legend_data;
      var legend_data_len = this.sbqs_bar.legend_data.length;
      // 数据全为0，显示nodata
      let notAllZero = shenbaobanli.find(item => {
        return item.guifanzhuangtaizhongwen.find(ite => {
          return ite.doc_count != 0;
        });
      });
      if (!notAllZero) {
        _len = 0;
      }

      if (_len > 0) {
        for (var k = 0; k < _len; k++) {
          yAxis_data.push(shenbaobanli[k].key_as_string);
        }
        for (var i = 0; i < legend_data_len; i++) {
          series_data[i] = new Array(_len);
          for (var j = 0; j < _len; j++) {
            let gfzt_len = shenbaobanli[j].guifanzhuangtaizhongwen.length;
            let gfzt_key = [];
            for (var n = 0; n < gfzt_len; n++) {
              gfzt_key.push(shenbaobanli[j].guifanzhuangtaizhongwen[n].key);
            }
            let m = _.indexOf(gfzt_key, legend_data[i].trim());
            if (m < 0) {
              series_data[i][j] = 0;
            } else {
              series_data[i][j] =
                shenbaobanli[j].guifanzhuangtaizhongwen[m].doc_count;
            }
          }
        }
        for (var i = 0; i < legend_data_len; i++) {
          series_data_result.push({
            name: legend_data[i],
            type: "bar",
            stack: "状态",
            data: series_data[i]
          });
        }
        console.log(series_data_result)
        this.sbqs_bar.yAxis_data = yAxis_data;
        this.sbqs_bar.series_data = series_data_result;
        this.drawSbqsBar();

        this.recordNoData.delete(1);
      } else {
        this.recordNoData.add(1);
        $("#sbqs-bar-zhuce").html('<div class="nodata-box"></div>');
        $("#sbqs-bar-zhuce").removeAttr("_echarts_instance_");
      }
    },
    drawSbqsBar() {
      var _that = this;
      _that.sbqs_bar.echarts = Echarts.init(
        document.getElementById("sbqs-bar-zhuce"),
        "yaozh_theme"
      );
      _that.sbqs_bar.echarts.setOption({
        toolbox: {
          right: "20",
          show: true,
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(1),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.initOpendKsh(1);
              }
            }
          }
        },
        tooltip: {
          position: function (pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = { top: 20 };
            obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
            return obj;
          },
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.sbqs_bar.legend_data
        },
        yAxis: [
          {
            type: "category",
            axisLabel: {
              interval: 0
            },
            data: _that.sbqs_bar.yAxis_data
          }
        ],
        xAxis: [
          {
            type: "value"
          }
        ],
        series: _that.sbqs_bar.series_data
      });
    },
    drawSbqsBarOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("sbqs-bar-zhuce-open"),
        "yaozh_theme"
      ).setOption({
        toolbox: {
          right: "20",
          show: true,
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(1),
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.sbqs_bar.legend_data
        },
        yAxis: [
          {
            type: "category",
            axisLabel: {
              interval: 0
            },
            data: _that.sbqs_bar.yAxis_data
          }
        ],
        xAxis: [
          {
            type: "value"
          }
        ],
        series: _that.sbqs_bar.series_data
      });
    },
    //申请类型柱状图
    dealSqlxBar(shenqingleixing) {
      var _len = shenqingleixing.length;
      var yAxis_data = [];
      var series_data = [[]];
      var series_data_result = [];
      var legend_data = this.yaopinleixing.map(item => item.label);
      console.log(legend_data);
      var legend_data_len = legend_data.length;
      // 数据全为0，显示nodata
      let notAllZero = shenqingleixing.find(item => {
        return item.yaopinleixing.find(ite => {
          return ite.doc_count != 0;
        });
      });
      if (!notAllZero) {
        _len = 0;
      }

      if (_len > 0) {
        for (var k = 0; k < _len; k++) {
          yAxis_data.push(shenqingleixing[k].label);
        }
        for (var i = 0; i < legend_data_len; i++) {
          series_data[i] = new Array(_len);
          for (var j = 0; j < _len; j++) {
            let gfzt_len = shenqingleixing[j].yaopinleixing.length;
            let gfzt_key = [];
            for (var n = 0; n < gfzt_len; n++) {
              gfzt_key.push(shenqingleixing[j].yaopinleixing[n].label);
            }
            let m = _.indexOf(gfzt_key, legend_data[i].trim());
            console.log(gfzt_key, legend_data);
            if (m < 0) {
              series_data[i][j] = 0;
            } else {
              series_data[i][j] = shenqingleixing[j].yaopinleixing[m].doc_count;
            }
          }
        }
        for (var i = 0; i < legend_data_len; i++) {
          series_data_result.push({
            name: legend_data[i],
            type: "bar",
            stack: "申请类型",
            data: series_data[i]
          });
        }
        let totals = [];
        shenqingleixing.forEach(item => {
          totals.push(item.doc_count);
        });
        series_data_result.unshift({
          //新的一个柱子 注意不设stack
          name: "总数",
          type: "bar",
          barGap: "-100%", // 左移100%，stack不再与上面两个在一列
          label: {
            normal: {
              show: true,
              position: "top", //  位置设为top
              formatter: "{c}",
              textStyle: { color: "#3fb1ff" }
            }
          },
          itemStyle: {
            normal: {
              color: "rgba(128, 128, 128, 0.3)" // 仍为透明
            }
          },
          data: totals
        });
        console.log(yAxis_data, series_data_result);
        this.sqlx_bar.xAxis_data = yAxis_data;
        this.sqlx_bar.series_data = series_data_result;
        this.drawSqlxBar();

        this.recordNoData.delete(2);
      } else {
        this.recordNoData.add(2);
        $("#sqlx-bar-zhuce").html('<div class="nodata-box"></div>');
        $("#sqlx-bar-zhuce").removeAttr("_echarts_instance_");
      }
    },
    drawSqlxBar() {
      var _that = this;
      _that.sqlx_bar.echarts = Echarts.init(
        document.getElementById("sqlx-bar-zhuce"),
        "yaozh_theme"
      );
      _that.sqlx_bar.echarts.clear()
      _that.sqlx_bar.echarts.setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.sqlx_bar.legend_data
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(2),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.initOpendKsh(2);
              }
            }
          }
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0
          },
          data: _that.sqlx_bar.xAxis_data
        },
        yAxis: {
          type: "value",
          name: "申报数量"
        },
        series: _that.sqlx_bar.series_data
      });
    },
    drawSqlxBarOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("sqlx-bar-zhuce-open"),
        "yaozh_theme"
      ).setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.sqlx_bar.legend_data
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(2),
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0
          },
          data: _that.sqlx_bar.xAxis_data
        },
        yAxis: {
          type: "value",
          name: "申报数量"
        },
        series: _that.sqlx_bar.series_data
      });
    },
    //药品类型柱状图
    dealYplxBar(yaopinleixing) {
      var _len = yaopinleixing.length;
      var yAxis_data = [];
      var series_data = [[]];
      var series_data_result = [];
      var legend_data = this.shenqingleixing.map(item => item.label);
      var legend_data_len = legend_data.length;
      // 数据全为0，显示nodata
      let notAllZero = yaopinleixing.find(item => {
        return item.shenqingleixing.find(ite => {
          return ite.doc_count != 0;
        });
      });
      if (!notAllZero) {
        _len = 0;
      }

      if (_len > 0) {
        for (var k = 0; k < _len; k++) {
          yAxis_data.push(yaopinleixing[k].label);
        }
        for (var i = 0; i < legend_data_len; i++) {
          series_data[i] = new Array(_len);
          for (var j = 0; j < _len; j++) {
            let gfzt_len = yaopinleixing[j].shenqingleixing.length;
            let gfzt_key = [];
            for (var n = 0; n < gfzt_len; n++) {
              gfzt_key.push(yaopinleixing[j].shenqingleixing[n].label);
            }
            let m = _.indexOf(gfzt_key, legend_data[i].trim());
            if (m < 0) {
              series_data[i][j] = 0;
            } else {
              console.log(yaopinleixing[j].shenqingleixing[m].label);
              series_data[i][j] = yaopinleixing[j].shenqingleixing[m].doc_count;
            }
          }
        }
        for (var i = 0; i < legend_data_len; i++) {
          console.log(series_data[i]);
          series_data_result.push({
            name: legend_data[i],
            type: "bar",
            stack: "药品类型",
            data: series_data[i]
          });
        }
        let totals = [];
        yaopinleixing.forEach(item => {
          totals.push(item.doc_count);
        });
        series_data_result.unshift({
          //新的一个柱子 注意不设stack
          name: "总数",
          type: "bar",
          barGap: "-100%", // 左移100%，stack不再与上面两个在一列
          label: {
            normal: {
              show: true,
              position: "top", //  位置设为top
              formatter: "{c}",
              textStyle: { color: "#3fb1ff" }
            }
          },
          itemStyle: {
            normal: {
              color: "rgba(128, 128, 128, 0.3)" // 仍为透明
            }
          },
          data: totals
        });
        this.yplx_bar.xAxis_data = yAxis_data;
        this.yplx_bar.series_data = series_data_result;
        this.drawYplxBar();

        this.recordNoData.delete(3);
      } else {
        this.recordNoData.add(3);
        $("#yplx-bar-zhuce").html('<div class="nodata-box"></div>');
        $("#yplx-bar-zhuce").removeAttr("_echarts_instance_");
      }
    },
    drawYplxBar() {
      var _that = this;
      _that.yplx_bar.echarts = Echarts.init(
        document.getElementById("yplx-bar-zhuce"),
        "yaozh_theme"
      );
      _that.yplx_bar.echarts.clear()
      _that.yplx_bar.echarts.setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.yplx_bar.legend_data
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(3),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.initOpendKsh(3);
              }
            }
          }
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0
          },
          data: _that.yplx_bar.xAxis_data
        },
        yAxis: {
          type: "value",
          name: "数量"
        },
        series: _that.yplx_bar.series_data
      });
    },
    drawYplxBarOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("yplx-bar-zhuce-open"),
        "yaozh_theme"
      ).setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.yplx_bar.legend_data
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(3),
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0
          },
          data: _that.yplx_bar.xAxis_data
        },
        yAxis: {
          type: "value",
          name: "数量"
        },
        series: _that.yplx_bar.series_data
      });
    },
    //审评结论空心饼形图
    dealSpjlPie(xulie) {
      let _len = xulie.length;
      let xAxis_data = [];
      let series_data = [];
      if (_len > 0) {
        // xulie.sort(function(a,b){
        //   return a.doc_count- b.doc_count
        // })
        for (var i = 0; i < _len; i++) {
          xAxis_data.push(xulie[i].label);
          series_data.push({ value: xulie[i].doc_count, name: xulie[i].label });
        }

        // 排序
        for (let index in series_data) {
          for (let i = 0; i < index; i++) {
            if (
              Number(series_data[index].value) > Number(series_data[i].value)
            ) {
              let y = series_data[index];
              let x = xAxis_data[index];
              xAxis_data[index] = xAxis_data[i];
              series_data[index] = series_data[i];
              xAxis_data[i] = x;
              series_data[i] = y;
            }
          }
        }

        this.spjl_pie.xAxis_data = xAxis_data;
        this.spjl_pie.series_data = series_data;
        this.drawSpjlPie();

        this.recordNoData.delete(4);
      } else {
        this.recordNoData.add(4);
        $("#spjl-pie-zhuce").html('<div class="nodata-box"></div>');
        $("#spjl-pie-zhuce").removeAttr("_echarts_instance_");
      }
    },
    //审评结论
    drawSpjlPie() {
      var _that = this;
      _that.spjl_pie.echarts = Echarts.init(
        document.getElementById("spjl-pie-zhuce"),
        "yaozh_theme"
      );
      _that.spjl_pie.echarts.clear()
      _that.tempType[4] = 'pie'
      _that.spjl_pie.echarts.setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.spjl_pie.xAxis_data
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(4),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myToggleBar: {
              show: true,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                _that.tempType[4] = 'bar';
                _that.handleToggleBar("spjl-pie-zhuce", _that.spjl_pie, 4);
              }
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.tempType[4] = 'pie';
                _that.initOpendKsh(4);
              }
            }
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "75%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "outside"
              },
              emphasis: {
                show: true,
                formatter: "{d}%",
                align: "center",
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: _that.spjl_pie.series_data
          }
        ]
      });
    },
    drawSpjlPieOpen() {
      var _that = this;
      Echarts.getInstanceByDom(
        document.getElementById("spjl-pie-zhuce-open")
      ) && Echarts.getInstanceByDom(
        document.getElementById("spjl-pie-zhuce-open")
      ).clear()
      if (this.tempType[4] == 'bar') {
        _that.handleToggleBar(
          "spjl-pie-zhuce-open",
          _that.spjl_pie,
          undefined,
          4
        );
      } else {
        Echarts.init(
          document.getElementById("spjl-pie-zhuce-open"),
          "yaozh_theme"
        ).setOption({
          legend: {
            type: "scroll",
            bottom: 0,
            data: _that.spjl_pie.xAxis_data
          },
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(4),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myTogglePie: {
                show: true,
                title: "柱形图",
                icon: "image:///static/imgs/echarts/bar.png",
                onclick() {
                  _that.tempType[4] = "bar";
                  _that.handleToggleBar(
                    "spjl-pie-zhuce-open",
                    _that.spjl_pie,
                    undefined
                  );
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "75%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "outside"
                },
                emphasis: {
                  show: true,
                  formatter: "{d}%",
                  align: "center",
                  textStyle: {
                    fontSize: "30",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: _that.spjl_pie.series_data
            }
          ]
        });
      }
    },
    //办理状态柱形图
    dealBlztBar(guifanzhuangtaizhongwen) {
      let _len = guifanzhuangtaizhongwen.length;
      let xAxis_data = [];
      let series_data = [];
      if (_len > 0) {
        // guifanzhuangtaizhongwen.sort(function(a,b){
        //   return a.doc_count- b.doc_count
        // })
        for (var i = 0; i < _len; i++) {
          xAxis_data.push(guifanzhuangtaizhongwen[i].key);
          series_data.push(guifanzhuangtaizhongwen[i].doc_count);
        }
        this.blzt_bar.xAxis_data = xAxis_data;
        this.blzt_bar.series_data = series_data;
        this.drawBlztBar();

        this.recordNoData.delete(5);
      } else {
        this.recordNoData.add(5);
        $("#blzt-bar-zhuce").html('<div class="nodata-box"></div>');
        $("#blzt-bar-zhuce").removeAttr("_echarts_instance_");
      }
    },
    drawBlztBar() {
      var _that = this;
      _that.blzt_bar.echarts = Echarts.init(
        document.getElementById("blzt-bar-zhuce"),
        "yaozh_theme"
      );
      _that.blzt_bar.echarts.clear()
      _that.tempType[5] = 'bar'
      _that.blzt_bar.echarts.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}:<br />数量: {c}"
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(5),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myTogglePie: {
              show: true,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {
                _that.tempType[5] = 'pie';
                _that.handleTogglePie("blzt-bar-zhuce", _that.blzt_bar, 5);
              }
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.tempType[5] = 'bar';
                _that.initOpendKsh(5);
              }
            }
          }
        },
        grid: {
          // 控制图的大小，调整下面这些值就可以，
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
            rotate: 30
          },
          data: _that.blzt_bar.xAxis_data
        },
        yAxis: {
          type: "value",
          name: "数量"
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "top"
            },
            data: _that.blzt_bar.series_data
          }
        ]
      });
    },
    drawBlztBarOpen() {
      var _that = this;
      if (this.tempType[5] == 'pie') {
        _that.handleTogglePie(
          "blzt-bar-zhuce-open",
          _that.blzt_bar,
          undefined,
          5
        );
      } else {
        Echarts.init(
          document.getElementById("blzt-bar-zhuce-open"),
          "yaozh_theme"
        ).setOption({
          tooltip: {
            trigger: "item",
            formatter: "{b}:<br />数量: {c}"
          },
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(5),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myTogglePie: {
                show: true,
                title: "饼形图",
                icon: "image:///static/imgs/echarts/pie.png",
                onclick() {
                  _that.tempType[5] = "pie";
                  _that.handleTogglePie(
                    "blzt-bar-zhuce-open",
                    _that.blzt_bar,
                    undefined
                  );
                }
              }
            }
          },
          grid: {
            containLabel: true
          },
          xAxis: {
            type: "category",
            axisLabel: {
              interval: 0
            },
            data: _that.blzt_bar.xAxis_data
          },
          yAxis: {
            type: "value",
            name: "数量"
          },
          series: [
            {
              type: "bar",
              label: {
                show: true,
                position: "top"
              },
              data: _that.blzt_bar.series_data
            }
          ]
        });
      }
    },
    //ATC分类
    dealYlflPie(atc) {
      this.atcs_sel = false;
      _.forEach(this.conditions, item => {
        if (item.name === "atc") {
          if (item.atcs_sel) {
            this.atcs_sel = true;
          }
        }
      });
      let _len = atc.length;
      let xAxis_data = [];
      let series_data = [];
      if (_len > 0) {
        // atc.sort(function(a,b){
        //   return a.doc_count- b.doc_count
        // })
        for (var i = 0; i < _len; i++) {
          xAxis_data.push(atc[i].key);
          series_data.push({ value: atc[i].doc_count, name: atc[i].key });
        }

        // 排序
        for (let index in series_data) {
          for (let i = 0; i < index; i++) {
            if (
              Number(series_data[index].value) > Number(series_data[i].value)
            ) {
              let y = series_data[index];
              let x = xAxis_data[index];
              xAxis_data[index] = xAxis_data[i];
              series_data[index] = series_data[i];
              xAxis_data[i] = x;
              series_data[i] = y;
            }
          }
        }

        this.ylfl_pie.xAxis_data = xAxis_data;
        this.ylfl_pie.series_data = series_data;

        this.drawYlflPie();

        this.recordNoData.delete(6);
      } else {
        this.recordNoData.add(6);
        let html = this.atcs_sel
          ? '<div class="nodata-box-atc"></div>'
          : '<div class="nodata-box"></div>';
        $("#ylfl-pie-zhuce").html(html);
        $("#ylfl-pie-zhuce").removeAttr("_echarts_instance_");
      }
    },
    drawYlflPie() {
      var _that = this;
      _that.ylfl_pie.echarts = Echarts.init(
        document.getElementById("ylfl-pie-zhuce"),
        "yaozh_theme"
      );
      _that.ylfl_pie.echarts.clear()
      _that.tempType[6] = 'pie'
      _that.ylfl_pie.echarts.setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.ylfl_pie.xAxis_data
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(6),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myToggleBar: {
              show: true,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                _that.tempType[6] = 'bar'
                _that.handleToggleBar("ylfl-pie-zhuce", _that.ylfl_pie, 6);
              }
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.tempType[6] = 'pie'
                _that.initOpendKsh(6);
              }
            }
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
        },
        series: [
          {
            type: "pie",
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: "{b}{d}%"
              }
            },
            data: this.ylfl_pie.series_data
          }
        ]
      });
    },
    drawYlflPieOpen() {
      var _that = this;
      if (this.tempType[6] == 'pie') {
        _that.handleTogglePie(
          "ylfl-pie-zhuce-open",
          _that.ylfl_pie,
          undefined,
          6
        );
      } else {
        Echarts.init(
          document.getElementById("ylfl-pie-zhuce-open"),
          "yaozh_theme"
        ).setOption({
          legend: {
            type: "scroll",
            bottom: 0,
            data: _that.ylfl_pie.xAxis_data
          },
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(6),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myTogglePie: {
                show: true,
                title: "柱形图",
                icon: "image:///static/imgs/echarts/bar.png",
                onclick() {
                  _that.tempType[6] = "bar";
                  _that.handleToggleBar(
                    "ylfl-pie-zhuce-open",
                    _that.ylfl_pie,
                    undefined
                  );
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
          },
          series: [
            {
              type: "pie",
              label: {
                normal: {
                  show: true,
                  position: "outside",
                  formatter: "{b}{d}%"
                }
              },
              data: this.ylfl_pie.series_data
            }
          ]
        });
      }
    },
    //剂型
    dealJxBar(guifanjixing) {
      let _len = guifanjixing.length;
      let xAxis_data = [];
      let series_data = [];
      let open_xAxis_data = [];
      let open_series_data = [];
      if (_len > 0) {
        if (_len > 15) {
          for (var i = 0; i < 15; i++) {
            xAxis_data.push(guifanjixing[i].key);
            series_data.push(guifanjixing[i].doc_count);
          }
        } else {
          for (var i = 0; i < _len; i++) {
            xAxis_data.push(guifanjixing[i].key);
            series_data.push(guifanjixing[i].doc_count);
          }
        }

        for (var i = 0; i < _len; i++) {
          open_xAxis_data.push(guifanjixing[i].key);
          open_series_data.push(guifanjixing[i].doc_count);
        }
        this.jx_bar.xAxis_data = xAxis_data;
        this.jx_bar.series_data = series_data;
        this.jx_open_bar.xAxis_data = open_xAxis_data;
        this.jx_open_bar.series_data = open_series_data;
        this.drawJxBar();

        this.recordNoData.delete(7);
      } else {
        this.recordNoData.add(7);
        $("#jx-bar-zhuce").html('<div class="nodata-box"></div>');
        $("#jx-bar-zhuce").removeAttr("_echarts_instance_");
      }
    },
    drawJxBar() {
      var _that = this;
      _that.jx_bar.echarts = Echarts.init(
        document.getElementById("jx-bar-zhuce"),
        "yaozh_theme"
      );
      _that.jx_bar.echarts.clear()
      _that.tempType[7] = 'bar'
      _that.jx_bar.echarts.setOption({
        legend: {
          bottom: 0,
          data: _that.jx_bar.legend_data
        },
        tooltip: {
          show: true
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(7),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myTogglePie: {
              show: true,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {
                _that.tempType[7] = 'pie';
                _that.handleTogglePie("jx-bar-zhuce", _that.jx_bar, 7);
              }
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.tempType[7] = 'bar';
                _that.initOpendKsh(7);
              }
            }
          }
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
            rotate: 30
          },
          data: _that.jx_bar.xAxis_data
        },
        yAxis: {
          type: "value",
          name: "数量"
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "top"
            },
            data: _that.jx_bar.series_data
          }
        ]
      });
    },
    drawJxBarOpen() {
      var _that = this;
      if (this.tempType[7] == 'pie') {
        _that.handleTogglePie(
          "jx-bar-zhuce-open",
          _that.jx_bar,
          undefined,
          7
        );
      } else {
        Echarts.init(
          document.getElementById("jx-bar-zhuce-open"),
          "yaozh_theme"
        ).setOption({
          legend: {
            bottom: 0,
            data: _that.jx_bar.legend_data
          },
          tooltip: {
            show: true
          },
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(7),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myTogglePie: {
                show: true,
                title: "饼形图",
                icon: "image:///static/imgs/echarts/pie.png",
                onclick() {
                  _that.tempType[7] = "pie";
                  _that.handleTogglePie("jx-bar-zhuce-open", _that.jx_open_bar, undefined);
                }
              }
            }
          },
          grid: {
            containLabel: true
          },
          xAxis: {
            type: "category",
            axisLabel: {
              interval: 0,
              rotate: 30
            },
            data: _that.jx_open_bar.xAxis_data
          },
          yAxis: {
            type: "value",
            name: "数量"
          },
          series: [
            {
              type: "bar",
              label: {
                show: true,
                position: "top"
              },
              data: _that.jx_open_bar.series_data
            }
          ]
        });
      }
    },
    //企业排名
    dealQypmBar(qiyemingcheng) {
      let _len = qiyemingcheng.length;
      let yAxis_data = [];
      let series_data = [];
      if (_len > 0) {
        // qiyemingcheng.sort(function(a,b){
        //   return a.doc_count- b.doc_count
        // })
        for (var i = 0; i < _len; i++) {
          yAxis_data.push(qiyemingcheng[i].key);
          series_data.push(qiyemingcheng[i].doc_count);
        }
        this.qypm_bar.yAxis_data = yAxis_data;
        this.qypm_bar.series_data = series_data;
        // 从上往下，从多至少
        this.qypm_bar.yAxis_data.reverse();
        this.qypm_bar.series_data.reverse();

        this.drawQypmBar();

        this.recordNoData.delete(8);
      } else {
        this.recordNoData.add(8);
        $("#qypm-bar-zhuce").html('<div class="nodata-box"></div>');
        $("#qypm-bar-zhuce").removeAttr("_echarts_instance_");
      }
    },
    drawQypmBar() {
      var _that = this;
      _that.qypm_bar.echarts = Echarts.init(
        document.getElementById("qypm-bar-zhuce"),
        "yaozh_theme"
      );
      let dataLen = 10;
      let startValue = _that.qypm_bar.series_data.length - dataLen,
        endValue = _that.qypm_bar.series_data.length - 1;
      if (_that.qypm_bar.series_data.length < dataLen) {
        startValue = 0;
        endValue = _that.qypm_bar.series_data.length - 1;
      }
      _that.qypm_bar.echarts.setOption({
        tooltip: {
          position: (point, params, dom, rect, size) => {
            return this.echartsTooltipPositionX(point, params, dom, rect, size);
          },
          trigger: "item",
          formatter: "{b}<br />数量: {c}"
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(8),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.initOpendKsh(8);
              }
            }
          }
        },
        dataZoom: [
          {
            show: _that.qypm_bar.series_data.length > dataLen,
            startValue,
            endValue,
            width: "35",
            showDetail: false,
            yAxisIndex: 0,
            left: 20,
          },
        ],
        grid: {
          left: _that.qypm_bar.yAxis_data.length > dataLen ? 60 : 30,
          containLabel: true
        },
        yAxis: {
          type: "category",
          axisLabel: {
            formatter: function (value) {
              if (value.length > 12) {
                return value.substring(0, 12) + "...";
              } else {
                return value;
              }
            }
          },
          data: _that.qypm_bar.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "数量"
        },
        series: [
          {
            data: _that.qypm_bar.series_data,
            type: "bar",
            label: {
              show: true,
              position: "right"
            }
          }
        ]
      });
    },
    drawQypmBarOpen() {
      var _that = this;
      let dataLen = 10;
      let startValue = _that.qypm_bar.series_data.length - dataLen,
        endValue = _that.qypm_bar.series_data.length - 1;
      if (_that.qypm_bar.series_data.length < dataLen) {
        startValue = 0;
        endValue = _that.qypm_bar.series_data.length - 1;
      }
      Echarts.init(
        document.getElementById("qypm-bar-zhuce-open"),
        "yaozh_theme"
      ).setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}<br />数量: {c}"
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(8),
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        dataZoom: [
          {
            show: _that.qypm_bar.series_data.length > dataLen,
            startValue,
            endValue,
            width: "35",
            showDetail: false,
            yAxisIndex: 0,
            left: 20,
          },
        ],
        grid: {
          left: _that.qypm_bar.yAxis_data.length > dataLen ? 60 : 30,
          containLabel: true
        },
        yAxis: {
          type: "category",
          data: _that.qypm_bar.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "数量"
        },
        series: [
          {
            data: _that.qypm_bar.series_data,
            type: "bar",
            label: {
              show: true,
              position: "right"
            }
          }
        ]
      });
    },
    //地图
    dealSbdqMap(shengfen) {
      let _len = shengfen.length;
      let xAxis_data = [];
      let not_map_series_data = [];
      let map_series_data = [];
      var max = 0;
      if (_len > 0) {
        // 处理map数据
        for (var i = 0; i < _len; i++) {
          xAxis_data.push(String(shengfen[i].key));
          not_map_series_data.push(Number(shengfen[i].doc_count));
          map_series_data.push({
            value: shengfen[i].doc_count,
            name: shengfen[i].key
          });
          max = shengfen[i].doc_count > max ? shengfen[i].doc_count : max;
        }
        this.sbdq_map.max = max;
        this.sbdq_map.xAxis_data = xAxis_data;
        this.sbdq_map.series_data = map_series_data;

        this.sbdq_bar.xAxis_data = xAxis_data;
        this.sbdq_bar.series_data = not_map_series_data;

        this.sbdq_pie.xAxis_data = xAxis_data;
        this.sbdq_pie.series_data = map_series_data;
        this.drawSbdqMap();

        this.recordNoData.delete(9);
      } else {
        this.recordNoData.add(9);
        $("#sbdq-map-zhuce").html('<div class="nodata-box"></div>');
        $("#sbdq-map-zhuce").removeAttr("_echarts_instance_");
      }
    },
    drawSbdqMap() {
      var _that = this;
      _that.sbdq_map.echarts = Echarts.init(
        document.getElementById("sbdq-map-zhuce"),
        "yaozh_theme"
      );
      _that.sbdq_map.echarts.clear()
      _that.tempType[9] = 'map'
      _that.sbdq_map.echarts.setOption({
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(9),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myToggleBar: {
              show: true,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                _that.tempType[9] = 'bar';
                _that.handleToggleBar("sbdq-map-zhuce", _that.sbdq_bar, 9);
              }
            },
            myTogglePie: {
              show: true,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {
                _that.tempType[9] = 'pie';
                _that.handleTogglePie("sbdq-map-zhuce", _that.sbdq_pie, 9);
              }
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.tempType[9] = 'map';
                _that.initOpendKsh(9);
              }
            }
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            return `${params.name}<br/>数量：${params.value ? params.value : 0
              }`;
          }
        },
        visualMap: {
          min: 0,
          max: _that.sbdq_map.max,
          left: "left",
          top: "bottom",
          text: ["高", "低"], // 文本，默认为数值文本
          calculable: true
        },
        series: [
          {
            name: "数量",
            type: "map",
            mapType: "china",
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            data: _that.sbdq_map.series_data
          }
        ]
      });
    },
    drawSbdqMapOpen() {
      var _that = this;
      Echarts.getInstanceByDom(
        document.getElementById("sbdq-map-zhuce-open")
      ) && Echarts.getInstanceByDom(
        document.getElementById("sbdq-map-zhuce-open")
      ).clear()
      if (this.tempType[9] == 'bar') {
        _that.handleToggleBar(
          "sbdq-map-zhuce-open",
          _that.sbdq_map,
          undefined,
          9
        );
      } if (this.tempType[9] == 'pie') {
        _that.handleTogglePie(
          "sbdq-map-zhuce-open",
          _that.sbdq_map,
          undefined,
          9
        );
      } else {
        Echarts.init(
          document.getElementById("sbdq-map-zhuce-open"),
          "yaozh_theme"
        ).setOption({
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(9),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myToggleBar: {
                show: true,
                title: "柱形图",
                icon: "image:///static/imgs/echarts/bar.png",
                onclick() {
                  _that.tempType[9] = "bar";
                  _that.handleToggleBar(
                    "sbdq-map-zhuce-open",
                    _that.sbdq_bar,
                    undefined
                  );
                }
              },
              myTogglePie: {
                show: true,
                title: "饼形图",
                icon: "image:///static/imgs/echarts/pie.png",
                onclick() {
                  _that.tempType[9] = "pie";
                  _that.handleTogglePie(
                    "sbdq-map-zhuce-open",
                    _that.sbdq_pie,
                    undefined
                  );
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: function (params) {
              return `${params.name}<br/>数量：${params.value ? params.value : 0
                }`;
            }
          },
          visualMap: {
            min: 0,
            max: _that.sbdq_map.max,
            left: "left",
            top: "bottom",
            text: ["高", "低"], // 文本，默认为数值文本
            calculable: true
          },
          series: [
            {
              name: "数量",
              type: "map",
              mapType: "china",
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: true
                }
              },
              data: _that.sbdq_map.series_data
            }
          ]
        });
      }
    },
    handleDialogVisible(value) {
      this.dialogVisible = value;
      // 退出全屏的时候需要将initopen改为false，不然不会重新渲染图标。
      this.initopen = value;
    },
    // 切换为饼形图
    handleTogglePie(el, data, index, oIndex) {
      let _that = this;
      let option;
      if (el == "spjl-pie-zhuce" || el == "spjl-pie-zhuce-open") {
        // 审评结论 专属饼形图属性
        option = {
          legend: {
            type: "scroll",
            bottom: 0,
            data: data.xAxis_data
          },
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(index),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myToggleBar: {
                show: true,
                title: "柱形图",
                icon: "image:///static/imgs/echarts/bar.png",
                onclick() {
                  if (oIndex || index) _that.tempType[oIndex || index] = "bar";
                  _that.handleToggleBar(el, data, index);
                }
              },
              myMagnify: {
                show: true,
                title: "全屏",
                icon: "image:///static/imgs/echarts/fullscreen.png",
                onclick() {
                  _that.initOpendKsh(index);
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "75%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "outside"
                },
                emphasis: {
                  show: true,
                  formatter: "{d}%",
                  align: "center",
                  textStyle: {
                    fontSize: "30",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: data.series_data
            }
          ]
        };
      } else if (el == "blzt-bar-zhuce" || el == "blzt-bar-zhuce-open") {
        // 办理状态
        option = {
          legend: {
            type: "scroll",
            bottom: 0,
            data: data.xAxis_data
          },
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(index),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myToggleBar: {
                show: true,
                title: "柱形图",
                icon: "image:///static/imgs/echarts/bar.png",
                onclick() {
                  if (oIndex || index) _that.tempType[oIndex || index] = "bar";
                  _that.handleToggleBar(el, data, index);
                }
              },
              myMagnify: {
                show: true,
                title: "全屏",
                icon: "image:///static/imgs/echarts/fullscreen.png",
                onclick() {
                  _that.initOpendKsh(index);
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "75%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "outside"
                },
                emphasis: {
                  show: true,
                  formatter: "{d}%",
                  align: "center",
                  textStyle: {
                    fontSize: "30",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: data.series_data
            }
          ]
        };
      } else if (el == "ylfl-pie-zhuce" || el == "ylfl-pie-zhuce-open") {
        // ATC分类 专属饼形图属性
        option = {
          legend: {
            type: "scroll",
            bottom: 0,
            data: data.xAxis_data
          },
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(index),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myToggleBar: {
                show: true,
                title: "柱形图",
                icon: "image:///static/imgs/echarts/bar.png",
                onclick() {
                  if (oIndex || index) _that.tempType[oIndex || index] = "bar";
                  _that.handleToggleBar(el, data, index);
                }
              },
              myMagnify: {
                show: true,
                title: "全屏",
                icon: "image:///static/imgs/echarts/fullscreen.png",
                onclick() {
                  _that.initOpendKsh(index);
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
          },
          series: [
            {
              type: "pie",
              label: {
                normal: {
                  show: true,
                  position: "outside",
                  formatter: "{b}{d}%"
                }
              },
              data: data.series_data
            }
          ]
        };
      } else if (el == "sbdq-map-zhuce" || el == "sbdq-map-zhuce-open") {
        option = {
          legend: {
            type: "scroll",
            bottom: 0,
            data: data.xAxis_data
          },
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(index),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myToggleBar: {
                show: true,
                title: "柱形图",
                icon: "image:///static/imgs/echarts/bar.png",
                onclick() {
                  if (oIndex || index) _that.tempType[oIndex || index] = "bar";
                  _that.handleToggleBar(el, _that.sbdq_bar, index);
                }
              },
              myToggleMap: {
                show: true,
                title: "热力图",
                icon: "image:///static/imgs/echarts/map.png",
                onclick() {
                  if (oIndex || index) _that.tempType[oIndex || index] = "map";
                  _that.handleToggleMap(el, _that.sbdq_map, index);
                }
              },
              myMagnify: {
                show: true,
                title: "全屏",
                icon: "image:///static/imgs/echarts/fullscreen.png",
                onclick() {
                  _that.initOpendKsh(index);
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
          },
          series: [
            {
              type: "pie",
              label: {
                normal: {
                  show: true,
                  position: "outside",
                  formatter: "{b}{d}%"
                }
              },
              data: data.series_data
            }
          ]
        };
      } else {
        option = {
          legend: {
            type: "scroll",
            bottom: 0,
            data: data.xAxis_data
          },
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(index),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myToggleBar: {
                show: true,
                title: "柱形图",
                icon: "image:///static/imgs/echarts/bar.png",
                onclick() {
                  if (oIndex || index) _that.tempType[oIndex || index] = "bar";
                  _that.handleToggleBar(el, data, index);
                }
              },
              myMagnify: {
                show: true,
                title: "全屏",
                icon: "image:///static/imgs/echarts/fullscreen.png",
                onclick() {
                  _that.initOpendKsh(index);
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
          },
          series: [
            {
              type: "pie",
              label: {
                normal: {
                  show: true,
                  position: "outside",
                  formatter: "{b}:{d}%"
                }
              },
              data: data.xAxis_data.reduce((res, item, index) => {
                res.push({ value: data.series_data[index], name: item });
                return res;
              }, [])
            }
          ]
        };
      }

      if (index == undefined) {
        option.toolbox.feature.myMagnify = {};
      }
      $("#" + el).removeAttr("_echarts_instance_");
      let chart = Echarts.init(document.getElementById(el), "yaozh_theme");
      //chart.clear()
      chart.setOption(option);
    },
    // 切换为柱形图
    handleToggleBar(el, data, index, oIndex) {
      console.log(el, data, index, oIndex);
      let _that = this;
      let option;
      if (el == "sbdq-map-zhuce" || el == "sbdq-map-zhuce-open") {
        option = {
          tooltip: {
            trigger: "item",
            formatter: "{b}:<br />数量: {c}"
          },
          dataZoom: {
            show: true,
            startValue: 0,
            endValue: 9,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
            left: 'center', // 组件离容器左侧的距离,'left', 'center', 'right','20%'
            top: 'bottom', // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
            right: 'auto', // 组件离容器右侧的距离,'20%'
            bottom: 'auto', // 组件离容器下侧的距离,'20%'
            height: 25 //这里可以设置dataZoom的尺寸
          },
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(index),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myTogglePie: {
                show: true,
                title: "饼形图",
                icon: "image:///static/imgs/echarts/pie.png",
                onclick() {
                  if (oIndex || index) _that.tempType[oIndex || index] = "pie";
                  _that.handleTogglePie(el, _that.sbdq_pie, index);
                }
              },
              myToggleMap: {
                show: true,
                title: "热力图",
                icon: "image:///static/imgs/echarts/map.png",
                onclick() {
                  if (oIndex || index) _that.tempType[oIndex || index] = "pie";
                  _that.handleToggleMap(el, _that.sbdq_map, index);
                }
              },
              myMagnify: {
                show: true,
                title: "全屏",
                icon: "image:///static/imgs/echarts/fullscreen.png",
                onclick() {
                  _that.initOpendKsh(index);
                }
              }
            }
          },
          grid: {
            containLabel: true
          },
          xAxis: {
            type: "category",
            axisLabel: {
              rotate: 45
            },
            data: data.xAxis_data
          },
          yAxis: {
            type: "value",
            name: "数量"
          },
          series: [
            {
              label: {
                show: true,
                position: "top"
              },
              data: data.series_data,
              type: "bar"
            }
          ]
        };
      } else {
        option = {
          tooltip: {
            trigger: "item",
            formatter: "{b}:<br />数量: {c}"
          },
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(index),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myTogglePie: {
                show: true,
                title: "饼形图",
                icon: "image:///static/imgs/echarts/pie.png",
                onclick() {
                  if (oIndex || index) _that.tempType[oIndex || index] = "pie";
                  console.log(_that.tempType[oIndex || index]);
                  _that.handleTogglePie(el, data, index);
                }
              },
              myMagnify: {
                show: true,
                title: "全屏",
                icon: "image:///static/imgs/echarts/fullscreen.png",
                onclick() {
                  _that.initOpendKsh(index);
                }
              }
            }
          },
          grid: {
            containLabel: true
          },
          xAxis: {
            type: "category",
            axisLabel: {
              rotate: 45
            },
            data: data.xAxis_data
          },
          yAxis: {
            type: "value",
            name: "数量"
          },
          series: [
            {
              data: data.series_data,
              type: "bar",
              label: {
                show: true,
                position: "top"
              }
            }
          ]
        };
      }

      if (index == undefined) {
        option.toolbox.feature.myMagnify = {};
      }
      $("#" + el).removeAttr("_echarts_instance_");
      let chart = Echarts.init(document.getElementById(el), "yaozh_theme");
      chart.clear()
      chart.setOption(option);
    },
    handleToggleMap(el, data, index, oIndex) {
      let _that = this;
      let option;
      if (el == "sbdq-map-zhuce" || el == "sbdq-map-zhuce-open") {
        option = {
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(index),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myToggleBar: {
                show: true,
                title: "柱形图",
                icon: "image:///static/imgs/echarts/bar.png",
                onclick() {
                  if (oIndex || index) _that.tempType[oIndex || index] = "pie";
                  _that.handleToggleBar(el, _that.sbdq_bar, index);
                }
              },
              myTogglePie: {
                show: true,
                title: "饼形图",
                icon: "image:///static/imgs/echarts/pie.png",
                onclick() {
                  if (oIndex || index) _that.tempType[oIndex || index] = "pie";
                  _that.handleTogglePie(el, _that.sbdq_pie, index);
                }
              },
              myMagnify: {
                show: true,
                title: "全屏",
                icon: "image:///static/imgs/echarts/fullscreen.png",
                onclick() {
                  _that.initOpendKsh(index);
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: function (params) {
              return `${params.name}<br/>数量：${params.value ? params.value : 0
                }`;
            }
          },
          visualMap: {
            min: 0,
            max: this.sbdq_map.max,
            left: "left",
            top: "bottom",
            text: ["高", "低"], // 文本，默认为数值文本
            calculable: true
          },
          series: [
            {
              name: "数量",
              type: "map",
              mapType: "china",
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: true
                }
              },
              data: this.sbdq_map.series_data
            }
          ]
        };
      }

      if (index == undefined) {
        option.toolbox.feature.myMagnify = {};
      }
      $("#" + el).removeAttr("_echarts_instance_");
      let chart = Echarts.init(document.getElementById(el), "yaozh_theme");
      chart.setOption(option);
    },
    initShowScroll() {
      let outterWidth = Number($(".newtotals").width());
      let num = Number($(".newtotals .total-item").length);
      let maxNum = parseInt((outterWidth - 60) / 200);
      if (200 * num <= outterWidth) {
        $(".newtotals-left").hide();
        $(".newtotals-right").hide();
        $(".newtotals .total-item").css({
          width: 100 / num + "%"
        });
        $(".newtotals-scroll").css({
          width: "100%",
          margin: "0"
        });
        $(".newtotals-scroll-inner").css({
          width: "100%"
        });
      } else {
        $(".newtotals-left").show();
        $(".newtotals-right").show();
        $(".newtotals-scroll").css({
          width: 200 * maxNum,
          margin: "0px 30px"
        });
        $(".newtotals-scroll-inner").css({
          width: 200 * num
        });
        $(".newtotals .total-item").css({
          width: 200
        });
      }
    },
    handleShowScrollLeft() {
      let pointer = Number(
        _.replace($(".newtotals-scroll-inner").css("left"), "px", "")
      );
      if (pointer != 0 && pointer % 200 == 0) {
        $(".newtotals-scroll-inner").animate(
          {
            left: pointer + 200
          },
          300
        );
      }
    },
    handleShowScrollRight() {
      let outterWidth = Number($(".newtotals").width());
      let num = Number($(".newtotals .total-item").length);
      let maxNum = parseInt((outterWidth - 60) / 200);
      let pointer = Number(
        _.replace($(".newtotals-scroll-inner").css("left"), "px", "")
      );
      if (pointer != 200 * (maxNum - num) && pointer % 200 == 0) {
        $(".newtotals-scroll-inner").animate(
          {
            left: pointer - 200
          },
          300
        );
      }
    },
    echartsResizeHandler() {
      if (this.dialogVisible) {
        this.initLayout();
        this.echartsResize("open-charts");
      } else {
        this.echartsResize("echarts");
      }
    },
    // Vuex内存储的搜索条件和页面内的对比，返回状态
    diffSearchData() {
      const currentSearchData = {
        putong: this.putong,
        gaoji: this.gaoji,
        shaixuan: this.shaixuan,
        fourth: this.fourth,
        hot: this.hot
      };
      const currentJson = JSON.stringify(currentSearchData);
      const localJson = JSON.stringify(this.searchState);
      console.log(currentJson, localJson, currentJson != localJson);
      if (currentJson != localJson) {
        this.searchState = currentSearchData;
        console.log(this.searchState);
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    //this.initLayout()
    this.loadData();
  },
  mounted() {
    $(".select-sort .el-input__inner").attr("UNSELECTABLE", 'on')
    window.addEventListener("resize", this.echartsResizeHandler);
  },
  activated() {
    // this.nopms一直为undefined状态，暂时屏蔽，后续再观察是否有其它用处
    this.vueRouteToNoPms(this.nopms.ksh);
    if (this.diffSearchData()) {
      this.loadData();
    }
    // this.initShowScroll()
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.ksh);
    this.initShowScroll();
  }
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.pc-zhuce-analy {

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

  .chart_top {
    background-color: #eff2fa;
    box-shadow: 0px 2px 8px 0px #D8E2FA;
    border-radius: 4px;

    .newtotals {
      // margin-top: 20px!important;
      height: 113px;
      background-color: @White;
      box-shadow: 0 0;
      // border-top: 1px solid #dfe5f1;
      overflow: hidden;
      display: flex;
      justify-content: center;
      position: relative;
      border-radius: 0 0 4px 4px;

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
        }
      }

      .newtotals-arrow {
        display: none;
        height: 113px;
        line-height: 113px;
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
        left: 0px;
      }

      .newtotals-right {
        right: 0px;
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
        width: 200px;
        height: 113px;
        text-align: center;
        vertical-align: text-bottom;
        border-bottom: 3px solid @White;
        margin-bottom: 5px;

        &:hover {
          color: @PrimaryColor;
          background-color: #eff2fa;
          border-bottom: 3px solid @PrimaryColor;
        }

        .li1 {
          padding-top: 15px;
          font-size: 13px;
          font-weight: 600;
          height: 13px;
          line-height: 13px;
          margin-bottom: 15px;
        }

        .li2 {
          font-size: 14px;
          height: 24px;
          line-height: 24px;

          span {
            font-size: 24px;
            color: @PrimaryColor;
          }
        }
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
    }
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

  .chart_bottom {
    background-color: #eff2fa;
    padding-top: 5px;

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

  .select-sort {
    width: 88px;
    height: 28px;
    border-radius: 4px;
    border: 1px solid #4877E8;
    margin: 5px 10px 5px 0 !important;

    .el-input--mini .el-input__inner {
      padding: 0 10px;
      font-size: 12px;
      font-weight: 400;
      color: #4877E8;
    }

    .el-select .el-input.is-focus .el-input__inner,
    input.el-input__inner {
      border: none;
    }

    .el-input__inner {
      background: transparent;
    }
  }
}

.el-select .el-input .el-select__caret {
  color: #4877E8 !important;
}

.top-loading {
  transition: all 300ms 50ms;
  //置于提示窗下
  z-index: 1997;
  position: absolute;
  top: 0;
  width: 100%;
  height: 154px;
  background: rgba(255, 255, 255, 1);
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
</style>
