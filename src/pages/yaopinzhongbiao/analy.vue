<template>
  <div class="analy-wrapeer">
    <!-- 自定义加载界面 -->
    <LoadingGif
      :loadFlag="analyLoading"
      v-if="analyLoading"
    ></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="chart">
      <!-- 顶部统计 -->
      <div class="chart_top">
        <div class="newtotals">
          <div
            class="iconfont newtotals-arrow newtotals-left"
            @click="handleShowScrollLeft"
          >
            &#xe64e;
          </div>
          <div
            class="iconfont newtotals-arrow newtotals-right"
            @click="handleShowScrollRight"
          >
            &#xe64f;
          </div>
          <div class="newtotals-scroll">
            <div class="newtotals-scroll-inner">
              <ul class="total-item">
                <li class="li1">中标数量</li>
                <li class="li2">
                  总计<span>{{
                    typeof kshTotal.count == "undefined" ? 0 : kshTotal.count
                  }}</span
                  >个
                </li>
              </ul>
              <ul class="total-item">
                <li class="li1">中标品种</li>
                <li class="li2">
                  总计<span>{{
                    typeof kshTotal.count_name == "undefined"
                      ? 0
                      : kshTotal.count_name
                  }}</span
                  >个
                </li>
              </ul>
              <ul class="total-item">
                <li class="li1">剂型</li>
                <li class="li2">
                  总计<span>{{
                    typeof kshTotal.count_jixing == "undefined"
                      ? 0
                      : kshTotal.count_jixing
                  }}</span
                  >个
                </li>
              </ul>
              <ul class="total-item">
                <li class="li1">药品品规</li>
                <li class="li2">
                  总计<span>{{
                    typeof kshTotal.count_yppg == "undefined"
                      ? 0
                      : kshTotal.count_yppg
                  }}</span
                  >个
                </li>
              </ul>
              <ul class="total-item">
                <li class="li1">中标企业</li>
                <li class="li2">
                  总计<span>{{
                    typeof kshTotal.count_qiye == "undefined"
                      ? 0
                      : kshTotal.count_qiye
                  }}</span
                  >个
                </li>
              </ul>
              <ul class="total-item">
                <li class="li1">发布年份</li>
                <li class="li2">
                  总计<span>{{
                    typeof kshTotal.count_year == "undefined"
                      ? 0
                      : kshTotal.count_year
                  }}</span
                  >个
                </li>
              </ul>
              <ul class="total-item">
                <li class="li1">中标地区</li>
                <li class="li2">
                  总计<span>{{
                    typeof kshTotal.count_first == "undefined"
                      ? 0
                      : kshTotal.count_first
                  }}</span
                  >个
                </li>
              </ul>
              <ul class="total-item">
                <li class="li1">中标价格</li>
                <li class="li2">
                  最新<span>{{
                    typeof kshTotal.count_feiyong == "undefined"
                      ? 0
                      : kshTotal.count_feiyong
                  }}</span
                  >元
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="chart_bottom">
        <div class="go-list">
          <router-link tag="a" :to="{ path: '/yaopinzhongbiao/list' }"
            >返回列表</router-link
          >
        </div>
        <div class="chart-boxes">
          <DbEcharts title="药品排行">
            <div id="sbqs-line" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
          <DbEcharts title="企业排行">
            <div id="sbqs-bar" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
          <DbEcharts title="ATC分类">
            <div id="sqlx-bar" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
          <DbEcharts title="剂型占比">
            <div id="yplx-bar" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
          <DbEcharts title="热力图">
            <div id="spjl-pie" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
          <DbEcharts title="中标地区">
            <div id="sbdq-map" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
        </div>
      </div>
      <!-- 展开效果 -->
      <div class="dialog hide">
        <div class="menu">
          <div
            v-for="(ti, index) in title"
            v-bind:class="[index == openIndex ? 'active' : '', 'nav']"
            @click="handleOpenIndex(index)"
            :key="index"
          >
            {{ ti }}
          </div>
        </div>
        <div class="echarts-items-wap">
          <div class="echarts-items-title">
            <span class="echart-title">{{ title[openIndex] }}</span>
            <a
              class="esc-btn"
              href="javascript:;"
              @click="handleDialogVisible(false)"
              ><i></i
              ><img src="/static/imgs/echarts/esc-fullscreen.png" alt="退出全屏"
            /></a>
          </div>
          <div class="echarts-items">
            <!-- 申报趋势 -->
            <div class="echarts-item">
              <!-- 折线图 -->
              <div id="sbqs-line-open" class="open-charts"></div>
            </div>
            <div class="echarts-item">
              <!-- 条形图 -->
              <div id="sbqs-bar-open" class="open-charts"></div>
            </div>
            <div class="echarts-item">
              <!-- 申请类型 -->
              <div id="sqlx-bar-open" class="open-charts"></div>
            </div>
            <div class="echarts-item">
              <!-- 药品类型 -->
              <div id="yplx-bar-open" class="open-charts"></div>
            </div>
            <div class="echarts-item">
              <!-- 审评结论 -->
              <div id="spjl-pie-open" class="open-charts"></div>
            </div>
            <div class="echarts-item">
              <!-- 办理状态 -->
              <div id="sbdq-map-open" class="open-charts"></div>
            </div>
          </div>
          <div class="ctr-actions">
            <el-button
              class="pre action"
              @click="handleOpenIndex(openIndex - 1)"
              ><i class="el-icon-arrow-left"></i
            ></el-button>
            <el-button
              class="next action"
              @click="handleOpenIndex(openIndex + 1)"
              ><i class="el-icon-arrow-right"></i
            ></el-button>
          </div>
          <div class="nodata-box fullcharts hide">
            <div :class="atcs_sel ? 'nodata-box-atc' : 'nodata-box'"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import DbEcharts from "@/components/common/db-echarts";

