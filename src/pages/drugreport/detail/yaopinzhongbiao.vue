<template>
  <div class="detail-items">
    <!-- API信息 -->
    <div class="detail-item">
      <div class="item-title">
        <span class="text"
          >中标信息<span class="num" v-if="tabAllCount">{{ tabAllCount }}</span></span
        >
        <span
          class="export"
          v-if="!yaopinzhongbiao"
          @click="maxTotal(exportUrl, listRes.count)"
          ><i class="iconfont">&#xe605;</i> 导出</span
        >
      </div>
      <div style="padding: 10px;">
        <div class="tabs-wap">
          <a
            href="javascript:;"
            @click="ScrollTabs('right')"
            class="tabs-pre tab-ctrl hide"
            ><i class="el-icon-caret-left"></i
          ></a>
          <a
            href="javascript:;"
            @click="ScrollTabs('left')"
            class="tabs-next tab-ctrl hide"
            ><i class="el-icon-caret-right"></i
          ></a>
          <div class="tabs">
            <span
              :class="['all' == activeTab ? 'active' : '', 'tab-pane']"
              @click="updateData('all')"
              >全部<span class="num" v-if="tabAllCount">{{ tabAllCount }}</span></span
            >
            <span
              v-for="item in GroupList"
              :key="item.key"
              :class="[item.key == activeTab ? 'active' : '', 'tab-pane']"
              @click="updateData(item.key)"
              >{{ item.key }}<span class="num" v-if="item.doc_count">{{ item.doc_count }}</span></span
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
          v-else-if="yaopinzhongbiao"
          :headerList="tableHead"
          :dataList="listRes.res"
        />
        <!-- 加载完成显示部分 -->
        <div class="detail-list" v-else>
          <el-table
            :data="listRes.res"
            stripe
            fixed
            border
            class="table"
            style="width: 100%"
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
                <div v-if="item.prop === 'name'">
                  {{ scope.row.name || "/" }}
                </div>
                <div v-if="item.prop === 'brandname'">
                  {{ scope.row.brandname || "/" }}
                </div>
                <div v-if="item.prop === 'guige'">
                  {{ scope.row.guige || "/" }}
                </div>
                <div v-if="item.prop === 'baozhuanguige2'">
                  {{ scope.row.baozhuanguige2 || "/" }}
                </div>
                <div v-if="item.prop === 'packaging'">
                  {{ scope.row.packaging || "/" }}
                </div>
                <div v-if="item.prop === 'feiyong'">
                  {{ scope.row.feiyong || "/" }}
                </div>
                <div v-if="item.prop === 'shengchanqiye'">
                  {{ scope.row.shengchanqiye || "/" }}
                </div>
                <div v-if="item.prop === 'bidder'">
                  {{ scope.row.bidder || "/" }}
                </div>
                <div v-if="item.prop === 'first'">
                  {{ scope.row.first || "/" }}
                </div>
                <div v-if="item.prop === 'approvaldate'">
                  {{ scope.row.approvaldate || "/" }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="listRes.count > 10 && !yaopinzhongbiao"
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page="param.page"
            :page-size="param.pageSize"
            :total="listRes.count"
          >
          </el-pagination>
        </div>
      </div>
    </div>
      <DetailKzxx v-if="showKZXX()" :extendList="extendList"></DetailKzxx>
  </div>
</template>
<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import pdfTable from "../pdfReport/table";
import DetailKzxx from "./kzxx";
import tablehead from "@/config/tablehead";
const tableFiled = tablehead.drugreport.yaopinzhongbiao;
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
    /* allCount:{
        type:Number,
      }, */
    yaopinzhongbiao: {
      type: Object,
    },
    jspdf: {
      type: Boolean,
    },
  },
  data() {
    return {
      tabs: {
        tabsWidth: 0, //tabs
        tabsWapWidth: 0, //tabs-wap
        tabsSpace: 0,
        marginLeft: 0,
      },
      tabAllCount: null,
      exportUrl: "/api/report/yaopinzhongbiao?outdata=1",
      GroupList: [],
      listRes: {},
      tableHead: tableFiled,
      activeTab: "all",
      loading1: true,
      nodata: false,
      param: {
        pageSize: 10,
        page: 1,
      },
    };
  },
  created() {
    this.LoadListData();
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
      if (this.yaopinzhongbiao) {
        this.loading1 = false;
        this.listRes = this.yaopinzhongbiao.List;
        this.tabAllCount = this.listRes.count;
        return;
      }
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
          url: "/api/report/yaopinzhongbiao",
          params: _.assign({ accesstoken: GETCOOKIEFUN("accesstoken") }, param),
        })
        .then((res) => {
          if (res.data.code == 404) {
            this.nodata = true;
          } else if (res.data.code == 200) {
            this.nodata = false;
            if (!this.tabAllCount) {
              this.tabAllCount = res.data.data.List.count;
              //this.allCount = res.data.data.List.count
              this.GroupList = res.data.data.GroupList.guifanjixing;
            }
            this.listRes = res.data.data.List;
          } else {
            this.nodata = true;
          }
          this.loading1 = false;
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
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "../css/com.less";

// .detail-items {
//   padding-bottom: 10px !important;
// }
// /deep/.el-table tbody td .cell {
//   padding: 8px 0 8px 14px !important;
//   line-height: 18px !important;
// }
</style>
