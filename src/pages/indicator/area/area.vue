<template>
  <div class="indicator-area">
    <div class="filter-area">
      <div class="filter-item">
        地区：
        <el-select
          v-model="region"
          style="margin-right: 20px;"
          size="mini"
          @change="selectChange"
          multiple
          filterable
          collapse-tags
        >
          <el-option
            v-for="(item, i) in regions"
            :key="i"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <div class="filter-item">
        时间：
        <el-date-picker
          v-model="params.year"
          type="year"
          format="yyyy年"
          size="mini"
          align="right"
          value-format="yyyy"
          :clearable="false"
        ></el-date-picker>
      </div>
      <div class="filter-item">
        <div class="filter-btn" @click="getData(region.join(','), params.year)">
          <img
            src="@/assets/imgs/indicator/filter-icon.png"
            width="11"
            height="13"
            class="icon"
          />筛选
        </div>
        <div class="filter-btn reset" @click="resetFilter">
          <img
            src="@/assets/imgs/indicator/reset-icon.png"
            width="12"
            height="12"
            class="icon"
          />重置条件
        </div>
        <div class="filter-btn reset" @click="clearIndicator">
          <i
            class="el-icon-delete"
            style="height: 13px;width: 12px;margin-right: 4px;"
          ></i
          >清空指标
        </div>
      </div>
    </div>
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <div class="area" v-else>
      <div v-if="data.length > 0">
        <div class="area-table">
          <el-table
            :data="data"
            border
            stripe
            :height="300"
            :header-cell-style="{ background: '#F6F8FC', color: '#545B6D' }"
          >
            <el-table-column
              v-for="item in columns"
              :key="item.field"
              :label="item.label"
              :fixed="item.field == 'indicator'"
              header-align="center"
              :align="item.field == 'indicator' ? 'left' : 'center'"
              :min-width="item.field == 'indicator'?200:100"
            >
              <template slot-scope="scope">
                <span
                  v-if="item.field == 'indicator'"
                  @mouseenter="showClearHandler(true, item, scope)"
                  @mouseout="showClearHandler(false, item, scope)"
                  style="display: flex;justify-content: space-between;align-items: center;width: 100%;height: 100%;"
                >
                  <span
                    style="display: inline-block; width: 180px"
                    @mouseenter="showClearHandler(true, item, scope)"
                    @mouseout="showClearHandler(false, item, scope)"
                    >{{ scope.row[item.field] }}</span
                  >
                  <el-tooltip
                    content="移除当前指标"
                    effect="light"
                    placement="top"
                  >
                    <transition name="slide-fade">
                      <img
                        @mouseenter="showClearHandler(true, item, scope)"
                        @mouseout="showClearHandler(false, item, scope)"
                        @click="removeIndicator(scope)"
                        v-show="
                          item.showClear == true && curIndex == scope.$index
                        "
                        src="@/assets/imgs/indicator/close.png"
                        width="12"
                        height="12"
                        class="del-btn"
                        style="margin-right: 8px;cursor: pointer;"
                      />
                    </transition>
                  </el-tooltip>
                </span>
                <span v-else>{{ scope.row[item.field] }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="params.page"
          :page-size="params.pageSize"
          layout="total, prev, pager, next"
          :total="count"
        >
        </el-pagination>
        <div class="echarts-card">
          <div class="title-area">
            <div class="title">
              分析图表
              <el-tooltip effect="light" placement="right">
                <div
                  slot="content"
                  v-html="'图表中仅展示当页表格的指标，最多10条'"
                ></div>
                <i class="el-icon-question cl-green question-icon"></i>
              </el-tooltip>
            </div>
            <div class="transform-btn">
              <div
                class="btn"
                :class="{ active: showChart === 1 }"
                @click="switchChart(1)"
              >
                <img
                  v-if="showChart === 1"
                  src="@/assets/imgs/indicator/bar-active.png"
                  width="13"
                  height="14"
                  class="icon"
                /><img
                  v-else
                  src="@/assets/imgs/indicator/bar.png"
                  width="13"
                  height="14"
                  class="icon"
                />柱形图
              </div>
              <div
                class="btn"
                :class="{ active: showChart === 2 }"
                @click="switchChart(2)"
              >
                <img
                  v-if="showChart === 2"
                  src="@/assets/imgs/indicator/pie-active.png"
                  width="12"
                  height="12"
                  class="icon"
                /><img
                  v-else
                  src="@/assets/imgs/indicator/pie.png"
                  width="12"
                  height="12"
                  class="icon"
                />饼图
              </div>
              <div
                class="btn"
                :class="{ active: showChart === 3 }"
                @click="switchChart(3)"
              >
                <img
                  v-if="showChart === 3"
                  src="@/assets/imgs/indicator/map-active.png"
                  width="12"
                  height="12"
                  class="icon"
                /><img
                  v-else
                  src="@/assets/imgs/indicator/map.png"
                  width="12"
                  height="12"
                  class="icon"
                />地图
              </div>
            </div>
          </div>

          <!-- 柱形图 -->
          <div v-show="showChart === 1" class="chart">
            <div id="area-chart1" class="area-chart1"></div>
          </div>
          <!-- 饼图 -->
          <div v-show="showChart === 2" class="chart" style="height: 100%;">
            <div
              id="area-chart2"
              class="area-chart2"
              style="height: 100%;display: inline-flex;flex-wrap: wrap;width: calc(100vw - 310px);"
            >
              <div
                v-for="(item, index) in chartData"
                :key="'pie' + index"
                :id="'area-chart2-' + (index + 1)"
                class="area-chart2"
              ></div>
            </div>
          </div>
          <!-- 地图 -->
          <div v-show="showChart === 3" class="chart" style="padding: 20px 20px 40px 20px;">
            指标：
            <el-select
              v-model="filter"
              style="margin-right: 20px;"
              size="mini"
              @change="filterChange"
              filterable
            >
              <el-option
                v-for="(item, i) in optionList"
                :key="i"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <div
              v-if="showMap === true"
              id="area-chart3"
              class="area-chart3"
            ></div>
            <div v-else class="national">
              <div class="modal">
                <div>全国</div>
                <div>{{ formatNationalModal() }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="node-data">
        <img src="/static/imgs/trz/no_data.png" />
        <div v-if="filterChecked.length<=0 && checked.length<=0">请选择指标</div>
        <div v-else>暂无数据</div>
      </div>
    </div>
    <!-- 放大图形 -->
    <div class="open-area-chart" v-show="isOpen">
      <div
        class="echarts-card"
        :class="{ 'echarts-card-open': isOpen === true }"
      >
        <div class="title-area">
          <div class="title">
            分析图表
            <el-tooltip effect="light" placement="right">
              <div
                slot="content"
                v-html="'图表中仅展示当页表格的指标，最多10条'"
              ></div>
              <i class="el-icon-question cl-green question-icon"></i>
            </el-tooltip>
          </div>
          <div class="transform-btn">
            <div
              class="btn"
              :class="{ active: showChart === 1 }"
              @click="switchChart(1)"
            >
              <img
                v-if="showChart === 1"
                src="@/assets/imgs/indicator/bar-active.png"
                width="13"
                height="14"
                class="icon"
              /><img
                v-else
                src="@/assets/imgs/indicator/bar.png"
                width="13"
                height="14"
                class="icon"
              />柱形图
            </div>
            <div
              class="btn"
              :class="{ active: showChart === 2 }"
              @click="switchChart(2)"
            >
              <img
                v-if="showChart === 2"
                src="@/assets/imgs/indicator/pie-active.png"
                width="12"
                height="12"
                class="icon"
              /><img
                v-else
                src="@/assets/imgs/indicator/pie.png"
                width="12"
                height="12"
                class="icon"
              />饼图
            </div>
            <div
              class="btn"
              :class="{ active: showChart === 3 }"
              @click="switchChart(3)"
            >
              <img
                v-if="showChart === 3"
                src="@/assets/imgs/indicator/map-active.png"
                width="12"
                height="12"
                class="icon"
              /><img
                v-else
                src="@/assets/imgs/indicator/map.png"
                width="12"
                height="12"
                class="icon"
              />地图
            </div>
          </div>
          <img
            src="/static/imgs/echarts/esc-fullscreen.png"
            alt="退出全屏"
            class="out"
            @click="closeOpen"
          />
        </div>

        <!-- 柱形图 -->
        <div v-show="showChart === 1" class="chart">
          <div id="open-area-chart1" class="open-area-chart1"></div>
        </div>
        <!-- 饼图 -->
        <div v-show="showChart === 2" class="chart" style="height: 100%;">
          <div
            id="open-area-chart2"
            class="open-area-chart2"
            style="height: 100%;display: inline-flex;flex-wrap: wrap;width: 100vw;"
          >
            <div
              v-for="(item, index) in chartData"
              :key="'open-pie' + index"
              :id="'open-area-chart2-' + (index + 1)"
              class="open-area-chart2"
            ></div>
          </div>
        </div>
        <!-- 地图 -->
        <div v-show="showChart === 3" class="chart">
          指标：
          <el-select
            v-model="filter"
            style="margin-right: 20px;"
            size="mini"
            @change="filterChange"
            filterable
          >
            <el-option
              v-for="(item, i) in optionList"
              :key="i"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <div
            v-if="showMap === true"
            id="open-area-chart3"
            class="open-area-chart3"
          ></div>
          <div v-else class="national">
            <div class="modal">
              <div>全国</div>
              <div>{{ formatNationalModal() }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Moment from "moment";
import LoadingGif from "@/components/common/globalCom/loading-gif";

export default {
  props: {
    filterChecked: {
      type: Array
    },
    collectAreaData: {
      type: Object
    },
    activeName: {
      type: String
    },
    activeNameRight: {
      type: String
    }
  },
  data() {
    return {
      showMap: true,
      showNation: false,
      checked: [],
      isOpen: false, // 是否为放大查看
      filter: "",
      tempRegion: [], // 用于控制点了筛选按钮后才 且如果地区选的是全国 那么就展示全国的背景图片
      indicator: "", // 指标
      chartData: [],
      showChart: 1, // 当前显示的图
      curIndex: -1,
      isLoading: true,
      regions: [], // 地区数据源
      region: [], // 地区
      year: "", // 日期
      columns: [], // 表格列
      data: [], // 表格数据
      count: 0, // 总条数
      params: {
        type: 2,
        // 查询条件
        year: "", // 开始时间和结束时间
        region: [],
        page: 1, // 页数
        pageSize: 10 // 每页条数
      },

      optionList: []
    };
  },
  components: { LoadingGif },
  created() {
    this.params.page = 1
    this.getBasicData();
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.echartsResize("area-chart1");
      if (this.isOpen) {
        this.chartData &&
          this.chartData.forEach((item, i) => {
            this.echartsResize("open-area-chart2-" + (i + 1));
          });
      } else {
        this.chartData &&
          this.chartData.forEach((item, i) => {
            this.echartsResize("area-chart2-" + (i + 1));
          });
      }
      this.echartsResize("area-chart3");
      this.calHtableArea();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.echartsResize("area-chart1");
      if (this.isOpen) {
        this.chartData &&
          this.chartData.forEach((item, i) => {
            this.echartsResize("open-area-chart2-" + (i + 1));
          });
      } else {
        this.chartData &&
          this.chartData.forEach((item, i) => {
            this.echartsResize("area-chart2-" + (i + 1));
          });
      }
      this.echartsResize("area-chart3");
      this.calHtableArea();
    });
  },
  activated() {
    this.calHtableArea();
  },

  watch: {
    // 监听待选指标发生改变时重新请求数据
    filterChecked: {
      handler(newValue, oldValue) {
        if (this.activeName === "indicators") {
          this.getData(this.region.join(","), this.params.year);
        }
      },
      immediate: true,
      deep: true
    },
    columns: {
      handler() {
        this.$nextTick(() => {
          this.calHtableArea();
        });
      },
      immediate: true,
      deep: true
    },
    activeNameRight: {
      handler(val) {
        if (val!=='area') return
        this.$nextTick(() => {
          this.calHtableArea();
        });
      },
      immediate: true,
      deep: true
    },
    collectAreaData: {
      handler(newValue) {
        this.params.page =1
        if (this.activeName === "collect") {
          let obj = _.cloneDeep(newValue);
          if (Object.keys(obj).length > 0) {
            // console.log(obj);
            this.params.region = obj.region;
            this.region = obj.region.split(",");
            this.tempRegion = this.region;
            this.params.region = this.regions.join(",");
            this.params.type = obj.type;
            this.params.year = obj.year;
            // 获取左侧待选指标选中的值
            this.checked = obj.filter_condition
              .replace("indicator_name_guifan=", "")
              .split("ღ");
            this.$emit("changeIndicator", this.checked);
            this.getData(this.region.join(","), this.params.year);
          } else {
            this.getData(this.region.join(","), this.params.year);
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    mapShowHandler() {
      // console.log(
      //   this.region,
      //   this.tempRegion.includes("全国"),
      //   this.tempRegion,
      //   this.tempRegion.includes("全国") && this.tempRegion.length > 1
      // );
      return this.region.includes("全国") && this.region.length > 1;
    },
    filterChange(value) {
      this.filter = value;
      // console.log(this.filter, value);
      this.$nextTick(() => {
        this.switchChart(this.showChart);
      });
    },
    // 格式化全国气泡框的提示
    formatNationalModal() {
      let str = "";
      this.chartData.forEach(item => {
        if (item.indicator === this.filter) {
          str = item.values[0].value;
        }
      });
      return this.filter + "：" + str;
    },
    selectChange(val) {
      this.params.region = _.cloneDeep(val);
    },
    calHtableArea() {
      setTimeout(() => {
        let gHeight = 10; // 表格滚动条设置的为10px，所以赋值默认为10
        let ua = navigator.userAgent.toLowerCase(); //获取用户端信息
        let info = {
          ie: /msie/.test(ua) && !/opera/.test(ua), //匹配IE浏览器
          op: /opera/.test(ua), //匹配Opera浏览器
          sa: /version.*safari/.test(ua), //匹配Safari浏览器
          ch: /chrome/.test(ua), //匹配Chrome浏览器
          ff: /gecko/.test(ua) && !/webkit/.test(ua) //匹配Firefox浏览器
        };
        // 修改滚动条的样式不兼容ie和火狐，所以需要单独处理
        if (info.ie || info.ff) {
          gHeight = 16;
        }
        // console.log(gHeight);
        // 处理表格底部和右边滚动条导致表格错位问题
        const tableWrapper = $(".area-table .el-table__body-wrapper");
        const tableBody = $(".area-table .el-table__body");
        // console.log(tableWrapper, tableBody)
        // console.log(tableWrapper[0].offsetWidth, tableBody[0].clientWidth)
        const colgroup = document.querySelector(".area-table colgroup");
        /**
         * (以下数值为滚动条高度，可以自己根据情况通过class重新修改)
         */
        //内容大于容器时
        if (!tableBody[0]) return;
        if (tableBody[0].clientWidth && tableBody[0].clientWidth > tableWrapper[0].offsetWidth && tableWrapper[0].offsetWidth) {
          //设置x轴滚动
          tableWrapper[0].style.overflowX = "auto";
          //解决固定列错位 （没有错位的可以忽略以下内容）
          let fixedWrap = document.querySelector(
            ".area-table .el-table .el-table__fixed-body-wrapper"
          );
          // console.log(fixedWrap);
          if (fixedWrap) {
            fixedWrap.style.paddingBottom = gHeight + "px";
            fixedWrap.style.height = `calc(100% - ${gHeight * 3}px)`;
            console.log(fixedWrap.getBoundingClientRect().height);
          }
          //解决固定列覆盖滚动条
          let fixed_left = document.querySelector(".area-table .el-table .el-table__fixed");
          let fixed_right = document.querySelector(
            ".area-table .el-table .el-table__fixed-right"
          );
          if (fixed_left) {
            fixed_left.style.height = `calc(100% - ${gHeight}px)`;
          }
          if (fixed_right) {
            fixed_right.style.height = `calc(100% - ${gHeight}px)`;
          }
          //解决表头偏移
          //没有原生的gutter时自己新增一个
          let gutter = colgroup.querySelector(`col[name=gutter]`);
          let gutterx = colgroup.querySelector(`col[name=gutterx]`);
          // console.log(colgroup);
          if (gutterx) {
            colgroup.removeChild(gutterx);
            gutterx = colgroup.querySelector(`col[name=gutterx]`);
            gutter = colgroup.querySelector(`.col[name=gutter]`);
          }
          if (!gutter && !gutterx) {
            // console.log(12313);
            let col = document.createElement("col");
            col.setAttribute("name", "gutterx");
            col.setAttribute("width", `${gHeight}`);
            colgroup.appendChild(col);
          }
        }
         else {
          tableWrapper[0].style.overflowX = "hidden";
        }
      }, 500);
    },
    // 清空指标
    clearIndicator() {
      this.$emit("clearIndicator");
      this.checked = [];
      this.params.page = 1
    },
    // 移出当前指标
    removeIndicator(row) {
      if (this.filterChecked.length > 0) {
        this.filterChecked.splice(
          this.filterChecked.indexOf(row.row.indicator),
          1
        );
        // 像父级传入移除后的指标项
        this.$emit("changeIndicator", this.filterChecked);
        this.getData(this.region.join(","), this.params.year);
      } else {
        this.checked.splice(this.checked.indexOf(row.row.indicator), 1);
        // 像父级传入移除后的指标项
        this.$emit("changeIndicator", this.checked);
        this.getData(this.region.join(","), this.params.year);
      }
    },
    echartsResize(id) {
      let echart = Echarts.getInstanceByDom(document.getElementById(id));
      echart && echart.resize();
    },
    // 重置条件
    resetFilter() {
      this.getBasicData();
    },
    // 下载图表的名字
    getImgName() {
      return (
        "医药宏观数据" +
        Moment().format("YYYY-MM-DD HH:mm:ss") +
        "来源：药智数据企业版"
      ); //当前时间
    },
    // 图表放大
    openDialog() {
      this.isOpen = true;
      this.$nextTick(() => {
        this.switchChart(this.showChart);
      });
    },

    // 退出放大预览
    closeOpen() {
      this.isOpen = false;
      this.drawBarChart(
        this.formatData(this.chartData, this.showChart),
        "chart" + this.showChart
      );
    },
    // 图表切换
    switchChart(val) {
      this.showChart = val;
      switch (val) {
        // 柱状图
        case 1:
          if (this.isOpen) {
            this.drawBarChart(
              this.formatData(this.chartData, this.showChart),
              "open-area-chart1"
            );
          } else {
            this.drawBarChart(
              this.formatData(this.chartData, this.showChart),
              "area-chart1"
            );
          }
          break;
        // 饼图
        case 2:
          if (this.isOpen) {
            this.drawPieChart(
              this.formatData(this.chartData, this.showChart),
              "open-area-chart2"
            );
          } else {
            this.drawPieChart(
              this.formatData(this.chartData, this.showChart),
              "area-chart2"
            );
          }
          break;
        // 地图
        case 3:
          this.tempRegion = this.params.region;
          let min = 0,
            max = 0;
          let data = [],
            maxminForData = [],
            chartData = [];
          this.chartData.forEach(item => {
            if (item.indicator === this.filter) {
              item.values &&
                item.values.forEach(item2 => {
                  if (item2.key !== "全国") {
                    maxminForData.push({ value: Number(item2.value) });
                  }
                });
              chartData = [item];
            }
            item.values &&
              item.values.forEach(item2 => {
                data.push(item2.key);
              });
          });
          // console.log(maxminForData);
          let minObj = _.cloneDeep(_.minBy(maxminForData, "value")),
            maxObj = _.cloneDeep(_.maxBy(maxminForData, "value"));
          min = minObj && minObj.value > 0 ? Number(minObj.value) : 0;
          max = maxObj && maxObj.value > 0 ? Number(maxObj.value) : 0;
          // console.log(min, max, chartData, this.chartData);
          this.showNation = data.every(item => item === "全国"); // 是否只有全国的数据 有则展示全国图片
          // 如果选择了全国和其他地区
          if (this.region.includes("全国") && this.region.length > 1) {
            if (this.showNation === true) {
              this.showMap = false;
            } else {
              this.showMap = true;
            }
          } else if (!this.region.includes("全国")) {
            // 只选择了其他地区
            this.showMap = true;
          } else if (this.region.includes("全国") && this.region.length === 1) {
            // 只选择了全国
            this.showMap = false;
          }
          // else if (
          //   // 如果数据返回的是都是0
          //   chartData[0].values &&
          //   chartData[0].values.every(item => item == 0)
          // ) {
          //   this.showMap = false;
          // }
          setTimeout(() => {
            if (this.isOpen) {
              if (this.showMap === true) {
                this.drawMapChart(
                  this.formatData(chartData, this.showChart),
                  "open-area-chart3",
                  min,
                  max
                );
              } else {
                this.$nextTick(() => {
                  if (
                    document.getElementById("open-area-chart3") &&
                    Echarts.getInstanceByDom(
                      document.getElementById("open-area-chart3")
                    )
                  ) {
                    Echarts.getInstanceByDom(
                      document.getElementById("open-area-chart3")
                    ).clear();
                  }
                });
              }
            } else {
              if (this.showMap === true) {
                this.drawMapChart(
                  this.formatData(chartData, this.showChart),
                  "area-chart3",
                  min,
                  max
                );
              } else {
                this.$nextTick(() => {
                  if (
                    document.getElementById("area-chart3") &&
                    Echarts.getInstanceByDom(
                      document.getElementById("area-chart3")
                    )
                  ) {
                    Echarts.getInstanceByDom(
                      document.getElementById("area-chart3")
                    ).clear();
                  }
                });
              }
            }
          }, 0);
          break;
      }
    },
    // 柱状图
    drawBarChart(obj, id) {
      let legendData = [];
      obj.seriesData.map(v => {
        legendData.push(v.name);
      });
      const that = this;

      let option = {
        toolbox: {
          right: "20",
          top: 5,
          show: true,
          feature: {
            saveAsImage: {
              title: "保存",
              name: this.getImgName(),
              icon: "image:///static/imgs/echarts/dow.png"
            },
            myMagnify: !that.isOpen
              ? {
                  show: true,
                  title: "全屏",
                  icon: "image:///static/imgs/echarts/screen.png",
                  onclick() {
                    that.openDialog();
                  }
                }
              : {}
          }
        },
        legend: {
          type: "scroll",
          show: true,
          top: 5,
          right: 70,
          data: legendData
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: 40,
          left: 20,
          right: 60,
          bottom: 10,
          containLabel: true
        },
        xAxis: {
          data: obj.yAxisData,
          boundaryGap: this.showChart === 2 ? false : true
        },
        yAxis: {
          type: "value"
        },
        series: obj.seriesData
      };

      if (document.getElementById(id)) {
        Echarts.init(document.getElementById(id), "customed").clear();
        let chart = Echarts.init(document.getElementById(id), "customed");
        chart.setOption(option);
      }
    },
    // 渲染饼图
    drawPieChart(obj, id) {
      let pies = [];
      this.chartData.forEach((item, i) => {
        let data = [];
        item.values.forEach(item2 => {
          item2.name = item2.key;
          data.push({
            name: item2.name,
            value: item2.value
          });
        });

        pies.push({
          title: item.indicator,
          data
        });
      });
      const that = this;

      pies &&
        pies.length > 0 &&
        pies.forEach((item, i) => {
          let series = [
            {
              type: "pie",
              radius: "80%",
              center: ["50%", "50%"],
              data: item.data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ];
          let option = {
            title: {
              text: item.title,
              left: "center"
            },
            toolbox: {
              right: "20",
              top: 5,
              show: true,
              feature: {
                saveAsImage: {
                  title: "保存",
                  name: this.getImgName(),
                  icon: "image:///static/imgs/echarts/dow.png"
                },
                myMagnify: !that.isOpen
                  ? {
                      show: true,
                      title: "全屏",
                      icon: "image:///static/imgs/echarts/screen.png",
                      onclick() {
                        that.openDialog();
                      }
                    }
                  : {}
              }
            },
            legend: {
              type: "scroll",
              show: true,
              bottom: 5,
              data: item.data.map(leg => leg.name)
            },
            tooltip: {
              trigger: "item",
              formatter: "{b} : {c} ({d})"
            },
            grid: {
              top: 40,
              left: 20,
              right: 60,
              bottom: 10,
              containLabel: true
            },
            series
          };

          let formatID = `${id}-` + (i + 1);
          if (document.getElementById(formatID)) {
            Echarts.init(document.getElementById(formatID), "customed").clear();
            let chart = Echarts.init(
              document.getElementById(formatID),
              "customed"
            );
            chart.setOption(option);
          }
        });
    },
    // 渲染地图
    drawMapChart(obj, id, min, max) {
      let series = [],
        data = [],
        option = {};
      console.log(obj);
      obj.seriesData.forEach(item => {
        item.values &&
          item.values.forEach(item2 => {
            if (item2.key != "全国" && item2.value && item2.value > 0) {
              data.push({
                name: item2.key,
                value: item2.value,
                label: {
                  show: true
                }
              });
            }
          });
      });
      console.log(data);
      series = [
        {
          type: "map",
          mapType: "china", // 自定义扩展图表类型
          data
        }
      ];
      const that = this;
      option = {
        toolbox: {
          right: "20",
          top: 5,
          show: true,
          feature: {
            saveAsImage: {
              title: "保存",
              name: this.getImgName(),
              icon: "image:///static/imgs/echarts/dow.png"
            },
            myMagnify: !that.isOpen
              ? {
                  show: true,
                  title: "全屏",
                  icon: "image:///static/imgs/echarts/screen.png",
                  onclick() {
                    that.openDialog();
                  }
                }
              : {}
          }
        },
        tooltip: {
          trigger: "item",
          formatter(params) {
            // console.log(params);
            return `${params.name}<br/>${that.filter}：${
              isNaN(params.value) ? 0 : params.value
            }`;
          }
        },
        grid: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
          containLabel: true
        },
        series
      };
      if (min > 0 || max > 0) {
        option.visualMap = {
          min,
          max,
          left: "left",
          top: "bottom",
          text: ["高", "低"], // 文本，默认为数值文本
          calculable: true
        };
      }
      if (document.getElementById(id)) {
        Echarts.init(document.getElementById(id), "customed").clear();
        let chart = Echarts.init(document.getElementById(id), "customed");
        chart.setOption(option);
      }
    },
    // 设置文本宽度
    textSize(text) {
      let result = (text.toString().length / 2) * 24;
      return result;
    },
    // 处理成echarts需要的数据格式
    formatData(data, showChart) {
      let yAxisData = [];
      let seriesData = [];
      if (!data.length) {
        return {
          seriesData,
          yAxisData
        };
      }
      let aLength = [];
      data.forEach((item, index) => {
        aLength.push(item.values.length);
        let seriesObj = {
          name: "",
          connectNulls: true,
          barMaxWidth: 200, //柱图宽度
          data: []
        };

        if (showChart === 1) {
          seriesObj.type = "bar";
          seriesObj.stack = "总量";
        } else if (showChart === 2) {
          seriesObj.type = "pie";
        } else {
          seriesObj.type = "map";
          seriesObj.mapType = "china";
        }
        // 面积图设置
        if (showChart === 2) {
          seriesObj.areaStyle = {};
        }
        seriesObj.name = item.indicator;
        item.values.map(v => {
          seriesObj.data.push(v.value);
        });

        seriesData.push(seriesObj);
      });
      let maxN = Math.max.apply(null, aLength);

      data[aLength.indexOf(maxN)].values.forEach(item => {
        yAxisData.push(item.key);
      });
      if (showChart === 3) {
        seriesData = data;
      }
      return {
        seriesData,
        yAxisData
      };
    },
    showClearHandler(status, item, scope) {
      item.showClear = status;
      this.curIndex = scope.$index;
    },
    // 获取地区列表及最新时间
    async getBasicData() {
      const that = this;
      const res = await window
        .Axios({
          url: "/api/Macropharmaindicators/regionYear",
          method: "get"
        })
        .catch(err => {
          console.log(err);
        });
      if (res.data && res.data.code === 200) {
        let data = res.data.data;
        this.regions = data.region;
        this.region = [];
        this.tempRegion = [];
        this.params.region = "";
        this.$nextTick(() => {
          if (that.regions.length > 0) {
            that.region.push(that.regions[0]);
            that.tempRegion.push(that.regions[0]);
            that.params.region = that.region.join(",");
          }
          that.params.year = data.year;
          that.getData(that.params.region, that.params.year);
        });
      }
    },
    // 获取表格表头和表格数据源以及图表数据
    async getData(region, year) {
      const that = this;
      this.isLoading = true;
      this.columns = [];
      this.data = [];
      this.indicator = "";
      this.chartData = [];
      this.tempRegion = region;
      let params = _.cloneDeep(this.params);
      if (this.filterChecked.length > 0) {
        params.filter_condition =
          "indicator_name_guifan=" + this.filterChecked.join("ღ");
      } else {
        params.filter_condition =
          "indicator_name_guifan=" + this.checked.join("ღ");
      }
      params.region = region;
      this.params = params;
      const res = await window
        .Axios({
          url: "/api/Macropharmaindicators/index",
          method: "get",
          params: {
            ...params,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
      if (res.data && res.data.code === 200) {
        let data = res.data.data;
        data.tableconfig.forEach(item => {
          item.showClear = false;
        });
        this.optionList = []
        data.List.res.map(v=>{
          this.optionList.push(v.indicator)
        })
        this.filter = this.optionList[0]
        this.columns = data.tableconfig;
        this.data = _.orderBy(data.List.res, ["sort"], ["desc"]);
        this.count = data.List.count;
        this.chartData = data.chart;
        if (this.chartData.length > 0)
          this.indicator = this.chartData[0].indicator;
        // if (this.filterChecked.length > 0) this.filter = this.filterChecked[0];
        setTimeout(() => {
          that.switchChart(that.showChart);
        }, 0);
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getData(this.params.region, this.params.year);
    }
  }
};
</script>

<style lang="less" scoped>
.indicator-area {
  padding: 10px;
  padding-top: 0;

  .filter-area {
    display: flex;
    .filter-item {
      font-size: 13px;
      font-weight: 400;
      color: #545b6d;
      line-height: 20px;
      display: flex;
      align-items: center;

      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 110px !important;
      }

      .filter-btn {
        margin-left: 30px;
        padding: 6px 7px;
        background: #4877e8;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #ffffff;
        line-height: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:not(:first-child) {
          margin-left: 6px;
        }

        .icon {
          margin-right: 4px;
        }
      }

      .reset {
        background: #97a2bf;
      }

      .clear {
        background: #f4a622;
      }
    }
  }
  .area-table {
    margin: 10px 0;
  }
  .table {
    margin: 10px 0;

    .el-table::before {
      height: 0 !important;
    }
    .slide-fade-enter-active {
      transition: all 0.3s ease;
    }
    .slide-fade-leave-active {
      transition: all 0.6s cubic-bezier(1, 0.5, 0.8, 1);
    }
    .slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
      transform: translateX(10px);
      opacity: 0;
    }
  }

  /deep/.el-pagination {
    padding: 0;
    .btn-prev {
      border-radius: 4px 0px 0px 4px;
    }

    .btn-next {
      border-radius: 0px 4px 4px 0px;
    }

    .el-pager li {
      background-color: #ffffff;
    }

    .el-pager li.active {
      background-color: #4877e8;
    }
  }
  .echarts-card {
    margin-top: 24px;
    width: 100%;
    height: 100%;
    border: 1px solid #dfe5f1;

    /deep/.el-checkbox__inner {
      width: 13px;
      height: 13px;
    }

    /deep/ .el-checkbox__label {
      font-size: 13px;
    }

    .title-area {
      width: calc(100% - 20px);
      height: 34px;
      padding: 0 10px;
      background: #f6f8fc;
      display: flex;
      align-items: center;
      position: relative;

      .title {
        font-size: 16px;
        font-weight: 600;
        color: #545b6d;
        line-height: 16px;
        margin-right: 24px;
      }

      .transform-btn {
        display: flex;
        align-items: center;
        margin-right: 53px;

        .btn {
          padding: 5px 6px;
          border-radius: 4px;
          border: 1px solid #4877e8;
          font-size: 13px;
          font-weight: 400;
          color: #4877e8;
          line-height: 13px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;

          &:not(:last-child) {
            margin-right: 10px;
          }
        }
        .active {
          border: 0;
          color: #ffffff;
          background: #4877e8;
        }

        .icon {
          margin-right: 2px;
        }
      }
      .align-center {
        display: flex;
        align-items: center;
      }

      .question-icon {
        font-size: 14px;
        margin-left: 6px;
      }
    }

    .chart {
      height: 440px;
      padding: 20px 20px;
      box-sizing: border-box;

      .area-chart1,
      .area-chart2,
      .area-chart3 {
        width: calc(100vw - 480px);
        height: 400px;
      }
      div[id*="area-chart2"] {
        width: calc((100vw - 480px) / 2);
      }
      .national {
        background: url("~@/assets/imgs/indicator/map-national.png") no-repeat
          center;
        background-size: contain;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .modal {
          border: 1px solid rgb(84, 174, 255);
          padding: 10px;
          font-size: 14px;
          line-height: 1.5em;
          display: inline-block;
          flex-direction: column;
          border-radius: 6px;
          background: #fff;
          color: #000;
        }
      }
    }
  }

  .echarts-card-open {
    margin-top: 0;
    overflow-y: auto;

    .out {
      position: absolute;
      right: 20px;
      cursor: pointer;
    }

    .chart {
      height: 700px;

      .open-area-chart1,
      .open-area-chart2,
      .open-area-chart3 {
        width: calc(100vw - 20px);
        min-width: 1280px;
        height: 650px;
      }
      div[id*="open-area-chart2-"] {
        width: calc((100vw - 20px) / 2);
      }
    }

    .transform-btn {
      .active {
        transition: none !important;
      }
    }
  }

  .node-data {
    text-align: center;
    color: #999;
    margin-top: 300px;
  }

  .open-area-chart {
    position: fixed;
    z-index: 99999;
    top: 48px;
    left: 0px;
    width: 100%;
    height: calc(100% - 48px);
    background-color: #ffffff;
  }
}
</style>

<style lang="less">
.indicator-area {
  .el-table thead th > .cell {
    justify-content: center;
  }
}
.el-table__fixed::before {
  background-color: #ffffff;
}

.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #ebeef5;
}
</style>
