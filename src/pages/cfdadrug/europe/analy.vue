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
          <div class="newtotals-scroll">
            <div class="newtotals-scroll-inner" v-if="!analyLoading">
              <ul class="total-item">
                <li class="li1">上市数量</li>
                <li class="li2">
                  总计<span>{{ basic.BaseCount }}</span
                  >个
                </li>
              </ul>
              <ul class="total-item">
                <li class="li1">上市品种</li>
                <li class="li2">
                  总计<span>{{ basic.NameCount }}</span
                  >个
                </li>
              </ul>
              <ul class="total-item">
                <li class="li1">
                  上市剂型
                  <el-tooltip class="item" effect="zhuce" placement="right">
                    <div slot="content">只针对HMA。</div>
                    <i
                      class="el-icon-question cl-green"
                      style="margin-left: 4px"
                    ></i>
                  </el-tooltip>
                </li>
                <li class="li2">
                  总计<span>{{ basic.zwformCount }}</span
                  >个
                </li>
              </ul>
              <ul class="total-item">
                <li class="li1">持有人</li>
                <li class="li2">
                  总计<span>{{ basic.holderCount }}</span
                  >个
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="back-list">
        <span @click="goBack">返回列表</span>
      </div>
      <div class="chart_bottom">
        <div class="chart-boxes">
          <DbEcharts
            :title="item.title"
            v-for="(item, i) in chartsArr"
            :key="item.title"
            :statement="item.statement"
          >
            <div class="echarts">
              <div class="chart-tab" v-if="item.title === '品种排行'">
                <div
                  :class="['btn', pzChart === 1 ? 'active' : '']"
                  @click="switchPzChart(1)"
                >
                  全部
                </div>
                <div
                  :class="['btn', pzChart === 2 ? 'active' : '']"
                  @click="switchPzChart(2)"
                >
                  EMA
                </div>
                <div
                  :class="['btn', pzChart === 3 ? 'active' : '']"
                  @click="switchPzChart(3)"
                >
                  HMA
                </div>
              </div>

              <div class="chart-tab" v-if="item.title === '机构排行'">
                <div
                  :class="['btn', jgChart === 1 ? 'active' : '']"
                  @click="switchJgChart(1)"
                >
                  全部
                </div>
                <div
                  :class="['btn', jgChart === 2 ? 'active' : '']"
                  @click="switchJgChart(2)"
                >
                  EMA
                </div>
                <div
                  :class="['btn', jgChart === 3 ? 'active' : '']"
                  @click="switchJgChart(3)"
                >
                  HMA
                </div>
              </div>

              <my-chart
                @openDialog="handleDialogVisible"
                :type="item.type"
                :title="item.title"
                :eIndex="i"
                v-show="getShow(i)"
                ref="charts"
                :mapCheckLock="mapCheckLock"
                @changeMapType="changeMapType"
                :mapType="mapType"
                :isOpen="dialogVisible"
                :seriesData="item.data.seriesData"
                :seriesDataMap="
                  item.data.seriesDataMap ? item.data.seriesDataMap : []
                "
                :yAxisData="item.data.yAxisData ? item.data.yAxisData : []"
                :loading="item.data.loading ? item.data.loading : false"
              >
              </my-chart>

              <!-- 品种排行Ema -->
              <my-chart
                @openDialog="handleDialogVisible"
                :isOpen="dialogVisible"
                :type="pzEmaCount.type"
                ref="charts"
                :eIndex="0"
                :title="pzHmaCount.title"
                :seriesData="pzEmaCount.seriesData"
                :yAxisData="pzEmaCount.yAxisData"
                v-show="i === 0 && pzChart === 2"
                :loading="pzEmaCount.loading"
              >
              </my-chart>

              <!-- 品种排行Hma -->
              <my-chart
                @openDialog="handleDialogVisible"
                :isOpen="dialogVisible"
                :type="pzHmaCount.type"
                :title="pzHmaCount.title"
                :eIndex="0"
                ref="charts"
                :seriesData="pzHmaCount.seriesData"
                :yAxisData="pzHmaCount.yAxisData"
                v-show="i === 0 && pzChart === 3"
                :loading="pzHmaCount.loading"
              >
              </my-chart>

              <!-- 机构排行Ema -->
              <my-chart
                @openDialog="handleDialogVisible"
                :isOpen="dialogVisible"
                :type="jgEmaCount.type"
                :title="jgHmaCount.title"
                :eIndex="1"
                ref="charts"
                :seriesData="jgEmaCount.seriesData"
                :yAxisData="jgEmaCount.yAxisData"
                v-show="i === 1 && jgChart === 2"
                :loading="jgEmaCount.loading"
              >
              </my-chart>

              <!-- 机构排行Hma -->
              <my-chart
                @openDialog="handleDialogVisible"
                :isOpen="dialogVisible"
                :type="jgHmaCount.type"
                :title="jgHmaCount.title"
                :eIndex="1"
                ref="charts"
                :seriesData="jgHmaCount.seriesData"
                :yAxisData="jgHmaCount.yAxisData"
                v-show="i === 1 && jgChart === 3"
                :loading="jgHmaCount.loading"
              >
              </my-chart>
            </div>
          </DbEcharts>
        </div>
      </div>
      <!-- 展开效果 -->
      <div class="dialog" v-if="dialogVisible">
        <div class="menu">
          <div
            v-for="(ti, index) in chartsArr"
            v-bind:class="[index == openIndex ? 'active' : '', 'nav']"
            @click="handleOpenIndex(index)"
            :key="index"
          >
            {{ ti.title }}
          </div>
        </div>
        <div class="echarts-items-wap">
          <div class="echarts-items-title">
            <span class="echart-title"
              >{{ chartsArr[openIndex].title }}
              <el-tooltip
                v-if="chartsArr[openIndex].statement"
                class=""
                effect="zhuce"
                placement="right"
              >
                <div
                  slot="content"
                  v-html="chartsArr[openIndex].statement"
                ></div>
                <i
                  class="el-icon-question cl-green"
                  style="margin-left: 4px; line-height: 28px"
                ></i>
              </el-tooltip>
            </span>
            <a class="esc-btn" href="javascript:;" @click="closeOpen"
              ><i></i
              ><img
                src="/static/imgs/echarts/esc-fullscreen.png"
                alt="退出全屏"
            /></a>
          </div>
          <div class="echarts-items">
            <!-- 申报趋势 -->
            <div
              class="echarts-item"
              v-for="(item, i) in chartsArr"
              :key="item.title"
            >
              <!-- 折线图 -->
              <div class="open-charts">
                <div class="chart-tab" v-if="item.title === '品种排行'">
                  <div
                    :class="['btn', pzChart === 1 ? 'active' : '']"
                    @click="switchPzChart(1)"
                  >
                    全部
                  </div>
                  <div
                    :class="['btn', pzChart === 2 ? 'active' : '']"
                    @click="switchPzChart(2)"
                  >
                    EMA
                  </div>
                  <div
                    :class="['btn', pzChart === 3 ? 'active' : '']"
                    @click="switchPzChart(3)"
                  >
                    HMA
                  </div>
                </div>

                <div class="chart-tab" v-if="item.title === '机构排行'">
                  <div
                    :class="['btn', jgChart === 1 ? 'active' : '']"
                    @click="switchJgChart(1)"
                  >
                    全部
                  </div>
                  <div
                    :class="['btn', jgChart === 2 ? 'active' : '']"
                    @click="switchJgChart(2)"
                  >
                    EMA
                  </div>
                  <div
                    :class="['btn', jgChart === 3 ? 'active' : '']"
                    @click="switchJgChart(3)"
                  >
                    HMA
                  </div>
                </div>
                <my-chart
                  @openDialog="handleDialogVisible"
                  v-show="getShow(i)"
                  ref="myChart"
                  :title="item.title"
                  :type="item.type"
                  :mapCheckLock="mapCheckLock"
                  :mapType="mapType"
                  @changeMapType="changeMapType"
                  :seriesData="item.data.seriesData"
                  :isOpen="dialogVisible"
                  :seriesDataMap="
                    item.data.seriesDataMap ? item.data.seriesDataMap : []
                  "
                  :yAxisData="item.data.yAxisData ? item.data.yAxisData : []"
                  :loading="item.data.loading ? item.data.loading : false"
                >
                </my-chart>

                <!-- 品种排行Ema -->
                <my-chart
                  @openDialog="handleDialogVisible"
                  ref="myChart"
                  :isOpen="dialogVisible"
                  :type="pzEmaCount.type"
                  :title="pzEmaCount.title"
                  :seriesData="pzEmaCount.seriesData"
                  :yAxisData="pzEmaCount.yAxisData"
                  v-show="i === 0 && pzChart === 2"
                  :loading="pzEmaCount.loading"
                >
                </my-chart>

                <!-- 品种排行Hma -->
                <my-chart
                  ref="myChart"
                  @openDialog="handleDialogVisible"
                  :isOpen="dialogVisible"
                  :type="pzHmaCount.type"
                  :title="pzEmaCount.title"
                  :seriesData="pzHmaCount.seriesData"
                  :yAxisData="pzHmaCount.yAxisData"
                  v-show="i === 0 && pzChart === 3"
                  :loading="pzHmaCount.loading"
                >
                </my-chart>

                <!-- 机构排行Ema -->
                <my-chart
                  ref="myChart"
                  @openDialog="handleDialogVisible"
                  :isOpen="dialogVisible"
                  :type="jgEmaCount.type"
                  :title="jgEmaCount.title"
                  :seriesData="jgEmaCount.seriesData"
                  :yAxisData="jgEmaCount.yAxisData"
                  v-show="i === 1 && jgChart === 2"
                  :loading="jgEmaCount.loading"
                >
                </my-chart>

                <!-- 机构排行Hma -->
                <my-chart
                  ref="myChart"
                  @openDialog="handleDialogVisible"
                  :title="jgHmaCount.title"
                  :isOpen="dialogVisible"
                  :type="jgHmaCount.type"
                  :seriesData="jgHmaCount.seriesData"
                  :yAxisData="jgHmaCount.yAxisData"
                  v-show="i === 1 && jgChart === 3"
                  :loading="jgHmaCount.loading"
                >
                </my-chart>
              </div>
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
            <div class="nodata-box"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import DbEcharts from "@/components/common/db-echarts";
