<template>
  <div class="la-list globaldrugs-list">
    <List :loading="listLoading" :nodata="res4 && !res4.length">
      <div class="actions">
        <span
          class="action-btn"
          :class="{ 'abandon-click-method': nopms && nopms.visualization }"
          @click="sendGa"
        >
          <img
            src="~@/assets/imgs/globaldrugs/fx_icon.png"
            width="14px"
            alt=""
          />
          智能分析
        </span>
        <span
          class="action-btn"
          :class="{ 'abandon-click-method': nopms && nopms.compare }"
          @click="goToContrast"
        >
          <img
            src="~@/assets/imgs/globaldrugs/db_icon.png"
            width="14px"
            alt=""
          />
          对比
        </span>
        <span
          class="action-btn"
          :class="{ 'abandon-click-method': nopms && nopms.rss }"
          @click="handleActionsClick('订阅')"
        >
          <img
            src="~@/assets/imgs/globaldrugs/dy_icon.png"
            width="14px"
            alt=""
          />
          订阅
        </span>

        <span
          class="action-btn"
          @click="handleActionsClick('AI推荐')"
          style="color: #9aa4b8"
        >
          <img
            src="~@/assets/imgs/globaldrugs/ai_icon.png"
            width="14px"
            alt=""
          />
          AI推荐
        </span>

        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Globaldrugs"
          :showArray="tableHead"
          @changeTableHeader="(list) => changeTableHeader(this, list)"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Globaldrugs"
          api_name="globaldrugs"
          :max_num="extendCount.targetCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="targetGroup"
        ></Export>
      </div>
      <el-table
        :data="res4"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        :row-key="getRowKeys"
        :expand-row-keys="expands.expandsrow"
        @sort-change="sortChange"
        :default-sort="order.name ? defaultSort(order.name) : {}"
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
                :header-cell-style="{ background: '#EBEEF5' }"
              >
                <el-table-column
                  v-for="(item, index) in expandFiled"
                  :prop="item.prop"
                  :sortable="item.sort"
                  :key="index"
                  :min-width="item.field_width || item.width || 100"
                  :label="item.label"
                >
                  <template
                    :slot="item.tips ? 'header' : ''"
                    slot-scope="scope"
                  >
                    <span>
                      {{ item.label }}
                    </span>
                  </template>
                  <template slot-scope="scope">
                    <div :title="scope.row[item.prop]">
                      <!-- 药品名称 -->
                      <template v-if="item.prop === 'drugname_standard'">
                        <div>
                          <a
                            tag="a"
                            class="cl-blue"
                            @click="
                              goToDetail(
                                scope.row.hash_drugname_standard,
                                scope.row.hash_company
                              )
                            "
                            :title="
                              scope.row.zwname +
                              ' ' +
                              scope.row.drugname_standard
                            "
                            >{{ scope.row.zwname }}
                            {{ scope.row.drugname_standard }}</a
                          >
                        </div>
                      </template>
                      <!-- 靶点 -->
                      <template v-else-if="item.prop === 'targets_abbr'">
                        <div>
                          {{
                            scope.row.targets_abbr || scope.row.targets || "-"
                          }}
                        </div>
                      </template>
                      <!-- 全球最高阶段 -->
                      <template v-else-if="item.prop === 'phase1'">
                        <div
                          v-if="scope.row.phase1 === '批准上市'"
                          class="phase"
                        >
                          <div>{{ scope.row.phase1 }}</div>
                          <span v-if="scope.row.phase1_date"
                            >({{ scope.row.phase1_date }})</span
                          >
                        </div>

                        <span v-else>{{ scope.row.phase1 || "-" }}</span>
                      </template>

                      <!-- 中国最高阶段 -->
                      <template v-else-if="item.prop === 'phase2'">
                        <div
                          v-if="scope.row.phase2 === '批准上市'"
                          class="phase"
                        >
                          <div>{{ scope.row.phase2 }}</div>
                          <span v-if="scope.row.phase2_date"
                            >({{ scope.row.phase2_date }})</span
                          >
                        </div>

                        <span v-else>{{ scope.row.phase2 || "-" }}</span>
                      </template>
                      <!-- 最新状态时间 -->
                      <template v-else-if="item.prop === 'date'">
                        <div v-if="scope.row.date">
                          {{ scope.row.date.substring(0, 10) }}
                        </div>
                      </template>
                      <div v-else>
                        {{ scope.row[item.prop] || "-" }}
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
          v-for="(item, index) in tableHead"
          :prop="item.prop"
          :key="index"
          :sortable="item.sort"
          :min-width="item.width"
          :width="item.okWidth || null"
          :label="item.label"
        >
          <template slot-scope="scope">
            <div>
              <template v-if="item.prop === 'targets_abbr'">
                <router-link
                  :to="`/globaldrugs/target/detail?target=${encodeURIComponent(
                    scope.row.hash_targets_abbr
                  )}`"
                  tag="a"
                  target="_blank"
                  class="company-hover"
                  :title="scope.row[item.prop]"
                  >{{ scope.row[item.prop] }}</router-link
                >
              </template>
              <!-- 药物数量 -->
              <template v-else-if="item.prop === 'allcount'">
                <div
                  class="extensible-td"
                  v-if="scope.row[item.prop] > 0"
                  @click="getExpandRes(item.prop, scope.row[item.prop], scope)"
                >
                  {{ scope.row[item.prop] }}
                </div>
                <span v-else class="no-click">{{ scope.row[item.prop] }}</span>
              </template>
              <!-- 批准上市 -->
              <template v-else-if="item.prop === 'phase7'">
                <div
                  class="extensible-td"
                  v-if="scope.row[item.prop] > 0"
                  @click="getExpandRes(item.prop, scope.row[item.prop], scope)"
                >
                  {{ scope.row[item.prop] }}
                </div>
                <span v-else class="no-click">{{ scope.row[item.prop] }}</span>
              </template>
              <!-- 注册申请 -->
              <template v-else-if="item.prop === 'phase6'">
                <div
                  class="extensible-td"
                  v-if="scope.row[item.prop] > 0"
                  @click="getExpandRes(item.prop, scope.row[item.prop], scope)"
                >
                  {{ scope.row[item.prop] }}
                </div>
                <span v-else class="no-click">{{ scope.row[item.prop] }}</span>
              </template>
              <!-- 临床Ⅲ期 -->
              <template v-else-if="item.prop === 'phase5'">
                <div
                  class="extensible-td"
                  v-if="scope.row[item.prop] > 0"
                  @click="getExpandRes(item.prop, scope.row[item.prop], scope)"
                >
                  {{ scope.row[item.prop] }}
                </div>
                <span v-else class="no-click">{{ scope.row[item.prop] }}</span>
              </template>
              <!-- 临床Ⅱ期 -->
              <template v-else-if="item.prop === 'phase4'">
                <div
                  class="extensible-td"
                  v-if="scope.row[item.prop] > 0"
                  @click="getExpandRes(item.prop, scope.row[item.prop], scope)"
                >
                  {{ scope.row[item.prop] }}
                </div>
                <span v-else class="no-click">{{ scope.row[item.prop] }}</span>
              </template>

              <!-- 临床Ⅰ期 -->
              <template v-else-if="item.prop === 'phase3'">
                <div
                  class="extensible-td"
                  v-if="scope.row[item.prop] > 0"
                  @click="getExpandRes(item.prop, scope.row[item.prop], scope)"
                >
                  {{ scope.row[item.prop] }}
                </div>
                <span v-else class="no-click">{{ scope.row[item.prop] }}</span>
              </template>

              <!-- 临床申请 -->
              <template v-else-if="item.prop === 'phase2'">
                <div
                  class="extensible-td"
                  v-if="scope.row[item.prop] > 0"
                  @click="getExpandRes(item.prop, scope.row[item.prop], scope)"
                >
                  {{ scope.row[item.prop] }}
                </div>
                <span v-else class="no-click">{{ scope.row[item.prop] }}</span>
              </template>

              <!-- 临床前 -->
              <template v-else-if="item.prop === 'phase1'">
                <div
                  class="extensible-td"
                  v-if="scope.row[item.prop] > 0"
                  @click="getExpandRes(item.prop, scope.row[item.prop], scope)"
                >
                  {{ scope.row[item.prop] }}
                </div>
                <span v-else class="no-click">{{ scope.row[item.prop] }}</span>
              </template>

              <!-- 撤市 -->
              <template v-else-if="item.prop === 'phase8'">
                <div
                  class="extensible-td"
                  v-if="scope.row[item.prop] > 0"
                  @click="getExpandRes(item.prop, scope.row[item.prop], scope)"
                >
                  {{ scope.row[item.prop] }}
                </div>
                <span v-else class="no-click">{{ scope.row[item.prop] }}</span>
              </template>

              <!-- 其他 -->
              <template v-else-if="item.prop === 'phase0'">
                <div
                  class="extensible-td"
                  v-if="scope.row[item.prop] > 0"
                  @click="getExpandRes(item.prop, scope.row[item.prop], scope)"
                >
                  {{ scope.row[item.prop] }}
                </div>
                <span v-else class="no-click">{{ scope.row[item.prop] }}</span>
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
          v-if="extendCount.targetCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.targetCount"
          :disabled="nopms.fy"
          :class="{ 'abandon-click-method': nopms.fy }"
        >
        </el-pagination>
        <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
      </div>
      <alert-wrong ref="alertWrongFour"></alert-wrong>
    </List>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import List from "@/components/layouts/list";
import Export from "@/components/common/globaldrugs/export";
import { mapState } from "vuex";
import tablehead from "@/config/tablehead";
import listCheck from "@/components/common/globaldrugs/list-check";
import AlertWrong from "./alert.vue";
import commonMixins from "@/mixins/common.js";
import setTableHMixins from "@/mixins/setTableH.js";
const defaultFiled = tablehead.globaldrugs.target;
const expandFiled = tablehead.globaldrugs.targetExpand;
export default {
  components: {
    LoadingGif,
    List,
    Export,
    listCheck,
    AlertWrong,
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      vuex_name: "Globaldrugs",
      scope: "",
      defaultFiled: defaultFiled,
      expandFiled: expandFiled,
      checkall: [],
      checkedFiled: [],
      tableHead: [],
      getRowKeys(row) {
        return row.targets_abbr;
      },
      expandParams: {
        //存分组查询的条件
        targets_abbr: "", // 企业名称
        phase: "", // 研发阶段
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
      tableconf: (state) => state.Globaldrugs.tableconf,
      allBase: (state) => state.Globaldrugs.allBase,
      res4: (state) =>
        _.keys(state.Globaldrugs.res4).length ? state.Globaldrugs.res4 : [],
      errocode: (state) => state.Globaldrugs.error,
      listLoading: (state) => state.Globaldrugs.listLoading,
      putong: (state) => state.Globaldrugs.putong,
      gaoji: (state) => state.Globaldrugs.gaoji,
      shaixuan: (state) => state.Globaldrugs.shaixuan,
      extendCount: (state) => state.Globaldrugs.extendCount,
      param: (state) => state.Globaldrugs.bdll_param, // 附加参数(存于vuex内)
      nopms: (state) => state.Globaldrugs.nopms,
      order: (state) => state.Globaldrugs.order,
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
    handleActionsClick(name) {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "企业版_全球药物_列表_" + name
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_列表_" + name,
      ]);
      if (name == "订阅" && this.nopms && !this.nopms.rss) {
        let routeData = this.$router.resolve({
          path: `/usercenter/take/new`,
          query: {
            source: "globaldrugs",
          },
        });
        window.open(routeData.href, "_blank");
      }
      if (name == "AI推荐") {
        this.$refs.alertWrong.changeAlert();
      }
    },
    // 药品详情
    goToDetail(drugname_standard, company) {
      let routeData = this.$router.resolve({
        path:
          "/globaldrugs/detail?drugname_standard=" +
          encodeURIComponent(drugname_standard) +
          "&company_standard=" +
          encodeURIComponent(company),
      });
      window.open(routeData.href, "_blank");
    },
    // 跳转到对比页面
    goToContrast() {
      if (this.nopms && !this.nopms.compare) {
        window.ga("send", "event", "tab", "click", "企业版_全球药物_列表_对比");
        window._paq.push([
          "trackEvent",
          "tab",
          "click",
          "企业版_全球药物_列表_对比",
        ]);

        let routeData = this.$router.resolve({
          path: "/globaldrugs/contrast",
        });
        window.open(routeData.href, "_blank");
      }
    },
    // 跳转到智能分析
    sendGa() {
      if (this.nopms && !this.nopms.visualization) {
        window.ga(
          "send",
          "event",
          "tab",
          "click",
          "企业版_全球药物_列表_智能分析"
        );
        window._paq.push([
          "trackEvent",
          "tab",
          "click",
          "企业版_全球药物_列表_智能分析",
        ]);
        let routeData = this.$router.resolve({
          path: "/globaldrugs/analysis",
          query: {
            ...this.putong,
          },
        });
        window.open(routeData.href, "_blank");
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
        Store.dispatch("Globaldrugs/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Globaldrugs/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleRequest(props) {
      Store.dispatch("Globaldrugs/getGroupRes", {
        path: "/api/globaldrugs/targetList",
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
        "Globaldrugs/order",
        Object.assign({}, this.$store.state.Globaldrugs.order, {
          targetGroup: sort ? sort : null,
        })
      );
      Store.dispatch("Globaldrugs/nomalSearch", { params: this.param });
    },
    // 获取展开列表的数据
    getExpandRes(name, num, scope) {
      console.log(name, num, scope);
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "企业版_全球药物_按靶点浏览_展开二级列表"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_按靶点浏览_展开二级列表",
      ]);

      if (Number(num)) {
        this.expandParams.targets_abbr = scope.row.targets_abbr;
        this.expandParams.phase = name;
        this.scope = scope.column.property;
        if (scope.row.second[this.scope]) return;
        this.expandParams.page = 1;
        this.expandsLoading = true;
        this.handleRequest(scope);
      }
    },
    toggleRowExpansion(row, column, cell, event) {
      console.log(cell);
      if (event.target.localName === "td" || event.target.className === "cell")
        return;
      let num = $(cell).find(".extensible-td").text();
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
          this.expands.expandsrow.push(row.targets_abbr);
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
.globaldrugs {
  .company-hover {
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    &:hover {
      color: #002fa7;
      text-decoration: none;
    }
  }

  .el-table .ascending .sort-caret.ascending {
    border-bottom-color: #ffa914;
  }
  .el-table .descending .sort-caret.descending {
    border-top-color: #ffa914;
  }

  .el-table__expanded-cell[class*="cell"] {
    border-top: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
  }

  .el-table__expanded-cell .el-table td {
    border-bottom: 1px solid #ebeef5;
  }

  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #f5f8fc;
  }
  .el-table {
    .el-table__body tr.el-table__row--striped:hover > td,
    .el-table__body tr:hover > td {
      background-color: #ebeef5 !important;
    }

    .expanded {
      background: #f3f5f9;
    }
  }

  .extensible-table {
    .extensible-td {
      cursor: pointer;
      color: #002fa7;
      font-size: 13px;
    }

    .no-click {
      color: #5c6973;
      cursor: unset;
    }
    tr.el-table__row--striped {
      td {
        &.active {
          color: @PrimaryColor;
          font-weight: 600;
          // background: url("~@/assets/imgs/zhuce/el-icon-caret-top.png")
          //   no-repeat 10px bottom #f5f8fb !important;

          .extensible-td {
            color: #ffa914;
            font-size: 14px;
            text-decoration: underline;
          }
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
        // background: url("~@/assets/imgs/zhuce/el-icon-caret-top.png") no-repeat
        //   10px bottom;

        .extensible-td {
          color: #ffa914;
          font-size: 14px;
          text-decoration: underline;
        }
      }
    }
  }

  .table-expand {
    .cl-blue {
      font-size: 14px;
    }

    td .cell > div {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      max-height: 35px;
    }
  }
}
</style>
