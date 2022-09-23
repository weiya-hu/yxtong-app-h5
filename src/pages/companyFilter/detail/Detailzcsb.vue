<template>
  <div class="companyfilter-zcsb">
    <LoadingGif
      :className="'list-in-loading'"
      :classNameImg="'little-size-loading'"
      :loadFlag="chartloading"
      v-if="chartloading"
    ></LoadingGif>
    <template v-else>
      <div class="content-title">注册申报</div>
      <div class="chart-boxs">
        <!-- 注册申报数量情况 -->
        <div class="chart-box ypyf">
          <div class="chart-title">注册申报数量情况</div>
          <div class="echarts" id="ypyf">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>
        </div>
      </div>
      <template v-if="Object.keys(tongji).length > 0">
        <div class="gsxx-title">注册申报概览</div>
        <div class="zcsb-box">
          <div class="zcsb-head">
            <div class="item">申报数量</div>
            <div class="item">申报品种</div>
            <div class="item">已批准</div>
            <div class="item">批准率</div>
            <div class="item">审评中</div>
          </div>
          <div class="zcsb-info">
            <div class="item">{{ tongji.sbsl }}个</div>
            <div class="item">{{ tongji.name }}个</div>
            <div class="item">{{ tongji.jielun }}个</div>
            <div class="item">
              {{ tongji.pzl && (tongji.pzl * 100).toFixed(2) }}%
            </div>
            <div class="item">{{ tongji.spz }}个</div>
          </div>
        </div>
      </template>

      <div class="chart-boxs">
        <!-- 申请类型 -->
        <div class="chart-box">
          <div class="chart-title">申请类型</div>
          <div class="echarts" id="sqlx">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>
        </div>

        <!-- 药品类型 -->
        <div class="chart-box">
          <div class="chart-title">药品类型</div>
          <div class="echarts" id="yplx">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>
        </div>

        <!-- 申请剂型统计 -->
        <div class="chart-box">
          <div class="chart-title">申请剂型统计</div>
          <div class="echarts" id="sqjxtj">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>
        </div>

        <!-- 治疗领域统计 -->
        <div class="chart-box">
          <div class="chart-title">治疗领域统计</div>
          <div class="echarts" id="zllytj">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="gsxx-title" v-show="!loadingTable">注册申报情况</div>
    <div style="padding: 0 10px">
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
            <div v-if="item.prop === 'shoulihao'">
              <router-link
                style="color: #4b79ec"
                target="_blank"
                :to="'/zhuce/' + scope.row.id"
                >{{ scope.row.shoulihao }}</router-link
              >
            </div>
            <div
              v-else-if="item.prop === 'yaopingleixing_1'"
              :title="scope.row.yaopinleixing_1 + scope.row.zhuceleixing"
            >
              {{ scope.row.yaopinleixing_1 + scope.row.zhuceleixing }}
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
      tongji: {}, // 注册申报概览数据
      chartloading: true,
      tableParams: {
        pageSize: 20,
        page: 1,
      },
      tableTotal: 0,
      tableData: [],
      tableHead: [
        {
          prop: "shoulihao",
          label: "受理号",
          width: 120,
        },
        {
          prop: "name",
          label: "药品名称",
          width: 150,
        },
        {
          prop: "shenqingleixing_1",
          label: "申请类型",
          width: 80,
        },
        {
          prop: "guifanjixing",
          label: "剂型",
          width: 100,
        },
        {
          prop: "yaopingleixing_1",
          label: "注册分类",
          width: 120,
        },
        {
          prop: "chengbanriqi",
          label: "承办日期",
          width: 120,
        },
        {
          prop: "banlizhuangtai",
          label: "办理状态",
          width: 150,
        },
        {
          prop: "zhuangtaikaishishijian",
          label: "状态开始日期",
          width: 120,
        },
        {
          prop: "jielun",
          label: "审评结论",
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
        this.echartsResize("sqlx");
        this.echartsResize("yplx");
        this.echartsResize("sqjxtj");
        this.echartsResize("zllytj");
        this.echartsResize("ypyf");
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
          url: "/api/company_filter/zhucelist",
          params: {
            id: this.$route.params.id,
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
    // 获取顶部所有图表的数据
    getChartData() {
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/zhuce",
          params: {
            id: this.$route.params.id,
          },
        })
        .then((res) => {
          this.chartloading = false;
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.tongji = data.tongji;
            this.$nextTick(() => {
              this.drawSqlx(this.tongji.sqlx);
              this.drawYplx(this.tongji.yplx);
              this.drawSqjx(data.view.sqjxzb);
              this.drawZlly(data.view.atc);
              this.drawYpyf(data.sbqs);
            });
          } else {
            this.tongji = {};
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 绘制注册申报数量
    drawYpyf(sbqs) {
      if (sbqs.shenbao.length === 0 && sbqs.pizhun.length === 0) return;
      let sbqs_xdata = [],
        sbqs_xdata1 = [],
        sbqs_xdata2 = [],
        sbqs_ydata1 = [],
        sbqs_ydata2 = [];
      // 申报
      for (let value of sbqs.shenbao) {
        sbqs_xdata1.push(value.key_as_string.split("-")[0]);
        sbqs_ydata1.push(value.doc_count);
      }
      // 批准
      for (let value of sbqs.pizhun) {
        sbqs_xdata2.push(value.key_as_string.split("-")[0]);
        sbqs_ydata2.push(value.doc_count);
      }
      // 处理两个数据的年份数量、具体不一致的情况
      if (sbqs_xdata1.length >= sbqs_xdata2.length) {
        for (let index in sbqs_xdata1) {
          if (_.indexOf(sbqs_xdata2, sbqs_xdata1[index]) === -1) {
            sbqs_ydata2.splice(index, 0, "0");
          }
        }
        sbqs_xdata = sbqs_xdata1;
      } else if (sbqs_xdata1.length < sbqs_xdata2.length) {
        for (let index in sbqs_xdata2) {
          if (_.indexOf(sbqs_xdata1, sbqs_xdata2[index]) === -1) {
            sbqs_ydata1.splice(index, 0, "0");
          }
        }
        sbqs_xdata = sbqs_xdata2;
      }

      let myChart = Echarts.init(
        document.getElementById("ypyf"),
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
              name: `药智数据企业版-${document.title}-药品研发数量情况`,
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
          data: sbqs_xdata,
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
          data: ["申报", "批准"],
          bottom: 0,
        },
        series: [
          {
            name: "申报",
            data: sbqs_ydata1,
            type: "line",
          },
          {
            name: "批准",
            data: sbqs_ydata2,
            type: "line",
          },
        ],
      });
    },
    // 绘制申请类型
    drawSqlx(data) {
      if (data.length === 0) return;
      let xdata = [];
      for (let item of data) {
        let obj = {
          value: item.doc_count,
          name: item.key,
        };
        xdata.push(obj);
      }
      let myChart = Echarts.init(
        document.getElementById("sqlx"),
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
              name: `药智数据企业版-${document.title}-申请类型`,
              icon: "image:///static/imgs/echarts/download.png",
            },
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>数量：{c}<br/>占比：{d}%",
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

    // 绘制药品类型
    drawYplx(data) {
      if (data.length === 0) return;
      let xdata = [];
      for (let item of data) {
        let obj = {
          value: item.doc_count,
          name: item.key,
        };
        xdata.push(obj);
      }
      let myChart = Echarts.init(
        document.getElementById("yplx"),
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
              name: `药智数据企业版-${document.title}-药品类型`,
              icon: "image:///static/imgs/echarts/download.png",
            },
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>数量：{c}<br/>占比：{d}%",
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

    // 绘制申请剂型
    drawSqjx(data) {
      if (data.length === 0) return;
      data = _.orderBy(data, ["doc_count"], ["asc"]);
      let that = this,
        yAxis = data.map((item) => item.key),
        series = data.map((item) => item.doc_count),
        startValue = data.length - 10,
        endValue = data.length - 1;
      let myChart = Echarts.init(
        document.getElementById("sqjxtj"),
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
              name: `药智数据企业版-${document.title}-申请剂型统计`,
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
          type: "value",
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0,
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

    // 绘制治疗领域
    drawZlly(data) {
      if (data.length === 0) return;
      data = _.orderBy(data, ["doc_count"], ["asc"]);
      let that = this,
        yAxis = data.map((item) => item.key),
        series = data.map((item) => item.doc_count),
        startValue = data.length - 10,
        endValue = data.length - 1;
      let myChart = Echarts.init(
        document.getElementById("zllytj"),
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
              name: `药智数据企业版-${document.title}-治疗领域统计`,
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
          type: "value",
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0,
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

.companyfilter-zcsb {
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

  .zcsb-box {
    padding: 0 10px;
  }

  .zcsb-head,
  .zcsb-info {
    display: flex;
    justify-content: space-between;

    .item {
      flex: 1;
      text-align: center;
      height: 36px;
      line-height: 36px;
      color: #333;
      border: 1px solid #ebeef5;
    }
    .item:nth-of-type(1),
    .item:nth-of-type(2),
    .item:nth-of-type(3),
    .item:nth-of-type(4) {
      border-right: 0;
    }
  }

  .zcsb-head {
    .item {
      background: #f5f6fa;
      font-size: 14px;
      font-weight: bold;
      border-bottom: 0;
    }
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

    .ypyf {
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
