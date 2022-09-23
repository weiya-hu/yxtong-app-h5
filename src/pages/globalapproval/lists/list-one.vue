<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <span class="action-btn"
          :class="{'abandon-click-method': nopms && nopms.visualization}"
          @click="sendGa">
          <span class="icon iconfont">&#xe643;</span>
          智能分析
        </span>
        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Globalapproval"
          :showArray="tableHead"
          @changeTableHeader="(list) => changeTableHeader(this, list)"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Globalapproval"
          api_name="globalapproval"
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
        @sort-change="sortChange"
        :default-sort="order.apply ? defaultSort(order.apply) : {}"
        v-if="show_table"
      >
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
              v-if="vueCheckListPms('Globalapproval', item.label)"
              :title="scope.row[item.prop]"
            >
              <!-- drugid字段需要配合source字段点击跳转到对应数据库的详情页 -->
              <template v-if="item.prop === 'drugid'">
                <div v-if="scope.row.link.id">
                  <span
                  class="drugid"
                  @click="goDetail(scope.row)"
                  >{{ scope.row[item.prop] || '—' }}</span
                  >
                </div>

                <span v-else>{{ scope.row[item.prop] || '—' }}</span>
              </template>

              <template v-else-if="item.prop === 'activeingredient'">
                 <router-link
                  :to="`/globalapproval/detail?activeingredient=${scope.row['activeingredient']}`"
                  tag="a"
                  target="_blank"
                  style="color: #4877e8"
                  >{{scope.row['activeingredient']}}</router-link>
              </template>

              <template v-else-if="item.prop === 'fensantu'">
                <span
                  v-if="nopms.cname"
                  :class="{ 'abandon-click-method': nopms.cname }"
                  >查看</span
                >
                <router-link
                  :to="`/globalapproval/scatter-graph?keyword=${scope.row['activeingredient']}`"
                  tag="a"
                  target="_blank"
                  style="color: #4877e8"
                  v-if="scope.row['activeingredient'] && !nopms.cname"
                  >查看</router-link
                >
              </template>

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
import TooltipBD from "@/components/common/globalCom/target-tooltip";
import List from "@/components/layouts/list";
import Export from "@/components/common/export";
import listCheck from "@/components/common/list-check";
import { mapState } from "vuex";
import commonMixins from "@/mixins/common.js";
import setTableHMixins from "@/mixins/setTableH.js";
export default {
  components: {
    TooltipBD,
    List,
    Export,
    listCheck,
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      vuex_name: "Globalapproval",
      activeTabName: "first",
      defaultFiled: [],
      exportDefaultFiled: [],
      tableHead: [],
      show_table: true,
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 50 - 88,
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      allBase: (state) => state.Globalapproval.allBase,
      tableconf: (state) => state.Globalapproval.tableconf,
      res1: (state) =>
        _.keys(state.Globalapproval.res1).length
          ? state.Globalapproval.res1.res
          : [],
      errorcode: (state) => state.Globalapproval.error,
      listLoading: (state) => state.Globalapproval.listLoading,
      putong: (state) => state.Globalapproval.putong,
      gaoji: (state) => state.Globalapproval.gaoji,
      shaixuan: (state) => state.Globalapproval.shaixuan,
      extendCount: (state) => state.Globalapproval.extendCount,
      param: (state) => state.Globalapproval.slh_param, // 附加参数(存于vuex内)
      nopms: (state) => state.Globalapproval.nopms,
      order: (state) => state.Globalapproval.order,
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
        this.$nextTick(() => {
          this.$forceUpdate();
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
    // drugid点击跳转到对应数据库详情页
    goDetail(row) {
      let urlObj = {
        path: "",
      };
      if (row.source === "中国") {
        // tip 1国产
        if (row.link.tp == 1) {
          urlObj.path = `/cfdadrug/detail/${row.link.id}`;
          urlObj.query = {
            pizhunwenhao: row.link.pizhunwenhao,
          };
        } else {
          urlObj.path = `/cfdadrug/jkdetail/${row.link.id}`;
          urlObj.query = {
            pizhunwenhao: row.link.pizhunwenhao,
          };
        }
      } else if (row.source === "美国") {
        urlObj.path = `/fdadrugnew/${row.link.id}`;
      } else if (row.source === "欧盟EMA") {
        urlObj.path = `/epyp/emadetail/${row.link.id}`;
      } else if (row.source === "欧盟HMA") {
        urlObj.path = `/epyp/hmadetail/${row.link.id}`;
      } else if (row.source === "日本") {
        urlObj.path = `/pmda/${row.link.id}`;
      } else if (row.source === "英国") {
        urlObj.path = `/uk/${row.link.id}`;
      } else if (row.source === "中国台湾") {
        urlObj.path = `/taiwan/${row.link.id}`;
      } else if (row.source === "德国") {
        urlObj.path = `/germany/${row.link.id}`;
      } else if (row.source === "加拿大") {
        urlObj.path = `/canada/${row.link.id}`;
      } else if (row.source === "法国") {
        urlObj.path = `/france/${row.link.id}`;
      } else if (row.source === "印度") {
        urlObj.path = `/india/${row.link.id}`;
      } else if (row.source === "韩国") {
        urlObj.path = `/korean/${row.link.id}`;
      }
      let routeData = this.$router.resolve(urlObj);
      window.open(routeData.href, "_blank");
      console.log(row);
    },
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
      if (this.nopms && !this.nopms.visualization) {
        window.ga("send", "event", "tab", "click", "globalapproval_analy");
        window._paq.push([
          "trackEvent",
          "tab",
          "click",
          "globalapproval_analy",
        ]);
        this.$router.push({ path: "/globalapproval/analy" });
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
        Store.dispatch("Globalapproval/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Globalapproval/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
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
.drugid {
  color: #4877e8;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
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
