<template>
  <div class="companyfilter-qynb" v-waiting="isLoading">
    <div class="content-title">
      <span>企业年报</span>

      <el-select
        v-model="year"
        type="mini"
        @change="handleYearChange"
        v-if="years.length"
      >
        <el-option v-for="(item, index) in years" :key="index" :value="item">
        </el-option>
      </el-select>
    </div>

    <div class="chart-boxs">
      <!-- 年度营收情况（万元） -->
      <div class="chart-box ndys">
        <div class="chart-title">年度营收情况（万元）</div>
        <div class="echarts" id="ndys">
          <div class="no-data">
            <img src="/static/imgs/trz/no_data.png" alt="" />
            <div class="text">暂无相关数据</div>
          </div>
        </div>
      </div>

      <!-- 研发投入 -->
      <div class="chart-box yftr">
        <div class="chart-title">研发投入</div>
        <div class="echarts" id="yftr">
          <div class="no-data">
            <img src="/static/imgs/trz/no_data.png" alt="" />
            <div class="text">暂无相关数据</div>
          </div>
        </div>
      </div>

      <!-- 营收情况 -->
      <div class="chart-box yxfx" v-show="chartYyData.GroupList">
        <div class="chart-title">
          <span>营收情况</span>
          <el-select v-model="yxfxTp" type="mini" @change="handleYxfxChange">
            <el-option
              v-for="(item, index) in yxfxOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="chart-wapper">
          <div class="echarts" id="yxfx">
            <div class="no-data">
              <img src="/static/imgs/trz/no_data.png" alt="" />
              <div class="text">暂无相关数据</div>
            </div>
          </div>

          <!-- 营业收入、营业成本-->
          <div class="chart-yy">
            <div class="check-box">
              <div
                class="item"
                :class="{ active: chartYy === '营业收入' }"
                @click="handleCheckItemClick('营业收入')"
              >
                营业收入
              </div>
              <div
                class="item"
                :class="{ active: chartYy === '营业成本' }"
                @click="handleCheckItemClick('营业成本')"
              >
                营业成本
              </div>
            </div>
            <div class="echarts-item" id="yysr" v-show="chartYy === '营业收入'">
              <div class="no-data">
                <img src="/static/imgs/trz/no_data.png" alt="" />
                <div class="text">暂无相关数据</div>
              </div>
            </div>

            <div class="echarts-item" id="yycb" v-show="chartYy === '营业成本'">
              <div class="no-data">
                <img src="/static/imgs/trz/no_data.png" alt="" />
                <div class="text">暂无相关数据</div>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 10px">
          <!-- 自定义加载界面 -->
          <LoadingGif
            :className="'list-in-loading'"
            :classNameImg="'little-size-loading'"
            :loadFlag="loadingYysrtable"
            v-if="loadingYysrtable"
            :delayTime="0"
          ></LoadingGif>

          <el-table
            v-else
            fixed
            border
            :data="yysrTableData"
            :header-cell-style="{
              background: '#F5F6FA',
              color: '#333333',
              fontSize: '14px',
              fontWeight: 'bold',
            }"
          >
            <el-table-column
              v-for="item in yysrTableHead"
              :prop="item.prop"
              :min-width="item.width"
              :key="item.prop"
              :label="item.label"
            ></el-table-column
          ></el-table>
          <el-pagination
            v-if="yysrTableTotal > 10"
            @current-change="handleCurrentChange"
            :current-page="yysrTableParams.page"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="yysrTableTotal"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 研发情况 -->
    <div class="gsxx-title" v-if="yfqkTableData.length > 0">研发情况</div>
    <div style="padding: 0 10px">
      <!-- 自定义加载界面 -->
      <LoadingGif
        :className="'list-in-loading'"
        :classNameImg="'little-size-loading'"
        :loadFlag="loadingYfqktable"
        v-if="loadingYfqktable"
        :delayTime="0"
      ></LoadingGif>

      <el-table
        v-if="yfqkTableData.length > 0 && !loadingYfqktable"
        fixed
        border
        :data="yfqkTableData"
        :header-cell-style="{
          background: '#F5F6FA',
          color: '#333333',
          fontSize: '14px',
          fontWeight: 'bold',
        }"
      >
        <el-table-column
          v-for="item in yfqkTableHead"
          :prop="item.prop"
          :min-width="item.width"
          :key="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <span>{{ scope.row[item.prop] }}</span>
            </div>
          </template>
        </el-table-column></el-table
      >
      <el-pagination
        v-if="yfqkTableTotal > 10"
        @current-change="yfqkHandleCurrentChange"
        :current-page="yfqkTableParams.page"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="yfqkTableTotal"
      >
      </el-pagination>
    </div>

    <!-- 产销量 -->
    <div class="gsxx-title" v-if="cxlTableData.length > 0">产销量</div>
    <div style="padding: 0 10px">
      <!-- 自定义加载界面 -->
      <LoadingGif
        :className="'list-in-loading'"
        :classNameImg="'little-size-loading'"
        :loadFlag="loadingCxltable"
        v-if="loadingCxltable"
        :delayTime="0"
      ></LoadingGif>

      <el-table
        v-if="cxlTableData.length > 0 && !loadingCxltable"
        fixed
        border
        :data="cxlTableData"
        :header-cell-style="{
          background: '#F5F6FA',
          color: '#333333',
          fontSize: '14px',
          fontWeight: 'bold',
        }"
      >
        <el-table-column
          v-for="item in cxlTableHead"
          :prop="item.prop"
          :min-width="item.width"
          :key="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <span>{{ scope.row[item.prop] }}</span>
            </div>
          </template>
        </el-table-column></el-table
      >
      <el-pagination
        v-if="cxlTableTotal > 10"
        @current-change="cxlHandleCurrentChange"
        :current-page="yfqkTableParams.page"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="cxlTableTotal"
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
      isLoading: true,
      year: 0,
      years: [],
      yxfxOption: [
        {
          value: 1,
          label: "分行业",
        },
        {
          value: 2,
          label: "分产品",
        },
        {
          value: 3,
          label: "分地区",
        },
      ],
      yxfxTp: "分行业", // 营销分析默认展示的类型
      yxfxVal: 1,
      chartYy: "营业收入",
      chartYyData: {},
      yysrTableParams: {
        pageSize: 10,
        page: 1,
      }, // 营业收入表格参数
      yysrTableTotal: 0, // 营业收入表格总数
      yysrTableData: [], // 营业收入表格数据
      yysrTableHead: [
        {
          prop: "name",
          label: "类型名称",
          width: 120,
        },
        {
          prop: "yyshouru",
          label: "营业收入（万元）",
          width: 150,
        },
        {
          prop: "srpercent",
          label: "营业收入比上年同期增减(%)",
          width: 200,
        },
        {
          prop: "yychengben",
          label: "营业成本（万元）",
          width: 150,
        },
        {
          prop: "cbpercent",
          label: "营业成本比上年增减(%)",
          width: 200,
        },
        {
          prop: "yylirun",
          label: "营业利润（万元）",
          width: 150,
        },
        {
          prop: "maolilv",
          label: "毛利率(%)",
          width: 120,
        },
        {
          prop: "mlvpercent",
          label: "毛利率比上年增减(%)",
          width: 200,
        },
      ], // 营业收入表头
      loadingYysrtable: true, // 营业收入单独加载loading，翻页用
      yfqkTableParams: {
        pageSize: 10,
        page: 1,
      }, // 研发情况表格参数
      yfqkTableTotal: 0, // 研发情况表格总数
      yfqkTableData: [], // 研发情况表格数据
      yfqkTableHead: [
        {
          prop: "name",
          label: "类型名称",
          width: 150,
        },
        {
          prop: "zhuce",
          label: "注册分类",
          width: 120,
        },
        {
          prop: "gongneng",
          label: "功能主治",
          width: 150,
        },
        {
          prop: "jieduan",
          label: "注册阶段",
          width: 150,
        },
        {
          prop: "jinzhan",
          label: "进展情况",
          width: 200,
        },
        {
          prop: "yanfatouru",
          label: "本期研发投入金额（万元）",
          width: 200,
        },
        {
          prop: "jepercent",
          label: "本期金额较上年同期变动比例(%)",
          width: 250,
        },
        {
          prop: "ljyanfatouru",
          label: "累计研发投入（万元）",
          width: 180,
        },
      ], // 研发情况表头
      loadingYfqktable: true, // 研发情况单独加载loading，翻页用

      cxlTableParams: {
        pageSize: 10,
        page: 1,
      }, // 产销量表格参数
      cxlTableTotal: 0, // 产销量表格总数
      cxlTableData: [], // 产销量表格数据
      cxlTableHead: [
        {
          prop: "name",
          label: "药品名称",
          width: 150,
        },
        {
          prop: "unit",
          label: "单位",
          width: 80,
        },
        {
          prop: "sales",
          label: "销售类",
          width: 120,
        },
        {
          prop: "production",
          label: "生产量",
          width: 120,
        },
        {
          prop: "inventory",
          label: "库存量",
          width: 120,
        },
        {
          prop: "salespct",
          label: "销售量比上年增减(%)",
          width: 180,
        },
        {
          prop: "productionpct",
          label: "生产量比上年增减(%)",
          width: 200,
        },
        {
          prop: "inventorypct",
          label: "库存量比上年增减(%)",
          width: 180,
        },
      ], // 产销量表头
      loadingCxltable: true, // 产销量单独加载loading，翻页用
    };
  },
  watch: {},
  methods: {
    chartResize() {
      this.$nextTick(() => {
        this.echartsResize("ndys");
        this.echartsResize("yftr");
        this.echartsResize("yxfx");
        this.echartsResize("yysr");
        this.echartsResize("yycb");
      });
    },
    echartsResize(id) {
      if (!document.getElementById(id)) return;
      let echart = Echarts.getInstanceByDom(document.getElementById(id));
      if (echart) echart.resize();
    },
    // 最优先获取年份
    getYears() {
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/annualReportYear",
          params: {
            id: this.$route.params.id,
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.years = data.List;
            // 默认为最新年份
            let yearsLen = 0;
            this.year = this.years[yearsLen];

            this.getYxfxData();
            this.getYysrTableData();
            this.getYfqkTableData();
            this.getCxlTableData();
          } else {
            this.isLoading = false;
            this.loadingYysrtable = false;
            this.loadingYfqktable = false;
            this.loadingCxltable = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 年份切换事件
    handleYearChange(year) {
      this.getYxfxData();
      this.getYysrTableData();
      this.getYfqkTableData();
      this.getCxlTableData();
    },

    // 营收情况、研发投入 不随年份筛选而变化 所以不用等年份请求完之后再请求
    getNdysData() {
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/operation",
          params: {
            id: this.$route.params.id,
          },
        })
        .then((res) => {
          this.isLoading = false;
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;

            this.$nextTick(() => {
              // 绘制年度营收情况
              this.drawNdys(data.srb);

              // 绘制研发投入
              this.drawYftr(data.cpyfmx, data.yftrb);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 绘制年度营收情况
    drawNdys(data) {
      if (data.length == 0) return;
      let xdata = [],
        ydata1 = [],
        ydata2 = [],
        ydata3 = [];
      for (let value of data) {
        xdata.push(value.year);
        ydata1.push(value.yyshouru);
        ydata2.push(value.yychengben);
        ydata3.push(value.yylirun);
      }

      let myChart = Echarts.init(
        document.getElementById("ndys"),
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
              name: `药智数据企业版-${document.title}-年度营收情况（万元）`,
              icon: "image:///static/imgs/echarts/download.png",
            },
          },
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              show: true,
              interval: 0,
            },
            data: xdata,
          },
        ],
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#000",
            formatter: function (value, index) {
              let texts = value / 10000;

              return texts + "亿";
            },
          },
        },
        tooltip: {
          show: true,
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          show: false,
          containLabel: true,
          bottom: 40,
        },
        legend: {
          data: [
            {
              name: "营业收入(万元)",
              icon: "circle",
            },
            {
              name: "营业成本(万元)",
              icon: "circle",
            },
            {
              name: "净利润(万元)",
              icon: "circle",
            },
          ],
          bottom: 0,
        },
        series: [
          {
            name: "营业收入(万元)",
            type: "bar",
            barGap: 0,
            data: ydata1,
            barWidth: 18,
          },
          {
            name: "营业成本(万元)",
            type: "bar",
            data: ydata2,
            barWidth: 18,
          },
          {
            name: "净利润(万元)",
            type: "bar",
            data: ydata3,
            barWidth: 18,
            barGap: "10%",
          },
        ],
      });
    },
    // 绘制研发投入,yftrb：研发人员。cpyfmx：研发投入
    drawYftr(cpyfmx, yftrb) {
      if (cpyfmx.length == 0 || yftrb.length == 0) return;
      let xdata = [],
        xdata1 = [],
        xdata2 = [],
        ydata1 = [],
        ydata2 = [];
      for (let value of cpyfmx) {
        xdata1.push(value.year);
        ydata1.push(value.yanfatouru);
      }
      for (let value of yftrb) {
        xdata2.push(value.year);
        ydata2.push(value.yanfaren);
      }

      // 处理两个数据的年份数量、具体不一致的情况
      if (xdata1.length >= xdata2.length) {
        for (let index in xdata1) {
          if (_.indexOf(xdata2, xdata1[index]) === -1) {
            ydata2.splice(index, 0, "0");
          }
        }
        xdata = xdata1;
      } else if (xdata1.length < xdata2.length) {
        for (let index in xdata2) {
          if (_.indexOf(xdata1, xdata2[index]) === -1) {
            ydata1.splice(index, 0, "0");
          }
        }
        xdata = xdata2;
      }

      // console.log(xdata,ydata1,ydata2);

      let myChart = Echarts.init(
        document.getElementById("yftr"),
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
              name: `药智数据企业版-${document.title}-研发投入`,
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
          containLabel: true,
          bottom: 40,
        },
        legend: {
          data: ["研发投入合计（万元）", "研发人员数量（人）"],
          bottom: 0,
        },
        xAxis: [
          {
            type: "category",
            data: xdata,
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '研发投入合计（万元）',
            axisLabel: {
              formatter: '{value}万'
            },
          },
          {
            type: 'value',
            name: '研发人员数量（人）',
            axisLabel: {
              formatter: "{value}",
            },
          }
        ],
        series: [
          {
            name: "研发投入合计（万元）",
            type: "line",
            data: ydata1,
            areaStyle: {},
          },
          {
            name: "研发人员数量（人）",
            type: "line",
            data: ydata2,
            yAxisIndex: 1,
            areaStyle: {},
          },
        ],
      });
    },

    // 获取营销分析数据
    getYxfxData() {
      this.isLoading = true;
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/annualAnalysis",
          params: {
            id: this.$route.params.id,
            year: this.year,
            tp: this.yxfxVal,
          },
        })
        .then((res) => {
          this.isLoading = false;
          if (res.data.code === 200 && res.data) {
            this.chartYyData = res.data.data;
            this.$nextTick(() => {
              // 绘制营销分析
              this.drawYxfx(this.chartYyData.GroupList);
              // 绘制营业收入
              this.drawYysr(this.chartYyData.GroupList);
              // 绘制营业成本
              this.drawYycb(this.chartYyData.GroupList);
            });
          } else {
            this.chartYyData = {};
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 绘制营销分析
    drawYxfx(data) {
      if (data && data.length == 0) return;
      let xdata = [],
        ydata1 = [],
        ydata2 = [],
        ydata3 = [];
      for (let value of data) {
        xdata.push(value.name);
        ydata1.push(value.yyshouru);
        ydata2.push(value.yychengben);
        ydata3.push(value.maolilv);
      }
      let myChart = Echarts.init(
        document.getElementById("yxfx"),
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
              name: `药智数据企业版-${document.title}-营销分析`,
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
          show: false,
          containLabel: true,
          bottom: 40,
        },
        title: {
          text: "营销分析",
          x: "center",
          top: "0px",
          textStyle: {
            fontSize: "16",
            color: "#333",
          },
        },
        legend: {
          data: ["营业收入", "营业成本", "毛利率"],
          bottom: 0,
        },
        xAxis: [
          {
            type: "category",
            data: xdata,
            axisPointer: {
              type: "shadow",
            },
            splitLine: {
              show: false, // 去除网格线
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "营业情况",
            axisLabel: {
              formatter: (value) => {
                return value / 1000 + "k";
              },
            },
            splitLine: { show: false }, // 去除网格线
          },
          {
            type: "value",
            name: "毛利率（%）",
            axisLabel: {
              formatter: "{value}",
            },
            splitLine: { show: false }, //去除网格线
          },
        ],
        series: [
          {
            name: "营业收入",
            type: "bar",
            data: ydata1,
          },
          {
            name: "营业成本",
            type: "bar",
            data: ydata2,
          },
          {
            name: "毛利率",
            type: "line",
            yAxisIndex: 1,
            data: ydata3,
          },
        ],
      });
    },

    // 绘制营业收入
    drawYysr(data) {
      if (data && data.length == 0) return;
      let yysr = [];
      for (let item of data) {
        let obj = {
          value: item.yyshouru,
          name: item.name,
        };
        yysr.push(obj);
      }

      let myChart = Echarts.init(
        document.getElementById("yysr"),
        "yaozh_theme"
      );

      myChart.setOption(
        {
          toolbox: {
            top: 20,
            right: 20,
            show: true,
            feature: {
              saveAsImage: {
                title: "保存",
                name: `药智数据企业版-${document.title}-主营业收入占比`,
                icon: "image:///static/imgs/echarts/download.png",
              },
            },
          },
          title: {
            text: "主营业收入占比",
            x: "center",
            top: "10px",
            textStyle: {
              fontSize: "16",
              color: "#646A7A",
            },
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          series: [
            {
              name: "主营业收入占比",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              label: {
                normal: {
                  show: true,
                  position: "outside",
                  formatter: "{b}{d}%",
                },
              },
              data: yysr,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        },
        true
      );
      myChart.resize();
    },

    // 绘制营业成本
    drawYycb(data) {
      if (data && data.length == 0) return;
      let yycb = [];
      for (let item of data) {
        let obj = {
          value: item.yychengben,
          name: item.name,
        };
        yycb.push(obj);
      }

      let myChart = Echarts.init(
        document.getElementById("yycb"),
        "yaozh_theme"
      );

      myChart.setOption(
        {
          toolbox: {
            top: 20,
            right: 20,
            show: true,
            feature: {
              saveAsImage: {
                title: "保存",
                name: `药智数据企业版-${document.title}-主营业成本占比`,
                icon: "image:///static/imgs/echarts/download.png",
              },
            },
          },
          title: {
            text: "主营业成本占比",
            x: "center",
            top: "10px",
            textStyle: {
              fontSize: "16",
              color: "#646A7A",
            },
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          series: [
            {
              name: "主营业成本占比",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              label: {
                normal: {
                  show: true,
                  position: "outside",
                  formatter: "{b}{d}%",
                },
              },
              data: yycb,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        },
        true
      );
      myChart.resize();
    },

    // 营销分析切换事件
    handleYxfxChange(val) {
      this.yxfxVal = val;
      this.getYxfxData();
      this.getYysrTableData();
      console.log(val);
    },

    // 营业收入、营业成本切换事件
    handleCheckItemClick(name) {
      this.chartYy = name;

      this.$nextTick(() => {
        if (name === "营业收入") {
          this.drawYysr(this.chartYyData.GroupList);
        } else {
          this.drawYycb(this.chartYyData.GroupList);
        }
      });
    },

    // 获取营业收入表格数据
    getYysrTableData() {
      this.loadingYysrtable = true;
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/annualAnalysis",
          params: {
            id: this.$route.params.id,
            year: this.year,
            tp: this.yxfxVal,
            ...this.yysrTableParams,
            is_page: 1,
          },
        })
        .then((res) => {
          this.loadingYysrtable = false;
          if (res.data.code === 200 && res.data) {
            this.yysrTableTotal = res.data.data.List.count;
            this.yysrTableData = res.data.data.List.res;
          } else {
            this.yysrTableData = [];
            this.yysrTableTotal = 0;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 营业收入表格翻页
    handleCurrentChange(e) {
      this.yysrTableParams.page = e;
      this.getYysrTableData();
    },

    // 获取研发情况表格数据
    getYfqkTableData() {
      this.loadingYfqktable = true;
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/annualRdAndProduction",
          params: {
            id: this.$route.params.id,
            year: this.year,
            ...this.yfqkTableParams,
            type: "yfmx",
          },
        })
        .then((res) => {
          this.loadingYfqktable = false;
          if (res.data.code === 200 && res.data) {
            this.yfqkTableTotal = res.data.data.yfmx.count;
            this.yfqkTableData = res.data.data.yfmx.res;
          } else {
            this.yfqkTableData = [];
            this.yfqkTableTotal = 0;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 研发情况表格翻页
    yfqkHandleCurrentChange(e) {
      this.yfqkTableParams.page = e;
      this.getYfqkTableData();
    },

    // 产销量情况表格数据
    getCxlTableData() {
      this.loadingCxltable = true;
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/annualRdAndProduction",
          params: {
            id: this.$route.params.id,
            year: this.year,
            ...this.cxlTableParams,
            type: "cxl",
          },
        })
        .then((res) => {
          this.loadingCxltable = false;
          if (res.data.code === 200 && res.data) {
            this.cxlTableTotal = res.data.data.cxl.count;
            this.cxlTableData = res.data.data.cxl.res;
          } else {
            this.cxlTableData = [];
            this.cxlTableTotal = 0;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 产销量表格翻页
    cxlHandleCurrentChange(e) {
      this.cxlTableParams.page = e;
      this.getCxlTableData();
    },
  },
  mounted() {
    this.getYears();
    // 获取营收情况、研发投入数据
    this.getNdysData();
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

.companyfilter-qynb {
  padding-bottom: 10px;
  .gsxx-title {
    margin-top: 10px;
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
  .list-in-loading {
    height: 300px;
  }
  .no-data {
    text-align: center;
    color: #999;
  }
  .content-title {
    justify-content: space-between;
  }

  .el-input--suffix .el-input__inner {
    width: 130px;
    height: 24px;
    font-size: 12px;
    font-weight: normal;
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

    .ndys,
    .yftr,
    .yxfx {
      width: 100% !important;
    }

    .yxfx {
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

      .chart-wapper {
        display: flex;
      }

      .echarts,
      .chart-yy {
        width: calc(50% - 10px);
      }

      .chart-yy {
        padding-top: 20px;
      }

      .check-box {
        width: 60%;
        height: 30px;
        border-bottom: 2px solid @PrimaryColor;
        position: relative;
        left: 20%;
        display: flex;
        justify-content: center;

        .item {
          width: 100px;
          height: 30px;
          line-height: 30px;
          margin: 0px 2px;
          padding: 0px;
          text-align: center;
          cursor: pointer;
          &.active {
            background: @PrimaryColor;
            color: #fff;
          }
          &:hover {
            background: @PrimaryColor;
            color: #fff;
          }
        }
      }

      .echarts-item {
        width: calc(100%);
        height: 310px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    @media screen and (max-width: 1500px) {
      .yxfx {
        .chart-wapper {
          display: block;
        }
        .echarts,
        .chart-yy {
          width: calc(100% - 10px);
        }
      }
    }
  }
}
</style>
