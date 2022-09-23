<template>
  <div class="trz-binggou">
    <header-trz></header-trz>
    <LoadingGif
      :className="'fullscreen-loading'"
      :loadFlag="listLoading"
    ></LoadingGif>
    <Main>
      <!-- 左边部分 -->
      <div slot="left" style="position: relative">
        <!-- 普通搜索项 -->
        <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
          <Normal
            vuex_name="TrzBinggou"
            api_name="TrzBinggou"
            :item="item"
            :key="index"
            ref="ileft"
          ></Normal>
        </template>

        <!-- 条件筛选 -->
        <Filters vuex_name="TrzBinggou" ref="binggouFilter"></Filters>

        <!-- 搜索按钮 -->
        <el-button
          class="binggou-search-btn"
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
            <h4 class="part-title">并购事件</h4>
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
                    style="font-size: 13px"
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
          >-->
          <section class="part-section">
            <div class="sider-title">
              <img
                src="@/assets/imgs/tongji.png"
                style="width: 14px; height: 12px"
                alt
              />
              <span class="bold">
                分析图表
                <el-tooltip
                  content="统计全部数据，不随左侧筛选变化。"
                  placement="top"
                  effect="light"
                >
                  <img
                    src="~@/assets/imgs/trz/question.png"
                    height="14"
                    width="14"
                    style="cursor: pointer; margin-left: 6px"
                  />
                </el-tooltip>
              </span>
            </div>
            <div class="charts">
              <div class="chart1">
                <div id="chart1" class="chart1">
                  <NoData
                    class="no-chart"
                    v-if="bgslList.length === 0"
                  ></NoData>
                </div>
                <div class="chart-tips">近一年并购数量趋势</div>
              </div>
              <div class="line"></div>
              <div class="chart2">
                <div id="chart2" class="chart2">
                  <NoData
                    class="no-chart"
                    v-if="amountList.length === 0"
                  ></NoData>
                </div>
                <div class="chart-tips">
                  近一年并购规模(金额)占比
                  <el-tooltip
                    content="金额情况排除了“未披露”的数据"
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
                  <NoData
                    class="no-chart"
                    v-if="provinceList.length === 0"
                  ></NoData>
                </div>
                <div class="chart-tips">近一年并购地区数量分布(中国)</div>
              </div>
            </div>
          </section>

          <section class="part-section">
            <div class="sider-title">
              <img
                src="@/assets/imgs/list.png"
                style="width: 14px; height: 12px"
                alt
              />
              <span class="bold">事件列表</span>
              <span style="margin-left: 20px; font-size: 13px">默认排序：</span>
              <el-select
                size="mini"
                disabled
                v-model="param.order"
                placeholder="请选择"
                class="select-sort"
                @change="selectChange"
              >
                <el-option label="最新发生靠前" value="time desc"></el-option>
                <el-option
                  label="金额最大靠前"
                  value="guifan_amount desc"
                ></el-option>
              </el-select>
            </div>

            <!-- 已选条件 -->
            <Optioned vuex_name="TrzBinggou"></Optioned>

            <div
              class="binggou-list"
              :style="{ 'min-height': binggouMinHeight }"
              v-if="res.length > 0"
            >
              <BinggouItem
                v-for="(item, index) in res"
                :key="index"
                :item="item"
              />
            </div>
            <NoData
              class="binggou-list"
              v-else
              :style="{ 'min-height': binggouMinHeight }"
            ></NoData>
            <div class="binggou-paganation">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="param.page"
                :page-size="param.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="Number(extendCount)"
              ></el-pagination>
            </div>
          </section>
        </div>
      </div>
      <!-- 订阅  反馈 -->
      <Tips :source="'binggou'"></Tips>
    </Main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTrz from "@/components/layouts/trz/header";
