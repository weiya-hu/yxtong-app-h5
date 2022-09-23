<template>
  <div class="companyfilter-zbcg">
    <LoadingGif
      :className="'list-in-loading'"
      :classNameImg="'little-size-loading'"
      :loadFlag="chartloading"
      v-if="chartloading"
    ></LoadingGif>
    <template v-else>
      <div class="content-title">器械中标&带量采购</div>
      <div class="chart-boxs">
        <!-- 中标次数top10 -->
        <div class="chart-box">
          <div class="chart-title">中标次数top10</div>
          <div class="echarts" id="zbcs">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>
        </div>

        <!-- 带量采购次数top10 -->
        <div class="chart-box">
          <div class="chart-title">带量采购次数top10</div>
          <div class="echarts" id="dlcgcs">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>
        </div>
        <!-- 年度统计情况 -->
        <div class="chart-box ndtj">
          <div class="chart-title">
            年度统计情况
            <el-tooltip class="" effect="zhuce" placement="right">
              <div slot="content">按年统计中标和带量采购的次数</div>
              <i
                class="el-icon-question cl-green"
                style="margin-left: 4px; line-height: 28px"
              ></i>
            </el-tooltip>
          </div>
          <div class="echarts" id="ndtj">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>
        </div>

        <!-- 地区分布情况 -->
        <div class="chart-box ndtj dqfb">
          <div class="chart-title">
            <span
              >地区分布情况<el-tooltip
                class=""
                effect="zhuce"
                placement="right"
              >
                <div slot="content">按地区统计中标和带量采购的次数</div>
                <i
                  class="el-icon-question cl-green"
                  style="margin-left: 4px; line-height: 28px"
                ></i> </el-tooltip
            ></span>

            <el-select v-model="year" type="mini" @change="handleYearChange">
              <el-option
                v-for="(item, index) in yearList"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <LoadingGif
            :className="'list-in-loading'"
            :classNameImg="'little-size-loading'"
            class="chartloading"
            :loadFlag="chartloading2"
            v-if="chartloading2"
          ></LoadingGif>
          <div v-else class="echarts" id="dqfb">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
