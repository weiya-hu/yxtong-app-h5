<template>
  <div class="companyfilter-ssxx" v-waiting="isLoading">
    <div class="content-title">上市信息</div>

    <!-- 上市基本信息 -->
    <div class="gsxx-title" v-if="ssxxdata.base">上市基本信息</div>
    <table class="tb-t" v-if="ssxxdata.base">
      <tr>
        <td>股票名称</td>
        <td>
          <span>{{ ssxxdata.base.gupiaojiancheng || "-" }}</span>
        </td>
        <td>股票代码</td>
        <td>
          <span>{{ ssxxdata.base.gupiaodaima || "-" }}</span>
        </td>
      </tr>
      <tr>
        <td>上市交易所</td>
        <td>
          <span>{{ ssxxdata.base.shangshileixing || "-" }}</span>
        </td>
        <td>上市板块</td>
        <td>
          <span>{{ ssxxdata.base.shangshibankuai || "-" }}</span>
        </td>
      </tr>
      <tr>
        <td>上市日期</td>
        <td colspan="3">
          <span>{{ ssxxdata.base.shangshiriqi || "-" }}</span>
        </td>
      </tr>
    </table>
    <div v-else style="text-align: center; color: #999;margin-top: 200px;">
      <img src="/static/imgs/trz/no_data.png" alt="" />
      <div class="text">暂无相关数据</div>
    </div>

    <div class="chart-boxs">
      <!-- 年均市值情况（亿元） -->
      <div class="chart-box" v-show="ssxxdata.sz.length">
        <div class="chart-title">年均市值情况（亿元）</div>
        <div class="echarts" id="njsz">
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
export default {
  components: {},
  data() {
    return {
      ssxxdata: {
        sz: [],
      },
      isLoading: true,
    };
  },
  watch: {},
  methods: {
    chartResize() {
      this.$nextTick(() => {
        this.echartsResize("njsz");
      });
    },
    echartsResize(id) {
      if (!document.getElementById(id)) return;
      let echart = Echarts.getInstanceByDom(document.getElementById(id));
      if (echart) echart.resize();
    },
    getSsxxdata() {
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/listed",
          params: {
            id: this.$route.params.id,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.isLoading = false;
          if (res.data.code === 200 && res.data.data) {
            this.ssxxdata = res.data.data;

            this.$nextTick(() => {
              this.drawLineSz(this.ssxxdata.sz);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 年均市值情况绘制
    drawLineSz(data) {
      if (data.length == 0) return;
      let xdata = [],
        ydata = [];
      for (let value of data) {
        xdata.push(value.year);
        ydata.push(value.zongshizhi);
      }
      console.log(xdata, ydata);
      let myChart = Echarts.init(
        document.getElementById("njsz"),
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
              name: `药智数据企业版-${document.title}-年均市值情况（亿元）`,
              icon: "image:///static/imgs/echarts/download.png",
            },
          },
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          data: xdata,
        },
        yAxis: {
          type: "value",
        },
        tooltip: {
          show: true,
          trigger: "axis",
        },
        grid: {
          show: false,
          containLabel: true,
          bottom: 30,
        },
        series: [
          {
            name: "市值（单位：亿元）",
            data: ydata,
            type: "line",
          },
        ],
      });
    },
  },
  created() {},
  mounted() {
    this.getSsxxdata();
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

.companyfilter-ssxx {
  height: 100%;
  .gsxx-title {
    margin-top: 20px;
  }

  .tb-t {
    width: calc(100% - 20px);
    margin: 0 10px 10px 10px;

    tr {
      td {
        box-sizing: border-box;
        height: 32px;
        border: 1px solid #ebeef5;
        font-size: 13px;
        font-weight: 400;
        color: #333333;
        line-height: 32px;
        padding: 8px 8px 8px 2%;

        // max-width: 30vw;
        &:nth-child(odd) {
          min-width: 110px;
          width: 180px;
          background: #fafbfd;
        }

        &:nth-child(even) {
          width: 30vw;
          min-width: 270px;
          word-wrap: break-word;
          word-break: break-all;
          white-space: normal;
          background: #fff;
          line-height: 23px;
        }

        &:nth-child(2n) {
          padding: 8px 8px 8px 2%;
          color: #5c6973;
        }
      }
    }
  }

  .chart-boxs {
    .chart-box {
      background: #fafbfd;
      border-radius: 3px;
      margin: 10px;
      width: calc(100% - 20px);

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
  }
}
</style>
