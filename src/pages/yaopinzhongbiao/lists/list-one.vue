<template>
  <div class="la-slh">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <toAnaly></toAnaly>
        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Yaopinzhongbiao"
          :showArray="tableHead"
          @changeTableHeader="(list) => changeTableHeader(this, list)"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Yaopinzhongbiao"
          api_name="yaopinzhongbiao"
          :max_num="extendCount.listCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"
        ></Export>
      </div>
      <el-table
        ref="ElTable"
        :height="tableHeight"
        :data="res1"
        stripe
        fixed
        class="table"
        @sort-change="sortChange"
        :default-sort="order.base ? defaultSort(order.base) : {}"
        style="width: 100%"
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
          <template :slot="1 ? 'header' : ''" slot-scope="scope">
            <span>
              <NewProjectGuide
                postion="列表"
                :newPosition="{ top: -5, right: getPositonRight(item.order,item.statement)}"
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
              <i class="el-icon-question cl-green" style="margin-left: 4px;line-height: 28px;"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <div v-if="item.prop === 'source'">
                <!-- 链接字段关联关系 -->
                <span v-if="vueCheckListPms('Yaopinzhongbiao', item.label)">
                  <a
                    :href="scope.row.down ? scope.row.down : 'javascript:;'"
                    :class="scope.row.down ? 'cl-blue' : 'no-blue'"
                    v-if="!scope.row.down"
                    >{{ scope.row.source }}</a
                  >
                  <a
                    :href="scope.row.down ? scope.row.down : 'javascript:;'"
                    :class="scope.row.down ? 'cl-blue' : 'no-blue'"
                    target="_blank"
                    v-else
                    >{{ scope.row.source }}</a
                  >
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'name'" :title="''">
                <template v-if="vueCheckListPms('CfdaDrug', item.label)">
                  <span v-if="scope.row.name" :title="scope.row.name">
                    {{ scope.row.name }}
                  </span>
                  <span
                    v-if="scope.row.yibao"
                    :title="scope.row.yibao === '甲' ? '医保甲类' : '医保乙类'"
                    class="label-span bg-orange"
                    >{{ scope.row.yibao === "甲" ? "甲" : "乙" }}</span
                  >
                  <span
                    v-if="scope.row.jiyao"
                    :title="'基药'"
                    class="label-span bg-green"
                    >{{ '基' }}</span
                  >
                </template>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'targets'" :title="''">
                <template v-if="vueCheckListPms('CfdaDrug', item.label)">
                  <TooltipBD
                    :targets="scope.row.targets"
                    :targets_abbr="scope.row.targets_abbr"
                  />
                </template>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else>
                <span v-if="vueCheckListPms('Yaopinzhongbiao', item.label)">{{
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
          v-if="extendCount.listCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.listCount"
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
import { mapState } from "vuex";
import TooltipBD from "@/components/common/globalCom/target-tooltip";
import tablehead from "@/config/tablehead";
import List from "@/components/layouts/list";
import Export from "@/components/common/export";
import listCheck from "@/components/common/list-check";
import toAnaly from "./toAnaly";
import commonMixins from "@/mixins/common.js";
import setTableHMixins from "@/mixins/setTableH.js";
const defaultFiled = tablehead.yaopinzhongbiao.slh;
export default {
  components: {
    TooltipBD,
    List,
    Export,
    listCheck,
    toAnaly,
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      activeTabName: "first",
      vuex_name: "Yaopinzhongbiao",
      defaultFiled: [],
      exportDefaultFiled: [],
      tableHead: [],
      checkallShow: [],
      show_table: true,
      changeStyle: "",
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 50 - 88,
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      tableconf: (state) => state.Yaopinzhongbiao.tableconf,
      allBase: (state) => state.Yaopinzhongbiao.allBase,
      res1: (state) =>
        _.keys(state.Yaopinzhongbiao.res1).length
          ? state.Yaopinzhongbiao.res1.res
          : [],
      errocode: (state) => state.Yaopinzhongbiao.error,
      listLoading: (state) => state.Yaopinzhongbiao.listLoading,
      params: (state) => state.Yaopinzhongbiao.putong,
      words: (state) => state.Yaopinzhongbiao.gaoji,
      group: (state) => state.Yaopinzhongbiao.shaixuan,
      extendCount: (state) => state.Yaopinzhongbiao.extendCount,
      nopms: (state) => state.Yaopinzhongbiao.nopms,
      param: (state) => state.Yaopinzhongbiao.time_param,
      order: (state) => state.Yaopinzhongbiao.order,
    }),
  },
  methods: {
    // 动态计算new标签的right间距(order为排序标签，statement为提示问号)
    getPositonRight(order, statement) {
      if (order && !statement) {
        return -42
      } else if (!order && statement) {
        return -40
      } else if (order && statement) {
        return -58
      } else {
        return -25
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
        Store.dispatch("Yaopinzhongbiao/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Yaopinzhongbiao/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
  },
  created() {
    // this.init()
  },
  mounted() {},
  updated() {
    this.vueTogglePmsTooltip();
  },
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
    checkedFiled() {
      this.tableHead = [];
      this.defaultFiled = _.map(defaultFiled, (item) => {
        if (this.checkedFiled.indexOf(item.prop) != -1) {
          item.checked = true;
          this.tableHead.push(item);
        } else {
          item.checked = false;
        }
        return item;
      });
    },
  },
};
</script>
<style lang="less">
@import "~@/assets/less/var.less";
.la-slh {
  min-height: 100px;
  .no-data-msg {
    width: 100%;
    text-align: center;
    font-weight: bold;
    // font-size: 20px;
  }
  .no-blue {
    color: @FontColor1;
    text-decoration: none;
    cursor: text;
  }
}
.yxsp-icon {
  display: inline-block;
  font-size: 9px;
  padding: 1px;
  width: 14px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  color: #fff;
  border-radius: 8px;
  background: @McTypeGreen;
}
.zdzx-icon {
  display: inline-block;
  font-size: 9px;
  padding: 1px;
  width: 14px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  color: #fff;
  border-radius: 8px;
  background: @PrimaryColor;
}
.tssp-icon {
  display: inline-block;
  font-size: 9px;
  padding: 1px;
  width: 14px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  color: #fff;
  border-radius: 8px;
  background: @McTypeOrange;
}
// el-dialog遮罩层样式（背景色）
.v-modal {
  background: rgba(102, 102, 102, 0.4);
}
.label-span {
  color: #fff;
  border-radius: 10px;
  padding: 0px 10px;
  display: inline-block;
  font-size: 12px;
  // height: 20px;
  line-height: 14px;
}
.bg-green {
  background: #90c31f;
}
.bg-orange {
  background: #f77d54;
}
</style>
