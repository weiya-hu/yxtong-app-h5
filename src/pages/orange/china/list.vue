<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions" :style="posi">
        <!-- <a class="action-btn" target="_blank" href="https://db.yaozh.com/bigdata/yzxpj?source=db&dbname=orangebook" style="text-decoration: none"><i class="iconfont">&#xe63c;</i> 大数据可视化分析</a> -->
        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Orangebook"
          :showArray="tableHead"
          @changeTableHeader="(list) => changeTableHeader(this, list)"
          style="text-align: left"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Orangebook"
          api_name="orangebook"
          :max_num="extendCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"
          style="text-align: left"
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
          style="width: 100%"
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
                  <span v-if="vueCheckListPms('Orangebook', item.label)">
                    <router-link
                      tag="a"
                      :to="{ path: '/orangebook/' + scope.row.id }"
                      target="_blank"
                      class="cl-blue"
                      v-html="scope.row.name"
                    ></router-link>
                  </span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'jixing'">
                  <span v-if="vueCheckListPms('Orangebook', item.label)">{{
                    scope.row.jixing
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'guige'">
                  <span v-if="vueCheckListPms('Orangebook', item.label)">{{
                    scope.row.guige
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'piwen'">
                  <span v-if="vueCheckListPms('Orangebook', item.label)">
                    <a
                      :class="
                        scope.row.piwen == 0
                          ? 'no_link-underline'
                          : 'link-underline link-underline_hover'
                      "
                      @click.prevent="
                        pushRoute(
                          'cfdadrug',
                          'database_cfdadrug',
                          'CfdaDrug',
                          scope.row.bianma
                        )
                      "
                      >{{ scope.row.piwen }}</a
                    >
                  </span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'cname'">
                  <span v-if="vueCheckListPms('Orangebook', item.label)">{{
                    scope.row.cname
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'ename'">
                  <span v-if="vueCheckListPms('Orangebook', item.label)">{{
                    scope.row.ename
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'rldf'">
                  <span v-if="vueCheckListPms('Orangebook', item.label)">{{
                    scope.row.rldf
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'rldj'">
                  <span v-if="vueCheckListPms('Orangebook', item.label)">{{
                    scope.row.rldj
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'originalc'">
                  <span v-if="vueCheckListPms('Orangebook', item.label)">{{
                    scope.row.originalc
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-if="item.prop === 'bigdata_analy'">
                  <a
                    :href="
                      'https://db.yaozh.com/bigdata/yzxpj?source=db&dbname=orangebook&id=' +
                      scope.row.id
                    "
                    class="cl-blue"
                    target="_blank"
                    >查看</a
                  >
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="positon: relative">
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
export default {
  components: {
    List,
    Export,
    listCheck,
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      defaultFiled: [],
      filedVisible: false,
      tableHead: [],
      exportDefaultFiled: [],
      checkallShow: [],
      show_table: true,
      vuex_name: "Orangebook",
      changeStyle: "",
      tableHeight: document.documentElement.clientHeight - 48 - 60 - 35 - 88,
      posi: "position:static;text-align:right;padding:0 15px;",
    };
  },
  computed: {
    ...mapState({
      tableconf: (state) => state.Orangebook.tableconf,
      nopms: (state) => state.Orangebook.nopms,
      allBase: (state) => state.Orangebook.allBase,
      extendCount: (state) => state.Orangebook.extendCount,
      putong: (state) => state.Orangebook.putong,
      gaoji: (state) => state.Orangebook.gaoji,
      shaixuan: (state) => state.Orangebook.shaixuan,
      param: (state) => state.Orangebook.param,
      listLoading: (state) => state.Orangebook.listLoading,
      res1: (state) =>
        _.keys(state.Orangebook.res1).length ? state.Orangebook.res1 : [],
      order: (state) => state.Orangebook.order,
    }),
  },
  // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
  activated() {
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
      if (val * this.param.pageSize <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Orangebook/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Orangebook/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    // 链接到数据库
    pushRoute(href, route_name, vuex_name, option) {
      if (option) {
        this.$router.push({
          path: href,
          name: route_name,
        });
        Store.commit(vuex_name + "/fourth", [
          {
            logic: "_and",
            name: "bianma_eq",
            value: option,
          },
        ]);
        if (Store.state[vuex_name].query) {
          Store.state[vuex_name].query = [];
        }
        if (Store.state[vuex_name].putong) {
          Store.state[vuex_name].putong = {};
        }
        if (Store.state[vuex_name].conditions) {
          Store.state[vuex_name].conditions = [];
        }
        if (Store.state[vuex_name].gaoji) {
          Store.state[vuex_name].gaoji = {};
        }
        if (Store.state[vuex_name].groups) {
          Store.state[vuex_name].groups = {};
        }
        Store.commit(vuex_name + "/hot", {});
        Store.commit(vuex_name + "/hot_checked", {});
        Store.dispatch(vuex_name + "/nomalSearch", { iffirstCommonIn: true });
      }
    },
  },
  mounted() {},
  updated() {
    if (this.param.pageSize * this.param.page <= 1500) {
      $(".out-of-page").hide();
    } else {
      $(".out-of-page").show();
    }
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
  .item_content1 {
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
