<template>
  <div class="la-list clinical-two">
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
          vuex_name="Clinical"
          :showArray="tableHead"
          @changeTableHeader="(list) => changeTableHeader(this, list)"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Clinical"
          api_name="clinical"
          :max_num="extendCount.Interventions1Count"
          :defaultFiled="exportDefaultFiled"
          outdataAction="interventions1group"
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
                      <!-- 疾病领域 -->
                      <template v-if="item.prop === 'interventions2'">
                        <span>{{ scope.row[item.prop] }}</span>
                      </template>
                      <!-- 试验总数 -->
                      <template v-else-if="item.prop === 'all'">
                        <span>{{ scope.row[item.prop] }}</span>
                      </template>
                      <template v-else>
                        <span
                          style="text-decoration: underline; cursor: pointer"
                          @click="
                            goListOne(
                              expandParams.interventions1_guifan,
                              scope.row[item.prop],
                              item.label,
                              scope.row.interventions2
                            )
                          "
                        >
                          {{ scope.row[item.prop] }}
                        </span>
                      </template>
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
          :label="item.label"
        >
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <!-- 疾病领域 -->
              <template v-if="item.prop === 'interventions1_guifan'">
                <span
                  class="extensible-text"
                  @click="getExpandRes(item.prop, scope.row[item.prop], scope)"
                  >{{ scope.row[item.prop] }}</span
                >
              </template>
              <!-- 试验总数 -->
              <template v-else-if="item.prop === 'all'">
                <span>{{ scope.row[item.prop] }}</span>
              </template>
              <template v-else>
                <span
                  style="text-decoration: underline; cursor: pointer"
                  @click="
                    goListOne(
                      scope.row.interventions1_guifan,
                      scope.row[item.prop],
                      item.label
                    )
                  "
                >
                  {{ scope.row[item.prop] }}
                </span>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative">
        <el-pagination
          v-if="extendCount.Interventions1Count"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.Interventions1Count"
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
const defaultFiled = tablehead.clinical.gyyw;
const expandFiled = tablehead.clinical.gyywExpand;
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
        return row.interventions1_guifan;
      },
      expandParams: {
        //存分组查询的条件
        interventions1_guifan: "",
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
      phaseObj: {
        "Early phase1": ["Early Phase 1"],
        phase1: ["Phase 1"],
        "phase1/phase2": ["Phase 1/Phase 2"],
        phase2: ["Phase 2"],
        "phase2/phase3": ["Phase 2/Phase 3"],
        phase3: ["Phase 3"],
        phase4: ["Phase 4"],
        试验总数: [
          "Early Phase 1",
          "Phase 1",
          "Phase 1/Phase 2",
          "Phase 2",
          "Phase 2/Phase 3",
          "Phase 3",
          "Phase 4",
        ],
      },
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      tableconf: (state) => state.Clinical.tableconf,
      allBase: (state) => state.Clinical.allBase,
      res3: (state) =>
        _.keys(state.Clinical.res3).length ? state.Clinical.res3 : [],
      errocode: (state) => state.Clinical.error,
      listLoading: (state) => state.Clinical.listLoading,
      putong: (state) => state.Clinical.putong,
      gaoji: (state) => state.Clinical.gaoji,
      shaixuan: (state) => state.Clinical.shaixuan,
      match_shaixuan_values: (state) => state.Clinical.match_shaixuan_values,
      hot: (state) => state.Clinical.hot,
      groups: (state) => state.Clinical.groups,
      extendCount: (state) => state.Clinical.extendCount,
      param: (state) => state.Clinical.gyyw_param, // 附加参数(存于vuex内)
      nopms: (state) => state.Clinical.nopms,
      order: (state) => state.Clinical.order,
      queryData: (state) => state.Clinical.queryData,
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
    // 点击跳转到默认列表页并激活参数
    async goListOne(name, num, prop, interventions2) {
      console.log(name, num, prop, interventions2);
      if (Number(num) <= 0) return;
      let groups = _.cloneDeep(this.groups);
      console.log(groups);
      // 获取之前的条件筛选选中项
      if (Object.keys(groups).length > 0) {
        groups.phases = this.phaseObj[prop];
        if (groups.interventions1_guifan) {
          if (!groups.interventions1_guifan.includes(name)) {
            groups.interventions1_guifan.push(name);
          }
        } else {
          groups.interventions1_guifan = [];
          groups.interventions1_guifan.push(name);
        }
      } else {
        groups.phases = [];
        groups.phases = this.phaseObj[prop];
        groups.interventions1_guifan = [];
        groups.interventions1_guifan.push(name);
      }

      let shaixuan = this.match_shaixuan_values;
      for (let key in groups) {
        shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
        groups[key].map((v) => {
          shaixuan[key][v] = v;
        });
      }
      console.log(shaixuan);
      console.log(groups);
      await this.$store.commit(
        "Clinical/match_shaixuan_values",
        _.assign({}, this.match_shaixuan_values, shaixuan)
      );
      (await interventions2) &&
        this.$store.commit(
          "Clinical/queryData",
          _.assign({}, this.queryData, {
            interventions2: interventions2,
          })
        );
      await this.$store.commit("Clinical/groups", groups);
      await this.$store.commit("Clinical/tabname", "first");
      await this.$store.commit("Clinical/path", "/api/clinical");
      await Store.dispatch("Clinical/nomalSearch", {
        path: "/api/clinical",
        queryToPutong: false,
      });
    },

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
      if (val * this.param.pageSize <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Clinical/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Clinical/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleRequest(props) {
      Store.dispatch("Clinical/getGroupRes", {
        path: "/api/clinical/interventions2group",
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
    // sortChange (column, prop, order) {
    //   let sort
    //   // column.prop为null时，默认排序
    //   if (column.prop) {
    //     if (column.order == "ascending") {
    //       sort = column.prop + " " + "asc"
    //     } else if (column.order == "descending") {
    //       sort = column.prop + " " + "desc"
    //     } else {
    //       sort = ""
    //     }
    //   }
    //   this.param.order = sort
    //   Store.commit('Clinical/order', Object.assign({}, this.$store.state.Clinical.order, {name: sort ? sort : null}))
    //   Store.dispatch('Clinical/nomalSearch',{params:this.param})
    // },
    // 获取展开列表的数据
    getExpandRes(groupname, name, scope) {
      console.log(groupname, name, scope);
      window.ga(
        "send",
        "event",
        "tab",
        "click",
        this.allBase.dbename + "_interventions1group_" + groupname
      );
      window._paq.push([
        "trackEvent",
        "tab",
        "click",
        this.allBase.dbename + "_interventions1group_" + groupname,
      ]);

      if (groupname == "interventions1_guifan") {
        this.expandFiled[0].label = name
        this.expandParams.interventions1_guifan =
          scope.row.interventions1_guifan;
        this.scope = scope.column.property;
        if (scope.row.second[this.scope]) return;
        this.expandParams.page = 1;
        this.expandsLoading = true;
        this.handleRequest(scope);
      }
    },
    toggleRowExpansion(row, column, cell, event) {
      console.log(row, column, cell, event);
      if (event.target.localName === "td" || event.target.className === "cell")
        return;
      if (column.property == "interventions1_guifan") {
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
          this.expands.expandsrow.push(row.interventions1_guifan);
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

.clinical-two {
  .extensible-table {
    .extensible-text {
      cursor: pointer;
      color: @PrimaryColor;
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
