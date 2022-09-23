<template>
  <div class="la-list company-filter">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <!-- <span
          class="action-btn"
          :class="{ 'abandon-click-method': nopms && nopms.visualization }"
          @click="sendGa"
        >
          <span class="icon iconfont">&#xe643;</span>
          智能分析
        </span> -->
        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="CompanyFilter"
          :showArray="tableHead"
          @changeTableHeader="(list) => changeTableHeader(this, list)"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="CompanyFilter"
          api_name="company_filter"
          :max_num="extendCount.baseCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"
        ></Export>
      </div>
      <el-table
        :data="res1"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        @sort-change="sortChange"
        :default-sort="order.apply ? defaultSort(order.apply) : {}"
        v-if="show_table"
      >
        <el-table-column
          v-for="item in tableHead"
          :prop="item.prop"
          :min-width="item.field_width || item.width || 100"
          :key="item.prop"
          :sortable="item.sort"
          :fixed="item.is_fixed == '1'"
          :label="item.label"
        >
          <template :slot="1 ? 'header' : ''" slot-scope="scope">
            <span>
              <NewProjectGuide
                postion="列表"
                :newPosition="{
                  top: -5,
                  right: getPositonRight(item.order, item.statement),
                }"
                :onlyKey="item['new_id']"
                display="inline"
                compoentsName="字段"
                :initItem="item"
                :showMenban="item['is_show_new']"
                >{{ item.label }}</NewProjectGuide
              >
            </span>
            <el-tooltip
              v-if="item.statement"
              class=""
              effect="zhuce"
              placement="right"
            >
              <div slot="content" v-html="item.statement"></div>
              <i
                class="el-icon-question cl-green"
                style="margin-left: 4px; line-height: 28px"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <!-- 企业名称 -->
              <div v-if="item.prop === 'qiyemingcheng'">
                <span v-if="vueCheckListPms('CompanyFilter', item.label)">
                  <div class="link-a">
                    <router-link
                      :to="'/company_filter/' + scope.row.qyid"
                      target="_blank"
                      >{{ scope.row.qiyemingcheng }}</router-link
                    >
                    <span
                      class="tags tag2"
                      :title="'总榜top' + scope.row.chengshi"
                      v-if="scope.row.yanfapaihang > 0"
                      >总榜top{{ scope.row.yanfapaihang }}</span
                    >
                    <span
                      class="tags tag3"
                      :title="scope.row.rongzileixing"
                      v-if="scope.row.rongzileixing"
                      >{{ scope.row.rongzileixing }}</span
                    >
                  </div>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <!-- 注册申报 -->
              <div v-else-if="item.prop === 'zhuceshu'">
                <router-link
                  class="link-to"
                  target="_blank"
                  :to="
                    '/company_filter/' + scope.row.qyid + '?&activeModule=zcsb'
                  "
                  v-if="scope.row.zhuceshu"
                  >{{ scope.row.zhuceshu }}</router-link
                >
                <span v-else></span>
              </div>

              <!-- 临床试验 -->
              <div v-else-if="item.prop === 'linchuangshu'">
                <router-link
                  class="link-to"
                  target="_blank"
                  :to="
                    '/company_filter/' + scope.row.qyid + '?&activeModule=lcsy'
                  "
                  v-if="scope.row.linchuangshu"
                  >{{ scope.row.linchuangshu }}</router-link
                >
                <span v-else></span>
              </div>

              <!-- 上市药品 -->
              <div v-else-if="item.prop === 'shangshiyaopinshu'">
                <router-link
                  class="link-to"
                  target="_blank"
                  :to="
                    '/company_filter/' + scope.row.qyid + '?&activeModule=ssyp'
                  "
                  v-if="scope.row.shangshiyaopinshu"
                  >{{ scope.row.shangshiyaopinshu }}</router-link
                >
                <span v-else></span>
              </div>

              <!-- 药品中标 -->
              <!-- <div v-else-if="item.prop === 'yaopinzhongbiaoshu'">
                <router-link
                  class="link-to"
                  target="_blank"
                  :to="
                    '/company_filter/' + scope.row.qyid + '&activeModule=ypzb'
                  "
                  v-if="scope.row.yaopinzhongbiaoshu"
                  >{{ scope.row.yaopinzhongbiaoshu }}</router-link
                >
                <span v-else></span>
              </div> -->
              <div v-else>
                <span v-if="vueCheckListPms('CompanyFilter', item.label)">{{
                  scope.row[item.prop]
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div style="positon: relative">
        <el-pagination
          v-if="extendCount.baseCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.baseCount"
          :disabled="nopms.fy"
          :class="{ 'abandon-click-method': nopms.fy }"
        >
        </el-pagination>
        <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
      </div>
    </List>
  </div>
</template>
<script>
import TooltipBD from "@/components/common/globalCom/target-tooltip";
import List from "@/components/layouts/list";
import Export from "@/components/common/export";
import listCheck from "@/components/common/list-check";
import { mapState } from "vuex";
import commonMixins from "@/mixins/common.js";
import setTableHMixins from "@/mixins/setTableH.js";
export default {
  components: {
    TooltipBD,
    List,
    Export,
    listCheck,
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      vuex_name: "CompanyFilter",
      activeTabName: "first",
      defaultFiled: [],
      exportDefaultFiled: [],
      tableHead: [],
      show_table: true,
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 50 - 88,
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      allBase: (state) => state.CompanyFilter.allBase,
      tableconf: (state) => state.CompanyFilter.tableconf,
      res1: (state) =>
        _.keys(state.CompanyFilter.res1).length
          ? state.CompanyFilter.res1.res
          : [],
      errorcode: (state) => state.CompanyFilter.error,
      listLoading: (state) => state.CompanyFilter.listLoading,
      putong: (state) => state.CompanyFilter.putong,
      gaoji: (state) => state.CompanyFilter.gaoji,
      shaixuan: (state) => state.CompanyFilter.shaixuan,
      extendCount: (state) => state.CompanyFilter.extendCount,
      param: (state) => state.CompanyFilter.qy_param, // 附加参数(存于vuex内)
      nopms: (state) => state.CompanyFilter.nopms,
      order: (state) => state.CompanyFilter.order,
    }),
  },
  mounted() {},
  // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
  activated() {
    let tempTableconf = _.cloneDeep(this.tableconf),
      actionName = `${
        this.vuex_name[0].toUpperCase() + this.vuex_name.substr(1)
      }/tableconf`; // 第一个字母转大写
    this.$store.commit(actionName, []);
    this.$store.commit(actionName, tempTableconf);
    this.registerEven();
  },
  watch: {
    res1: {
      handler() {
        this.$nextTick(() => {
          this.$forceUpdate();
          this.registerEven();
        });
      },
      immediate: true,
    },
    tableHead: {
      handler() {
        this.$nextTick(() => {
          this.registerEven();
        });
      },
      immediate: true,
    },
    tableconf(n) {
      n.forEach((item) => {
        item.checked = item.hidden === undefined;
        item.prop = item.field;
      });
      //后台控制列表宽度
      this.defaultFiled = this.tableheaderCombain(n, n);
      this.exportDefaultFiled = this.defaultFiled;
      this.init();
    },
  },
  methods: {
    // 动态计算new标签的right间距(order为排序标签，statement为提示问号)
    getPositonRight(order, statement) {
      if (order && !statement) {
        return -42;
      } else if (!order && statement) {
        return -40;
      } else if (order && statement) {
        return -58;
      } else {
        return -25;
      }
    },
    // 跳转到智能分析
    sendGa() {
      if (this.nopms && !this.nopms.visualization) {
        window.ga("send", "event", "tab", "click", "company_analy");
        window._paq.push(["trackEvent", "tab", "click", "company_analy"]);
        this.$router.push({ path: "/company/analy" });
      }
    },

    init() {
      this.tableHead = this.defaultFiled.reduce((res, item) => {
        if (item.checked && !item.hide) {
          res.push(item);
        }
        return res;
      }, []);
    },
    handleCurrentChange(val) {
      this.param.page = val;
      if (val * this.param.pageSize <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("CompanyFilter/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("CompanyFilter/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
  },
  updated() {
    this.vueTogglePmsTooltip();
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
// @import "~@/assets/less/app.less";

.la-list,
.company-filter {
  .link-a {
    width: 100%;
    // white-space: nowrap;
    // text-overflow: ellipsis;
    // overflow: hidden;
    // margin-bottom: 5px;
    a {
      color: #606266;
      font-weight: bold;
      text-decoration: none;
      font-size: 14px;

      &:hover {
        color: #4877e8;
        text-decoration: none;
      }
    }
  }

  /deep/ .el-table tbody td > .cell {
    padding: 13px 0 13px 14px
  }

  .el-table td .cell > div {
    max-height: 46px;
  }
  .tags {
    display: inline-block;
    box-sizing: border-box;
    padding: 0px 10px;
    margin-right: 4px;
    background: #ffa914;
    // border: 1px solid #4877e8;
    height: 20px;
    line-height: 20px;
    border-radius: 2px;
    color: #fff;
    font-size: 12px;
  }

  .tag2 {
    background: #dfe5f1;
    color: #606266;
  }
  .tag3 {
    background: #9dcc40;
  }
  .link-to {
    color: #545b6d;
    text-decoration: underline;
    &:hover {
      color: #4877e8;
    }
  }
  .tg-te {
    background: #90c31f;
  }
  .actions {
    position: absolute;
    right: 10px;
  }
}
</style>


