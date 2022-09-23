<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <span class="action-btn" :class="{ 'abandon-click-method': nopms && nopms.ksh }" @click="sendGa">
          <span class="icon iconfont">&#xe643;</span>
          智能分析
        </span>
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled" vuex_name="Zhuce" :showArray="tableHead"
          @changeTableHeader="(list) => changeTableHeader(this, list)" />
        <!-- 导出 -->
        <Export :out_max="allBase.out_max" vuex_name="Zhuce" api_name="zhuce" :max_num="extendCount.BaseCount"
          :defaultFiled="exportDefaultFiled" outdataAction="base"></Export>
      </div>
      <!-- :height= "offsetHeihgt" -->
      <!-- :min-width="item.width"
          :width="item.okWidth || null" -->
      <el-table :data="res1" stripe fixed ref="ElTable" :height="tableHeight" row-class-name="row-class-position"
        :header-cell-class-name="headerClass" @sort-change="sortChange"
        :default-sort="order.base ? defaultSort(order.base) : {}" v-if="show_table">
        <el-table-column v-for="item in tableHead" :prop="item.prop" :min-width="item.field_width || 130"
          :key="item.prop" :sortable="item.sort" :fixed="item.is_fixed == '1'" :label="item.label">
          <!-- <template :slot="item.tips ? 'header':''" slot-scope="scope">
            <span>
              {{item.label}}
              <el-tooltip class="" effect="zhuce" placement="right">
                <div slot="content" v-if="item.prop == 'qiyemingcheng'">{{helpDesc.name}}</div>
                <div slot="content" v-else-if="item.prop == 'jielun'">{{helpDesc.jielun}}</div>
                <i class="el-icon-question cl-green" style="margin-left:4px;"></i>
              </el-tooltip>
            </span>
          </template> -->
          <template :slot="1 ? 'header' : ''" slot-scope="scope">
            <span>
              <NewProjectGuide postion="列表" :newPosition="{
                top: -5,
                right: getPositonRight(item.order, item.statement),
              }" :onlyKey="item['new_id']" display="inline" compoentsName="字段" :initItem="item"
                :showMenban="item['is_show_new']">{{ item.label }}</NewProjectGuide>
            </span>
            <el-tooltip v-if="item.statement" class="" effect="zhuce" placement="right">
              <div slot="content" v-html="item.statement"></div>
              <i class="el-icon-question cl-green" style="margin-left: 4px; line-height: 28px"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <div v-if="item.prop === 'shoulihao'">
                <!-- <span @click="handleRss(scope.row.rss.shoulihao===1,1,scope.row.shoulihao,scope.row.name,scope.row.qiyemingcheng)" class="row-absolute" :class="scope.row.rss.shoulihao===1?'row-absolute-ok':'row-absolute-no'">{{scope.row.rss.shoulihao===1?'已订':'订阅'}}</span> -->
                <span v-if="vueCheckListPms('Zhuce', item.label)" class="cell-shoulihao-wrap">
                  <router-link tag="a" :to="{ path: '/zhuce/' + scope.row.id }"
                    class="cell-shoulihao no-underline cl-blue" target="_blank">
                    {{ scope.row.shoulihao }}
                  </router-link>
                  <!-- <div class="ytz-icons">
                  <span class="yxsp-icon" v-if="scope.row.yxsp" title="优先审评">优</span>
                  <span class="zdzx-icon" v-if="scope.row.zdzx" title="重大专项">重</span>
                  <span class="tssp-icon" v-if="scope.row.tspz" title="特殊审批">特</span>
                  <span class="icon iconfont" v-if="scope.row.yzxpj == '是'" title="一致性评价" style="font-size: 15px; color: #f77d54;line-height:15px;">&#xe686;</span>
                </div> -->
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'name'">
                <div v-if="vueCheckListPms('Zhuce', item.label)">
                  <span class="link-underline" @click="resolveTdLink(item.prop, scope.row.name)">{{ scope.row.name
                  }}</span>
                  <!-- <div class="zhuce-yyfz" :title="scope.row.yuanyanhuofangzhi" v-if="scope.row.yuanyanhuofangzhi">
                  {{ scope.row.yuanyanhuofangzhi }}
                </div> -->
                </div>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'zhuceleixing'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">
                  {{
                      (scope.row.yaopinleixing_1
                        ? scope.row.yaopinleixing_1
                        : "") +
                      (scope.row.zhuceleixing ? scope.row.zhuceleixing : "")
                  }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'shenqingleixing_1'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.shenqingleixing_1
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'zhucebanben'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.zhucebanben
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'chengbanriqi'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.chengbanriqi
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'qiyemingcheng'">
                <span v-if="vueCheckListPms('Zhuce', item.label)" class="link-underline"
                  @click="resolveTdLink(item.prop, scope.row.qiyemingcheng)">{{ scope.row.qiyemingcheng }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'qiyelianheshenbao'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.qiyelianheshenbao
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'banlizhuangtai'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.banlizhuangtai
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'zhuangtaikaishishijian'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.zhuangtaikaishishijian
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'shenpingrenwufenlei'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.shenpingrenwufenlei
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'xuhao'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.xuhao
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'jielun'" style="width: 125px">
                <span v-if="vueCheckListPms('Zhuce', item.label)" :title="scope.row.jielun" :class="{
                  'bg-green-br':
                    scope.row.jielun &&
                    scope.row.jielun.indexOf('批准') === 0 &&
                    vueCheckListPms('Zhuce', item.label),
                  'bg-orange-br':
                    scope.row.jielun &&
                    scope.row.jielun.indexOf('批准') !== 0 &&
                    vueCheckListPms('Zhuce', item.label),
                }">{{ scope.row.jielun }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
                <!-- 判断类型是否为预测状态：0(预测)、1(预测结论)、2(预测对的结论)、3(有争议的) -->
                <em v-if="
                  scope.row.type == '1' &&
                  scope.row.jielun != '' &&
                  vueCheckListPms('Zhuce', item.label)
                " class="status-fore" title="预测结论">预</em>
              </div>
              <div v-else-if="item.prop === 'tspz'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.tspz == 1 ? "是" : "否"
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'zdzx'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.zdzx == 1 ? "是" : "否"
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'yxsp'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.yxsp == 1 || scope.row.yxsp == 4 ? "是" : "否"
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>

              <div v-else-if="item.prop === 'yxsply'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.yxsply
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>

              <div v-else-if="item.prop === 'gdcf'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.gdcf
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'wftjcbzj'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.wftjcbzj == "是" ? "是" : "否"
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>

              <div v-else-if="item.prop === 'tpxzl'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.tpxzl
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'zjxzsp'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.zjxzsp == 1 ? "是" : "否"
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'shengfen'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.shengfen
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'linchuangdate'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.linchuangdate
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'shenpingdate'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.shenpingdate
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'targets'" :title="''">
                <template v-if="vueCheckListPms('Zhuce', item.label)">
                  <TooltipBD :targets="scope.row.targets" :targets_abbr="scope.row.targets_abbr" />
                </template>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>

              <!-- 临床急需境外新药 -->
              <div v-else-if="item.prop === 'lcjxjwxy'">
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row.lcjxjwxy == 2 ? "是" : "否"
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>

              <!-- 审评报告 -->
              <div v-else-if="item.prop === 'report'">
                <template v-if="scope.row.report != ''">
                  <span class="linksBtn" v-if="vueCheckListPms('Zhuce', item.label)"
                    @click="redirectNewPage(scope.row.report)">查看</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </template>
                <span>&nbsp;</span>
              </div>
              <!-- 说明书 -->
              <div v-else-if="item.prop === 'instruct'">
                <template v-if="scope.row.instruct != ''">
                  <span class="linksBtn" v-if="vueCheckListPms('Zhuce', item.label)"
                    @click="redirectNewPage(scope.row.instruct)">查看</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </template>
                <span>&nbsp;</span>
              </div>

              <!-- 适应症品种 -->
              <div v-else-if="item.prop === 'indication2'" :title="''">
                <template v-if="scope.row.indication2 != ''">
                  <el-tooltip v-if="vueCheckListPms('Zhuce', item.label)" class="" effect="zhuce" placement="right">
                    <div slot="content" v-html="scope.row.indication2"></div>
                    <span v-html="scope.row.indication2"></span>
                  </el-tooltip>

                  <span v-else class="abandon-click-method">暂无权限</span>
                </template>
                <span>&nbsp;</span>
              </div>

              <!-- 适应症受理号 -->
              <div v-else-if="item.prop === 'indication1'" :title="''">
                <template v-if="scope.row.indication1 != ''">
                  <el-tooltip v-if="vueCheckListPms('Zhuce', item.label)" class="" effect="zhuce" placement="right">
                    <div slot="content" v-html="scope.row.indication1"></div>
                    <span v-html="scope.row.indication1"></span>
                  </el-tooltip>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </template>
                <span>&nbsp;</span>
              </div>

              <div v-else>
                <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                    scope.row[item.prop]
                }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination v-if="extendCount.BaseCount" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :current-page="param.page" :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize" layout="total, sizes, prev, pager, next" :total="extendCount.BaseCount"
          :disabled="nopms.fy" :class="{ 'abandon-click-method': nopms.fy }">
        </el-pagination>
        <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
      </div>
      <!-- <div class="pagination_empty">

      </div> -->
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
const defaultFiled = tablehead.zhuce.slh;
const defaultExport = tablehead.zhuce.slhExport;
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
      vuex_name: "Zhuce",
      activeTabName: "first",
      defaultFiled: [],
      exportDefaultFiled: [],
      tableHead: [],
      checkallShow: [],
      show_table: true,
      helpDesc: {
        name: "源于NMPA",
        jielun: "带“预”为药智预测结论，仅供参考",
      },
      changeStyle: "",
      tableHeight: document.documentElement.clientHeight - 48 - 40 - 40 - 62,
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      allBase: (state) => state.Zhuce.allBase,
      tableconf: (state) => state.Zhuce.tableconf,
      res1: (state) =>
        _.keys(state.Zhuce.res1).length ? state.Zhuce.res1.res : [],
      errorcode: (state) => state.Zhuce.error,
      listLoading: (state) => state.Zhuce.listLoading,
      putong: (state) => state.Zhuce.putong,
      gaoji: (state) => state.Zhuce.gaoji,
      shaixuan: (state) => state.Zhuce.shaixuan,
      extendCount: (state) => state.Zhuce.extendCount,
      param: (state) => state.Zhuce.slh_param, // 附加参数(存于vuex内)
      nopms: (state) => state.Zhuce.nopms,
      order: (state) => state.Zhuce.order,
    }),
  },
  mounted() { },
  // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
  activated() {
    let tempTableconf = _.cloneDeep(this.tableconf),
      actionName = `${this.vuex_name[0].toUpperCase() + this.vuex_name.substr(1)
        }/tableconf`; // 第一个字母转大写
    this.$store.commit(actionName, []);
    this.$store.commit(actionName, tempTableconf);
    this.registerEven();
  },
  watch: {
    res1: {
      handler(newVal) {
        // console.log(newVal);
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
        window.ga("send", "event", "tab", "click", "zhuce_analy");
        window._paq.push(["trackEvent", "tab", "click", "zhuce_analy"]);
        this.$router.push({ path: "/zhuce/analy" });
      }
    },

    //跳转审评报告或说明书页面
    redirectNewPage(pages) {
      window.open(pages, "_blank");
    },

    init() {
      this.tableHead = this.defaultFiled.reduce((res, item) => {
        if (item.checked) {
          res.push(item);
        }
        return res;
      }, []);
      console.log(this.tableHead);
    },
    handleCurrentChange(val) {
      this.param.page = val;
      if (val * this.param.pageSize <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Zhuce/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Zhuce/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleRss(rsss, type, shoulihao, name, qiyemingcheng) {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "vip_zhuce_shoulihao_dingyue"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "vip_zhuce_shoulihao_dingyue",
      ]);

      let dataObj = {
        shoulihao: shoulihao,
        name: name,
        qiyemingcheng: qiyemingcheng,
      };
      if (rsss) {
        //新页面打开
        let routeData = this.$router.resolve({
          path: "/usercenter/take/condition",
        });
        window.open(routeData.href, "_blank");
      } else {
        this.vueSetCookie("rss_type", type);
        this.vueSetCookie("rss_keyword", JSON.stringify(dataObj));
        let routeData = this.$router.resolve({
          path: "/usercenter/take/new",
        });
        window.open(routeData.href, "_blank");
      }
    },
    resolveTdLink(type_id, key_word) {
      let query = {};
      query[type_id] = key_word;
      let routeData = this.$router.resolve({
        path: `/zhuce`,
        query: query,
      });
      window.open(routeData.href, "_blank");
      // window.open(`/zhuce?${type_id}=${key_word}`, "_blank");
    },
    headerClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "padLHeader";
      }
    },
  },
  created() {
    // this.init();
  },
  updated() {
    this.vueTogglePmsTooltip();
  },
};
</script>
<style lang="less">
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";
// .el-table{
//   height: calc(100vh - 48px - 40px - 40px - 62px)!important;
// }

