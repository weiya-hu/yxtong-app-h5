<template>
  <div class="analy-wrapeer">
    <!-- 自定义加载界面 -->
    <LoadingGif
      :className="'db-index-loading'"
      :loadFlag="analyLoading"
      v-if="analyLoading"
    ></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="tourongzi-analy">
      <!-- 顶部统计 -->
      <div class="chart_top">
        <div class="totals">
          <ul class="total-item">
            <li class="li1">事件数量</li>
            <li class="li2">
              总计<span>{{ kshTotal.num_total }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">受资方</li>
            <li class="li2">
              总计<span>{{ kshTotal.num_receiver }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">出资方</li>
            <li class="li2">
              总计<span>{{ kshTotal.num_funders }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">发生地区</li>
            <li class="li2">
              总计<span>{{ kshTotal.num_area }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">交易轮次</li>
            <li class="li2">
              总计<span>{{ kshTotal.num_round }}</span
              >个
            </li>
          </ul>
        </div>
      </div>
      <div class="chart_bottom">
        <div class="go-list">
          <router-link tag="a" :to="{ path: '/tourongzi/list' }"
            >返回列表</router-link
          >
        </div>
        <div class="chart-boxes">
          <DbEcharts title="投融趋势（近5年）">
            <div id="trqs-line" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
          <!-- <DbEcharts title="">
            <div id="trqs-bar" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts> -->
          <DbEcharts title="受资方排行（按金额）">
            <div id="szfph-bar" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
          <DbEcharts title="出资方排行（按金额）">
            <div id="funders-bar" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
          <DbEcharts title="轮次占比">
            <div id="lczb-pie" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
          <DbEcharts title="地区占比">
            <div id="dqzb-pie" class="echarts">
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
            <!-- 投融趋势 -->
            <div class="echarts-item">
              <!-- 折线图 -->
              <div id="trqs-line-open" class="open-charts"></div>
            </div>
            <!-- <div class="echarts-item"> -->
            <!-- 条形图 -->
            <!-- <div id="trqs-bar-open" class="open-charts"></div>
            </div> -->
            <div class="echarts-item">
              <!-- 受资方排行 -->
              <div id="szfph-bar-open" class="open-charts"></div>
            </div>
            <div class="echarts-item">
              <!-- 出资方排行 -->
              <div id="funders-bar-open" class="open-charts"></div>
            </div>
            <div class="echarts-item">
              <!-- 轮次占比 -->
              <div id="lczb-pie-open" class="open-charts"></div>
            </div>
            <div class="echarts-item">
              <!-- 地区占比 -->
              <div id="dqzb-pie-open" class="open-charts"></div>
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
import { constants } from "fs";

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
      title: ["投融趋势", "受资方排行", "出资方排行", "轮次占比", "地区占比"], //图形标题
      trqs_line: {
        echarts: null,
        xAxis_data: [],
        series_data1: [],
        series_data2: []
      },
      szfph_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      funders_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      lczb_pie: {
        echarts: null,
        xAxis_data: [],
        yAxis_data: [],
        series_data: []
      },
      dqzb_pie: {
        echarts: null,
        xAxis_data: [],
        yAxis_data: [],
        series_data: []
      },
      recordNoData: new Set()
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.Tourongzi.nopms,
      kshRes: state => state.Tourongzi.kshRes,
      kshTotal: state => state.Tourongzi.kshTotal,
      analyLoading: state => state.Tourongzi.analyLoading,
      allBase: state => state.Tourongzi.allBase,
      res1: state =>
        _.keys(state.Tourongzi.res1).length ? state.Tourongzi.res1.res : []
    })
  },
  methods: {
    initLayout() {
      let screen_width = window.outerWidth;
      let screen_height = window.innerHeight;
      this.itemWidth = screen_width - 244;
      $(".dialog .echarts-items-wap").css("height", screen_height - 50);
      $(".dialog .echarts-items-wap").css("width", screen_width - 244);
      $(".dialog .echarts-items").width((this.itemWidth + 12) * 10);
      $(".dialog .echarts-item").width(this.itemWidth - 100);
    },
    loadData: _.debounce(function() {
      // 加载 aggs API的数量总计
      this.promise = Store.dispatch("Tourongzi/getKshRes").then(res => {
        this.update();
        //console.log(res)
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
      // console.log(this.kshRes)
      this.dealTrqsLine(this.kshRes.trqs); //投融趋势
      // this.dealTrqsBar(this.kshRes.qyphxsl);
      this.dealSzfphBar(this.kshRes.szfph);
      this.dealFundersBar(this.kshRes.funders);
      this.dealLczbPie(this.kshRes.lczb);
      this.dealDqzbPie(this.kshRes.dqzb);
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
          _that.drawTrqsLineOpen();
          // _that.drawTrqsBarOpen();
          _that.drawSzfphBarOpen();
          _that.drawFundersBarOpen();
          _that.drawLczbPieOpen();
          _that.drawDqzbPieOpen();

          _that.handleOpenIndex(index);
          this.loading = false;
        }, 500);
      } else {
        this.handleOpenIndex(index);
        this.loading = false;
      }
    },
    // 投融趋势
    dealTrqsLine(originalData) {
      this.trqs_line = {
        echarts: null,
        xAxis_data: [],
        series_data1: [],
        series_data2: []
      };
      let _len = originalData.length;
      if (_len > 0) {
        for (var i = 0; i < _len; i++) {
          this.trqs_line.xAxis_data.push(originalData[i].year);
          this.trqs_line.series_data1.push(originalData[i].total);
          this.trqs_line.series_data2.push(originalData[i].money);
        }
        //console.log(this.trqs_line.xAxis_data)
        this.drawTrqsLine();

        this.recordNoData.delete(0);
      } else {
        this.recordNoData.add(0);
        $("#trqs-line").html('<div class="nodata-box"></div>');
        $("#trqs-line").removeAttr("_echarts_instance_");
      }
    },
    drawTrqsLine() {
      var _that = this;
      _that.trqs_line.echarts = Echarts.init(
        document.getElementById("trqs-line"),
        "yaozh_theme"
      );
      _that.trqs_line.echarts.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#fff"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
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
        legend: {
          data: ["投资数量", "投资金额"]
        },
        xAxis: [
          {
            type: "category",
            data: _that.trqs_line.xAxis_data,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
            // min: 0,
            // max: 1500,
            // interval: 300,
            // max: 5,
            // interval: 1,
            axisLabel: {
              formatter: "{value}"
            }
            // color:['red'],
          },
          {
            type: "value",
            name: "金额(万元)",
            // min: 0,
            // max: 3000,
            // interval: 500,
            axisLabel: {
              formatter: "{value} "
            }
            // color:['green'],
          }
        ],
        series: [
          {
            name: "投资数量",
            type: "bar",
            data: _that.trqs_line.series_data1
          },

          {
            name: "投资金额",
            type: "line",
            yAxisIndex: 1,
            data: _that.trqs_line.series_data2
          }
        ]
      });
    },
    drawTrqsLineOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("trqs-line-open"),
        "yaozh_theme"
      ).setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#fff"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        grid: {
          containLabel: true,
          left: 40,
          right: 100
        },
        legend: {
          data: ["投资数量", "投资金额"]
        },
        xAxis: [
          {
            type: "category",
            data: _that.trqs_line.xAxis_data,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
            // min: 0,
            // max: 1500,
            // interval: 300,
            // max: 5,
            // interval: 1,
            axisLabel: {
              formatter: "{value}"
            }
            // color:['green'],
          },
          {
            type: "value",
            name: "金额(万元)",
            // min: 0,
            // max: 3000,
            // interval: 500,
            axisLabel: {
              formatter: "{value} "
            }
            // color:['green'],
          }
        ],
        series: [
          {
            name: "投资数量",
            type: "bar",
            data: _that.trqs_line.series_data1
          },

          {
            name: "投资金额",
            type: "line",
            yAxisIndex: 1,
            data: _that.trqs_line.series_data2
          }
        ]
      });
    },
    // 受资方排行
    dealSzfphBar(originalData) {
      let filterData = originalData.filter(item => {
        return item.money > 0;
      });
      let _len = filterData.length;
      // let _len = originalData.length;
      let yAxis_data = [];
      let series_data = [];
      // if (_len > 0) {
      //   for (var i = 0; i < _len && i < 10; i++) {
      //     console.log(originalData[i].money)
      //     if (originalData[i].money > 0) {
      //       yAxis_data.push(originalData[i].receiver);
      //       series_data.push(Math.round(originalData[i].money));
      //     }
      //   }
      //   this.szfph_bar.yAxis_data = yAxis_data.reverse();
      //   this.szfph_bar.series_data = series_data.reverse();
      //   this.drawSzfphBar();

      //   this.recordNoData.delete(2);
      // }
      if (_len > 0) {
        for (var i = 0; i < _len && i < 10; i++) {
          yAxis_data.push(filterData[i].receiver);
          series_data.push(Math.round(filterData[i].money));
          // }
        }
        this.szfph_bar.yAxis_data = yAxis_data.reverse();
        this.szfph_bar.series_data = series_data.reverse();
        this.drawSzfphBar();

        this.recordNoData.delete(2);
      } else {
        this.recordNoData.add(2);
        $("#szfph-bar").html('<div class="nodata-box"></div>');
        $("#szfph-bar").removeAttr("_echarts_instance_");
      }
    },
    drawSzfphBar() {
      var _that = this;
      _that.szfph_bar.echarts = Echarts.init(
        document.getElementById("szfph-bar"),
        "yaozh_theme"
      );
      _that.szfph_bar.echarts.setOption({
        tooltip: {
          position: (point, params, dom, rect, size) => {
            return this.echartsTooltipPositionX(point, params, dom, rect, size);
          },
          trigger: "item",
          formatter: "{b}<br />金额(万元): {c}"
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
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
          // containLabel: true
          left: 120
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
          data: _that.szfph_bar.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "金额(万元)"
        },
        series: [
          {
            data: _that.szfph_bar.series_data,
            type: "bar"
          }
        ]
      });
    },
    drawSzfphBarOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("szfph-bar-open"),
        "yaozh_theme"
      ).setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}<br />金额(万元):{c}"
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        grid: {
          containLabel: true
        },
        yAxis: {
          type: "category",
          data: _that.szfph_bar.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "金额(万元)"
        },
        series: [
          {
            data: _that.szfph_bar.series_data,
            type: "bar"
          }
        ]
      });
    },
    // 出资方排行
    dealFundersBar(originalData) {
      let filterData = originalData.filter(item => {
        return item.money > 0;
      });
      let _len = filterData.length;
      // let _len = originalData.length;
      let yAxis_data = [];
      let series_data = [];
      // if (_len > 0) {
      //   for (var i = 0; i < _len && i < 10; i++) {
      //     yAxis_data.push(originalData[i].funders);
      //     series_data.push(Math.round(originalData[i].money));
      //   }
      //   this.funders_bar.yAxis_data = yAxis_data.reverse();
      //   this.funders_bar.series_data = series_data.reverse();
      //   this.drawFundersBar();

      //   this.recordNoData.delete(3);
      // }
      if (_len > 0) {
        for (var i = 0; i < _len && i < 10; i++) {
          yAxis_data.push(filterData[i].funders);
          series_data.push(Math.round(filterData[i].money));
        }
        this.funders_bar.yAxis_data = yAxis_data.reverse();
        this.funders_bar.series_data = series_data.reverse();
        this.drawFundersBar();

        this.recordNoData.delete(3);
      } else {
        this.recordNoData.add(3);
        $("#funders-bar").html('<div class="nodata-box"></div>');
        $("#funders-bar").removeAttr("_echarts_instance_");
      }
    },
    drawFundersBar() {
      var _that = this;
      _that.funders_bar.echarts = Echarts.init(
        document.getElementById("funders-bar"),
        "yaozh_theme"
      );
      _that.funders_bar.echarts.setOption({
        tooltip: {
          position: (point, params, dom, rect, size) => {
            return this.echartsTooltipPositionX(point, params, dom, rect, size);
          },
          trigger: "item",
          formatter: "{b}<br />金额(万元): {c}"
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
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
          // containLabel: true
          left: 120
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
          data: _that.funders_bar.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "金额(万元)"
        },
        series: [
          {
            data: _that.funders_bar.series_data,
            type: "bar"
          }
        ]
      });
    },
    drawFundersBarOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("funders-bar-open"),
        "yaozh_theme"
      ).setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}<br />金额(万元):{c}"
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        grid: {
          containLabel: true
        },
        yAxis: {
          type: "category",
          data: _that.funders_bar.yAxis_data
        },
        xAxis: {
          type: "value",
          name: "金额(万元)"
        },
        series: [
          {
            data: _that.funders_bar.series_data,
            type: "bar"
          }
        ]
      });
    },
    // 轮次占比
    dealLczbPie(originalData) {
      let _len = originalData.length;
      let xAxis_data = [];
      let series_data = [];
      if (_len > 0) {
        // originalData.sort(function(a,b){
        //   return a.doc_count- b.doc_count
        // })
        for (var i = 0; i < _len; i++) {
          xAxis_data.push(originalData[i].round);
          series_data.push({
            value: originalData[i].total,
            name: originalData[i].round
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

        this.lczb_pie.xAxis_data = xAxis_data;
        this.lczb_pie.series_data = series_data;
        this.drawLczbPie();

        this.recordNoData.delete(4);
      } else {
        this.recordNoData.add(4);
        $("#lczb-pie").html('<div class="nodata-box"></div>');
        $("#lczb-pie").removeAttr("_echarts_instance_");
      }
    },
    drawLczbPie() {
      var _that = this;
      _that.lczb_pie.echarts = Echarts.init(
        document.getElementById("lczb-pie"),
        "yaozh_theme"
      );
      _that.lczb_pie.echarts.setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.lczb_pie.xAxis_data
        },
        toolbox: {
          right: "20",
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
                _that.handleToggleBar("lczb-pie", _that.lczb_pie, 4);
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
            data: _that.lczb_pie.series_data
          }
        ]
      });
    },
    drawLczbPieOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("lczb-pie-open"),
        "yaozh_theme"
      ).setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.lczb_pie.xAxis_data
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              icon: "image:///static/imgs/echarts/download.png"
            },
            myTogglePie: {
              show: true,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                _that.handleToggleBar(
                  "lczb-pie-open",
                  _that.lczb_pie,
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
            data: _that.lczb_pie.series_data
          }
        ]
      });
    },
    // 地区占比
    dealDqzbPie(originalData) {
      let _len = originalData.length;
      let xAxis_data = [];
      let series_data = [];
      if (_len > 0) {
        // originalData.sort(function(a,b){
        //   return a.doc_count- b.doc_count
        // })
        for (var i = 0; i < _len; i++) {
          xAxis_data.push(originalData[i].area);
          series_data.push({
            value: originalData[i].total,
            name: originalData[i].area
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

        this.dqzb_pie.xAxis_data = xAxis_data;
        this.dqzb_pie.series_data = series_data;
        this.drawDqzbPie();

        this.recordNoData.delete(4);
      } else {
        this.recordNoData.add(4);
        $("#dqzb-pie").html('<div class="nodata-box"></div>');
        $("#dqzb-pie").removeAttr("_echarts_instance_");
      }
    },
    drawDqzbPie() {
      var _that = this;
      _that.dqzb_pie.echarts = Echarts.init(
        document.getElementById("dqzb-pie"),
        "yaozh_theme"
      );
      _that.dqzb_pie.echarts.setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.dqzb_pie.xAxis_data
        },
        toolbox: {
          right: "20",
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
                _that.handleToggleBar("dqzb-pie", _that.dqzb_pie, 4);
              }
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
            data: _that.dqzb_pie.series_data
          }
        ]
      });
    },
    drawDqzbPieOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("dqzb-pie-open"),
        "yaozh_theme"
      ).setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.dqzb_pie.xAxis_data
        },
        toolbox: {
          right: "20",
          feature: {
            saveAsImage: {
              title: "保存",
              icon: "image:///static/imgs/echarts/download.png"
            },
            myTogglePie: {
              show: true,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                _that.handleToggleBar(
                  "dqzb-pie-open",
                  _that.dqzb_pie,
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
            data: _that.dqzb_pie.series_data
          }
        ]
      });
    },
    handleDialogVisible(value) {
      this.dialogVisible = value;
    },
    // 切换为饼形图
    handleTogglePie(el, data, index) {
      let _that = this;
      let option;
      if (
        el == "lczb-pie" ||
        el == "lczb-pie-open" ||
        el == "dqzb-pie" ||
        el == "dqzb-pie-open"
      ) {
        // 轮次占比和地区占比 专属饼形图属性
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

      if (index == undefined) {
        option.toolbox.feature.myMagnify = {};
      }
      $("#" + el).removeAttr("_echarts_instance_");
      let chart = Echarts.init(document.getElementById(el), "yaozh_theme");
      chart.setOption(option);
    }
    // handleToggleMap (el, data, index) {
    //   let _that = this
    //   let option
    //   if (el == 'dqzb-map' || el == 'dqzb-map-open') {
    //     option = {
    //       toolbox: {
    //         feature: {
    //           saveAsImage: {
    //             title: "保存",
    //             icon: "image:///static/imgs/echarts/download.png"
    //           },
    //           myToggleBar: {
    //             show: true,
    //             title: "柱形图",
    //             icon: "image:///static/imgs/echarts/bar.png",
    //             onclick() {
    //               _that.handleToggleBar(el, _that.dqzb_bar, index);
    //             }
    //           },
    //           myTogglePie: {
    //             show: true,
    //             title: "饼形图",
    //             icon: "image:///static/imgs/echarts/pie.png",
    //             onclick() {
    //               _that.handleTogglePie(el, _that.dqzb_pie, index);
    //             }
    //           },
    //           myMagnify: {
    //             show: true,
    //             title: "全屏",
    //             icon: "image:///static/imgs/echarts/fullscreen.png",
    //             onclick() {
    //               _that.initOpendKsh(index);
    //             }
    //           }
    //         }
    //       },
    //       tooltip: {
    //         trigger: "axis"
    //       },
    //       visualMap: {
    //         min: 0,
    //         max: this.dqzb_map.max,
    //         left: "left",
    //         top: "bottom",
    //         text: ["高", "低"], // 文本，默认为数值文本
    //         calculable: true,
    //         inRange: {
    //           color: this.dqzb_map.colorRange
    //         }
    //       },
    //       series: [
    //         {
    //           name: "数量",
    //           type: "map",
    //           mapType: "china",
    //           label: {
    //             normal: {
    //               show: false
    //             },
    //             emphasis: {
    //               show: true
    //             }
    //           },
    //           data: this.dqzb_map.series_data
    //         }
    //       ]
    //     }
    //   }

    //   if (index == undefined) {
    //     option.toolbox.feature.myMagnify = {};
    //   }
    //   $("#" + el).removeAttr("_echarts_instance_");
    //   let chart = Echarts.init(document.getElementById(el), 'yaozh_theme');
    //   chart.setOption(option);
    // }
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
  mounted() {},
  activated() {
    this.vueRouteToNoPms(this.nopms.ksh);
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.ksh);
  },
  watch: {
    kshRes() {
      this.update();
    },
    $route() {
      if (this.$route.path === "/tourongzi/analy" && !this.kshRes.trqs.length) {
        this.loadData();
      }
      if (this.$route.path === "/tourongzi/list" && !this.res1.length) {
        Store.dispatch("Tourongzi/nomalSearch", {
          queryToPutong: false,
          tabs: true
        });
      }
    },
    dialogVisible() {
      if (this.dialogVisible) {
        $(".dialog").removeClass("hide");
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
.tourongzi-analy {
  .totals {
    margin-top: 20px !important;
    height: 130px;
    background-color: @White;
    box-shadow: @BoxShadow;
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