import MyChart from "./components/myChart";
import { mapState, mapGetters } from "vuex";

const types = [
  "cnameCount",
  "changshangCount",
  "dateCount",
  "formCount",
  "atcCount",
];

export default {
  components: {
    DbEcharts,
    MyChart,
    LoadingGif,
  },
  data() {
    return {
      pzChart: 1, // 品种排行激活的tab
      jgChart: 1, // 机构排行激活的tab
      itemWidth: 700,
      mapType: "world",
      promise: null,
      loading: true,
      dialogVisible: false,
      back: "",
      initopen: false, //控制渲染一次
      openIndex: 0, //控制展开第几个图形
      basic: {
        BaseCount: "",
        NameCount: "",
        zwformCount: "",
        holderCount: "",
      },
      changshangCount: {
        // 机构排行
        yAxisData: [],
        seriesData: [],
        loading: false,
      },
      dateCount: {
        // 上市趋势
        yAxisData: [],
        seriesData: [],
        loading: false,
      },
      cnameCount: {
        // 品种排行
        yAxisData: [],
        seriesData: [],
        loading: false,
      },
      formCount: {
        // 剂型排行
        yAxisData: [],
        seriesData: [],
        seriesDataMap: [],
        loading: false,
      },
      atcCount: {
        // atc
        yAxisData: [],
        seriesData: [],
        seriesDataMap: [],
        loading: false,
      },

      pzEmaCount: {
        // 品种排行Ema
        yAxisData: [],
        seriesData: [],
        type: "bar",
        loading: false,
        title: "品种排行(EMA)",
      },
      pzHmaCount: {
        // 品种排行Hma
        yAxisData: [],
        seriesData: [],
        type: "bar",
        loading: false,
        title: "品种排行(HMA)",
      },

      jgEmaCount: {
        // 机构排行Ema
        yAxisData: [],
        seriesData: [],
        type: "bar",
        loading: false,
        title: "机构排行(EMA)",
      },
      jgHmaCount: {
        // 机构排行Hma
        yAxisData: [],
        seriesData: [],
        type: "bar",
        loading: false,
        title: "机构排行(HMA)",
      },
      mapCheckLock: false,
    };
  },
  computed: {
    ...mapState({
      kshRes: (state) => state.Epyp.kshRes,
      nopms: (state) => state.Epyp.nopms,
      analyLoading: (state) => state.Epyp.analyLoading,
      analyCount: (state) => state.Epyp.analyCount,
      allBase: (state) => state.Epyp.allBase,
      activeTabName: (state) => state.Epyp.tabname,
      res1: (state) => state.Epyp.res1,
      res2: (state) => state.Epyp.res2,
      res3: (state) => state.Epyp.res3,
    }),
    noData() {
      return !this.res1.res && !this.res2.res && !this.res3.res;
    },
    chartsArr() {
      return [
        {
          title: "品种排行",
          type: "bar",
          data: this.cnameCount,
        },
        {
          title: "机构排行",
          type: "bar",
          data: this.changshangCount,
        },
        {
          title: "上市趋势",
          type: "line",
          data: this.dateCount,
          statement: "可以使用鼠标滚轮调整上市趋势的区间，放大、缩小等等。",
        },
        {
          title: "剂型占比",
          type: "pie",
          data: this.formCount,
          statement: "剂型占比只针对HMA。",
        },
        {
          title: "ATC分类",
          type: "pie",
          data: this.atcCount,
        },
      ];
    },
  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {
        this.$nextTick(() => {
          this.initLayout();
          this.$refs.myChart.forEach((item) => {
            item.myChart && item.myChart.resize();
          });
        });
      }
    },
    $route: {
      handler(val) {
        if (val.path === "/epyp/analy" && this.kshRes) {
          this.getAllKshRes();
          this.$store.commit("Epyp/kshRes", false);
        }
        if (this.$route.path === "/epyp/analy") {
          window.addEventListener("resize", this.echartsResizeHandler);
        } else {
          window.removeEventListener("resize", this.echartsResizeHandler);
        }
        if (this.$route.path === "/epyp/list") {
          //智能分析重新搜索清空列表数据tab无法自动复位
          let tabname = this.activeTabName;
          Store.commit("Epyp/tabname", "");
          Store.commit("Epyp/tabname", tabname);
          this.noData &&
            Store.dispatch("Epyp/nomalSearch", {
              queryToPutong: false,
              tabs: true,
            });
        }
      },
      deep: true,
    },
    kshRes: {
      handler(val) {
        if (val && this.$route.path === "/epyp/analy") {
          this.getAllKshRes();
          this.$store.commit("Epyp/kshRes", false);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 关闭全屏展示
    closeOpen() {
      this.dialogVisible = false;
      this.pzChart = 1;
      this.jgChart = 1;
    },
    // 品种排行切换
    switchPzChart(val) {
      this.pzChart = val;
      // 1 为全部 所以不请求接口
      if (this.pzChart === 1) return;
      if (this.pzChart === 2) {
        // 如果已经有数据就停止请求
        // if (this.pzEmaCount.seriesData.length > 0) return;
        this.pzEmaCount.loading = true;
      } else {
        // 如果已经有数据就停止请求
        // if (this.pzHmaCount.seriesData.length > 0) return;
        this.pzHmaCount.loading = true;
      }

      this.$store
        .dispatch("Epyp/getKshResMethods", {
          count_type: "cnameCount",
          source: this.pzChart === 2 ? 1 : 2, // EMA:1,HMA，2
        })
        .then((res) => {
          console.log(res);
          // EMA赋值
          if (this.pzChart === 2) {
            this.pzEmaCount.loading = false;
            this.pzEmaCount.seriesData = this.getBarData(
              res ? res : [],
              "ylbm",
              "counts"
            ).seriesData;
            this.pzEmaCount.yAxisData = this.getBarData(
              res ? res : [],
              "ylbm",
              "counts"
            ).yAxisData;
          } else if (this.pzChart === 3) {
            // Hma赋值
            this.pzHmaCount.loading = false;
            this.pzHmaCount.seriesData = this.getBarData(
              res ? res : [],
              "ylbm",
              "counts"
            ).seriesData;
            this.pzHmaCount.yAxisData = this.getBarData(
              res ? res : [],
              "ylbm",
              "counts"
            ).yAxisData;
          }
        });
    },

    // 机构排行切换
    switchJgChart(val) {
      this.jgChart = val;
      // 1 为全部 所以不请求接口
      console.log(this.$refs.charts[0]);
      this.$refs.charts[0].echartsResizeHandler()
      if (this.jgChart === 1) return;
      if (this.jgChart === 2) {
        // 如果已经有数据就停止请求
        // if (this.jgEmaCount.seriesData.length > 0) return;
        this.jgEmaCount.loading = true;
      } else {
        // 如果已经有数据就停止请求
        // if (this.jgHmaCount.seriesData.length > 0) return;
        this.jgHmaCount.loading = true;
      }

      this.$store
        .dispatch("Epyp/getKshResMethods", {
          count_type: "changshangCount",
          source: this.jgChart === 2 ? 1 : 2, // EMA:1,HMA，2
        })
        .then((res) => {
          console.log(res);
          // EMA赋值
          if (this.jgChart === 2) {
            this.jgEmaCount.loading = false;
            this.jgEmaCount.seriesData = this.getBarData(
              res ? res : [],
              "changshang",
              "counts"
            ).seriesData;
            this.jgEmaCount.yAxisData = this.getBarData(
              res ? res : [],
              "changshang",
              "counts"
            ).yAxisData;
          } else if (this.jgChart === 3) {
            // Hma赋值
            this.jgHmaCount.loading = false;
            this.jgHmaCount.seriesData = this.getBarData(
              res ? res : [],
              "changshang",
              "counts"
            ).seriesData;
            this.jgHmaCount.yAxisData = this.getBarData(
              res ? res : [],
              "changshang",
              "counts"
            ).yAxisData;
          }
        });
    },

    // 返回图表显示哪个
    getShow(i) {
      if (i === 0) {
        return this.pzChart === 1 ? true : false;
      } else if (i === 1) {
        return this.jgChart === 1 ? true : false;
      } else {
        return true;
      }
    },

    goBack() {
      this.$router.push({ path: "/epyp/list" });
    },
    initLayout() {
      let screen_width = window.innerWidth;
      let screen_height = window.innerHeight;
      this.itemWidth = screen_width - 244;
      $(".dialog .echarts-items-wap").css("height", screen_height - 50);
      $(".dialog .echarts-items-wap").css("width", screen_width - 244);
      $(".dialog .echarts-items").width((this.itemWidth + 12) * 10);
      $(".dialog .echarts-item").width(this.itemWidth - 100);
      $(".echarts-items").css("margin-left", -this.openIndex * this.itemWidth);
    },
    handleOpenIndex(index) {
      if (index > 0 && index < this.chartsArr.length) {
        this.openIndex = index;
      } else {
        this.openIndex = 0;
      }
      $(".echarts-items").css("margin-left", -this.openIndex * this.itemWidth);
    },
    getAllKshRes() {
      this.$store.dispatch("Epyp/getKshResMethods").then((res) => {
        this.basic = res.ExtendCount;
        this.getKsh(0);
      });
    },
    getKsh(i) {
      const count_type = types[i];
      this[count_type].loading = true;
      this.$store
        .dispatch("Epyp/getKshResMethods", { count_type })
        .then((res) => {
          console.log(res);
          this[count_type].loading = false;
          if (i !== types.length - 1) {
            this.getKsh(i + 1);
          }
          if (count_type === "dateCount") {
            this[count_type] = this.getLineData(res ? res : []);
          } else if (count_type === "cnameCount") {
            // 重置数据
            this.pzChart = 1;
            this.pzEmaCount = {
              yAxisData: [],
              seriesData: [],
              type: "bar",
              loading: false,
              title: "品种排行(EMA)",
            };
            this.pzHmaCount = {
              yAxisData: [],
              seriesData: [],
              type: "bar",
              loading: false,
              title: "品种排行(HMA)",
            };
            this[count_type] = this.getBarData(
              res ? res : [],
              "ylbm",
              "counts"
            );
          } else if (count_type === "changshangCount") {
            // 重置数据
            this.jgChart = 1;
            this.jgEmaCount = {
              yAxisData: [],
              seriesData: [],
              type: "bar",
              loading: false,
              title: "机构排行(EMA)",
            };
            this.jgHmaCount = {
              yAxisData: [],
              seriesData: [],
              type: "bar",
              loading: false,
              title: "机构排行(HMA)",
            };
            this[count_type] = this.getBarData(
              res ? res : [],
              "changshang",
              "counts"
            );
          } else {
            let set = {};
            switch (count_type) {
              case "atcCount":
                set = ["key", "doc_count"];
                break;
              case "formCount":
                set = ["zwform2", "counts"];
                break;
            }

            this[count_type] = this.getPieData(res, set[0], set[1]);
          }
        });
    },
    changeMapType(val) {
      this.mapType = val;
    },
    getLineData(data) {
      // console.log(data);

      let yAxisData = [];
      let seriesData = [];
      if (!data.length) {
        return {
          seriesData,
          yAxisData,
        };
      }
      let aLength = [];
      data.forEach((item, index) => {
        console.log(item);
        aLength.push(item.data.length);
        let seriesObj = {
          name: "",
          type: "line",
          connectNulls: true,
          data: [],
        };
        seriesObj.name = item.name;
        item.data.map((v) => {
          seriesObj.data.push(v.doc_count);
        });

        seriesData.push(seriesObj);
      });
      let maxN = Math.max.apply(null, aLength);

      data[aLength.indexOf(maxN)].data.forEach((item) => {
        yAxisData.push(item.year);
      });
      console.log(seriesData);
      return {
        seriesData,
        yAxisData,
      };
    },
    handleDialogVisible(index) {
      this.dialogVisible = true;
      this.openIndex = index;
      this.jgChart = 1;
      this.pzChart = 1;
    },
    getBarData(data, key, value) {
      data.sort((a, b) => {
        return a[value] - b[value];
      });
      let seriesData = [];
      let yAxisData = [];
      data.forEach((item) => {
        seriesData.push(item[value]);
        yAxisData.push(item[key]);
      });
      return {
        seriesData,
        yAxisData,
      };
    },
    getPieData(data, key, value) {
      data = data ? data : [];
      data.sort((a, b) => {
        return a[value] - b[value];
      });
      let seriesData = [];
      let yAxisData = [];
      let seriesDataMap = data.map((item) => {
        seriesData.push(item[value]);
        yAxisData.push(item[key]);
        item.value = item[value];
        item.name = item[key];
        return item;
      });
      // console.log(seriesData,
      //   yAxisData,
      //   seriesDataMap);
      return {
        seriesData,
        yAxisData,
        seriesDataMap,
      };
    },
  },
  created() {
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.visualization);
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.visualization);
    this.vueTogglePmsTooltip();
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.pc-epyp-analy {
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
            .total-item {
              flex: 1;
            }
          }
        }
        .newtotals-arrow {
          display: none;
          height: 170px;
          line-height: 170px;
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
          width: 150px;
          height: 130px;
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
    }
    .chart-boxes {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .echarts {
      box-sizing: border-box;
      display: inline-block;
      margin: 50px 10px 20px 10px;
      width: calc(100% - 20px);
      height: 400px;
    }

    .chart-tab {
      display: flex;

      .btn {
        margin-right: 10px;
        width: 56px;
        height: 22px;
        border-radius: 4px;
        border: 1px solid #4877e8;
        font-size: 13px;
        font-weight: 400;
        color: #4877e8;
        line-height: 22px;
        cursor: pointer;
        text-align: center;
        box-sizing: border-box;
      }

      .active {
        height: 22px;
        border: 0;
        color: #ffffff;
        background: #4877e8;
        transition: all 0.3s ease-in-out;
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
          overflow-y: scroll;
          overflow-x: hidden;
          .echarts-item {
            display: inline-block;
            margin: 0px 50px;
            width: 1300px;
            height: 100%;
          }
          .open-charts {
            margin-top: 10px;
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
      padding: 0;
    }
    .back-list {
      width: 100%;
      text-align: right;
      background: #eff2fa;
      box-sizing: border-box;
      font-size: 14px;
      padding: 8px 0 0 10px;

      span {
        width: 86px;
        height: 24px;
        background: #f4a622;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        line-height: 14px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }
}
</style>
