<template>
  <div class="analy-wrapeer">
    <!-- 自定义加载界面 -->
    <LoadingGif
      :loadFlag="analyLoading"
      v-if="analyLoading"
    ></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="shengwuzhipin-analy">
      <!-- 顶部统计 -->
      <div class="chart_top">
        <div class="totals">
          <ul class="total-item">
            <li class="li1">检品数量</li>
            <li class="li2">
              总计<span>{{ kshTotal.name }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">生产企业</li>
            <li class="li2">
              总计<span>{{ kshTotal.qiye }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">签发年份</li>
            <li class="li2">
              总计<span>{{ kshTotal.date }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">国产药品</li>
            <li class="li2">
              总计<span>{{ kshTotal.gc }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">进口药品</li>
            <li class="li2">
              总计<span>{{ kshTotal.jk }}</span
              >个
            </li>
          </ul>
        </div>
      </div>
      <div class="chart_bottom">
        <div class="go-list">
          <router-link tag="a" :to="{ path: '/pqf/list' }"
            >返回列表</router-link
          >
        </div>
        <div class="chart-boxes">
          <DbEcharts
            :title="item.title"
            v-for="(item, i) in echartsList"
            :key="i"
          >
            <div :id="item.id" class="echarts">
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
            <div class="nodata"></div>
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
      echartsList: [
        { title: "检品排行（销售量）", id: "sbqs-line" },
        { title: "企业排行（销售量）", id: "sbqs-bar" },
        { title: "检品排行（销售额）", id: "sqlx-bar" },
        { title: "企业排行（销售额）", id: "yplx-bar" },
        { title: "年度销售统计", id: "spjl-pie" },
        { title: "类别分析", id: "sbdq-map" }
      ],
      itemWidth: 700,
      promise: null,
      loading: true,
      dialogVisible: false,
      initopen: false, //控制渲染一次
      openIndex: 0, //控制展开第几个图形
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
        yAxis_data: [],
        series_data: []
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
        series_data: []
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
      recordNoData: new Set()
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.Shengwuzhipin.nopms,
      kshRes: state => state.Shengwuzhipin.kshRes,
      kshTotal: state => state.Shengwuzhipin.kshTotal,
      analyLoading: state => state.Shengwuzhipin.analyLoading,
      activeTabName: state => state.Shengwuzhipin.tabname,
      res1: state => state.Shengwuzhipin.res1,
      res2: state => state.Shengwuzhipin.res2,
      res3: state => state.Shengwuzhipin.res3
    }),
    noData() {
      return !this.res1.res && !this.res2.length && !this.res3.length;
    },
    title() {
      let list = [];
      _.forEach(this.echartsList, item => {
        list.push(item.title);
      });
      return list;
    }
  },
  methods: {
    getImgName(i) {
      return `药智数据企业版-${document.title}-智能分析-${this.echartsList[i].title}`;
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
    loadData: _.debounce(function() {
      // 加载 aggs API的数量总计
      this.promise = Store.dispatch("Shengwuzhipin/getKshRes").then(res => {
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
      // Store.commit("Shengwuzhipin/extendCount", {
      //   listCount: Number(this.basic.total[0]),
      //   nameCount: Number(this.basic.shenbaoname[0]),
      //   qiyeCount: Number(this.basic.shenbaoqiye[0]),
      // })
      // 说明：生物制品数据库代码 copy 来自注册数据库，为了方便和快速，就不修改
      // if(typeof(this.kshRes.spphxsl) != 'undefined') {
      this.dealSbqsLine(this.kshRes.spphxsl);
      this.dealSbqsBar(this.kshRes.qyphxsl);
      this.dealSqlxBar(this.kshRes.spphxse);
      this.dealYplxBar(this.kshRes.qyphxse);
      this.dealSpjlPie(this.kshRes.ndxs);
      this.dealSbdqMap(this.kshRes.jplb);
      // }
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
      let yAxis_data = [];
      let series_data = [];
      let _len = 0;
      if (typeof originalData != "undefined") {
        _len = originalData.length;
        if (_len > 0) {
          for (var i = 0; i < _len && i < 10; i++) {
            if (originalData[i].piliang != 0) {
              yAxis_data.push(originalData[i].name);
              series_data.push(originalData[i].piliang);
            }
          }
          Store.commit("Shengwuzhipin/yptop", yAxis_data);
          this.sbqs_line.yAxis_data = yAxis_data.reverse();
          this.sbqs_line.series_data = series_data.reverse();
          this.drawSbqsLine();

          this.recordNoData.delete(0);
        } else {
          this.recordNoData.add(0);
          $("#sbqs-line").html('<div class="nodata-box"></div>');
          $("#sbqs-line").removeAttr("_echarts_instance_");
        }
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
          trigger: "axis",
          formatter: "{b}<br />销售量(瓶(支)): {c}"
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
          containLabel: true,
          left: 40,
          right: 100
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
          name: "销售量(瓶(支))",
          axisLabel: {
            rotate: 45
          }
        },
        series: [
          {
            data: _that.sbqs_line.series_data,
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
          trigger: "axis",
          formatter: "{b}<br />销售量(瓶(支)): {c}"
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
          containLabel: true,
          left: 40,
          right: 100
        },
        yAxis: {
          type: "category",
          data: _that.sbqs_line.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "销售量(瓶(支))",
          axisLabel: {
            rotate: 45
          }
        },
        series: [
          {
            data: _that.sbqs_line.series_data,
            type: "bar"
          }
        ]
      });
    },
    // 企业排行
    dealSbqsBar(originalData) {
      let yAxis_data = [];
      let series_data = [];
      let _len = 0;
      if (typeof originalData != "undefined") {
        _len = originalData.length;
        if (_len > 0) {
          for (var i = 0; i < _len && i < 10; i++) {
            yAxis_data.push(originalData[i].qiye);
            series_data.push(originalData[i].piliang);
          }
          Store.commit("Shengwuzhipin/qytop", yAxis_data);
          this.sbqs_bar.yAxis_data = yAxis_data.reverse();
          this.sbqs_bar.series_data = series_data.reverse();
          this.drawSbqsBar();

          this.recordNoData.delete(1);
        } else {
          this.recordNoData.add(1);
          $("#sbqs-bar").html('<div class="nodata-box"></div>');
          $("#sbqs-bar").removeAttr("_echarts_instance_");
        }
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
          trigger: "axis",
          formatter: "{b}<br />销售量(瓶(支)): {c}"
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
          containLabel: true,
          left: 40,
          right: 100
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
          name: "销售量(瓶(支))",
          axisLabel: {
            rotate: 45
          }
        },
        series: [
          {
            data: _that.sbqs_bar.series_data,
            type: "bar"
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
          trigger: "axis",
          formatter: "{b}<br />销售量(瓶(支)): {c}"
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
          containLabel: true,
          left: 40,
          right: 100
        },
        yAxis: {
          type: "category",
          data: _that.sbqs_bar.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "销售量(瓶(支))",
          axisLabel: {
            rotate: 45
          }
        },
        series: [
          {
            data: _that.sbqs_bar.series_data,
            type: "bar"
          }
        ]
      });
    },
    // 检品排行（销售额）
    dealSqlxBar(originalData) {
      let yAxis_data = [];
      let series_data = [];
      let _len = 0;
      if (typeof originalData != "undefined") {
        _len = originalData.length;
        if (_len > 0) {
          for (var i = 0; i < _len && i < 10; i++) {
            if (originalData[i].total > 0) {
              yAxis_data.push(originalData[i].name);
              series_data.push(Math.round(originalData[i].total));
            }
          }
          this.sqlx_bar.yAxis_data = yAxis_data.reverse();
          this.sqlx_bar.series_data = series_data.reverse();
          this.drawSqlxBar();

          this.recordNoData.delete(2);
        } else {
          this.recordNoData.add(2);
          $("#sqlx-bar").html('<div class="nodata-box"></div>');
          $("#sqlx-bar").removeAttr("_echarts_instance_");
        }
      } else {
        this.recordNoData.add(2);
        $("#sqlx-bar").html('<div class="nodata-box"></div>');
        $("#sqlx-bar").removeAttr("_echarts_instance_");
      }
    },
    drawSqlxBar() {
      var _that = this;
      _that.sqlx_bar.echarts = Echarts.init(
        document.getElementById("sqlx-bar"),
        "yaozh_theme"
      );
      _that.sqlx_bar.echarts.setOption({
        tooltip: {
          position: (point, params, dom, rect, size) => {
            return this.echartsTooltipPositionX(point, params, dom, rect, size);
          },
          trigger: "axis",
          formatter: "{b}<br />销售额(万元): {c}"
        },
        toolbox: {
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
          containLabel: true,
          left: 40,
          right: 100
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
          data: _that.sqlx_bar.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "销售额(万元)",
          axisLabel: {
            rotate: 45
          }
        },
        series: [
          {
            data: _that.sqlx_bar.series_data,
            type: "bar"
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
        tooltip: {
          trigger: "axis",
          formatter: "{b}<br />销售额(万元): {c}"
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(2),
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        grid: {
          containLabel: true,
          left: 40,
          right: 100
        },
        yAxis: {
          type: "category",
          data: _that.sqlx_bar.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "销售额(万元)",
          axisLabel: {
            rotate: 45
          }
        },
        series: [
          {
            data: _that.sqlx_bar.series_data,
            type: "bar"
          }
        ]
      });
    },
    // 企业排行（销售额）
    dealYplxBar(originalData) {
      let yAxis_data = [];
      let series_data = [];
      let _len = 0;
      if (typeof originalData != "undefined") {
        _len = originalData.length;
        if (_len > 0) {
          for (var i = 0; i < _len && i < 10; i++) {
            yAxis_data.push(originalData[i].qiye);
            series_data.push(Math.round(originalData[i].total));
          }
          this.yplx_bar.yAxis_data = yAxis_data.reverse();
          this.yplx_bar.series_data = series_data.reverse();
          this.drawYplxBar();

          this.recordNoData.delete(3);
        } else {
          this.recordNoData.add(3);
          $("#yplx-bar").html('<div class="nodata-box"></div>');
          $("#yplx-bar").removeAttr("_echarts_instance_");
        }
      } else {
        this.recordNoData.add(3);
        $("#yplx-bar").html('<div class="nodata-box"></div>');
        $("#yplx-bar").removeAttr("_echarts_instance_");
      }
    },
    drawYplxBar() {
      var _that = this;
      _that.yplx_bar.echarts = Echarts.init(
        document.getElementById("yplx-bar"),
        "yaozh_theme"
      );
      _that.yplx_bar.echarts.setOption({
        tooltip: {
          position: (point, params, dom, rect, size) => {
            return this.echartsTooltipPositionX(point, params, dom, rect, size);
          },
          trigger: "axis",
          formatter: "{b}<br />销售额(万元): {c}"
        },
        toolbox: {
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
          containLabel: true,
          left: 40,
          right: 100
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
          data: _that.yplx_bar.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "销售额(万元)",
          axisLabel: {
            rotate: 45
          }
        },
        series: [
          {
            data: _that.yplx_bar.series_data,
            type: "bar"
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
        tooltip: {
          trigger: "axis",
          formatter: "{b}<br />销售额(万元): {c}"
        },
        toolbox: {
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
          left: 40,
          right: 100
        },
        yAxis: {
          type: "category",
          data: _that.yplx_bar.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "销售额(万元)",
          axisLabel: {
            rotate: 45
          }
        },
        series: [
          {
            data: _that.yplx_bar.series_data,
            type: "bar"
          }
        ]
      });
    },
    // 年度销售
    dealSpjlPie(originalData) {
      let xAxis_data = [];
      let bar = {
        type: "bar",
        name: "销量(瓶(支))",
        data: []
      };
      let line = {
        type: "line",
        name: "销售额(万元)",
        yAxisIndex: 1,
        data: []
      };
      let _len = 0;
      if (typeof originalData != "undefined") {
        _len = originalData.length;
        if (_len > 0) {
          originalData.forEach((curr, index) => {
            xAxis_data.push(curr.newdate);
            bar.data.push(curr.piliang);
            line.data.push(Math.round(curr.total));
          });

          this.spjl_pie.xAxis_data = xAxis_data;
          this.spjl_pie.series_data = [bar, line];
          this.drawSpjlPie();

          this.recordNoData.delete(4);
        } else {
          this.recordNoData.add(4);
          $("#spjl-pie").html('<div class="nodata-box"></div>');
          $("#spjl-pie").removeAttr("_echarts_instance_");
        }
      } else {
        this.recordNoData.add(4);
        $("#spjl-pie").html('<div class="nodata-box"></div>');
        $("#spjl-pie").removeAttr("_echarts_instance_");
      }
    },
    drawSpjlPie() {
      var _that = this;
      _that.spjl_pie.echarts = Echarts.init(
        document.getElementById("spjl-pie"),
        "yaozh_theme"
      );
      _that.spjl_pie.echarts.setOption({
        tooltip: {
          trigger: "axis"
        },
        grid: {
          containLabel: true
        },
        dataZoom: {
          type: "inside",
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 100
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
        xAxis: [
          {
            type: "category",
            data: this.spjl_pie.xAxis_data,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "销量(瓶(支))"
          },
          {
            type: "value",
            name: "销售额(万元)"
          }
        ],
        series: this.spjl_pie.series_data
      });
    },
    drawSpjlPieOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("spjl-pie-open"),
        "yaozh_theme"
      ).setOption({
        title: {
          textAlign: "center",
          left: "50%"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          right: 180,
          containLabel: true
        },
        dataZoom: {
          type: "inside",
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 100
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
        xAxis: [
          {
            type: "category",
            data: this.spjl_pie.xAxis_data,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "销量(瓶(支))"
            // interval: 50
          },
          {
            type: "value",
            name: "销售额(万元)"
            // interval: 5
          }
        ],
        series: this.spjl_pie.series_data
      });
    },
    // 检品类别
    dealSbdqMap(originalData) {
      let xAxis_data = [];
      let series_data = [];
      let line = {
        type: "line",
        data: []
      };
      let bar = {
        type: "bar",
        yAxisIndex: 1,
        data: []
      };
      let map = new Map(),
        map2 = new Map();
      let _len = 0;
      if (typeof originalData != "undefined") {
        _len = originalData.length;
        if (_len > 0) {
          // 第一次循环-数据处理
          originalData.forEach((curr, index) => {
            if (map.has(curr.newdate)) {
              map.get(curr.newdate).push(Object.assign({}, curr));
            } else {
              map.set(curr.newdate, [Object.assign({}, curr)]);
            }
          });
          // 第二次循环-数据处理
          let i = 0;
          map.forEach((val, key) => {
            xAxis_data.push(key);
            val.forEach((curr, index) => {
              // 按照 categ 分类
              let a;
              if (map2.has(curr.categ)) {
                a = map2.get(curr.categ);
              } else {
                a = {
                  newdate: [],
                  piliang: [],
                  total: []
                };
                map2.set(curr.categ, a);
              }
              a.newdate[i] = curr.newdate;
              a.piliang[i] = curr.piliang;
              a.total[i] = Math.round(curr.total);
            });
            i++;
          });
          // 第三次循环-series 构造
          map2.forEach((val, key) => {
            let a, b;
            a = JSON.parse(
              JSON.stringify({
                name: key,
                data: val.piliang
              })
            );
            b = JSON.parse(
              JSON.stringify({
                name: key + "销售额(万元)",
                data: val.total
              })
            );
            series_data.push(Object.assign({}, bar, a));
            series_data.push(Object.assign({}, line, b));
          });
          this.sbdq_map.xAxis_data = xAxis_data;
          this.sbdq_map.series_data = series_data;
          this.drawSbdqMap();

          this.recordNoData.delete(5);
        } else {
          this.recordNoData.add(5);
          $("#sbdq-map").html('<div class="nodata-box"></div>');
          $("#sbdq-map").removeAttr("_echarts_instance_");
        }
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
        tooltip: {
          trigger: "axis"
        },
        dataZoom: {
          type: "inside",
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 100
        },
        grid: {
          containLabel: true
        },
        toolbox: {
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
                _that.initOpendKsh(5);
              }
            }
          }
        },
        xAxis: [
          {
            type: "category",
            data: this.sbdq_map.xAxis_data,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "销售额(万元)"
          },
          {
            type: "value",
            name: "销量(瓶(支))"
          }
        ],
        series: this.sbdq_map.series_data
      });
    },
    drawSbdqMapOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("sbdq-map-open"),
        "yaozh_theme"
      ).setOption({
        tooltip: {
          trigger: "axis"
        },
        dataZoom: {
          type: "inside",
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 100
        },
        grid: {
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(5),
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        xAxis: [
          {
            type: "category",
            data: this.sbdq_map.xAxis_data,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "销售额(万元)"
          },
          {
            type: "value",
            name: "销量(瓶(支))"
          }
        ],
        series: this.sbdq_map.series_data
      });
    },
    handleDialogVisible(value) {
      this.dialogVisible = value;
      // 退出全屏的时候需要将initopen改为false，不然不会重新渲染图标。
      this.initopen = value;
    },
    // 切换为饼形图
    handleTogglePie(el, data, index) {
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
            trigger: "axis",
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
            trigger: "axis",
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
            trigger: "axis",
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
            trigger: "axis",
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

      if (index == undefined) {
        option.toolbox.feature.myMagnify = {};
      }
      $("#" + el).removeAttr("_echarts_instance_");
      let chart = Echarts.init(document.getElementById(el), "yaozh_theme");
      //chart.clear()
      chart.setOption(option);
    },
    // 切换为柱形图
    handleToggleBar(el, data, index) {
      let _that = this;
      let option;
      if (el == "sbdq-map" || el == "sbdq-map-open") {
        option = {
          color: data.color,
          tooltip: {
            trigger: "axis",
            formatter: "{b}:<br />数量: {c}"
          },
          toolbox: {
            feature: {
              saveAsImage: {
                title: "保存",
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
              type: "bar"
            }
          ]
        };
      } else {
        option = {
          color: data.color,
          tooltip: {
            trigger: "axis",
            formatter: "{b}:<br />数量: {c}"
          },
          toolbox: {
            feature: {
              saveAsImage: {
                title: "保存",
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
              type: "bar"
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
    handleToggleMap(el, data, index) {
      let _that = this;
      let option;
      if (el == "sbdq-map" || el == "sbdq-map-open") {
        option = {
          toolbox: {
            feature: {
              saveAsImage: {
                title: "保存",
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
            trigger: "axis"
          },
          visualMap: {
            min: 0,
            max: this.sbdq_map.max,
            left: "left",
            top: "bottom",
            text: ["高", "低"], // 文本，默认为数值文本
            calculable: true,
            inRange: {
              color: this.sbdq_map.colorRange
            }
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
    echartsResizeHandler() {
      if (this.dialogVisible) {
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
  },
  watch: {
    kshRes() {
      this.update();
    },
    $route() {
      if (
        this.$route.path === "/pqf/analy" &&
        Object.keys(this.kshRes).length <= 1
      ) {
        this.loadData();
      }
      if (this.$route.path === "/pqf/analy") {
        window.addEventListener("resize", this.echartsResizeHandler);
      } else {
        window.removeEventListener("resize", this.echartsResizeHandler);
        this.echartsClear("open-charts");
        this.echartsClear("echarts");
      }
      if (this.$route.path === "/pqf/list") {
        //智能分析重新搜索清空列表数据tab无法自动复位
        let tabname = this.activeTabName;
        Store.commit("Shengwuzhipin/tabname", "");
        Store.commit("Shengwuzhipin/tabname", tabname);
        this.noData &&
          Store.dispatch("Shengwuzhipin/nomalSearch", {
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
.nodata,
.nodata-box {
  width: 100%;
  height: 100%;
  background: url(/static/imgs/nodata.png) center center no-repeat;
}

.fullcharts.nodata-box {
  position: absolute;
  top: 40px;
  height: calc(100vh - 40px - 48px - 80px);
  background: #fff;
}

@import "~@/assets/less/var.less";
.shengwuzhipin-analy {
  .totals {
    // margin-top:20px!important;
    height: 130px;
    background-color: @White;
    // box-shadow: @BoxShadow;
    display: flex;
    justify-content: space-between;
    .total-item {
      display: inline-block;
      width: 20%;
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
  .chart_top {
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
}
</style>
