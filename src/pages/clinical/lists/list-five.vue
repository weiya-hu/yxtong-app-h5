<template>
  <div class="la-list clinical-two">
    <List :loading="listLoading" :nodata="res5 && !res5.length">
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
          vuex_name="Clinical"
          :showArray="tableHead"
          @changeTableHeader="(list) => changeTableHeader(this, list)"
        />
        <!-- 导出 -->
        <Export
          vuex_name="Clinical"
          api_name="clinical"
          :max_num="extendCount.ClinicalresultsCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="clinicalresultsgroup"
        ></Export>
      </div>
      <el-table
        :data="res5"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        class="table extensible-table"
        style="width: 100%"
        v-if="show_table"
      >
        <el-table-column
          v-for="item in tableHead"
          :prop="item.prop"
          :key="item.prop"
          :sortable="item.sort"
          :min-width="item.width || 100"
          :label="item.label"
        >
          <template :slot="1 ? 'header' : ''" slot-scope="scope">
            <span>{{ item.label }}</span>
            <el-tooltip
              v-if="item.prop == 'me_id'"
              class=""
              effect="zhuce"
              placement="right"
            >
              <div slot="content" v-html="'点击登记号直接跳转到详情页“临床结果文献”板块，查看具体结果信息。'"></div>
              <i
                class="el-icon-question cl-green"
                style="margin-left: 4px; line-height: 28px"
              ></i>
            </el-tooltip>

            <el-tooltip
              v-if="item.prop == 'biomarker'"
              class=""
              effect="zhuce"
              placement="right"
            >
              <div slot="content" v-html="'只包含肿瘤领域的生物标志物。'"></div>
              <i
                class="el-icon-question cl-green"
                style="margin-left: 4px; line-height: 28px"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <template v-if="item.prop === 'me_id'">
                <router-link tag="a" :title="scope.row.me_id" :to="{path:`/clinical/${scope.row.id}?linkModule=临床结果文献`}" class="no-underline cl-blue" target="_blank">
                  {{ scope.row.me_id }}
                </router-link>
              </template>
              <template v-else-if="item.prop === 'targets'" :title="''" >
                <TooltipBD :targets="scope.row.targets" :targets_abbr="scope.row.targets_abbr" />
              </template>
              <template v-else-if="item.prop === 'title'">
                <a tag="a" :title="scope.row.title" v-if="scope.row.url1 || scope.row.url2 || scope.row.url3 || scope.row.url" :href="scope.row.url1 || scope.row.url2 || scope.row.url3 || scope.row.url " class="no-underline cl-blue" target="_blank">
                  {{ scope.row.title }}
                </a>
                <span v-else :title="scope.row.title">{{ scope.row.title }}</span>
              </template>
              <div v-else>{{ scope.row[item.prop] }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative">
        <el-pagination
          v-if="extendCount.ClinicalresultsCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.ClinicalresultsCount"
        ></el-pagination>
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
import TooltipBD from "@/components/common/globalCom/target-tooltip";
const defaultFiled = tablehead.clinical.lcjg;

export default {
  components: {
    LoadingGif,
    List,
    Export,
    listCheck,
    TooltipBD
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      defaultFiled: defaultFiled,
      tableHead: [],
      checkedFiled: [],
      show_table: true,
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 50 - 88,
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      tableconf: (state) => state.Clinical.tableconf,
      allBase: (state) => state.Clinical.allBase,
      res5: (state) =>
        _.keys(state.Clinical.res5).length ? state.Clinical.res5 : [],
      errocode: (state) => state.Clinical.error,
      listLoading: (state) => state.Clinical.listLoading,
      extendCount: (state) => state.Clinical.extendCount,
      param: (state) => state.Clinical.lcjg_param, // 附加参数(存于vuex内)
      nopms: (state) => state.Clinical.nopms,
      order: (state) => state.Clinical.order,
    }),
    exportDefaultFiled() {
      let arr = [];
      for (let item of defaultFiled) {
        arr.push(item);
      }
      return arr;
    },
  },
  methods: {
     // 跳转到智能分析
    sendGa() {
      if (this.nopms && !this.nopms.visualization) {
        window.ga("send", "event", "tab", "click", "clinical_analy");
        window._paq.push(["trackEvent", "tab", "click", "clinical_analy"]);
        this.$router.push({ path: "/clinical/analy" });
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
    handleCurrentChange(val) {
      this.param.page = val;
      Store.dispatch("Clinical/nomalSearch", { params: this.param });
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      Store.dispatch("Clinical/nomalSearch", { params: this.param });
    },
  },
  created() {
    this.init();
  },
  // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
  activated() {
    this.registerEven();
  },
  watch: {
    res5: {
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
    // tableconf(n) {
    //   //后台控制列表宽度
    //   this.expandFiled = this.tableheaderCombain(n, this.expandFiled);;
    // }
  },
};
</script>
<style lang="less">
@import "~@/assets/less/var.less";

.el-tooltip__popper.is-zhuce {
  div {
    max-height: 400px;
    overflow-y: auto;
  }
}

.row-class-position {
  position: relative;
  td:first-child {
    // padding-left: 24px;
  }
  .row-absolute {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 30px;
    writing-mode: vertical-lr;
    line-height: 30px;
    text-align: center;
    letter-spacing: 1px;
    display: none;
    color: #fff;
    overflow: hidden;
    cursor: pointer;
  }
  &:hover {
    .row-absolute {
      display: block;
    }
  }
}
.extensible-table {
  .extensible-td {
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      color: @PrimaryColor;
      font-weight: 600;
    }
  }
  .extensible-num-td {
    cursor: pointer;
    > span > span {
      white-space: nowrap;
    }
    .num-text {
      text-decoration: underline;
      &:hover {
        color: @PrimaryColor;
        font-weight: 600;
      }
    }
  }
}

@media screen and (max-width: 1420px) {
  .la-list.clinical-two {
    .actions {
      width: 105px;
      overflow: hidden;
      line-height: 15px;
      // text-align: right;
      top: -35px;

      .action-btn {
        margin-right: 0;
      }
    }
  }
}
</style>
