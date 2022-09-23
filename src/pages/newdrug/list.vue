<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions" :style="posi">
        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Newdrug"
          :showArray="tableHead"
          @changeTableHeader="list => changeTableHeader(this, list)"
          style="text-align:left;"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Newdrug"
          api_name="newdrug"
          :max_num="extendCount.BaseCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"
          style="text-align:left;"
        ></Export>
      </div>
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
              <el-tooltip class="" effect="light" placement="right">
                <div slot="content">鼠标上移至靶点名称处可查看简称和全称</div>
                <i
                  class="el-icon-question cl-green"
                  style="margin-left:4px;"
                ></i>
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <div
                v-if="item.prop === 'name'"
                :title="scope.row.name + scope.row.englishname"
              >
                <span v-if="vueCheckListPms('Newdrug', item.label)">
                  <div class="dis">
                      <router-link
                      tag="a"
                      :title="scope.row.name"
                      :to="{ path: '/newdrug/' + scope.row.id }"
                      class="no-underline cl-blue"
                      target="_blank"
                      >
                        {{ scope.row.name }}
                    </router-link>
                  </div>

                  <div class="dis">
                    <router-link
                    tag="a"
                    :title="scope.row.englishname"
                    :to="{ path: '/newdrug/' + scope.row.id }"
                    class="no-underline cl-blue"
                    target="_blank"
                    >
                      {{ scope.row.englishname }}
                    </router-link>
                  </div>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'originatorcompany_02'">
                <span v-if="vueCheckListPms('Newdrug', item.label)">{{
                  scope.row.originatorcompany_02
                    ? scope.row.originatorcompany_02
                    : "/"
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'othercompany'">
                <span v-if="vueCheckListPms('Newdrug', item.label)">{{
                  scope.row.othercompany ? scope.row.othercompany : "/"
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'activeindications'">
                <span v-if="vueCheckListPms('Newdrug', item.label)">{{
                  scope.row.activeindications
                    ? scope.row.activeindications
                    : "/"
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'targets_abbr'" :title="''">
                <div v-if="vueCheckListPms('Newdrug', item.label)">
                  <TooltipBD
                    v-if="scope.row.target || scope.row.targets_abbr"
                    :targets="scope.row.target"
                    :targets_abbr="scope.row.targets_abbr"
                  />
                  <span v-else>/</span>
                </div>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'higheststatus'">
                <span v-if="vueCheckListPms('Newdrug', item.label)">{{
                  scope.row.higheststatus ? scope.row.higheststatus : "/"
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'count_zgsblc'">
                <span v-if="vueCheckListPms('Newdrug', item.label)">
                  <router-link
                    v-if="Number(scope.row.count_zgsblc)"
                    tag="a"
                    :to="{
                      path:
                        '/zhuce?filter_condition=' +
                        JSON.stringify({ linchuang: ['L'] }) +
                        '&ylbm_eq=' +
                        scope.row.ylbm
                    }"
                    target="_blank"
                    class="under_a"
                  >
                    {{ scope.row.count_zgsblc }}
                  </router-link>
                  <span v-else>0</span>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'count_zgpzblc'">
                <span v-if="vueCheckListPms('Newdrug', item.label)">
                  <router-link
                    v-if="Number(scope.row.count_zgpzblc)"
                    tag="a"
                    :to="{
                      path:
                        '/zhuce?filter_condition=' +
                        JSON.stringify({ xulie: ['3'] }) +
                        '&ylbm_eq=' +
                        scope.row.ylbm
                    }"
                    target="_blank"
                    class="under_a"
                  >
                    {{ scope.row.count_zgpzblc }}
                  </router-link>
                  <span v-else>0</span>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'count_zglcsy'">
                <span v-if="vueCheckListPms('Newdrug', item.label)">
                  <a
                    v-if="Number(scope.row.count_zglcsy)"
                    href="javascript: void(0)"
                    class="under_a"
                    @click.prevent="
                      vueExtendTo('/linchuangshiyan?ylbm_eq=' + scope.row.ylbm)
                    "
                    >{{ scope.row.count_zglcsy }}</a
                  >
                  <span v-else>0</span>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'count_zgsqss'">
                <span v-if="vueCheckListPms('Newdrug', item.label)">
                  <router-link
                    v-if="Number(scope.row.count_zgsqss)"
                    tag="a"
                    :to="{
                      path:
                        '/zhuce?filter_condition=' +
                        JSON.stringify({ linchuang: ['S'] }) +
                        '&ylbm_eq=' +
                        scope.row.ylbm
                    }"
                    target="_blank"
                    class="under_a"
                  >
                    {{ scope.row.count_zgsqss }}
                  </router-link>
                  <span v-else>0</span>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'count_zgsspz'">
                <span v-if="vueCheckListPms('Newdrug', item.label)">
                  <a
                    v-if="Number(scope.row.count_zgsspz)"
                    href="javascript: void(0)"
                    class="under_a"
                    @click.prevent="
                      vueExtendTo('/cfdadrug?ylbm_eq=' + scope.row.ylbm)
                    "
                    >{{ scope.row.count_zgsspz }}</a
                  >
                  <span v-else>0</span>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'fistapproval'">
                <span v-if="vueCheckListPms('Newdrug', item.label)">
                  <span v-if="scope.row.fistapproval_CH"
                    >中国:{{ scope.row.fistapproval_CH }}</span
                  >
                  <span v-if="scope.row.fistapproval_USA"
                    >美国:{{ scope.row.fistapproval_USA }}</span
                  >
                  <span v-if="scope.row.fistapproval_JP"
                    >日本:{{ scope.row.fistapproval_JP }}</span
                  >
                  <span v-if="scope.row.fistapproval_EU"
                    >欧盟:{{ scope.row.fistapproval_EU }}</span
                  >
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
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
import TooltipBD from "@/components/common/globalCom/target-tooltip";
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
const defaultFiled = tablehead.newdrug.xy;
const defaultExport = tablehead.newdrug.xy;
export default {
  components: {
    TooltipBD,
    List,
    Export,
    listCheck
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      activeTabName: "first",
      vuex_name: "Newdrug",
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
      allBase: state => state.Newdrug.allBase,
      tableconf: state => state.Newdrug.tableconf,
      res1: state =>
        _.keys(state.Newdrug.res1).length ? state.Newdrug.res1.res : [],
      errorcode: state => state.Newdrug.error,
      listLoading: state => state.Newdrug.listLoading,
      putong: state => state.Newdrug.putong,
      gaoji: state => state.Newdrug.gaoji,
      shaixuan: state => state.Newdrug.shaixuan,
      extendCount: state => state.Newdrug.extendCount,
      param: state => state.Newdrug.slh_param, // 附加参数(存于vuex内)
      nopms: state => state.Newdrug.nopms,
      order: state => state.Newdrug.order
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
        Store.dispatch("Newdrug/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Newdrug/nomalSearch", { params: this.param });
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