import { mapState, mapGetters } from "vuex";

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
      itemWidth: 700,
      promise: null,
      loading: true,
      dialogVisible: false,
      initopen: false, //控制渲染一次
      openIndex: 0, //控制展开第几个图形
      title: [
        "药品排行",
        "企业排行",
        "ATC分类",
        "剂型占比",
        "热力图",
        "中标地区"
      ], //图形标题
      sbqs_line: {
        echarts: null,
        yAxis_data: [],
        series_data: []
      },
      sbqs_bar: {
        echarts: null,
        yAxis_data: [],
        series_data: []
      },
      // 用于全屏的ATC分类
      sqlx_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      // 用于非全屏的ATC分类
      sqlx_bar2: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      // 用于全屏的剂型占比
      yplx_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      // 用于非全屏的剂型占比
      yplx_bar2: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      // 用于全屏的热力图
      spjl_pie: {
        echarts: null,
        x: [],
        y: [],
        series: [],
        max_value: 0
      },
      // 用于非全屏的热力图，默认显示各年份相加总量前几的省份，防止文字拥挤
      spjl_pie2: {
        echarts: null,
        x: [],
        y: [],
        series: [],
        max_value: 0
      },
      // sbdq_bar: {
      //   echarts: null,
      //   xAxis_data: [],
      //   series_data: []
      // },
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
      atcs_sel: false //药理分类是否多分类
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.Yaopinzhongbiao.nopms,
      kshRes: state => state.Yaopinzhongbiao.kshRes,
      kshTotal: state => state.Yaopinzhongbiao.kshTotal,
      analyLoading: state => state.Yaopinzhongbiao.analyLoading,
      conditions: state => state.Yaopinzhongbiao.conditions,
      allBase: state => state.Yaopinzhongbiao.allBase,
      activeTabName: state => state.Yaopinzhongbiao.tabname,
      res1: state => state.Yaopinzhongbiao.res1,
      res2: state => state.Yaopinzhongbiao.res2,
      res3: state => state.Yaopinzhongbiao.res3
    }),
    noData() {
      return !this.res1.res && !this.res2.length && !this.res3.length;
    }
  },
  methods: {
    getImgName(i) {
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
      // 如果沒有数据，则显示 nodata
      $(".open-charts .nodata-box").show();
    },
    loadData: _.debounce(function() {
      // 加载 aggs API的数量总计
      this.promise = Store.dispatch("Yaopinzhongbiao/getKshRes").then(res => {
        this.update();
        return res;
      });
    }, 10),
    handleOpenIndex(index) {
      if (index > 0 && index < 6) {
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
      // Store.commit("Yaopinzhongbiao/extendCount", {
      //   listCount: Number(this.basic.total[0]),
      //   nameCount: Number(this.basic.shenbaoname[0]),
      //   qiyeCount: Number(this.basic.shenbaoqiye[0]),
      // })
      // 说明：中标数据库代码 copy 来自注册数据库，为了方便和快速，就不修改
      // console.log(this.kshTotal)
      this.dealSbqsLine(this.kshRes.guifanname);
      this.dealSbqsBar(this.kshRes.guifanqiyezhongbiao);
      this.dealSqlxBar(this.kshRes.atcb_fw);
      this.dealYplxBar(this.kshRes.guifanjixing);
      this.dealSpjlPie(this.kshRes.firsts);
      this.dealSbdqMap(this.kshRes.first);
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
          _that.drawSbdqMapOpen();

          _that.handleOpenIndex(index);
          this.loading = false;
        }, 500);
      } else {
        this.handleOpenIndex(index);
        this.loading = false;
      }
    },
    // 药品排行
    dealSbqsLine(originalData) {
      let _len = originalData.length;
      let yAxis_data = [];
      let series_data = [];
      if (_len > 0) {
        // originalData.sort(function(a,b){
        //   return a.doc_count- b.doc_count
        // })
        for (var i = 0; i < _len && i < 10; i++) {
          yAxis_data.push(originalData[i].key);
          series_data.push(originalData[i].doc_count);
        }
        Store.commit("Yaopinzhongbiao/yptop", yAxis_data.slice(0, 1));
        this.sbqs_line.yAxis_data = yAxis_data.reverse();
        this.sbqs_line.series_data = series_data.reverse();
        this.drawSbqsLine();

        this.recordNoData.delete(0);
      } else {
        this.recordNoData.add(0);
        $("#sbqs-line").html('<div class="nodata-box"></div>');
        $("#sbqs-line").removeAttr("_echarts_instance_");
      }
    },
    drawSbqsLine() {
      var _that = this;
      _that.sbqs_line.echarts = Echarts.init(
        document.getElementById("sbqs-line"),
        "yaozh_theme"
      );
      _that.sbqs_line.echarts.setOption({
        tooltip: {
          position: (point, params, dom, rect, size) => {
            return this.echartsTooltipPositionX(point, params, dom, rect, size);
          },
          trigger: "item",
          formatter: "{b}<br />数量: {c}"
        },
        toolbox: {
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
                _that.initOpendKsh(0);
              }
            }
          }
        },
        grid: {
          containLabel: true
        },
        yAxis: {
          type: "category",
          axisLabel: {
            formatter: function(value) {
              if (value.length > 12) {
                return value.substring(0, 12) + "...";
              } else {
                return value;
              }
            }
          },
          data: _that.sbqs_line.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "数量"
        },
        series: [
          {
            data: _that.sbqs_line.series_data,
            label: {
              show: true,
              position: "right"
            },
            type: "bar"
          }
        ]
      });
    },
    drawSbqsLineOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("sbqs-line-open"),
        "yaozh_theme"
      ).setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}<br />数量: {c}"
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(0),
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        grid: {
          containLabel: true
        },
        yAxis: {
          type: "category",
          data: _that.sbqs_line.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "数量"
        },
        series: [
          {
            data: _that.sbqs_line.series_data,
            type: "bar",
            label: {
              show: true,
              position: "right"
            }
          }
        ]
      });
    },
    // 企业排行
    dealSbqsBar(originalData) {
      let _len = originalData.length;
      let yAxis_data = [];
      let series_data = [];
      if (_len > 0) {
        for (var i = 0; i < _len && i < 10; i++) {
          yAxis_data.push(originalData[i].key);
          series_data.push(originalData[i].doc_count);
        }
        Store.commit("Yaopinzhongbiao/qytop", yAxis_data.slice(0, 1));
        this.sbqs_bar.yAxis_data = yAxis_data.reverse();
        this.sbqs_bar.series_data = series_data.reverse();
        this.drawSbqsBar();

        this.recordNoData.delete(1);
      } else {
        this.recordNoData.add(1);
        $("#sbqs-bar").html('<div class="nodata-box"></div>');
        $("#sbqs-bar").removeAttr("_echarts_instance_");
      }
    },
    drawSbqsBar() {
      var _that = this;
      _that.sbqs_bar.echarts = Echarts.init(
        document.getElementById("sbqs-bar"),
        "yaozh_theme"
      );
      _that.sbqs_bar.echarts.setOption({
        tooltip: {
          position: (point, params, dom, rect, size) => {
            return this.echartsTooltipPositionX(point, params, dom, rect, size);
          },
          trigger: "item",
          formatter: "{b}<br />数量: {c}"
        },
        toolbox: {
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
        grid: {
          containLabel: true
        },
        yAxis: {
          type: "category",
          axisLabel: {
            formatter: function(value) {
              if (value.length > 12) {
                return value.substring(0, 12) + "...";
              } else {
                return value;
              }
            }
          },
          data: _that.sbqs_bar.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "数量"
        },
        series: [
          {
            data: _that.sbqs_bar.series_data,
            type: "bar",
            label: {
              show: true,
              position: "right"
            }
          }
        ]
      });
    },
    drawSbqsBarOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("sbqs-bar-open"),
        "yaozh_theme"
      ).setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}<br />数量: {c}"
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(1),
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        grid: {
          containLabel: true
        },
        yAxis: {
          type: "category",
          data: _that.sbqs_bar.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "数量"
        },
        series: [
          {
            data: _that.sbqs_bar.series_data,
            type: "bar",
            label: {
              show: true,
              position: "right"
            }
          }
        ]
      });
    },
    // ATC分类
    dealSqlxBar(originalData) {
      this.atcs_sel = false;
      _.forEach(this.conditions, item => {
        if (item.name === "atc" || item.name === "atcb") {
          if (item.atcs_sel) {
            this.atcs_sel = true;
          }
        }
      });
      let _len = originalData.length;
      if (_len > 0) {
        let xAxis_data = [];
        let series_data = [];

        for (var i = 0; i < _len; i++) {
          xAxis_data.push(originalData[i].key);
          series_data.push({
            value: originalData[i].doc_count,
            name: originalData[i].key
          });
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

        this.sqlx_bar.xAxis_data = xAxis_data;
        this.sqlx_bar.series_data = series_data;
        // ------------------------------------------------
        // 默认展示 10 个，全屏才展示全部
        let xAxis_data2 = [];
        let series_data2 = [];
        let originalData2 = originalData
          .slice()
          .sort((a, b) => {
            return b.doc_count - a.doc_count;
          })
          .slice(0, 10);
        _len = originalData2.length;

        for (var i = 0; i < _len; i++) {
          xAxis_data2.push(originalData2[i].key);
          series_data2.push({
            value: originalData2[i].doc_count,
            name: originalData2[i].key
          });
        }

        // 排序
        for (let index in series_data2) {
          for (let i = 0; i < index; i++) {
            if (
              Number(series_data2[index].value) > Number(series_data2[i].value)
            ) {
              let y = series_data2[index];
              let x = xAxis_data2[index];
              xAxis_data2[index] = xAxis_data2[i];
              series_data2[index] = series_data2[i];
              xAxis_data2[i] = x;
              series_data2[i] = y;
            }
          }
        }

        this.sqlx_bar2.xAxis_data = xAxis_data2;
        this.sqlx_bar2.series_data = series_data2;

        this.drawSqlxBar();

        this.recordNoData.delete(2);
      } else {
        this.recordNoData.add(2);
        let html = this.atcs_sel
          ? '<div class="nodata-box-atc"></div>'
          : '<div class="nodata-box"></div>';
        $("#sqlx-bar").html(html);
        $("#sqlx-bar").removeAttr("_echarts_instance_");
      }
    },
    drawSqlxBar() {
      var _that = this;
      _that.sqlx_bar2.echarts = Echarts.init(
        document.getElementById("sqlx-bar"),
        "yaozh_theme"
      );
      _that.sqlx_bar2.echarts.setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.sqlx_bar2.xAxis_data
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(2),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myToggleBar: {
              show: true,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                _that.handleToggleBar("sqlx-bar", _that.sqlx_bar2, 2);
              }
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
            data: this.sqlx_bar2.series_data
          }
        ]
      });
    },
    drawSqlxBarOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("sqlx-bar-open"),
        "yaozh_theme"
      ).setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.sqlx_bar.xAxis_data
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(2),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myTogglePie: {
              show: true,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                _that.handleToggleBar("sqlx-bar-open", _that.sqlx_bar, 2, true);
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
            data: this.sqlx_bar.series_data
          }
        ]
      });
    },
    //剂型占比
    dealYplxBar(originalData) {
      let _len = originalData.length;
      if (_len > 0) {
        let xAxis_data = [];
        let series_data = [];
        // originalData.sort(function(a,b){
        //   return a.doc_count- b.doc_count
        // })
        for (var i = 0; i < _len; i++) {
          xAxis_data.push(originalData[i].key);
          series_data.push({
            value: originalData[i].doc_count,
            name: originalData[i].key
          });
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

        this.yplx_bar.xAxis_data = xAxis_data;
        this.yplx_bar.series_data = series_data;
        // --------------------------------------------------------
        // 用于 剂型占比 默认非全屏显示的数据
        let xAxis_data2 = [];
        let series_data2 = [];
        let originalData2 = originalData
          .slice()
          .sort((a, b) => {
            return b.doc_count - a.doc_count;
          })
          .slice(0, 10);
        _len = originalData2.length;

        for (var i = 0; i < _len; i++) {
          xAxis_data2.push(originalData2[i].key);
          series_data2.push({
            value: originalData2[i].doc_count,
            name: originalData2[i].key
          });
        }

        // 排序
        for (let index in series_data2) {
          for (let i = 0; i < index; i++) {
            if (
              Number(series_data2[index].value) > Number(series_data2[i].value)
            ) {
              let y = series_data2[index];
              let x = xAxis_data2[index];
              xAxis_data2[index] = xAxis_data2[i];
              series_data2[index] = series_data2[i];
              xAxis_data2[i] = x;
              series_data2[i] = y;
            }
          }
        }

        this.yplx_bar2.xAxis_data = xAxis_data2;
        this.yplx_bar2.series_data = series_data2;
        this.drawYplxBar();

        this.recordNoData.delete(3);
      } else {
        this.recordNoData.add(3);
        $("#yplx-bar").html('<div class="nodata-box"></div>');
        $("#yplx-bar").removeAttr("_echarts_instance_");
      }
    },
    drawYplxBar() {
      var _that = this;
      _that.yplx_bar2.echarts = Echarts.init(
        document.getElementById("yplx-bar"),
        "yaozh_theme"
      );
      _that.yplx_bar2.echarts.setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.yplx_bar2.xAxis_data
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(3),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myToggleBar: {
              show: true,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                _that.handleToggleBar("yplx-bar", _that.yplx_bar2, 3);
              }
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
                position: "center"
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
            data: _that.yplx_bar2.series_data
          }
        ]
      });
    },
    drawYplxBarOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("yplx-bar-open"),
        "yaozh_theme"
      ).setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.yplx_bar.xAxis_data
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(3),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myTogglePie: {
              show: true,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                _that.handleToggleBar("yplx-bar-open", _that.yplx_bar, 3, true);
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
                position: "center"
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
            data: _that.yplx_bar.series_data
          }
        ]
      });
    },
    //热力图
    dealSpjlPie(originalData) {
      let d = originalData;
      // console.info(d)
      this.spjl_pie.max_value = 0; //先赋值为空，然后取最大
      if (d.length > 0) {
        let x = [];
        // 这里是对象，便于去重，之后会转换成数组
        let y = {};
        let series = [];
        _.forEach(d, (curr, index, arr) => {
          // 添加地区
          x.push(curr.key);
          _.forEach(curr.year.buckets, (cur, inde, ar) => {
            // 存储年份
            y[cur.key] = true;
            // 第一位先保存的是 年份，等到所有的年份统计完成之后，再计算在行上的位置
            // series.push([cur.key, index, cur.qiye.value]);
            series.push([cur.key, index, cur.doc_count]);
            // 记录格子中的最大值
            this.spjl_pie.max_value =
              this.spjl_pie.max_value < cur.doc_count
                ? cur.doc_count
                : this.spjl_pie.max_value;
          });
        });
        console.info(this.spjl_pie);
        // y 轴年份转换为数组
        y = _.keys(y);
        _.forEach(series, (curr, index, arr) => {
          curr[0] = y.indexOf(curr[0]);
        });
        // 没有数据的置为 0 ,先用二维数组制造位置，在用有的数据的覆盖
        let defa = [];

        for (let i = 0; i < x.length; i++) {
          defa[i] = [];
          for (let j = 0; j < y.length; j++) {
            defa[i][j] = 0;
          }
        }
        series.forEach(curr => {
          defa[curr[1]][curr[0]] = curr[2];
        });
        // console.info(defa)
        this.spjl_pie.x = x;
        this.spjl_pie.y = y;
        this.spjl_pie.series = defa.reduce((total, curr, index) => {
          let arr = curr.reduce((tota, cur, inde) => {
            return tota.push([index, inde, cur]) && tota;
          }, []);
          return total.push(...arr) && total;
        }, []);

        // -----------------------------------------------------------------------
        // 选出数量前几的省份作为非全屏的显示数据
        let d2 = originalData
          .sort((a, b) => {
            return b.doc_count - a.doc_count;
          })
          .slice(0, 10);
        let x2 = [];
        // 这里是对象，便于去重，之后会转换成数组
        let y2 = {};
        let series2 = [];
        _.forEach(d2, (curr, index, arr) => {
          // 添加地区
          x2.push(curr.key);
          _.forEach(curr.year.buckets, (cur, inde, ar) => {
            // 存储年份
            y2[cur.key] = true;
            // 第一位先保存的是 年份，等到所有的年份统计完成之后，再计算在行上的位置
            // series2.push([cur.key, index, cur.qiye.value]);
            series2.push([cur.key, index, cur.doc_count]);

            // 记录格子中的最大值
            this.spjl_pie2.max_value =
              this.spjl_pie2.max_value < cur.doc_count
                ? cur.doc_count
                : this.spjl_pie2.max_value;
          });
        });
        // y 轴年份转换为数组
        y2 = _.keys(y2);
        _.forEach(series2, (curr, index, arr) => {
          curr[0] = y2.indexOf(curr[0]);
        });
        // 没有数据的置为 0 ,先用二维数组制造位置，在用有的数据的覆盖
        let defa2 = [];

        for (let i = 0; i < x2.length; i++) {
          defa2[i] = [];
          for (let j = 0; j < y2.length; j++) {
            defa2[i][j] = 0;
          }
        }
        series2.forEach(curr => {
          defa2[curr[1]][curr[0]] = curr[2];
        });

        this.spjl_pie2.x = x2;
        this.spjl_pie2.y = y2;
        this.spjl_pie2.series = defa2.reduce((total, curr, index) => {
          let arr = curr.reduce((tota, cur, inde) => {
            return tota.push([index, inde, cur]) && tota;
          }, []);
          return total.push(...arr) && total;
        }, []);

        this.drawSpjlPie();

        this.recordNoData.delete(4);
      } else {
        this.recordNoData.add(4);
        $("#spjl-pie").html('<div class="nodata-box"></div>');
        $("#spjl-pie").removeAttr("_echarts_instance_");
      }
    },
    drawSpjlPie() {
      var _that = this;
      _that.spjl_pie2.echarts = Echarts.init(
        document.getElementById("spjl-pie"),
        "yaozh_theme"
      );
      _that.spjl_pie2.echarts.setOption({
        tooltip: {
          position: "top"
        },
        grid: {
          right: 70
        },
        toolbox: {
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
                _that.initOpendKsh(4);
              }
            }
          }
        },
        xAxis: {
          type: "category",
          data: _that.spjl_pie2.x,
          splitArea: {
            show: true
          },
          axisLabel: {
            interval: 0,
            rotate: 45
          },
          axisLine: {
            lineStyle: {
              color: "#aaa"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#c6daf0"
            }
          }
        },
        yAxis: {
          type: "category",
          data: _that.spjl_pie2.y,
          splitArea: {
            show: true
          },
          axisLabel: {
            interval: 0
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#aaa"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#c6daf0"
            }
          }
        },
        visualMap: [
          {
            calculable: true,
            min: _that.spjl_pie2.max_value,
            max: 0, //根据具体最大值来确定
            right: 0,
            align: "left",
            calculable: true,
            realtime: false,
            itemHeight: 333,
            itemWidth: 10,
            inverse: true
          }
        ],
        series: [
          {
            type: "heatmap",
            data: _that.spjl_pie2.series,
            tooltip: {
              formatter: function(params) {
                let year = 2006;
                for (let i = 0; i < params.value[1]; i++) {
                  year++;
                }
                return (
                  "<b>" +
                  params.name +
                  "</b>地区在" +
                  "<b>" +
                  _that.spjl_pie2.y[params.value[1]] +
                  "</b>年<br/>中标品种数量是" +
                  "<b>" +
                  params.value[2] +
                  "</b>（个）"
                );
              }
            },
            label: {
              show: true,
              color: "#000",
              fontWeight: "bold",
              formatter: function(params) {
                if (Number(params.value[2]) > 0) {
                  return params.value[2];
                } else {
                  return "0";
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ],
        title: [
          // {
          //   text: "中标品种数量（个）",
          //   top: 20,
          //   left: 'center',
          //   textStyle: {
          //     fontSize: "12",
          //     color: "#646A7A",
          //   },
          //   fontSize: "8"
          // },
          {
            text: " 中\n 标\n 品\n 种\n 数\n 量\n(个)",
            top: "middle",
            right: 10,
            textStyle: {
              fontSize: "12",
              color: "#ccc"
            },
            fontSize: "8"
          }
        ],
        fontSize: "14"
      });
    },
    drawSpjlPieOpen() {
      var _that = this;
      console.info(_that.spjl_pie);
      Echarts.init(
        document.getElementById("spjl-pie-open"),
        "yaozh_theme"
      ).setOption({
        tooltip: {
          position: "top"
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(4),
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        xAxis: {
          type: "category",
          data: _that.spjl_pie.x,
          splitArea: {
            show: true
          },
          axisLabel: {
            interval: 0,
            rotate: 45
          },
          axisLine: {
            lineStyle: {
              color: "#aaa"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#c6daf0"
            }
          }
        },
        yAxis: {
          type: "category",
          data: _that.spjl_pie.y,
          splitArea: {
            show: true
          },
          axisLabel: {
            interval: 0
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#aaa"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#c6daf0"
            }
          }
        },
        visualMap: [
          {
            calculable: true,
            min: 0,
            max: _that.spjl_pie.max_value, //根据具体最大值来确定
            right: 80,
            align: "left",
            calculable: true,
            realtime: false,
            itemHeight: 633,
            itemWidth: 10,
            inverse: true,
            inRange: {
              color: ["#fff", "#4877e8"]
            }
          }
        ],
        series: [
          {
            type: "heatmap",
            data: _that.spjl_pie.series,
            tooltip: {
              formatter: function(params) {
                let year = 2006;
                for (let i = 0; i < params.value[1]; i++) {
                  year++;
                }
                return (
                  "<b>" +
                  params.name +
                  "</b>地区在" +
                  "<b>" +
                  _that.spjl_pie.y[params.value[1]] +
                  "</b>年<br/>中标品种数量是" +
                  "<b>" +
                  params.value[2] +
                  "</b>（个）"
                );
              }
            },
            label: {
              show: true,
              color: "#000",
              fontWeight: "bold",
              formatter: function(params) {
                if (Number(params.value[2]) > 0) {
                  return params.value[2];
                } else {
                  return "0";
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ],
        title: {
          text: "中标品种数量（个）",
          left: 750,
          top: 20,
          textStyle: {
            fontSize: "12",
            color: "#646A7A"
          },
          fontSize: "8"
        },
        fontSize: "14"
      });
    },
    // 中标地区
    dealSbdqMap(originalData) {
      let _len = originalData.length;
      let xAxis_data = [];
      let not_map_series_data = [];
      let map_series_data = [];
      var max = 0;
      if (_len > 0) {
        // 处理map数据
        for (var i = 0; i < _len; i++) {
          xAxis_data.push(String(originalData[i].key));
          not_map_series_data.push(Number(originalData[i].doc_count));
          map_series_data.push({
            value: originalData[i].doc_count,
            name: originalData[i].key
          });
          max =
            originalData[i].doc_count > max ? originalData[i].doc_count : max;
        }
        this.sbdq_map.max = max;
        this.sbdq_map.series_data = map_series_data;

        this.sbdq_bar.xAxis_data = xAxis_data;
        this.sbdq_bar.series_data = not_map_series_data;
        this.sbdq_pie.xAxis_data = xAxis_data;
        this.sbdq_pie.series_data = map_series_data;
        this.drawSbdqMap();

        this.recordNoData.delete(5);
      } else {
        this.recordNoData.add(5);
        $("#sbdq-map").html('<div class="nodata-box"></div>');
        $("#sbdq-map").removeAttr("_echarts_instance_");
      }
    },
    drawSbdqMap() {
      var _that = this;
      _that.sbdq_map.echarts = Echarts.init(
        document.getElementById("sbdq-map"),
        "yaozh_theme"
      );
      _that.sbdq_map.echarts.setOption({
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(5),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myToggleBar: {
              show: true,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                _that.handleToggleBar("sbdq-map", _that.sbdq_bar, 5);
              }
            },
            myTogglePie: {
              show: true,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {
                _that.handleTogglePie("sbdq-map", _that.sbdq_pie, 5);
              }
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.initOpendKsh(5);
              }
            }
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            return `${params.name}<br/>数量：${
              params.value ? params.value : 0
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
      Echarts.init(
        document.getElementById("sbdq-map-open"),
        "yaozh_theme"
      ).setOption({
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(5),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myToggleBar: {
              show: true,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                _that.handleToggleBar("sbdq-map-open", _that.sbdq_bar, 5, true);
              }
            },
            myTogglePie: {
              show: true,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {
                _that.handleTogglePie("sbdq-map-open", _that.sbdq_pie, 5, true);
              }
            }
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            return `${params.name}<br/>数量：${
              params.value ? params.value : 0
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
    handleDialogVisible(value) {
      this.dialogVisible = value;
      // 退出全屏的时候需要将initopen改为false，不然不会重新渲染图标。
      this.initopen = value;
    },
    // 切换为饼形图
    handleTogglePie(el, data, index, isOpen = false) {
      let _that = this;
      let option;
      if (el == "yplx-bar" || el == "yplx-bar-open") {
        // 审评结论 专属饼形图属性
        option = {
          color: data.color,
          legend: {
            type: "scroll",
            bottom: 0,
            data: data.xAxis_data
          },
          toolbox: {
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
            formatter: "{b}: <br/>数量:{c} (占比:{d}%)"
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "75%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
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
      } else if (el == "sqlx-bar" || el == "sqlx-bar-open") {
        // 药理分类 专属饼形图属性
        option = {
          color: data.color,
          legend: {
            type: "scroll",
            bottom: 0,
            data: data.xAxis_data
          },
          toolbox: {
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
            formatter: "{b}<br/>数量:{c}"
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
      } else if (el == "sbdq-map" || el == "sbdq-map-open") {
        option = {
          color: data.color,
          legend: {
            type: "scroll",
            bottom: 0,
            data: data.xAxis_data
          },
          toolbox: {
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
                  _that.handleToggleBar(el, _that.sbdq_bar, index);
                }
              },
              myToggleMap: {
                show: true,
                title: "热力图",
                icon: "image:///static/imgs/echarts/map.png",
                onclick() {
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
            formatter: "{b}：<br/>数量:{c}(占比:{d})"
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
          color: data.color,
          legend: {
            type: "scroll",
            bottom: 0,
            data: data.xAxis_data
          },
          toolbox: {
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
            formatter: "{b}<br/>数量:{c}"
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

      if (isOpen) {
        option.toolbox.feature.myMagnify = {};
      }
      $("#" + el).removeAttr("_echarts_instance_");
      let chart = Echarts.init(document.getElementById(el), "yaozh_theme");
      //chart.clear()
      chart.setOption(option);
    },
    // 切换为柱形图
    handleToggleBar(el, data, index, isOpen = false) {
      let _that = this;
      let option;
      if (el == "sbdq-map" || el == "sbdq-map-open") {
        option = {
          color: data.color,
          tooltip: {
            trigger: "item",
            formatter: "{b}:<br />数量: {c}"
          },
          toolbox: {
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
                  _that.handleTogglePie(el, _that.sbdq_pie, index);
                }
              },
              myToggleMap: {
                show: true,
                title: "热力图",
                icon: "image:///static/imgs/echarts/map.png",
                onclick() {
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
          color: data.color,
          tooltip: {
            trigger: "item",
            formatter: "{b}:<br />数量: {c}"
          },
          toolbox: {
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

      if (isOpen) {
        option.toolbox.feature.myMagnify = {};
      }
      $("#" + el).removeAttr("_echarts_instance_");
      let chart = Echarts.init(document.getElementById(el), "yaozh_theme");
      chart.setOption(option);
    },
    handleToggleMap(el, data, index, isOpen = false) {
      let _that = this;
      let option;
      if (el == "sbdq-map" || el == "sbdq-map-open") {
        option = {
          toolbox: {
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
                  _that.handleToggleBar(el, _that.sbdq_bar, index);
                }
              },
              myTogglePie: {
                show: true,
                title: "饼形图",
                icon: "image:///static/imgs/echarts/pie.png",
                onclick() {
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
            formatter: function(params) {
              return `${params.name}<br/>数量：${
                params.value ? params.value : 0
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

      if (isOpen) {
        option.toolbox.feature.myMagnify = {};
      }
      $("#" + el).removeAttr("_echarts_instance_");
      let chart = Echarts.init(document.getElementById(el), "yaozh_theme");
      chart.setOption(option);
    },
    initShowScroll() {
      let outterWidth = Number($(".newtotals").width());
      let num = Number($(".newtotals .total-item").length);
      let maxNum = parseInt((outterWidth - 60) / 150);
      if (150 * num <= outterWidth) {
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
          width: 150 * maxNum,
          margin: "0px 30px"
        });
        $(".newtotals-scroll-inner").css({
          width: 150 * num
        });
        $(".newtotals .total-item").css({
          width: 150
        });
      }
    },
    handleShowScrollLeft() {
      let pointer = Number(
        _.replace($(".newtotals-scroll-inner").css("left"), "px", "")
      );
      if (pointer != 0 && pointer % 150 == 0) {
        $(".newtotals-scroll-inner").animate(
          {
            left: pointer + 150
          },
          300
        );
      }
    },
    handleShowScrollRight() {
      let outterWidth = Number($(".newtotals").width());
      let num = Number($(".newtotals .total-item").length);
      let maxNum = parseInt((outterWidth - 60) / 150);
      let pointer = Number(
        _.replace($(".newtotals-scroll-inner").css("left"), "px", "")
      );
      if (pointer != 150 * (maxNum - num) && pointer % 150 == 0) {
        $(".newtotals-scroll-inner").animate(
          {
            left: pointer - 150
          },
          300
        );
      }
    },
    echartsResizeHandler() {
      if (this.dialogVisible) {
        this.initLayout();
        this.echartsResize("open-charts");
      }
      this.$nextTick(() => {
        this.echartsResize("echarts");
      });
    }
  },
  created() {
    //this.initLayout()
    this.loadData();
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  mounted() {
    window.addEventListener("resize", this.echartsResizeHandler);
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.ksh);
    this.update();
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.ksh);
    this.initShowScroll();
  },
  watch: {
    kshRes() {
      if (this.$route.path === "/yaopinzhongbiao/analy") {
        this.update();
      }
    },
    $route() {
      if (
        this.$route.path === "/yaopinzhongbiao/analy" &&
        Object.keys(this.kshRes).length <= 1
      ) {
        this.loadData();
      }
      if (this.$route.path === "/yaopinzhongbiao/analy") {
        window.addEventListener("resize", this.echartsResizeHandler);
      } else {
        window.removeEventListener("resize", this.echartsResizeHandler);
        this.echartsClear("open-charts");
        this.echartsClear("echarts");
      }
      if (this.$route.path === "/yaopinzhongbiao/list") {
        //智能分析重新搜索清空列表数据tab无法自动复位
        let tabname = this.activeTabName;
        Store.commit("Yaopinzhongbiao/tabname", "");
        Store.commit("Yaopinzhongbiao/tabname", tabname);
        this.noData &&
          Store.dispatch("Yaopinzhongbiao/nomalSearch", {
            queryToPutong: false,
            tabs: true
          });
      }
    },
    dialogVisible() {
      if (this.dialogVisible) {
        $(".dialog").removeClass("hide");
        this.initLayout();
        this.echartsResize("open-charts");
      } else {
        $(".dialog").addClass("hide");
      }
    }
  }
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.pc-yaopinzhongbiao-analy {
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
      background-color: #eff2fa;
    }
    .chart_bottom {
      background-color: #eff2fa;
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
        }
      }
      .newtotals-arrow {
        display: none;
        height: 130px;
        line-height: 130px;
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
        display: inline-block;
        width: 10%;
        min-width: 127px;
        height: 127px;
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
    .chart-boxes {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      // .chart-box {
      //   box-sizing: border-box;
      //   position: relative;
      //   display: inline-block;
      //   margin: 8px;
      //   width: calc(50% - 16px);
      //   background-color: @White;
      //   box-shadow: @BoxShadow;
      //   overflow: hidden;
      //   transition: all 300ms;
      //   canvas {
      //     width: 100%!important;
      //   }
      //   .chart-title {
      //     position: absolute;
      //     top: 0px;
      //     left: 0px;
      //     width: 100%;
      //     padding-left: 5px;
      //     line-height: 40px;
      //     background-color: @GrayBackgroundColor;
      //     border-left: 5px solid @PrimaryColor;
      //   }
      //   &:hover {
      //     transition: all 300ms;
      //   }
      // }
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
            box-shadow: @BoxShadow;
            color: @PrimaryColor;
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
            height: 900px;
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
}
</style>
