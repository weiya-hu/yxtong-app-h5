<template>
  <div class="detail-items" id="detail-items">
    <!-- 中国专利 -->
    <div class="detail-item mb50" v-show="cnListRes && cnListRes.totle">
      <div class="item-title">
        <span class="text">中国专利<span class="num" v-if="cnListRes.totle">{{
            cnListRes.totle
        }}</span></span>
        <span class="export" v-if="!isPdf" @click="maxTotal(exportUrl.cn, 'cn', cnListRes.totle)"><i
            class="iconfont">&#xe605;</i> 导出</span>
      </div>
      <!-- 图表 -->
      <div class="charts">
        <div :id="echartsIDcnPie" class="chart"></div>
        <div :id="echartsIDcnLine" class="chart"></div>
      </div>
      <div class="table-wrapper">
        <!-- 自定义加载界面 -->
        <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading1"
          v-if="loading1" :delayTime="0"></LoadingGif>
        <pdfTable v-else-if="isPdf" :headerList="tableHead.cn" :dataList="cnListRes.lists" />
        <!-- 加载完成显示部分 -->
        <el-table :data="cnListRes.lists" stripe fixed border class="table" style="width: 100%" v-else>
          <el-table-column v-for="item in tableHead.cn" :prop="item.prop" :min-width="item.width" :key="item.prop"
            :label="item.label" align="center">
            <template slot-scope="scope">
              <div v-if="item.prop === 'PN'" class="text" style="cursor: pointer; display: inline-block" @click="
                linkTo(
                  `https://patent.yaozh.com/detail?id=${scope.row.id}&sourceType=cn`
                )
              ">
                {{ scope.row.PN || "/" }}
              </div>
              <div v-if="item.prop === 'APN'">
                {{ scope.row.APN || "/" }}
              </div>
              <div v-if="item.prop === 'PBD'">
                {{ scope.row.PBD || "/" }}
              </div>
              <div v-if="item.prop === 'EED'">
                {{ scope.row.EED || "/" }}
              </div>
              <div v-if="item.prop === 'TTL'">
                {{ scope.row.TTL || "/" }}
              </div>
              <div v-if="item.prop === 'AN'">
                {{ scope.row.AN || "/" }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="cnListRes.totle > 10 && !isPdf" layout="total, prev, pager, next"
          @current-change="cnCurrentChange" :current-page="cnParam.page" :page-size="cnParam.pageSize"
          :total="cnListRes.totle">
        </el-pagination>
      </div>
    </div>

    <!-- 美国专利 -->
    <div class="detail-item mb50" v-show="usListRes && usListRes.count">
      <div class="item-title">
        <span class="text">美国专利<span class="num" v-if="usListRes.count">{{
            usListRes.count
        }}</span></span>
        <span class="export" v-if="!isPdf" @click="maxTotal(exportUrl.us, us, usListRes.count)"><i
            class="iconfont">&#xe605;</i> 导出</span>
      </div>
      <div class="table-wrapper">
        <!-- 自定义加载界面 -->
        <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading2"
          v-if="loading2" :delayTime="0"></LoadingGif>
        <pdfTable v-else-if="isPdf" :headerList="tableHead.us" :dataList="usListRes.res" />
        <!-- 加载完成显示部分 -->
        <el-table :data="usListRes.res" stripe fixed border class="table" style="width: 100%" v-else>
          <el-table-column v-for="item in tableHead.us" :prop="item.prop" :min-width="item.width" :key="item.prop"
            :label="item.label" align="center">
            <template slot-scope="scope">
              <div v-if="item.prop === 'appl_no'">
                {{ scope.row.appl_no }}
              </div>
              <div v-if="item.prop === 'patent_no'" class="text" style="cursor: pointer; display: inline-block" @click="
                linkTo(
                  `https://patent.yaozh.com/list?words=KWS%3D+${scope.row.patent_no}`
                )
              ">
                {{ scope.row.patent_no || "/" }}
              </div>
              <div v-if="item.prop === 'patent_expire_date_text'">
                {{ scope.row.patent_expire_date_text || "/" }}
              </div>
              <div v-if="item.prop === 'drug_substance_flag'">
                {{ scope.row.drug_substance_flag || "/" }}
              </div>
              <div v-if="item.prop === 'drug_product_flag'">
                {{ scope.row.drug_product_flag || "/" }}
              </div>
              <div v-if="item.prop === 'patent_use_code'">
                {{ scope.row.patent_use_code || "/" }}
              </div>
              <div v-if="item.prop === 'delist_flag'">
                {{ scope.row.delist_flag || "/" }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="usListRes.count > 10 && !isPdf" layout="total, prev, pager, next"
          @current-change="usCurrentChange" :current-page="usParam.page" :page-size="usParam.pageSize"
          :total="usListRes.count">
        </el-pagination>
      </div>
    </div>
    <!-- 世界专利 -->
    <div class="detail-item" v-show="allListRes && allListRes.totle">
      <div class="item-title">
        <span class="text">世界专利<span class="num" v-if="allListRes.totle">{{
            allListRes.totle
        }}</span></span>
        <span class="export" v-if="!isPdf" @click="maxTotal(exportUrl.all, 'all', allListRes.totle)"><i
            class="iconfont">&#xe605;</i> 导出</span>
      </div>

      <!-- 图表 -->
      <div class="charts">
        <div :id="echartsIDwoPie" class="chart"></div>
        <div :id="echartsIDwoBar" class="chart"></div>
      </div>
      <div class="table-wrapper">
        <!-- 自定义加载界面 -->
        <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading3"
          v-if="loading3" :delayTime="0"></LoadingGif>
        <pdfTable v-else-if="isPdf" :headerList="tableHead.all" :dataList="allListRes.lists" />
        <!-- 加载完成显示部分 -->
        <el-table :data="allListRes.lists" stripe fixed border class="table" style="width: 100%" v-else>
          <el-table-column v-for="item in tableHead.all" :prop="item.prop" :min-width="item.width" :key="item.prop"
            :label="item.label" align="center">
            <template slot-scope="scope">
              <div v-if="item.prop === 'PN'" class="text" style="cursor: pointer; display: inline-block" @click="
                linkTo(
                  `https://patent.yaozh.com/detail?id=${scope.row.id}&sourceType=all`
                )
              ">
                {{ scope.row.PN || "/" }}
              </div>
              <div v-if="item.prop === 'TPI'">
                {{ scope.row.TPI || "/" }}
              </div>
              <div v-if="item.prop === 'PBD'">
                {{ scope.row.PBD || "/" }}
              </div>
              <div v-if="item.prop === 'EED'">
                {{ scope.row.EED || "/" }}
              </div>
              <div v-if="item.prop === 'TTL'">
                {{ scope.row.TTL || "/" }}
              </div>
              <div v-if="item.prop === 'AN'">
                {{ scope.row.AN || "/" }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="allListRes.totle > 10 && !isPdf" layout="total, prev, pager, next"
          @current-change="allCurrentChange" :current-page="allParam.page" :page-size="allParam.pageSize"
          :total="allListRes.totle">
        </el-pagination>
      </div>
    </div>
    <DetailKzxx v-if="showKZXX()" :extendList="extendList"></DetailKzxx>
  </div>
</template>
<script>
import html2canvas from "html2canvas";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import pdfTable from "../pdfReport/table";
import tablehead from "@/config/tablehead";
import DetailKzxx from "./kzxx";
const cnTableFiled = tablehead.drugreport.parent.cn;
const AllTableFiled = tablehead.drugreport.parent.all;
const UsTableFiled = tablehead.drugreport.parent.us;

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
    usListRes: {
      type: Object,
    },
    cnListRes: {
      type: Object,
    },
    allListRes: {
      type: Object,
    },
    ylbm: {
      type: String,
    },
    dbgroupscn: {
      type: Object,
    },
    dbgroupsall: {
      type: Object,
    },
    isPdf: {
      type: Boolean,
    },
    jspdf: {
      type: Boolean,
    },
  },
  data() {
    return {
      //ylbm:'Gefitinib',
      src: "",
      listRes: {},
      tableHead: {
        cn: cnTableFiled,
        us: UsTableFiled,
        all: AllTableFiled,
      },
      //  urls: (location.host).indexOf('dev')>-1 ? '/pat': '/lineat',
      exportUrl: {
        cn: this.PATAPI_PROXY + "/dbexport?sourceType=cn&sort=publicationdate=desc",
        us: "/api/report/patentus?outdata=1",
        all: this.PATAPI_PROXY + "/dbexport?sourceType=all&sort=publicationdate=desc",
      },
      cn: {
        page: 1,
        res: {},
      },
      atp_pie: {
        series_data: [],
      },
      fly_line: {
        xAxis_data: [],
        series_data: [],
      },
      us: {
        page: 1,
      },
      all: {
        page: 1,
        res: {},
      },
      cot_pie: {
        xAxis_data: [],
        series_data: [],
      },
      tpi_bar: {
        xAxis_data: [],
        series_data: [],
      },
      allParam: {
        pageSize: 10,
        page: 1,
      },
      cnParam: {
        pageSize: 10,
        page: 1,
      },
      usParam: {
        pageSize: 10,
        page: 1,
      },
      loading1: false,
      loading2: false,
      loading3: false,
    };
  },
  computed: {
    echartsIDcnPie() {
      return "echartsIDcnPie" + Math.random() * 100000;
    },
    echartsIDcnLine() {
      return "echartsIDcnLine" + Math.random() * 100000;
    },
    echartsIDwoPie() {
      return "echartsIDwoPie" + Math.random() * 100000;
    },
    echartsIDwoBar() {
      return "echartsIDwoBar" + Math.random() * 100000;
    },
  },
  mounted() {
    this.LoadCnChartData();
    this.LoadAllChartData();
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
    linkTo(url) {
      window.open(url);
    },
    //获取中国专利列表数据
    LoadCnListData(obj) {
      window
        .Axios({
          method: "get",
          url: this.PATAPI_PROXY + "/dblist",
          params: _.assign(
            {},
            {
              sort: 'publicationdate=desc',
              words: "KWS=" + this.res.name,
              sourceType: "cn",
              accesstoken: GETCOOKIEFUN("accesstoken"),
            },
            this.cnParam
          ),
        })
        .then((res) => {
          if (res.data.code == 200 && res.data.data) {
            this.loading1 = false;
            this.cnListRes = res.data.data;
          }
        });
    },
    //获取中国专利图表数据
    LoadCnChartData() {
      if (this.dbgroupscn) {
        this.dealAtpPie(this.dbgroupscn.data.ATP);
        this.dealFlyLine(this.dbgroupscn.data.FLY);
        return;
      }
      return window
        .Axios({
          method: "get",
          url: this.PATAPI_PROXY + "/dbgroups",
          params: {
            words: "KWS=" + this.res.name,
            sourceType: "cn",
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code == 200 && res.data.data) {
            this.chartRes = res.data.data;
            this.dealAtpPie(res.data.data.ATP);
            this.dealFlyLine(res.data.data.FLY);
          }
        });
    },
    //获取世界专利列表数据
    LoadAllListData() {
      window
        .Axios({
          method: "get",
          url: this.PATAPI_PROXY + "dblist",
          params: _.assign(
            {},
            {
              sort: 'publicationdate=desc',
              words: "KWS=" + this.ylbm,
              sourceType: "all",
              accesstoken: GETCOOKIEFUN("accesstoken"),
            },
            this.allParam
          ),
        })
        .then((res) => {
          if (res.data.code == 200 && res.data.data) {
            this.loading3 = false;
            this.allListRes = res.data.data;
          }
        });
    },
    //获取世界专利图表数据
    LoadAllChartData() {
      if (this.dbgroupsall) {
        this.dealCotPie(this.dbgroupsall.data.COT);
        this.dealTpiBar(this.dbgroupsall.data.TPI);
        return;
      }
      return window
        .Axios({
          method: "get",
          url: this.PATAPI_PROXY + "/dbgroups",
          params: {
            words: "KWS=" + this.ylbm,
            sourceType: "all",
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code == 200 && res.data.data) {
            this.cn.res = res.data.data;
            this.dealCotPie(res.data.data.COT);
            this.dealTpiBar(res.data.data.TPI);
          }
        });
    },
    //获取美国专利列表数据
    LoadUsListData() {
      window
        .Axios({
          method: "get",
          url: "/api/report/patentus",
          params: _.assign(
            {},
            { ylbm: this.ylbm, accesstoken: GETCOOKIEFUN("accesstoken") },
            this.usParam
          ),
        })
        .then((res) => {
          this.loading2 = false;
          if (res.data.code == 200 && res.data.data) {
            this.usListRes = res.data.data;
          } else {
            this.usListRes = {};
          }
        });
    },
    //专利类型饼形图
    dealAtpPie(atp) {
      let _len = atp.length;
      let legend_data = [];
      let series_data = [];
      if (_len > 0) {
        for (var i = 0; i < _len; i++) {
          series_data.push({ value: atp[i].num, name: atp[i].value });
        }
        this.atp_pie.series_data = series_data;
        this.drawAtpPie();
      }
    },
    drawAtpPie() {
      Echarts.init(
        document.getElementById(this.echartsIDcnPie),
        "yaozh_theme"
      ).setOption({
        backgroundColor: '#fff',
        title: {
          text: "专利类型",
          left: "center",
        },
        animation: !this.isPdf,
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
            data: this.atp_pie.series_data,
          },
        ],
      });
    },
    dealFlyLine(fly) {
      let _len = fly.length;
      let xAxis_data = [];
      let series_data = [];
      if (_len > 0) {
        fly.sort(function (a, b) {
          return a.value - b.value;
        });
        for (var i = 0; i < _len; i++) {
          xAxis_data.push(fly[i].value);
          series_data.push(fly[i].num);
        }
        this.fly_line.xAxis_data = xAxis_data;
        this.fly_line.series_data = series_data;
        this.drawFlyLine();
      }
    },
    drawFlyLine() {
      Echarts.init(
        document.getElementById(this.echartsIDcnLine),
        "yaozh_theme"
      ).setOption({
        backgroundColor: '#fff',
        title: {
          text: "申请年份",
          left: "center",
        },
        animation: !this.isPdf,
        grid: {
          containLabel: true,
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
          data: this.fly_line.xAxis_data,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "line",
            data: this.fly_line.series_data,
          },
        ],
      });
    },

    //专利类型饼形图
    dealCotPie(cot) {
      let _len = cot.length;
      let legend_data = [];
      let series_data = [];
      if (_len > 0) {
        for (var i = 0; i < _len; i++) {
          series_data.push({
            value: cot[i].num,
            name: Store.state.Conf.stateObj[cot[i].value]["cn"],
          });
        }
        this.cot_pie.series_data = series_data;
        this.drawCotPie();
      }
    },
    drawCotPie() {
      Echarts.init(
        document.getElementById(this.echartsIDwoPie),
        "yaozh_theme"
      ).setOption({
        backgroundColor: '#fff',
        title: {
          text: "司法管辖区",
          left: 6,
        },
        animation: !this.isPdf,
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
            data: this.cot_pie.series_data,
          },
        ],
      });
    },
    dealTpiBar(tpi) {
      let _len = tpi.length;
      let xAxis_data = [];
      let series_data = [];
      if (_len > 0) {
        tpi.sort(function (a, b) {
          return b.num - a.num;
        });
        for (var i = 0; i < _len; i++) {
          xAxis_data.push(tpi[i].value);
          series_data.push(tpi[i].num);
        }
        this.tpi_bar.xAxis_data = xAxis_data;
        this.tpi_bar.series_data = series_data;
        this.drawTpiBar();
      }
    },
    drawTpiBar() {
      Echarts.init(
        document.getElementById(this.echartsIDwoBar),
        "yaozh_theme"
      ).setOption({
        backgroundColor: '#fff',
        title: {
          text: "技术类型",
          left: "center",
        },
        animation: !this.isPdf,
        grid: {
          containLabel: true,
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
          data: this.tpi_bar.xAxis_data,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            data: this.tpi_bar.series_data,
          },
        ],
      });
    },
    //总数超过1000提示
    maxTotal(url, type, total) {
      console.log(url);
      if (total > 1000) {
        this.$Confirm(
          "导出",
          `当前数据量为<span class="cl-red">${total}</span>条，最大导出量为<span class="cl-red">1000</span>条，是否导出？`,
          () => {
            this.handleExport(url, type);
          }
        );
      } else {
        this.handleExport(url, type);
      }
    },
    handleExport(url, type) {
      if (type == "cn" || type == "all") {
        let tempUrl = url +
          "&words=KWS=" +
          this.ylbm +
          "&accesstoken=" +
          GETCOOKIEFUN("accesstoken")
        if (type == "cn") {
          tempUrl = url +
            "&words=KWS=" +
            this.res.name +
            "&accesstoken=" +
            GETCOOKIEFUN("accesstoken")
        }
        window.open(tempUrl);
      } else {
        window.open(
          url +
          "&ylbm=" +
          this.ylbm +
          "&accesstoken=" +
          GETCOOKIEFUN("accesstoken")
        );
      }
    },
    //分页
    cnCurrentChange(val) {
      this.loading1 = true;
      this.cnParam.page = val;
      this.LoadCnListData();
    },
    usCurrentChange(val) {
      this.loading2 = true;
      this.usParam.page = val;
      this.LoadUsListData();
    },
    allCurrentChange(val) {
      this.loading3 = true;
      this.allParam.page = val;
      this.LoadAllListData();
    },
  },
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "../css/com.less";

.table-wrapper {
  padding: 10px;
}

.charts {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;

  .chart {
    display: inline-block;
    width: 700px;
    height: 400px;
  }
}

.text {
  font-size: 14px;
  color: @PrimaryColor;
}

// .detail-items {
//   padding-bottom: 10px !important;
// }
</style>
