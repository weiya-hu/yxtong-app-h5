<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <!-- 显示 -->
        <a
          class="action-btn"
          href="javascript:void(0)"
          @click="toQxssHistory"
          style="line-height:22px"
        >
          器械上市历史
        </a>
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Qxss"
          :showArray="tableHead"
          @changeTableHeader="list => changeTableHeader(this, list)"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Qxss"
          api_name="qxss"
          :max_num="extendCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"
        ></Export>
      </div>
      <div class="item_content1">
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
          >
            <template :slot="item.tips ? 'header' : ''" slot-scope="scope">
              <span>
                {{ item.label }}
                <el-tooltip class="" effect="zhuce" placement="right">
                  <div slot="content" v-if="item.prop == 'zczbh'">
                    {{ helpDesc.registrationCertificateNumber }}
                  </div>
                  <div slot="content" v-else-if="item.prop == 'gllb'">
                    {{ helpDesc.managerType }}
                  </div>
                  <div slot="content" v-else-if="item.prop == 'phone'">
                    {{ helpDesc.phone }}
                  </div>
                  <i
                    class="el-icon-question cl-green"
                    style="margin-left:4px;"
                  ></i>
                </el-tooltip>
              </span>
            </template>
            <template slot-scope="scope">
              <div :title="scope.row[item.prop]">
                <div v-if="item.prop === 'name'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">
                    <router-link
                      v-if="scope.row.tp === 1"
                      tag="a"
                      :to="{
                        path: '/qxss/' + scope.row.id,
                        query: { tp: scope.row.tp }
                      }"
                      target="_blank"
                      class="cl-blue"
                    >
                      {{ scope.row.name }}
                    </router-link>
                    <router-link
                      v-if="scope.row.tp === 2"
                      tag="a"
                      :to="{
                        path: '/qxss/' + scope.row.id,
                        query: { tp: scope.row.tp }
                      }"
                      target="_blank"
                      class="cl-blue"
                    >
                      {{ scope.row.name }}
                    </router-link>
                  </span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'zczbh'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">{{
                    scope.row.zczbh
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'jgzc'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">{{
                    scope.row.jgzc
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'xhgg'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">{{
                    scope.row.xhgg
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'syfw'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">{{
                    scope.row.syfw
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'zcrmc'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">{{
                    scope.row.zcrmc
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'qiyeleixing'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">{{
                    scope.row.qiyeleixing
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'specificationcodescqy'">
                  <span v-if="vueCheckListPms('Qxss', item.label)"
                    ><router-link
                      v-if="scope.row.specificationcodescqy"
                      tag="a"
                      :to="{
                        path: '/ybhcsjbm',
                        query: { zczbh: scope.row.zczbh }
                      }"
                      target="_blank"
                      class="cl-blue"
                    >
                      {{ scope.row.specificationcodescqy }}
                    </router-link></span
                  >
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'phone'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">{{
                    scope.row.phone
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'qiyeurl'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">
                    <a
                      :href="scope.row.qiyeurl"
                      class="link-blue"
                      target="_blank"
                      v-if="scope.row.qiyeurl"
                      >查看</a
                    >
                  </span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'pzrq'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">{{
                    scope.row.pzrq
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'yxq'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">{{
                    scope.row.yxq
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'bmdh'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">{{
                    scope.row.bmdh
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'bmdh2018'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">{{
                    scope.row.bmdh2018
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'gllb'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">{{
                    scope.row.gllb
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'sf'">
                  <span v-if="vueCheckListPms('Qxss', item.label)">{{
                    scope.row.sf
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="positon: relative;">
          <el-pagination
            v-if="extendCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="param.page"
            :page-sizes="[20, 30, 50]"
            :page-size="param.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="extendCount"
            :disabled="nopms.fy"
            :class="{ 'abandon-click-method': nopms.fy }"
          >
          </el-pagination>
          <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
        </div>
      </div>
    </List>
  </div>
</template>

<script>
import List from "@/components/layouts/list";
import Export from "@/components/common/export";
import { mapState } from "vuex";
import tablehead from "@/config/tablehead";
import listCheck from "@/components/common/list-check";
import commonMixins from "@/mixins/common.js";
import setTableHMixins from "@/mixins/setTableH.js";
const defaultFiled = tablehead.qxss.Detailqxss;
export default {
  components: {
    List,
    Export,
    listCheck
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      vuex_name: "Qxss",
      defaultFiled: defaultFiled,
      filedVisible: false,
      tableHead: [],
      checkallShow: [],
      show_table: true,
      helpDesc: {
        registrationCertificateNumber: "完成器械注册后赋予的唯一标识编号",
        managerType: "医疗器械根据安全性分为Ⅰ类、Ⅱ类、Ⅲ类",
        phone: "企业联系电话为国产注册企业和进口国内代理企业联系电话"
      },
      changeStyle: "",
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 47 - 88
    };
  },
  computed: {
    ...mapState({
      allBase: state => state.Qxss.allBase,
      tableconf: state => state.Qxss.tableconf,
      nopms: state => state.Qxss.nopms,
      extendCount: state => state.Qxss.extendCount,
      putong: state => state.Qxss.putong,
      gaoji: state => state.Qxss.gaoji,
      shaixuan: state => state.Qxss.shaixuan,
      param: state => state.Qxss.param,
      listLoading: state => state.Qxss.listLoading,
      res1: state => (_.keys(state.Qxss.res1).length ? state.Qxss.res1 : []),
      order: state => state.Qxss.order
    }),
    exportDefaultFiled() {
      let arr = [];
      for (let item of defaultFiled) {
        arr.push(item);
      }
      return arr;
    }
  },
  // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
  activated() {
    this.registerEven();
  },
  watch: {
    checkedFiled() {
      this.tableHead = [];
      this.defaultFiled = _.map(defaultFiled, item => {
        if (this.checkedFiled.indexOf(item.prop) != -1) {
          item.checked = true;
          this.tableHead.push(item);
        } else {
          item.checked = false;
        }
        return item;
      });
    },
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
      this.defaultFiled = this.tableheaderCombain(n, this.defaultFiled);
    }
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.tableHead = this.defaultFiled.reduce((res, item) => {
        if (item.checked) {
          res.push(item);
        }
        return res;
      }, []);
    },
    toQxssHistory() {
      window.ga("send", "event", "button", "click", "vip_qxss_history");
      window._paq.push(["trackEvent", "button", "click", "vip_qxss_history"]);

      window.open("/qxss_history?ga_source=vip_qxss&ga_name=history");
    },
    // pageSize 改变时会触发
    handleCurrentChange(val) {
      this.param.page = val;
      if (val * this.param.pageSize <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Qxss/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Qxss/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    }
  },
  updated() {
    if (this.param.pageSize * this.param.page <= 1500) {
      $('.out-of-page').hide()
    } else {
      $('.out-of-page').show()
    }
    this.vueTogglePmsTooltip();
  }
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
  .item_content1 {
    position: relative;
    height: auto;
    background-color: white;
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
  .actions {
    position: static;
    padding-right: 10px;
    display: flex;
    justify-content: flex-end;
    > div {
      margin-left: 5px;
    }
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
