<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="getNoData()">
      <div class="item_content1">
        <div class="zw"></div>
        <div class="card-hand">
          <div class="box">
            <div class="item" :class="{ on: isTableCard }" @click="onTableView">
              <i class="iconfont">&#xe654;</i>
              <span class="txt">表格视图</span>
            </div>
            <div class="item" :class="{ on: !isTableCard }" @click="onCard">
              <i class="iconfont">&#xe9ff;</i>
              <span class="txt">卡片式</span>
            </div>
          </div>
        </div>
        <div>
          <el-table
            ref="ElTable"
            v-show="isTableCard"
            :data="res1"
            :height="tableHeight"
            @sort-change="sortChange"
            :default-sort="order.base ? defaultSort(order.base) : {}"
            stripe
            style="width: 100%"
          >
            <el-table-column
              v-for="item in defaultFiled"
              :prop="item.prop"
              :min-width="item.field_width || item.width || 100"
              :key="item.prop"
              :sortable="item.order === '1' ? 'custom' : false"
              :label="item.label"
              :fixed="item.is_fixed == '1'"
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
                <div :title="scope.row[item.prop]">
                  <div v-if="item.prop == 'name'">
                    <div class="table-name">
                      <a
                        v-if="scope.row.xiangqing == 1"
                        class="cl-blue"
                        @click="
                          handleCardClick(scope.row.id, scope.row.xiangqing)
                        "
                        >{{ scope.row.name
                        }}{{
                          scope.row.shangpinname
                            ? `(${scope.row.shangpinname})`
                            : ""
                        }}</a
                      >
                      <a
                        v-if="scope.row.xiangqing == 2"
                        class="cl-blue"
                        href="javascript:void;"
                        @click="
                          handleCardClick(scope.row.id, scope.row.xiangqing)
                        "
                        >{{ scope.row.name
                        }}{{
                          scope.row.shangpinname
                            ? `(${scope.row.shangpinname})`
                            : ""
                        }}</a
                      >
                      <a
                        v-if="scope.row.xiangqing == 3"
                        class="cl-blue"
                        href="javascript:void;"
                        @click="
                          handleCardClick(scope.row.id, scope.row.xiangqing)
                        "
                        >{{ scope.row.name
                        }}{{
                          scope.row.shangpinname
                            ? `(${scope.row.shangpinname})`
                            : ""
                        }}</a
                      >
                      <span v-if="scope.row.xiangqing == 0"
                        >{{ scope.row.name
                        }}{{
                          scope.row.shangpinname
                            ? `(${scope.row.shangpinname})`
                            : ""
                        }}</span
                      >
                      <span
                        class="instruct-icon icon-green"
                        v-if="scope.row.xiangqing == 2"
                        title="图片"
                        >图</span
                      >
                      <span
                        class="instruct-icon icon-yellow"
                        v-else-if="scope.row.xiangqing == 1"
                        title="文本"
                        >文</span
                      >
                      <span
                        class="instruct-icon icon-orange"
                        v-if="scope.row.yuanyan == 1"
                        title="原研"
                        >原研</span
                      >
                      <span
                        class="instruct-icon icon-blue"
                        v-if="scope.row.yzxpj == '是'"
                        title="一致性评价"
                        >一致性评价</span
                      >
                      <!-- <span v-else>{{ scope.row.name }}</span> -->
                    </div>
                  </div>
                  <!-- <div v-else-if="item.prop=='guige'">
                    <span v-html="scope.row.guige"></span>
                  </div> -->
                  <div
                    v-else-if="item.prop == 'zuixinxiugairi'"
                    :title="getAllXiugairi(scope.row.xiugairi)"
                  >
                    {{
                      scope.row.zuixinxiugairi ? scope.row.zuixinxiugairi : "/"
                    }}
                  </div>

                  <!-- 规格 -->
                  <div v-else-if="item.prop == 'guige'">
                    <span :title="ToText(scope.row.guige)">{{
                      ToText(scope.row.guige)
                    }}</span>
                  </div>

                  <!-- 放开后显示包装图片 -->
                  <div v-else-if="item.prop == 'urls'">
                    <imgShow
                      :url="scope.row.urls ? scope.row.urls : scope.row.url"
                    ></imgShow>
                  </div>

                  <div v-else>
                    <span v-if="vueCheckListPms('ShuomingshuZg', item.label)">{{
                      scope.row[item.prop]
                    }}</span>
                    <span v-else class="abandon-click-method">暂无权限</span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div
            class="page-cards"
            :style="{ height: tableHeight + 'px' }"
            v-show="!isTableCard"
          >
            <div
              class="card"
              :class="{
                'card-no-detail': item.xiangqing != 0 && item.xiangqing != 3,
              }"
              v-for="(item, index) in res2"
              :key="index"
            >
              <a
                @click.stop="handleCardClick(item.id, item.xiangqing)"
                class="card-top"
              >
                <div class="guding-tip">CHINA</div>
                <div class="download" v-if="item.down">
                  <div @click.stop="handleDown(item.down)" class="fujian">
                    <i class="iconfont download-icon">&#xe62c;</i>
                  </div>
                  <!-- <div class="fujian-cl"></div> -->
                </div>
                <div class="drug-name" :title="'药品名称：' + item.name">
                  {{ item.name }}
                </div>
                <div
                  class="drug-guige"
                  :title="'药品规格：' + ToText(item.guige)"
                >
                  {{ ToText(item.guige) }}
                </div>
                <div class="drug-source" :title="'说明来源：' + item.guifanqiye">
                  {{ item.guifanqiye }}
                </div>
                <div class="drug-yibao">
                  <span
                    class="instruct-icon icon-orange"
                    v-if="item.yuanyan == 1"
                    :title="'原研'"
                    >原研</span
                  >
                  <span
                    class="instruct-icon"
                    v-if="item.yzxpj == '是'"
                    title="一致性评价"
                    >一致性评价</span
                  >
                </div>
                <div class="drug-date-wrapper">
                  <div
                    v-if="item.hezhunri"
                    class="text-overflow"
                    :title="`核准日期：${item.hezhunri}`"
                  >
                    核准日期：{{ item.hezhunri }}
                  </div>
                  <div
                    v-if="item.zuixinxiugairi"
                    class="text-overflow"
                    :title="`修订日期：${getAllXiugairi(item.xiugairi)}`"
                  >
                    修订日期：{{ item.zuixinxiugairi }}
                  </div>
                </div>
              </a>
              <div class="card-middle">
                <span class="ttip">相关说明书</span>
                <el-tooltip
                  class="item"
                  effect="light"
                  content="与该药品原料相同的其他药品说明书"
                  placement="right"
                >
                  <i class="iconfont cl-green">&#xe628;</i>
                </el-tooltip>
              </div>
              <div class="card-bottom">
                <a
                  class="bottom-item"
                  @click.prevent="clickToSearch(item.ylbm, item.china)"
                >
                  <div class="item-num">{{ item.china }}</div>
                  <div class="item-name">中国药品</div>
                </a>
                <a
                  class="bottom-item"
                  @click.prevent="
                    pushRoute(
                      'fdalabel',
                      'database_fdalabel',
                      'ShuomingshuMg',
                      item.ylbm,
                      item.usa
                    )
                  "
                >
                  <div class="item-num">{{ item.usa }}</div>
                  <div class="item-name">美国药品</div>
                </a>
                <a
                  class="bottom-item"
                  @click.prevent="
                    pushRoute(
                      'jp_shuomingshu',
                      'database_jp_shuomingshu',
                      'ShuomingshuRb',
                      item.ylbm,
                      item.japan
                    )
                  "
                >
                  <div class="item-num">{{ item.japan }}</div>
                  <div class="item-name">日本药品</div>
                </a>
                <a
                  class="bottom-item"
                  @click.prevent="
                    pushRoute(
                      'unlabeleduse',
                      'database_unlabeleduse',
                      'ShuomingshuCsm',
                      item.ylbm,
                      item.super
                    )
                  "
                >
                  <div class="item-num">{{ item.super }}</div>
                  <div class="item-name">超说明药品</div>
                </a>
              </div>
            </div>
            <!-- 清除浮动 -->
            <div class="clear"></div>
          </div>
          <div style="positon: relative" v-if="activeTabName == 'table'">
            <el-pagination
              v-if="extendCount"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="param.page"
              :page-sizes="[20, 30, 50]"
              layout="total, sizes, prev, pager, next"
              :page-size="param.pageSize"
              :total="extendCount"
              :disabled="nopms.fy"
              :class="{ 'abandon-click-method': nopms.fy }"
            ></el-pagination>
            <span class="out-of-page cl-red"
              >限于内容篇幅，部分结果未予显示</span
            >
          </div>

          <div style="positon: relative" v-if="activeTabName == 'card'">
            <el-pagination
              v-if="cardExtendCount"
              @size-change="handleSizeChangeCard"
              @current-change="handleCurrentChangeCard"
              :current-page="cardParam.page"
              :page-sizes="[20, 30, 50]"
              layout="total, sizes, prev, pager, next"
              :page-size="cardParam.pageSize"
              :total="cardExtendCount"
              :disabled="nopms.fy"
              :class="{ 'abandon-click-method': nopms.fy }"
            ></el-pagination>
            <span class="out-of-page cl-red"
              >限于内容篇幅，部分结果未予显示</span
            >
          </div>
        </div>
      </div>
    </List>
  </div>
