<template>
  <div class="scxs">
    <div class="part-title">市场销售</div>
    <template >
      <div class="part-sub-title">全球销售情况</div>
      <div class="charts">
        <div class="chart" id="qqxs" v-show="showQqxs"></div>
      </div>
      <div class="table" v-if="state.length">
        <table>
          <tr>
            <th v-for="item in tableHead" :key="item.field">
              {{ item.label }}
            </th>
          </tr>
          <tr v-for="(row, idx) in state" :key="idx">
            <td v-for="item in tableHead" :key="item.field + '_' + idx">
              {{ row[item.field] || "-" }}
            </td>
          </tr>
        </table>
      </div>
    </template>

    <template >
      <div class="part-sub-title">医院销售情况</div>
      <div class="charts">
        <div class="chart" id="yyxs" v-show="showYyxs"></div>
      </div>
      <div class="table" v-if="state2.length">
        <table>
          <tr>
            <th v-for="item in tableHead2" :key="item.prop">
              {{ item.label }}
            </th>
          </tr>
          <tr v-for="(row, idx) in state2" :key="idx">
            <td v-for="item in tableHead2" :key="item.prop + '_' + idx">
              {{ row[item.prop] || "-" }}
            </td>
          </tr>
        </table>
      </div>
    </template>
  </div>
</template>

<script>
import tablehead from "@/config/tablehead";

