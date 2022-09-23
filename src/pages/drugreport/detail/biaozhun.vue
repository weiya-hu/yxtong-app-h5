<template>
  <div class="detail-items">
    <!-- API信息 -->
    <div class="detail-item">
      <div class="item-title">
        <span class="text"
          >药品标准<span class="num" v-if="allCount">{{ allCount }}</span></span
        >
        <span
          class="export"
          v-if="!drugStandard"
          @click="maxTotal(exportUrl, res.count)"
          >
          <!-- <i class="iconfont">&#xe605;</i>  -->
          导出</span
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
          v-else-if="drugStandard"
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
            :min-width="item.width"
            :key="item.prop"
            :label="item.label"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="item.prop === 'name'">
                <!-- downcheck为 0 或 2 时，有跳转详情的链接，tb为 1时，进入biaozhun详情 -->
                <router-link
                  tag="a"
                  class="cl-blue"
                  :to="'/biaozhun/' + scope.row.id"
                  target="_blank"
                  v-if="
                    (scope.row.downcheck == 2 || scope.row.downcheck == 0) &&
                    scope.row.tb == 1
                  "
                >
                  {{ scope.row.name }}
                </router-link>
                <!-- downcheck为 0 或 2 时，有跳转详情的链接，tb为 2时，进入foreign的资源详情链接 -->
                <a
                  class="cl-blue"
                  :href="scope.row.down"
                  target="_blank"
                  v-else-if="
                    (scope.row.downcheck == 2 || scope.row.downcheck == 0) &&
                    scope.row.tb == 2 &&
                    scope.row.down
                  "
                >
                  {{ scope.row.name || "/" }}
                </a>
                <span v-else>
                  {{ scope.row.name || "/" }}
                </span>
              </div>
              <div v-if="item.prop === 'source'">
                {{ scope.row.source || "/" }}
              </div>
              <div v-if="item.prop === 'page'">
                {{ scope.row.page || "/" }}
              </div>
              <div v-if="item.prop === 'download'">
                <!-- downcheck为 1 或 2 时，显示下载按钮 -->
                <!-- <a :href="scope.row.down" v-if="scope.row.down" target="_blank"><i class="el-icon-download"></i></a> -->
                <div
                  class="download"
                  v-if="
                    scope.row.down &&
                    (scope.row.downcheck == 1 || scope.row.downcheck == 2)
                  "
                >
                  <template v-if="getDownArr(scope.row.down).length == 1">
                    <a
                      :href="dd"
                      class="fujian"
                      target="_blank"
                      v-for="(dd, index) in getDownArr(scope.row.down)"
                      :key="index"
                    >
                      <i class="iconfont download-icon">&#xe62c;</i>
                    </a>
                  </template>
                  <template v-else>
                    <i class="iconfont download-icon">&#xe62c;</i>
                    <div class="fujian-cl">
                      <a
                        :href="dd"
                        class="fujian"
                        target="_blank"
                        v-for="(dd, index) in getDownArr(scope.row.down)"
                        :key="index"
                        v-html="'下载' + (index + 1)"
                      ></a>
                    </div>
                  </template>
                </div>
                <div v-else>/</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="res.count > 10 && !drugStandard"
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
const tableFiled = tablehead.drugreport.biaozhun;
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
    jspdf: {
      type: Boolean,
    },
    allCount: {
      type: Number,
    },
    drugStandard: {
      type: Object,
    },
  },
  data() {
    return {
      res: {},
      tableHead: tableFiled,
      exportUrl: "/api/report/drugStandard?outdata=1",
      param: {
        pageSize: 10,
        page: 1,
      },
      loading1: true,
      nodata: false,
    };
  },
  created() {
    this.loadData();
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
    loadData() {
      if (this.drugStandard) {
        this.loading1 = false;
        this.res = this.drugStandard;
        console.log(this.res);
        // this.allCount = this.res.count
        return;
      }
      this.loading = true;
      let param = {};
      param = _.assign({}, this.param, { ylbm: this.ylbm });
      return window
        .Axios({
          method: "get",
          url: "/api/report/drugStandard",
          params: param,
        })
        .then((res) => {
          if (res.data.code == 404) {
            this.nodata = true;
          } else if (res.data.code == 200) {
            this.nodata = false;
            this.allCount = res.data.data.count;
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
    getDownArr(str) {
      let arr = [];
      arr = str.split(";");
      if (str.indexOf("zy.yaozh.com") != -1 && arr.length > 1) {
        for (let index in arr) {
          if (index > 0) {
            arr[index] = "//zy.yaozh.com/instruct/" + arr[index];
          }
        }
      }
      return arr;
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
</style>
