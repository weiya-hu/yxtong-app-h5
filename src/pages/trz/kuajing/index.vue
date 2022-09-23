<template>
  <div class="trz-kuajing">
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
            vuex_name="TrzKuajing"
            api_name="TrzKuajing"
            :item="item"
            :key="index"
            ref="ileft"
          ></Normal>
        </template>

        <!-- 条件筛选 -->
        <Filters vuex_name="TrzKuajing" ref="kuajingFilter"></Filters>

        <!-- 搜索按钮 -->
        <el-button
          class="kuajing-search-btn"
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
            <h4 class="part-title">医药交易</h4>
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
                <div class="chart-tips">近一年交易趋势(数量)</div>
              </div>
              <div class="line"></div>

              <div class="chart3">
                <div id="chart3" class="chart3">
                  <NoData
                    class="no-chart"
                    v-if="cooperateList.length === 0"
                  ></NoData>
                </div>
                <div class="chart-tips">近一年项目合作类型占比</div>
              </div>
              <div class="line"></div>
              <div class="chart2">
                <div id="chart2" class="chart2">
                  <NoData
                    class="no-chart"
                    v-if="therapeuticareaList.length === 0"
                  ></NoData>
                </div>
                <div class="chart-tips">近一年项目疾病领域排行</div>
              </div>
            </div>
          </section>

          <section class="part-section">
            <div class="sider-title">
              <div class="sider-left">
                <img
                  src="@/assets/imgs/list.png"
                  style="width: 14px; height: 12px"
                  alt
                />
                <span class="bold">项目列表</span>
                <span style="margin-left: 20px; font-size: 13px"
                  >默认排序：</span
                >
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
                    value="guifan_totalamount desc"
                  ></el-option>
                  <el-option
                    label="产品进度最快靠前"
                    value="jieduanshuzi desc,time asc"
                  ></el-option>
                </el-select>
              </div>

              <div class="switch-view" @click="isShowView = !isShowView">
                切换视图
              </div>
            </div>

            <!-- 已选条件 -->
            <Optioned vuex_name="TrzKuajing"></Optioned>

            <div
              class="kuajing-list"
              :style="{ 'min-height': kuajingMinHeight }"
              v-if="res.length > 0"
            >
              <template v-if="isShowView">
                <KuajingItem
                  v-for="(item, index) in res"
                  :key="index + item.item"
                  :item="item"
                />
              </template>
              <template v-else>
                <div style="padding: 12px 20px">
                  <el-table
                    :data="res"
                    border
                    stripe
                    :header-cell-style="{
                      background: '#DAE0E9',
                      borderColor: '#DAE0E9',
                    }"
                  >
                    <el-table-column
                      v-for="(item, i) in tableHead"
                      :prop="item.prop"
                      :key="i + '_index'"
                      :min-width="item.width"
                      :label="item.label"
                    >
                      <template slot-scope="scope">
                        <!-- 项目类型 -->
                        <template v-if="item.prop === 'type_item'">
                          <div>{{ scope.row.type_item }}</div>
                          <span class="trz-tag" v-if="scope.row.type">{{
                            scope.row.type
                          }}</span>
                        </template>

                        <!-- 项目名称 -->
                        <template v-else-if="item.prop === 'guifan_item'">
                          <div>
                            <router-link
                              style="color: #09144f;"
                              :to="`/trz/kuajing/${scope.row.data_id}`"
                              target="_blank"
                              class="title text2line"
                              :title="
                                scope.row.guifan_item
                                  ? scope.row.guifan_item
                                  : scope.row.item
                              "
                              >{{
                                scope.row.guifan_item
                                  ? scope.row.guifan_item
                                  : scope.row.item
                              }}
                            </router-link>

                            <div>
                              <span
                                class="trz-tag"
                                style="cursor: pointer;"
                                :title="
                                  '药品:' + scope.row.guifanname ||
                                  scope.row.brandname ||
                                  scope.row.brandname_en
                                "
                                @click="
                                  goComprehensiveSearch(
                                    scope.row.guifanname ||
                                      scope.row.brandname ||
                                      scope.row.brandname_en,
                                    'drug'
                                  )
                                "
                                v-if="
                                  scope.row.guifanname ||
                                  scope.row.brandname ||
                                  scope.row.brandname_en
                                "
                                >药品:{{
                                  scope.row.guifanname ||
                                  scope.row.brandname ||
                                  scope.row.brandname_en
                                }}</span
                              >
                              <span
                                class="trz-tag"
                                style="cursor: pointer;"
                                :title="
                                  '靶点:' + (scope.row.targets_abbr ||
                                  scope.row.targets)
                                "
                                @click="
                                  goComprehensiveSearch(
                                    scope.row.targets_abbr || scope.row.targets,
                                    'targets'
                                  )
                                "
                                v-if="
                                  scope.row.targets_abbr || scope.row.targets
                                "
                                >靶点:{{
                                  scope.row.targets_abbr || scope.row.targets
                                }}</span
                              >
                            </div>
                          </div>
                          <!-- <span class="trz-tag" v-if="scope.row.type">{{scope.row.type}}</span> -->
                        </template>

                        <!-- 买方合作方 -->
                        <template v-else-if="item.prop === 'buyer'">
                          <div class="text2line">
                            <span
                              v-for="touzifang in scope.row.buyerArr"
                              :key="touzifang.name"
                              class="touzifang-item"
                              :title="touzifang.name"
                              :class="{
                                'no-click':
                                  !touzifang.jgWyuid && !touzifang.gsWyuid,
                              }"
                              @click="toDetail(touzifang)"
                              >{{ touzifang.name }}</span
                            >
                          </div>

                          <p style="color: #3556b9; margin-top: 5px;font-size: 12px;">
                            <span>
                              {{ scope.row.buyer_address.country }}
                            </span>
                            <span v-if="scope.row.buyer_address.province">
                              -{{ scope.row.buyer_address.province }}
                            </span>
                            <span v-if="scope.row.buyer_address.city">
                              -{{ scope.row.buyer_address.city }}
                            </span>
                          </p>
                        </template>

                        <!-- 买方合作方 -->
                        <template v-else-if="item.prop === 'transferor'">
                          <div class="text2line">
                            <span
                              v-for="touzifang in scope.row.transferorArr"
                              :key="touzifang.name"
                              class="touzifang-item"
                              :title="touzifang.name"
                              :class="{
                                'no-click':
                                  !touzifang.jgWyuid && !touzifang.gsWyuid,
                              }"
                              @click="toDetail(touzifang)"
                              >{{ touzifang.name }}</span
                            >
                          </div>
                          <p style="color: #3556b9; margin-top: 5px;font-size: 12px;">
                            <span>
                              {{ scope.row.transferor_address.country }}
                            </span>
                            <span v-if="scope.row.transferor_address.province">
                              -{{ scope.row.transferor_address.province }}
                            </span>
                            <span v-if="scope.row.transferor_address.city">
                              -{{ scope.row.transferor_address.city }}
                            </span>
                          </p>
                        </template>

                        <!-- 治疗领域 -->
                        <template
                          v-else-if="item.prop === 'guifan_therapeuticarea'"
                        >
                          <div v-if="scope.row.therapeuticarea.length>0">
                            {{
                              scope.row.therapeuticarea.join(',')
                            }}
                          </div>
                        </template>

                        <!-- 合作类型 -->
                        <template
                          v-else-if="item.prop === 'guifan_cooperationtype'"
                        >
                          <div>
                            {{scope.row.guifan_cooperationtype}}
                          </div>
                          <p class="hzlx text2line" :title="'权益类型:' + scope.row.guifan_quanyileixing" v-if="scope.row.guifan_quanyileixing">权益类型:{{scope.row.guifan_quanyileixing}}</p>
                        </template>

                        <div v-else :title="scope.row[item.prop]">
                          {{ scope.row[item.prop] }}
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </div>
            <NoData
              class="kuajing-list"
              v-else
              :style="{ 'min-height': kuajingMinHeight }"
            ></NoData>
            <div class="kuajing-paganation">
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
    </Main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTrz from "@/components/layouts/trz/header";
