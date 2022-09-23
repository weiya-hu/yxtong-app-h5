<template>
  <div class="la-list zdyScrool_Bar">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <span
          class="action-btn"
          :class="{ 'abandon-click-method': nopms.ksh }"
          @click="sendGa"
        >
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
          :max_num="extendCount.shoulihao_count"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"
          style="text-align:left;"
        ></Export>
      </div>
      <div class="item_content1">
        <el-table
          :data="res1"
          ref="ElTable"
          :height="tableHeight"
          stripe
          fixed
          @sort-change="sortChange"
          :default-sort="order.base ? defaultSort(order.base) : {}"
          class="table"
          style="width: 100%"
          v-if="show_table"
        >
          <el-table-column
            v-for="item in tableHead"
            :prop="item.prop"
            :min-width="item.field_width || item.width || 100"
            :key="item.prop"
            :sortable="item.sort"
            :label="item.label"
            :fixed="item.is_fixed == '1'"
          >
            <!-- <template :slot="item.tips ?'header':''">
              <span>
                {{item.label}}
                <el-tooltip  effect="zhuce" placement="right">
                  <div slot="content" v-html="headDesc[item.prop]"></div>
                  <i class="el-icon-question cl-green" style="margin-left:4px;"></i>
                </el-tooltip>
              </span>
            </template> -->
            <template :slot="1 ? 'header' : ''" slot-scope="scope">
              <span>
                <NewProjectGuide
                  postion="列表"
                  :newPosition="{
                    top: -5,
                    right: getPositonRight(item.order, item.statement)
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
                  style="margin-left:4px;"
                ></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div :title="scope.row[item.prop]">
                <div v-if="item.prop === 'pizhunwenhao'">
                  <span v-if="vueCheckListPms('CfdaDrug', item.label)">
                    <router-link
                      v-if="scope.row.country == 1"
                      tag="a"
                      :to="{
                        path: '/cfdadrug/detail/' + scope.row.xuhao,
                        query: { pizhunwenhao: scope.row.pizhunwenhao }
                      }"
                      target="_blank"
                      style="color:#4877e8;"
                      >{{ scope.row.pizhunwenhao }}</router-link
                    >
                    <router-link
                      v-if="scope.row.country == 2"
                      tag="a"
                      :to="{
                        path: '/cfdadrug/jkdetail/' + scope.row.xuhao,
                        query: { pizhunwenhao: scope.row.pizhunwenhao }
                      }"
                      target="_blank"
                      style="color:#4877e8;"
                      >{{ scope.row.pizhunwenhao }}</router-link
                    >
                    <span
                      class="cfdrug-icon tg-te"
                      v-if="scope.row.country == '1'"
                      title="国产"
                      >{{ scope.row.title.country }}</span
                    >
                    <span
                      class="cfdrug-icon tg-te"
                      v-if="scope.row.country == '2'"
                      title="进口"
                      >{{ scope.row.title.country }}</span
                    >
                    <span
                      class="cfdrug-icon tg-te"
                      v-if="scope.row.title.country == '仅进口'"
                      title="仅进口"
                      >{{ scope.row.title.country }}</span
                    >

                    <span
                      class="cfdrug-icon tg-zhong"
                      v-if="scope.row.yuanyan == '1'"
                      title="原研"
                      >原研</span
                    >
                    <!-- <div style="width:100%;"> -->
                    <!-- <span
                      class="cfdrug-icon tg-te"
                      v-if="scope.row.country=='1'"
                      title="国产"
                    >{{scope.row.title.country}}</span>
                    <span
                      class="cfdrug-icon tg-te"
                      v-if="scope.row.country=='2'"
                      title="进口"
                    >{{scope.row.title.country}}</span>
                    <span
                      class="cfdrug-icon tg-te"
                      v-if="scope.row.title.country=='仅进口'"
                      title="仅进口"
                    >{{scope.row.title.country}}</span> -->
                    <!-- <div
                      class="cfdrug-icon tg-zhong"
                      v-if="scope.row.title.yblb=='甲类'"
                      title="医保甲类"
                    >{{scope.row.title.yblb}}</div>
                    <div
                      class="cfdrug-icon tg-zhong"
                      v-if="scope.row.title.yblb=='乙类'"
                      title="医保乙类"
                    >{{scope.row.title.yblb}}</div>
                    <div
                      class="cfdrug-icon tg-zhong"
                      v-if="scope.row.title.yblb=='非医保'"
                      title="非医保"
                    >{{scope.row.title.yblb}}</div>
                    <div
                      class="cfdrug-icon tg-zhong"
                      v-if="scope.row.title.yblb=='民族药'"
                      title="民族医保"
                    >{{scope.row.title.yblb}}</div>
                    <div
                      class="cfdrug-icon tg-you"
                      v-if="scope.row.title.jiyao=='基药'"
                      title="基药"
                    >{{scope.row.title.jiyao}}</div> -->
                    <!-- </div> -->
                  </span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-else-if="item.prop === 'targets'" :title="''">
                  <template v-if="vueCheckListPms('CfdaDrug', item.label)">
                    <TooltipBD
                      v-if="scope.row.targets || scope.row.targets_abbr"
                      :targets="scope.row.targets"
                      :targets_abbr="scope.row.targets_abbr"
                    />
                    <span v-else>/</span>
                  </template>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-else-if="item.prop === 'wftjcbzj'">
                  <span v-if="vueCheckListPms('CfdaDrug', item.label)">{{
                    scope.row.wftjcbzj == 1 ? "√" : "×"
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-else-if="item.prop === 'dailiangcaigou1'">
                  <span v-if="vueCheckListPms('CfdaDrug', item.label)">
                    <router-link
                      target="_blank"
                      v-if="scope.row.dailiangcaigou1 === '已中选'"
                      class="under_a"
                      :to="{
                        path: '/dailiangcaigou',
                        query: {
                          fourth_condition: `bianma=${scope.row.bianma} _and qiyebianmatz=${scope.row.qiyebianmatz} _and guifanguige=${scope.row.guifanguige}`
                        }
                      }"
                      >{{ scope.row.dailiangcaigou1 || "/" }}</router-link
                    >
                    <span v-else>{{ scope.row.dailiangcaigou1 || "/" }}</span>
                  </span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
                <div v-else-if="item.prop === 'atc'">
                  <span v-if="vueCheckListPms('CfdaDrug', item.label)">{{
                    scope.row.atc || "/"
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                 <!-- 适应症受理号 -->
                <div v-else-if="item.prop === 'shiyingzheng'" :title="''">
                  <template v-if="scope.row.shiyingzheng != ''">
                    <el-tooltip v-if="vueCheckListPms('CfdaDrug', item.label)" class="" effect="zhuce" placement="right">
                      <div slot="content" v-html="scope.row.shiyingzheng"></div>
                      <span v-html="scope.row.shiyingzheng"></span>
                    </el-tooltip>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </template>
                  <span v-else>/</span>
                </div>
                <!-- 通过一致性评价厂家数 -->
                <!-- <div v-else-if="item.prop === 'changjiashugp'">
                  <span v-if="vueCheckListPms('CfdaDrug', item.label)">{{
                   scope.row.changjiashugp
                  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div> -->

                <div v-else>
                  <span v-if="vueCheckListPms('CfdaDrug', item.label)">{{ scope.row[item.prop] || "/"  }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="positon: relative;">
          <el-pagination
            v-if="extendCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="param.page"
            :page-sizes="[20, 30, 50]"
            :page-size="param.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="extendCount.shoulihao_count"
            :disabled="nopms.fy"
            :class="{ 'abandon-click-method': nopms.fy }"
          ></el-pagination>
          <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
        </div>
      </div>
    </List>
  </div>
</template>

<script>
import TooltipBD from "@/components/common/globalCom/target-tooltip";
import List from "@/components/layouts/list";
import Export from "@/components/common/export";
import { mapState } from "vuex";
import commonMixins from "@/mixins/common.js";
import tablehead from "@/config/tablehead";
import listCheck from "@/components/common/list-check";
import setTableHMixins from "@/mixins/setTableH.js";
export default {
  components: {
    TooltipBD,
    List,
    Export,
    listCheck
  },
  mixins: [setTableHMixins, commonMixins],
  data() {
    return {
      headDesc: {
        tpz:
          "同品种数：同品种厂家数（国产+进口）<br/>同品规数：同品种同规格厂家数（国产+进口）",
        gdcf:
          "根据中国药学会发布的过度重复药品提示性公告标记分类。过度重复：同一药品已获批准文号企业数在20家以上；获批企业数≤3家：指在该药品大类是过度重复品种，但药品当前剂型已有批准文号企业数≤3家。",
        wftjcbzj: "根据《临床价值明确，无法推荐参比制剂的化学药品目录》分类。",
        name:
          "原研/仿制（药智）的分类主要是根据药品注册分类和新闻等信息综合判断。",
        atc: "此列为ATC第三级分类，详细分类可至详情页查看"
      },
      defaultFiled: [],
      filedVisible: false,
      tableHead: [],
      checkallShow: [],
      vuex_name: "CfdaDrug",
      show_table: true,
      changeStyle: "",
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 50 - 88
    };
  },
  computed: {
    ...mapState({
      tableconf: state => state.CfdaDrug.tableconf,
      nopms: state => state.CfdaDrug.nopms,
      allBase: state => state.CfdaDrug.allBase,
      extendCount: state => state.CfdaDrug.extendCount,
      putong: state => state.CfdaDrug.putong,
      gaoji: state => state.CfdaDrug.gaoji,
      shaixuan: state => state.CfdaDrug.shaixuan,
      param: state => state.CfdaDrug.param,
      order: state => state.CfdaDrug.order,
      listLoading: state => state.CfdaDrug.listLoading,
      res1: state =>
        _.keys(state.CfdaDrug.res1.res).length ? state.CfdaDrug.res1.res : []
    }),
    exportDefaultFiled() {
      let arr = [];
      for (let item of this.defaultFiled) {
        arr.push(item);
      }
      return arr;
    }
  },
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
          this.registerEven();
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
    tableconf(n) {
      n.forEach(item => {
        item.checked = item.hidden === undefined;
        item.prop = item.field;
      });
      //后台控制列表宽度
      this.defaultFiled = this.tableheaderCombain(n, n);
      this.init();
    }
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
    init() {
      this.tableHead = this.defaultFiled.reduce((res, item) => {
        if (item.checked) {
          res.push(item);
        }
        return res;
      }, []);
    },
    sendGa() {
      if (!this.nopms.ksh) {
        window.ga("send", "event", "tab", "click", "cfdadrug_analy");
        window._paq.push(["trackEvent", "tab", "click", "cfdadrug_analy"]);
        this.$router.push("/cfdadrug/analy");
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
    }
  },
  created() {
    // this.init();
  },
  mounted() {},
  updated() {
    this.vueTogglePmsTooltip();
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.la-list {
  .item_top {
    height: 190px;
    padding: 28px 20px 21px 35px;
    display: flex;
    .content_one {
      margin: 0px 5px;
      flex-grow: 1;
      background-color: #f5f8fb;
      padding-right: 30px;
      float: left;
      .content_title {
        padding-top: 15px;
        .content_shenbao {
          width: 140px;
          height: 40px;
          margin: 0 auto;
          line-height: 40px;
          .shenbao_left {
            width: 30px;
            height: 1px;
            background: #4a77e8;
            margin-top: 17px;
            float: left;
          }
          .shenbao_word {
            margin: 0 10px;
            float: left;
            font-size: 14px;
            color: #4a77e8;
          }
        }
      }
      .contents {
        width: 100%;
        padding-left: 34px;
        display: flex;
        .content_total {
          flex-grow: 1;
          width: 52px;
          height: 94px;
          text-align: center;
          float: left;
          margin-right: 36px;
          .total_item1 {
            padding-top: 10px;
            font-size: 12px;
          }
          .total_item2 {
            padding-top: 14px;
            span {
              font-size: 20px;
              color: #4a77e8;
            }
          }
        }
      }
    }
    .content_two {
      margin-left: 12px;
      background-color: #f5f8fb;
      float: left;
      .content_title {
        padding-top: 15px;
        .content_shenbao {
          width: 140px;
          height: 40px;
          margin: 0 auto;
          line-height: 40px;
          .shenbao_left {
            width: 30px;
            height: 1px;
            background: #4a77e8;
            margin-top: 17px;
            float: left;
          }
          .shenbao_word {
            margin: 0 10px;
            float: left;
            font-size: 14px;
            color: #4a77e8;
          }
        }
      }
      .contents {
        background: #5f88eb;
        padding-left: 34px;
        .content_total {
          width: 52px;
          height: 94px;
          text-align: center;
          float: left;
          margin-right: 40px;
          .total_item1 {
            padding-top: 10px;
            font-size: 12px;
          }
          .total_item2 {
            padding-top: 14px;
            span {
              font-size: 20px;
              color: #4a77e8;
            }
          }
        }
      }
    }
    .content_three {
      margin-left: 12px;
      background-color: #f5f8fb;
      float: left;
      .content_title {
        padding-top: 15px;
        .content_shenbao {
          width: 140px;
          height: 40px;
          margin: 0 auto;
          line-height: 40px;
          .shenbao_left {
            width: 30px;
            height: 1px;
            background: #4a77e8;
            margin-top: 17px;
            float: left;
          }
          .shenbao_word {
            margin: 0 10px;
            float: left;
            font-size: 14px;
            color: #4a77e8;
          }
        }
      }
      .contents {
        background: #5f88eb;
        padding-left: 34px;
        .content_total {
          width: 52px;
          height: 94px;
          text-align: center;
          float: left;
          margin-right: 42px;
          .total_item1 {
            padding-top: 10px;
            font-size: 12px;
          }
          .total_item2 {
            padding-top: 14px;
            span {
              font-size: 20px;
              color: #4a77e8;
            }
          }
        }
      }
    }
  }
  .item_content {
    height: 408px;
    padding-left: 34px;
    .chart_box {
      background-color: white;
      float: left;
      .echarts {
        width: 760px;
        height: 400px;
      }
    }
  }
  .item_content1 {
    height: auto;
    background-color: white;
    .el-table {
      .el-table__header-wrapper {
        padding-left: 34px;
        background-color: #eaeef9;
        .el-table__header {
          .has-gutter {
            .el-table_3_column_15 {
              width: 169px !important;
            }
          }
        }
      }
      .el-table__body-wrapper,
      .el-table__fixed-body-wrapper {
        .el-table__body {
          .el-table__row td {
            padding-left: 34px;
            .cfdrug-icon {
              background-color: @Green;
              color: #fff;
              border-radius: 6px;
              padding: 0px 10px;
              display: inline-block;
              font-size: 12px;
              // height: 20px;
              line-height: 14px;
            }
            .tg-you {
              background: @Green;
            }
            .tg-te {
              background: @Blue;
            }
            .tg-zhong {
              background: @Orange;
            }

            .cfdrug-name {
              display: block;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .cfdrug-yyfz {
              display: inline-block;
              padding: 0px 8px;
              box-sizing: border-box;
              font-size: 12px;
              line-height: 12px;
              color: #f77d54;
              border: 1px solid #f77d54;
              border-radius: 6px;
            }
          }
        }
      }
    }
  }
  .actions {
    position: absolute;
    right: 10px;
  }
}
.item_content1 {
  .label {
    text-align: center;
    line-height: 30px;
    margin-left: 30px;
  }
}
.action-btn {
  text-decoration: none;
}
.tpz-pop {
  width: 300px;
}
.under_a {
  text-decoration: underline;
  &:hover {
    color: @PrimaryColor;
    font-weight: 600;
  }
}
</style>