.row-class-position {
  position: relative;
  padding-left: 24px;

  .row-absolute {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 30px;
    writing-mode: vertical-lr;
    line-height: 30px;
    text-align: center;
    letter-spacing: 1px;
    display: none;
    color: #fff;
    overflow: hidden;
    cursor: pointer;
  }

  .row-absolute-ok {
    background: #4877e8;
  }

  .row-absolute-no {
    background: #f56c6c;
  }

  &:hover {
    .row-absolute {
      display: block;
    }
  }
}

.el-table {
  .cell {
    overflow: visible;
    // padding-left: 20px;
  }

  // .padLHeader {
  //   padding-left: 24px;
  // }
}

.cell-shoulihao-wrap {
  position: relative;

  .cell-shoulihao {
    float: left;
    line-height: 15px;
  }
}

.bg-green-br {
  // display: inline-block;
  text-align: center;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 10px;
  background-color: @Green;
  color: #fff;
  max-width: 80px;
  overflow: hidden;
}

.status-fore {
  background: #4877e8;
  color: #fff;
  font-size: 12px;
  text-align: center;
  display: inline-block;
  border-radius: 25px;
  font-style: normal;
  width: 22px;
}

.bg-orange-br {
  // display: inline-block;
  text-align: center;
  font-size: 12px;
  padding: 4px 10px;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  background-color: @Orange;
  color: #fff;
  max-width: 80px;
  overflow: hidden;
}

