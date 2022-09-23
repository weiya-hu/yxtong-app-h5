<template>
  <div class="analy-wrapeer" style="position: relative;">
    <!-- 加载完成显示部分 -->
    <LoadingGif :className="'top-loading'" :loadFlag="analyLoading" v-if="analyLoading"></LoadingGif>
    <!-- 顶部统计 -->
    <div class="chart_top">
      <div class="newtotals">
        <div class="iconfont newtotals-arrow newtotals-left" @click="handleShowScrollLeft">&#xe64e;</div>
        <div class="iconfont newtotals-arrow newtotals-right" @click="handleShowScrollRight">&#xe64f;</div>
        <div class="newtotals-scroll">
          <div class="newtotals-scroll-inner">
            <ul class="total-item">
              <li class="li1">登记数量</li>
              <li class="li2">
                总计
                <span>{{ basic.baseCount }}</span>个
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">申办/合作单位</li>
              <li class="li2">
                总计
                <span>{{ basic.sponsor2Count }}</span>家
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">疾病</li>
              <li class="li2">
                总计
                <span>{{ basic.conditions2Count }}</span>个
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">干预药物</li>
              <li class="li2">
                总计
                <span>{{ basic.interventions2Count }}</span>个
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="chart_bottom">
      <div class="go-list">
        <router-link tag="a" :to="{ path: '/clinical/list' }">返回列表</router-link>
      </div>
      <div class="chart-boxes">
        <!-- 自定义加载界面 -->
        <DbEcharts title="登记趋势">
          <div style="position: relative;">
            <div id="djqs-line-clinical" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </div>
        </DbEcharts>
        <DbEcharts title="试验分期">
          <div id="syfq-bar-clinical" class="echarts">
            <div class="nodata-box"></div>
          </div>
        </DbEcharts>
        <DbEcharts title="研究类型">
          <div id="yjlx-bar-clinical" class="echarts">
            <div class="nodata-box"></div>
          </div>
        </DbEcharts>
        <DbEcharts id="step1" :title="jblyTitle">
          <!-- 新手引导 -->
          <div class="new-guide" v-if="showClinicalAnalyGuide">
            <div :style="{
              left: step1Position && step1Position.left + 'px',
              top: step1Position && step1Position.top + 'px'
            }" :class="['guide-bg', `guide-step${guideStep}`]"></div>

            <!-- 开始教程 -->
            <div v-if="guideStep == 0" class="guide-content0">
              <img src="../../../static/imgs/trz/trz_tips.png" alt="" />
              <div class="info">
                <h4>欢迎使用全球临床试验智能分析</h4>
                <p>下面请跟随小智快速熟悉吧！</p>

                <div class="info-footer">
                  <div @click="handleNextStep">开始教程</div>
                  <span @click="handleKnow">我已知晓，直接跳过</span>
                </div>
              </div>
            </div>

            <!-- 疾病领域 (支持二次分析) -->
            <div v-if="guideStep == 1" class="guide-content1 fadeInUp" :style="{
              left: step1Position && step1Position.left + 'px',
              top: (step1Position && step1Position.top) + 50 + 'px'
            }">
              <img src="../../../static/imgs/trz/trz_line.png" alt="" />
              <div class="info">
                <p>
                  疾病领域：点击堆叠柱状图，对某一疾病领域深度分析。
                </p>
                <div class="info-footer">
                  <div @click="handleNextStep">下一步({{ guideStep }}/2)</div>
                  <span @click="handleKnow">我已知晓，直接跳过</span>
                </div>
              </div>
            </div>

            <!-- 干预药物类别 (支持二次分析) -->
            <div v-if="guideStep == 2" class="guide-content2 fadeInUp" :style="{
              left: step1Position && step1Position.left + 'px',
              top: (step1Position && step1Position.top) + 50 + 'px'
            }">
              <img src="../../../static/imgs/trz/trz_line.png" alt="" />
              <div class="info">
                <p>
                  干预药物类别：点击药物类别堆叠柱状图，对某一类别深度分析。
                </p>
                <div class="info-footer">
                  <div @click="handleKnow">完成教程</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="jblyLevel > 1" class="go-back jbly mini" @click="goBack('疾病领域 (支持二次分析)')">
            返回
          </div>
          <div id="jbly-bar-clinical" class="echarts">
            <div class="nodata-box"></div>
          </div>
        </DbEcharts>
        <DbEcharts id="step2" :title="gyywlbTitle">
          <div v-if="gyywlbLevel > 1" class="go-back gyywlb mini" @click="goBack('干预药物类别 (支持二次分析)')">
            返回
          </div>
          <div id="gyywlb-bar-clinical" class="echarts">
            <div class="nodata-box"></div>
          </div>
        </DbEcharts>
        <DbEcharts title="申办/合作单位 TOP20">
          <div id="sbhzdw-bar-clinical" class="echarts">
            <div class="nodata-box"></div>
          </div>
        </DbEcharts>
        <DbEcharts title="试验地区">
          <stateMap :isOpen="false" ref="map" :guanlian="guanlian" @fullscreen="fullscreen" />
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
            <div>
              <!-- 折线图 -->
              <div id="djqs-line-clinical-open" class="open-charts"></div>
            </div>
          </div>
          <div class="echarts-item">
            <!-- 试验分期 -->
            <div id="syfq-bar-clinical-open" class="open-charts"></div>
          </div>
          <div class="echarts-item">
            <!-- 研究类型 -->
            <div id="yjlx-bar-clinical-open" class="open-charts"></div>
          </div>
          <div class="echarts-item">
            <div v-if="jblyLevel > 1 && openIndex == 3" class="go-back jbly open" @click="goBack('疾病领域 (支持二次分析)')">
              返回
            </div>
            <!-- 疾病领域 (支持二次分析) -->
            <div id="jbly-bar-clinical-open" class="open-charts"></div>
          </div>
          <div class="echarts-item">
            <div v-if="gyywlbLevel > 1 && openIndex == 4" class="go-back gyywlb open"
              @click="goBack('干预药物类别 (支持二次分析)')">
              返回
            </div>
            <!-- 干预药物类别 (支持二次分析) -->
            <div id="gyywlb-bar-clinical-open" class="open-charts"></div>
          </div>
          <div class="echarts-item">
            <!-- 申办/合作单位 TOP20 -->
            <div id="sbhzdw-bar-clinical-open" class="open-charts"></div>
          </div>
          <div class="echarts-item">
            <stateMap :isOpen="true" ref="map-open" :guanlian="guanlian" @fullscreen="fullscreen" />
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
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import DbEcharts from "@/components/common/db-echarts";
import stateMap from './components/stateMap'

import { mapState } from "vuex";

var _res = {};
const myicon = {
  open:
    "path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891"
};

