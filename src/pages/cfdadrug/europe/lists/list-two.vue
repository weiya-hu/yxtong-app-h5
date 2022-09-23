<template>
  <div class="la-list la-epyp-list">
    <List :loading="listLoading" :nodata="res2 && !res2.length">
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
          :max_num="extendCount.NameCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="nameGroup"
        ></Export>
      </div>
      <el-table
        :data="res2"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        :row-key="getRowKeys"
        :expand-row-keys="expands.expandsrow"
        @sort-change="sortChange"
        @cell-click="toggleRowExpansion"
        :cell-class-name="cellClass"
        :header-cell-class-name="headerClass"
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
            <!--  -->

            <div v-else-if="tableType === 'one'">
              <el-table
                :data="props.row.second[scope].res"
                fixed
                ref="expandtable"
                style="width: 100%"
              >
                <el-table-column
                  v-for="(item, index) in expandFiledTwo"
                  :prop="item.prop"
                  :sortable="item.sort"
                  :key="index"
                  :min-width="item.width || 100"
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

            <div v-else-if="tableType === 'two'">
              <el-table
                :data="props.row.second[scope].res"
                :span-method="objectSpanMethod"
                fixed
                ref="expandtable"
                style="width: 100%"
              >
                <el-table-column
                  v-for="(item, index) in expandFiled"
                  :prop="item.prop"
                  :sortable="item.sort"
                  :key="index"
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
          v-for="(item, index) in tableHead"
          :prop="item.prop"
          :key="index"
          :sortable="item.sort"
          :min-width="item.width"
          :width="item.okWidth || null"
          :label="item.label"
        >
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
                  >
                    <span class="num-text">{{ scope.row[item.prop] }}</span>
                  </span
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
                  ><span class="num-text">{{ scope.row[item.prop] }}</span></span
                >
              </template>
              <!-- 上市许可持有人数 -->
              <template v-else-if="item.prop === 'holder_count'">
                <span
                  class="extensible-td"
                  @click="
                    getExpandRes(
                      item.prop,
                      scope.row[item.prop],
                      scope.row.holder_count,
                      scope
                    )
                  "
                  ><span class="num-text">{{ scope.row[item.prop] }}</span></span
                >
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
                  >{{ scope.row[item.prop]
                  }} <span v-if="scope.row.new_date_count">(</span><span v-if="scope.row.new_date_count" class="num-text"
                    >{{ scope.row.new_date_count }}</span
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
                  >{{ scope.row[item.prop]
                  }} <span v-if="scope.row.old_date_count">(</span><span v-if="scope.row.old_date_count" class="num-text"
                    >{{ scope.row.old_date_count }}</span
                  ><span v-if="scope.row.old_date_count">)</span>
                </span>
              </template>
              <!-- 审评中 -->
              <template v-else-if="item.prop === 'epypzhuce_count'">
                <span
                  class="extensible-td"
                  @click="
                    otherGetExpand(
                      item.prop,
                      scope.row[item.prop],
                      scope.row.epypzhuce_count,
                      scope
                    )
                  "
                  ><span class="num-text">{{ scope.row[item.prop] }}</span>
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
          v-if="extendCount.NameCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.NameCount"
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
const defaultFiled = tablehead.cfdadrug.epypHxcf;
const expandFiled = tablehead.cfdadrug.epypHxcfExpand;
const expandFiledTwo = tablehead.cfdadrug.epypHxcfSpz;
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
      expandFiledTwo: expandFiledTwo,
      tableType: null,
      checkedFiled: [],
      tableHead: [],
      getRowKeys(row) {
        return row.ylbm;
      },
      otherParams: null, //新增字段二级列表请求参数
      expandParams: {
        //存分组查询的条件
        ylbm_eq: "",
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
      show_table: true,
      expandSort: "",
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 50 - 88,
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      tableconf: (state) => state.Epyp.tableconf,
      allBase: (state) => state.Epyp.allBase,
      res2: (state) => (_.keys(state.Epyp.res2).length ? state.Epyp.res2 : []),
      errocode: (state) => state.Epyp.error,
      listLoading: (state) => state.Epyp.listLoading,
      putong: (state) => state.Epyp.putong,
      gaoji: (state) => state.Epyp.gaoji,
      shaixuan: (state) => state.Epyp.shaixuan,
      extendCount: (state) => state.Epyp.extendCount,
      param: (state) => state.Epyp.ypmc_param, // 附加参数(存于vuex内)
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
    res2: {
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let arr = this.expands.expandRes.res;
      // console.log(this.expands);
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          if (
            arr.length === 1 ||
            arr[rowIndex].changshang !== arr[rowIndex + 1].changshang
          ) {
            return [1, 1];
          } else {
            let rowspan = 1;
            for (let a = rowIndex + 1; a < arr.length; a++) {
              if (arr[rowIndex].changshang === arr[a].changshang) {
                rowspan += 1;
              } else {
                break;
              }
            }
            return [rowspan, 1];
          }
        } else if (rowIndex === arr.length - 1) {
          if (arr[rowIndex].changshang !== arr[rowIndex - 1].changshang) {
            return [1, 1];
          } else {
            return [0, 0];
          }
        } else {
          // console.log(rowIndex);
          // console.log(arr);
          if (arr[rowIndex].changshang !== arr[rowIndex - 1].changshang) {
            if (arr[rowIndex].changshang === arr[rowIndex + 1].changshang) {
              let rowspan = 1;
              for (let a = rowIndex + 1; a < arr.length; a++) {
                if (arr[rowIndex].changshang === arr[a].changshang) {
                  rowspan += 1;
                } else {
                  break;
                }
              }
              return [rowspan, 1];
            } else {
              return [1, 1];
            }
          } else {
            return [0, 0];
          }
        }
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
    setActiveIndex(el) {
      let src_el = el.find(".extensible-td").length
        ? el.find(".extensible-td")
        : el.find(".extensible-num-td");
      let width = src_el.find("span").eq(0).width() / 2 + 15;
      el.eq(0).css("background-position-x", `${width}px`);
    },
    handleRequest(props) {
      let params = {};
      params = this.otherParams ? this.otherParams : this.expandParams;
      let path = this.otherParams
        ? "/api/epyp/epypzhucelist"
        : "/api/epyp/namelist";
      // console.log(params);
      Store.dispatch("Epyp/getGroupRes", {
        path: path,
        params: params,
        row: this.currentRow,
      })
        .then((res) => {
          this.expandsLoading = false;
          if (res.data.code == 404) {
            this.expands.erroCode = "404";
          } else {
            if (res.data.code == 200) {
              this.expands.erroCode = "200";
              this.expands.expandRes = res.data.data;
              // console.log(props);
              if (props)
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
    // //分组展示的page发生改变
    // expandCurrentChange(val, props) {
    //   this.expandParams.page = val;
    //   this.handleRequest(props);
    // },
    //分组展示的page发生改变
    expandCurrentChange(val, props) {
      if (this.otherParams) {
        this.otherParams.page = val;
        this.otherParams.order = props.row.second[this.scope].order;
      } else {
        this.expandParams.page = val;
        this.expandParams.order = props.row.second[this.scope].order;
      }
      this.handleRequest(props, props.row.second[this.scope].order);
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
          nameGroup: sort ? sort : null,
        })
      );
      Store.dispatch('Epyp/nomalSearch',{params:this.param})
    },
    // 获取展开列表的数据
    getExpandRes(groupname, date, num, scope) {
      // console.log(groupname,date,num,scope)
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
      this.otherParams = null;
      console.log(Number(num));
      if (Number(num)) {
        this.currentRow = scope.row;
        this.expandSort = "";
        this.expandParams.ylbm_eq = scope.row.ylbm;
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
        // 上市许可持有人数传值
        if (groupname === "holder_count") {
          this.expandParams.is_changshang = 1;
        } else {
          delete this.expandParams.is_changshang;
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
        if (scope.row.second[this.scope]) {
          this.$set(
            scope.row.second,
            [this.scope],
            scope.row.second[this.scope]
          );
          return;
        }
        this.expandParams.page = 1;
        this.expandsLoading = true;
        this.handleRequest(scope);
      }
    },
    otherGetExpand(groupname, date, num, scope) {
      // console.log(groupname, date, num, scope);
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
        this.currentRow = scope.row;
        this.expandSort = "";

        this.otherParams = {
          page: 1,
          pageSize: 20,
        };
        this.otherParams.ylbm_eq = scope.row.ylbm;
        this.scope = scope.column.property;
        if (scope.row.second[this.scope]) return;
        this.expandsLoading = true;
        this.handleRequest(scope);
      }
    },
    toggleRowExpansion(row, column, cell, event) {
      // console.log(row, column, cell, event);
      if (event.target.localName === "td" || event.target.className === "cell")
        return;
      let num =
        Number($(cell).text().trim()) || $(cell).find(".num-text").text();
      console.log(num);
      if (num>0) {
        let tableTypeArr = ["epypzhuce_count"];
        this.tableType = tableTypeArr.some((item) => item === column.property)
        ? "one"
        : "two";
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
          this.expands.expandsrow.push(row.ylbm);
          this.expands.element.removeClass("active");
          src_el.addClass("active");
          this.expands.element = src_el;
        }
        this.$nextTick(() => {
          this.setActiveIndex(src_el);
        });
        //console.log(this.expands,row)
      }
    },
    headerClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return "padLHeader";
      }
    },
    cellClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return "padLCell";
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
        background: url("~@/assets/imgs/zhuce/el-icon-caret-top.png") no-repeat
          10px bottom #f5f8fb !important;
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
