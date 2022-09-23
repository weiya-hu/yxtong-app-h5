<template>
  <div class="zcsb_items">
    <div class="zcsb_item">
      <div class="item_title">
        <span class="text">数据概览</span>
      </div>
      <div class="item_top">
        <div class="checkbox">
          <div class="item active" @click="handleCheckItemClick">申请批准</div>
          <div class="item" @click="handleCheckItemClick">申请类型</div>
          <div class="item" @click="handleCheckItemClick">药品类型</div>
        </div>
        <div class="content_one active">
          <div class="contents">
            <ul class="content_total" v-for="(item, key, index) in TitleList.sqpz" :key="index">
              <li class="total_item1">
                {{key}}
              </li>
              <li class="total_item2">
                <span>{{item.split('^')[0]}}</span>{{item.split('^')[1]}}
              </li>
            </ul>
          </div>
        </div>
        <div class="content_one">
          <div class="contents">
            <ul class="content_total" v-for="(item, key, index) in TitleList.lx" :key="index">
              <li class="total_item1">
                {{item.key}}
              </li>
              <li class="total_item2">
                <span>{{item.doc_count}}</span>个
              </li>
            </ul>
          </div>
        </div>
        <div class="content_one">
          <div class="contents" >
            <ul class="content_total" v-for="(item, key, index) in TitleList.yp" :key="index">
              <li class="total_item1">
                {{item.key}}
              </li>
              <li class="total_item2">
                <span>{{item.doc_count}}</span>个
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="zcsb_item">
      <div class="item_title">
        <span class="text">视图列表</span>
      </div>
      <div class="item_content">
        <div class="chart_box">
          <div id="sqjx-pie" class="echarts" ref="echarts_sz"></div>
        </div>
        <div class="chart_box">
          <div id="zlly-pie" class="echarts" ref="echarts_zl"></div>
        </div>
      </div>
      <div class="item_content1" v-show="listRes.num">
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
            :width="item.okWidth"
            :key="item.prop"
            :label="item.label">
            <template slot-scope="scope">
              <div v-if="item.prop === 'zhuce.shoulihao'">
                <router-link style="color:#4b79ec" :to="'/zhuce/'+scope.row.id">{{ scope.row.shoulihao }}</router-link>
              </div>
              <div v-if="item.prop === 'zhuce.name'">
                {{ scope.row.name }}
              </div>
              <div v-if="item.prop === 'zhuce.shenqingleixing_1'">
                {{ scope.row.shenqingleixing }}
              </div>
              <div v-if="item.prop === 'zhuce.guifanjixing'">
                {{ scope.row.guifanjixing}}
              </div>
              <div v-if="item.prop === 'zhuce.yaopingleixing_1+zhuce.zhuceleixing'">
                {{ scope.row.yaopinleixing_1 + scope.row.zhuceleixing }}
              </div>
              <div v-if="item.prop === 'zhuce.chengbanriqi'">
                {{ scope.row.chengbanriqi}}
              </div>
              <div v-if="item.prop === 'zhuce.banlizhuangta'">
                {{ scope.row.banlizhuangtai }}
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
        <!-- 分页栏 -->
        <el-pagination
          v-if="listRes.num > 10"
          @current-change="handleCurrentChange"
          :current-page="zhuceParam.page"
          :page-size="zhuceParam.pageSize"
          layout="total, prev, pager, next"
          :total="listRes.num">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import tablehead from "@/config/tablehead";
const tableFiled = tablehead.companyreport.DetailZcsb;
const color = [
  "#6CC5E9",
  "#DAD2C7",
  "#C6B9AD",
  "#C3E588",
  "#6BC04D",
  "#4598CC",
  "#97DCEA",
  "#6BC4E9",
  "#4598CC",
  "#93D0E7"
];

