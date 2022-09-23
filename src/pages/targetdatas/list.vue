<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions" :style="posi">
        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Targetdatas"
          :showArray="tableHead"
          @changeTableHeader="list => changeTableHeader(this, list)"
          style="text-align:left;"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Targetdatas"
          api_name="targetdatas"
          :max_num="extendCount.BaseCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"
          style="text-align:left;"
        ></Export>
      </div>
      <!-- :height="offsetHeihgt" -->
      <!-- :min-width="item.width"
          :width="item.okWidth || null" -->
      <el-table
        :data="res1"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
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
          <template :slot="item.tips ? 'header' : ''" slot-scope="scope">
            <span>
              {{ item.label }}
            </span>
          </template>
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <div v-if="item.prop === 'target'">
                <span
                  v-if="vueCheckListPms('Targetdatas', item.label)"
                  class="cell-shoulihao-wrap"
                >
                  <router-link
                    tag="a"
                    :to="{ path: '/targetdatas/' + scope.row.id }"
                    class="no-underline cl-blue"
                    target="_blank"
                  >
                    {{ scope.row.target }}
                  </router-link>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'genename'">
                <span v-if="vueCheckListPms('Targetdatas', item.label)">{{
                  scope.row.genename
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'kind'">
                <span v-if="vueCheckListPms('Targetdatas', item.label)">{{
                  scope.row.kind
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'higheststatus'">
                <span v-if="vueCheckListPms('Targetdatas', item.label)">{{
                  scope.row.higheststatus
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'count_xgyw'">
                <span v-if="vueCheckListPms('Targetdatas', item.label)">
                  <router-link
                    v-if="Number(scope.row.count_xgyw)"
                    tag="a"
                    :to="{
                      path: `/report?fourth_condition=bdbm=${scope.row.bdbm}`
                    }"
                    target="_blank"
                    class="under_a"
                  >
                    {{ scope.row.count_xgyw }}
                  </router-link>
                  <span v-else>0</span>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'count_sbzs'">
                <span v-if="vueCheckListPms('Targetdatas', item.label)">
                  <router-link
                    v-if="Number(scope.row.count_sbzs)"
                    tag="a"
                    :to="{
                      path: `/zhuce?fourth_condition=bdbm=${scope.row.bdbm}`
                    }"
                    target="_blank"
                    class="under_a"
                  >
                    {{ scope.row.count_sbzs }}
                  </router-link>
                  <span v-else>0</span>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <!-- <div v-if="item.prop === 'count_sblc'">
              <span v-if="vueCheckListPms('Targetdatas', item.label)">
                <router-link v-if="Number(scope.row.count_sblc)" tag="a"
                :to="{path:'/zhuce?filter_condition=' + JSON.stringify({linchuang: ['L']}) + '&targets_eq=' + scope.row.target}"
                target="_blank" class="under_a">
                  {{ scope.row.count_sblc }}
                </router-link>
                <span v-else>0</span>
              </span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div> -->
              <!-- <div v-if="item.prop === 'count_pzlc'">
              <span v-if="vueCheckListPms('Targetdatas', item.label)">
                <router-link v-if="Number(scope.row.count_pzlc)" tag="a" :to="{path:'/zhuce?filter_condition=' + JSON.stringify({xulie: ['3']}) + '&targets_eq=' + scope.row.target}" target="_blank" class="under_a">
                  {{ scope.row.count_pzlc }}
                </router-link>
                <span v-else>0</span>
              </span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div> -->
              <!-- 中国临床 -->
              <div v-if="item.prop === 'count_lcsy'">
                <span v-if="vueCheckListPms('Targetdatas', item.label)">
                  <router-link
                    v-if="Number(scope.row.count_lcsy)"
                    tag="a"
                    :to="{
                      path: `/linchuangshiyan?fourth_condition=bdbm=${scope.row.bdbm}`
                    }"
                    target="_blank"
                    class="under_a"
                  >
                    {{ scope.row.count_lcsy }}
                  </router-link>
                  <span v-else>0</span>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>

              <!-- 中国上市 -->
              <!-- <div v-if="item.prop === 'count_zgss'">
                <span v-if="vueCheckListPms('Targetdatas', item.label)">
                  <router-link
                    v-if="Number(scope.row.count_zgss)"
                    tag="a"
                    :to="{
                      path: `/cfdadrug?fourth_condition=bdbm=${scope.row.bdbm}`
                    }"
                    target="_blank"
                    class="under_a"
                  >
                    {{ scope.row.count_zgss }}
                  </router-link>
                  <span v-else>0</span>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div> -->

              <!-- 全球临床 -->
              <div v-if="item.prop === 'count_qqlc'">
                <span v-if="vueCheckListPms('Targetdatas', item.label)">
                  <router-link
                    v-if="Number(scope.row.count_qqlc)"
                    tag="a"
                    :to="{
                      path: `/clinical?fourth_condition=bdbm=${scope.row.bdbm}`
                    }"
                    target="_blank"
                    class="under_a"
                  >
                    {{ scope.row.count_qqlc }}
                  </router-link>
                  <span v-else>0</span>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <!-- <div v-if="item.prop === 'count_sqss'">
              <span v-if="vueCheckListPms('Targetdatas', item.label)">
                <router-link v-if="Number(scope.row.count_sqss)" tag="a" :to="{path:'/zhuce?filter_condition=' + JSON.stringify({linchuang: ['S']}) + '&targets_eq=' + scope.row.target}" target="_blank" class="under_a">
                  {{ scope.row.count_sqss }}
                </router-link>
                <span v-else>0</span>
              </span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div> -->
              <!-- <div v-if="item.prop === 'count_sspz'">
              <span v-if="vueCheckListPms('Targetdatas', item.label)">
                <router-link v-if="Number(scope.row.count_sspz)" tag="a" :to="{path:'/zhuce?filter_condition=' + JSON.stringify({xulie: ['4','7','9']}) + '&targets_eq=' + scope.row.target}" target="_blank" class="under_a">
                  {{ scope.row.count_sspz }}
                </router-link>
                <span v-else>0</span>
              </span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative;">
        <el-pagination
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
import List from "@/components/layouts/list";
import Export from "@/components/common/export";
import listCheck from "@/components/common/list-check";
import { mapState } from "vuex";
import tablehead from "@/config/tablehead";
import commonMixins from "@/mixins/common.js";
import setTableHMixins from "@/mixins/setTableH.js";

function getWinHeight() {
  return window.innerHeight;
}
const defaultFiled = tablehead.targetdatas.bd;
const defaultExport = tablehead.targetdatas.bd;
export default {
  components: {
    List,
    Export,
    listCheck
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      activeTabName: "first",
      vuex_name: "Targetdatas",
      defaultFiled: defaultFiled,
      exportDefaultFiled: defaultExport,
      tableHead: [],
      checkallShow: [],
      show_table: true,
      helpDesc: {
        setList: "源于NMPA"
      },
      changeStyle: "",
      tableHeight: document.documentElement.clientHeight - 48 - 60 - 35 - 88,
      posi: "position:static;text-align:right;padding:0 10px;"
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      allBase: state => state.Targetdatas.allBase,
      tableconf: state => state.Targetdatas.tableconf,
      res1: state =>
        _.keys(state.Targetdatas.res1).length ? state.Targetdatas.res1.res : [],
      errorcode: state => state.Targetdatas.error,
      listLoading: state => state.Targetdatas.listLoading,
      putong: state => state.Targetdatas.putong,
      gaoji: state => state.Targetdatas.gaoji,
      shaixuan: state => state.Targetdatas.shaixuan,
      extendCount: state => state.Targetdatas.extendCount,
      param: state => state.Targetdatas.slh_param, // 附加参数(存于vuex内)
      nopms: state => state.Targetdatas.nopms,
      order: state => state.Targetdatas.order
    })
  },
  mounted() {},
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
      //后台控制列表宽度
      this.defaultFiled = this.tableheaderCombain(n, this.defaultFiled);
    }
  },
  methods: {
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
        Store.dispatch("Targetdatas/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Targetdatas/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    }
  },
  created() {
    this.init();
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  updated() {
    this.vueTogglePmsTooltip();
  }
};
</script>
<style lang="less">
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";

.el-table {
  .cell {
    overflow: visible;
    // padding-left: 30px;
  }
}

.extensible-td {
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: @PrimaryColor;
    font-weight: 600;
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
.under_a {
  text-decoration: underline;
  &:hover {
    color: @PrimaryColor;
    font-weight: 600;
  }
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
