<template>
  <div class="indicator-date">
    <LoadingGif
      :className="'fullscreen-loading'"
      :loadFlag="listLoading"
    ></LoadingGif>
    <div>
      <div class="date-top">
        <span class="title">地区：</span>
        <el-select
          size="mini"
          v-model="params.region"
          placeholder="请选择"
          @change="selectChange"
        >
          <el-option
            v-for="item in areaList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>

        <span class="title" style="margin-left: 20px">时间：</span>

        <el-date-picker
          v-model="params.year[0]"
          type="year"
          :picker-options="startPickerOptions"
          format="yyyy"
          value-format="yyyy"
          size="mini"
          @change="handleChangeStart"
          placeholder="开始年份"
          :clearable="false"
        >
        </el-date-picker>
        <span style="margin: 0 8px; color: #dfe5f1">-</span>
        <el-date-picker
          v-model="params.year[1]"
          type="year"
          size="mini"
          :picker-options="endPickerOptions"
          format="yyyy"
          value-format="yyyy"
          @change="handleChangeEnd"
          placeholder="结束年份"
          :clearable="false"
        >
        </el-date-picker>
        <div class="filter-item">
          <div class="filter-btn" @click="getDateIndicator('type')">
            <img
              src="@/assets/imgs/indicator/filter-icon.png"
              width="11"
              height="13"
              class="icon"
            />筛选
          </div>
          <div class="filter-btn reset" @click="resetParams">
            <img
              src="@/assets/imgs/indicator/reset-icon.png"
              width="12"
              height="12"
              class="icon"
            />重置条件
          </div>

          <div class="filter-btn reset" @click="clearIndicator">
            <i class="el-icon-delete pr5"></i>清空指标
          </div>
        </div>
      </div>

      <div v-if="data.length > 0">
        <!-- 表格 -->
        <div class="table">
          <el-table
            :data="data"
            stripe
            border
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
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
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
                        style="margin-right: 8px; cursor: pointer"
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.page"
          :page-size="params.pageSize"
          layout="total, prev, pager, next"
          :total="count"
        >
        </el-pagination>

        <!-- 分析图表 -->
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
                  src="@/assets/imgs/indicator/line-active.png"
                  v-if="showChart === 1"
                  class="img"
                  alt=""
                />
                <img
                  src="@/assets/imgs/indicator/line.png"
                  v-else
                  class="img"
                  alt=""
                />
                线形图
              </div>
              <div
                class="btn"
                :class="{ active: showChart === 2 }"
                @click="switchChart(2)"
              >
                <img
                  src="@/assets/imgs/indicator/area-active.png"
                  v-if="showChart === 2"
                  class="img"
                  alt=""
                />
                <img
                  src="@/assets/imgs/indicator/area.png"
                  v-else
                  class="img"
                  alt=""
                />
                面积图
              </div>
              <div
                class="btn"
                :class="{ active: showChart === 3 }"
                @click="switchChart(3)"
              >
                <img
                  src="@/assets/imgs/indicator/bar-active.png"
                  v-if="showChart === 3"
                  class="img"
                  alt=""
                />
                <img
                  src="@/assets/imgs/indicator/bar.png"
                  v-else
                  class="img"
                  alt=""
                />
                柱状图
              </div>
            </div>
            <el-checkbox
              class="align-center"
              v-model="showDataLabel"
              @change="showDataLabelChange"
              >显示数据标签</el-checkbox
            >
            <el-checkbox
              class="align-center"
              v-model="showMaxMin"
              @change="showMaxMinChange"
              >显示高低点</el-checkbox
            >
          </div>

          <!-- 这线图 -->
          <div v-show="showChart === 1" class="chart">
            <div id="chart1" class="chart1"></div>
          </div>
          <!-- 面积图 -->
          <div v-show="showChart === 2" class="chart">
            <div id="chart2" class="chart2"></div>
          </div>
          <!-- 柱状图 -->
          <div v-show="showChart === 3" class="chart">
            <div id="chart3" class="chart3"></div>
          </div>
        </div>
      </div>

      <div v-else class="node-data">
        <img src="../../../../static/imgs/trz/no_data.png" alt="" />
        <div v-if="filterChecked.length<=0 && checked.length<=0">请选择指标</div>
        <div v-else>暂无数据</div>
      </div>
    </div>
    <!-- 放大图形 -->
    <div class="open-chart" v-show="isOpen">
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
                src="@/assets/imgs/indicator/line-active.png"
                v-if="showChart === 1"
                class="img"
                alt=""
              />
              <img
                src="@/assets/imgs/indicator/line.png"
                v-else
                class="img"
                alt=""
              />
              线形图
            </div>
            <div
              class="btn"
              :class="{ active: showChart === 2 }"
              @click="switchChart(2)"
            >
              <img
                src="@/assets/imgs/indicator/area-active.png"
                v-if="showChart === 2"
                class="img"
                alt=""
              />
              <img
                src="@/assets/imgs/indicator/area.png"
                v-else
                class="img"
                alt=""
              />
              面积图
            </div>
            <div
              class="btn"
              :class="{ active: showChart === 3 }"
              @click="switchChart(3)"
            >
              <img
                src="@/assets/imgs/indicator/bar-active.png"
                v-if="showChart === 3"
                class="img"
                alt=""
              />
              <img
                src="@/assets/imgs/indicator/bar.png"
                v-else
                class="img"
                alt=""
              />
              柱状图
            </div>
          </div>
          <el-checkbox
            class="align-center"
            v-model="showDataLabel"
            @change="showDataLabelChange"
            >显示数据标签</el-checkbox
          >
          <el-checkbox
            class="align-center"
            v-model="showMaxMin"
            @change="showMaxMinChange"
            >显示高低点</el-checkbox
          >
          <img
            src="/static/imgs/echarts/esc-fullscreen.png"
            alt="退出全屏"
            class="out"
            @click="closeOpen"
          />
        </div>

        <!-- 这线图 -->
        <div v-show="showChart === 1" class="chart">
          <div id="open-chart1" class="open-chart1"></div>
        </div>
        <!-- 面积图 -->
        <div v-show="showChart === 2" class="chart">
          <div id="open-chart2" class="open-chart2"></div>
        </div>
        <!-- 柱状图 -->
        <div v-show="showChart === 3" class="chart">
          <div id="open-chart3" class="open-chart3"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import Echarts from "echarts";
