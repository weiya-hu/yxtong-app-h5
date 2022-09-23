<template>
  <div class="xwzx">
    <div class="part-title">中国注册申报</div>
    <div class="charts">
      <div class="chart-item">
        <div class="chart" id="sbqs"></div>
        <!-- <div class="name">申报趋势</div> -->
      </div>
      <div class="chart-item">
        <div class="chart" id="blzt"></div>
        <!-- <div class="name">办理状态</div> -->
      </div>
      <div class="chart-item">
        <div class="chart" id="sqlx"></div>
        <!-- <div class="name">申请类型</div> -->
      </div>
      <div class="chart-item">
        <div class="chart" id="psjl"></div>
        <!-- <div class="name">审评结论</div> -->
      </div>
    </div>
    <div class="table">
      <table>
        <tr>
          <th v-for="(head, hi) in tableHead" :key="hi">
            {{ head.label }}
          </th>
        </tr>
        <tr v-for="(row, idx) in datas" :key="idx">
          <td v-for="(head, hi) in tableHead" :key="hi">
            <div>{{ row[head.field] || "-" }}</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "pdf-zgzcsb",
  props: {
    drugname_standard: {
      default: "",
      type: String,
    },
    company_standard: {
      default: "",
      type: String,
    },
    base: {
      default: () => ({}),
      type: Object,
    },
  },
  data() {
    return {
      datas: [],
      tableHead: [],
      sbqs_chart: null,
      blzt_chart: null,
      sqlx_chart: null,
      psjl_chart: null,
    };
  },
  methods: {
    // sbqs 申报趋势图表 api/zhuce/visualizationNew
    async setSbqsLine() {
      let Datas = await Axios({
        url: "/api/zhuce/visualizationNew",
        params: {
          ismore: 0,
          chengbanriqiType: "year",
          action: "shenbaoshuliang",
          name1: this.drugname_standard,
        },
      });
      if (Datas.data.code == 200) {
        let xAxis_data = Datas.data.data.map((item) => item.key_as_string);
        let series_data = Datas.data.data.map((item) => item.doc_count);
        this.sbqs_chart = Echarts.init(
          document.querySelector("#sbqs"),
          "westeros"
        );
        this.sbqs_chart.clear();
        let option = {
          legend: {
            show: true,
            bottom: 25,
            data: ["申报数量"],
          },
          tooltip: {
            trigger: "axis",
            position: "right",
          },
          grid: {
            containLabel: true,
            bottom: 60,
          },

          xAxis: {
            data: xAxis_data,
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            splitLine: {
              show: false,
            },
          },
          series: [
            {
              name: "申报数量",
              type: "line",
              connectNulls: true,
              data: series_data,
            },
          ],
        };
        if (xAxis_data.length < 12) {
          delete option.dataZoom;
        }
        this.sbqs_chart.setOption(option);
      }
    },
    // blzt 办理状态图表
    async setBlztBar() {
      let Datas = await Axios({
        url: "/api/zhuce/visualizationNew",
        params: {
          ismore: 0,
          chengbanriqiType: "year",
          action: "guifanzhuangtaizhongwen",
          name1: this.drugname_standard,
        },
      });
      if (Datas.data.code == 200) {
        let xAxis_data = Datas.data.data.map((item) => item.label);
        let series_data = Datas.data.data.map((item) => item.doc_count);
        this.blzt_chart = Echarts.init(
          document.querySelector("#blzt"),
          "westeros"
        );
        this.blzt_chart.clear();
        let option = {
          tooltip: {
            trigger: "item",
            formatter: "{b}:<br />数量: {c}",
          },
          grid: {
            // 控制图的大小，调整下面这些值就可以，
            containLabel: true,
          },
          dataZoom: {
            id: "dataZoomX",
            show: true,
            startValue: xAxis_data.length - 3,
            endValue: xAxis_data.length - 1,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            fillerColor: "rgba(167,183,204,0.4)", // 选中的填充颜色
            left: "center", // 组件离容器左侧的距离,'left', 'center', 'right','20%'
            top: "bottom", // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
            right: "auto", // 组件离容器右侧的距离,'20%'
            bottom: "auto", // 组件离容器下侧的距离,'20%'
            height: 25, //这里可以设置dataZoom的尺寸
          },
          xAxis: {
            type: "category",
            axisLabel: {
              interval: 0,
              rotate: 30,
            },
            data: xAxis_data,
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            type: "value",
            name: "数量",
            splitLine: {
              show: false,
            },
          },
          series: [
            {
              type: "bar",
              label: {
                show: true,
                position: "top",
              },
              barMaxWidth: 30,
              data: series_data,
            },
          ],
        };
        if (xAxis_data.length < 5) {
          delete option.dataZoom;
        }
        this.blzt_chart.setOption(option);
      }
    },
    // 设置 申请类型
    async setSqlxPie() {
      let Datas = await Axios({
        url: "/api/zhuce/visualizationNew",
        params: {
          // shenqingleixing
          ismore: 0,
          chengbanriqiType: "year",
          action: "shenqingleixing",
          name1: this.drugname_standard,
        },
      });
      if (Datas.data.code == 200) {
        let x_data = Datas.data.data.map((item) => item.label);
        let series_data = Datas.data.data.map((item) => ({
          name: item.label,
          value: item.doc_count,
        }));
        this.sqlx_chart = Echarts.init(
          document.querySelector("#sqlx"),
          "westeros"
        );
        this.sqlx_chart.clear();
        let option = {
          grid: {
            containLabel: true,
          },
          // legend: {
          //   type: "scroll",
          //   bottom: 0,
          //   data: x_data,
          // },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c}<br/>占比：{d}%",
          },
          series: [
            {
              type: "pie",
              radius: '60%',
              avoidLabelOverlap: true,
              label: {
                normal: {
                  show: true,
                  position: "outside",
                },
                emphasis: {
                  show: true,
                  formatter: "{d}%",
                  align: "center",
                  textStyle: {
                    fontSize: "12",
                    fontWeight: "bold",
                  },
                },
              },
              labelLine: {
                normal: {
                  show: true,
                },
              },
              data: series_data,
            },
          ],
        };
        this.sqlx_chart.setOption(option);
      }
    },
    // 设置 评审结论
    async setPsjlPie() {
      let Datas = await Axios({
        url: "/api/zhuce/visualizationNew",
        params: {
          // shenqingleixing
          ismore: 0,
          chengbanriqiType: "year",
          action: "xulie",
          name1: this.drugname_standard,
        },
      });
      if (Datas.data.code == 200) {
        let x_data = Datas.data.data.map((item) => item.label);
        let series_data = Datas.data.data.map((item) => ({
          name: item.label,
          value: item.doc_count,
        }));
        this.psjl_chart = Echarts.init(
          document.querySelector("#psjl"),
          "westeros"
        );
        this.psjl_chart.clear();
        let option = {
          grid: {
            containLabel: true,
          },
          // legend: {
          //   type: "scroll",
          //   bottom: 0,
          //   data: x_data,
          // },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c}<br/>占比：{d}%",
          },
          series: [
            {
              type: "pie",
              radius: '60%',
              avoidLabelOverlap: true,
              label: {
                normal: {
                  show: true,
                  position: "outside",
                },
                emphasis: {
                  show: true,
                  formatter: "{d}%",
                  align: "center",
                  textStyle: {
                    fontSize: "12",
                    fontWeight: "bold",
                  },
                },
              },
              labelLine: {
                normal: {
                  show: true,
                },
              },
              data: series_data,
            },
          ],
        };
        this.psjl_chart.setOption(option);
      }
    },
    getTableData(page = 1) {
      this.loading = true;
      // const { drugname_standard, company_standard } = this.$route.query;

      // /api/zhuce
      return Axios({
        url: "/api/zhuce",
        params: {
          name1: this.drugname_standard,
          // qiyemingcheng: this.company_standard,
          // shoulihao_IN: drugids,
          page,
          pageSize: 10,
        },
      })
        .then((res) => {
          if (res.data.code == 200 && this.isEmpty(res.data.data)) {
            this.datas = res.data.data.List.res;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // /api/config/view?dbname=zhuce
    getTableConf() {
      Axios({
        url: "/api/config/view?dbname=zhuce",
      }).then((res) => {
        if (res.data.code == 200) {
          this.tableHead = res.data.data.tableconf.filter((t) => t.hidden != 1);
        }
      });
    },
  },
  async mounted() {
    this.setSbqsLine();
    this.setBlztBar();
    this.setSqlxPie();
    this.setPsjlPie();
    await this.getTableData();
    this.getTableConf();
    if (this.datas.length == 0) {
      this.$root.$emit('hide-page','中国注册申报')
    }
    this.$root.$emit("load-page", "中国注册申报");
  },
};
</script>

<style lang="less" scoped>
.part-title {
  font-size: 22px;
  font-weight: bold;
  color: #002fa7;
  margin-bottom: 10px;
  border-left: 4px solid #002fa7;
  line-height: 1;
  padding-left: 5px;
}
.table {
  position: relative;
  padding-left: 10px;
  min-height: 50px;
  table {
    width: 100%;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    border-spacing: 0;
    th {
      height: 30px;
      background-color: #ebeef5;
      font-size: 12px;
    }
    td {
      padding: 5px;
      border: 1px solid #ebeef5;
      word-break: break-all;
      font-size: 12px;
      & > div {
        font-size: 12px;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // -webkit-line-clamp: 2;
        // -webkit-box-orient: vertical;
      }
    }
  }
}
.charts {
  display: flex;
  flex-wrap: wrap;
  .chart-item {
    width: 50%;
    .chart {
      width: 300px;
      height: 300px;
      margin: 0 auto;
    }
    .name {
      text-align: center;
    }
  }
}
</style>