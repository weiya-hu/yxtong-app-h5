<template>
  <div class="companyfilter-lcsy">
    <LoadingGif
      :className="'list-in-loading'"
      :classNameImg="'little-size-loading'"
      :loadFlag="chartloading"
      v-if="chartloading"
    ></LoadingGif>
    <template v-else>
      <div class="content-title">临床试验</div>
      <div class="chart-boxs">
        <!-- 试验分期情况 -->
        <div class="chart-box syfq">
          <div class="chart-title">试验分期情况</div>
          <div class="echarts" id="syfq">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>
        </div>

        <!-- 试验状态 -->
        <div class="chart-box">
          <div class="chart-title">试验状态</div>
          <div class="echarts" id="syzt">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>
        </div>

        <!-- 药品类型 -->
        <div class="chart-box">
          <div class="chart-title">药品类型</div>
          <div class="echarts" id="yplx-lc">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>
        </div>

        <!-- 适应症（前10） -->
        <div class="chart-box">
          <div class="chart-title">适应症（前10）</div>
          <div class="echarts" id="syzq10">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>
        </div>

        <!-- 试验分类 -->
        <div class="chart-box">
          <div class="chart-title">试验分类</div>
          <div class="echarts" id="syfl-lc">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div>
      <div class="gsxx-title" style="margin-bottom: 0">临床试验情况</div>
      <el-tabs
        v-model="activeName"
        @tab-click="handleClickTab"
        ref="lcsytab"
        v-if="tabList.length"
      >
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name + `(${item.value})`"
          :name="index + 1 + ''"
        >
          <span slot="label">
            {{ item.name }}
            <span class="num">({{ item.value }})</span>
          </span>

          <LoadingGif
            class="table-loading"
            :className="'list-in-loading'"
            :classNameImg="'little-size-loading'"
            :loadFlag="loadingTable"
            v-if="loadingTable"
          ></LoadingGif>

          <el-table
            v-else
            fixed
            border
            :data="tableData"
            :header-cell-style="{
              background: '#F5F6FA',
              color: '#333333',
              fontSize: '14px',
              fontWeight: 'bold',
            }"
          >
            <el-table-column
              v-for="item in tableHead"
              :prop="item.prop"
              :min-width="item.width"
              :key="item.prop"
              :label="item.label"
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'dengjiid'">
                  <router-link
                    style="color: #4b79ec"
                    target="_blank"
                    :to="'/linchuangshiyan/' + scope.row.id"
                    >{{ scope.row.me_id }}</router-link
                  >
                </div>
                <div v-else :title="scope.row[item.prop]">
                  <span>{{ scope.row[item.prop] }}</span>
                </div>
              </template>
            </el-table-column></el-table
          >
          <el-pagination
            v-if="tableTotal > 10"
            @current-change="handleCurrentChange"
            :current-page="tableParams.page"
            :page-size="20"
            layout="total, prev, pager, next, jumper"
            :total="tableTotal"
          >
          </el-pagination>
        </el-tab-pane>
      </el-tabs>

      <div v-else style="text-align: center; color: #999; margin: 150px 0">
        <img src="/static/imgs/trz/no_data.png" alt="" />
        <div class="text">暂无相关数据</div>
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
      activeName: "1",
      tabList: [],
      chartloading: true,
      tableParams: {
        pageSize: 20,
        page: 1,
      },
      tableTotal: 0,
      tableData: [],
      tableHead: [
        {
          prop: "dengjiid",
          label: "登记号",
          width: 120,
        },
        {
          prop: "title",
          label: "试验题目",
          width: 150,
        },
        {
          prop: "name",
          label: "药品名称",
          width: 150,
        },
        {
          prop: "type",
          label: "药品类型",
          width: 100,
        },
        {
          prop: "indication",
          label: "适应症",
          width: 120,
        },
        {
          prop: "me_status",
          label: "试验状态",
          width: 120,
        },
        {
          prop: "phase",
          label: "试验分期",
          width: 100,
        },
        {
          prop: "institutes",
          label: "试验机构",
          width: 120,
        },
        {
          prop: "date",
          label: "登记时间",
          width: 120,
        },
      ],
      loadingTable: true,
    };
  },
  watch: {},
  methods: {
    chartResize() {
      this.$nextTick(() => {
        this.echartsResize("syfq");
        this.echartsResize("syzt");
        this.echartsResize("yplx-lc");
        this.echartsResize("syzq10");
        this.echartsResize("syfl-lc");
      });
    },
    echartsResize(id) {
      if (!document.getElementById(id)) return;
      let echart = Echarts.getInstanceByDom(document.getElementById(id));
      if (echart) echart.resize();
    },
    // 获取表格数据
    getTableData() {
      this.loadingTable = true;
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/lcsylist",
          params: {
            id: this.$route.params.id,
            mestatusint: this.activeName,
            ...this.tableParams,
          },
        })
        .then((res) => {
          this.loadingTable = false;
          if (res.data.code === 200 && res.data) {
            this.tableTotal = res.data.data.count;
            this.tableData = res.data.data.res;
          } else {
            this.tableData = [];
            this.tableTotal = 0;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 表格翻页
    handleCurrentChange(e) {
      this.tableParams.page = e;
      this.getTableData();
    },

    // 顶部切换事件
    handleClickTab(tab) {
      this.resetActivePosition(this.$refs.lcsytab.$el);
      this.tableParams = {
        pageSize: 20,
        page: 1,
      };
      this.getTableData();
    },

    resetActivePosition($el) {
      this.$nextTick(() => {
        const activeEl = $el.querySelector(".el-tabs__item.is-active");
        const lineEl = $el.querySelector(".el-tabs__active-bar");
        const style = getComputedStyle(activeEl);
        const pl = style.paddingLeft.match(/\d+/)[0] * 1;
        const pr = style.paddingRight.match(/\d+/)[0] * 1;
        const w = style.width.match(/\d+/)[0] * 1;
        lineEl.style.transform =
          "translateX(" + (activeEl.offsetLeft + pl) + "px)";
        lineEl.style.width = w - pl - pr + "px";
      });
    },

    // 获取顶部所有图表的数据
    getChartData() {
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/lcsy",
          params: {
            id: this.$route.params.id,
          },
        })
        .then((res) => {
          this.chartloading = false;
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.tabList = [
              {
                value: data.tongji.jxz,
                name: "进行中",
              },
              {
                value: data.tongji.wc,
                name: "完成",
              },
              {
                value: data.tongji.swks,
                name: "尚未开始",
              },
              {
                value: data.tongji.zd,
                name: "暂停中断",
              },
            ];
            this.$nextTick(() => {
              this.drawSyfq(data.tongji.phase);
              this.drawSyzt(
                data.tongji.zd,
                data.tongji.wc,
                data.tongji.swks,
                data.tongji.jxz
              );
              this.drawYplx(data.tongji.type);
              this.drawSyz(data.view.indication);
              this.drawSyfl(data.view.sort);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 绘制试验分期
    drawSyfq(data) {
      if (data.length === 0) return;
      let xAxis = data.map((item) => item.phase),
        series = data.map((item) => item.count);
      let myChart = Echarts.init(
        document.getElementById("syfq"),
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
              name: `药智数据企业版-${document.title}-临床试验-试验分期情况`,
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
          bottom: 20,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: xAxis,
          axisLabel: {
            interval: 0,
            rotate: 40,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: series,
            barWidth: 60,
            type: "bar",
          },
        ],
      });
    },

    // 绘制试验状态
    drawSyzt(zd, wc, swks, jxz) {
      if (!zd && !wc && !swks && !jxz) return;
      let xdata = [
        {
          value: zd,
          name: "暂停中断",
        },
        {
          value: wc,
          name: "完成",
        },
        {
          value: swks,
          name: "尚未开始",
        },
        {
          value: jxz,
          name: "进行中",
        },
      ];

      let xdata1 = [],
        legendData = [];
      for (let item of xdata) {
        if (item.value > 0) {
          let obj = {
            value: item.value,
            name: item.name,
          };
          xdata1.push(obj);
          legendData.push(item.name);
        }
      }

      let myChart = Echarts.init(
        document.getElementById("syzt"),
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
              name: `药智数据企业版-${document.title}-临床试验-试验状态`,
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
          data: legendData
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
            data: xdata1,
          },
        ],
      });
    },

    // 绘制药品类型
    drawYplx(data) {
      if (data.length === 0) return;
      let xdata = [],
        legendData = [];
      for (let item of data) {
        if (item.count > 0) {
          let obj = {
            value: item.count,
            name: item.type,
          };
          xdata.push(obj);
          legendData.push(item.type);
        }
      }
      let myChart = Echarts.init(
        document.getElementById("yplx-lc"),
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
              name: `药智数据企业版-${document.title}-临床试验-药品类型`,
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

    // 绘制适应症
    drawSyz(data) {
      if (data.length === 0) return;
      data = _.orderBy(data, ["count"], ["asc"]);
      let that = this,
        yAxis = data.map((item) => item.indication),
        series = data.map((item) => item.count);
      let myChart = Echarts.init(
        document.getElementById("syzq10"),
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
              name: `药智数据企业版-${document.title}-临床试验-适应症(前10)`,
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

    // 绘制试验分类
    drawSyfl(data) {
      if (data.length === 0) return;
      data = _.orderBy(data, ["count"], ["asc"]);
      let that = this,
        yAxis = data.map((item) => item.sort),
        series = data.map((item) => item.count),
        startValue = data.length - 10,
        endValue = data.length - 1;
      let myChart = Echarts.init(
        document.getElementById("syfl-lc"),
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
              name: `药智数据企业版-${document.title}-临床试验-试验分类`,
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
        dataZoom: [
          {
            show: data.length > 10,
            startValue,
            endValue,
            yAxisIndex: 0,
            filterMode: "empty",
            width: 20,
            height: "80%",
            showDataShadow: false,
            right: 10,
          },
        ],
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
  },
  async mounted() {
    // 获取图表数据
    await this.getChartData();
    // 获取表格数据
    this.getTableData();
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

.companyfilter-lcsy {
  .gsxx-title {
    margin-top: 20px;
  }

  .el-table thead th > .cell {
    height: 36px;
    line-height: 36px;
    color: #333;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
  }
  .table-loading {
    height: 750px;
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

    .syfq {
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