.la-slh {}

.ytz-icons {
  display: inline-block;

  span {
    overflow: hidden;
    display: inline-block;
    font-size: 12px;
    // margin: 0px 0px 0px 6px;
    line-height: 12px;
    text-align: center;
    color: #fff;
    border-radius: 11px;
  }
}

.yxsp-icon {
  background: @McTypeGreen;
  width: 12px;
  height: 12px;
  padding: 4px;
}

.zdzx-icon {
  background: @PrimaryColor;
  width: 12px;
  height: 12px;
  padding: 4px;
}

.tssp-icon {
  background: @McTypeOrange;
  width: 12px;
  height: 12px;
  padding: 4px;
}

// .yzxpj-icon {
//   font-size: 14px;
//   color: #d81e06;
// }
// el-dialog遮罩层样式（背景色）
.v-modal {
  background: rgba(102, 102, 102, 0.4);
}

.linksBtn {
  color: #4877e8;
  cursor: pointer;
}

.zhuce-name {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // line-height: 15px;
}

.zhuce-yyfz {
  display: inline-block;
  padding: 0px 8px;
  box-sizing: border-box;
  font-size: 12px;
  line-height: 12px;
  color: #f77d54;
  border: 1px solid #f77d54;
  border-radius: 10px;
}
</style>
