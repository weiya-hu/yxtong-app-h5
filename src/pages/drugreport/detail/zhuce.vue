<template>
  <div class="detail-items">
    <div class="detail-item">
      <div class="item-title">
        <span class="text"
          >中国注册申报<span class="num" v-if="allCount">{{ allCount }}</span></span
        >
        <span
          class="export"
          v-if="!initData"
          @click="maxTotal(exportUrl, listRes.count)"
          ><i class="iconfont">&#xe605;</i> 导出</span
        >
      </div>

      <!-- 图表 -->
      <div class="charts">
        <div :id="echartsIDbar" class="chart"></div>
        <div :id="echartsIDpie" class="chart"></div>
      </div>
      <div style="padding: 0 10px 10px 10px;">
        <div class="tabs-wap">
          <a
            href="javascript:;"
            @click="ScrollTabs('right')"
            class="tabs-pre tab-ctrl hide"
            >前进</a
          >
          <a
            href="javascript:;"
            @click="ScrollTabs('left')"
            class="tabs-next tab-ctrl hide"
            >后退</a
          >
          <div class="tabs">
            <span
              :class="['all' == activeTab ? 'active' : '', 'tab-pane']"
              @click="updateData('all')"
              >全部<span class="num">{{ tabAllCount }}</span></span
            >
            <span
              v-for="item in GroupList"
              :key="item.key"
              :class="[item.key == activeTab ? 'active' : '', 'tab-pane']"
              @click="updateData(item.key)"
              >{{ item.key }}<span class="num">{{ item.doc_count }}</span></span
            >
          </div>
        </div>
        <!-- 自定义加载界面 -->
        <LoadingGif
          :className="'list-in-loading'"
          :classNameImg="'little-size-loading'"
          :loadFlag="loading1"
          v-if="loading1"
          :delayTime="0"
        ></LoadingGif>
        <pdfTable
          v-else-if="initData"
          :headerList="tableHead"
          :dataList="listRes.res"
          :type="1"
        />

        <!-- 加载完成显示部分 -->
        <el-table
          :data="listRes.res"
          stripe
          border
          class="table zcsb"
          style="width: 100%"
          v-else
        >
          <el-table-column
            v-for="item in tableHead"
            :prop="item.prop"
            :min-width="item.width"
            :key="item.prop"
            :label="item.label"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="item.prop === 'shoulihao'">
                <router-link
                  tag="a"
                  :to="'/zhuce/' + scope.row.id"
                  target="_blank"
                  class="cl-blue"
                  >{{ scope.row.shoulihao }}</router-link
                >
              </div>
              <div v-if="item.prop === 'name'">
                {{ scope.row.name || "/" }}
              </div>
              <div v-if="item.prop === 'shenqingleixing_1'">
                {{ scope.row.shenqingleixing_1 || "/" }}
              </div>
              <div v-if="item.prop === 'zhuceleixing'">
                {{ scope.row.yaopinleixing_1 + scope.row.zhuceleixing }}
              </div>
              <div v-if="item.prop === 'chengbanriqi'">
                {{ scope.row.chengbanriqi || "/" }}
              </div>
              <div v-if="item.prop === 'qiyemingcheng'">
                {{ scope.row.qiyemingcheng || "/" }}
              </div>
              <div v-if="item.prop === 'zhuangtai'">
                {{ scope.row.zhuangtai || "/" }}
              </div>
              <div v-if="item.prop === 'zhuangtaidate1'">
                {{ scope.row.zhuangtaidate1 || "/" }}
              </div>
              <div v-if="item.prop === 'jielun'">
                {{ scope.row.jielun || "/" }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="listRes.count > 10 && !initData"
          layout="total, prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-size="param.pageSize"
          :total="listRes.count"
        >
        </el-pagination>
      </div>
    </div>
    <DetailKzxx v-if="showKZXX()" :extendList="extendList"></DetailKzxx>
  </div>
</template>
<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import pdfTable from "../pdfReport/table";
import tablehead from "@/config/tablehead";
import DetailKzxx from "./kzxx";
const tableFiled = tablehead.drugreport.zhuce;
export default {
  components: {
    LoadingGif,
    pdfTable,
    DetailKzxx,
  },
  props: {
    extendList: Array,
    res: {
      type: Object,
    },
    ylbm: {
      type: String,
    },
    initData: {
      type: Object,
    },
    initEchartData: {
      type: Object,
    },
    jspdf: {
      type: Boolean,
    },
  },
  data() {
    return {
      //ylbm:'Glutamine',//仅供测试
      tabs: {
        tabsWidth: 0, //tabs
        tabsWapWidth: 0, //tabs-wap
        tabsSpace: 0,
        marginLeft: 0,
      },
      GroupList: [],
      listRes: {
        count: 0,
        res: [],
      },
      exportUrl: " /api/report/zhucelist?outdata=1",
      tableHead: tableFiled,
      activeTab: "all",
      tabAllCount: null,
      allCount: null,
      sqlx_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: [],
      },
      spjl_pie: {
        echarts: null,
        legend_data: [],
        series_data: [],
      },
      param: {
        pageSize: 10,
        page: 1,
      },
      loading1: true,
      nodata: false,
    };
  },
  computed: {
    echartsIDbar() {
      return "echartsIDbar" + Math.random() * 100000;
    },
    echartsIDpie() {
      return "echartsIDpie" + Math.random() * 100000;
    },
  },
  created() {
    if (!this.initData && !this.initEchartData) {
      this.LoadChartData();
      this.LoadListData();
    }
  },
  mounted() {
    console.log(this.initData);
    if (this.initData) {
      this.loading1 = false;
      this.listRes = this.initData.List;
      this.allCount = this.listRes.count;
      console.log(this.allCount);
      this.tabAllCount = this.allCount;
    }
    if (this.initEchartData) {
      this.dealSqlxBar(this.initEchartData.GroupList.shenqingleixing);
      this.dealSpjlPie(this.initEchartData.GroupList.xulie);
    }
  },
  methods: {
    showKZXX() {
      let flag = false;
      if (this.jspdf) {
        flag = false;
      } else {
        flag = true;
      }
      return flag;
    },
    //初始化表格上方的选择tabs
    InitTabsWidth() {
      let tabs_width = 0;
      var child = $(".tabs").children();
      var tabs_waps_width = $(".tabs-wap").width();
      child.each(function (index, el) {
        tabs_width += $(el).width() + 40;
      });
      // $('.tabs').width(tabs_width);
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
      let param = {};
      if (this.activeTab != "all") {
        param = _.assign(
          {},
          { ylbm: this.ylbm, guifanjixing: this.activeTab },
          this.param
        );
      } else {
        param = _.assign({}, { ylbm: this.ylbm }, this.param);
      }
      window
        .Axios({
          method: "get",
          url: "/api/report/zhucelist",
          params: _.assign({ accesstoken: GETCOOKIEFUN("accesstoken") }, param),
        })
        .then((res) => {
          if (res.data.code == 404) {
            this.nodata = true;
          } else if (res.data.code == 200) {
            this.nodata = false;
            if (!this.tabAllCount) {
              this.allCount = res.data.data.List.count;
              console.log(this.allCount);
              this.tabAllCount = res.data.data.List.count;
              this.GroupList = res.data.data.GroupList.guifanjixing;
            }
            this.listRes = res.data.data.List;
          } else {
            this.nodata = true;
          }
          this.loading1 = false;
        });
    },
    //获取图表数据
    LoadChartData() {
      return window
        .Axios({
          method: "get",
          url: "/api/report/zhuce",
          params: {
            ylbm: this.ylbm,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.chartRes = res.data.data;
          this.dealSqlxBar(res.data.data.GroupList.shenqingleixing);
          this.dealSpjlPie(res.data.data.GroupList.xulie);
        });
    },
    //绘制bar图
    dealSqlxBar(shenqingleixing) {
      let _len = shenqingleixing.length;
      let xAxis_data = [];
      let series_data = [];
      if (_len > 0) {
        shenqingleixing.sort(function (a, b) {
          return b.doc_count - a.doc_count;
        });
        for (var i = 0; i < _len; i++) {
          xAxis_data.push(shenqingleixing[i].key);
          series_data.push(shenqingleixing[i].doc_count);
        }
        this.sqlx_bar.xAxis_data = xAxis_data;
        this.sqlx_bar.series_data = series_data;
        this.drawSqlxBar();
      }
    },
    drawSqlxBar() {
      var _that = this;
      Echarts.init(
        document.getElementById(this.echartsIDbar),
        "yaozh_theme"
      ).setOption({
        backgroundColor: '#fff',
        title: {
          text: "申请类型",
          left: "center",
          textStyle: {
            color: "#4877e8",
            fontWeight: "bold",
          },
        },
        animation: !this.initData,
        grid: {
          containLabel: true,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          data: this.sqlx_bar.xAxis_data,
        },
        yAxis: {
          type: "value",
          name: "申报数量",
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "top",
            },
            data: this.sqlx_bar.series_data,
          },
        ],
      });
    },
    //审评结论空心饼形图
    dealSpjlPie(xulie) {
      let _len = xulie.length;
      let legend_data = [];
      let series_data = [];
      if (_len > 0) {
        for (var i = 0; i < _len; i++) {
          legend_data.push(xulie[i].key);
          series_data.push({ value: xulie[i].doc_count, name: xulie[i].key });
        }
        this.spjl_pie.legend_data = legend_data;
        this.spjl_pie.series_data = series_data;
        this.drawSpjlPie();
      }
    },
    drawSpjlPie() {
      let initData = Boolean(this.initData);
      var _that = this;
      this.spjl_pie.echarts = Echarts.init(
        document.getElementById(this.echartsIDpie),
        "yaozh_theme"
      );
      this.spjl_pie.echarts.setOption({
        backgroundColor: '#fff',
        title: {
          text: "审批结论",
          left: "center",
          textStyle: {
            color: "#4877e8",
            fontWeight: "bold",
          },
        },
        animation: !initData,
        grid: {
          containLabel: true,
        },
        legend: {
          type: "scroll",
          bottom: 0,
          data: this.spjl_pie.legend_data,
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: <br/>{c} ({d}%)",
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "75%"],
            minAngle: 5,
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: initData,
                position: initData ? "outside" : "center",
                formatter: "{b}: {d}%",
              },
              emphasis: {
                show: true,
                formatter: "{d}%",
                align: "center",
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold",
                },
              },
            },
            labelLine: {
              normal: {
                show: initData,
              },
            },
            data: this.spjl_pie.series_data,
          },
        ],
      });
    },
    //总数超过1000提示
    maxTotal(url, total) {
      if (total > 1000) {
        this.$Confirm(
          "导出",
          `当前数据量为<span class="cl-red">${total}</span>条，最大导出量为<span class="cl-red">1000</span>条，是否导出？`,
          () => {
            this.handleExport(url);
          }
        );
      } else {
        this.handleExport(url);
      }
    },
    //导出
    handleExport(url) {
      window.open(
        url +
          "&ylbm=" +
          this.ylbm +
          "&accesstoken=" +
          GETCOOKIEFUN("accesstoken")
      );
    },
    //不同tab 切换 更新数据
    updateData(item) {
      this.loading1 = true;
      this.activeTab = item;
      this.LoadListData();
    },
    //分页
    handleCurrentChange(val) {
      this.loading1 = true;
      this.param.page = val;
      this.LoadListData();
    },
  },
  watch: {
    GroupList() {
      this.$nextTick(function () {
        this.InitTabsWidth();
      });
    },
  },
  updated() {},
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "../css/com.less";

.charts {
  display: flex;
  justify-content: center;
  .chart {
    width: 45%;
    height: 400px;
  }
}
.el-table {
  .cell {
    margin-left: 25px;
    font-size: 13px;
  }
}
// .detail-items {
//   padding-bottom: 10px !important;
// }
</style>