export default {
  components: {
    LoadingGif
  },
  props: {
    res: {
      type: Object
    },
    item: {
      type: Object
    }
  },
  data() {
    return {
      bm: Store.state.CompanyReport.bm,
      tabs: {
        tabsWidth: 0, //tabs
        tabsWapWidth: 0, //tabs-wap
        tabsSpace: 0,
        marginLeft: 0
      },
      GroupList: [],
      listRes: {
        num: 0
      },
      tableHead: tableFiled,
      activeTab: "all",
      zcsb: {},
      number: {},
      jqnum: {},
      TitleList: {
        lx: {},
        yp: {},
        sqpz: {}
      },
      zhuceParam: {
        pageSize: 20,
        page: 1
      },
      StData: {},
      sqjxData: [],
      zllyData: [],
      loading1: true,
    };
  },
  watch: {
    GroupList() {
      this.$nextTick(function() {
        this.InitTabsWidth();
      })
    }
  },
  created() {
    this.handleGetDetail();
    this.LoadListData();
  },
  mounted() {
    this.drawSqjxPie();
    this.drawZllyPie();
  },
  methods: {
    handleStData() {
      this.handleSqjxData();
      this.handleZllyData();
    },
    // 申请剂型可视化数据处理
    handleSqjxData() {
      let data = this.StData.sqjxzb;
      for (let item of data) {
        let obj = {
          value: item.doc_count,
          name: item.key
        };
        this.sqjxData.push(obj);
      }
    },
    // 治疗领域可视化数据处理
    handleZllyData() {
      let data = this.StData.atc;
      for (let item of data) {
        let obj = {
          value: item.doc_count,
          name: item.key
        };
        this.zllyData.push(obj);
      }
    },
    async handleEchartsDraw() {
      await this.handleStData();
      this.drawSqjxPie();
      this.drawZllyPie();
    },
    drawSqjxPie() {
      let dom = this.$refs.echarts_sz;
      this.myChart = Echarts.init(dom, 'yaozh_theme');
      this.myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
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
                formatter: "{b}{d}%"
              }
            },
            data: this.sqjxData
          }
        ],
        title: {
          text: "申请剂型占比",
          x: "center",
          bottom: "20px",
          textStyle: {
            fontSize: "12",
            color: "#646A7A"
          },
          fontSize: "8"
        },
        fontSize: "14"
      });
    },
    drawZllyPie() {
      let dom = this.$refs.echarts_zl;
      this.myChart1 = Echarts.init(dom, 'yaozh_theme');
      this.myChart1.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
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
                formatter: "{b}{d}%"
              }
            },
            data: this.zllyData
          }
        ],
        title: {
          text: "治疗领域占比",
          x: "center",
          bottom: "20px",
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
    //获取聚合列表数据
    async handleGetDetail() {
      await window.Axios({
        method: "get",
        url: "/api/company/zhuce",
        params: {
          bm: this.bm
        }
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data;
          this.zcsb = res.data.data;
          let getSqpz = {};
          for (let key in data.tongji) {
            switch (key) {
              case "sbsl":
                _.assign(getSqpz, { 申报数量: data.tongji.sbsl + "^个" });
                break;
              case "name":
                _.assign(getSqpz, { 申报品种: data.tongji.name + "^个" });
                break;
              case "jielun":
                _.assign(getSqpz, { 已批准: data.tongji.jielun + "^个" });
                break;
              case "pzl":
                _.assign(getSqpz, {
                  批准率: (data.tongji.pzl * 100).toFixed(2) + "^%"
                });
                break;
              case "spz":
                _.assign(getSqpz, { 审评中: data.tongji.spz + "^个" });
                break;
            }
          }
          this.TitleList = res.data.data;
          this.TitleList = {
            tongji: data.tongji,
            lx: data.tongji.sqlx,
            yp: data.tongji.yplx,
            sqpz: getSqpz
          };
          this.StData = data.view;
        }
      });
      this.handleEchartsDraw();
    },
    //获取注册申报的表格
    LoadListData() {
      window.Axios({
        method: "get",
        url: "/api/company/zhucelist",
        params: _.assign(
          {
            bm: this.bm
          },
          this.zhuceParam
        )
      }).then(res => {
        this.loading1 = false
        this.listRes = res.data.data;
        this.listRes.num = res.data.data.count;
      });
    },
    // 国内试验情况 pageSize 改变时会触发
    handleSizeChange(val) {
      this.loading1 = true
      this.zhuceParam.pageSize = val
      this.LoadListData()
    },
    // 国外试验情况 currentPage 改变时会触发
    handleCurrentChange(val) {
      this.loading1 = true
      this.zhuceParam.page = val
      this.LoadListData()
    },
    handleCheckItemClick (event) {
      let dom = event.target
      let index = $(dom).index()
      $(".checkbox .item").removeClass("active")
      $(".checkbox .item").eq(index).addClass("active")
      $(".item_top .content_one").removeClass("active")
      $(".item_top .content_one").eq(index).addClass("active")
    },
  }
};
</script>
<style lang="less">
@import "~@/assets/less/var.less";
.classified-info {
  .zcsb_items {
    border-radius: 4px;
    box-shadow: @BoxShadowHover;
    background-color: #fff;
    padding-bottom:50px;
		.el-pagination{
			padding-bottom: 0;
		}
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
      .item_top {
        padding: 28px 20px 21px 35px;
        .checkbox {
					margin: 0px auto 14px auto;
					padding: 0px 20px;
					width: 40%;
					border-bottom: 2px solid @PrimaryColor;
					display: flex;
					justify-content: center;
					.item {
						cursor: pointer;
						text-align: center;
						min-width: 120px;
						height: 30px;
						line-height: 30px;
						margin: 0px 2px;
						&.active {
							background-color: @PrimaryColor;
							color: #fff;
						}
						&:hover {
							background-color: @PrimaryColor;
							color: #fff;
						}
					}
				}
        .content_one {
          width: 100%;
          flex-grow: 1;
          background-color: #f5f8fb;
          display: none;
          &.active {
            display: block;
          }
          .contents {
            width: 100%;
            display: flex;
            justify-content: space-around;
            padding: 30px 0px;
            .content_total {
              max-width: 100px;
              height: 94px;
              padding: 0px 5px;
              text-align: center;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              .total_item1 {
                padding-top: 10px;
                font-size: 12px;
              }
              .total_item2 {
                padding-top: 14px;
                span {
                  font-size: 24px;
                  color: #4a77e8;
                }
              }
            }
          }
        }
      }
      .item_content {
        min-height: 410px;
        display: flex;
        justify-content: center;
        .chart_box {
          box-sizing: border-box;
          background-color: white;
          width: 45%;
          margin: 0px 5%;
          .echarts {
            width: 100%!important;
            height: 400px;
          }
        }
      }
      .item_content1 {
        height: auto;
        background-color: white;
        padding-bottom:0px;
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
}
@media screen and (max-width: 1500px) {
  .item_content {
    flex-wrap: wrap;
    .chart_box {
      width: 100%;
    }
  }
}
</style>