</template>

<script>
import List from "@/components/layouts/list";
import imgShow from "@/components/common/imgShow";
import { mapState } from "vuex";
import setTableHMixins from "@/mixins/setTableH.js";
import commonMixins from "@/mixins/common.js";
export default {
  components: {
    List,
    imgShow,
  },
  mixins: [setTableHMixins, commonMixins],
  data() {
    return {
      isTableCard: true,
      sort: "",
      changeStyle: "",
      vuex_name: "ShuomingshuZg",
      defaultFiled: [],
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 45 - 88,
    };
  },
  computed: {
    ...mapState({
      activeTabName: (state) => state.ShuomingshuZg.tabname,
      tableconf: (state) => state.ShuomingshuZg.tableconf,
      nopms: (state) => state.ShuomingshuZg.nopms,
      extendCount: (state) => state.ShuomingshuZg.extendCount,
      cardExtendCount: (state) => state.ShuomingshuZg.cardExtendCount,
      putong: (state) => state.ShuomingshuZg.putong,
      gaoji: (state) => state.ShuomingshuZg.gaoji,
      param: (state) => state.ShuomingshuZg.param,
      cardParam: (state) => state.ShuomingshuZg.cardParam,
      order: (state) => state.ShuomingshuZg.order,
      listLoading: (state) => state.ShuomingshuZg.listLoading,
      res1: (state) =>
        _.keys(state.ShuomingshuZg.res1).length ? state.ShuomingshuZg.res1 : [],
      res2: (state) =>
        _.keys(state.ShuomingshuZg.res2).length ? state.ShuomingshuZg.res2 : [],
    }),
  },
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
      immediate: true,
    },
    res2: {
      handler() {
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
      this.init();
    },
  },
  methods: {
    getNoData() {
      if (this.activeTabName == "table") {
        return this.res1 && !this.res1.length;
      } else {
        return this.res2 && !this.res2.length;
      }
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

    init() {
      this.tableHead = this.defaultFiled.reduce((res, item) => {
        if (item.checked) {
          res.push(item);
        }
        return res;
      }, []);
    },

    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("ShuomingshuZg/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChangeCard(val) {
      this.cardParam.page = 1;
      this.cardParam.pageSize = val;
      if (val * this.cardParam.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("ShuomingshuZg/nomalSearch", { params: this.cardParam });
      } else {
        $(".out-of-page").show();
      }
    },
    getAllXiugairi(arr) {
      let str = "";
      arr.forEach((element, index) => {
        str += element;
        if (index !== arr.length - 1) {
          str += ",";
        }
      });
      return str;
    },
    handleCardClick(id, type) {
      let href;
      if (type == 1) {
        href = "/instruct/" + id;
      } else if (type == 2) {
        href = "/instruct/graphics/" + id;
      } else if (type == 3) {
        href = "/instruct/revise/" + id;
      } else {
        return;
      }
      window.open(href, "_blank");
    },
    handleDown(href) {
      window.open(href, "_blank");
    },
    handleCurrentChange(val) {
      this.param.page = val;
      if (val * this.param.pageSize <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("ShuomingshuZg/nomalSearch", {
          params: Object.assign(
            {},
            this.param,
            this.sort ? { order: this.sort } : {}
          ),
        });
      } else {
        $(".out-of-page").show();
      }
    },
    handleCurrentChangeCard(val) {
      this.cardParam.page = val;
      if (val * this.cardParam.pageSize <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("ShuomingshuZg/nomalSearch", {
          params: Object.assign({}, this.cardParam),
        });
      } else {
        $(".out-of-page").show();
      }
    },
    // 链接到数据库
    pushRoute(href, route_name, vuex_name, option, num) {
      if (num && option) {
        this.$router.push({
          path: href,
          name: route_name,
        });
        Store.commit(vuex_name + "/fourth_checked", [
          {
            logic: "_and",
            name: "ylbm_eq",
            value: option,
          },
        ]);
        if (Store.state[vuex_name].query) {
          Store.state[vuex_name].query = [];
        }
        if (Store.state[vuex_name].putong) {
          Store.state[vuex_name].putong = {};
        }
        if (Store.state[vuex_name].conditions) {
          Store.state[vuex_name].conditions = [];
        }
        if (Store.state[vuex_name].gaoji) {
          Store.state[vuex_name].gaoji = {};
        }
        if (Store.state[vuex_name].groups) {
          Store.state[vuex_name].groups = {};
        }
        if (Store.state[vuex_name].shaixuan) {
          Store.state[vuex_name].shaixuan = {};
        }
        Store.dispatch(vuex_name + "/nomalSearch");
      }
    },
    // 如果点击后不用跳转，只需要在本页搜索，则用此方法
    clickToSearch(option, num) {
      let _that = this;
      if (num && option) {
        Store.commit("ShuomingshuZg/fourth_checked", [
          {
            logic: "_and",
            name: "ylbm_eq",
            value: option,
          },
        ]);
        if (Store.state.ShuomingshuZg.query) {
          Store.state.ShuomingshuZg.query = [];
        }
        if (Store.state.ShuomingshuZg.putong) {
          Store.state.ShuomingshuZg.putong = {};
        }
        if (Store.state.ShuomingshuZg.conditions) {
          Store.state.ShuomingshuZg.conditions = [];
        }
        if (Store.state.ShuomingshuZg.gaoji) {
          Store.state.ShuomingshuZg.gaoji = {};
        }
        if (Store.state.ShuomingshuZg.groups) {
          Store.state.ShuomingshuZg.groups = {};
        }
        if (Store.state.ShuomingshuZg.shaixuan) {
          Store.state.ShuomingshuZg.shaixuan = {};
        }
        /*_that.$emit("clearLeft")*/
        Store.commit("ShuomingshuZg/queryStr", Store.state.ShuomingshuZg.query);
        Store.dispatch("ShuomingshuZg/nomalSearch");
      }
    },
    // 表格视图
    onTableView(event) {
      this.isTableCard = true;
      Store.commit("ShuomingshuZg/tabname", "table");

      if (this.activeTabName === "table" && !_.keys(this.res1).length) {
        Store.dispatch("ShuomingshuZg/nomalSearch", {
          queryToPutong: false,
        });
      }
    },
    // 卡片式
    onCard() {
      this.isTableCard = false;
      Store.commit("ShuomingshuZg/tabname", "card");
      if (this.activeTabName === "card" && !_.keys(this.res2).length) {
        Store.dispatch("ShuomingshuZg/nomalSearch", {
          queryToPutong: false,
        });
      }
    },
    // 谷歌统计、mamoto统计
    shoumingshuStatistics() {
      window.ga("send", "event", "button", "click", "vip_instruct_other");
      window._paq.push([
        "trackEvent",
        "button",
        "cilick",
        "vip_instruct_other",
      ]);
    },
  },
  created() {},
  mounted() {},
  updated() {
    if (this.param.pageSize * this.param.page <= 1500) {
      $(".out-of-page").hide();
    } else {
      $(".out-of-page").show();
    }
    this.vueTogglePmsTooltip();
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
// @import "~@/assets/less/app.less";
.clear {
  clear: both;
}
.la-list {
  padding-top: 0px;

  .card-hand {
    padding-right: 10px;
    padding-top: 0;
    i {
      font-size: 14px;
    }

    .txt {
      font-size: 13px;
    }
  }

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

      .instruct-icon {
        background-color: #5898ff;
        color: #fff;
        border-radius: 10px;
        padding: 0px 10px;
        display: inline-block;
        font-size: 12px;
        // height: 20px;
        line-height: 14px;
      }
      .icon-yellow {
        background-color: rgba(245, 166, 35);
      }

      .icon-orange {
        background-color: #f77d54;
      }
      .icon-blue {
        background-color: #5898ff;
      }
      .icon-green {
        background-color: @Green;
      }
    }
  }
}
.item_content1 {
  .label {
    text-align: center;
    line-height: 30px;
    margin-left: 30px;
  }
  .page-cards {
    box-sizing: border-box;
    width: 100%;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .card {
      float: left;
      cursor: pointer;
      transition: all 300ms;
      width: 290px;
      height: 380px;
      box-shadow: @BoxShadow;
      background-color: #fff;
      overflow: hidden;
      margin: 0px 8px 28px;
      text-decoration: none;
      &.card-no-detail {
        &:hover {
          cursor: default !important;
          transition: all 300ms;
          box-shadow: @BoxShadow!important;
        }
        .card-top {
          cursor: default;
          div {
            cursor: default;
          }
          .download {
            position: absolute;
            top: 0;
            right: 0px;
          }
        }
      }
      &:hover {
        transition: all 300ms;
        box-shadow: @BoxShadowHover;
        .card-top {
          .drug-name {
            color: @PrimaryColor;
          }
          .drug-source {
            color: @PrimaryColor;
          }

          .drug-guige {
            color: @PrimaryColor;
          }
        }
        .card-bottom {
          .bottom-item {
            cursor: pointer;
            transition: all 300ms;
            background-color: @PrimaryColor;
            color: #fff;
            .item-num {
              transition: all 300ms;
              color: #fff;
            }
          }
        }
      }
      .card-top {
        box-sizing: border-box;
        margin: 14px 12px;
        margin-bottom: 8px;
        width: calc(100% - 24px);
        height: 228px;
        position: relative;
        overflow: hidden;
        text-decoration: none;
        float: left;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        align-items: center;
        .guding-tip {
          position: absolute;
          width: 80px;
          height: 20px;
          line-height: 20px;
          background-color: @Green;
          color: #fff;
          font-size: 12px;
          text-align: center;
          border-radius: 10px;
          top: 3px;
          left: 0px;
        }
        .drug-name {
          text-align: center;
          width: 100%;
          font-size: 21px;
          height: 29px;
          line-height: 29px;
          margin: 50px 0px 0 0px;
          overflow: hidden;
          padding: 0px 20px;
          box-sizing: border-box;
        }
        .drug-date-wrapper {
          text-align: center;
          line-height: 20px;
          // margin-top: 10px;
          padding: 0 20px;
          width: 100%;
        }
        .drug-source {
          font-size: 12px;
          margin: 5px 0;
          text-align: center;
          width: 100%;
          height: 22px;
          line-height: 22px;
          overflow: hidden;
          padding: 0px 20px;
          box-sizing: border-box;
        }
        .drug-guige {
          font-size: 12px;
          text-align: center;
          line-height: 15px;
          margin-top: 5px;
          width: 100%;
          padding: 0px 20px;
          box-sizing: border-box;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .drug-noyibao {
          // margin: 20px 0;
        }
        .drug-yibao {
          text-align: center;
          margin: 15px 0;
          min-height: 20px;
          .instruct-icon {
            background-color: @Blue;
            color: #fff;
            border-radius: 10px;
            padding: 0px 10px;
            display: inline-block;
            font-size: 12px;
            // height: 20px;
            line-height: 14px;
            margin-right: 5px;
          }
          .instruct-icon:nth-of-type(2) {
            margin-right: 0;
          }
          .icon-orange {
            background-color: @Orange;
          }
        }
      }
      .card-middle {
        width: 100%;
        height: 40px;
        line-height: 40px;
        background-color: @GrayBackgroundColor;
        float: left;
        .ttip {
          display: inline-block;
          font-size: 13px;
          padding: 0px 2px 0px 15px;
        }
      }
      .card-bottom {
        width: 100%;
        height: 90px;
        float: left;
        .bottom-item {
          transition: all 300ms;
          float: left;
          width: 25%;
          height: 100%;
          background-color: @BorderColor;
          position: relative;
          overflow: hidden;
          text-align: center;
          text-decoration: none;
          &::after {
            content: "";
            transition: all 300ms;
            position: absolute;
            bottom: -3px;
            left: 0px;
            width: 100%;
            height: 3px;
            background-color: #fff;
            border-radius: 2px;
          }
          &:hover {
            background-color: Lighten(@PrimaryColor, 10%);
            &::after {
              transition: all 300ms;
              bottom: 0px;
            }
          }
          .item-num {
            transition: all 300ms;
            color: #7f8697;
            font-size: 23px;
            padding: 16px 0px 5px 0px;
          }
          .item-name {
            font-size: 12px;
          }
        }
      }
    }
  }
}
.download {
  position: relative;
  &:hover {
    .download-icon {
      transition: all 100ms;
      background-color: @PrimaryColor;
      color: #fff;
    }
    .fujian-cl {
      transition: all 500ms;
      transform: translateX(0px);
      width: auto;
      opacity: 1;
    }
  }
  .download-icon {
    transition: all 100ms;
    z-index: 10;
    display: inline-block;
    position: relative;
    // top: 0px;
    // right: 0px;
    width: 26px;
    height: 26px;
    line-height: 26px;
    background-color: #fff;
    color: @PrimaryColor;
    font-size: 12px;
    text-align: center;
    border-radius: 13px;
    font-size: 16px;
  }
  .fujian-cl {
    transition: all 500ms;
    transform: translateX(50px);
    z-index: 9;
    opacity: 0;
    position: absolute;
    right: 20px;
    top: 0px;
    width: 0px;
    max-width: 144px;
    max-height: 20px;
    border-radius: 10px;
    margin-top: 3px;
    background-color: @GrayBackgroundColor;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    .fujian {
      min-width: 44px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: @PrimaryColor;
      }
    }
  }
}
.table-name {
  // span {
  //   max-width: 200px;
  //   overflow: hidden;
  //   white-space: nowrap;
  //   text-overflow: ellipsis;
  //   display: block;
  // }
}
@media screen and (max-width: 1594px) {
  .page-cards {
    justify-content: center !important;
  }
}

@media screen and (max-width: 1300px) {
  .page-cards {
    .card {
      margin: 0px 6px 28px !important;
    }
  }
}

.is-table {
  .download {
    top: 7px;
    left: 0;
    right: auto;
    &:hover {
      .fujian-cl {
        transform: translateX(60px);
      }
    }
    .fujian-cl {
      transform: translateX(20px);
    }
  }
  .no {
    top: 7px;
    left: 10px;
    position: absolute;
  }
}
</style>