import Main from "@/components/layouts/main";
import BinggouItem from "./comp/binggou-item";
import Tips from "../component/tips";
import Normal from "@/components/common/trz/normal";
import Filters from "@/components/common/trz/filters";
import Optioned from "@/components/common/trz/options";
import NoData from "@/components/common/trz/noData";
import LoadingGif from "@/components/common/globalCom/loading-gif";
export default {
  components: {
    HeaderTrz,
    Main,
    BinggouItem,
    Normal,
    Filters,
    Optioned,
    NoData,
    LoadingGif,
    Tips,
  },
  data() {
    return {
      binggouMinHeight: "calc(100vh - 520px)",
      bgslList: [],
      amountList: [],
      provinceList: [],
      helpUrl: {},
    };
  },
  computed: {
    ...mapState({
      nomal_filed: (state) => state.TrzBinggou.nomal_filed,
      putong: (state) => state.TrzBinggou.putong,
      shaixuan: (state) => state.TrzBinggou.shaixuan,
      res: (state) =>
        _.keys(state.TrzBinggou.res).length ? state.TrzBinggou.res : [],
      extendCount: (state) => state.TrzBinggou.extendCount,
      param: (state) => state.TrzBinggou.param, // 附加参数(存于vuex内)
      listLoading: (state) => state.TrzBinggou.listLoading,
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
            this.binggouMinHeight = h2;
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
            this.binggouMinHeight = h2;
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
            this.binggouMinHeight = h2;
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
    this.vueRouteFromTrz("TrzBinggou");
    this.getHelpUrl();
    this.handlerChart1();
    this.handlerChart2();
    this.handlerChart3();
    window.addEventListener("resize", () => {
      this.echartsResize("chart1");
      this.echartsResize("chart2");
      this.echartsResize("chart3");
    });
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
    // 近一年并购数量趋势
    async handlerChart1() {
      await window
        .Axios({
          method: "get",
          url: "/api/binggou/bgslAggs",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.bgslList = res.data.data.res;
            let data = res.data.data.res,
              xAixs = data.map((item) => item.moth),
              series = data.map((item) => item.doc_count),
              option = {
                tooltip: {
                  trigger: "axis",
                },
                grid: {
                  top: 40,
                  left: 20,
                  right: 60,
                  bottom: 10,
                  containLabel: true,
                },
                xAxis: {
                  type: "category",
                  name: "月",
                  nameTextStyle: {
                    color: "#66666",
                  },
                  data: xAixs,
                  axisTick: {
                    alignWithLabel: true,
                  },
                },
                yAxis: {
                  type: "value",
                  name: "数量",
                  nameTextStyle: {
                    color: "#66666",
                  },
                },
                series: [
                  {
                    name: "数量",
                    type: "line",
                    data: series,
                  },
                ],
              };

            Echarts.init(
              document.getElementById("chart1"),
              "customed"
            ).setOption(option);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 近一年并购规模(金额)占比
    async handlerChart2() {
      await window
        .Axios({
          method: "get",
          url: "/api/binggou/amountAggs",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.amountList = res.data.data.res;
            let data = res.data.data.res,
              legend = data.map((item) => item.guifan_amount),
              series = [];
            data.forEach((item) => {
              series.push({
                name: item.guifan_amount,
                value: item.doc_count,
              });
            });
            let option = {
              tooltip: {
                trigger: "item",
              },
              legend: {
                type: "scroll",
                align: "left",
                left: "center",
                top: "bottom",
                icon: "circle", //  这个字段控制形状  类型包括 circle 圆形，triangle 三角形，diamond 四边形，arrow 变异三角形，none 无
                itemWidth: 9, // 设置宽度
                itemHeight: 9, // 设置高度
                data: legend,
              },
              series: [
                {
                  type: "pie",
                  radius: "60%",
                  center: ["50%", "50%"],
                  label: {
                    normal: {
                      show: true,
                      position: "outside",
                      formatter: "{b} {d}%",
                    },
                  },
                  data: series,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                  },
                },
              ],
            };
            Echarts.init(
              document.getElementById("chart2"),
              "customed"
            ).setOption(option);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 近一年并购地区数量分布(中国)
    async handlerChart3() {
      await window
        .Axios({
          method: "get",
          url: "/api/binggou/provinceAggs",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.provinceList = res.data.data.res;
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

            let mapChart = Echarts.init(
              document.getElementById("chart3"),
              "customed"
            );
            mapChart.setOption(option);
            mapChart.on("click", (params) => {
              console.log(params);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    nomalSearch() {
      this.$refs.binggouFilter.searchFilter();
      Store.dispatch("TrzBinggou/nomalSearch");
    },
    handleCurrentChange(val) {
      this.param.page = val;
      Store.dispatch("TrzBinggou/nomalSearch", { params: this.param });
    },
    // 修改排序参数
    selectChange(val) {
      this.param.order = val;
      Store.dispatch("TrzBinggou/nomalSearch", { params: this.param });
      console.log(val);
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../../assets/less/trz-paganation.less";
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
/deep/ .la-main .side-fold .arrow-right,
/deep/ .la-main .side-fold .arrow-left {
  margin-left: 2px;
}
.trz-binggou {
  height: calc(100vh - 48px);
  min-width: 1280px;
  background: #f5f8fc;
  padding-top: 48px;
}
@shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.19);

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
    #chart3 {
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
.binggou-search-btn {
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
  width: 130px;
}
</style>
