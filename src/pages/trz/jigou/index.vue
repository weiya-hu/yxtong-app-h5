<template>
  <div class="trz-jigou">
    <header-trz></header-trz>
    <Main>
      <LoadingGif
        :className="'fullscreen-loading'"
        :loadFlag="listLoading"
      ></LoadingGif>
      <!-- 左边部分 -->
      <div slot="left" style="position: relative">
        <!-- 普通搜索项 -->
        <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
          <Normal
            vuex_name="TrzJigou"
            api_name="jigoudetails"
            :item="item"
            :key="index"
            ref="ileft"
          ></Normal>
        </template>

        <!-- 条件筛选 -->
        <Filters vuex_name="TrzJigou" ref="binggouFilter"></Filters>

        <!-- 搜索按钮 -->
        <el-button
          class="jigou-search-btn"
          type="primary"
          size="mini"
          round
          @click="nomalSearch"
          >搜索</el-button
        >
      </div>
      <div class="la-right">
        <div class="page-content">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <h4 class="part-title">投资机构</h4>
            <el-tooltip
              class="help-tip"
              effect="light"
              placement="bottom"
              v-if="helpUrl.remark ? helpUrl.remark : ''"
            >
              <div slot="content">
                <el-scrollbar>
                  <div
                    class="tip-content"
                    style="font-size: 13px;"
                    v-html="helpUrl.remark ? helpUrl.remark : ''"
                  ></div>
                </el-scrollbar>
                <a
                  class="btn default"
                  v-if="helpUrl.url"
                  :href="helpUrl.url"
                  target="_blank"
                  >帮助中心</a
                >
              </div>
              <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
            </el-tooltip>
          </div>
          <!-- 分析图表<el-tooltip
                  content="统计全部数据，不随左侧筛选变化。"
                  placement="top"
                  effect="light"
                >
                  <img
                    src="~@/assets/imgs/trz/question.png"
                    height="14"
                    width="14"
                    style="cursor: pointer"/></el-tooltip
              > -->
          <section class="part-section">
            <div class="sider-title">
              <img
                src="@/assets/imgs/tongji.png"
                style="width: 14px; height: 12px"
                alt=""
              />
              <span class="bold"
                >分析图表<el-tooltip
                  content="统计全部数据，不随左侧筛选变化。"
                  placement="top"
                  effect="light"
                >
                  <img
                    src="~@/assets/imgs/trz/question.png"
                    height="14"
                    width="14"
                    style="cursor: pointer; margin-left: 6px" /></el-tooltip
              ></span>
            </div>
            <div class="charts">
              <div class="chart1">
                <div id="chart1" class="chart1">
                  <NoData class="no-chart" v-if="tzsl.length === 0"></NoData>
                </div>
                <div class="chart-tips">投资数量TOP10</div>
              </div>
              <div class="line"></div>
              <div class="chart2">
                <div id="chart2" class="chart2">
                  <NoData class="no-chart" v-if="jjze.length === 0"></NoData>
                </div>
                <div class="chart-tips">
                  管理基金总额TOP10
                  <el-tooltip
                    content="排除未透露的数据。"
                    placement="top"
                    effect="light"
                  >
                    <img
                      src="~@/assets/imgs/trz/question.png"
                      height="14"
                      width="14"
                      style="cursor: pointer"
                    />
                  </el-tooltip>
                </div>
              </div>
              <div class="line"></div>
              <div class="chart3">
                <div id="chart3" class="chart3">
                  <NoData class="no-chart" v-if="dqfb.length === 0"></NoData>
                </div>
                <div class="chart-tips">机构地区分布情况(中国)</div>
              </div>
            </div>
          </section>

          <section class="part-section">
            <div class="sider-title">
              <img
                src="@/assets/imgs/list.png"
                style="width: 14px; height: 12px"
                alt=""
              />
              <span class="bold">机构列表</span>
              <span style="margin-left: 20px; font-size: 13px">默认排序：</span>
              <el-select
                size="mini"
                id="select"
                ref="elSelect"
                disabled
                v-model="param.order"
                placeholder="请选择"
                @change="selectChange"
                :popper-append-to-body="false"
                class="select-sort"
              >
                <el-option
                  label="有最新动态靠前"
                  value="dynamic desc"
                ></el-option>
                <el-option
                  label="管理基金总额靠前"
                  value="total_amount desc"
                ></el-option>
                <el-option
                  label="最新成立靠前"
                  value="establishmenttime desc"
                ></el-option>
              </el-select>
            </div>

            <!-- 已选条件 -->
            <Optioned vuex_name="TrzJigou"></Optioned>

            <div
              class="jigou-list"
              :style="{ 'min-height': jigouMinHeight }"
              v-if="res.length > 0"
            >
              <JigouItem
                v-for="(item, index) in res"
                :key="index"
                :item="item"
              ></JigouItem>
            </div>
            <NoData
              class="jigou-list"
              v-else
              :style="{ 'min-height': jigouMinHeight }"
            ></NoData>
            <div class="jigou-paganation">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="param.page"
                :page-size="param.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="Number(extendCount)"
              >
              </el-pagination>
            </div>
          </section>
        </div>
      </div>
    </Main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTrz from "@/components/layouts/trz/header";
