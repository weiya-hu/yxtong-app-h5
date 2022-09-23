<template>
  <div class="scxs">
    <div style="display: flex">
      <div class="notify"  v-show="showQqxs">
        数据说明： 此处数据来自全球畅销药品销售数据，立即
        <a
          href="/ypxs/list?ga_source=vip&ga_name=globaldrugs_sjts"
          target="_blank"
          onclick="_paq.push(['trackEvent', 'button', 'click', '全球药物2.0_数据透视_全球畅销药品销售数据_进入数据库', ])"
          >进入数据库</a
        >
        查看更多数据。
      </div>
      <div class="notify" v-show="showYyxs">
        数据说明： 此处数据来自医院销售数据，立即
        <a
          href="/yyxs/list?ga_source=vip&ga_name=globaldrugs_sjts"
          target="_blank"
          onclick="_paq.push(['trackEvent', 'button', 'click', '全球药物2.0_数据透视_医院销售数据_进入数据库', ])"
          >进入数据库</a
        >
        查看更多数据。
      </div>
    </div>
    <div class="charts">
      <div class="chart" id="qqxs" v-show="showQqxs"></div>
      <div class="chart" id="yyxs" v-show="showYyxs"></div>
      <div class="chart-title">
        <div class="chart-title-item" v-show="showQqxs">全球销售情况</div>
        <div class="chart-title-item" v-show="showYyxs">医院销售情况</div>
      </div>
    </div>
    <el-tabs>
      <el-tab-pane v-if="state.length" label="全球销售情况">
        <el-table :data="state" v-waiting="loading" style="width: 100%">
          <el-table-column
            v-for="item in tableHead"
            :prop="item.field"
            :min-width="item.field_width || item.width || 100"
            :key="item.field"
            :label="item.label"
          >
            <template :slot="1 ? 'header' : ''" slot-scope="scope">
              <span>
                {{ item.label }}
              </span>
              <el-tooltip
                v-if="item.statement"
                class=""
                effect="zhuce"
                placement="right"
              >
                <div slot="content" v-html="item.statement"></div>
                <i
                  class="el-icon-question cl-green"
                  style="margin-left: 4px; line-height: 28px"
                ></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div :title="scope.row[item.field]">
                <div v-if="item.field === 'brandname'">
                  <span v-if="vueCheckListPms('Yaopinxiaoshou', item.label)">
                    <a
                      :href="'/ypxs/' + scope.row.id"
                      target="_blank"
                      class="cl-blue"
                      >{{ scope.row.brandname
                      }}{{
                        scope.row.brandnamecn
                          ? `(${scope.row.brandnamecn})`
                          : ""
                      }}</a
                    >
                  </span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <div v-else-if="item.field === 'value'">
                  <span v-if="vueCheckListPms('Yaopinxiaoshou', item.label)">{{
                    echartsTooltipMoney(ypxsNuitChange(1, scope.row.value))
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-else-if="item.field === 'targets'" :title="''">
                  <template
                    v-if="vueCheckListPms('Yaopinxiaoshou', item.label)"
                  >
                    <TooltipBD
                      :targets="scope.row.targets"
                      :targets_abbr="scope.row.targets_abbr"
                    />
                  </template>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <div v-else>
                  <span v-if="vueCheckListPms('Yaopinxiaoshou', item.label)">{{
                    scope.row[item.field]
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <template slot="append">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="10"
              layout="total, prev, next"
              hide-on-single-page
              :total="total"
            >
            </el-pagination>
          </template>
        </el-table>
      </el-tab-pane>
      <el-tab-pane v-if="state2.length" label="医院销售情况">
        <el-table v-waiting="loading2" :data="state2" style="width: 100%">
          <el-table-column
            v-for="item in tableHead2"
            :prop="item.prop"
            :min-width="item.width"
            :key="item.prop"
            :label="item.label"
          >
            <template slot-scope="scope">
              <div v-if="item.prop === 'guifanname'">
                {{ scope.row.guifanname || "-" }}
              </div>
              <div v-if="item.prop === 'guifanqiye'">
                {{ scope.row.guifanqiye || "-" }}
              </div>
              <div v-if="item.prop === 'year_4'">
                {{ scope.row.year_4 || "-" }}
              </div>
              <div v-if="item.prop === 'year_3'">
                {{ scope.row.year_3 || "-" }}
              </div>
              <div v-if="item.prop === 'year_2'">
                {{ scope.row.year_2 || "-" }}
              </div>
              <div v-if="item.prop === 'year_1'">
                {{ scope.row.year_1 || "-" }}
              </div>
              <div v-if="item.prop === 'year_0'">
                {{ scope.row.year_0 || "-" }}
              </div>
            </template>
          </el-table-column>
          <template slot="append">
            <el-pagination
              @current-change="handleCurrentChange2"
              :current-page="page2"
              :page-size="10"
              layout="total, prev, next"
              hide-on-single-page
              :total="total2"
            >
            </el-pagination>
          </template>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tablehead from "@/config/tablehead";

const yyxsTableFiled = tablehead.drugreport.yyxsThead;

// 数据透视 -》 市场销售
export default {
  name: "scxs",
  data() {
    return {
      nuit: "1",
      tableHead: [],
      state: [],
      page: 0,
      total: 0,
      loading: false,
      tableHead2: yyxsTableFiled,
      state2: [],
      page2: 0,
      total2: 0,
      loading2: false,

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
    handleCurrentChange(e) {
      this.getTableData(e);
    },
    handleCurrentChange2(e) {
      this.getTableData2(e);
    },
    getTableData(page = 1) {
      // const { drugname_standard, company_standard } = this.$route.query;
      this.loading = true;
      Axios({
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
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getTableConf() {
      Axios({
        url: "/api/config/view?dbname=ypxs",
      }).then((res) => {
        if (res.data.code == 200) {
          this.tableHead = res.data.data.tableconf.filter((t) => t.hidden != 1);
        }
      });
    },
    getTableData2(page = 1) {
      // const { drugname_standard, company_standard } = this.$route.query;
      this.loading2 = true;
      Axios({
        url: "/api/report/yyxslist",
        params: {
          ylbm: this.drugname_standard,
          page,
          pageSize: 10,
        },
      })
        .then((res) => {
          console.log("yyxs-state", res.data);
          if (res.data.code == 200) {
            this.state2 = this.yyxsDealListYear(res.data.data.res);
            this.page2 = page;
            this.total2 = res.data.data.count;
          }
        })
        .finally(() => {
          this.loading2 = false;
        });
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
              ((kshRes3[i].total - kshRes3[i - 1].total) / kshRes3[i - 1].total) *
                100
            ).toFixed(2);
            yAxis_data2.push(tb);
          }
        });
        console.log(xAxis_data, yAxis_data1, yAxis_data2, "yyxs");
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
  mounted() {
    this.getTableConf();
    this.getTableData();

    // this.getTableConf2();
    this.getTableData2();

    this.getQqxs();
    this.getYyxs();
    let _this = this;
    window.onresize = function () {
      let charts = [_this.qqxs_chart, _this.yyxs_chart];
      charts.forEach((chart) => {
        chart.resize();
      });
    };
  },
};
</script>

<style scoped lang="less">
@import url(../table-style.less);

.scxs {
  padding: 10px;

  .notify {
    font-size: 13px;
    flex: 1;
    a {
      color: #002fa7;
      text-decoration: underline;
      // font-size: 14px;
    }
  }

  .charts {
    display: flex;
    margin-bottom: 15px;
    position: relative;
    .chart {
      flex: 1;
      height: 300px;
    }
    .chart-title {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      display: flex;
      &-item {
        // flex: 1;
        text-align: center;
        width: 50%;
      }
    }
  }
}
</style>