import Moment from "moment";
export default {
  props: {
    filterChecked: {
      type: Array
    },
    collectDateData: {
      type: Object
    },
    activeName: {
      type: String
    },
    activeNameRight: {
      type: String
    }
  },
  components: {
    LoadingGif
  },
  data() {
    return {
      listLoading: true,
      curStartYear: "", // 开始时间
      curEndYear: "", // 结束时间
      startPickerOptions: {},
      endPickerOptions: {},
      columns: [], // 表格列
      data: [], // 表格数据
      count: 0, // 总条数
      params: {
        type: 1,
        // 查询条件
        year: ["", ""], // 开始时间和结束时间
        region: "全国",
        page: 1, // 页数
        pageSize: 10 // 每页条数
      },
      areaList: [], // 地区列表
      showDataLabel: false, // 是否显示数据标签
      showMaxMin: true, // 是否显示高低点
      showChart: 1, // 当前显示的图
      chartData: [],
      isOpen: false, // 是否为放大查看
      curIndex: -1,
      checked: []
    };
  },
  created() {},
  mounted() {
    this.getArea();
    window.addEventListener("resize", () => {
      this.echartsResize("chart1");
      this.echartsResize("chart2");
      this.echartsResize("chart3");
      this.echartsResize("open-chart1");
      this.echartsResize("open-chart2");
      this.echartsResize("open-chart3");
      this.calHtable()
    });
  },

  activated() {
    this.calHtable();
  },

  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.echartsResize("chart1");
      this.echartsResize("chart2");
      this.echartsResize("chart3");
      this.echartsResize("open-chart1");
      this.echartsResize("open-chart2");
      this.echartsResize("open-chart3");
      this.calHtable()
    });
  },

  watch: {
    // 监听待选指标发生改变时重新请求数据
    filterChecked: {
      handler(newValue, oldValue) {
        if (this.activeName === "indicators") {
          this.getDateIndicator();
        }
        console.log(newValue);
      },
      immediate: true,
      deep: true
    },

    columns: {
      handler() {
        this.$nextTick(() => {
          this.calHtable();
        });
      },
      immediate: true,
      deep: true
    },

    activeNameRight: {
      handler(val) {
        if (val!=='date') return
        this.$nextTick(() => {
          this.calHtable();
        });
      },
      immediate: true,
      deep: true
    },

    // 监听我的收藏点击后获取的收藏参数并请求接口
    collectDateData: {
      handler(newValue) {
        this.params.page =1
        if (this.activeName === "collect") {
          // console.log(newValue);
          let obj = _.cloneDeep(newValue);
          if (Object.keys(obj).length > 0) {
            this.params.region = obj.region;
            this.params.type = obj.type;
            this.params.year = obj.year.split(":");
            // 获取左侧待选指标选中的值
            this.checked = obj.filter_condition
              .replace("indicator_name_guifan=", "")
              .split("ღ");
            this.$emit("changeIndicator", this.checked);
            this.getDateIndicator();
          } else {
            this.getDateIndicator();
          }
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    echartsResize(id) {
      // console.log(id);
      let echart = Echarts.getInstanceByDom(document.getElementById(id));
      echart && echart.resize();
    },
    // 获取地区列表数据和最新时间
    getArea() {
      window
        .Axios({
          method: "get",
          url: "/api/Macropharmaindicators/regionYear",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.areaList = res.data.data.region;
            this.params.year[1] = res.data.data.year;
            this.curEndYear = res.data.data.year;
            this.params.year[0] = (Number(res.data.data.year) - 9).toString();
            this.curStartYear = (Number(res.data.data.year) - 9).toString();

            // 禁用年份选项
            this.startPickerOptions = Object.assign(
              {},
              this.startPickerOptions,
              {
                disabledDate: time => {
                  return time.getFullYear() > this.params.year[1];
                }
              }
            );
            this.endPickerOptions = Object.assign({}, this.endPickerOptions, {
              disabledDate: time => {
                return time.getFullYear() < this.params.year[0];
              }
            });
            this.listLoading = false;
            this.getDateIndicator();
          }
        });
    },

    // 查询列表和图表数据
    getDateIndicator(type) {
      if (type) {
        this.params.page = 1
      }
      this.listLoading = true;
      let params = _.cloneDeep(this.params);
      params.year = params.year.join(":");
      // console.log(this.filterChecked);

      if (this.filterChecked.length > 0) {
        params.filter_condition =
          "indicator_name_guifan=" + this.filterChecked.join("ღ");
      } else {
        params.filter_condition =
          "indicator_name_guifan=" + this.checked.join("ღ");
      }
      this.columns = [];
      this.chartData = [];
      this.data = [];
      window
        .Axios({
          method: "get",
          url: "/api/Macropharmaindicators/index",
          params: {
            ...params,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          this.listLoading = false;
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            data.tableconfig.forEach(item => {
              item.showClear = false;
            });
            this.columns = data.tableconfig;
            // console.log(this.columns);
            this.data = _.orderBy(data.List.res, ["sort"], ["desc"]);
            this.count = data.List.count;
            this.chartData = data.chart;

            // this.checked = [];
          }
        })
        .then(() => {
          this.$nextTick(() => {
            if (this.chartData.length) {
              this.switchChart(this.showChart);
              // this.drawLineChart(
              //   this.formatData(this.chartData, this.showChart),
              //   "chart"+ this.showChart
              // );
            }
          });
        });
    },

    calHtable() {
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
        const tableWrapper = document.querySelector(".el-table__body-wrapper");
        const tableBody = document.querySelector(".el-table__body");
        // console.log(tableBody)
        // console.log(tableWrapper, tableBody)
        // console.log(tableWrapper.offsetWidth, tableBody.clientWidth)
        const colgroup = document.querySelector("colgroup");
        /**
         * (以下数值为滚动条高度，可以自己根据情况通过class重新修改)
         */
        //内容大于容器时
        if (!tableBody) return;
        if (tableBody.clientWidth && tableBody.clientWidth > tableWrapper.offsetWidth && tableWrapper.offsetWidth) {
          //设置x轴滚动
          tableWrapper.style.overflowX = "auto";
          //解决固定列错位 （没有错位的可以忽略以下内容）
          let fixedWrap = document.querySelector(
            ".el-table .el-table__fixed-body-wrapper"
          );
          if (fixedWrap) {
            fixedWrap.style.paddingBottom = gHeight + "px";
            fixedWrap.style.height = `calc(100% - ${gHeight * 3}px)`;
            console.log(fixedWrap.getBoundingClientRect().height);
          }
          //解决固定列覆盖滚动条
          let fixed_left = document.querySelector(".el-table .el-table__fixed");
          let fixed_right = document.querySelector(
            ".el-table .el-table__fixed-right"
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
            gutter = colgroup.querySelector(`col[name=gutter]`);
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
          tableWrapper.style.overflowX = "hidden";
        }
      }, 500);
    },

    showClearHandler(status, item, scope) {
      item.showClear = status;
      this.curIndex = scope.$index;
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
          type: showChart === 3 ? "bar" : "line",
          connectNulls: true,
          barMaxWidth: 200, //柱图宽度
          data: []
        };

        // 是否显示最大最小值
        if (this.showMaxMin) {
          let that = this;
          seriesObj.markPoint = {
            symbol: "pin",
            // symbolSize(val) {
            //   return that.textSize(val);
            // },
            itemStyle: {
              color: "transparent"
            },

            label: {
              position: "inside",
              distance: 0,
              color: "#545b6d",
              fontWeight: "bold"
            },

            data: [
              {
                type: "max",
                name: "最大值"
              },
              { type: "min", name: "最小值" }
            ]
          };
        }
        // 是否显示数据标签
        if (this.showDataLabel) {
          seriesObj.label = {
            normal: {
              show: true,
              position: "top"
            }
          };
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
      // console.log(seriesData);
      return {
        seriesData,
        yAxisData
      };
    },

    // 绘制折线图
    drawLineChart(obj, id) {
      console.log(obj);
      let legendData = [];
      obj.seriesData.map(v => {
        legendData.push(v.name);
      });
      let that = this;

      let option = {
        toolbox: {
          right: "10",
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
        dataZoom:obj.yAxisData.length > 10? [
          {
            show: obj.yAxisData.length > 10,
            startValue: obj.yAxisData.length - 10,
            endValue: obj.yAxisData.length - 1,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            height: 20, //这里可以设置dataZoom的尺寸
            left: "center", // 组件离容器左侧的距离,'left', 'center', 'right','20%'
            top: "bottom", // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
            right: "auto", // 组件离容器右侧的距离,'20%'
            bottom: "auto", // 组件离容器下侧的距离,'20%'
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ]: [],
        legend: {
          type: "scroll",
          show: true,
          top: 0,
          right: "70",
          left: "50",
          data: legendData
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: 50,
          left: 20,
          right: 70,
          bottom: 30,
          containLabel: true
        },
        xAxis: {
          data: obj.yAxisData
          // boundaryGap: this.showChart === 2 ? false : true
        },
        yAxis: {
          type: "value"
        },
        series: obj.seriesData
      };
      Echarts.init(document.getElementById(id), "customed").clear();
      Echarts.init(document.getElementById(id), "customed").setOption(option);
    },

    // 设置文本宽度
    textSize(text) {
      let result = (text.toString().length / 2) * 24;
      return result;
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
      console.log(`open-chart` + this.showChart);
      this.$nextTick(() => {
        this.drawLineChart(
          this.formatData(this.chartData, this.showChart),
          `open-chart` + this.showChart
        );
      });
    },

    // 退出放大预览
    closeOpen() {
      this.isOpen = false;
      this.drawLineChart(
        this.formatData(this.chartData, this.showChart),
        "chart" + this.showChart
      );
    },

    // 是否显示数据标签
    showDataLabelChange() {
      if (this.showDataLabel) {
        this.showMaxMin = false;
      }
      if (this.isOpen) {
        this.drawLineChart(
          this.formatData(this.chartData, this.showChart),
          "open-chart" + this.showChart
        );
      } else {
        this.drawLineChart(
          this.formatData(this.chartData, this.showChart),
          "chart" + this.showChart
        );
      }
    },

    // 是否显示最大最小值
    showMaxMinChange() {
      if (this.showMaxMin) {
        this.showDataLabel = false;
      }
      if (this.isOpen) {
        this.drawLineChart(
          this.formatData(this.chartData, this.showChart),
          "open-chart" + this.showChart
        );
      } else {
        this.drawLineChart(
          this.formatData(this.chartData, this.showChart),
          "chart" + this.showChart
        );
      }
    },

    selectChange(val) {},

    // 重置筛选项
    resetParams() {
      this.params.year = [this.curStartYear, this.curEndYear];
      this.params.region = "全国";
      this.params.page =1
    },

    // 清空指标
    clearIndicator() {
      this.$emit("clearIndicator");
      this.checked = [];
      this.params.page =1
    },
    // 移出当前指标
    removeIndicator(row) {
      console.log(row.row);
      if (this.filterChecked.length > 0) {
        this.filterChecked.splice(
          this.filterChecked.indexOf(row.row.indicator),
          1
        );
        // 像父级传入移除后的指标项
        this.$emit("changeIndicator", this.filterChecked);
        this.getDateIndicator();
      } else {
        this.checked.splice(this.checked.indexOf(row.row.indicator), 1);
        // 像父级传入移除后的指标项
        this.$emit("changeIndicator", this.checked);
        this.getDateIndicator();
      }
    },

    // 图表切换
    switchChart(val) {
      this.showChart = val;
      if (this.isOpen) {
        this.drawLineChart(
          this.formatData(this.chartData, this.showChart),
          "open-chart" + this.showChart
        );
      } else {
        this.drawLineChart(
          this.formatData(this.chartData, this.showChart),
          "chart" + this.showChart
        );
      }
    },

    handleChangeStart(val) {},

    handleChangeEnd(val) {},

    handleCurrentChange(val) {
      this.params.page = val;
      this.getDateIndicator();
    },
    handleSizeChange(val) {
      this.params.page = 1;
      this.params.pageSize = val;
      this.getDateIndicator();
    }
  }
};
</script>
<style lang="less">
.el-tabs.el-tabs--top {
  height: 100%;
  overflow-y: auto;
}
.el-table__fixed::before {
  background-color: #ffffff;
}

.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #ebeef5;
}
</style>
<style lang="less" scoped>
.indicator-date {
  padding: 0 10px 10px 10px;

  .fullscreen-loading {
    background: #ffffff;
  }

  .date-top {
    display: flex;
    align-items: end;

    .title {
      font-size: 13px;
    }

    /deep/ .el-select {
      width: 110px;
    }

    /deep/ .el-input__inner {
      height: 24px;
      color: #545b6d;
    }

    /deep/ .el-input {
      font-size: 13px;
    }

    /deep/ .el-date-editor.el-input {
      width: 110px;
    }

    /deep/ .el-input--mini .el-input__icon {
      line-height: 24px;
    }

    .filter-item {
      display: flex;
      align-items: center;
    }

    .filter-btn {
      margin-left: 30px;
      width: 56px;
      height: 24px;
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
      width: 80px;
      background: #97a2bf;
    }

    .clear {
      width: 80px;
      background: #f4a622;
    }
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

  /deep/ .el-pagination {
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
      border-bottom: 1px solid #dfe5f1;

      .title {
        font-size: 16px;
        font-weight: 600;
        color: #545b6d;
        margin-right: 24px;
      }

      .transform-btn {
        display: flex;
        align-items: center;
        margin-right: 53px;

        .btn {
          width: 72px;
          height: 22px;
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
          box-sizing: border-box;

          &:not(:last-child) {
            margin-right: 10px;
          }

          .img {
            width: 13px;
            margin-right: 4px;
          }
        }
        .active {
          height: 24px;
          border: 0;
          color: #ffffff;
          background: #4877e8;
          transition: all 0.3s ease-in-out;
        }
      }
      .align-center {
        display: flex;
        align-items: center;
      }

      .question-icon {
        font-size: 14px;
        // position: absolute;
        // right: 10px;
      }
    }

    .chart {
      height: 440px;
      padding: 20px 20px;
      box-sizing: border-box;

      .chart1,
      .chart2,
      .chart3 {
        width: calc(100vw - 480px);
        min-width: 800px;
        height: 400px;
      }
    }
  }

  .echarts-card-open {
    margin-top: 0;

    .out {
      position: absolute;
      right: 20px;
      cursor: pointer;
    }

    .chart {
      height: 700px;

      .open-chart1,
      .open-chart2,
      .open-chart3 {
        width: calc(100vw - 20px);
        min-width: 1280px;
        height: 650px;
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

  .open-chart {
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
.indicator-date {
  .el-table thead th > .cell {
    justify-content: center;
    // padding-left: 0;
  }
}
</style>