import Main from "@/components/layouts/main";
import JigouItem from "./comp/jigou-item";
import Normal from "@/components/common/trz/normal";
import Filters from "@/components/common/trz/filters";
import Optioned from "@/components/common/trz/options";
import NoData from "@/components/common/trz/noData";
import LoadingGif from "@/components/common/globalCom/loading-gif";
export default {
  components: {
    HeaderTrz,
    Main,
    JigouItem,
    Normal,
    Filters,
    Optioned,
    NoData,
    LoadingGif,
  },
  data() {
    return {
      jigouMinHeight: "calc(100vh - 520px)",
      tzsl: [], // 图表投资数量
      jjze: [], // 图表基金总额
      dqfb: [], // 图表地区分布
      helpUrl: {}, // 帮助中心信息
    };
  },
  computed: {
    ...mapState({
      nomal_filed: (state) => state.TrzJigou.nomal_filed,
      putong: (state) => state.TrzJigou.putong,
      shaixuan: (state) => state.TrzJigou.shaixuan,
      res: (state) =>
        _.keys(state.TrzJigou.res).length ? state.TrzJigou.res : [],
      extendCount: (state) => state.TrzJigou.extendCount,
      param: (state) => state.TrzJigou.param, // 附加参数(存于vuex内)
      listLoading: (state) => state.TrzJigou.listLoading,
    }),
  },
  watch: {
    putong: {
      deep: true, //深度监听设置为 true
      handler(newV) {
        this.$nextTick(() => {
          setTimeout(() => {
            let h = $(".la-optioned").outerHeight();
            let h2 = `calc(100vh - ${520 + h}px)`;
            this.jigouMinHeight = h2;
          }, 500);
        });
      },
    },
    shaixuan: {
      deep: true, //深度监听设置为 true
      handler(newV) {
        this.$nextTick(() => {
          setTimeout(() => {
            let h = $(".la-optioned").outerHeight();
            let h2 = `calc(100vh - ${520 + h}px)`;
            this.jigouMinHeight = h2;
          }, 500);
        });
      },
    },
    res: {
      deep: true, //深度监听设置为 true
      handler(newV) {
        this.$nextTick(() => {
          setTimeout(() => {
            let h = $(".la-optioned").outerHeight();
            let h2 = `calc(100vh - ${520 + h}px)`;
            this.jigouMinHeight = h2;
          }, 500);
        });
      },
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.echartsResize("chart1");
      this.echartsResize("chart2");
      this.echartsResize("chart3");
    });
  },
  mounted() {
    // Store.dispatch("TrzRongzi/getBaseInfo").then(() => {
    //   this.vueTogglePmsTooltip()
    // })
    this.vueRouteFromTrz("TrzJigou");
    this.getHelpUrl();
    this.$nextTick(() => {
      this.handlerChart1();
      this.handlerChart2();
      this.handlerChart3();

      // 处理select下拉框由点击触发改为鼠标移入触发。
      $(".select-sort .el-input.is-disabled").removeClass("is-disabled");
      $(".select-sort").hover(
        () => {
          // this.$refs.elSelect.visible = false
          // this.$refs.elSelect.selectOption()
          $(".el-select-dropdown.el-popper").show(200);
          $(".el-select-dropdown.el-popper").css({
            top: "30px",
          });
        },
        () => {
          // this.$refs.elSelect.handleClose()
          $(".el-select-dropdown.el-popper").css({
            display: "none",
          });
        }
      );
      // 处理结束
    });
    window.addEventListener("resize", () => {
      this.echartsResize("chart1");
      this.echartsResize("chart2");
      this.echartsResize("chart3");
    });
  },
  methods: {
    // 获取帮助中心跳转链接
    getHelpUrl() {
      window
        .Axios({
          method: "get",
          url: "/api/tourongzi_report/helptext",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.helpUrl = res.data.data;
          }
        });
    },
    echartsResize(id) {
      let echart = Echarts.getInstanceByDom(document.getElementById(id));
      echart && echart.resize();
    },
    // 投资数量TOP10
    async handlerChart1() {
      await window
        .Axios({
          method: "get",
          url: "/api/jigoudetails/tzslAggs",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.tzsl = res.data.data.res;
            let data = _.orderBy(res.data.data.res, ["touzishuliang"], ["asc"]),
              that = this,
              yAxis = data.map((item) => item.shortname),
              series = data.map((item) => item.touzishuliang),
              option = {
                //   toolbox: {
                //   show: true,
                //   feature: {
                //     myFull: {
                //       show: true,
                //       title: '全屏查看',
                //       icon: 'image://http://echarts.baidu.com/images/favicon.png',
                //       onclick: () => {
                //         const element = document.getElementById('chart1');
                //         // IE 10及以下ActiveXObject
                //         if (window.ActiveXObject) {
                //           const WsShell = new ActiveXObject('WScript.Shell');
                //           WsShell.SendKeys('{F11}');
                //         } else if (element.requestFullScreen) { // HTML W3C 提议
                //           element.requestFullScreen();
                //         } else if (element.msRequestFullscreen) { // IE11
                //           element.msRequestFullScreen();
                //         } else if (element.webkitRequestFullScreen) { // Webkit (works in Safari5.1 and Chrome 15)
                //           element.webkitRequestFullScreen();
                //         } else if (element.mozRequestFullScreen) { // Firefox (works in nightly)
                //           element.mozRequestFullScreen();
                //         }
                //       },
                //     },
                //   },
                //   top: -5,
                // },

                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "shadow",
                  },
                },
                grid: {
                  top: 20,
                  left: 20,
                  right: 20,
                  bottom: 10,
                  containLabel: true,
                },
                xAxis: {
                  type: "value",
                  axisTick: {
                    alignWithLabel: true,
                  },
                  axisLabel: {
                    interval: 0,
                  },
                },
                yAxis: {
                  type: "category",
                  data: yAxis,
                  nameTextStyle: {
                    color: "#66666",
                  },
                  triggerEvent: true,
                  axisLabel: {
                    show: true,
                    color: "#66666",
                    formatter(value) {
                      return that.labelLenLimit(value);
                    },
                  },
                },
                barMaxWidth: 80,
                series: [
                  {
                    name: "投资数量",
                    type: "bar",
                    data: series,
                  },
                ],
              };
            console.log(data);
            let myChart = Echarts.init(
              document.getElementById("chart1"),
              "customed"
            );
            myChart.setOption(option);
            myChart.on("click", function (params) {
              console.log(params);
              if (params.componentType == "yAxis") {
                that.linkJiGouDetail(
                  data.filter((item) => item.shortname === params.value)[0]
                    .wyuid
                );
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    linkJiGouDetail(wyuid) {
      let { href } = this.$router.resolve({
        path: "/trz/jigou/" + wyuid,
      });
      window.open(href, "_blank");
    },
    // 管理基金总额TOP10
    async handlerChart2() {
      await window
        .Axios({
          method: "get",
          url: "/api/jigoudetails/jjzeAggs",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.jjze = res.data.data.res;
            let data = _.orderBy(res.data.data.res, ["total_amount"], ["asc"]),
              that = this,
              yAxis = data.map((item) => item.shortname),
              series = data.map((item) => item.total_amount),
              option = {
                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "shadow",
                  },
                  formatter(params) {
                    return `${
                      params[0].axisValue +
                      "<br/>" +
                      params[0].marker +
                      params[0].data
                    }亿元`;
                  },
                },
                grid: {
                  top: 20,
                  left: 20,
                  right: 20,
                  bottom: 10,
                  containLabel: true,
                },
                xAxis: {
                  type: "value",
                  axisTick: {
                    alignWithLabel: true,
                  },
                  axisLabel: {
                    interval: 0,
                  },
                },
                yAxis: {
                  type: "category",
                  data: yAxis,
                  triggerEvent: true,
                  nameTextStyle: {
                    color: "#66666",
                  },
                  axisLabel: {
                    show: true,
                    color: "#66666",
                    formatter(value) {
                      return that.labelLenLimit(value);
                    },
                  },
                },
                barMaxWidth: 80,
                series: [
                  {
                    name: "基金总额",
                    type: "bar",
                    data: series,
                  },
                ],
              };
            console.log(data);
            let myChart = Echarts.init(
              document.getElementById("chart2"),
              "customed"
            );
            myChart.setOption(option);
            myChart.on("click", function (params) {
              if (params.componentType == "yAxis") {
                that.linkJiGouDetail(
                  data.filter((item) => item.shortname === params.value)[0]
                    .wyuid
                );
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 机构地区分布情况(中国)
    async handlerChart3() {
      await window
        .Axios({
          method: "get",
          url: "/api/jigoudetails/dqfbAggs",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.dqfb = res.data.data.res;
            let data = res.data.data.res,
              series = [];
            data.length > 0 &&
              data.forEach((item) => {
                if (item.doc_count > 0 && item.province) {
                  // if (item.province.includes("省"))
                  //   item.province = item.province.replace("省", "");
                  if (item.province.includes("市"))
                    item.province = item.province.replace("市", "");
                  let provinces = {
                    内蒙古自治区: "内蒙古",
                    广西壮族自治区: "广西",
                    西藏自治区: "西藏",
                    宁夏回族自治区: "宁夏",
                    新疆维吾尔自治区: "新疆",
                    香港特别行政区: "香港",
                    澳门特别行政区: "澳门",
                  };
                  if (provinces[item.province])
                    item.province = provinces[item.province];
                  series.push({
                    name: item.province,
                    value: parseInt(item.doc_count),
                  });
                }
              });
            let max = _.maxBy(series, "value").value,
              min = _.minBy(series, "value").value,
              option = {
                tooltip: {
                  trigger: "item",
                  formatter: function (params) {
                    return `${params.name}：${params.value ? params.value : 0}`;
                  },
                },
                visualMap: {
                  max,
                  left: "60",
                  top: "bottom",
                  text: ["高", "低"], // 文本，默认为数值文本
                  calculable: true,
                },
                series: [
                  {
                    type: "map",
                    mapType: "china",
                    label: {
                      normal: {
                        show: false,
                      },
                      emphasis: {
                        show: true,
                      },
                    },
                    data: series,
                  },
                ],
              };

            Echarts.init(
              document.getElementById("chart3"),
              "customed"
            ).setOption(option);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    nomalSearch() {
      this.$refs.binggouFilter.searchFilter();
      Store.dispatch("TrzJigou/nomalSearch");
    },
    handleCurrentChange(val) {
      this.param.page = val;
      Store.dispatch("TrzJigou/nomalSearch", { params: this.param });
    },

    // 修改排序参数
    selectChange(val) {
      this.param.order = val;
      Store.dispatch("TrzJigou/nomalSearch", { params: this.param });
      console.log(val);
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../../assets/less/trz-paganation.less";
@shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.19);
/deep/ .la-main .side-fold {
  width: 10px;
  top: 50%;
  background: #b5c3d3;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
/deep/ .la-main.fold-left-side .side-fold {
  background: #b5c3d3 !important;
}

/deep/ .la-main .side-fold .arrow-right {
  margin-left: 2px;
}
.trz-jigou {
  height: calc(100vh - 48px);
  min-width: 1280px;
  background: #f5f8fc;
  padding-top: 48px;
}
.jigou-search-btn {
  width: 80px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: #3556b9;
  border-radius: 4px;
  font-size: 14px;
  color: #ffffff;
  padding: 0;
  margin: 15px 0 0 10px;
}
.la-right {
  background-color: #f5f8fc;
}
.part-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  padding: 10px;
  line-height: 1;
}
.sider-title {
  height: 36px;
  background: #f5f8fc;
  border-radius: 4px 4px 0px 0px;
  line-height: 36px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  .bold {
    font-size: 14px;
    color: #0d1a62;
    font-weight: 600;
    margin-left: 6px;
    display: flex;
    align-items: center;
  }
}
.part-section {
  box-shadow: @shadow;
  border-radius: 4px;
  background-color: #fff;
  align-self: flex-start;
  margin-bottom: 10px;
  .charts {
    position: relative;
    height: 290px;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .chart2 {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .chart-tips {
      height: 18px;
      line-height: 18px;
      font-size: 13px;
      font-weight: 400;
      color: #666666;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;

      img {
        margin-left: 6px;
      }
    }
    #chart1,
    #chart2,
    #chart3,
    .no-chart {
      height: 260px;
      width: calc((100vw - 298px) / 3);
      min-width: 300px;
      box-sizing: border-box;
      display: inline-block;
    }

    .line {
      height: 220px;
      background: #dae0e9;
      padding: 0.5px;
    }
  }
}
.rontzi-list-header {
  background-color: #dae0e9;
  height: 34px;
  display: flex;
  font-size: 14px;
  line-height: 34px;
  color: #666;
  margin: 30px 20px 0;
  .fl-1 {
    flex: 1;
  }
  .fl-2 {
    flex: 1.5;
  }
  .fl-200 {
    width: 200px;
  }
  .fl-100 {
    width: 100px;
  }
  .fl-80 {
    width: 80px;
  }
}
.jigou-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
  position: relative;
}
/deep/.el-input--mini .el-input__inner {
  height: 24px;
  color: #09144f;
  // font-weight: bold;
}

.el-select-dropdown__item.selected {
  color: #09144f;
}

.el-select-dropdown__item {
  border-bottom: 1px dashed #dae0e9;
  margin: 0 10px;
  padding: 0 4px;
}

.el-select-dropdown__item:last-child {
  border: none;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #fff;
}
.el-select-dropdown__item:hover {
  color: #e7af2f;
}

.el-select-dropdown__item {
  font-size: 12px;
}

.select-sort {
  width: 145px;
}
</style>