export default {
  components: {
    LoadingGif,
    DbEcharts,
    stateMap
  },
  data() {
    return {
      step1Position: {},
      guideStep: 0, // 新手引导步骤数
      showClinicalAnalyGuide: false, // 控制新手引导弹窗显示隐藏
      jblyTitle: "疾病领域 (支持二次分析)",
      jblySecondTitle: "",
      gyywlbSecondTitle: "",
      gyywlbTitle: "干预药物类别 (支持二次分析)",
      guanlian: {
        dt: {
          locations: 'locations2_guifan1',
        }
      },
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
      phasesArr: [
        'Early Phase 1',
        'Phase 1',
        'Phase 2',
        'Phase 1/Phase 2',
        'Phase 3',
        'Phase 2/Phase 3',
        'Phase 4',
        // 'Phase 3/Phase 4',
        'Not Applicable'
      ],
      title: [
        "登记趋势",
        "试验分期",
        "研究类型",
        "疾病领域 (支持二次分析)",
        "干预药物类别 (支持二次分析)",
        "申办/合作单位 TOP20",
        "试验地区"
      ], //图形标题
      basic: {
        baseCount: 0,
        sponsor2Count: 0,
        conditions2Count: 0,
        interventions2Count: 0
      },
      djqs_line: {
        echarts: null,
        yAxis_data: [],
        series_data: []
      },
      syfq_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      yjlx_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      jbly_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      gyywlb_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      sbhzdw_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      sydq_map: {
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
      param: state => state.Clinical.param,
      // 基础数量统计
      base: state => state.Clinical.base,
      // 登记趋势
      received: state => state.Clinical.received,
      // 试验分期
      phases: state => state.Clinical.phases,
      // 研究类型
      study_guifan: state => state.Clinical.study_guifan,
      // 疾病领域 (支持二次分析)
      conditions1_guifan: state => state.Clinical.conditions1_guifan,
      // 干预药物类别 (支持二次分析)
      interventions1_guifan: state => state.Clinical.interventions1_guifan,
      // 申办/合作单位 TOP20
      sponsor2: state => state.Clinical.sponsor2,
      topLoading: state => state.Clinical.topLoading,
      analyLoading: state => state.Clinical.analyLoading,
      nopms: state => state.Clinical.nopms,
      conditions: state => state.Clinical.conditions,
      cateList: state => state.Clinical.cateList,
      res1: state => state.Clinical.res1,
      res2: state => state.Clinical.res2,
      res3: state => state.Clinical.res3,
      activeTabName: state => state.Clinical.tabname,
      putong: (state) => state.Clinical.putong,
      gaoji: (state) => state.Clinical.gaoji,
      shaixuan: (state) => state.Clinical.shaixuan,
      fourth: (state) => state.Clinical.fourth,
      hot: (state) => state.Clinical.hot,
      match_shaixuan_values: (state) => state.Clinical.match_shaixuan_values,
      hot: (state) => state.Clinical.hot,
      groups: (state) => state.Clinical.groups,
      queryData: (state) => state.Clinical.queryData,
      jblyLevel: (state) => state.Clinical.jblyLevel,
      gyywlbLevel: (state) => state.Clinical.gyywlbLevel,
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
            case 1:
              if (item == 'pie') {
                this.handleTogglePie("syfq-bar-clinical-open", this.syfq_bar, undefined, 1)
              } else if (item == 'bar') {
                this.tempType[i] = 'bar';
                this.drawSyfqBarOpen();
              }
              break;
            case 2:
              if (item == 'pie') {
                this.handleTogglePie("yjlx-bar-clinical-open", this.yjlx_bar, undefined, 2)
              } else if (item == 'bar') {
                this.tempType[i] = 'bar';
                this.drawYjlxBarOpen();
              }
              break;
          }
        } else {
          switch (i) {
            case 1:
              if (item == 'pie') {
                this.handleTogglePie("syfq-bar-clinical", this.syfq_bar, 1)
              } else if (item == 'bar') {
                this.tempType[i] = 'bar';
                this.drawSyfqBar();
              }
              break;
            case 2:
              if (item == 'pie') {
                this.handleTogglePie("yjlx-bar-clinical", this.yjlx_bar, 2)
              } else if (item == 'bar') {
                this.tempType[i] = 'bar';
                this.drawYjlxBar();
              }
              break;
          }
        }
      })
    },
    base(newVal) {
      this.diffSearchData();
      if (typeof newVal != "undefined") {
        this.basic = newVal;
      }
    },
    received(newVal) {
      if (this.$route.path == "/clinical/analy") {
        this.dealDjqsLine(newVal);
      }
    },
    phases(newVal) {
      if (this.$route.path == "/clinical/analy") {
        this.dealSyfqBar(newVal);
      }
    },
    study_guifan(newVal) {
      if (this.$route.path == "/clinical/analy") {
        this.dealYjlxBar(newVal);
      }
    },
    conditions1_guifan(newVal) {
      if (this.$route.path == "/clinical/analy") {
        this.dealJblyBar(newVal);
      }
    },
    interventions1_guifan(newVal) {
      if (this.$route.path == "/clinical/analy") {
        this.dealGyywlbBar(newVal);
      }
    },
    sponsor2(newVal) {
      if (this.$route.path == "/clinical/analy") {
        this.dealSbhzdwBar(newVal);
      }
    },
    // cateList(newVal) {
    //   if (this.$route.path == "/clinical/analy") {
    //     this.dealSydqMap();
    //   }
    // },
    dialogVisible() {
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
    fullscreen() {
      this.dialogVisible = true;
      this.initOpendKsh(6);
      const that = this
      this.$nextTick(() => {
        that.dealSydqMap();
      })
    },
    getImgName(i) {
      let title = i ? this.title[i] : this.title[this.openIndex];
      return `药智数据企业版-${document.title}-智能分析-${this.title[i]}`;
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
      Store.dispatch("Clinical/getKshRes").then(res => {
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
    dealSydqMap() {
      if (this.dialogVisible) {
        this.$refs["map-open"].mapData();
        this.$refs["map-open"].resizeEvent()
      } else {
        this.$refs["map"].mapData();
        this.$refs["map"].resizeEvent()
      }
    },
    update() {
      this.dealDjqsLine(this.received);
      this.dealSyfqBar(this.phases);
      this.dealYjlxBar(this.study_guifan);
      this.dealJblyBar(this.conditions1_guifan);
      this.dealGyywlbBar(this.interventions1_guifan);
      this.dealSbhzdwBar(this.sponsor2);
      this.dealSydqMap();

      this.$nextTick(() => {
        let timer = setTimeout(() => {
          if (!localStorage.getItem("showClinicalAnalyGuide")) {
            this.showClinicalAnalyGuide = true;
            this.getGuidLeft();
          }
          clearTimeout(timer);
        }, 0);
      });
      window.addEventListener('resize', () => {
        this.getGuidLeft();
      })

      if (this.guideStep == 0 && !localStorage.getItem("showClinicalAnalyGuide")) {
        // if (this.guideStep == 0) {
        var mo = function (e) { passive: false };
        document.querySelector(".el-scrollbar__wrap.el-scrollbar__wrap--hidden-default").addEventListener("touchmove", mo, false);//禁止页面滑动
        setTimeout(() => {
          let scrollTop = $("#step1").offset().top;
          var timer = null;
          function scrollPosition(target, position) {
            // 父层元素的高度
            let height = window.getComputedStyle(target).height.replace('px', '');
            // 父元素可滚动的高度
            let scrollHegiht = target.scrollHeight;
            height = Number(height);
            // 取消一个通过调用requestAnimationFrame()方法添加到计划中的动画帧请求.
            cancelAnimationFrame(timer);
            // 判断滚动那个位置
            if (position == "top") {
              position = 0
              /* requestAnimationFrame 会把每一帧中的所有DOM操作集中起来, 一般来说，这个频率为每秒60帧。 */
              timer = requestAnimationFrame(function sTop() {
                var top = target.scrollTop;
                if (top > position) {
                  //使用定时器，将scrollTop的值每次减少20（自行设置），直到减少到0，则滚动完毕
                  target.scrollTop = top - 20;
                  timer = requestAnimationFrame(sTop);//递归调用
                } else {
                  cancelAnimationFrame(timer);
                }
              });
            } else {
              if (position == "bottom") {
                position = scrollHegiht - height - 100;
              }
              timer = requestAnimationFrame(function sTop() {
                var top = target.scrollTop;
                if (top < position) {
                  target.scrollTop = top + 20;
                  timer = requestAnimationFrame(sTop);//递归调用
                } else {
                  cancelAnimationFrame(timer);
                }
              });
            }
          }
          // scrollPosition(document.querySelector(".el-scrollbar__wrap.el-scrollbar__wrap--hidden-default"), 'bottom')
          $(".el-scrollbar__wrap.el-scrollbar__wrap--hidden-default").animate({ scrollTop: scrollTop - 100 }, 600);
          this.getGuidLeft();
          document.querySelector(".el-scrollbar__wrap.el-scrollbar__wrap--hidden-default").removeEventListener("touchmove", mo, false);
        }, 600);
      }
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
          _that.drawDjqsLineOpen();
          _that.drawSyfqBarOpen();
          _that.drawYjlxBarOpen();
          _that.drawJblyBarOpen();
          _that.drawGyywlbBarOpen();
          _that.drawSbhzdwBarOpen();
          _that.dealSydqMap();

          _that.handleOpenIndex(index);
          this.loading = false;
        }, 500);
      } else {
        this.handleOpenIndex(index);
        this.loading = false;
      }
    },
    //登记趋势
    dealDjqsLine(received) {
      var xAxis_data = [];
      var series_data = [];

      if (received.length) {
        received.forEach(item => {
          series_data.push(item.doc_count);
          xAxis_data.push(item.label);
        });
        this.djqs_line.xAxis_data = xAxis_data;
        this.djqs_line.series_data = series_data;
        this.drawDjqsLine();
        this.recordNoData.delete(0);
      } else {
        this.recordNoData.add(0);
        $("#djqs-line-clinical").html('<div class="nodata-box"></div>');
        $("#djqs-line-clinical").removeAttr("_echarts_instance_");
      }
    },
    drawDjqsLine() {
      var _that = this;
      _that.djqs_line.echarts = Echarts.init(
        document.getElementById("djqs-line-clinical"),
        "yaozh_theme"
      );
      _that.djqs_line.echarts.clear()
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
          data: _that.djqs_line.legend_data
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}年<br />数量: {c}"
        },
        grid: {
          containLabel: true,
          bottom: 60
        },
        dataZoom: {
          id: 'dataZoomX',
          show: true,
          startValue: _that.djqs_line.xAxis_data.length - 10,
          endValue: _that.djqs_line.xAxis_data.length - 1,
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
          name: "年份",
          data: _that.djqs_line.xAxis_data
        },
        yAxis: {
          name: "登记数量"
        },
        series: [
          {
            name: "数量",
            type: "line",
            connectNulls: true,
            data: _that.djqs_line.series_data
          }
        ]
      };
      if (_that.djqs_line.xAxis_data.length < 10) {
        option.legend.bottom = 10;
        option.grid.bottom = 0;
        option.dataZoom.show = false;
      } else {
        option.legend.bottom = 25;
        option.grid.bottom = 60;
        option.dataZoom.show = true;
      }
      _that.djqs_line.echarts.setOption(option);
    },
    drawDjqsLineOpen() {
      var _that = this;
      var e = Echarts.init(
        document.getElementById("djqs-line-clinical-open"),
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
        legend: {
          show: true,
          bottom: 25,
          data: _that.djqs_line.legend_data
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}年<br />数量: {c}"
        },
        grid: {
          containLabel: true,
          bottom: 60
        },
        dataZoom: {
          id: 'dataZoomX',
          show: true,
          startValue: _that.djqs_line.xAxis_data.length - 10,
          endValue: _that.djqs_line.xAxis_data.length - 1,
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
          name: "年份",
          data: _that.djqs_line.xAxis_data
        },
        yAxis: {
          name: "登记数量"
        },
        series: [
          {
            name: "数量",
            type: "line",
            connectNulls: true,
            data: _that.djqs_line.series_data
          }
        ]
      };
      if (_that.djqs_line.xAxis_data.length < 10) {
        option.legend.bottom = 10;
        option.grid.bottom = 0;
        option.dataZoom.show = false;
      } else {
        option.legend.bottom = 25;
        option.grid.bottom = 60;
        option.dataZoom.show = true;
      }
      e.setOption(option);
    },
    //试验分期柱状图
    dealSyfqBar(phases) {
      let _len = phases.length;
      let xAxis_data = [];
      let series_data = [];
      let open_xAxis_data = [];
      let open_series_data = [];
      if (_len > 0) {
        if (_len > 15) {
          for (var i = 0; i < 15; i++) {
            xAxis_data.push(phases[i].key);
            series_data.push(phases[i].doc_count);
          }
        } else {
          for (var i = 0; i < _len; i++) {
            xAxis_data.push(phases[i].key);
            series_data.push(phases[i].doc_count);
          }
        }

        for (var i = 0; i < _len; i++) {
          open_xAxis_data.push(phases[i].key);
          open_series_data.push(phases[i].doc_count);
        }
        this.syfq_bar.xAxis_data = xAxis_data;
        this.syfq_bar.series_data = series_data;
        this.drawSyfqBar();

        this.recordNoData.delete(1);
      } else {
        this.recordNoData.add(1);
        $("#syfq-bar-clinical").html('<div class="nodata-box"></div>');
        $("#syfq-bar-clinical").removeAttr("_echarts_instance_");
      }
    },
    drawSyfqBar() {
      var _that = this;
      _that.syfq_bar.echarts = Echarts.init(
        document.getElementById("syfq-bar-clinical"),
        "yaozh_theme"
      );
      _that.syfq_bar.echarts.clear()
      _that.tempType[1] = 'bar'
      _that.syfq_bar.echarts.setOption({
        legend: {
          bottom: 0,
          data: _that.syfq_bar.legend_data
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}<br />数量: {c}"
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(1),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myTogglePie: {
              show: true,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {
                _that.tempType[1] = 'pie';
                _that.handleTogglePie("syfq-bar-clinical", _that.syfq_bar, 1);
              }
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.tempType[1] = 'bar';
                _that.initOpendKsh(1);
              }
            }
          }
        },
        grid: {
          containLabel: true,
          bottom: 10
        },
        xAxis: {
          name: "试验分期",
          type: "category",
          axisLabel: {
            rotate: 30
          },
          data: _that.syfq_bar.xAxis_data
        },
        yAxis: {
          type: "value",
          name: "登记数量"
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "top"
            },
            data: _that.syfq_bar.series_data
          }
        ]
      });
    },
    drawSyfqBarOpen() {
      var _that = this;
      if (this.tempType[1] == 'pie') {
        _that.handleTogglePie(
          "syfq-bar-clinical-open",
          _that.syfq_bar,
          undefined,
          1
        );
      } else {
        Echarts.init(
          document.getElementById("syfq-bar-clinical-open"),
          "yaozh_theme"
        ).setOption({
          legend: {
            type: "scroll",
            bottom: 0,
            data: _that.syfq_bar.legend_data
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br />数量: {c}"
          },
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(1),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myTogglePie: {
                show: true,
                title: "饼形图",
                icon: "image:///static/imgs/echarts/pie.png",
                onclick() {
                  _that.tempType[1] = "pie";
                  _that.handleTogglePie(
                    "syfq-bar-clinical-open",
                    _that.syfq_bar,
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
            name: "试验分期",
            type: "category",
            data: _that.syfq_bar.xAxis_data
          },
          yAxis: {
            type: "value",
            name: "登记数量"
          },
          series: [
            {
              type: "bar",
              label: {
                show: true,
                position: "top"
              },
              data: _that.syfq_bar.series_data
            }
          ]
        });
      }
    },
    //研究类型柱状图
    dealYjlxBar(study_guifan) {
      let _len = study_guifan.length;
      let xAxis_data = [];
      let series_data = [];
      let open_xAxis_data = [];
      let open_series_data = [];
      if (_len > 0) {
        if (_len > 15) {
          for (var i = 0; i < 15; i++) {
            xAxis_data.push(study_guifan[i].key);
            series_data.push(study_guifan[i].doc_count);
          }
        } else {
          for (var i = 0; i < _len; i++) {
            xAxis_data.push(study_guifan[i].key);
            series_data.push(study_guifan[i].doc_count);
          }
        }

        for (var i = 0; i < _len; i++) {
          open_xAxis_data.push(study_guifan[i].key);
          open_series_data.push(study_guifan[i].doc_count);
        }
        this.yjlx_bar.xAxis_data = xAxis_data;
        this.yjlx_bar.series_data = series_data;
        this.drawYjlxBar();

        this.recordNoData.delete(2);
      } else {
        this.recordNoData.add(2);
        $("#yjlx-bar-clinical").html('<div class="nodata-box"></div>');
        $("#yjlx-bar-clinical").removeAttr("_echarts_instance_");
      }
    },
    drawYjlxBar() {
      var _that = this;
      _that.yjlx_bar.echarts = Echarts.init(
        document.getElementById("yjlx-bar-clinical"),
        "yaozh_theme"
      );
      _that.yjlx_bar.echarts.clear()
      // _that.tempType[2] = 'bar'
      // _that.yjlx_bar.echarts.setOption({
      //   legend: {
      //     bottom: 0,
      //     data: _that.yjlx_bar.legend_data
      //   },
      //   tooltip: {
      //     trigger: "item",
      //     formatter: function (params) {
      //       let text = `${params.name}<br/>`,
      //         arr = _that.study_guifan.filter(item => item.key == params.name)[0].children;
      //       if (arr.length > 0) {
      //         arr.forEach(item => {
      //           text += `${item.key}：${item.doc_count}<br/>`
      //         })
      //       } else {
      //         text = `${params.name}<br/>数量：${params.value ? params.value : 0
      //           }`;
      //       }
      //       return text;
      //     }
      //   },
      //   toolbox: {
      //     right: "20",
      //     feature: {
      //       saveAsImage: {
      //         title: "保存",
      //         name: _that.getImgName(2),
      //         icon: "image:///static/imgs/echarts/download.png"
      //       },
      //       myTogglePie: {
      //         show: true,
      //         title: "饼形图",
      //         icon: "image:///static/imgs/echarts/pie.png",
      //         onclick() {
      //           _that.tempType[2] = 'pie';
      //           _that.handleTogglePie("yjlx-bar-clinical", _that.yjlx_bar, 2);
      //         }
      //       },
      //       myMagnify: {
      //         show: true,
      //         title: "全屏",
      //         icon: "image:///static/imgs/echarts/fullscreen.png",
      //         onclick() {
      //           _that.tempType[2] = 'bar';
      //           _that.initOpendKsh(2);
      //         }
      //       }
      //     }
      //   },
      //   grid: {
      //     containLabel: true,
      //     bottom: 10
      //   },
      //   xAxis: {
      //     type: "category",
      //     axisLabel: {

      //       rotate: 30
      //     },
      //     data: _that.yjlx_bar.xAxis_data
      //   },
      //   yAxis: {
      //     type: "value",
      //     name: "数量"
      //   },
      //   series: [
      //     {
      //       type: "bar",
      //       label: {
      //         show: true,
      //         position: "top"
      //       },
      //       data: _that.yjlx_bar.series_data
      //     }
      //   ]
      // });
      _that.tempType[2] = 'pie';
      _that.handleTogglePie("yjlx-bar-clinical", _that.yjlx_bar, 2);
    },
    drawYjlxBarOpen() {
      var _that = this;
      if (this.tempType[2] == 'bar') {
        _that.handleToggleBar(
          "yjlx-bar-clinical-open",
          _that.yjlx_bar,
          undefined,
          2
        );
      } else {
        // Echarts.init(
        //   document.getElementById("yjlx-bar-clinical-open"),
        //   "yaozh_theme"
        // ).setOption({
        //   legend: {
        //     bottom: 0,
        //     data: _that.yjlx_bar.legend_data
        //   },
        //   tooltip: {
        //     trigger: "item",
        //     formatter: function (params) {
        //       let text = `${params.name}<br/>`,
        //         arr = _that.study_guifan.filter(item => item.key == params.name)[0].children;
        //       if (arr.length > 0) {
        //         arr.forEach(item => {
        //           text += `${item.key}：${item.doc_count}<br/>`
        //         })
        //       } else {
        //         text = `${params.name}<br/>数量：${params.value ? params.value : 0
        //           }`;
        //       }
        //       return text;
        //     }
        //   },
        //   toolbox: {
        //     right: "20",
        //     feature: {
        //       saveAsImage: {
        //         title: "保存",
        //         name: _that.getImgName(2),
        //         icon: "image:///static/imgs/echarts/download.png"
        //       },
        //       myTogglePie: {
        //         show: true,
        //         title: "饼形图",
        //         icon: "image:///static/imgs/echarts/pie.png",
        //         onclick() {
        //           _that.tempType[2] = 'pie';
        //           _that.handleTogglePie("yjlx-bar-clinical-open", _that.yjlx_bar, undefined);
        //         }
        //       }
        //     }
        //   },
        //   grid: {
        //     containLabel: true,
        //     bottom: 10
        //   },
        //   xAxis: {
        //     type: "category",
        //     axisLabel: {

        //       rotate: 30
        //     },
        //     data: _that.yjlx_bar.xAxis_data
        //   },
        //   yAxis: {
        //     type: "value",
        //     name: "数量"
        //   },
        //   series: [
        //     {
        //       type: "bar",
        //       label: {
        //         show: true,
        //         position: "top"
        //       },
        //       data: _that.yjlx_bar.series_data
        //     }
        //   ]
        // });

        _that.tempType[2] = 'pie';
        _that.handleTogglePie("yjlx-bar-clinical-open", _that.yjlx_bar, undefined, 2);
      }
    },
    //疾病领域 (支持二次分析)空心饼形图
    dealJblyBar(conditions1_guifan) {
      var _len = conditions1_guifan.length;
      var yAxis_data = [];
      var series_data = [[]];
      var series_data_result = [];
      var legend_data = conditions1_guifan.map(item => item.label);
      // var legend_data = this.phasesArr;
      var legend_data_len = legend_data.length;
      // 数据全为0，显示nodata
      let notAllZero = conditions1_guifan.find(item => {
        return item.children.find(ite => {
          return ite.doc_count != 0;
        });
      });
      if (!notAllZero) {
        _len = 0;
      }

      if (_len > 0) {
        for (var k = 0; k < _len; k++) {
          yAxis_data.push(conditions1_guifan[k].label);
        }

        for (var i = 0; i < legend_data_len; i++) {
          // series_data[i] = new Array(_len);
          for (var j = 0; j < _len; j++) {
            let gfzt_len = conditions1_guifan[j].children.length;
            let gfzt_key = [];
            for (var n = 0; n < gfzt_len; n++) {
              gfzt_key.push(conditions1_guifan[j].children[n].label);
            }
            // let m = _.indexOf(gfzt_key, legend_data[i].trim());
            // if (m < 0) {
            //   series_data[i][j] = 0;
            // } else {
            //   series_data[i][j] = conditions1_guifan[j].children[m].doc_count;
            // }
          }
          // for (var j = 0; j < _len; j++) {
          //   let tempArr = []
          //   for (var l = 0; l < conditions1_guifan[j].children.length; l++) {
          //     tempArr.push(conditions1_guifan[l].children[j] !== undefined ? conditions1_guifan[l].children[j].doc_count : 0);
          //   }
          //   series_data[j] = tempArr;
          // }
        }
        for (var j = 0; j < conditions1_guifan.length; j++) {
          let tempArr = [],
            total = 0;
          conditions1_guifan[j].children.forEach(item => {
            total += item.doc_count;
          })
          for (var l = 0; l < legend_data_len; l++) {
            tempArr.push(conditions1_guifan[l].children[j] !== undefined ? conditions1_guifan[l].children[j].doc_count : 0);
          }
          series_data[j] = tempArr;
        }
        for (var i = 0; i < legend_data_len; i++) {
          if (this.phasesArr[i] == 'Phase 3') {
            series_data_result.push({
              name: this.phasesArr[i],
              type: "bar",
              stack: "疾病领域",
              data: series_data[i],
              itemStyle: {
                normal: { color: "#f3627a" }
              }
            });
          }
          else if (this.phasesArr[i] == 'Not Applicable') {
            series_data_result.push({
              name: this.phasesArr[i],
              type: "bar",
              stack: "疾病领域",
              data: series_data[i],
              itemStyle: {
                normal: { color: "#D9D9D9" }
              }
            });
          }
          else {
            series_data_result.push({
              name: this.phasesArr[i],
              type: "bar",
              stack: "疾病领域",
              data: series_data[i]
            });
          }
        }
        let totals = [];
        conditions1_guifan.forEach(item => {
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
          data: totals
        });

        this.jbly_bar.xAxis_data = yAxis_data;
        this.jbly_bar.series_data = series_data_result;
        if (this.dialogVisible) {
          this.drawJblyBarOpen();
        } else {
          this.drawJblyBar();
        }

        this.recordNoData.delete(3);
      } else {
        this.recordNoData.add(3);

        if (this.dialogVisible) {
          $("#jbly-bar-clinical-open").html('<div class="nodata-box"></div>');
          $("#jbly-bar-clinical-open").removeAttr("_echarts_instance_");
        }
        else {
          $("#jbly-bar-clinical").html('<div class="nodata-box"></div>');
          $("#jbly-bar-clinical").removeAttr("_echarts_instance_");
        }
      }
    },

    // 点击跳转到默认列表页并激活参数
    async goListOne(name, conditions2) {
      let groups = _.cloneDeep(this.groups);
      // 获取之前的条件筛选选中项
      if (Object.keys(groups).length > 0) {
        if (groups.conditions1_guifan) {
          if (!groups.conditions1_guifan.includes(name)) {
            groups.conditions1_guifan.push(name);
          }
        } else {
          groups.conditions1_guifan = [];
          groups.conditions1_guifan.push(name);
        }
      } else {
        groups.conditions1_guifan = [];
        groups.conditions1_guifan.push(name);
      }

      let shaixuan = this.match_shaixuan_values;
      for (let key in groups) {
        shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
        groups[key].map((v) => {
          shaixuan[key][v] = v;
        });
      }
      console.log(shaixuan);
      console.log(groups);
      await this.$store.commit(
        "Clinical/match_shaixuan_values",
        _.assign({}, this.match_shaixuan_values, shaixuan)
      );
      (await conditions2) &&
        this.$store.commit(
          "Clinical/queryData",
          _.assign({}, this.queryData, {
            conditions2: conditions2,
          })
        );
      await this.$store.commit("Clinical/groups", groups);
      await this.$store.commit("Clinical/tabname", "first");
      await this.$store.commit("Clinical/path", "/api/clinical");
      // await Store.dispatch("Clinical/nomalSearch", {
      //   path: "/api/clinical",
      //   queryToPutong: false,
      // });
      await console.log(this.$router);
      await this.$router.push({
        path: "/clinical/list"
      })
    },
    async goListTwo(name, interventions2) {
      let groups = _.cloneDeep(this.groups);
      // 获取之前的条件筛选选中项
      if (Object.keys(groups).length > 0) {
        if (groups.interventions1_guifan) {
          if (!groups.interventions1_guifan.includes(name)) {
            groups.interventions1_guifan.push(name);
          }
        } else {
          groups.interventions1_guifan = [];
          groups.interventions1_guifan.push(name);
        }
      } else {
        groups.interventions1_guifan = [];
        groups.interventions1_guifan.push(name);
      }

      let shaixuan = this.match_shaixuan_values;
      for (let key in groups) {
        shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
        groups[key].map((v) => {
          shaixuan[key][v] = v;
        });
      }
      console.log(shaixuan);
      console.log(groups);
      await this.$store.commit(
        "Clinical/match_shaixuan_values",
        _.assign({}, this.match_shaixuan_values, shaixuan)
      );
      (await interventions2) &&
        this.$store.commit(
          "Clinical/queryData",
          _.assign({}, this.queryData, {
            interventions2: interventions2,
          })
        );
      await this.$store.commit("Clinical/groups", groups);
      await this.$store.commit("Clinical/tabname", "first");
      await this.$store.commit("Clinical/path", "/api/clinical");
      // await Store.dispatch("Clinical/nomalSearch", {
      //   path: "/api/clinical",
      //   queryToPutong: false,
      // });
      await console.log(this.$router);
      await this.$router.push({
        path: "/clinical/list"
      })
    },
    //疾病领域 (支持二次分析)
    drawJblyBar() {
      var _that = this;
      _that.jbly_bar.echarts = Echarts.getInstanceByDom(
        document.getElementById("jbly-bar-clinical"),
        "yaozh_theme"
      );
      if (_that.jbly_bar.echarts) {
        _that.jbly_bar.echarts.clear()
        _that.jbly_bar.echarts.off('click');
      }
      _that.jbly_bar.echarts = Echarts.init(
        document.getElementById("jbly-bar-clinical"),
        "yaozh_theme"
      );
      let option = {
        dataZoom: {
          id: 'dataZoomX',
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
        legend: {
          type: "scroll",
          top: 0,
          data: ['总数', ..._that.phasesArr]
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let text = `${params.name}<br/>`,
              arr = _that.conditions1_guifan.filter(item => item.key == params.name)[0].children;
            if (arr.length > 0) {
              arr.forEach(item => {
                text += `${item.key}：${item.doc_count}<br/>`
              })
            } else {
              text = `${params.name}<br/>数量：${params.value ? params.value : 0
                }`;
            }
            return text;
          }
        },
        toolbox: {
          top: 25,
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
                _that.dialogVisible = true;
                _that.initOpendKsh(3);
              }
            }
          }
        },
        grid: {
          containLabel: true,
          bottom: 20
        },
        xAxis: {
          type: "category",
          axisLabel: {
            rotate: 30,
            formatter(value) {
              return _that.labelLenLimit(value, 10);
            },
          },
          data: _that.jbly_bar.xAxis_data
        },
        yAxis: {
          type: "value",
          name: "数量"
        },
        series: _that.jbly_bar.series_data
      }

      if (_that.jbly_bar.xAxis_data.length < 10) {
        option.grid.bottom = 0;
        option.dataZoom.show = false;
      } else {
        option.grid.bottom = 20;
        option.dataZoom.show = true;
      }
      _that.jbly_bar.echarts.setOption(option);
      _that.jbly_bar.echarts.on('click', async function (parm) {
        if (_that.jblyLevel == 1) {
          Store.commit('Clinical/analyLoading', true);
          _that.jblySecondTitle = parm.name;
          Store.commit('Clinical/jblyLevel', 2);
          let params = _.assign(_that.param, { action: 'second_conditions1_guifan', conditions1_guifan: parm.name })
          const res = await Store.dispatch('Clinical/getConditions1_guifan', params)
          if (res.data.code === 200 && res.data.data) {
            Store.commit('Clinical/conditions1_guifan', res.data.data);
            _that.dealJblyBar(res.data.data);
            _that.jblyTitle = parm.name;
            Store.commit('Clinical/analyLoading', false);
          }
        } else {
          _that.goListOne(_that.jblyTitle, parm.name)
        }
      })
    },
    async goBack(type) {
      if (type == '疾病领域 (支持二次分析)') {
        Store.commit('Clinical/jblyLevel', 1);
        let params = this.param;
        params.action = "conditions1_guifan";
        delete params.conditions1_guifan
        const res = await Store.dispatch('Clinical/getConditions1_guifan', params)
        if (res.data.code === 200 && res.data.data) {
          Store.commit('Clinical/conditions1_guifan', res.data.data);
          this.dealJblyBar(res.data.data);
          this.jblyTitle = "疾病领域 (支持二次分析)";
        }
      } else if (type == '干预药物类别 (支持二次分析)') {
        Store.commit('Clinical/gyywlbLevel', 1);
        let params = this.param;
        params.action = "interventions1_guifan";
        delete params.interventions1_guifan
        const res = await Store.dispatch('Clinical/getInterventions1_guifan', params)
        if (res.data.code === 200 && res.data.data) {
          Store.commit('Clinical/interventions1_guifan', res.data.data);
          this.dealGyywlbBar(res.data.data);
          this.gyywlbTitle = "干预药物类别 (支持二次分析)";
        }
      }
    },
    drawJblyBarOpen() {
      var _that = this;
      let myChart = Echarts.getInstanceByDom(
        document.getElementById("jbly-bar-clinical-open")
      )
      if (myChart) {
        myChart.clear()
        myChart.off('click');
      }
      myChart = Echarts.init(
        document.getElementById("jbly-bar-clinical-open"),
        "yaozh_theme"
      )
      let option = {
        dataZoom: {
          id: 'dataZoomX',
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
          height: 35 //这里可以设置dataZoom的尺寸
        },
        legend: {
          type: "scroll",
          top: 0,
          data: ['总数', ..._that.phasesArr]
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let text = `${params.name}<br/>`,
              arr = _that.conditions1_guifan.filter(item => item.key == params.name)[0].children;
            if (arr.length > 0) {
              arr.forEach(item => {
                text += `${item.key}：${item.doc_count}<br/>`
              })
            } else {
              text = `${params.name}<br/>数量：${params.value ? params.value : 0
                }`;
            }
            return text;
          }
        },
        toolbox: {
          top: 25,
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
          containLabel: true,
          bottom: 30
        },
        xAxis: {
          type: "category",
          axisLabel: {

            rotate: 30,
            formatter(value) {
              return _that.labelLenLimit(value, 10);
            },
          },
          data: _that.jbly_bar.xAxis_data
        },
        yAxis: {
          type: "value",
          name: "数量"
        },
        series: _that.jbly_bar.series_data
      }
      if (_that.jbly_bar.xAxis_data.length < 10) {
        option.grid.bottom = 0;
        option.dataZoom.show = false;
      } else {
        option.grid.bottom = 30;
        option.dataZoom.show = true;
      }
      myChart.setOption(option);

      myChart.on('click', async function (parm) {
        if (_that.jblyLevel == 1) {
          Store.commit('Clinical/analyLoading', true);
          _that.jblySecondTitle = parm.name;
          Store.commit('Clinical/jblyLevel', 2);
          let params = _.assign(_that.param, { action: 'second_conditions1_guifan', conditions1_guifan: parm.name })
          const res = await Store.dispatch('Clinical/getConditions1_guifan', params)
          if (res.data.code === 200 && res.data.data) {
            Store.commit('Clinical/conditions1_guifan', res.data.data);
            _that.dealJblyBar(res.data.data);
            _that.jblyTitle = parm.name;
            Store.commit('Clinical/analyLoading', false);
          }
        } else {
          _that.goListOne(_that.jblyTitle, parm.name)
        }
      })
    },
    //干预药物类别 (支持二次分析)柱形图
    dealGyywlbBar(interventions1_guifan) {
      var _len = interventions1_guifan.length;
      var yAxis_data = [];
      var series_data = [[]];
      var series_data_result = [];
      var legend_data = interventions1_guifan.map(item => item.label);
      // var legend_data = this.phasesArr;
      var legend_data_len = legend_data.length;
      // 数据全为0，显示nodata
      let notAllZero = interventions1_guifan.find(item => {
        return item.children.find(ite => {
          return ite.doc_count != 0;
        });
      });
      if (!notAllZero) {
        _len = 0;
      }

      if (_len > 0) {
        for (var k = 0; k < _len; k++) {
          yAxis_data.push(interventions1_guifan[k].label);
        }

        for (var i = 0; i < legend_data_len; i++) {
          // series_data[i] = new Array(_len);
          for (var j = 0; j < _len; j++) {
            let gfzt_len = interventions1_guifan[j].children.length;
            let gfzt_key = [];
            for (var n = 0; n < gfzt_len; n++) {
              gfzt_key.push(interventions1_guifan[j].children[n].label);
            }
            // let m = _.indexOf(gfzt_key, legend_data[i].trim());
            // if (m < 0) {
            //   series_data[i][j] = 0;
            // } else {
            //   series_data[i][j] = interventions1_guifan[j].children[m].doc_count;
            // }
          }
          // for (var j = 0; j < _len; j++) {
          //   let tempArr = []
          //   for (var l = 0; l < interventions1_guifan[j].children.length; l++) {
          //     tempArr.push(interventions1_guifan[l].children[j] !== undefined ? interventions1_guifan[l].children[j].doc_count : 0);
          //   }
          //   series_data[j] = tempArr;
          // }
        }
        for (var j = 0; j < interventions1_guifan.length; j++) {
          let tempArr = [],
            total = 0;
          interventions1_guifan[j].children.forEach(item => {
            total += item.doc_count;
          })
          for (var l = 0; l < legend_data_len; l++) {
            tempArr.push(interventions1_guifan[l].children[j] !== undefined ? interventions1_guifan[l].children[j].doc_count : 0);
          }
          series_data[j] = tempArr;
        }
        for (var i = 0; i < legend_data_len; i++) {
          if (this.phasesArr[i] == 'Phase 3') {
            series_data_result.push({
              name: this.phasesArr[i],
              type: "bar",
              stack: "干预药物类别",
              data: series_data[i],
              itemStyle: {
                normal: { color: "#f3627a" }
              }
            });
          }
          else if (this.phasesArr[i] == 'Not Applicable') {
            series_data_result.push({
              name: this.phasesArr[i],
              type: "bar",
              stack: "干预药物类别",
              data: series_data[i],
              itemStyle: {
                normal: { color: "#D9D9D9" }
              }
            });
          }
          else {
            series_data_result.push({
              name: this.phasesArr[i],
              type: "bar",
              stack: "干预药物类别",
              data: series_data[i]
            });
          }
        }
        let totals = [];
        interventions1_guifan.forEach(item => {
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
          data: totals
        });

        this.gyywlb_bar.xAxis_data = yAxis_data;
        this.gyywlb_bar.series_data = series_data_result;
        if (this.dialogVisible) {
          this.drawGyywlbBarOpen();
        } else {
          this.drawGyywlbBar();
        }

        this.recordNoData.delete(4);
      } else {
        this.recordNoData.add(4);

        if (this.dialogVisible) {
          $("#gyywlb-bar-clinical-open").html('<div class="nodata-box"></div>');
          $("#gyywlb-bar-clinical-open").removeAttr("_echarts_instance_");
        }
        else {
          $("#gyywlb-bar-clinical").html('<div class="nodata-box"></div>');
          $("#gyywlb-bar-clinical").removeAttr("_echarts_instance_");
        }
        $("#gyywlb-bar-clinical").html('<div class="nodata-box"></div>');
        $("#gyywlb-bar-clinical").removeAttr("_echarts_instance_");
      }
    },
    drawGyywlbBar() {
      var _that = this;
      _that.gyywlb_bar.echarts = Echarts.getInstanceByDom(
        document.getElementById("gyywlb-bar-clinical"),
        "yaozh_theme"
      );
      if (_that.gyywlb_bar.echarts) {
        _that.gyywlb_bar.echarts.clear()
        _that.gyywlb_bar.echarts.off('click');
      }
      _that.gyywlb_bar.echarts = Echarts.init(
        document.getElementById("gyywlb-bar-clinical"),
        "yaozh_theme"
      );
      let option = {
        dataZoom: {
          id: 'dataZoomX',
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
        legend: {
          type: "scroll",
          top: 0,
          data: ['总数', ..._that.phasesArr]
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let text = `${params.name}<br/>`,
              arr = _that.interventions1_guifan.filter(item => item.key == params.name)[0].children;
            if (arr.length > 0) {
              arr.forEach(item => {
                text += `${item.key}：${item.doc_count}<br/>`
              })
            } else {
              text = `${params.name}<br/>数量：${params.value ? params.value : 0
                }`;
            }
            return text;
          }
        },
        toolbox: {
          top: 25,
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(4),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.dialogVisible = true;
                _that.initOpendKsh(4);
              }
            }
          }
        },
        grid: {
          containLabel: true,
          bottom: 20
        },
        xAxis: {
          type: "category",
          axisLabel: {

            rotate: 30,
            formatter(value) {
              return _that.labelLenLimit(value, 10);
            },
          },
          data: _that.gyywlb_bar.xAxis_data
        },
        yAxis: {
          type: "value",
          name: "数量"
        },
        series: _that.gyywlb_bar.series_data
      }

      if (_that.gyywlb_bar.xAxis_data.length < 10) {
        option.grid.bottom = 0;
        option.dataZoom.show = false;
      } else {
        option.grid.bottom = 20;
        option.dataZoom.show = true;
      }
      _that.gyywlb_bar.echarts.setOption(option);

      _that.gyywlb_bar.echarts.on('click', async function (parm) {
        if (_that.gyywlbLevel == 1) {
          Store.commit('Clinical/analyLoading', true);
          _that.gyywlbSecondTitle = parm.name;
          Store.commit('Clinical/gyywlbLevel', 2);
          let params = _.assign(_that.param, { action: 'second_interventions1_guifan', interventions1_guifan: parm.name })
          const res = await Store.dispatch('Clinical/getInterventions1_guifan', params)
          if (res.data.code === 200 && res.data.data) {
            Store.commit('Clinical/interventions1_guifan', res.data.data);
            _that.dealGyywlbBar(res.data.data);
            _that.gyywlbTitle = parm.name;
            Store.commit('Clinical/analyLoading', false);
          }
        } else {
          _that.goListTwo(_that.gyywlbTitle, parm.name)
        }
      })
    },
    drawGyywlbBarOpen() {
      var _that = this;
      let myChart = Echarts.getInstanceByDom(
        document.getElementById("gyywlb-bar-clinical-open")
      )
      if (myChart) {
        myChart.clear()
        myChart.off('click');
      }
      myChart = Echarts.init(
        document.getElementById("gyywlb-bar-clinical-open"),
        "yaozh_theme"
      )
      let option = {
        legend: {
          type: "scroll",
          top: 0,
          data: ['总数', ..._that.phasesArr]
        },
        dataZoom: {
          id: 'dataZoomX',
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
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let text = `${params.name}<br/>`,
              arr = _that.interventions1_guifan.filter(item => item.key == params.name)[0].children;
            if (arr.length > 0) {
              arr.forEach(item => {
                text += `${item.key}：${item.doc_count}<br/>`
              })
            } else {
              text = `${params.name}<br/>数量：${params.value ? params.value : 0
                }`;
            }
            return text;
          }
        },
        toolbox: {
          top: 25,
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(4),
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        grid: {
          containLabel: true,
          bottom: 20
        },
        xAxis: {
          type: "category",
          axisLabel: {

            rotate: 30,
            formatter(value) {
              return _that.labelLenLimit(value, 10);
            },
          },
          data: _that.gyywlb_bar.xAxis_data
        },
        yAxis: {
          type: "value",
          name: "数量"
        },
        series: _that.gyywlb_bar.series_data
      }
      if (_that.gyywlb_bar.xAxis_data.length < 10) {
        option.grid.bottom = 0;
        option.dataZoom.show = false;
      } else {
        option.grid.bottom = 30;
        option.dataZoom.show = true;
      }
      myChart.setOption(option);
      _that.gyywlb_bar.echarts.on('click', async function (parm) {
        if (_that.gyywlbLevel == 1) {
          Store.commit('Clinical/analyLoading', true);
          _that.gyywlbSecondTitle = parm.name;
          Store.commit('Clinical/gyywlbLevel', 2);
          let params = _.assign(_that.param, { action: 'second_interventions1_guifan', interventions1_guifan: parm.name })
          const res = await Store.dispatch('Clinical/getInterventions1_guifan', params)
          if (res.data.code === 200 && res.data.data) {
            Store.commit('Clinical/interventions1_guifan', res.data.data);
            _that.dealGyywlbBar(res.data.data);
            _that.gyywlbTitle = parm.name;
            Store.commit('Clinical/analyLoading', false);
          }
        } else {
          _that.goListTwo(_that.gyywlbTitle, parm.name)
        }
      })
    },
    //申办/合作单位 TOP20
    dealSbhzdwBar(sponsor2) {
      var _len = sponsor2.length;
      var yAxis_data = [];
      var series_data = [[]];
      var series_data_result = [];
      var legend_data = sponsor2.map(item => item.label);
      // var legend_data = this.phasesArr;
      var legend_data_len = legend_data.length;
      // 数据全为0，显示nodata
      // let notAllZero = sponsor2.find(item => {
      //   return item.children.find(ite => {
      //     return ite.doc_count != 0;
      //   });
      // });
      // if (!notAllZero) {
      //   _len = 0;
      // }

      if (_len > 0) {
        for (var k = 0; k < _len; k++) {
          yAxis_data.push(sponsor2[k].label);
        }

        for (var i = 0; i < legend_data_len; i++) {
          // series_data[i] = new Array(_len);
          for (var j = 0; j < _len; j++) {
            let gfzt_len = sponsor2[j].children.length;
            let gfzt_key = [];
            for (var n = 0; n < gfzt_len; n++) {
              gfzt_key.push(sponsor2[j].children[n].label);
            }
            // let m = _.indexOf(gfzt_key, legend_data[i].trim());
            // if (m < 0) {
            //   series_data[i][j] = 0;
            // } else {
            //   series_data[i][j] = sponsor2[j].children[m].doc_count;
            // }
          }
          // for (var j = 0; j < _len; j++) {
          //   let tempArr = []
          //   for (var l = 0; l < sponsor2[j].children.length; l++) {
          //     tempArr.push(sponsor2[l].children[j] !== undefined ? sponsor2[l].children[j].doc_count : 0);
          //   }
          //   series_data[j] = tempArr;
          // }
        }
        for (var j = 0; j < sponsor2.length; j++) {
          let tempArr = [],
            total = 0;
          sponsor2[j].children.forEach(item => {
            total += item.doc_count;
          })
          for (var l = 0; l < legend_data_len; l++) {
            tempArr.push(sponsor2[l].children[j] !== undefined ? sponsor2[l].children[j].doc_count : 0);
          }
          series_data[j] = tempArr;
        }
        for (var i = 0; i < legend_data_len; i++) {
          if (this.phasesArr[i] == 'Phase 3') {
            series_data_result.push({
              name: this.phasesArr[i],
              type: "bar",
              stack: "申办/合作单位",
              data: series_data[i],
              itemStyle: {
                normal: { color: "#f3627a" }
              }
            });
          }
          else if (this.phasesArr[i] == 'Not Applicable') {
            series_data_result.push({
              name: this.phasesArr[i],
              type: "bar",
              stack: "申办/合作单位",
              data: series_data[i],
              itemStyle: {
                normal: { color: "#D9D9D9" }
              }
            });
          }
          else {
            series_data_result.push({
              name: this.phasesArr[i],
              type: "bar",
              stack: "申办/合作单位",
              data: series_data[i]
            });
          }
        }
        let totals = [];
        sponsor2.forEach(item => {
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
          data: totals
        });

        this.sbhzdw_bar.xAxis_data = yAxis_data;
        this.sbhzdw_bar.series_data = series_data_result;
        if (this.dialogVisible) {
          this.drawSbhzdwBarOpen();
        } else {
          this.drawSbhzdwBar();
        }

        this.recordNoData.delete(5);
      } else {
        this.recordNoData.add(5);

        if (this.dialogVisible) {
          $("#sbhzdw-bar-clinical-open").html('<div class="nodata-box"></div>');
          $("#sbhzdw-bar-clinical-open").removeAttr("_echarts_instance_");
        } else {
          $("#sbhzdw-bar-clinical").html('<div class="nodata-box"></div>');
          $("#sbhzdw-bar-clinical").removeAttr("_echarts_instance_");
        }
      }
    },
    drawSbhzdwBar() {
      var _that = this;
      _that.sbhzdw_bar.echarts = Echarts.getInstanceByDom(
        document.getElementById("sbhzdw-bar-clinical"),
        "yaozh_theme"
      );
      if (_that.sbhzdw_bar.echarts) {
        _that.sbhzdw_bar.echarts.clear()
        _that.sbhzdw_bar.echarts.off('click');
      }
      _that.sbhzdw_bar.echarts = Echarts.init(
        document.getElementById("sbhzdw-bar-clinical"),
        "yaozh_theme"
      );
      let option = {
        legend: {
          type: "scroll",
          top: 0,
          data: ['总数', ..._that.phasesArr]
        },
        dataZoom: {
          id: 'dataZoomX',
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
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let text = `${params.name}<br/>`,
              arr = _that.sponsor2.filter(item => item.key == params.name)[0].children;
            if (arr.length > 0) {
              arr.forEach(item => {
                text += `${item.key}：${item.doc_count}<br/>`
              })
            } else {
              text = `${params.name}<br/>数量：${params.value ? params.value : 0
                }`;
            }
            return text;
          }
        },
        toolbox: {
          top: 25,
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(5),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.dialogVisible = true;
                _that.initOpendKsh(5);
              }
            }
          }
        },
        grid: {
          containLabel: true,
          bottom: 20
        },
        xAxis: {
          type: "category",
          axisLabel: {

            rotate: 30,
            formatter(value) {
              return _that.labelLenLimit(value, 10);
            },
          },
          data: _that.sbhzdw_bar.xAxis_data
        },
        yAxis: {
          type: "value",
          name: "数量"
        },
        series: _that.sbhzdw_bar.series_data
      }
      if (_that.gyywlb_bar.xAxis_data.length < 10) {
        option.grid.bottom = 0;
        option.dataZoom.show = false;
      } else {
        option.grid.bottom = 20;
        option.dataZoom.show = true;
      }
      _that.sbhzdw_bar.echarts.setOption(option);
    },
    drawSbhzdwBarOpen() {
      var _that = this;
      let myChart = Echarts.getInstanceByDom(
        document.getElementById("sbhzdw-bar-clinical-open")
      )
      if (myChart) {
        myChart.clear()
        myChart.off('click');
      }
      myChart = Echarts.init(
        document.getElementById("sbhzdw-bar-clinical-open"),
        "yaozh_theme"
      )
      let option = {
        legend: {
          type: "scroll",
          top: 0,
          data: ['总数', ..._that.phasesArr]
        },
        dataZoom: {
          id: 'dataZoomX',
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
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let text = `${params.name}<br/>`,
              arr = _that.sponsor2.filter(item => item.key == params.name)[0].children;
            if (arr.length > 0) {
              arr.forEach(item => {
                text += `${item.key}：${item.doc_count}<br/>`
              })
            } else {
              text = `${params.name}<br/>数量：${params.value ? params.value : 0
                }`;
            }
            return text;
          }
        },
        toolbox: {
          top: 25,
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(5),
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        grid: {
          containLabel: true,
          bottom: 20
        },
        xAxis: {
          type: "category",
          axisLabel: {

            rotate: 30,
            formatter(value) {
              return _that.labelLenLimit(value, 10);
            },
          },
          data: _that.sbhzdw_bar.xAxis_data
        },
        yAxis: {
          type: "value",
          name: "数量"
        },
        series: _that.sbhzdw_bar.series_data
      }
      if (_that.sbhzdw_bar.xAxis_data.length < 10) {
        option.grid.bottom = 0;
        option.dataZoom.show = false;
      } else {
        option.grid.bottom = 30;
        option.dataZoom.show = true;
      }
      myChart.setOption(option);
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
      if (el == "syfq-bar-clinical" || el == "syfq-bar-clinical-open") {
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
      } else if (el == 'yjlx-bar-clinical' || el == 'yjlx-bar-clinical-open') {
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
            formatter: function (params) {
              let text = `${params.name}<br/>`,
                arr = _that.study_guifan.filter(item => item.key == params.name)[0].children;
              if (arr.length > 0) {
                arr.forEach(item => {
                  text += `${item.key}：${item.doc_count}<br/>`
                })
              } else {
                text = `${params.name}<br/>数量：${params.value ? params.value : 0
                  }<br/>占比：${params.percent ? params.percent : 0}%`;
              }
              return text;
            }
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
      let _that = this;
      let option;
      if (el == 'yjlx-bar-clinical' || el == 'yjlx-bar-clinical-open') {
        option = {
          tooltip: {
            trigger: "item",
            formatter: function (params) {
              let text = `${params.name}<br/>`,
                arr = _that.study_guifan.filter(item => item.key == params.name)[0].children;
              if (arr.length > 0) {
                arr.forEach(item => {
                  text += `${item.key}：${item.doc_count}<br/>`
                })
              } else {
                text = `${params.name}<br/>数量：${params.value ? params.value : 0
                  }`;
              }
              return text;
            }
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
      if (currentJson != localJson) {
        this.searchState = currentSearchData;
        return true;
      } else {
        return false;
      }
    },
    // 我已知晓，直接跳过点击事件
    handleKnow() {
      localStorage.setItem("showClinicalAnalyGuide", "showClinicalAnalyGuide");
      this.showClinicalAnalyGuide = false;
    },

    // 新手教程下一步点击事件
    handleNextStep() {
      this.guideStep++;
      this.getGuidLeft()
    },
    // 获取左边距
    getGuidLeft() {
      let id = `#step${this.guideStep}`
      if ($(id).offset()) {
        this.step1Position = $(id).offset();
      }
    },
  },
  created() {
    //this.initLayout()
    this.loadData();
  },
  beforeDestroy() {
    window.removeEventListener("resize");
  },
  mounted() {
    let _this = this;
    $(".select-sort .el-input__inner").attr("UNSELECTABLE", 'on')
    window.addEventListener("resize", () => {
      this.echartsResizeHandler();
    })
  },
  async activated() {
    console.log(this.jblyLevel);
    this.getGuidLeft();
    let _this = this;
    window.onresize = function () {
      _this.getGuidLeft();
    };
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

.pc-clinical-analy {

  .go-back {
    width: 40px;
    height: 24px;
    line-height: 24px;
    background: #F4A622;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    position: absolute;
    z-index: 99;
  }

  .jbly.mini,
  .gyywlb.mini {
    right: 85px;
    top: 75px;
  }

  .jbly.open,
  .gyywlb.open {
    top: 65px;
    right: 95px;
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

    @totalHeight: 86px;

    .newtotals {
      // margin-top: 20px!important;
      height: @totalHeight;
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
        box-sizing: border-box;
        display: inline-block;
        width: 25%;
        min-width: 127px;
        height: @totalHeight;
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

    .chart-box:last-child {
      width: 100%;
      height: 480px;
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

  .go-list {
    width: 86px;
    height: 24px;
    line-height: 24px;
    background: #F4A622;
    border-radius: 4px;
    margin-top: 8px;
    text-align: center;
    cursor: pointer;

    a {
      text-decoration: none;
      font-size: 14px;
      font-weight: 400;
      color: #FFFFFF;
    }
  }

  .chart_bottom {
    background-color: #eff2fa;
    padding-top: 5px;
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

  // 新手引导样式
  .new-guide {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    min-width: 1280px;
    // background: rgba(0, 0, 0, 0.3)

    .fadeInUp {
      -webkit-animation-name: fadeInUp;
      animation-name: fadeInUp;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        -webkit-transform: translate3d(0, 45%, 0);
        transform: translate3d(0, 45%, 0);
      }

      to {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
      }
    }

    .guide-bg {
      box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.7);
      border-radius: 4px;
      position: absolute;
    }

    .guide-step0 {
      width: 460px;
      height: 200px;
      padding: 40px;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 4px;
      position: fixed;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%);
      margin-left: 0 !important;
    }

    .guide-content0 {
      display: flex;
      align-items: center;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 88px;
        height: 112px;
        margin-right: 30px;
      }

      .info {
        h4 {
          font-size: 20px;
          font-weight: 600;
          color: #182462;
          margin-bottom: 10px;
          line-height: 20px;
        }

        p {
          font-size: 16px;
          line-height: 16px;
          color: #666666;
          margin-bottom: 20px;
        }

        &-footer {
          display: flex;
          align-items: center;

          div {
            width: 100px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            background: #3556b9;
            border-radius: 4px;
            font-size: 16px;
            color: #ffffff;
            margin-right: 20px;
            cursor: pointer;
          }

          span {
            font-size: 14px;
            color: #666666;
            cursor: pointer;
          }
        }
      }
    }

    .guide-step1 {
      width: 645px;
      height: 40px;
    }

    .guide-content1,
    .guide-content2 {
      position: absolute;
      animation-duration: 1s;
      animation-fill-mode: forwards;

      img {
        width: 12px;
        height: 102px;
        margin-left: 30px;
      }

      .info {
        p {
          font-size: 20px;
          color: #ffffff;
          line-height: 30px;
        }

        &-footer {
          display: flex;
          align-items: center;
          margin-top: 20px;

          div {
            width: 110px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            background: #e7af2f;
            border-radius: 4px;
            font-size: 16px;
            color: #182462;
            margin-right: 30px;
            cursor: pointer;
          }

          span {
            font-size: 16px;
            color: #ffffff;
            cursor: pointer;
          }
        }
      }
    }

    .guide-step2 {
      width: 580px;
      height: 40px;
    }

    .guide-content2 {
      width: 580px;
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
  height: 100%;
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
