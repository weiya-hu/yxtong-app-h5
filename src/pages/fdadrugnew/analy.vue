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
          <ul class="total-item">
            <li class="li1">上市数量</li>
            <li class="li2">
              总计<span>{{
                base_count.shangshi_count ? base_count.shangshi_count : 0
              }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">上市品种</li>
            <li class="li2">
              总计<span>{{
                base_count.shangshi_pinzhong_count
                  ? base_count.shangshi_pinzhong_count
                  : 0
              }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">剂型</li>
            <li class="li2">
              总计<span>{{
                base_count.jixing_count ? base_count.jixing_count : 0
              }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">申请机构</li>
            <li class="li2">
              总计<span>{{
                base_count.jigou_count ? base_count.jigou_count : 0
              }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">上市年份</li>
            <li class="li2">
              总计<span>{{
                base_count.shangshi_year_count
                  ? base_count.shangshi_year_count
                  : 0
              }}</span
              >个
            </li>
          </ul>
        </div>
      </div>
      <div class="chart_bottom">
        <div class="go-list">
          <router-link tag="a" :to="{ path: '/fdadrugnew/list' }"
            >返回列表</router-link
          >
        </div>
        <div class="chart-boxes">
          <DbEcharts v-for="(item, ix) in titles" :key="ix" :title="item.name">
            <div class="echarts">
              <div class="title-tooltip">
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="right"
                  v-if="item.tooltip"
                >
                  <div slot="content" v-html="item.tooltip"></div>
                  <i
                    class="el-icon-question cl-green"
                    style="font-size: 14px;"
                  ></i>
                </el-tooltip>
              </div>
              <div :id="'bar' + ix" class="barin"></div>
              <div class="nodata-box" v-if="item.show"></div>
              <div class="nodata-box-atc" v-if="item.show_atc"></div>
              <LoadingGif
                :className="'chart-loading'"
                :loadFlag="item.loading"
                v-if="item.loading"
                :delayTime="0"
              ></LoadingGif>
            </div>
          </DbEcharts>
        </div>
      </div>
      <!-- 展开效果 -->
      <div class="dialog" v-if="dialogVisible">
        <div class="menu">
          <div
            v-for="(ti, index) in titles"
            v-bind:class="[index == openIndex ? 'active' : '', 'nav']"
            @click="handleOpenIndex(index)"
            :key="index"
          >
            {{ ti.name }}
          </div>
        </div>
        <div class="echarts-items-wap">
          <div class="echarts-items-title">
            <span class="echart-title">{{ titles[openIndex].name }}</span>
            <a
              class="esc-btn"
              href="javascript:;"
              @click="dialogVisible = false"
              ><i></i
              ><img src="/static/imgs/echarts/esc-fullscreen.png" alt="退出全屏"
            /></a>
          </div>
          <div class="echarts-items1">
            <div
              id="bigchart"
              style="height:100%;width: 100%"
              class="bigchart"
            ></div>
            <div class="nodata-box" v-if="bigshow"></div>
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
      asyncRender: null,
      loading: true,
      dialogVisible: false,
      initopen: false, //控制渲染一次
      openIndex: 0, //控制展开第几个图形
      bigshow: false,
      titles: [
        {
          show: false,
          loading: true,
          name: "品种排行",
          key: "pinzhong"
        },
        {
          show: false,
          loading: true,
          name: "机构排行",
          key: "jigou"
        },
        {
          tooltip: "可以使用鼠标滚轮调整上市趋势的区间，放大、缩小等等。",
          show: false,
          loading: true,
          name: "上市趋势",
          key: "shangshi_qushi"
        },
        {
          show: false,
          loading: true,
          name: "剂型",
          key: "jixing"
        },
        {
          show: false,
          loading: true,
          name: "ATC分类",
          key: "zhiliao_lingyu"
        },
        {
          show: false,
          loading: true,
          name: "提交分类",
          key: "submit_type"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.Fdadrugnew.nopms,
      activeTabName: state => state.Fdadrugnew.tabname,
      kshRes: state => state.Fdadrugnew.kshRes,
      kshTotal: state => state.Fdadrugnew.kshTotal,
      analyLoading: state => state.Fdadrugnew.analyLoading,
      res1: state => state.Fdadrugnew.res1,
      res2: state => state.Fdadrugnew.res2,
      res3: state => state.Fdadrugnew.res3,
      base_count: state =>
        state.Fdadrugnew.kshRes.base_count
          ? state.Fdadrugnew.kshRes.base_count
          : {},
      allBase: state => state.Fdadrugnew.allBase
    }),
    noData() {
      return !this.res1.res && !this.res2.length && !this.res3.length;
    },
    conditions() {
      return this.$store.state.Fdadrugnew.conditions;
    },
    isNoAtc() {
      let atcs_sel = false;
      _.forEach(this.conditions, item => {
        if (item.name === "atc") {
          atcs_sel = item.atcs_sel;
        }
      });
      return atcs_sel;
    }
  },
  methods: {
    getImgName(i) {
      return `药智数据企业版-${document.title}-智能分析-${this.titles[i].name}`;
    },
    handleOpenIndex(index, opt, type) {
      this.dialogVisible = true;
      if (index > 0 && index < this.titles.length) {
        this.openIndex = index;
      } else {
        this.openIndex = 0;
      }
      setTimeout(() => {
        this.bigshow = false;
        if (type) {
          let option = Object.assign(opt, {
            id: "bigchart",
            myMagnify: false
          });
          if (type === "line") {
            this.drawLine(option);
          } else if (type === "bar") {
            this.drawBar(option);
          } else if (type === "pie") {
            this.drawPie(option);
          }
        } else {
          let types = this.titles[this.openIndex].type;
          if (types) {
            let option = Object.assign(this.titles[this.openIndex].opt, {
              id: "bigchart",
              myMagnify: false
            });
            if (this.titles[this.openIndex].type === "line") {
              this.drawLine(option);
            } else if (this.titles[this.openIndex].type === "bar") {
              this.drawBar(option);
            } else if (this.titles[this.openIndex].type === "pie") {
              this.drawPie(option);
            }
          } else {
            this.bigshow = true;
          }
        }
      }, 10);
    },
    update() {
      let {
        pinzhong,
        jigou,
        shangshi_qushi,
        jixing,
        zhiliao_lingyu,
        submit_type
      } = this.kshRes;
      if (
        document.getElementsByClassName("barin").length > 0 &&
        !document.getElementsByClassName("barin")[0].offsetHeight
      ) {
        this.asyncRender = setTimeout(() => {
          this.update();
        }, 500);
        return;
      }
      if (this.asyncRender) this.asyncRender = null;
      if (pinzhong && pinzhong.length && this.titles[0].loading) {
        this.titles[0].loading = false;
        this.titles[0].type = "bar";
        this.titles[0].opt = {
          gaparam: "pinzhong",
          reverse: true,
          showfeature: false,
          id: "bar0",
          index: 0,
          yname: "",
          xname: "数量",
          xtype: "value",
          ytype: "category",
          ydata: _.map(pinzhong, "name").reverse(),
          data: _.map(pinzhong, "count").reverse(),
          totaldata: pinzhong.reverse().reverse()
        };
        this.drawBar(this.titles[0].opt);
      }
      if (jigou && jigou.length && this.titles[1].loading) {
        this.titles[1].loading = false;
        this.titles[1].type = "bar";
        this.titles[1].opt = {
          gaparam: "qiye",
          reverse: true,
          showfeature: false,
          id: "bar1",
          index: 1,
          yname: "",
          xname: "数量",
          xtype: "value",
          ytype: "category",
          ydata: _.map(jigou, "name").reverse(),
          data: _.map(jigou, "count").reverse(),
          totaldata: jigou.reverse().reverse()
        };
        this.drawBar(this.titles[1].opt);
      }
      if (shangshi_qushi && shangshi_qushi.length && this.titles[2].loading) {
        this.titles[2].loading = false;
        this.titles[2].type = "line";
        this.titles[2].opt = {
          gaparam: "shangshi_qushi",
          showfeature: false,
          showcolumn: true,
          showLine: true,
          id: "bar2",
          index: 2,
          yname: "",
          xname: "",
          xdata: _.map(shangshi_qushi, "year"),
          data: _.map(shangshi_qushi, "total_count"),
          data1: _.map(shangshi_qushi, "china_count"),
          legend: ["全部", "中国企业"],
          bottom: 100
        };
        this.drawLine(this.titles[2].opt);
      }
      if (jixing && jixing.length && this.titles[3].loading) {
        this.titles[3].loading = false;
        this.titles[3].type = "bar";
        this.titles[3].opt = {
          gaparam: "jixing",
          reverse: true,
          showfeature: false,
          id: "bar3",
          index: 3,
          yname: "",
          xname: "数量",
          xtype: "value",
          ytype: "category",
          ydata: _.map(jixing, "name").reverse(),
          data: _.map(jixing, "count").reverse()
        };
        this.drawBar(this.titles[3].opt);
      }
      if (zhiliao_lingyu && zhiliao_lingyu.length && this.titles[4].loading) {
        this.titles[4].loading = false;
        this.titles[4].type = "pie";
        this.titles[4].opt = {
          gaparam: "zhiliao_lingyu",
          showfeature: true,
          showcolumn: true,
          showLine: false,
          rotate: 30,
          id: "bar4",
          index: 4,
          yname: "",
          xname: "",
          xdata: _.map(zhiliao_lingyu, "name"),
          data: _.map(zhiliao_lingyu, "count"),
          bottom: 80
        };
        this.drawPie(this.titles[4].opt);
      }
      if (submit_type && submit_type.length && this.titles[5].loading) {
        this.titles[5].loading = false;
        this.titles[5].type = "pie";
        this.titles[5].opt = {
          gaparam: "submit_type",
          showfeature: true,
          showcolumn: true,
          showLine: false,
          rotate: 30,
          id: "bar5",
          index: 5,
          yname: "",
          xname: "",
          xdata: _.map(submit_type, "name"),
          data: _.map(submit_type, "count"),
          bottom: 80
        };
        this.drawPie(this.titles[5].opt);
      }
    },
    drawLine({
      gaparam = "",
      id = "",
      showcolumn = false,
      showfeature = false,
      myMagnify = true,
      yname = "",
      xname = "",
      xdata = [],
      ydata = [],
      data = [],
      data1 = [],
      xtype = "category",
      ytype = "value",
      legend = [],
      bottom = 60
    }) {
      var _that = this;
      let chart = Echarts.init(document.getElementById(id), "yaozh_theme");
      let opt = arguments[0];
      chart.clear();

      chart.setOption({
        dataZoom: [
          {
            type: "inside",
            start: 80,
            end: 100
          }
        ],
        tooltip: {
          trigger: "axis",
          position: "right"
          // formatter: `{b}年<br />数量: {c}`
        },
        legend: {
          data: legend,
          bottom: 0
        },
        grid: {
          left: "10%",
          right: "12%",
          bottom: bottom
        },
        toolbox: {
          right: 20,
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(opt.index),
              icon: "image:///static/imgs/echarts/download.png",
              onclick() {}
            },
            myTogglePie: {
              show: showfeature,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {
                if (gaparam) {
                  window.ga(
                    "send",
                    "event",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  );
                  window._paq.push([
                    "trackEvent",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  ]);
                }
                _that.drawPie(
                  Object.assign(
                    opt,
                    _that.dialogVisible
                      ? opt
                      : {
                          id: "bar" + opt.index,
                          myMagnify: true
                        }
                  )
                );
              }
            },
            myToggleBar: {
              show: showcolumn,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                if (gaparam) {
                  window.ga(
                    "send",
                    "event",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  );
                  window._paq.push([
                    "trackEvent",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  ]);
                }
                _that.drawBar(
                  Object.assign(
                    opt,
                    _that.dialogVisible
                      ? opt
                      : {
                          id: "bar" + opt.index,
                          myMagnify: true
                        }
                  )
                );
              }
            },
            myToggleLine: {
              show: false,
              title: "线形图",
              icon: "image:///static/imgs/echarts/check.png",
              onclick() {
                if (gaparam) {
                  window.ga(
                    "send",
                    "event",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  );
                  window._paq.push([
                    "trackEvent",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  ]);
                }
                _that.drawLine(
                  Object.assign(
                    opt,
                    _that.dialogVisible
                      ? opt
                      : {
                          id: "bar" + opt.index,
                          myMagnify: true
                        }
                  )
                );
              }
            },
            myMagnify: {
              show: myMagnify,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.handleOpenIndex(
                  Number(/^bar(\d)$/.exec(id)[1]),
                  opt,
                  "line"
                );
                if (gaparam) {
                  window.ga(
                    "send",
                    "event",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_quanping"
                  );
                  window._paq.push([
                    "trackEvent",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  ]);
                }
              }
            }
          }
        },
        xAxis: {
          name: xname,
          type: xtype,
          data: xdata
        },
        yAxis: {
          name: yname,
          type: ytype,
          data: ydata
        },
        series: [
          {
            name: legend[0],
            data: data,
            type: "line"
          },
          {
            name: legend[1],
            data: data1,
            type: "line"
          }
        ]
      });
    },
    drawPie({
      gaparam = "",
      id = "",
      showcolumn = false,
      showLine = false,
      myMagnify = true,
      yname = "",
      xname = "",
      xdata = [],
      ydata = [],
      data = [],
      xtype = "category",
      ytype = "value"
    }) {
      let _that = this;
      let opt = arguments[0];
      let chart = Echarts.init(document.getElementById(id), "yaozh_theme");
      chart.clear();

      let piedata = [];
      if (xtype === "category") {
        xdata.forEach((e, i) => {
          piedata.push({
            name: e,
            value: data[i]
          });
        });
      } else {
        ydata.forEach((e, i) => {
          piedata.push({
            name: e,
            value: data[i]
          });
        });
      }
      chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
        },
        legend: {
          type: "scroll",
          bottom: 0,
          data: xtype === "category" ? xdata : ydata
        },
        grid: {
          // top: 'center',
        },
        toolbox: {
          right: 20,
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(opt.index),
              icon: "image:///static/imgs/echarts/download.png",
              onclick() {}
            },
            myTogglePie: {
              show: false,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {
                if (gaparam) {
                  window.ga(
                    "send",
                    "event",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  );
                  window._paq.push([
                    "trackEvent",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  ]);
                }
                _that.drawPie(
                  Object.assign(
                    opt,
                    _that.dialogVisible
                      ? opt
                      : {
                          id: "bar" + opt.index,
                          myMagnify: true
                        }
                  )
                );
              }
            },
            myToggleLine: {
              show: showLine,
              title: "线形图",
              icon: "image:///static/imgs/echarts/check.png",
              onclick() {
                if (gaparam) {
                  window.ga(
                    "send",
                    "event",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  );
                  window._paq.push([
                    "trackEvent",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  ]);
                }
                _that.drawLine(
                  Object.assign(
                    opt,
                    _that.dialogVisible
                      ? opt
                      : {
                          id: "bar" + opt.index,
                          myMagnify: true
                        }
                  )
                );
              }
            },
            myToggleBar: {
              show: showcolumn,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                if (gaparam) {
                  window.ga(
                    "send",
                    "event",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  );
                  window._paq.push([
                    "trackEvent",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  ]);
                }
                _that.drawBar(
                  Object.assign(
                    opt,
                    _that.dialogVisible
                      ? opt
                      : {
                          id: "bar" + opt.index,
                          myMagnify: true
                        }
                  )
                );
              }
            },
            myMagnify: {
              show: myMagnify,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.handleOpenIndex(
                  Number(/^bar(\d)$/.exec(id)[1]),
                  opt,
                  "pie"
                );
                if (gaparam) {
                  window.ga(
                    "send",
                    "event",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_quanping"
                  );
                  window._paq.push([
                    "trackEvent",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  ]);
                }
              }
            }
          }
        },
        series: [
          {
            type: "pie",
            radius: [0, "70%"],
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: "{b}{d}%"
              }
            },
            data: piedata
          }
        ]
      });
    },
    drawBar({
      gaparam = "",
      id = "",
      showfeature = true,
      showLine = false,
      myMagnify = true,
      yname = "",
      xname = "",
      xdata = [],
      ydata = [],
      data = [],
      data1 = [],
      xtype = "category",
      ytype = "value",
      rotate = 0,
      bottom = 60,
      legend = [],
      reverse = false,
      totaldata = []
    }) {
      var _that = this;
      let chart = Echarts.init(document.getElementById(id), "yaozh_theme");
      let opt = arguments[0];
      chart.clear();
      if (reverse) {
        // totaldata.reverse()
        // ydata.reverse()
        // data.reverse()
      }
      let seriesdata = [
        {
          name: legend.length ? legend[0] : "",
          data: data,
          label: {
            show: true,
            position: ytype === "value" ? "top" : "right"
          },
          type: "bar"
        }
      ];
      if (data1.length) {
        seriesdata.push({
          name: legend[1],
          data: data1,
          label: {
            show: true,
            position: ytype === "value" ? "top" : "right"
          },
          type: "bar"
        });
      }
      let xZomm =
        xtype === "category"
          ? [
              {
                type: "inside",
                xAxisIndex: [0],
                start: 0,
                end: 100
              }
            ]
          : [];
      chart.setOption({
        dataZoom: data1.length
          ? [
              {
                type: "inside",
                show: data.length > 10,
                xAxisIndex: [0],
                start: 80,
                end: 100
              },
              {
                type: "slider",
                show: data.length > 10,
                xAxisIndex: [0],
                bottom: 30,
                start: 80,
                end: 100 //初始化滚动条
              }
            ]
          : xZomm,
        legend: {
          data: legend,
          bottom: 0
        },
        tooltip: data1.length
          ? {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            }
          : {
              trigger: "item",
              formatter: totaldata.length
                ? function(v, d) {
                    let l = totaldata.length - 1 - v.dataIndex;
                    return (
                      v.name +
                      "<br />" +
                      `${
                        totaldata[l].cname ? totaldata[l].cname + "<br />" : ""
                      }` +
                      "数量: " +
                      v.value
                    );
                  }
                : "{b}<br />数量: {c}"
            },
        grid: {
          left: xtype === "value" ? 220 : "10%",
          right: "12%",
          bottom: bottom
        },
        toolbox: {
          right: 20,
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(opt.index),
              icon: "image:///static/imgs/echarts/download.png",
              onclick() {}
            },
            myTogglePie: {
              show: showfeature,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {
                if (gaparam) {
                  window.ga(
                    "send",
                    "event",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  );
                  window._paq.push([
                    "trackEvent",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  ]);
                }
                _that.drawPie(
                  Object.assign(
                    opt,
                    _that.dialogVisible
                      ? opt
                      : {
                          id: "bar" + opt.index,
                          myMagnify: true
                        }
                  )
                );
              }
            },
            myToggleLine: {
              show: showLine,
              title: "线形图",
              icon: "image:///static/imgs/echarts/check.png",
              onclick() {
                if (gaparam) {
                  window.ga(
                    "send",
                    "event",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  );
                  window._paq.push([
                    "trackEvent",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  ]);
                }
                _that.drawLine(
                  Object.assign(
                    opt,
                    _that.dialogVisible
                      ? opt
                      : {
                          id: "bar" + opt.index,
                          myMagnify: true
                        }
                  )
                );
              }
            },
            myToggleBar: {
              show: false,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                if (gaparam) {
                  window.ga(
                    "send",
                    "event",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  );
                  window._paq.push([
                    "trackEvent",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  ]);
                }
                _that.drawBar(
                  Object.assign(
                    opt,
                    _that.dialogVisible
                      ? opt
                      : {
                          id: "bar" + opt.index,
                          myMagnify: true
                        }
                  )
                );
              }
            },
            myMagnify: {
              show: myMagnify,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.handleOpenIndex(
                  Number(/^bar(\d)$/.exec(id)[1]),
                  opt,
                  "bar"
                );
                if (gaparam) {
                  window.ga(
                    "send",
                    "event",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_quanping"
                  );
                  window._paq.push([
                    "trackEvent",
                    "option",
                    "click",
                    "cfdadrug_analy_" + gaparam + "_qiehuan"
                  ]);
                }
              }
            }
          }
        },
        xAxis: {
          name: xname,
          type: xtype,
          data: xdata,
          axisLabel: {
            rotate: rotate,
            formatter: function(v) {
              if (xtype === "category") {
                return v.length < 9 ? v : v.slice(0, 8) + "...";
              } else {
                return v;
              }
            }
          }
        },
        yAxis: {
          name: yname,
          type: ytype,
          data: ydata,
          axisLabel: {
            formatter: function(v, d) {
              if (ytype === "category") {
                let name = v;
                if (totaldata.length) {
                  let l = totaldata.length - 1 - d;
                  name = totaldata[l].cname ? totaldata[l].cname : v;
                }

                return name.length < 18 ? name : name.slice(0, 17) + "...";
              } else {
                return name;
              }
            }
          }
        },
        series: seriesdata
      });
    },
    echartsResizeHandler() {
      if (this.dialogVisible) {
        this.echartsResize("bigchart");
      }
      this.$nextTick(() => {
        this.echartsResize("barin");
      });
    }
  },
  created() {
    Store.dispatch("Fdadrugnew/getKshRes");
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
    // 美国上市数据库可视化由于接口拆分为多个，当没可视化权限的时候，拆分的接口都会去走跳转到无权限页面的逻辑，会导致页面重复跳转到无权限页面，引起路由报错，从而导致点击导航路由不能跳转，所以这里不再判断跳转
    // this.vueRouteToNoPms(this.nopms.ksh)
  },
  updated() {
    // 美国上市数据库可视化由于接口拆分为多个，当没可视化权限的时候，拆分的接口都会去走跳转到无权限页面的逻辑，会导致页面重复跳转到无权限页面，引起路由报错，从而导致点击导航路由不能跳转，所以这里不再判断跳转
    // this.vueRouteToNoPms(this.nopms.ksh)
  },
  watch: {
    kshRes(val) {
      let keyval = _.keys(val);
      let keylen = keyval.length;
      if (keylen) {
        if (this.titles[keylen - 1]) {
          this.titles[keylen - 1].loading = true;
        }

        if (keylen > 1) {
          if (
            this.kshRes[this.titles[keylen - 2].key] &&
            this.kshRes[this.titles[keylen - 2].key].length
          ) {
            this.titles[keylen - 2].show = false;
            this.titles[keylen - 2].show_atc = false;
          } else {
            this.titles[keylen - 2].show = true;
            this.titles[keylen - 2].loading = false;
            // ATC分类 多分类
            if (this.titles[keylen - 2].key === "zhiliao_lingyu") {
              this.titles[keylen - 2].show_atc = this.isNoAtc;
            }
          }
        }
      }
      this.$nextTick(() => {
        this.update();
      });
    },
    $route: {
      handler() {
        if (
          this.$route.path === "/fdadrugnew/analy" &&
          Object.keys(this.kshRes).length <= 1
        ) {
          Store.dispatch("Fdadrugnew/getKshRes");
        }
        if (this.$route.path === "/fdadrugnew/list") {
          //智能分析重新搜索清空列表数据tab无法自动复位
          let tabname = this.activeTabName;
          Store.commit("Fdadrugnew/tabname", "");
          Store.commit("Fdadrugnew/tabname", tabname);
          this.noData &&
            Store.dispatch("Fdadrugnew/nomalSearch", {
              queryToPutong: false,
              tabs: true
            });
        }
        if (this.$route.path === "/fdadrugnew/analy") {
          window.addEventListener("resize", this.echartsResizeHandler);
        } else {
          window.removeEventListener("resize", this.echartsResizeHandler);
          Store.commit("Fdadrugnew/kshRes", {});
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.nodata-box-atc,
.nodata-box {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #fff url(/static/imgs/nodata.png) center center no-repeat;
}
.nodata-box-atc {
  background: #fff url(/static/imgs/nodata_atc.png) center center no-repeat;
}
.chart-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
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
    display: flex;
    background: #fff;
    .total-item {
      flex: 1;
      padding: 30px 0;
      min-width: 127px;
      text-align: center;
      vertical-align: text-bottom;
      border-bottom: 3px solid @White;
      .num-s {
        color: #4877e8;
      }
      &:hover {
        color: @PrimaryColor;
        background-color: #eff2fa;
        border-bottom: 3px solid @PrimaryColor;
      }
      .li1 {
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
  }
  .echarts {
    position: relative;
    box-sizing: border-box;
    display: inline-block;
    margin: 50px 10px 20px 10px;
    width: calc(100% - 20px);
    height: 400px;

    .title-tooltip {
      position: absolute;
      top: -38px;
      left: 50px;
    }
    .barin {
      height: 100%;
      width: 100%;
    }
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
      .echarts-items1 {
        position: relative;
        width: calc(100% - 40px) !important;
        height: calc(100% - 190px) !important;
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
</style>