const yyxsTableFiled = tablehead.drugreport.yyxsThead;
export default {
  name: "pdf-scxs",
  data() {
    return {
      nuit: "1",
      state: [],
      page: 0,
      total: 0,
      tableHead: [],
      tableHead2: yyxsTableFiled,
      state2: [],
      page2: 0,
      total2: 0,
      qqxs_chart: null,
      yyxs_chart: null,
      showQqxs: true,
      showYyxs: true,
    };
  },
  computed: {
    nuitValue() {
      let value = "";
      switch (this.nuit) {
        case "1":
          value = "万";
          break;
        case "100":
          value = "百万";
          break;
        case "1000":
          value = "千万";
          break;
        case "10000":
          value = "亿";
          break;
      }
      return value;
    },
  },
  props: {
    drugname_standard: {
      default: "",
      type: String,
    },
    company_standard: {
      default: "",
      type: String,
    },
  },
  methods: {
    getTableData(page = 1) {
      // const { drugname_standard, company_standard } = this.$route.query;
      
     return Axios({
        url: "/api/ypxs",
        params: {
          name: this.drugname_standard,
          // company: this.company_standard,
          page,
          pageSize: 10,
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.state = res.data.data.List.res;
            this.page = res.data.data.List.page;
            this.total = res.data.data.List.count;
            this.$nextTick(() => {
                this.getQqxs();
            })
          }
        })
    },
    getTableConf() {
      return Axios({
        url: "/api/config/view?dbname=ypxs",
      }).then((res) => {
        if (res.data.code == 200) {
          this.tableHead = res.data.data.tableconf.filter((t) => t.hidden != 1);
        }
      });
    },
    getTableData2(page = 1) {
      // const { drugname_standard, company_standard } = this.$route.query;
      
      return Axios({
        url: "/api/report/yyxslist",
        params: {
          ylbm: this.drugname_standard,
          page,
          pageSize: 10,
        },
      }).then((res) => {
          if (res.data.code == 200) {
            this.state2 = this.yyxsDealListYear(res.data.data.res);
            this.page2 = page;
            this.total2 = res.data.data.count;
            this.$nextTick(() => {
                this.getYyxs();
            })
          }
        })
    },
    yyxsDealListYear(res) {
      var date = new Date();
      var year = date.getFullYear();
      var _res = [];
      _.map(res, (item, index) => {
        let _item = {
          guifanname: item.guifanname,
          guifanqiye: item.guifanqiye,
          year_4: "",
          year_3: "",
          year_2: "",
          year_1: "",
          year_0: "",
        };
        if (item.year != "") {
          for (let i = 0; i < 5; i++) {
            let reg = new RegExp(
              year - i - 1 + ":([0-9]*)(\\.?)([0-9]{0,2})",
              "gi"
            );
            var find = item.year.match(reg);
            if (find) {
              _item["year_" + i] = find[0].split(":")[1] || 0;
            } else {
              _item["year_" + i] = 0;
            }
          }
        }
        _res.push(_item);
      });
      return _res;
    },
    // 全球销售 图表数据
    async getQqxs() {
      // /api/ypxs/getndxx
      const Datas = await Axios({
        url: "/api/report/ypxs",
        params: {
          ylbm: this.drugname_standard,
        },
      });
      if (Datas.data.code == 200) {
        let kshRes3 = Datas.data.data || [];

        if (!this.isEmpty(kshRes3)) {
          this.showQqxs = false;
          return;
        }
        let xAxis_data = kshRes3.map((t) => t.year);
        let yAxis_data1 = kshRes3.map((t) =>
          this.ypxsNuitChange(this.nuit, Number(t.total))
        );
        let yAxis_data2 = [];
        yAxis_data1.forEach((item, i) => {
          if (i == 0) {
            yAxis_data2.push("");
          } else {
            let tb = Number(
              ((Number(kshRes3[i].total) - Number(kshRes3[i - 1].total)) /
                Number(kshRes3[i - 1].total)) *
                100
            ).toFixed(2);
            yAxis_data2.push(tb);
          }
        });
        this.qqxs_chart = Echarts.init(
          document.querySelector("#qqxs"),
          "westeros"
        );
        this.qqxs_chart.clear();
        this.qqxs_chart.setOption({
          tooltip: {
            trigger: "axis",
            formatter: (params, ticket) => {
              //实现设计图上的提示样式
              let str = params[0].name + "<br>";
              _.map(params, (item) => {
                if (item.seriesType == "bar") {
                  str +=
                    '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:' +
                    item.color +
                    '"></span>' +
                    "销售额（" +
                    this.nuitValue +
                    "元/RMB）: " +
                    this.echartsTooltipMoney(item.value) +
                    "<br>";
                } else if (item.seriesType == "line" && item.value) {
                  str +=
                    '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:' +
                    item.color +
                    '"></span>' +
                    "同比（%）: " +
                    item.value +
                    "<br>";
                }
              });
              return str;
            },
          },
          dataZoom: {
            type: "inside",
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 100,
          },
          grid: {
            containLabel: true,
            top: 60,
            bottom: 70,
          },
          legend: {
            data: [
              {
                name: `销售额（${this.nuitValue}元/RMB）`,
                icon: "circle",
              },
              {
                name: "同比（%）",
              },
            ],
            bottom: 20,
          },
          xAxis: [
            {
              type: "category",
              data: xAxis_data,
              axisPointer: {
                type: "shadow",
              },
              axisLabel: {
                interval: 0,
                rotate: 45,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: `销售额（${this.nuitValue}元/RMB）`,
              axisLabel: {
                formatter: function (value) {
                  if (String(value).length >= 4 && String(value).length < 7) {
                    return value / 1000 + "K";
                  } else if (String(value).length >= 7) {
                    return value / 1000000 + "M";
                  } else {
                    return value;
                  }
                },
                splitLine: {
                  show: false,
                },
              },
            },
            {
              type: "value",
              name: "同比（%）",
              splitLine: {
                show: false,
              },
              axisLabel: {
                formatter: function (value) {
                  return value + "%";
                },
              },
            },
          ],
          series: [
            {
              name: `销售额（${this.nuitValue}元/RMB）`,
              type: "bar",
              barWidth: 10,
              data: yAxis_data1,
            },
            {
              name: "同比（%）",
              type: "line",
              yAxisIndex: 1,
              data: yAxis_data2,
            },
          ],
          fontSize: "14",
        });
      }
    },

    // 年度排行 图表数据
    async getYyxs() {
      // /api/ypxs/getndxx
      const Datas = await Axios({
        url: "/api/report/yyxs",
        params: {
          ylbm: this.drugname_standard,
        },
      });
      if (Datas.data.code == 200) {
        let kshRes3 = Datas.data.data || [];
        if (!this.isEmpty(kshRes3)) {
          this.showYyxs = false;
          return;
        }
        let xAxis_data = kshRes3.map((t) => t.year);
        let yAxis_data1 = kshRes3.map((t) =>
          this.ypxsNuitChange(this.nuit, t.total)
        );
        let yAxis_data2 = [];
        yAxis_data1.forEach((item, i) => {
          if (i == 0) {
            yAxis_data2.push("");
          } else {
            let tb = Number(
              ((kshRes3[i].total - kshRes3[i - 1].total) /
                kshRes3[i - 1].total) *
                100
            ).toFixed(2);
            yAxis_data2.push(tb);
          }
        });
        this.yyxs_chart = Echarts.init(
          document.querySelector("#yyxs"),
          "westeros"
        );
        this.yyxs_chart.clear();
        this.yyxs_chart.setOption({
          tooltip: {
            trigger: "axis",
            formatter: (params, ticket) => {
              //实现设计图上的提示样式
              let str = params[0].name + "<br>";
              _.map(params, (item) => {
                if (item.seriesType == "bar") {
                  str +=
                    '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:' +
                    item.color +
                    '"></span>' +
                    "销售额（" +
                    this.nuitValue +
                    "元/RMB）: " +
                    this.echartsTooltipMoney(item.value) +
                    "<br>";
                } else if (item.seriesType == "line" && item.value) {
                  str +=
                    '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:' +
                    item.color +
                    '"></span>' +
                    "同比（%）: " +
                    item.value +
                    "<br>";
                }
              });
              return str;
            },
          },
          dataZoom: {
            type: "inside",
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 100,
          },
          grid: {
            containLabel: true,
            top: 60,
            bottom: 70,
          },
          legend: {
            data: [
              {
                name: `销售额（${this.nuitValue}元/RMB）`,
                icon: "circle",
              },
              {
                name: "同比（%）",
              },
            ],
            bottom: 20,
          },
          xAxis: [
            {
              type: "category",
              data: xAxis_data,
              axisPointer: {
                type: "shadow",
              },
              axisLabel: {
                interval: 0,
                rotate: 45,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: `销售额（${this.nuitValue}元/RMB）`,
              axisLabel: {
                formatter: function (value) {
                  if (String(value).length >= 4 && String(value).length < 7) {
                    return value / 1000 + "K";
                  } else if (String(value).length >= 7) {
                    return value / 1000000 + "M";
                  } else {
                    return value;
                  }
                },
                splitLine: {
                  show: false,
                },
              },
            },
            {
              type: "value",
              name: "同比（%）",
              splitLine: {
                show: false,
              },
              axisLabel: {
                formatter: function (value) {
                  return value + "%";
                },
              },
            },
          ],
          series: [
            {
              name: `销售额（${this.nuitValue}元/RMB）`,
              type: "bar",
              barWidth: 10,
              data: yAxis_data1,
            },
            {
              name: "同比（%）",
              type: "line",
              yAxisIndex: 1,
              data: yAxis_data2,
            },
          ],
          fontSize: "14",
        });
      }
    },
  },
  async mounted() {
    await this.getTableConf();
    await this.getTableData();

    // this.getTableConf2();
    await this.getTableData2();
    if (this.state.length+this.state2.length == 0) {
        this.$root.$emit('hide-page', '市场销售')
    }
    this.$root.$emit("load-page", "市场销售");
  },
};
</script>

<style scoped lang="less">
.part-title {
  font-size: 22px;
  font-weight: bold;
  color: #002fa7;
  margin-bottom: 10px;
  border-left: 4px solid #002fa7;
  line-height: 1;
  padding-left: 5px;
}
.part-sub-title {
  font-size: 16px;
  color: #333;
  margin-top: 10px;
  margin-bottom: 10px;
  border-left: 2px solid #002fa7;
  line-height: 1;
  padding-left: 5px;
  margin-left: 10px;
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
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }
}
.charts {
  position: relative;
}
.chart {
  height: 300px;
}
</style>