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
            <li class="li1">登记数量</li>
            <li class="li2">
              总计<span>{{ aggs.me_id ? aggs.me_id : 0 }}</span
              >个
            </li>
            <li class="li3">
              3期临床<span class="num-s">{{ aggs.phase ? aggs.phase : 0 }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">申办者单位</li>
            <li class="li2">
              总计<span>{{ aggs.qiyemingcheng ? aggs.qiyemingcheng : 0 }}</span
              >个
            </li>
            <li
              class="li3"
              v-if="aggs.most_qiyemingcheng && aggs.most_qiyemingcheng.count"
            >
              {{ aggs.most_qiyemingcheng.name }}最多
              <p>
                共<span class="num-s">{{ aggs.most_qiyemingcheng.count }}</span
                >个
              </p>
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">药品</li>
            <li class="li2">
              总计<span>{{ aggs.name_guifan ? aggs.name_guifan : 0 }}</span
              >个
            </li>
            <li class="li3" v-if="aggs.most_type && aggs.most_type.count">
              {{ aggs.most_type.name }}最多
              <p>
                共<span class="num-s">{{ aggs.most_type.count }}</span
                >个
              </p>
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">试验机构</li>
            <li class="li2">
              总计<span>{{
                aggs.institutes_guifan ? aggs.institutes_guifan : 0
              }}</span
              >个
            </li>
            <li
              class="li3"
              v-if="
                aggs.most_institutes_guifan && aggs.most_institutes_guifan.count
              "
            >
              {{ aggs.most_institutes_guifan.name }}最多
              <p>
                共<span class="num-s">{{
                  aggs.most_institutes_guifan.count
                }}</span
                >个
              </p>
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">已完成</li>
            <li class="li2">
              总计<span>{{ aggs.me_status ? aggs.me_status : 0 }}</span
              >个
            </li>
            <li class="li3">
              3期临床完成<span class="num-s">{{
                aggs.me_status_phase ? aggs.me_status_phase : 0
              }}</span
              >个
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">一致性评价品种</li>
            <li class="li2">
              总计<span>{{ aggs.yzx ? aggs.yzx : 0 }}</span
              >个
            </li>
          </ul>
        </div>
      </div>
      <div class="chart_bottom">
        <div class="go-list">
          <router-link tag="a" :to="{ path: '/linchuangshiyan/list' }"
            >返回列表</router-link
          >
        </div>
        <div class="chart-boxes">
          <DbEcharts v-for="(item, ix) in titles" :key="ix" :title="item.name">
            <div class="echarts">
              <div :id="'bar' + ix" class="barin"></div>
              <div class="nodata-box" v-if="item.show"></div>
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
      loading: true,
      dialogVisible: false,
      initopen: false, //控制渲染一次
      openIndex: 0, //控制展开第几个图形
      bigshow: false,
      titles: [
        {
          show: true,
          name: "登记趋势",
          key: "views_djqs"
        },
        {
          show: true,
          name: "申办者单位排行",
          key: "views_sbzdw"
        },
        {
          show: true,
          name: "试验机构排行",
          key: "views_syjg"
        },
        {
          show: true,
          name: "药品排行",
          key: "views_ypph"
        },
        {
          show: true,
          name: "药品类型",
          key: "views_yplx"
        },
        {
          show: true,
          name: "试验状态",
          key: "views_syzt"
        },
        {
          show: true,
          name: "试验分类",
          key: "views_syfl"
        },
        {
          show: true,
          name: "试验分期",
          key: "views_syfq"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.Linchuangshiyan.nopms,
      kshRes: state => state.Linchuangshiyan.kshRes,
      kshTotal: state => state.Linchuangshiyan.kshTotal,
      analyLoading: state => state.Linchuangshiyan.analyLoading,
      aggs: state =>
        state.Linchuangshiyan.kshRes.aggs
          ? state.Linchuangshiyan.kshRes.aggs
          : {},
      view: state =>
        state.Linchuangshiyan.kshRes.view
          ? state.Linchuangshiyan.kshRes.view
          : {},
      allBase: state => state.Linchuangshiyan.allBase,
      activeTabName: state => state.Linchuangshiyan.tabname,
      res1: state => state.Linchuangshiyan.res1,
      res2: state => state.Linchuangshiyan.res2,
      res3: state => state.Linchuangshiyan.res3,
      res4: state => state.Linchuangshiyan.res4
    }),
    noData() {
      return (
        !this.res1.res &&
        !this.res2.length &&
        !this.res3.length &&
        !this.res4.length
      );
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
        views_djqs,
        views_sbzdw,
        views_syjg,
        views_ypph,
        views_yplx,
        views_syzt,
        views_syfl,
        views_syfq
      } = this.view;

      if (views_djqs && views_djqs.length) {
        this.titles[0].type = "line";
        this.titles[0].opt = {
          showfeature: false,
          id: "bar0",
          index: 0,
          yname: "登记数量",
          xname: "年份",
          xdata: _.map(views_djqs, "year"),
          data: _.map(views_djqs, "count")
        };
        this.drawLine(this.titles[0].opt);
      }
      if (views_sbzdw && views_sbzdw.length) {
        views_sbzdw.reverse();
        this.titles[1].type = "bar";
        this.titles[1].opt = {
          showfeature: false,
          id: "bar1",
          index: 1,
          yname: "申办者单位名称",
          xname: "登记数量",
          xtype: "value",
          ytype: "category",
          ydata: _.map(views_sbzdw, "qiyemingcheng"),
          data: _.map(views_sbzdw, "count")
        };
        this.drawBar(this.titles[1].opt);
      }
      if (views_syjg && views_syjg.length) {
        views_syjg.reverse();
        this.titles[2].type = "bar";
        this.titles[2].opt = {
          showfeature: false,
          id: "bar2",
          index: 2,
          yname: "试验机构名称",
          xname: "登记数量",
          xtype: "value",
          ytype: "category",
          ydata: _.map(views_syjg, "institutes_guifan"),
          data: _.map(views_syjg, "count")
        };
        this.drawBar(this.titles[2].opt);
      }
      if (views_ypph && views_ypph.length) {
        views_ypph.reverse();
        this.titles[3].type = "bar";
        this.titles[3].opt = {
          showfeature: false,
          id: "bar3",
          index: 3,
          yname: "药品名称",
          xname: "登记数量",
          xtype: "value",
          ytype: "category",
          ydata: _.map(views_ypph, "name_guifan"),
          data: _.map(views_ypph, "count")
        };
        this.drawBar(this.titles[3].opt);
      }
      if (views_yplx && views_yplx.length) {
        this.titles[4].type = "pie";
        this.titles[4].opt = {
          rotate: 30,
          id: "bar4",
          index: 4,
          yname: "登记数量",
          xname: "药品类型",
          xdata: _.map(views_yplx, "type"),
          data: _.map(views_yplx, "count")
        };
        this.drawPie(this.titles[4].opt);
      }
      if (views_syzt && views_syzt.length) {
        this.titles[5].type = "pie";
        this.titles[5].opt = {
          id: "bar5",
          index: 5,
          yname: "登记数量",
          xname: "试验状态",
          xdata: _.map(views_syzt, "me_statusint"),
          data: _.map(views_syzt, "count")
        };
        this.drawPie(this.titles[5].opt);
      }
      if (views_syfl && views_syfl.length) {
        this.titles[6].type = "pie";
        this.titles[6].opt = {
          rotate: 45,
          bottom: 140,
          id: "bar6",
          index: 6,
          yname: "登记数量",
          xname: "试验分类",
          xdata: _.map(views_syfl, "sort"),
          data: _.map(views_syfl, "count")
        };
        this.drawPie(this.titles[6].opt);
      }
      if (views_syfq && views_syfq.length) {
        this.titles[7].type = "bar";
        this.titles[7].opt = {
          id: "bar7",
          index: 7,
          yname: "登记数量",
          xname: "试验分期",
          xdata: _.map(views_syfq, "phase"),
          data: _.map(views_syfq, "count")
        };
        this.drawBar(this.titles[7].opt);
      }
    },
    drawLine({
      id = "",
      showfeature = true,
      myMagnify = true,
      yname = "",
      xname = "",
      xdata = [],
      ydata = [],
      data = [],
      xtype = "category",
      ytype = "value"
    }) {
      var _that = this;
      let chart = Echarts.init(document.getElementById(id), "yaozh_theme");
      let opt = arguments[0];
      chart.setOption({
        tooltip: {
          trigger: "axis",
          position: "right",
          formatter: `{b}年<br />数量: {c}`
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(opt.index),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myTogglePie: {
              show: showfeature,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {}
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
            data: data,
            type: "line"
          }
        ]
      });
    },
    drawPie({
      id = "",
      showfeature = true,
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
      let piedata = [];
      let chart = Echarts.init(document.getElementById(id), "yaozh_theme");
      chart.clear();
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
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(opt.index),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myToggleBar: {
              show: showfeature,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
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
      id = "",
      showfeature = true,
      myMagnify = true,
      yname = "",
      xname = "",
      xdata = [],
      ydata = [],
      data = [],
      xtype = "category",
      ytype = "value",
      rotate = 0,
      bottom = 60
    }) {
      var _that = this;
      let chart = Echarts.init(document.getElementById(id), "yaozh_theme");
      let opt = arguments[0];
      chart.clear();
      chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}<br />数量: {c}"
        },
        grid: {
          left: xtype === "value" ? 220 : "21%",
          right: "12%",
          bottom: bottom
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(opt.index),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myTogglePie: {
              show: showfeature,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {
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
              }
            }
          }
        },
        xAxis: {
          name: xname,
          type: xtype,
          data: xdata,
          axisLabel: {
            rotate: rotate
          }
        },
        yAxis: {
          name: yname,
          type: ytype,
          data: ydata,
          axisLabel: {
            formatter: function(v) {
              if (ytype === "category") {
                return v.length < 18 ? v : v.slice(0, 17) + "...";
              } else {
                return v;
              }
            }
          }
        },
        series: [
          {
            data: data,
            label: {
              show: true,
              position: ytype === "value" ? "top" : "right"
              // color: ytype === 'value' ? '' : '#FFF'
            },
            type: "bar"
          }
        ]
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
    Store.dispatch("Linchuangshiyan/getKshRes");
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
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.ksh);
  },
  watch: {
    kshRes(val) {
      this.titles.forEach(v => {
        v.show = this.view[v.key] && this.view[v.key].length ? false : true;
        if (this.view[v.key] && this.view[v.key].length) {
          v.show = false;
        } else {
          v.show = true;
          delete v.opt;
          delete v.type;
        }
      });
      this.$nextTick(() => {
        this.update();
      });
    },
    $route(val) {
      if (this.$route.path === "/linchuangshiyan/analy" && !this.kshRes.view) {
        Store.dispatch("Linchuangshiyan/getKshRes");
      }
      if (this.$route.path === "/linchuangshiyan/analy") {
        window.addEventListener("resize", this.echartsResizeHandler);
      } else {
        window.removeEventListener("resize", this.echartsResizeHandler);
        Store.commit("Fdadrugnew/kshRes", {});
      }
      if (this.$route.path === "/linchuangshiyan/list") {
        //智能分析重新搜索清空列表数据tab无法自动复位
        let tabname = this.activeTabName;
        Store.commit("Linchuangshiyan/tabname", "");
        Store.commit("Linchuangshiyan/tabname", tabname);
        this.noData &&
          Store.dispatch("Linchuangshiyan/nomalSearch", {
            queryToPutong: false,
            tabs: true
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.nodata-box {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #fff url(/static/imgs/nodata.png) center center no-repeat;
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
    position: relative;
    box-sizing: border-box;
    display: inline-block;
    margin: 50px 10px 20px 10px;
    width: calc(100% - 20px);
    height: 400px;

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
