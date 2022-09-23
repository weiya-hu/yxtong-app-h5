<template>
  <div class="detail-items">
    <div class="detail-item">
      <div class="item-title">
        <span class="text"
          >全球临床试验<span class="num" v-if="res.count">{{ res.count }}</span></span
        >
        <span
          @click="linkToChina"
          style="cursor: pointer; border-bottom: 0"
          class="text"
          >中国临床试验</span
        >
        <span
          class="export"
          v-if="!initData"
          @click="maxTotal(exportUrl, res.count)"
          ><i class="iconfont">&#xe605;</i> 导出</span
        >
      </div>

      <div style="padding: 10px;">
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
          :dataList="res.res"
        />

        <!-- 加载完成显示部分 -->
        <el-table
          :data="res.res"
          stripe
          fixed
          border
          class="table"
          style="width: 100%"
          v-else
        >
          <el-table-column
            v-for="item in tableHead"
            :prop="item.prop"
            :min-width="!jspdf ? item.width : 80"
            :key="item.prop"
            :label="item.label"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="item.prop === 'title'">
                <div :title="scope.row.title">{{ scope.row.title || "/" }}</div>
              </div>
              <div v-if="item.prop === 'me_id'">
                <router-link
                  tag="a"
                  :title="scope.row.me_id"
                  :to="{ path: '/clinical/' + scope.row.id }"
                  class="no-underline cl-blue"
                  target="_blank"
                >
                  {{ scope.row.me_id || "/" }}
                </router-link>
              </div>
              <div v-else-if="item.prop === 'interventions_guifan'" :title="''">
                <el-tooltip
                  effect="light"
                  placement="right"
                  v-if="scope.row.interventions_guifan"
                >
                  <div slot="content">
                    <div
                      style="word-break: break-all"
                      v-html="scope.row.interventions_guifan"
                    ></div>
                  </div>
                  <div class="lineTwoHidden">
                    <div v-html="scope.row.interventions_guifan"></div>
                  </div>
                </el-tooltip>
              </div>
              <div v-else-if="item.prop === 'recruitment'" :title="''">
                <p
                  v-if="scope.row.recruitment"
                  class="dis"
                  :title="scope.row.recruitment"
                >
                  {{ scope.row.recruitment || "/" }}
                </p>
                <p
                  v-if="scope.row.recruitment_guifan"
                  class="dis"
                  :title="scope.row.recruitment_guifan"
                >
                  {{ scope.row.recruitment_guifan || "/" }}
                </p>
              </div>
              <div v-if="item.prop === 'conditions_guifan'">
                <div :title="scope.row.conditions_guifan">
                  {{ scope.row.conditions_guifan || "/" }}
                </div>
              </div>
              <div v-if="item.prop === 'phases'">
                <div :title="scope.row.phases">
                  {{ scope.row.phases || "/" }}
                </div>
              </div>
              <div v-if="item.prop === 'countries'">
                <div :title="scope.row.countries">
                  {{ scope.row.countries || "/" }}
                </div>
              </div>
              <div v-if="item.prop === 'start'">
                <span
                  v-if="scope.row.register !== 'ClinicalTrials.gov美国'"
                  :title="scope.row.start"
                  >{{ scope.row.start || "/" }}</span
                >
                <template v-else>
                  <p v-if="scope.row.start_s" class="dis">
                    {{ scope.row.start_s || "/" }}(预计)
                  </p>
                  <p v-if="scope.row.start" class="dis">
                    {{ scope.row.start || "/" }}(实际)
                  </p>
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="res.count > 10 && !initData"
          layout="total, prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-size="param.pageSize"
          :total="res.count"
        >
        </el-pagination>
      </div>
    </div>
    <DetailKzxx v-if="showKZXX()" :extendList="extendList"></DetailKzxx>
  </div>
</template>
<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import pdfTable from "../pdfReport/table2";
import tablehead from "@/config/tablehead";
import DetailKzxx from "./kzxx";
const tableFiled = tablehead.drugreport.clinical;
export default {
  components: {
    LoadingGif,
    pdfTable,
    DetailKzxx,
  },
  props: {
    extendList: Array,
    ylbm: {
      type: String,
    },
    initData: {
      type: Object,
    },
    jspdf: {
      type: Boolean,
    },
  },
  data() {
    return {
      //ylbm:'Fermented',
      res: {},
      tableHead: tableFiled,
      exportUrl: "/api/report/clinicallist?outdata=1",
      loading1: true,
      nodata: false,
      param: {
        pageSize: 10,
        page: 1,
      },
    };
  },
  created() {
    if (this.initData) {
      this.loading1 = false;
      this.res = this.initData;
    } else {
      this.loadData();
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
    linkToChina() {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "vip_report_linchuangshiyan"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "vip_report_linchuangshiyan",
      ]);
      let routeData = this.$router.resolve({
        name: "database_linchuangshiyan",
        query: {
          englishname: this.$route.query.englishname,
        },
      });
      window.open(routeData.href, "_blank");
    },
    loadData() {
      return window
        .Axios({
          method: "get",
          url: "/api/report/clinicallist",
          params: _.assign(
            {},
            { ylbm: this.ylbm, accesstoken: GETCOOKIEFUN("accesstoken") },
            this.param
          ),
        })
        .then((res) => {
          if (res.data.code == 404) {
            this.nodata = true;
          } else if (res.data.code == 200) {
            this.nodata = false;
            this.res = res.data.data;
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
    handleCurrentChange(val) {
      this.loading1 = true;
      this.param.page = val;
      this.loadData();
    },
  },
};
</script>
<style lang="less">
@import "~@/assets/less/var.less";
@import "../css/com.less";

// .detail-items {
//   padding-bottom: 10px !important;
// }

</style>
