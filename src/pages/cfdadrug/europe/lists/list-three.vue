<template>
  <div class="la-list la-epyp-list">
    <List :loading="listLoading" :nodata="res3 && !res3.length">
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
          :max_num="extendCount.holderCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="holderGroup"
        ></Export>
      </div>
      <el-table
        :data="res3"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        :row-key="getRowKeys"
        :expand-row-keys="expands.expandsrow"
        @sort-change="sortChange"
        @cell-click="toggleRowExpansion"
        class="table extensible-table"
        style="width: 100%"
        v-if="show_table"
      >
        <el-table-column type="expand" width="1">
          <div type="expand" slot-scope="props" class="table-expand">
            <!-- 自定义加载界面 -->
            <LoadingGif
              :className="'list-in-loading'"
              :classNameImg="'little-size-loading'"
              :loadFlag="expandsLoading"
              v-if="expandsLoading"
            ></LoadingGif>
            <!-- 加载完成显示部分 -->
            <div v-else>
              <el-table
                :data="props.row.second[scope].res"
                fixed
                ref="expandtable"
                style="width: 100%"
              >
                <el-table-column
                  v-for="(item, index) in expandFiled"
                  :prop="item.prop"
                  :sortable="item.sort"
                  :key="item.prop + 'index_'"
                  :min-width="item.field_width || item.width || 100"
                  :label="item.label"
                >
                  <template slot-scope="scope">
                    <div :title="scope.row[item.prop]">
                      <div v-if="item.prop === 'num'">
                        <router-link
                          v-if="scope.row.source === 1"
                          tag="a"
                          :to="{
                            path: '/epyp/emadetail/' + scope.row.id,
                            query: { active: scope.row.active },
                          }"
                          target="_blank"
                          style="color: #4877e8"
                          >{{ scope.row.num }}</router-link
                        >
                        <router-link
                          v-if="scope.row.source === 2"
                          tag="a"
                          :to="{
                            path: '/epyp/hmadetail/' + scope.row.id,
                            query: { active: scope.row.active },
                          }"
                          target="_blank"
                          style="color: #4877e8"
                          >{{ scope.row.num }}</router-link
                        >
                      </div>
                      <div v-else>
                        {{ scope.row[item.prop] }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-if="props.row.second[scope].count > 20"
                @current-change="(val) => expandCurrentChange(val, props)"
                :current-page="props.row.second[scope].page"
                :page-size="20"
                layout="prev, next"
                :total="props.row.second[scope].count"
                :disabled="nopms.fy"
                :class="{ 'abandon-click-method': nopms.fy }"
              >
              </el-pagination>
            </div>
          </div>
        </el-table-column>
        <el-table-column
          v-for="(item, i) in tableHead"
          :prop="item.prop"
          :key="i + '_index'"
          :min-width="item.width"
          :sortable="item.sort"
          :width="item.okWidth || null"
          :label="item.label"
        >
          <!-- 自定义表头 -->
          <template :slot="item.tips ? 'header' : ''" slot-scope="scope">
            <span>
              {{ item.label }}
              <el-tooltip class="item" effect="zhuce" placement="right">
                <div slot="content">
                  品种数：按照活性成分除重后，该持有人获批的品种数量。<br />
                  品种总数：该持有人获批的品种总数，包括同活性成分，但为不同产品编号和不同商品名称。
                </div>
                <i
                  class="el-icon-question cl-green"
                  style="margin-left: 4px"
                ></i>
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <!-- 已批准数 -->
              <template v-if="item.prop === 'pizhun_count'">
                <span
                  class="extensible-td"
                  @click="
                    getExpandRes(
                      item.prop,
                      scope.row[item.prop],
                      scope.row.pizhun_count,
                      scope
                    )
                  "
                  >{{ scope.row[item.prop] }}
                  <span v-if="scope.row.pizhun_all">(</span
                  ><span v-if="scope.row.pizhun_all" class="num-text">{{
                    scope.row.pizhun_all
                  }}</span
                  ><span v-if="scope.row.pizhun_all">)</span></span
                >
              </template>
              <!-- 已撤市数 -->
              <template v-else-if="item.prop === 'cheshi_count'">
                <span
                  class="extensible-td"
                  @click="
                    getExpandRes(
                      item.prop,
                      scope.row[item.prop],
                      scope.row.cheshi_count,
                      scope
                    )
                  "
                  >{{ scope.row[item.prop] }}
                  <span v-if="scope.row.cheshi_all">(</span
                  ><span v-if="scope.row.cheshi_all" class="num-text">{{
                    scope.row.cheshi_all
                  }}</span
                  ><span v-if="scope.row.cheshi_all">)</span>
                </span>
              </template>
              <!-- 最新批准日期 -->
              <template v-else-if="item.prop === 'new_date'">
                <span
                  class="extensible-td"
                  @click="
                    getExpandRes(
                      item.prop,
                      scope.row[item.prop],
                      scope.row.new_date_count,
                      scope
                    )
                  "
                  >{{ scope.row[item.prop] }}
                  <span v-if="scope.row.new_date_count">(</span
                  ><span v-if="scope.row.new_date_count" class="num-text">{{
                    scope.row.new_date_count
                  }}</span
                  ><span v-if="scope.row.new_date_count">)</span>
                </span>
              </template>
              <!-- 最早批准日期 -->
              <template v-else-if="item.prop === 'old_date'">
                <span
                  class="extensible-td"
                  @click="
                    getExpandRes(
                      item.prop,
                      scope.row[item.prop],
                      scope.row.old_date_count,
                      scope
                    )
                  "
                  >{{ scope.row[item.prop] }}
                  <span v-if="scope.row.old_date_count">(</span
                  ><span v-if="scope.row.old_date_count" class="num-text"
                    >{{ scope.row.old_date_count }}</span
                  ><span v-if="scope.row.old_date_count">)</span>
                </span>
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
          v-if="extendCount.holderCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.holderCount"
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
const defaultFiled = tablehead.cfdadrug.holder;
const expandFiled = tablehead.cfdadrug.holderExpand;
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
      expandFiled: expandFiled,
      checkall: [],
      checkedFiled: [],
      tableHead: [],
      getRowKeys(row) {
        return row.changshang;
      },
      expandParams: {
        //存分组查询的条件
        changshang_eq: "",
        pageSize: 20,
        page: 1,
      },
      expands: {
        expandsrow: [], //存要展开的行
        element: null, //存分组点击的dom元素
        expanCell: "", //存当前展开项对应的cell 便于控制收起
        expandRes: {}, //展开项对应的资源
        erroCode: "200",
      },
      expandsLoading: true,
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
      tableconf: (state) => state.Epyp.tableconf,
      allBase: (state) => state.Epyp.allBase,
      res3: (state) => (_.keys(state.Epyp.res3).length ? state.Epyp.res3 : []),
      errocode: (state) => state.Epyp.error,
      listLoading: (state) => state.Epyp.listLoading,
      putong: (state) => state.Epyp.putong,
      gaoji: (state) => state.Epyp.gaoji,
      shaixuan: (state) => state.Epyp.shaixuan,
      extendCount: (state) => state.Epyp.extendCount,
      param: (state) => state.Epyp.holder_param, // 附加参数(存于vuex内)
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
    res3: {
      handler() {
        // 重置行点击
        this.expands = {
          expandsrow: [],
          element: null,
          expanCell: "",
          expandRes: {},
          erroCode: "200",
        };

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
    handleRequest(props) {
      Store.dispatch("Epyp/getGroupRes", {
        path: "/api/epyp/holderList",
        params: this.expandParams,
      })
        .then((res) => {
          this.expandsLoading = false;
          if (res.data.code == 404) {
            this.expands.erroCode = "404";
          } else {
            if (res.data.code == 200) {
              this.expands.erroCode = "200";
              this.$set(props.row.second, [this.scope], res.data.data);
              // 处理二级列表出现后不能滚动的问题
              $(".el-table").addClass("el-table--scrollable-y");
            }
          }
        })
        .catch((error) => {
          this.expandsLoading = false;
          this.expands.erroCode = "500";
        });
    },
    //分组展示的page发生改变
    expandCurrentChange(val, props) {
      this.expandParams.page = val;
      this.handleRequest(props);
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
          holderGroup: sort ? sort : null,
        })
      );
      Store.dispatch("Epyp/nomalSearch", { params: this.param });
    },
    // 获取展开列表的数据
    getExpandRes(groupname, date, num, scope) {
      console.log(groupname, date, num, scope);
      window.ga(
        "send",
        "event",
        "tab",
        "click",
        this.allBase.dbename + "_namegroup_" + groupname
      );
      window._paq.push([
        "trackEvent",
        "tab",
        "click",
        this.allBase.dbename + "_namegroup_" + groupname,
      ]);

      if (Number(num)) {
        this.expandParams.changshang_eq = scope.row.changshang;
        // 已撤市传值 已批准数传值
        if (groupname === "cheshi_count" || groupname === "pizhun_count") {
          if (groupname === "pizhun_count") {
            this.expandParams.zwstatus = "已批准";
          } else {
            this.expandParams.zwstatus = "已撤市";
          }
        } else {
          delete this.expandParams.zwstatus;
        }

        // 最早批准日期传值 最新批准日期传值
        if (groupname === "old_date" || groupname === "new_date") {
          if (groupname === "new_date") {
            this.expandParams.time_eq = scope.row.new_date;
          } else {
            this.expandParams.time_eq = scope.row.old_date;
          }
        } else {
          delete this.expandParams.time_eq;
        }
        this.scope = scope.column.property;
        if (scope.row.second[this.scope]) return;
        this.expandParams.page = 1;
        this.expandsLoading = true;
        this.handleRequest(scope);
      }
    },
    toggleRowExpansion(row, column, cell, event) {
      if (event.target.localName === "td" || event.target.className === "cell")
        return;
      let num =
        Number($(cell).text().trim()) || $(cell).find(".num-text").text();
      if (num) {
        let isOneRow = false;
        let column_index = $(cell).index();
        let row_index = $(cell).parent().index();
        if (this.expands.old_row >= 0) {
          if (this.expands.old_row == row_index) {
            isOneRow = true;
          }
        }
        this.expands.old_row = row_index;
        let src_el = $(event.srcElement).closest("td");
        let name = "active";
        if (!this.expands.element) {
          this.expands.element = src_el;
        }
        this.expands.expandsrow = [];
        //判断是不是之前的按钮
        if (column.id == this.expands.expanCell && isOneRow) {
          if (src_el.hasClass("active")) {
            this.expands.element.removeClass("active");
          } else {
            this.expands.element.addClass("active");
          }
          this.expands.expanCell = "";
        } else {
          this.expands.expanCell = column.id;
          this.expands.expandsrow.push(row.changshang);
          this.expands.element.removeClass("active");
          src_el.addClass("active");
          this.expands.element = src_el;
        }
        //console.log(this.expands,row)
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
