<template>
  <div class="zlbj_items">
    <div class="zcsb_item">
      <div class="item_title">
        <span class="text">国内专利</span>
      </div>
    </div>
    <div class="zcsb_item">
      <div class="item_content">
        <div class="chart_select">
          <el-select v-model="value" placeholder="预估到期的年份" class="zcsb_select" style="border-radius: 0%">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="chart_box">
          <div id="sqjx-pie" class="echarts" ref="echarts_sz"></div>
        </div>
        <div class="chart_box">
          <div id="zllx-pie" class="echarts" ref="echarts_zl"></div>
        </div>
      </div>
      <div class="item_title1">
            <span class="export" @click="handleExport(exportUrl)"><i class="iconfont">&#xe605;</i> 导出</span>
        </div>
      <div class="item_content1">
        <!-- 自定义加载界面 -->
        <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading1" v-if="loading1" :delayTime="0"></LoadingGif>
        <!-- 加载完成显示部分 -->
        <el-table
          :data="listRes.res"
          stripe
          fixed
          class="table"
          style="width: 100%"
          v-else>
          <el-table-column
            v-for="item in tableHead"
            :prop="item.prop"
            :min-width="item.width"
            :key="item.prop"
            :label="item.label">
            <template slot-scope="scope">
              <div v-if="item.prop === 'shoulihao'">
                {{ scope.row.shoulihao }}
              </div>
              <div v-if="item.prop === 'zhuce.name'">
                {{ scope.row.name }}
              </div>
              <div v-if="item.prop === 'zhuce.shenqingleixing_1'">
                {{ scope.row.shenqingleixing_1 }}
              </div>
              <div v-if="item.prop === 'zhuce.guifanjixing'">
                {{ scope.row.jixing}}
              </div>
              <div v-if="item.prop === 'zhuce.yaopingleixing_1+zhuce.zhuceleixing'">
                {{ scope.row.qiyemingcheng }}
              </div>
              <div v-if="item.prop === 'zhuce.chengbanriqi'">
                {{ scope.row.chengbanriqi}}
              </div>
              <div v-if="item.prop === 'zhuce.banlizhuangta'">
                {{ scope.row.banlizhuangta }}
              </div>
              <div v-if="item.prop === 'zhuce.zhuangtaikaishishijian'">
                {{ scope.row.zhuangtaikaishishijian }}
              </div>
              <div v-if="item.prop === 'ss_jielun.jielun'">
                {{ scope.row.jielun }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页栏-->
    </div>
    <div class="zcsb_item">
      <div class="item_title">
        <span class="text">国内专利</span>
      </div>
      <div class="item_content4">
          <div class="chart_box">
              <div id="jslx-pie" class="echarts" ref="echarts_js"></div>
          </div>
          <div class="chart_box1">
              <div id="sfgx-pie" class="echarts" ref="echarts_sf"></div>
          </div>
      </div>
      <div class="item_title1">
          <span class="export" @click="handleExport(exportUrl)"><i class="iconfont">&#xe605;</i> 导出</span>
      </div>
      <div class="item_content5">
        <!-- 自定义加载界面 -->
        <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading2" v-if="loading2" :delayTime="0"></LoadingGif>
        <!-- 加载完成显示部分 -->
        <el-table
          :data="jcxxData.res.res"
          stripe
          fixed
          class="table"
          style="width: 100%">
          <el-table-column
            v-for="item in jcxxData.tableHead"
            :prop="item.prop"
            :min-width="item.width"
            :key="item.prop"
            :label="item.label">
            <template slot-scope="scope">
              <div v-if="item.prop === 'qymc'">
                {{ scope.row.qymc }}
              </div>
              <div v-if="item.prop === 'fddb'">
                {{ scope.row.fddb }}
              </div>
              <div v-if="item.prop === 'jyzt'">
                {{ scope.row.jyzt }}
              </div>
              <div v-if="item.prop === 'jyfw'">
                {{ scope.row.jyfw }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import tablehead from "@/config/tablehead";
const tableFiled = tablehead.companyreport.DetailZlbj1;
const jcxxFiled = tablehead.companyreport.DetailZlbj3;

export default {
  components: {
    LoadingGif
  },
  props: {
    res: {
      type: Object
    }
  },
  data() {
    return {
      id: 4,
      tabs: {
        tabsWidth: 0, //tabs
        tabsWapWidth: 0, //tabs-wap
        tabsSpace: 0,
        marginLeft: 0
      },
      GroupList: [],
      listRes: {},
      tableHead: tableFiled,
      activeTab: "all",
      types: [
        {
          value: "选项1",
          label: "预估到期的年份"
        },
        {
          value: "选项2",
          label: "申请年份"
        },
        {
          value: "选项3",
          label: "公开年份"
        }
      ],
      value: "",
      jcxxData: {
        res: {},
        tableHead: jcxxFiled,
        exportUrl: ""
      },
      loading1: true,
      loading2: true,
    }
  },
  created() {
    this.LoadListData();
    this.LoadJcxxData();
  },
  watch: {
    GroupList() {
      this.$nextTick(function() {
        this.InitTabsWidth()
      })
    }
  },
  methods: {
    drawSqjxPie() {
      let dom = this.$refs.echarts_sz;
      this.myChart = Echarts.init(dom, "yaozh_theme");
      this.myChart.setOption({
        xAxis: {
          axisLabel: {
            show: true, //这行代码控制着坐标轴x轴的文字是否显示
            color: "#656160"
          },
          type: "category",
          data: [
            "2021",
            "2022",
            "2023",
            "2024",
            "2025",
            "2026",
            "2027",
            "2028",
            "2029",
            "2030",
            "2031",
            "2032",
            "2033",
            "2034",
            "2035",
            "2036",
            "2037"
          ]
        },
        yAxis: {
          type: "value",
          axisLabel: {
            show: true, //这行代码控制着坐标轴x轴的文字是否显示
            color: "#656160"
          }
        },
        grid: {
          show: false,
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: "axis"
        },
        title: {
          text: "预估到期年份",
          x: "center",
          top: "40px",
          textStyle: {
            fontSize: "12",
            color: "#646A7A"
          }
        },
        series: [
          {
            data: [
              2,
              5,
              20,
              7,
              22,
              24,
              21,
              25,
              23,
              32,
              34,
              38,
              34,
              20,
              13,
              25,
              7
            ],
            type: "line",
            symbol: "circle" //设定为实心点
          }
        ]
      });
    },
    drawZllxPie() {
      let dom = this.$refs.echarts_zl;
      this.myChart = Echarts.init(dom, "yaozh_theme");
      this.myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {d}%"
        },
        series: [
          {
            name: "专利类型",
            type: "pie",
            radius: "55%",
            avoidLabelOverlap: false,
            center: "50%",
            label: {
              normal: {
                formatter: "{b}"
              }
            },
            data: [
              { value: 1000, name: "发明申请" },
              { value: 1000, name: "发明授权" },
              { value: 50, name: "实用新型" }
            ]
          }
        ],
        title: {
          text: "专利类型",
          x: "center",
          top: "20px",
          textStyle: {
            fontSize: "12",
            color: "#646A7A"
          },
          fontSize: "8"
        },
        fontSize: "14"
      });
    },
    drawSfgxPie() {
      let dom = this.$refs.echarts_js;
      this.myChart = Echarts.init(dom, "yaozh_theme");
      this.myChart.setOption({
        title: {
          text: "技术类型",
          textStyle: {
            color: "#656160",
            fontSize: "14"
          },
          x: "center",
          top: "20px"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        xAxis: {
          axisLabel: {
            show: true, //这行代码控制着坐标轴x轴的文字是否显示
            color: "#656160"
          },
          axisLine: {
            show: true,
            color: "#EDEDED",
            lineStyle: {
              color: "#DBE2F1"
            }
          },
          type: "category",
          data: [
            "用途",
            "组合物",
            "制备方法",
            "其它",
            "化合物",
            "医药中间体",
            "制剂",
            "晶型",
            "衍生物"
          ]
        },
        yAxis: {
          axisLine: {
            show: false,
            color: "#EDEDED",
            lineStyle: {
              color: "#DBE2F1"
            }
          },
          axisLabel: {
            show: true, //这行代码控制着坐标轴x轴的文字是否显示
            color: "#656160"
          },
          type: "value"
        },
        series: [
          {
            name: "总数",
            data: [190, 60, 40, 15, 14, 10, 3, 2, 1],
            type: "bar",
            barWidth: "60%"
          }
        ]
      });
    },
    drawJslxPie() {
      let dom = this.$refs.echarts_sf;
      this.myChart = Echarts.init(dom, "yaozh_theme");
      this.myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}:{d}%"
        },
        series: [
          {
            name: "司法管辖区",
            type: "pie",
            radius: "55%",
            avoidLabelOverlap: false,
            center: "50%",
            label: {
              normal: {
                formatter: "{b}"
              }
            },
            data: [
              { value: 400, name: "日本" },
              { value: 100, name: "韩国" },
              { value: 1000, name: "西班牙" },
              { value: 1255, name: "加拿大" },
              { value: 255, name: "澳大利亚" },
              { value: 233, name: "欧洲" },
              { value: 29, name: "中国" },
              { value: 226, name: "美国" },
              { value: 34, name: "WIPO" },
              { value: 566, name: "其它" }
            ]
          }
        ],
        title: {
          text: "司法管辖区",
          x: "center",
          top: "20px",
          textStyle: {
            fontSize: "12",
            color: "#646A7A"
          },
          fontSize: "8"
        },
        fontSize: "14"
      });
    },
    //初始化表格上方的选择tabs
    InitTabsWidth() {
      let tabs_width = 0;
      var child = $(".tabs").children();
      var tabs_waps_width = $(".tabs-wap").width();
      child.each(function(index, el) {
        tabs_width += $(el).width() + 40;
      });
      $(".tabs").width(tabs_width);
      if (tabs_waps_width < tabs_width) {
        $(".tabs-next").removeClass("hide");
      }
      this.tabs.tabswidth = tabs_width;
      this.tabs.tabsWapWidth = tabs_waps_width;
      if (tabs_width > tabs_waps_width) {
        this.tabs.maxIndex = Math.ceil(tabs_width / tabs_waps_width);
        this.tabs.tabsSpace = tabs_width - tabs_waps_width;
      } else {
        this.tabs.maxIndex = 0;
        this.tabs.tabsSpace = 0;
      }
    },
    //tabs 左右滚动效果实现
    ScrollTabs(drection) {
      $(".tab-ctrl").removeClass("hide");
      if (drection == "left") {
        this.tabs.marginLeft = this.tabs.marginLeft - 200;
      } else {
        this.tabs.marginLeft = this.tabs.marginLeft + 200;
      }
      let result = this.tabs.marginLeft + this.tabs.tabsSpace;
      var margleft = 0;
      if (result >= this.tabs.tabsSpace) {
        margleft = 0;
        $(".tabs-pre").addClass("hide");
      } else if (result > 0 && result < this.tabs.tabsSpace) {
        margleft = this.tabs.marginLeft;
      } else if (result <= 0) {
        $(".tabs-next").addClass("hide");
        margleft = -this.tabs.tabsSpace;
      }
      $(".tabs").animate({ marginLeft: margleft }, 500);
    },
    //获取列表数据
    LoadListData() {
      window.Axios({
        method: "get",
        url: "/api/report/zhucelist",
        params: {
          //ylbm: this.res.ylbm
          ylbm: "Glutamine",
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      }).then(res => {
        this.loading1 = false
        this.listRes = res.data.data.List;
        this.GroupList = res.data.data.GroupList.guifanjixing;
      });
    },
    LoadJcxxData() {
      return window.Axios({
        method: "get",
        url: "/api/company/jcxx",
        params: {
          id: this.id,
          tps: "zqy"
        }
      }).then(res => {
        this.loading2 = false
        this.jcxxData.res = res.data.data.List;
      });
    },
    handleExport(url) {
      // 用于测试的接口
      url = "/api/company/jcxx";
      //导出条件
      window.open(url);
    }
  },
  mounted() {
    this.drawSqjxPie();
    this.drawZllxPie();
    this.drawSfgxPie();
    this.drawJslxPie();
  }
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.zlbj_items {
  box-shadow: @BoxShadowHover;
  background-color: #fff;
  .zcsb_item {
    .item_title {
      height: 36px;
      padding-left: 35px;
      line-height: 28px;
      border-bottom: 1px solid @BorderColor;
      position: relative;
      .text {
        position: relative;
        top: 5px;
        display: inline-block;
        padding: 0px 5px;
        font-size: 14px;
        color: @PrimaryColor;
        border-bottom: 3px solid @PrimaryColor;
      }
      .export {
        position: absolute;
        right: 25px;
        top: 5px;
        font-size: 12px;
        .iconfont {
          font-family: "iconfont" !important;
          font-size: 16px;
          font-style: normal;
          -webkit-font-smoothing: antialiased;
        }
      }
    }
    .item_content {
      height: 408px;
      padding-left: 34px;
      .chart_box {
        background-color: white;
        float: left;
        .echarts {
          width: 560px;
          height: 400px;
          margin-right: 108px;
        }
      }
      .chart_select {
        width: 200px;
        float: left;
        .zcsb_select {
          margin: 12px 0 0 78px;
          .el-input__inner {
            border-radius: 0%;
            background: #f6f8fc;
            border: 1px solid #dfe5f1;
            font-size: 10px;
          }
        }
      }
    }
    .item_title1 {
      position: relative;
      height: 36px;
      padding-left: 35px;
      line-height: 28px;
      .text {
        position: relative;
        top: 5px;
        display: inline-block;
        padding: 0px 5px;
        font-size: 14px;
        color: @PrimaryColor;
        .num {
          padding: 1px 5px;
          margin-left: 10px;
          border: 1px solid @PrimaryColor;
          border-radius: 15px;
        }
      }
      .text1 {
        position: relative;
        top: 5px;
        display: inline-block;
        padding-left: 35px;
        font-size: 14px;
        color: #555b6d;
        .num1 {
          padding: 1px 5px;
          margin-left: 10px;
          border: 1px solid #555b6d;
          border-radius: 15px;
        }
      }
      .export {
        position: absolute;
        right: 25px;
        top: 5px;
        cursor: pointer;
      }
    }
    .item_content1 {
      height: auto;
      background-color: white;
      padding-bottom:30px;
      .el-table {
        .el-table__header-wrapper {
          padding-left: 34px;
          background-color: #eaeef9;
          .el-table__header {
            .has-gutter {
              .el-table_3_column_15 {
                width: 169px !important;
              }
            }
          }
        }
        .el-table__body-wrapper {
          .el-table__body {
            .el-table__row td {
              padding-left: 34px;
            }
          }
        }
      }
    }
    .item_content4 {
      height: 408px;
      padding-left: 34px;
      .chart_box {
        background-color: white;
        float: left;
        margin-left: 200px;
        .echarts {
          width: 560px;
          height: 400px;
          margin-right: 108px;
        }
      }
      .chart_box1 {
        background-color: white;
        float: left;
        .echarts {
          width: 560px;
          height: 400px;
        }
      }
    }
    .item_content5 {
      height: auto;
      background-color: white;
      .el-table {
        .el-table__header-wrapper {
          padding-left: 34px;
          background-color: #eaeef9;
          .el-table__header {
            .has-gutter {
              .el-table_3_column_15 {
                width: 169px !important;
              }
            }
          }
        }
        .el-table__body-wrapper {
          .el-table__body {
            .el-table__row td {
              padding-left: 34px;
            }
          }
        }
      }
    }
  }
}
</style>