export default {
  components: {
    LoadingGif,
  },
  data() {
    return {
      chartloading: true,
      chartloading2: true,
      year: "全部年份",
      yearList: [],
    };
  },
  watch: {},
  methods: {
    chartResize() {
      this.$nextTick(() => {
        this.echartsResize("ndtj");
        this.echartsResize("zbcs");
        this.echartsResize("dlcgcs");
        this.echartsResize("dqfb");
      });
    },
    echartsResize(id) {
      if (!document.getElementById(id)) return;
      let echart = Echarts.getInstanceByDom(document.getElementById(id));
      if (echart) echart.resize();
    },
    // 获取顶部所有图表的数据
    getChartDataTop() {
      this.chartloading = true;
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/zbPurchasing",
          params: {
            id: this.$route.params.id,
            position: 1,
          },
        })
        .then((res) => {
          this.chartloading = false;
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.$nextTick(() => {
              this.drawZbcx(data.zhongbiao);
              this.drawDlcg(data.dailiangcaigou);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 绘制中标次数top10
    drawZbcx(data) {
      if (data.length === 0) return;
      data.map((v) => {
        v.doc_count = Number(v.doc_count);
      });
      data = _.orderBy(data, ["doc_count"], ["asc"]);
      let that = this,
        yAxis = data.map((item) => item.name),
        series = data.map((item) => item.doc_count);
      let myChart = Echarts.init(
        document.getElementById("zbcs"),
        "yaozh_theme"
      );
      myChart.setOption({
        toolbox: {
          top: 20,
          right: 20,
          show: true,
          feature: {
            saveAsImage: {
              title: "保存",
              name: `药智数据企业版-${document.title}-中标&带量采购-中标次数top10`,
              icon: "image:///static/imgs/echarts/download.png",
            },
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          bottom: 0,
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
      });
    },
    // 绘制带量采购次数top10
    drawDlcg(data) {
      if (data.length === 0) return;
      data.map((v) => {
        v.doc_count = Number(v.doc_count);
      });
      data = _.orderBy(data, ["doc_count"], ["asc"]);
      let that = this,
        yAxis = data.map((item) => item.name),
        series = data.map((item) => item.doc_count);
      let myChart = Echarts.init(
        document.getElementById("dlcgcs"),
        "yaozh_theme"
      );
      myChart.setOption({
        toolbox: {
          top: 20,
          right: 20,
          show: true,
          feature: {
            saveAsImage: {
              title: "保存",
              name: `药智数据企业版-${document.title}-中标&带量采购-带量采购次数top10`,
              icon: "image:///static/imgs/echarts/download.png",
            },
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          bottom: 0,
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
      });
    },

    // 获取年度统计情况数据
    getChartDataNdtj() {
      this.chartloading = true;
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/zbPurchasing",
          params: {
            id: this.$route.params.id,
            position: 2,
          },
        })
        .then((res) => {
          this.chartloading = false;
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.$nextTick(() => {
              this.drawNdtj(data);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 绘制年度统计
    drawNdtj(data) {
      if (data.zhongbiao.length === 0 && data.dailiangcaigou.length === 0)
        return;
      let ndtj_xdata = [],
        ndtj_xdata1 = [],
        ndtj_xdata2 = [],
        ndtj_ydata1 = [],
        ndtj_ydata2 = [];
      // 中标
      for (let value of data.zhongbiao) {
        ndtj_xdata1.push(value.year);
        ndtj_ydata1.push(value.doc_count);
      }
      // 带量采购
      for (let value of data.dailiangcaigou) {
        ndtj_xdata2.push(value.year);
        ndtj_ydata2.push(value.doc_count);
      }

      // 处理两个数据的年份数量、具体不一致的情况
      if (ndtj_xdata1.length >= ndtj_xdata2.length) {
        for (let index in ndtj_xdata1) {
          if (_.indexOf(ndtj_xdata2, ndtj_xdata1[index]) === -1) {
            ndtj_ydata2.splice(index, 0, "0");
          }
        }
        ndtj_xdata = ndtj_xdata1;
      } else if (ndtj_xdata1.length < ndtj_xdata2.length) {
        for (let index in ndtj_xdata2) {
          if (_.indexOf(ndtj_xdata1, ndtj_xdata2[index]) === -1) {
            ndtj_ydata1.splice(index, 0, "0");
          }
        }
        ndtj_xdata = ndtj_xdata2;
      }

      let myChart = Echarts.init(
        document.getElementById("ndtj"),
        "yaozh_theme"
      );
      myChart.setOption({
        toolbox: {
          top: 20,
          right: 20,
          show: true,
          feature: {
            saveAsImage: {
              title: "保存",
              name: `药智数据企业版-${document.title}-中标&带量采购-年度统计情况`,
              icon: "image:///static/imgs/echarts/download.png",
            },
          },
        },
        dataZoom: [
          {
            id: "dataZoomX",
            show: ndtj_xdata.length>10,
            startValue: ndtj_xdata.length-10,
            endValue: ndtj_xdata.length,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            fillerColor: "rgba(167,183,204,0.4)", // 选中的填充颜色
            bottom: 0, // 组件离容器下侧的距离,'20%'
            height: 25, //这里可以设置dataZoom的尺寸
          },
        ],
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#aaa",
            },
          },
          axisLabel: {
            interval: 0,
            color: "#000",
            rotate: 45,
          },
          data: ndtj_xdata,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#000",
          },
        },
        tooltip: [
          {
            show: true,
            trigger: "axis",
          },
        ],
        grid: {
          show: false,
          containLabel: true,
          bottom: 40,
        },
        legend: {
          data: ["中标", "带量采购"],
          top: 10,
        },
        series: [
          {
            name: "中标",
            data: ndtj_ydata1,
            type: "line",
          },
          {
            name: "带量采购",
            data: ndtj_ydata2,
            type: "line",
          },
        ],
      });
    },
    // 获取地区分布情况
    getChartDataDqfb() {
      this.chartloading2 = true;
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/zbPurchasing",
          params: {
            id: this.$route.params.id,
            year: this.year === "全部年份" ? "" : this.year,
            position: 3,
          },
        })
        .then((res) => {
          this.chartloading2 = false;
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            if (data.years.length > 0 && this.yearList.length === 0) {
              this.yearList = [...["全部年份"], ...data.years];
              console.log(this.yearList);
            }
            this.$nextTick(() => {
              this.drawDqfb(data.regional);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 绘制地区分布图表
    drawDqfb(data) {
      if (data.length === 0) return;
      let xdata = [],
        zbdata = [],
        cgdata = [];
      for (let value of data) {
        xdata.push(value.province);
        zbdata.push(value.zhongbiao);
        cgdata.push(value.dailiangcaigou);
      }

      let myChart = Echarts.init(
        document.getElementById("dqfb"),
        "yaozh_theme"
      );
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        dataZoom: [
          {
            id: "dataZoomX",
            show: true,
            startValue: 0,
            endValue: 9,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            fillerColor: "rgba(167,183,204,0.4)", // 选中的填充颜色
            bottom: 0, // 组件离容器下侧的距离,'20%'
            height: 25, //这里可以设置dataZoom的尺寸
          },
        ],
        grid: [
          {
            bottom: 30,
            containLabel: true,
          },
        ],
        toolbox: {
          top: 20,
          right: 20,
          show: true,
          feature: {
            saveAsImage: {
              title: "保存",
              name: `药智数据企业版-${document.title}-中标&带量采购-地区分布情况`,
              icon: "image:///static/imgs/echarts/download.png",
            },
          },
        },
        xAxis: {
          type: "category",
          data: xdata,
          axisLabel: {
            rotate: 30,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: zbdata,
            type: "bar",
            name: "中标",
            barMaxWidth: 60,
          },
          {
            data: cgdata,
            type: "bar",
            name: "带量采购",
            barMaxWidth: 60,
          },
        ],
      });
    },

    handleYearChange(year) {
      this.getChartDataDqfb();
    },
  },
  mounted() {
    // 获取中标次数和带量采购次数图表数据
    this.getChartDataTop();
    // 获取年度统计情况图表数据
    this.getChartDataNdtj();
    // 获取地区分布情况数据
    this.getChartDataDqfb();
    window.addEventListener("resize", () => {
      this.chartResize();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.chartResize();
    });
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.companyfilter-zbcg {
  .gsxx-title {
    margin-top: 20px;
  }

  .chartloading {
    height: 386px !important;
  }
  .chart-boxs {
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 10px;
    box-sizing: border-box;

    .chart-box {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      margin: 5px 0px;
      width: calc(50% - 5px);
      background: #fafbfd;
      border-radius: 3px;

      .chart-title {
        height: 34px;
        line-height: 34px;
        padding-left: 10px;
        background: #ebeef5;
        font-size: 14px;
        font-weight: bold;
        color: #333333;
      }

      .echarts {
        height: 366px;
        width: calc(100% - 20px);
        margin: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        .no-data {
          text-align: center;
          color: #999;
        }
      }
    }

    .ndtj {
      width: calc(100% - 5px) !important;
    }

    .dqfb {
      .chart-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 10px;

        .el-input--suffix .el-input__inner {
          width: 130px;
          height: 24px;
          font-size: 12px;
          font-weight: normal;
        }
      }
    }
  }

  @media screen and (max-width: 1500px) {
    .chart-boxs {
      .chart-box {
        width: 100%;
      }
    }
  }
}
</style>
