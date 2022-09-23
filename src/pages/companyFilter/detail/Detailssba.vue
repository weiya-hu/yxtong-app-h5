<template>
  <div class="companyfilter-ssba">
    <div class="content-title">医疗器械上市&备案</div>
    <div class="chart-boxs">
      <!-- 年度变化情况 -->
      <div class="chart-box ndbh">
        <div class="chart-title">
          年度变化情况
          <el-tooltip class="" effect="zhuce" placement="right">
            <div slot="content">含延续注册医疗器械</div>
            <i
              class="el-icon-question cl-green"
              style="margin-left: 4px; line-height: 28px"
            ></i>
          </el-tooltip>
        </div>
        <LoadingGif
          :className="'list-in-loading'"
          :classNameImg="'little-size-loading'"
          :loadFlag="chartloading1"
          v-if="chartloading1"
        ></LoadingGif>
        <div v-else class="echarts" id="ndbh">
          <div class="no-data">
            <img src="/static/imgs/trz/no_data.png" alt="" />
            <div class="text">暂无相关数据</div>
          </div>
        </div>
      </div>

      <!-- 上市管理类别 -->
      <div class="chart-box">
        <div class="chart-title">上市管理类别</div>
        <LoadingGif
          :className="'list-in-loading'"
          :classNameImg="'little-size-loading'"
          :loadFlag="chartloading2"
          v-if="chartloading2"
        ></LoadingGif>
        <div v-else class="echarts" id="ssgllb">
          <div class="no-data">
            <img src="/static/imgs/trz/no_data.png" alt="" />
            <div class="text">暂无相关数据</div>
          </div>
        </div>
      </div>

      <!-- 国产/进口 -->
      <div class="chart-box">
        <div class="chart-title">国产/进口</div>
        <LoadingGif
          :className="'list-in-loading'"
          :classNameImg="'little-size-loading'"
          :loadFlag="chartloading3"
          v-if="chartloading3"
        ></LoadingGif>
        <div v-else class="echarts" id="gcjk">
          <div class="no-data">
            <img src="/static/imgs/trz/no_data.png" alt="" />
            <div class="text">暂无相关数据</div>
          </div>
        </div>
      </div>
    </div>
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
      chartloading1: true,
      chartloading2: true,
      chartloading3: true,
    };
  },
  watch: {},
  methods: {
    chartResize() {
      this.$nextTick(() => {
        this.echartsResize("ndbh");
        this.echartsResize("ssgllb");
        this.echartsResize("gcjk");
      });
    },
    echartsResize(id) {
      if (!document.getElementById(id)) return;
      let echart = Echarts.getInstanceByDom(document.getElementById(id));
      if (echart) echart.resize();
    },
    // 获取年度变化情况数据
    getChartDataNdbh() {
      this.chartloadin1 = true;
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/listFiling",
          params: {
            id: this.$route.params.id,
            position: 1,
          },
        })
        .then((res) => {
          this.chartloading1 = false;
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.$nextTick(() => {
              this.drawNdbh(data);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 绘制年度变化情况折线图
    drawNdbh(data) {
      // console.log(data);
      if (data.beian.length === 0 && data.shangshi.length === 0) return;
      let ndbh_xdata = [],
        ndbh_xdata1 = [],
        ndbh_xdata2 = [],
        ndbh_ydata1 = [],
        ndbh_ydata2 = [];
      // 备案
      for (let value of data.beian) {
        ndbh_xdata1.push(value.year);
        ndbh_ydata1.push(value.doc_count);
      }
      // 上市
      for (let value of data.shangshi) {
        ndbh_xdata2.push(value.year);
        ndbh_ydata2.push(value.doc_count);
      }

      // 处理两个数据的年份数量、具体不一致的情况
      if (ndbh_xdata1.length >= ndbh_xdata2.length) {
        for (let index in ndbh_xdata1) {
          if (_.indexOf(ndbh_xdata2, ndbh_xdata1[index]) === -1) {
            ndbh_ydata2.splice(index, 0, "0");
          }
        }
        ndbh_xdata = ndbh_xdata1;
      } else if (ndbh_xdata1.length < ndbh_xdata2.length) {
        for (let index in ndbh_xdata2) {
          if (_.indexOf(ndbh_xdata1, ndbh_xdata2[index]) === -1) {
            ndbh_ydata1.splice(index, 0, "0");
          }
        }
        ndbh_xdata = ndbh_xdata2;
      }

      let myChart = Echarts.init(
        document.getElementById("ndbh"),
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
              name: `药智数据企业版-${document.title}-上市&备案-年度变化情况`,
              icon: "image:///static/imgs/echarts/download.png",
            },
          },
        },
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
          data: ndbh_xdata,
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
          data: ["备案", "上市"],
          bottom: 0,
        },
        series: [
          {
            name: "备案",
            data: ndbh_ydata1,
            type: "line",
          },
          {
            name: "上市",
            data: ndbh_ydata2,
            type: "line",
          },
        ],
      });
    },

    // 获取上市管理类别数据
    getChartDataSsgl() {
      this.chartloading2 = true;
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/listFiling",
          params: {
            id: this.$route.params.id,
            position: 2,
          },
        })
        .then((res) => {
          this.chartloading2 = false;
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.$nextTick(() => {
              this.drawSsgl(data);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 绘制上市管理类别饼图
    drawSsgl(data) {
      console.log(data);
      if (data.length === 0) return;
      let xdata = [],
        legendData = [];
      for (let item of data) {
        if (item.doc_count > 0) {
          let obj = {
            value: item.doc_count,
            name: item.key + "类",
          };
          xdata.push(obj);
          legendData.push(item.key + "类");
        }
      }
      console.log(xdata, legendData, document.getElementById("ssgl"));
      let myChart = Echarts.init(
        document.getElementById("ssgllb"),
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
              name: `药智数据企业版-${document.title}-上市&备案-上市管理类别`,
              icon: "image:///static/imgs/echarts/download.png",
            },
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>数量：{c}<br/>占比：{d}%",
        },
        legend: {
          bottom: 10,
          left: "center",
          data: legendData,
        },
        series: [
          {
            type: "pie",
            radius: "55%",
            avoidLabelOverlap: false,
            center: "50%",
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: "{b}{d}%",
              },
            },
            data: xdata,
          },
        ],
      });
    },

    // 获取国产进口数据
    getChartDataGcjk() {
      this.chartloading3 = true;
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/listFiling",
          params: {
            id: this.$route.params.id,
            position: 3,
          },
        })
        .then((res) => {
          this.chartloading3 = false;
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.$nextTick(() => {
              this.drawGcjk(data);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 绘制国产进口
    drawGcjk(data) {
      console.log(data);
      if (data.length === 0) return;
      let xdata = [],
        gcData = [],
        jkData = [];
      for (let item of data) {
        xdata.push(item.label);
        for (let val of item.children) {
          if (val.label === "国产") {
            gcData.push(val.doc_count);
          } else if (val.label === "进口") {
            jkData.push(val.doc_count);
          }
        }
      }
      console.log(gcData, jkData);
      let myChart = Echarts.init(
        document.getElementById("gcjk"),
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
              name: `药智数据企业版-${document.title}-上市&备案-国产/进口`,
              icon: "image:///static/imgs/echarts/download.png",
            },
          },
        },
        legend: {
          bottom: 0,
          left: "center",
          data: ["国产", "进口"],
        },
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
          data: xdata,
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
        series: [
          {
            name: "国产",
            type: "bar",
            stack: "总量",
            barMaxWidth: 80,
            data: gcData,
          },
          {
            name: "进口",
            type: "bar",
            stack: "总量",
            barMaxWidth: 80,
            data: jkData,
          },
        ],
      });
    },
  },
  mounted() {
    // 获取年度变化情况图表数据
    this.getChartDataNdbh();
    // 获取上市管理类别图表数据
    this.getChartDataSsgl();
    // 获取国产进口图表数据
    this.getChartDataGcjk();
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

.companyfilter-ssba {
  .list-in-loading {
    height: 386px !important;
  }
  .gsxx-title {
    margin-top: 20px;
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

    .ndbh {
      width: calc(100% - 5px) !important;
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
