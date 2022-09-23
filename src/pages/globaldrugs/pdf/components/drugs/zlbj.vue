<template>
  <div class="zlbj">
    <div class="part-title">专利布局</div>

    <template>
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
      </div>
      <div class="content">
        <div class="charts" v-show="zllxloaded || sqnfloaded">
          <div class="chart" id="zllx" v-show="zllxloaded"></div>
          <div class="chart" id="sqnf" v-show="sqnfloaded"></div>
          <div class="chart-title">
            <div class="chart-title-item" v-show="zllxloaded">专利类型</div>
            <div class="chart-title-item" v-show="sqnfloaded">申请年份</div>
          </div>
        </div>
        <div class="table">
          <table>
            <tr>
                <th 
                :style="{width: head.width+'px'}"
                v-for="(head, hi) in tableHead.cn" :key="hi">
                    {{head.label}}
                </th>
            </tr>
            <tr v-for="(row, idx) in cn.state" :key="idx">
                <td v-for="(head, j) in tableHead.cn" :key="idx+'+'+j">
                    <div>{{row[head.prop] || '-'}} </div>
                </td>
            </tr>
          </table>
        </div>
      </div>
    </template>

    <template>
      <div class="pz-section-title">
        <div style="display: flex; align-items: center">
          <img
            src="/static/imgs/state/icons/United Nations.png"
            style="width: 21px; margin-right: 5px"
            alt=""
          />
          <span style="color: #333">世界专利</span>
          <span v-if="all.total" style="color: #9aa4b8"
            >（{{ all.total }}）</span
          >
        </div>
      </div>
      <div class="content">
        <div class="charts" v-show="sfgxqloaded || jslxloaded">
          <div class="chart" id="sfgxq" v-show="sfgxqloaded"></div>
          <div class="chart" id="jslx" v-show="jslxloaded"></div>
          <div class="chart-title">
            <div class="chart-title-item" v-show="sfgxqloaded">司法管辖区</div>
            <div class="chart-title-item" v-show="jslxloaded">技术类型</div>
          </div>
        </div>
        <div class="table">
          <table>
            <tr>
                <th v-for="(head, hi) in tableHead.all" :key="hi"
                :style="{width: head.width+'px'}"
                >
                    {{head.label}}
                </th>
            </tr>
            <tr v-for="(row, idx) in all.state" :key="idx">
                <td v-for="(head, j) in tableHead.all" :key="idx+'+'+j">
                    <div>{{row[head.prop] || '-'}} </div>
                </td>
            </tr>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import tablehead from "@/config/tablehead";
const cnTableFiled = tablehead.drugreport.parent.cn;
const AllTableFiled = tablehead.drugreport.parent.all;
export default {
  name: "pdf-zlbj",
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
      tableHead: {
        cn: cnTableFiled,
        all: AllTableFiled,
      },
      cn: {
        state: [],
        total: 0,
      },
      all: {
        state: [],
        total: 0,
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
  methods: {
    // /lineat/dblist
    async getZlData(page = 1, type = "all") {
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
          this[type].total = res.data.data.totle;
        }
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
            radius: "60%",
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
      this.$root.$emit("hide-page", '专利布局');
    }
    this.getCNCharts();
    this.getAllCharts();
    this.$root.$emit("load-page", "专利布局");
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
.pz-section-title {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  display: flex;
  position: relative;
  margin-bottom: 15px;
  padding-bottom: 15px;
  .chart {
    // flex: 1;
    width: 375px;
    height: 375px;
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
</style>