<template>
  <div class="zlbj">
    <div class="notify">
      数据说明： 此处数据来自药智专利通，立即
      <a
        href="https://patent.yaozh.com?ga_source=vip&ga_name=globaldrugs_sjts"
        target="_blank"
        onclick="_paq.push(['trackEvent', 'button', 'click', '全球药物2.0_数据透视_药智专利通_进入药智专利通', ])"
        >进入专利通</a
      >
      查看更多数据。
    </div>
    <div class="pz-section" v-if="cn.total">
      <div class="pz-section-title">
        <div style="display: flex; align-items: center">
          <img
            src="/static/imgs/state/icons/China.png"
            style="width: 21px; margin-right: 5px"
            alt=""
          />
          <span style="color: #333">中国专利</span>
          <span v-if="cn.total" style="color: #9aa4b8">（{{ cn.total }}）</span>
        </div>
        <div>
          <!-- <span>导出</span> -->
        </div>
      </div>
      <div class="pz-section-content">
        <div class="charts cn-charts" v-show="zllxloaded || sqnfloaded">
          <div class="chart" id="zllx" v-show="zllxloaded"></div>
          <div class="chart" id="sqnf" v-show="sqnfloaded"></div>
          <div class="chart-title">
            <div class="chart-title-item" v-show="zllxloaded">专利类型</div>
            <div class="chart-title-item" v-show="sqnfloaded">申请年份</div>
          </div>
        </div>
        <el-table v-waiting="cn.loading" :data="cn.state" style="width: 100%">
          <el-table-column
            v-for="item in tableHead.cn"
            :prop="item.prop"
            :min-width="item.width"
            :key="item.prop"
            :label="item.label"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <div
                v-if="item.prop === 'PN'"
                class="text"
                style="cursor: pointer"
                :title="scope.row.PN"
                @click="
                  linkTo(
                    `https://patent.yaozh.com/detail?id=${scope.row.id}&sourceType=cn`
                  )
                "
              >
                {{ scope.row.PN || "-" }}
              </div>
              <div :title="scope.row.APN" v-if="item.prop === 'APN'">
                {{ scope.row.APN || "-" }}
              </div>
              <div :title="scope.row.PBD" v-if="item.prop === 'PBD'">
                {{ scope.row.PBD || "-" }}
              </div>
              <div :title="scope.row.EED" v-if="item.prop === 'EED'">
                {{ scope.row.EED || "-" }}
              </div>
              <div :title="scope.row.TTL" v-if="item.prop === 'TTL'">
                {{ scope.row.TTL || "-" }}
              </div>
              <div :title="scope.row.AN" v-if="item.prop === 'AN'">
                {{ scope.row.AN || "-" }}
              </div>
            </template>
          </el-table-column>
          <template slot="append">
            <el-pagination
              @current-change="handleCurrentChange('cn', $event)"
              :current-page="cn.page"
              :page-size="10"
              layout="total, prev, next"
              hide-on-single-page
              :total="cn.total"
            >
            </el-pagination>
          </template>
        </el-table>
      </div>
    </div>
    <div class="pz-section" v-if="all.total">
      <div class="pz-section-title">
        <div style="display: flex; align-items: center">
          <img
            src="/static/imgs/state/icons/United Nations.png"
            style="width: 21px; margin-right: 5px"
            alt=""
          />
          <span style="color: #333">世界</span>
          <span v-if="all.total" style="color: #9aa4b8"
            >（{{ all.total }}）</span
          >
        </div>
        <div>
          <!-- <span>导出</span> -->
        </div>
      </div>
      <div class="pz-section-content">
        <div class="charts all-charts" v-show="sfgxqloaded || jslxloaded">
          <div class="chart" id="sfgxq" v-show="sfgxqloaded"></div>
          <div class="chart" id="jslx" v-show="jslxloaded"></div>
          <div class="chart-title">
            <div class="chart-title-item" v-show="sfgxqloaded">司法管辖区</div>
            <div class="chart-title-item" v-show="jslxloaded">技术类型</div>
          </div>
        </div>
        <el-table v-waiting="all.loading" :data="all.state" style="width: 100%">
          <el-table-column
            v-for="item in tableHead.all"
            :prop="item.prop"
            :min-width="item.width"
            :key="item.prop"
            :label="item.label"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <div
                v-if="item.prop === 'PN'"
                class="text"
                style="cursor: pointer"
                :title="scope.row.PN"
                @click="
                  linkTo(
                    `https://patent.yaozh.com/detail?id=${scope.row.id}&sourceType=all`
                  )
                "
              >
                {{ scope.row.PN || "-" }}
              </div>
              <div :title="scope.row.TPI" v-if="item.prop === 'TPI'">
                {{ scope.row.TPI || "-" }}
              </div>
              <div :title="scope.row.PBD" v-if="item.prop === 'PBD'">
                {{ scope.row.PBD || "-" }}
              </div>
              <div :title="scope.row.EED" v-if="item.prop === 'EED'">
                {{ scope.row.EED || "-" }}
              </div>
              <div :title="scope.row.TTL" v-if="item.prop === 'TTL'">
                {{ scope.row.TTL || "-" }}
              </div>
              <div :title="scope.row.AN" v-if="item.prop === 'AN'">
                {{ scope.row.AN || "-" }}
              </div>
            </template>
          </el-table-column>
          <template slot="append">
            <el-pagination
              @current-change="handleCurrentChange('all', $event)"
              :current-page="all.page"
              :page-size="10"
              layout="total, prev, next"
              hide-on-single-page
              :total="all.total"
            >
            </el-pagination>
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import tablehead from "@/config/tablehead";
const cnTableFiled = tablehead.drugreport.parent.cn;
const AllTableFiled = tablehead.drugreport.parent.all;
const UsTableFiled = tablehead.drugreport.parent.us;
export default {
  name: "zlbj",
  data() {
    return {
      // 批准的 table 表头渲染  根据接口来
      pztablehead: [
        { label: "批准号", key: "pzh" },
        { label: "药品名称", key: "ywmc" },
        { label: "企业名称", key: "qymc" },
        { label: "剂型", key: "jx" },
        { label: "市场状态", key: "sczt" },
        { label: "批准日期", key: "pzrq" },
      ],
      tableHead: {
        cn: cnTableFiled,
        us: UsTableFiled,
        all: AllTableFiled,
      },
      cn: {
        state: [],
        page: 0,
        total: 0,
        loading: false,
      },
      all: {
        state: [],
        page: 0,
        total: 0,
        loading: false,
      },
      zllx_chart: null,
      sqnf_chart: null,
      sfgxq_chart: null,
      jslx_chart: null,
      zllxloaded: false,
      sqnfloaded: false,
      sfgxqloaded: false,
      jslxloaded: false,
    };
  },
  props: {
    base: {
      default: () => ({}),
      type: Object,
    },
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
    handleCurrentChange(type, e) {
      this.getZlData(e, type);
    },
    linkTo(url) {
      window.open(url);
    },
    // /lineat/dblist
    async getZlData(page = 1, type = "all") {
      this[type].loading = true;
      await Axios({
        url: "/lineat/dblist",
        params: {
          sort: "publicationdate=desc",
          words:
            type === "cn"
              ? "KWS=" + this.base.zwname
              : "KWS=" + this.drugname_standard,
          sourceType: type,
          pageSize: 10,
          page,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this[type].state = res.data.data.lists;
          this[type].page = page;
          this[type].total = res.data.data.totle;
        }
        this[type].loading = false;
      });
    },
    // getCnCharts
    getCNCharts() {
      Axios({
        url: "/lineat/dbgroups",
        params: {
          words: `KWS=${this.drugname_standard}`,
          sourceType: "cn",
        },
      }).then((res) => {
        if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          if (this.isEmpty(res.data.data.ATP)) this.zllxloaded = true;
          if (this.isEmpty(res.data.data.FLY)) this.sqnfloaded = true;
          this.$nextTick(() => {
            if (this.isEmpty(res.data.data.ATP))
              this.drawZllx(res.data.data.ATP);
            if (this.isEmpty(res.data.data.FLY))
              this.dralSqnf(res.data.data.FLY);
          });
        }
      });
    },
    // getAllCharts
    getAllCharts() {
      Axios({
        url: "/lineat/dbgroups",
        params: {
          words: `KWS=${this.drugname_standard}`,
          sourceType: "all",
        },
      }).then((res) => {
        if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          if (this.isEmpty(res.data.data.COT)) this.sfgxqloaded = true;
          if (this.isEmpty(res.data.data.TPI)) this.jslxloaded = true;
          this.$nextTick(() => {
            if (this.isEmpty(res.data.data.COT))
              this.drawSfgxq(res.data.data.COT);

            if (this.isEmpty(res.data.data.TPI))
              this.drawJslx(res.data.data.TPI);
          });
        }
      });
    },
    // 绘制专利布局 板块 图像
    drawZllx(data) {
      let x_data = data.map((t) => t.value);
      let series_data = data.map((t) => ({
        name: t.value,
        value: t.num,
      }));
      this.zllx_chart = Echarts.init(
        document.querySelector("#zllx"),
        "westeros"
      );
      this.zllx_chart.clear();
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>数量：{c}<br/>占比：{d}%",
        },
        grid: {
          containLabel: true,
        },
        legend: {
          type: "scroll",
          right: 20,
          bottom: 20,
          orient: "vertical",
          data: x_data,
          containLabel: true,
        },
        series: [
          {
            type: "pie",
            label: {
              normal: {
                show: false,
                position: "outside",
              },
              emphasis: {
                show: true,
                formatter: "{d}%",
                align: "center",
                textStyle: {
                  fontSize: "14",
                  fontWeight: "bold",
                },
              },
            },
            data: series_data,
          },
        ],
      };
      this.zllx_chart.setOption(option);
    },
    // 绘制专利年份 图像
    dralSqnf(data) {
      let x_data = data.map((t) => t.value);
      let s_data = data.map((t) => t.num);
      this.sqnf_chart = Echarts.init(
        document.querySelector("#sqnf"),
        "westeros"
      );
      this.sqnf_chart.clear();
      let option = {
        legend: {
          show: true,
          bottom: 25,
          data: ["数量"],
        },
        tooltip: {
          trigger: "axis",
          position: "right",
        },
        grid: {
          containLabel: true,
          bottom: 60,
        },
        dataZoom: {
          id: "dataZoomX",
          show: true,
          startValue: x_data.length - 12,
          endValue: x_data.length - 1,
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
          data: x_data,
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
            name: "数量",
            type: "line",
            connectNulls: true,
            data: s_data,
          },
        ],
      };
      if (x_data.length < 12) {
        delete option.dataZoom;
      }
      this.sqnf_chart.setOption(option);
    },
    // 绘制司法管辖区
    drawSfgxq(data) {
      let s_data = data.map((t) => ({
        name: Store.state.Conf.stateObj[t.value]["cn"],
        value: t.num,
      }));
      this.sfgxq_chart = Echarts.init(
        document.querySelector("#sfgxq"),
        "westeros"
      );
      this.sfgxq_chart.clear();
      let option = {
        grid: {
          containLabel: true,
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: <br/>{c} ({d}%)",
        },
        series: [
          {
            type: "pie",
            minAngle: 6,
            avoidLabelOverlap: true,
            radius: "70%",
            data: s_data,
          },
        ],
      };
      this.sfgxq_chart.setOption(option);
    },
    // 绘制技术类型
    drawJslx(data) {
      let xAxis_data = data.map((t) => t.value);
      let s_data = data.map((t) => ({
        name: t.value,
        value: t.num,
      }));
      this.jslx_chart = Echarts.init(
        document.querySelector("#jslx"),
        "westeros"
      );
      this.jslx_chart.clear();
      let option = {
        grid: {
          containLabel: true,
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: <br/>数量：{c} ",
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
            data: s_data,
            barMaxWidth: 30,
            label: {
              show: true,
              position: "top",
            },
          },
        ],
      };
      this.jslx_chart.setOption(option);
    },
  },
  async mounted() {
    await this.getZlData(1, "cn");
    await this.getZlData(1, "all");

    if (this.cn.total + this.all.total == 0) {
      console.log("hide");
      this.$root.$emit("showZlbj", false);
    }
    this.getCNCharts();
    this.getAllCharts();

    let _this = this;
    window.onresize = function () {
      let charts = [
        _this.zllx_chart,
        _this.sqnf_chart,
        _this.sfgxq_chart,
        _this.jslx_chart,
      ];
      charts.forEach((chart) => {
        chart.resize();
      });
    };
  },
};
</script>

<style  scoped lang="less">
@import url(../table-style.less);
.zlbj {
  padding: 10px;
  position: relative;
}
.notify {
  font-size: 13px;
  a {
    color: #002fa7;
    text-decoration: underline;
    // font-size: 14px;
  }
}
.pz-section {
  margin-bottom: 10px;
  &-title {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.charts {
  display: flex;
  position: relative;
  margin-bottom: 15px;
  padding-bottom: 15px;
  .chart {
    // flex: 1;
    width: 50%;
    height: 400px;
  }
  .chart-title {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    &-item {
      width: 50%;
      text-align: center;
      font-size: 14px;
      font-weight: bold;
    }
  }
}
.text {
  color: #002fa8;
}
/deep/.el-table__header-wrapper .cell {
  display: block;
  padding-left: 0;
}
</style>