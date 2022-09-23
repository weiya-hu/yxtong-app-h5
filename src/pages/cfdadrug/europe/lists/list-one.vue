<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <span
          class="action-btn"
          :class="{ 'abandon-click-method': nopms && nopms.visualization }"
          @click="sendGa"
        >
          <span class="icon iconfont">&#xe643;</span>
          智能分析
        </span>
        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Epyp"
          :showArray="tableHead"
          @changeTableHeader="(list) => changeTableHeader(this, list)"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Epyp"
          api_name="epyp"
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
              <div v-if="item.prop === 'name'">
                <span v-if="vueCheckListPms('Epyp', item.label)">
                  {{ scope.row.name }}
                  <span
                    class="cfdrug-icon tg-te"
                    v-if="scope.row.country == '1'"
                    title="EMA"
                    >EMA</span
                  >
                  <span
                    class="cfdrug-icon tg-te"
                    v-if="scope.row.country == '2'"
                    title="HMA"
                    >HMA</span
                  >
                  <!-- <div style="width:100%;">
                    <span class="cfdrug-icon tg-te" v-if="scope.row.country=='1'" title="EMA">EMA</span>
                    <span class="cfdrug-icon tg-te" v-if="scope.row.country=='2'" title="HMA">HMA</span>
                  </div> -->
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'num'">
                <router-link
                    v-if="scope.row.country === 1"
                    tag="a"
                    :to="{
                      path: '/epyp/emadetail/' + scope.row.id
                    }"
                    target="_blank"
                    style="color: #4877e8"
                    >{{ scope.row.num }}</router-link
                  >
                  <router-link
                    v-if="scope.row.country === 2"
                    tag="a"
                    :to="{
                      path: '/epyp/hmadetail/' + scope.row.id
                    }"
                    target="_blank"
                    style="color: #4877e8"
                    >{{ scope.row.num }}</router-link
                  >
              </div>
              <div v-else>
                <span v-if="vueCheckListPms('Epyp', item.label)">{{
                  scope.row[item.prop]
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <!-- <div v-if="item.prop === 'targets'" :title="''">
                <template v-if="vueCheckListPms('CfdaDrug', item.label)">
                  <TooltipBD v-if="scope.row.targets||scope.row.targets_abbr" :targets="scope.row.targets" :targets_abbr="scope.row.targets_abbr" />
                  <span v-else>/</span>
                </template>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div> -->
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
      vuex_name: "Epyp",
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
      allBase: (state) => state.Epyp.allBase,
      tableconf: (state) => state.Epyp.tableconf,
      res1: (state) =>
        _.keys(state.Epyp.res1).length ? state.Epyp.res1.res : [],
      errorcode: (state) => state.Epyp.error,
      listLoading: (state) => state.Epyp.listLoading,
      putong: (state) => state.Epyp.putong,
      gaoji: (state) => state.Epyp.gaoji,
      shaixuan: (state) => state.Epyp.shaixuan,
      extendCount: (state) => state.Epyp.extendCount,
      param: (state) => state.Epyp.slh_param, // 附加参数(存于vuex内)
      nopms: (state) => state.Epyp.nopms,
      order: (state) => state.Epyp.order,
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
        window.ga("send", "event", "tab", "click", "epyp_analy");
        window._paq.push(["trackEvent", "tab", "click", "epyp_analy"]);
        this.$router.push({ path: "/epyp/analy" });
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
        Store.dispatch("Epyp/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Epyp/nomalSearch", { params: this.param });
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

.la-list {
  .item_top {
    height: 190px;
    padding: 28px 20px 21px 35px;
    display: flex;
    .content_one {
      margin: 0px 5px;
      flex-grow: 1;
      background-color: #f5f8fb;
      padding-right: 30px;
      float: left;
      .content_title {
        padding-top: 15px;
        .content_shenbao {
          width: 140px;
          height: 40px;
          margin: 0 auto;
          line-height: 40px;
          .shenbao_left {
            width: 30px;
            height: 1px;
            background: #4a77e8;
            margin-top: 17px;
            float: left;
          }
          .shenbao_word {
            margin: 0 10px;
            float: left;
            font-size: 14px;
            color: #4a77e8;
          }
        }
      }
      .contents {
        width: 100%;
        padding-left: 34px;
        display: flex;
        .content_total {
          flex-grow: 1;
          width: 52px;
          height: 94px;
          text-align: center;
          float: left;
          margin-right: 36px;
          .total_item1 {
            padding-top: 10px;
            font-size: 12px;
          }
          .total_item2 {
            padding-top: 14px;
            span {
              font-size: 20px;
              color: #4a77e8;
            }
          }
        }
      }
    }
    .content_two {
      margin-left: 12px;
      background-color: #f5f8fb;
      float: left;
      .content_title {
        padding-top: 15px;
        .content_shenbao {
          width: 140px;
          height: 40px;
          margin: 0 auto;
          line-height: 40px;
          .shenbao_left {
            width: 30px;
            height: 1px;
            background: #4a77e8;
            margin-top: 17px;
            float: left;
          }
          .shenbao_word {
            margin: 0 10px;
            float: left;
            font-size: 14px;
            color: #4a77e8;
          }
        }
      }
      .contents {
        background: #5f88eb;
        padding-left: 34px;
        .content_total {
          width: 52px;
          height: 94px;
          text-align: center;
          float: left;
          margin-right: 40px;
          .total_item1 {
            padding-top: 10px;
            font-size: 12px;
          }
          .total_item2 {
            padding-top: 14px;
            span {
              font-size: 20px;
              color: #4a77e8;
            }
          }
        }
      }
    }
    .content_three {
      margin-left: 12px;
      background-color: #f5f8fb;
      float: left;
      .content_title {
        padding-top: 15px;
        .content_shenbao {
          width: 140px;
          height: 40px;
          margin: 0 auto;
          line-height: 40px;
          .shenbao_left {
            width: 30px;
            height: 1px;
            background: #4a77e8;
            margin-top: 17px;
            float: left;
          }
          .shenbao_word {
            margin: 0 10px;
            float: left;
            font-size: 14px;
            color: #4a77e8;
          }
        }
      }
      .contents {
        background: #5f88eb;
        padding-left: 34px;
        .content_total {
          width: 52px;
          height: 94px;
          text-align: center;
          float: left;
          margin-right: 42px;
          .total_item1 {
            padding-top: 10px;
            font-size: 12px;
          }
          .total_item2 {
            padding-top: 14px;
            span {
              font-size: 20px;
              color: #4a77e8;
            }
          }
        }
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
        width: 760px;
        height: 400px;
      }
    }
  }
  .cfdrug-icon {
    color: #fff;
    border-radius: 10px;
    padding: 0px 10px;
    display: inline-block;
    font-size: 12px;
    // height: 20px;
    line-height: 14px;
  }
  .tg-te {
    background: #90c31f;
  }
  .actions {
    position: absolute;
    right: 10px;
  }
}
.item_content1 {
  .label {
    text-align: center;
    line-height: 30px;
    margin-left: 30px;
  }
}
</style>


