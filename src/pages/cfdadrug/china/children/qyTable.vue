<template>
  <div class="la-list zdyScrool_Bar">
    <List :loading="listLoading" :nodata="res3 && !res3.res">
      <div class="actions">
        <span class="action-btn" @click="sendGa">
          <span class="icon iconfont">&#xe643;</span>
          智能分析
        </span>
        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="CfdaDrug"
          :showArray="tableHead"
          @changeTableHeader="list => changeTableHeader(this, list)"
          style="text-align:left;"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="CfdaDrug"
          api_name="cfdadrug"
          otherOut="2"
          :params="{ out_type: 'qiye' }"
          :max_num="res3.count"
          :defaultFiled="exportDefaultFiled"
          outdataAction="qy"
          style="text-align:left;"
        ></Export>
      </div>
      <el-table
        :data="res3.res"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        row-class-name="row-class-position"
        :cell-class-name="cellClass"
        :header-cell-class-name="headerClass"
        :row-key="getRowKeys"
        @sort-change="sortChange"
        :default-sort="order.qy ? defaultSort(order.qy) : {}"
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
            <div v-else-if="expands.tableType === 'other'">
              <el-table
                :data="props.row.second[scope].res"
                fixed
                ref="expandtable"
                style="width: 100%"
              >
                <el-table-column
                  v-for="(item, ix) in expandFiled"
                  :prop="item.prop"
                  :sortable="item.sort"
                  :key="ix"
                  :min-width="item.width || 100"
                  :label="item.label"
                >
                  <template slot-scope="scope">
                    <div :title="scope.row[item.prop]">
                      <a
                        v-if="item.prop === 'pizhunwenhao'"
                        target="_blank"
                        style="color:#4877e8;"
                        :href="
                          `/cfdadrug/${
                            scope.row.table_type === 2 ? 'jkdetail' : 'detail'
                          }/${scope.row.xuhao}?pizhunwenhao=${
                            scope.row.pizhunwenhao
                          }`
                        "
                      >
                        {{ scope.row[item.prop] }}
                      </a>
                      <span v-else>
                        {{ scope.row[item.prop] }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-if="props.row.second[scope].count > 20"
                @current-change="val => expandCurrentChange(val, props)"
                :current-page="props.row.second[scope].page"
                :page-size="20"
                layout="prev, next"
                :total="props.row.second[scope].count"
                :disabled="nopms.fy"
                :class="{ 'abandon-click-method': nopms.qy }"
              >
              </el-pagination>
            </div>
            <div v-else-if="expands.tableType === 'yp'">
              <el-table
                :data="expands.expandRes.res"
                :span-method="objectSpanMethod"
                fixed
                ref="expandtable"
                style="width: 100%"
              >
                <el-table-column
                  v-for="(item, ix) in expandFiledTwo"
                  :prop="item.prop"
                  :sortable="item.sort"
                  :key="ix"
                  :min-width="item.width || 100"
                  :label="item.label"
                >
                  <template slot-scope="scope">
                    <div :title="scope.row[item.prop]">
                      <a
                        v-if="item.prop === 'pizhunwenhao'"
                        target="_blank"
                        style="color:#4877e8;"
                        :href="
                          `/cfdadrug/${
                            scope.row.table_type === 2 ? 'jkdetail' : 'detail'
                          }/${scope.row.xuhao}?pizhunwenhao=${
                            scope.row.pizhunwenhao
                          }`
                        "
                      >
                        {{ scope.row[item.prop] }}
                      </a>
                      <span v-else>
                        {{ scope.row[item.prop] }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-if="props.row.second[scope].count > 20"
                @current-change="val => expandCurrentChange(val, props)"
                :current-page="props.row.second[scope].page"
                :page-size="20"
                layout="prev, next"
                :total="props.row.second[scope].count"
                :disabled="nopms.fy"
                :class="{ 'abandon-click-method': nopms.qy }"
              >
              </el-pagination>
            </div>
          </div>
        </el-table-column>
        <el-table-column
          v-for="item in tableHead"
          :prop="item.prop"
          :sortable="item.sort"
          :key="item.prop"
          :min-width="item.width || 100"
          :label="item.label"
        >
          <template :slot="item.tips ? 'header' : ''" slot-scope="scope">
            <span>
              {{ item.label }}
              <el-tooltip class="" effect="light" placement="right">
                <div slot="content">包含再注册时间</div>
                <i
                  class="el-icon-question cl-green"
                  style="margin-left:4px;"
                ></i>
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <div
              :title="
                item.prop === 'zdsbpz' || item.prop === 'zxzt'
                  ? ''
                  : scope.row[item.prop]
              "
            >
              <div v-if="item.prop === 'guifanqiye'">
                <!-- <router-link tag="a" :to="'/search?comprehensive=company&searchwords=' + scope.row.qiyemingcheng" target="_blank"> -->
                {{ scope.row.guifanqiye }}
                <!-- </router-link> -->
              </div>
              <!-- <div v-else-if="item.prop.indexOf('shijian')!==-1">
                <span>
                  {{ scope.row[item.prop] }}
                </span>
              </div> -->
              <div
                v-else
                :class="
                  Number(
                    (item.prop.indexOf('shijian') !== -1 &&
                      Number(scope.row[`${item.prop}_count`])) ||
                      (item.prop.indexOf('shijian') === -1 &&
                        scope.row[item.prop])
                  )
                    ? 'extensible-td'
                    : ''
                "
                @click="
                  getExpandRes(
                    scope.row.guifanqiye,
                    item.prop,
                    scope.row,
                    scope
                  )
                "
              >
                <span v-if="item.prop.indexOf('shijian') !== -1">
                  {{ scope.row[item.prop] }}
                  ({{ scope.row[`${item.prop}_count`] }})
                </span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative;">
        <el-pagination
          v-if="res3.count"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="res3.count"
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
import commonMixins from "@/mixins/common.js";
import tablehead from "@/config/tablehead";
import listCheck from "@/components/common/list-check";
import setTableHMixins from "@/mixins/setTableH.js";
const defaultFiled = tablehead.cfdadrug.chinatoqiye;
const expandFiled = tablehead.cfdadrug.qyExpand;
const expandFiledTwo = tablehead.cfdadrug.qyExpandTwo;
export default {
  components: {
    List,
    Export,
    listCheck,
    LoadingGif
  },
  mixins: [setTableHMixins, commonMixins],
  data() {
    return {
      scope: "",
      defaultFiled: defaultFiled,
      expandFiled: expandFiled,
      expandFiledTwo: expandFiledTwo,
      tableHead: [],
      getRowKeys(row) {
        return row.guifanqiye;
      },
      expandParams: {
        //存分组查询的条件 横坐标和纵坐标的prop值 以及page pageSize
        qiyemingcheng2_eq: "",
        piwenshijian_eq: "",
        groupname: "",
        pageSize: 20,
        page: 1
      },
      expands: {
        expandsrow: [], //存要展开的行
        element: null, //存分组点击的dom元素
        expanCell: "", //存当前展开项对应的cell 便于控制收起
        expandRes: {}, //展开项对应的资源
        erroCode: "200",
        tableType: "yp"
      },
      expandsLoading: true,
      checkallShow: [],
      show_table: true,
      helpDesc: {
        setList: "源于NMPA",
        pingzhongnum: "该企业已在中国申报的品种数"
      },
      //滚动条
      // offsetHeihgt:getWinHeight()-100,
      // ElTableData:null,
      changeStyle: "",
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 50 - 88
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      tableconf: state => state.CfdaDrug.tableconf,
      allBase: state => state.CfdaDrug.allBase,
      res3: state => (state.CfdaDrug.res3.res ? state.CfdaDrug.res3 : {}),
      errocode: state => state.CfdaDrug.error,
      listLoading: state => state.CfdaDrug.listLoading,
      putong: state => state.CfdaDrug.putong,
      gaoji: state => state.CfdaDrug.gaoji,
      shaixuan: state => state.CfdaDrug.shaixuan,
      param: state => state.CfdaDrug.qy_param, // 附加参数(存于vuex内)
      order: state => state.CfdaDrug.order,
      nopms: state => state.CfdaDrug.nopms
    }),
    exportDefaultFiled() {
      let arr = [];
      for (let item of defaultFiled) {
        //导出没做好暂时隐藏
        if (item.prop != "zdsbpz" && item.prop != "zxzt") {
          arr.push(item);
        }
      }
      return arr;
    }
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
    sortChange(column) {
      let prop = column.prop;
      let sort = "";
      // prop为null时，默认排序
      if (prop) {
        if (column.order == "ascending") {
          sort = prop + " " + "asc";
        } else if (column.order == "descending") {
          sort = prop + " " + "desc";
        }
      }
      this.param.order = sort;
      Store.commit(
        "CfdaDrug/order",
        Object.assign({}, this.$store.state.CfdaDrug.order, {
          qy: sort ? sort : null
        })
      );
      Store.dispatch("CfdaDrug/nomalSearch", { params: this.param });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let arr = this.expands.expandRes.res;
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          if (
            arr.length === 1 ||
            arr[rowIndex].name !== arr[rowIndex + 1].name
          ) {
            return [1, 1];
          } else {
            let rowspan = 1;
            for (let a = rowIndex + 1; a < arr.length; a++) {
              if (arr[rowIndex].name === arr[a].name) {
                rowspan += 1;
              } else {
                break;
              }
            }
            return [rowspan, 1];
          }
        } else if (rowIndex === arr.length - 1) {
          if (arr[rowIndex].name !== arr[rowIndex - 1].name) {
            return [1, 1];
          } else {
            return [0, 0];
          }
        } else {
          if (arr[rowIndex].name !== arr[rowIndex - 1].name) {
            if (arr[rowIndex].name === arr[rowIndex + 1].name) {
              let rowspan = 1;
              for (let a = rowIndex + 1; a < arr.length; a++) {
                if (arr[rowIndex].name === arr[a].name) {
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
    handleCurrentChange(val) {
      this.param.page = val;
      if (val * this.param.pageSize <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("CfdaDrug/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("CfdaDrug/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    //分组展示的page发生改变
    expandCurrentChange(val, props) {
      this.expandParams.page = val;
      this.handle_request(props);
    },
    sendGa() {
      window.ga("send", "event", "tab", "click", "cfdadrug_analy");
      window._paq.push(["trackEvent", "tab", "click", "cfdadrug_analy"]);

      this.$router.push("/cfdadrug/analy");
    },
    getExpandRes(guifanqiye, groupname, row, scope) {
      window.ga(
        "send",
        "event",
        "tab",
        "click",
        this.allBase.dbename + "_qiyegroup_" + groupname
      );
      window._paq.push([
        "trackEvent",
        "tab",
        "click",
        this.allBase.dbename + "_qiyegroup_" + groupname
      ]);

      let num =
        groupname.indexOf("shijian") !== -1
          ? Number(row[`${groupname}_count`])
          : Number(row[groupname]);
      if (num) {
        this.expands.tableType =
          groupname.indexOf("pinzhong") !== -1 ? "yp" : "other";
        this.expandParams.qiyemingcheng2_eq = guifanqiye;
        this.expandParams.groupname = groupname;
        this.expandParams.pageSize = 20;
        this.expandParams.page = 1;
        this.scope = scope.column.property;
        if (scope.row.second[this.scope]) {
          this.$set(
            scope.row.second,
            [this.scope],
            scope.row.second[this.scope]
          );
          this.expands.expandRes = scope.row.second[this.scope];
          return;
        }
        this.expandsLoading = true;
        this.expandParams.piwenshijian_eq =
          groupname.indexOf("shijian") !== -1 ? row[groupname] : "";
        this.handle_request(scope);
      }
    },
    handle_request(scope) {
      let params = this.expandParams;
      if (!params.piwenshijian_eq) delete params.piwenshijian_eq;
      Store.dispatch("CfdaDrug/getGroupRes", {
        path: "/api/cfdadrug/qiyeNameList",
        params
      })
        .then(res => {
          this.expandsLoading = false;
          if (res.data.code == 404) {
            this.expands.erroCode = "404";
            this.expands.expandRes = {
              res: [],
              page: 1,
              count: 0
            };
          } else if (res.data.code == 200) {
            this.expands.erroCode = "200";
            this.expands.expandRes = res.data.data;
            this.$set(scope.row.second, [this.scope], res.data.data);
            // scope.row.second[this.scope] = res.data.data
            // 处理二级列表出现后不能滚动的问题
            $(".el-table").addClass("el-table--scrollable-y");
          }
        })
        .catch(error => {
          this.expandsLoading = false;
          this.expands.erroCode = "500";
          this.expands.expandRes = {
            res: [],
            page: 1,
            count: 0
          };
        });
    },
    setActiveIndex(el) {
      let width = el.find("span").width() / 2 + 26;
      el.eq(0).css("background-position-x", `${width}px`);
    },
    toggleRowExpansion(row, column, cell, event) {
      if (event.target.localName === "td" || event.target.className === "cell")
        return;
      let num =
        column.property.indexOf("shijian") === -1
          ? Number(
              $(cell)
                .text()
                .trim()
            )
          : Number(row[`${column.property}_count`]);
      if (num) {
        let isOneRow = false;
        let column_index = $(cell).index();
        let row_index = $(cell)
          .parent()
          .index();
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
          this.expands.expandsrow.push(row.guifanqiye);
          this.expands.element.removeClass("active");
          src_el.addClass("active");
          this.expands.element = src_el;
        }
        this.$nextTick(() => {
          this.setActiveIndex(src_el);
        });
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
    ztIcon(val) {
      let classname = "";
      switch (val) {
        case "申请临床":
          classname = "sqlc";
          break;
        case "批准临床":
          classname = "pzlc";
          break;
        case "申请上市":
          classname = "sqss";
          break;
        case "批准上市":
          classname = "pzss";
          break;
      }
      return classname;
    }
  },
  created() {
    this.init();
  },
  // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
  activated() {
    this.registerEven();
  },
  watch: {
    res3: {
      handler() {
        this.$nextTick(() => {
          this.registerEven();
        });
        // 重置行点击
        this.expands = Object.assign(this.expands, {
          expandsrow: [],
          element: null,
          expanCell: "",
          expandRes: {},
          erroCode: "200"
        });
      },
      immediate: true
    },
    tableHead: {
      handler(val) {
        this.$nextTick(() => {
          this.registerEven();
        });
      },
      immediate: true
    },
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
    }
    // tableconf(n){
    //   //后台控制列表宽度
    //   this.expandFiled = this.tableheaderCombain(n,this.expandFiled);;
    // }
  }
};
</script>

<style lang="less" scoped>
.action-btn {
  text-decoration: none;
}
</style>