import Main from "@/components/layouts/main";
import KuajingItem from "./comp/kuajing-item";
import Normal from "@/components/common/trz/normal";
import Filters from "@/components/common/trz/filters";
import Optioned from "@/components/common/trz/options";
import NoData from "@/components/common/trz/noData";
import LoadingGif from "@/components/common/globalCom/loading-gif";
export default {
  components: {
    HeaderTrz,
    Main,
    KuajingItem,
    Normal,
    Filters,
    Optioned,
    NoData,
    LoadingGif,
  },
  data() {
    return {
      kuajingMinHeight: "calc(100vh - 520px)",
      bgslList: [],
      therapeuticareaList: [],
      cooperateList: [],
      helpUrl: {},
      isShowView: false, // false表格显示，true原列表展示
      tableHead: [
        {
          prop: "time",
          label: "时间",
          width: 100, //最少宽度
        },
        {
          prop: "dealstage",
          label: "项目阶段",
          width: 90, //最少宽度
        },
        {
          prop: "type_item",
          label: "项目类型",
          width: 90, //最少宽度
        },
        {
          prop: "guifan_item",
          label: "项目名称",
          width: 300, //最少宽度
        },
        {
          prop: "buyer",
          label: "买方/合作方",
          width: 200, //最少宽度
        },
        {
          prop: "transferor",
          label: "卖方/合作方",
          width: 200, //最少宽度
        },
        {
          prop: "guifan_therapeuticarea",
          label: "治疗领域/应用场景",
          width: 150, //最少宽度
        },
        {
          prop: "guifan_cooperationtype",
          label: "合作类型",
          width: 120, //最少宽度
        },
        {
          prop: "guifan_totalamount",
          label: "总金额",
          width: 120, //最少宽度
        },
        {
          prop: "guifan_downpayment",
          label: "首付款",
          width: 120, //最少宽度
        },
      ],
    };
  },
  computed: {
    ...mapState({
      nomal_filed: (state) => state.TrzKuajing.nomal_filed,
      putong: (state) => state.TrzKuajing.putong,
      shaixuan: (state) => state.TrzKuajing.shaixuan,
      res: (state) =>
        _.keys(state.TrzKuajing.res).length ? state.TrzKuajing.res : [],
      extendCount: (state) => state.TrzKuajing.extendCount,
      param: (state) => state.TrzKuajing.param, // 附加参数(存于vuex内)
      listLoading: (state) => state.TrzKuajing.listLoading,
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
            this.kuajingMinHeight = h2;
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
            this.kuajingMinHeight = h2;
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
            this.kuajingMinHeight = h2;
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
    this.vueRouteFromTrz("TrzKuajing");
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
    // 链接到企业版综合搜索页
    goComprehensiveSearch(searchwords, comprehensive) {
      const routeData = this.$router.resolve({
        path: "/search",
        query: {
          comprehensive: comprehensive,
          searchwords: searchwords,
          source: 1,
        },
      });
      window.open(routeData.href, "_blank");
    },
    toDetail(val) {
      let path = "";
      console.log(val);
      if (!val.gsWyuid && !val.jgWyuid) return false;
      // 如果gsWyuid存在跳转到企业详情
      if (val.gsWyuid) path = `/trz/qiye/${val.gsWyuid}`;

      // 如果jgWyuid存在跳转到企业详情
      if (val.jgWyuid) path = `/trz/jigou/${val.jgWyuid}`;
      const { href } = this.$router.resolve({
        path: path,
      });
      window.open(href, "_blank");
    },
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
    // 近一年交易趋势
    async handlerChart1() {
      await window
        .Axios({
          method: "get",
          url: "/api/kuajing/countAggs",
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
    // 近一年项目疾病领域排行
    async handlerChart2() {
      await window
        .Axios({
          method: "get",
          url: "/api/kuajing/therapeuticareaaggs",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.therapeuticareaList = res.data.data.res;
            console.log(res.data.data.res);
            let data = _.orderBy(res.data.data.res, ["doc_count"], ["asc"]),
              that = this,
              yAxis = data.map((item) => item.label),
              series = data.map((item) => item.doc_count),
              startValue = data.length - 10,
              endValue = data.length - 1,
              option = {
                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "shadow",
                  },
                },
                grid: {
                  top: 10,
                  left: 20,
                  right: 40,
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
                dataZoom: [
                  {
                    show: data.length > 10,
                    startValue,
                    endValue,
                    handleIcon:
                      "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                    handleSize: "80%",
                    yAxisIndex: 0,
                    filterMode: "empty",
                    width: 20,
                    height: "80%",
                    showDataShadow: false,
                    right: 10,
                    handleStyle: {
                      color: "#fff",
                      shadowBlur: 3,
                      shadowColor: "rgba(0, 0, 0, 0.6)",
                      shadowOffsetX: 2,
                      shadowOffsetY: 2,
                    },
                  },
                ],
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
                    formatter(params) {
                      return params ? that.labelLenLimit(params) : "";
                    },
                  },
                },
                barMaxWidth: 80,
                series: [
                  {
                    type: "bar",
                    data: series,
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
    // 近一年合作类型占比
    async handlerChart3() {
      await window
        .Axios({
          method: "get",
          url: "/api/kuajing/cooperationtypeaggs",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.cooperateList = res.data.data.res;
            let data = res.data.data.res,
              legend = data.map((item) => item.label),
              series = [];
            data.length > 0 &&
              data.forEach((item) => {
                series.push({
                  name: item.label,
                  value: item.doc_count,
                });
              });
            let option = {
              tooltip: {
                trigger: "item",
              },
              legend: {
                type: "scroll",
                left: "20",
                top: "bottom",
                right: "20",
                icon: "circle", //  这个字段控制形状  类型包括 circle 圆形，triangle 三角形，diamond 四边形，arrow 变异三角形，none 无
                itemWidth: 9, // 设置宽度
                itemHeight: 9, // 设置高度
                data: legend,
              },
              series: [
                {
                  type: "pie",
                  radius: ["40%", "70%"],
                  center: ["50%", "50%"],
                  avoidLabelOverlap: false,
                  label: {
                    normal: {
                      show: false,
                      position: "outside",
                      formatter: "{b} {d}%",
                    },
                    emphasis: {
                      show: true,
                      formatter: "{d}%",
                      align: "center",
                      textStyle: {
                        fontSize: "15",
                        fontWeight: "bold",
                      },
                    },
                  },
                  data: series,
                  labelLine: {
                    normal: {
                      show: false,
                    },
                  },
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
      this.$refs.kuajingFilter.searchFilter();
      Store.dispatch("TrzKuajing/nomalSearch");
    },
    handleCurrentChange(val) {
      this.param.page = val;
      Store.dispatch("TrzKuajing/nomalSearch", { params: this.param });
    },
    // 修改排序参数
    selectChange(val) {
      this.param.order = val;
      Store.dispatch("TrzKuajing/nomalSearch", { params: this.param });
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
.trz-kuajing {
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
  justify-content: space-between;
  align-items: center;

  .sider-left {
    display: flex;
    align-items: center;
  }

  .switch-view {
    width: 110px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #3556b9;
    color: #3556b9;
    font-size: 14px;
    cursor: pointer;
  }

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

  .trz-tag {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    color: #3556b9;
    font-size: 12px;
    font-weight: 500;
    box-sizing: border-box;
    margin-top: 5px;
  }

  .title {
    &:hover {
      text-decoration: none;
      color: #e7af2f !important;
    }
  }

  .touzifang-item {
    margin-right: 10px;
    color: #09144f;
    cursor: pointer;
    &:hover {
      text-decoration: none;
      color: #e7af2f;
    }
  }

  .no-click {
    cursor: unset;
    &:hover {
      color: #09144f;
    }
  }

  /deep/.el-table tbody td > .cell {
    padding: 8px 14px;
  }

  /deep/ .el-table td .cell {
    overflow: unset;
    text-overflow: unset;
    display: block;
    -webkit-line-clamp: unset;
    -webkit-box-orient: unset;
  }
  /deep/ .el-table td .cell > div {
    overflow: unset;
    text-overflow: unset;
    display: block;
    -webkit-line-clamp: unset;
    -webkit-box-orient: unset;
    max-height: unset;
  }

  /deep/ .el-table {
    color: #333;
  }

  /deep/ .el-table thead {
    color: #666;
  }

  /deep/ .el-table thead th > .cell {
    height: 34px;
    line-height: 34px
  }

  /deep/ .el-table__row,
  /deep/ .el-table thead {
    font-size: 14px;
  }


  .text2line {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
  }

  .hzlx {
    color: #868EA3;
    font-size: 12px;
  }
}
.kuajing-search-btn {
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
  width: 145px;
}
</style>
