<template>
  <div class="la-list la-epyp-list">
    <List :loading="listLoading" :nodata="res4 && !res4.length">
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
          :max_num="extendCount.epypzhuceCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="epypzhuce"
        ></Export>
      </div>
      <el-table
        :data="res4"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        class="table extensible-table"
        style="width: 100%"
        @sort-change="sortChange"
        v-if="show_table"
      >
        <el-table-column
          v-for="(item, i) in tableHead"
          :prop="item.prop"
          :key="i + '_index'"
          :min-width="item.width"
          :sortable="item.sort"
          :label="item.label"
        >
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <!-- 孤儿药 -->
              <template v-if="item.prop === 'orphan'">
                <div>
                  {{ scope.row[item.prop] === "yes" ? "是" : "" }}
                </div>
              </template>
              <!-- 仿制药 -->
              <template v-else-if="item.prop === 'generic'">
                <div>
                  {{ scope.row[item.prop] === "yes" ? "是" : "" }}
                </div>
              </template>
              <!-- 加速审批 -->
              <template v-else-if="item.prop === 'acceleration'">
                <div>
                  {{ scope.row[item.prop] === "yes" ? "是" : "" }}
                </div>
              </template>
              <div v-else>
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative">
        <el-pagination
          v-if="extendCount.epypzhuceCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.epypzhuceCount"
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
import LoadingGif from "@/components/common/globalCom/loading-gif";
import List from "@/components/layouts/list";
import Export from "@/components/common/export";
import { mapState } from "vuex";
import tablehead from "@/config/tablehead";
import listCheck from "@/components/common/list-check";
import commonMixins from "@/mixins/common.js";
import setTableHMixins from "@/mixins/setTableH.js";
const defaultFiled = tablehead.cfdadrug.epypzhuce;
export default {
  components: {
    LoadingGif,
    List,
    Export,
    listCheck,
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      scope: "",
      defaultFiled: defaultFiled,
      checkedFiled: [],
      tableHead: [],
      show_table: true,
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 50 - 88,
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      tableconf: (state) => state.Epyp.tableconf,
      allBase: (state) => state.Epyp.allBase,
      res4: (state) => (_.keys(state.Epyp.res4).length ? state.Epyp.res4 : []),
      errocode: (state) => state.Epyp.error,
      listLoading: (state) => state.Epyp.listLoading,
      putong: (state) => state.Epyp.putong,
      gaoji: (state) => state.Epyp.gaoji,
      shaixuan: (state) => state.Epyp.shaixuan,
      extendCount: (state) => state.Epyp.extendCount,
      param: (state) => state.Epyp.epypzhuce_param, // 附加参数(存于vuex内)
      nopms: (state) => state.Epyp.nopms,
      order: (state) => state.Epyp.order,
    }),
    exportDefaultFiled() {
      let arr = [];
      for (let item of defaultFiled) {
        arr.push(item);
      }
      return arr;
    },
  },
  mounted() {},
  // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
  activated() {
    this.registerEven();
  },
  watch: {
    res4: {
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
    // tableconf(n){
    //   // console.info(123)
    //   this.expandFiled = this.tableheaderCombain(n, this.expandFiled);
    // },
  },
  methods: {
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
        if (item.checked) {
          res.push(item);
        }
        return res;
      }, []);
    },
    // 排序
    sortChange(column, prop, order) {
      let sort;
      // column.prop为null时，默认排序
      if (column.prop) {
        if (column.order == "ascending") {
          sort = column.prop + " " + "asc";
        } else if (column.order == "descending") {
          sort = column.prop + " " + "desc";
        } else {
          sort = "";
        }
      }
      this.param.order = sort;
      Store.commit(
        "Epyp/order",
        Object.assign({}, this.$store.state.Epyp.order, {
          epypzhuce: sort ? sort : null,
        })
      );
      Store.dispatch("Epyp/nomalSearch", { params: this.param });
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
  created() {
    this.init();
  },
  updated() {
    this.vueTogglePmsTooltip();
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.la-epyp-list {
  .extensible-table {
    .extensible-td {
      cursor: pointer;
      // text-decoration: underline;
      text-decoration: none !important;
      &:hover {
        color: @PrimaryColor;
        font-weight: 600;
      }
      .num-text {
        text-decoration: underline;
      }
    }
    tr.el-table__row--striped {
      td {
        &.active {
          color: @PrimaryColor;
          font-weight: 600;
          background: url("~@/assets/imgs/zhuce/el-icon-caret-top.png")
            no-repeat 10px bottom #f5f8fb !important;
        }
      }
    }
    td {
      position: relative;
      .el-icon-caret-top {
        font-size: 20px;
        display: none;
      }
      &.active {
        color: @PrimaryColor;
        font-weight: 600;
        background: url("~@/assets/imgs/zhuce/el-icon-caret-top.png") no-repeat
          10px bottom;
      }
    }
  }
}
</style>
