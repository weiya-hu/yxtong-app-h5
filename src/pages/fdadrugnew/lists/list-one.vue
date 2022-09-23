<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <span
          class="action-btn"
          :class="{ 'abandon-click-method': nopms && nopms.ksh }"
          @click="sendGa"
        >
          <span class="icon iconfont">&#xe643;</span>
          智能分析
        </span>
        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Fdadrugnew"
          :showArray="tableHead"
          @changeTableHeader="(list) => changeTableHeader(this, list)"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Fdadrugnew"
          api_name="fdadrugnew"
          :max_num="extendCount.BaseCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="apply"
        ></Export>
      </div>
      <el-table
        :data="res1"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        :row-key="getRowKeys"
        :expand-row-keys="expands.expandsrow"
        @cell-click="toggleRowExpansion"
        @sort-change="sortChange"
        :default-sort="order.apply ? defaultSort(order.apply) : {}"
        v-if="show_table"
      >
        <el-table-column type="expand" width="1">
          <div type="expand" slot-scope="props" class="table-expand">
            <!-- 自定义加载界面 -->
            <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="expandsLoading" v-if="expandsLoading"></LoadingGif>
            <!-- 加载完成显示部分 -->
            <div v-else>
              <el-table
                :data="props.row.second[scope].res"
                fixed
                ref="expandtable"
                style="width: 100%">
                <el-table-column
                  v-for="(item, ix) in expandFiled"
                  :prop="item.prop"
                  :sortable="item.sort"
                  :key="ix"
                  :min-width="item.width || 100"
                  :label="item.label">
                  <template slot-scope="scope">
                    <div :title="scope.row[item.prop]">
                      {{ scope.row[item.prop] }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-if="props.row.second[scope].count > 20"
                @current-change="(val)=>expandCurrentChange(val,props)"
                :current-page="props.row.second[scope].page"
                :page-size="20"
                layout="prev, next"
                :total="props.row.second[scope].count"
                :disabled="nopms.fy"
                :class="{'abandon-click-method': nopms.fy}">
              </el-pagination>
            </div>
          </div>
        </el-table-column>
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
            <div
              v-if="vueCheckListPms('Fdadrugnew', item.label)"
              :title="scope.row[item.prop]"
            >
              <template v-if="item.prop === 'applno'">
                <router-link
                  v-if="scope.row.appltype === '生物药（CBER）'"
                  tag="a"
                  :to="{ path: '/fdadrugnew/' + scope.row.applno + '/cber' }"
                  target="_blank"
                  style="color: #4877e8"
                  >{{ scope.row.applno }}</router-link
                >
                <router-link
                  v-else
                  tag="a"
                  :to="{ path: '/fdadrugnew/' + scope.row.applno }"
                  target="_blank"
                  style="color: #4877e8"
                  >{{ scope.row.applno }}</router-link
                >
                <span
                  class="id-green bg-blue"
                  :title="scope.row['firstgeneric']"
                  v-if="scope.row['firstgeneric']"
                  >{{ "仿" }}</span
                >
                <span
                  class="id-green bg-orange"
                  :title="scope.row['chengpishu']"
                  v-if="scope.row['chengpishu']"
                  >{{ "橙" }}</span
                >
                <span
                  class="id-green bg-green"
                  :title="scope.row['submissionpropertytypecode']"
                  v-if="scope.row['submissionpropertytypecode']"
                  >{{ "孤" }}</span
                >
                <!-- <div>
                      <span class="id-green bg-blue" :title="scope.row['firstgeneric']" v-if="scope.row['firstgeneric']">{{'仿'}}</span>
                      <span class="id-green bg-orange" :title="scope.row['chengpishu']" v-if="scope.row['chengpishu']">{{'橙'}}</span>
                      <span class="id-green bg-green" :title="scope.row['submissionpropertytypecode']" v-if="scope.row['submissionpropertytypecode']">{{'孤'}}</span>
                    </div> -->
              </template>
              <!-- <div v-else-if="item.prop === 'activeingredient'" :title="scope.row.activeingredient + scope.row.cname">
                  <span class="dis">{{ scope.row.activeingredient }}</span>
                  <span class="dis">{{ scope.row.cname }}</span>
                </div> -->
              <!-- <div v-else-if="item.prop === 'sponsorname'" :title="scope.row.sponsorname + scope.row.chinesecompany">
                  <span class="dis">{{ scope.row.sponsorname }}</span>
                  <span class="dis">{{ scope.row.chinesecompany }}</span>
                </div> -->
              <div
                v-else-if="item.prop === 'drugname'"
                :title="scope.row.drugname"
              >
                <span>{{ scope.row.drugname }}</span>
                <!-- <span class="id-green bg-blue" v-if="scope.row['essentialmedicine_tag']">{{scope.row['essentialmedicine_tag']}}</span>
                  <span class="id-green bg-orange" v-if="scope.row['firstinclass']">{{scope.row['firstinclass']}}</span>
                  <span class="id-green bg-green" v-if="scope.row['firstapproved']">{{scope.row['firstapproved']}}</span> -->
              </div>
              <div v-else-if="item.prop === 'targets'" :title="''">
                <TooltipBD
                  :targets="scope.row.targets"
                  :targets_abbr="scope.row.targets_abbr"
                />
              </div>
              <div
                v-else-if="item.prop === 'sepc_num'"
                :title="scope.row.sepc_num"
                class="extensible-td"
                @click="getExpandRes(
                      item.prop,
                      scope.row.sepc_num,
                      scope)"
              >
                <span class="num-text">{{ scope.row.sepc_num }}</span>
              </div>
              <template v-else
                ><span>{{ scope.row[item.prop] }}</span></template
              >
            </div>
            <span v-else class="abandon-click-method">暂无权限</span>
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
import LoadingGif from '@/components/common/globalCom/loading-gif'
import TooltipBD from "@/components/common/globalCom/target-tooltip";
import List from "@/components/layouts/list";
import Export from "@/components/common/export";
import listCheck from "@/components/common/list-check";
import { mapState } from "vuex";
import tablehead from "@/config/tablehead";
import commonMixins from "@/mixins/common.js";
import setTableHMixins from "@/mixins/setTableH.js";
const expandFiled = tablehead.fdadrugnew.sqhExpand;
export default {
  components: {
    TooltipBD,
    List,
    Export,
    listCheck,
    LoadingGif
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      vuex_name: "Fdadrugnew",
      activeTabName: "first",
      defaultFiled: [],
      expandFiled: expandFiled,
      exportDefaultFiled: [],
      tableHead: [],
      getRowKeys(row) {
        return row.applno;
      },
      show_table: true,
      expandParams: {
        //存分组查询的条件 横坐标和纵坐标的prop值 以及page pageSize
        applno: "",
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
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 50 - 88,
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      allBase: (state) => state.Fdadrugnew.allBase,
      tableconf: (state) => state.Fdadrugnew.tableconf,
      res1: (state) =>
        state.Fdadrugnew.res1.length ? state.Fdadrugnew.res1 : [],
      errorcode: (state) => state.Fdadrugnew.error,
      listLoading: (state) => state.Fdadrugnew.listLoading,
      putong: (state) => state.Fdadrugnew.putong,
      gaoji: (state) => state.Fdadrugnew.gaoji,
      shaixuan: (state) => state.Fdadrugnew.shaixuan,
      extendCount: (state) => state.Fdadrugnew.extendCount,
      param: (state) => state.Fdadrugnew.slh_param, // 附加参数(存于vuex内)
      nopms: (state) => state.Fdadrugnew.nopms,
      order: (state) => state.Fdadrugnew.order,
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
      if (this.nopms && !this.nopms.ksh) {
        window.ga("send", "event", "tab", "click", "fdadrugnew_analy");
        window._paq.push(["trackEvent", "tab", "click", "fdadrugnew_analy"]);
        this.$router.push({ path: "/fdadrugnew/analy" });
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
        Store.dispatch("Fdadrugnew/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Fdadrugnew/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    //分组展示的page发生改变
    expandCurrentChange(val, props) {
      this.expandParams.page = val
      this.handleRequest(props)
    },
    handleRequest(props, order) {
      Store.dispatch("Fdadrugnew/getGroupRes", {
        path: "/api/fdadrugnew/specInfo",
        params: this.expandParams,
      })
        .then((res) => {
          this.expandsLoading = false;
          if (res.data.code == 404) {
            this.expands.erroCode = "404";
          } else {
            if (res.data.code == 200) {
              this.expands.erroCode = "200";
              this.expands.expandRes = res.data.data;
              res.data.data.order = order; // 保存排序
              console.log(props);
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

    // 获取展开列表的数据
    getExpandRes(groupname,num,scope) {
      console.log(groupname,num,scope);
      window.ga(
        "send",
        "event",
        "tab",
        "click",
        this.allBase.dbename + "_nameGroup_" + groupname
      );
      window._paq.push([
        "trackEvent",
        "tab",
        "click",
        this.allBase.dbename + "_nameGroup_" + groupname,
      ]);

      if (Number(num) && groupname=='sepc_num') {
        this.expandParams.applno = scope.row.applno;
        this.expandParams.groupname = groupname
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
        this.handleRequest(scope);
      }
    },
    toggleRowExpansion(row, column, cell, event) {
      console.log(row, column, cell, event);
      if (event.target.localName === "td" || event.target.className === "cell")
        return;
      let num = Number($(cell).find('.num-text').text().trim())
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
          this.expands.expandsrow.push(row.applno);
          this.expands.element.removeClass("active");
          src_el.addClass("active");
          this.expands.element = src_el;
        }
      }
    },
  },
  updated() {
    this.vueTogglePmsTooltip();
  },
};
</script>
<style lang="less">
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";
.extensible-td {
  cursor: pointer;
  text-decoration: underline;
}
.id-green {
  display: inline-block;
  padding: 0 10px;
  border-radius: 10px;
  // height: 20px;
  line-height: 14px;
  background: @Green;
  color: #fff;
  white-space: nowrap;
  font-size: 12px;
}
.bg-blue {
  background: @Blue;
}
.bg-orange {
  background: @Orange;
}
.bg-green {
  background: @Green;
}
.el-table {
  .cell {
    overflow: visible;
    // padding-left: 30px;
  }
}

.cell-shoulihao-wrap {
  position: relative;
  .cell-shoulihao {
    float: left;
  }
}
.bg-green-br {
  // display: inline-block;
  text-align: center;
  font-size: 12px;
  padding: 0px 10px;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  background-color: @Green;
  color: #fff;
  max-width: 80px;
  overflow: hidden;
}
.bg-orange-br {
  // display: inline-block;
  text-align: center;
  font-size: 12px;
  padding: 0px 10px;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  background-color: @Orange;
  color: #fff;
  max-width: 80px;
  overflow: hidden;
}

.la-slh {
}
.ytz-icons {
  display: inline-block;
  & > span {
    overflow: hidden;
    display: inline-block;
    float: left;
    font-size: 12px;
    padding: 4px;
    // margin: 0px 0px 0px 6px;
    width: 14px;
    height: 14px;
    line-height: 14px;
    text-align: center;
    color: #fff;
    border-radius: 11px;
  }
}
.yxsp-icon {
  background: @McTypeGreen;
}
.zdzx-icon {
  background: @PrimaryColor;
}
.tssp-icon {
  background: @McTypeOrange;
}
// el-dialog遮罩层样式（背景色）
.v-modal {
  background: rgba(102, 102, 102, 0.4);
}
</style>
