<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <span
          class="action-btn"
          :class="{ 'abandon-click-method': nopms && nopms.ksh }"
          @click="sendGa"
        >
          <span class="icon iconfont">&#xe643;</span>
          智能分析
        </span>
        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Linchuangshiyan"
          :showArray="tableHead"
          @changeTableHeader="list => changeTableHeader(this, list)"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Linchuangshiyan"
          api_name="linchuangshiyan"
          :max_num="extendCount.BaseCount"
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
        :default-sort="order.base ? defaultSort(order.base) : {}"
        v-if="show_table"
      >
        <el-table-column
          v-for="item in tableHead"
          :prop="item.prop"
          :min-width="item.field_width || item.width || 100"
          :key="item.prop"
          :sortable="item.sort"
          :label="item.label"
          :fixed="item.is_fixed == '1'"
        >
          <!-- <template :slot="item.tips ? 'header':''" slot-scope="scope">
            <span>
              {{item.label}}
              <el-tooltip class="" effect="zhuce" placement="right">
                <div slot="content">{{helpDesc.setList}}</div>
                <i class="el-icon-question cl-green" style="margin-left:4px;"></i>
              </el-tooltip>
            </span>
          </template> -->
          <template :slot="1 ? 'header' : ''" slot-scope="scope">
            <span>
              <NewProjectGuide
                postion="列表"
                :newPosition="{
                  top: -5,
                  right: getPositonRight(item.order, item.statement)
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
                style="margin-left: 4px;line-height: 28px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <div v-if="item.prop === 'me_id'">
                <span
                  v-if="vueCheckListPms('Linchuangshiyan', item.label)"
                  class="cell-shoulihao-wrap"
                >
                  <router-link
                    tag="a"
                    :to="{ path: '/linchuangshiyan/' + scope.row.id }"
                    class="cell-shoulihao no-underline cl-blue"
                    target="_blank"
                  >
                    {{ scope.row.me_id }}
                  </router-link>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'targets'">
                <template v-if="vueCheckListPms('Linchuangshiyan', item.label)">
                  <TooltipBD
                    :targets="scope.row.targets"
                    :targets_abbr="scope.row.targets_abbr"
                  />
                </template>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>

              <div v-else>
                <span v-if="vueCheckListPms('Linchuangshiyan', item.label)">{{
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
          v-if="extendCount.BaseCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.BaseCount"
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
import tablehead from "@/config/tablehead";
import commonMixins from "@/mixins/common.js";
import setTableHMixins from "@/mixins/setTableH.js";

const defaultFiled = tablehead.linchuangshiyan.djh;
export default {
  components: {
    TooltipBD,
    List,
    Export,
    listCheck
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      vuex_name: "Linchuangshiyan",
      activeTabName: "first",
      defaultFiled: [],
      exportDefaultFiled: [],
      tableHead: [],
      checkallShow: [],
      show_table: true,
      helpDesc: {
        setList: "源于NMPA"
      },
      changeStyle: "",
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 50 - 88
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      allBase: state => state.Linchuangshiyan.allBase,
      tableconf: state => state.Linchuangshiyan.tableconf,
      res1: state =>
        _.keys(state.Linchuangshiyan.res1).length
          ? state.Linchuangshiyan.res1.res
          : [],
      errorcode: state => state.Linchuangshiyan.error,
      listLoading: state => state.Linchuangshiyan.listLoading,
      putong: state => state.Linchuangshiyan.putong,
      gaoji: state => state.Linchuangshiyan.gaoji,
      shaixuan: state => state.Linchuangshiyan.shaixuan,
      extendCount: state => state.Linchuangshiyan.extendCount,
      param: state => state.Linchuangshiyan.slh_param, // 附加参数(存于vuex内)
      nopms: state => state.Linchuangshiyan.nopms,
      order: state => state.Linchuangshiyan.order
    })
  },
  mounted() {
    this.registerEven();
  },
  activated() {
    let tempTableconf = _.cloneDeep(this.tableconf),
      actionName = `${this.vuex_name[0].toUpperCase() +
        this.vuex_name.substr(1)}/tableconf`; // 第一个字母转大写
    this.$store.commit(actionName, []);
    this.$store.commit(actionName, tempTableconf);
    this.registerEven();
  },
  watch: {
    res1: {
      handler() {
        this.$nextTick(() => {
          this.registerEven();
        });
      },
      immediate: true
    },
    tableHead: {
      handler() {
        this.$nextTick(() => {
          this.registerEven();
        });
      },
      immediate: true
    },
    tableconf(n) {
      n.forEach(item => {
        item.checked = item.hidden === undefined;
        item.prop = item.field;
      });
      //后台控制列表宽度
      this.defaultFiled = this.tableheaderCombain(n, n);
      this.exportDefaultFiled = this.defaultFiled;
      this.init();
    }
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
      if (this.nopms && !this.nopms.ksh) {
        window.ga("send", "event", "tab", "click", "linchuangshiyan_analy");
        window._paq.push([
          "trackEvent",
          "tab",
          "click",
          "linchuangshiyan_analy"
        ]);
        this.$router.push({ path: "/linchuangshiyan/analy" });
      }
    },

    init() {
      this.tableHead = this.defaultFiled.reduce((res, item) => {
        if (item.checked) {
          res.push(item);
        }
        return res;
      }, []);
      console.log(this.tableHead);
    },
    handleCurrentChange(val) {
      this.param.page = val;
      if (val * this.param.pageSize <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Linchuangshiyan/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Linchuangshiyan/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    }
  },
  created() {
    // this.init()
  },
  updated() {
    this.vueTogglePmsTooltip();
  }
};
</script>
<style lang="less">
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";

.el-table {
  .cell {
    overflow: visible;
  }
}

.cell-shoulihao-wrap {
  position: relative;
  .cell-shoulihao {
    float: left;
  }
}
.bg-green-br {
  // display: inline-block;
  text-align: center;
  font-size: 12px;
  padding: 0px 10px;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  background-color: @Green;
  color: #fff;
  max-width: 80px;
  overflow: hidden;
}
.bg-orange-br {
  // display: inline-block;
  text-align: center;
  font-size: 12px;
  padding: 0px 10px;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  background-color: @Orange;
  color: #fff;
  max-width: 80px;
  overflow: hidden;
}

.la-slh {
}
.ytz-icons {
  display: inline-block;
  & > span {
    overflow: hidden;
    display: inline-block;
    float: left;
    font-size: 12px;
    padding: 4px;
    // margin: 0px 0px 0px 6px;
    width: 14px;
    height: 14px;
    line-height: 14px;
    text-align: center;
    color: #fff;
    border-radius: 11px;
  }
}
.yxsp-icon {
  background: @McTypeGreen;
}
.zdzx-icon {
  background: @PrimaryColor;
}
.tssp-icon {
  background: @McTypeOrange;
}
// el-dialog遮罩层样式（背景色）
.v-modal {
  background: rgba(102, 102, 102, 0.4);
}
</style>
