<template>
  <div class="la-list">
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
    <div class="actions" v-if="isTableCard">
      <!-- 显示 -->
      <list-check
        v-if="defaultFiled.length > 0"
        :defaultFiled="defaultFiled"
        vuex_name="DrugReport"
        :showArray="tableHead"
        @changeTableHeader="list => changeTableHeader(this, list)"
      />
      <!-- 导出 -->
      <Export
        v-if="exportDefaultFiled.length > 0"
        :out_max="allBase.out_max"
        vuex_name="DrugReport"
        api_name="report"
        :max_num="extendCount"
        :defaultFiled="exportDefaultFiled"
        outdataAction="base"
      ></Export>
    </div>
    <!-- 自定义加载界面 -->
    <LoadingGif
      :className="'db-index-loading'"
      :loadFlag="listLoading"
      v-if="listLoading"
    ></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="not-loading" v-else>
      <template v-if="res1 && !res1.length">
        <!-- 问题反馈弹出框 -->
        <el-dialog
          :visible.sync="dialogFeedbackShow"
          :modal-append-to-body="false"
          width="820px"
        >
          <div slot="title" class="dialog-header">问题反馈</div>
          <DialogFeedback @closeDialog="closeDialogFeedback"></DialogFeedback>
        </el-dialog>
        <div class="no-data-msg">
          <img src="/static/imgs/nodata/db-nodata.png" />
          <div class="msg">
            <p>对不起，小智已经很努力了，但没有找到对应数据。</p>
            <p>
              换个关键词试试，或
              <a class="link-blue" @click="showFeedback()">反馈</a> 给我们
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="isTableCard">
          <el-table
            ref="ElTable"
            :data="res1"
            :height="tableHeight"
            stripe
            style="width: 100%"
            v-if="show_table"
            :default-sort="order.base ? defaultSort(order.base) : {}"
            @sort-change="sortChange"
          >
            <el-table-column
              v-for="item in tableHead"
              :prop="item.prop"
              :sortable="item.sort"
              :min-width="item.field_width || item.width || 100"
              :key="item.prop"
              :label="item.label"
              :fixed="item.is_fixed == '1'"
            >
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
                    style="margin-left: 4px;line-height: 28px;"
                  ></i>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <input
                  type="hidden"
                  :value="item.field_width + ';' + item.width"
                />
                <div :title="item.prop !== 'atc' ? scope.row[item.prop] : ''">
                  <div v-if="item.prop == 'name'">
                    <!-- <div class="en-and-cn"> -->
                    <div
                      style="overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 1;
                            -webkit-box-orient: vertical;
                            max-height: 18px;"
                    >
                      <router-link
                        tag="a"
                        class="cl-blue"
                        :to="
                          '/report/' +
                            scope.row.id +
                            '?pinn=' +
                            scope.row.pinn +
                            '&englishname=' +
                            scope.row.englishname
                        "
                        target="_blank"
                        :title="scope.row.name"
                        >{{ scope.row.name }}</router-link
                      >
                      <router-link
                        tag="a"
                        class="cl-blue"
                        :to="
                          '/report/' +
                            scope.row.id +
                            '?pinn=' +
                            scope.row.pinn +
                            '&englishname=' +
                            scope.row.englishname
                        "
                        target="_blank"
                        :title="scope.row.englishname"
                        >{{ scope.row.englishname }}</router-link
                      >
                      <span
                        v-if="
                          scope.row.name == '' && scope.row.englishname == ''
                        "
                        >/</span
                      >
                    </div>
                    <div
                      style="overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                        max-height: 18px;"
                    >
                      <span
                        v-if="scope.row.chinamarked == 1"
                        class="tag tag-green"
                        >中国上市</span
                      >
                      <span
                        v-if="scope.row.compound === '是'"
                        title="复方药"
                        class="tag tag-blue"
                        >复方</span
                      >
                      <span
                        v-if="scope.row.zclx1 === '是'"
                        title="中国1类药"
                        class="tag"
                        style="background:#f77d54;"
                        >1类</span
                      >
                    </div>
                    <!-- </div> -->
                    <!-- <div class="name-tips" :style="{'padding-top': (scope.row.englishname != ''? '11px': '0')}">
                      <span class="tags">
                        <span v-if="scope.row.zgss" class="tag tag-green">中国上市</span>
                      </span>
                    </div> -->
                  </div>

                  <div v-if="item.prop == 'higheststatus'">
                    <span>{{ scope.row["higheststatus"] || "/" }}</span>
                  </div>
                  <div v-if="item.prop == 'originatorcompany'">
                    <span>{{ scope.row["originatorcompany"] || "/" }}</span>
                  </div>
                  <div v-if="item.prop == 'indication'">
                    <span>{{ scope.row["indication"] || "/" }}</span>
                  </div>
                  <div v-if="item.prop == 'leixing2'">
                    <span>{{ scope.row["leixing2"] || "/" }}</span>
                  </div>
                  <div v-if="item.prop == 'target'" :title="''">
                    <TooltipBD
                      :targets="scope.row.target_unique || '/'"
                      :targets_abbr="scope.row.targets_abbr || '/'"
                    />
                  </div>
                  <!-- {{item.prop}}          -->
                  <div v-if="item.prop == 'shuoming'">
                    <span :title="scope.row['shuoming']">{{
                      scope.row["shuoming"] || "/"
                    }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="drug-lists" v-else>
          <router-link
            class="drug"
            tag="a"
            :to="'/report/' + item.id + '?pinn=' + item.pinn"
            target="_blank"
            v-for="(item, index) in res1"
            :key="index"
          >
            <div class="drug-top">
              <router-link
                class="drug-name fs18 text-overflow"
                tag="a"
                :to="'/report/' + item.id + '?pinn=' + item.pinn"
                target="_blank"
                :title="item.name"
                >{{ item.name || "/" }}</router-link
              >
              <router-link
                class="drug-name fs14 text-overflow"
                style="margin-top: -10px;"
                tag="a"
                :to="'/report/' + item.id + '?pinn=' + item.pinn"
                target="_blank"
                :title="item.englishname"
                >{{ item.englishname || "/" }}</router-link
              >
              <div class="drug-img">
                <img
                  v-if="item.structpicture"
                  :src="item.structpicture"
                  @error="picLoadError"
                />
                <img v-else src="/static/imgs/general/no-drug-img.jpg" />
              </div>
              <div class="tags">
                <span v-if="item.chinamarked == 1" class="tag tag-green"
                  >中国上市</span
                >
                <span v-if="item.higheststatus != ''" class="tag tag-orange">{{
                  item.higheststatus || "/"
                }}</span>
              </div>
            </div>
            <ul class="drug-bottom">
              <li :title="item.originatorcompany">
                <label class="fs13">原研单位：</label>
                <span class="one-line text-overflow">{{
                  item.originatorcompany || "/"
                }}</span>
              </li>
              <li :title="item.target">
                <label class="fs13">作用靶点：</label>
                <span class="one-line text-overflow">{{
                  item.target || "/"
                }}</span>
              </li>
              <li :title="getAtc(item.atcarr)">
                <label class="fs13">ATC分类：</label>
                <div class="two-line">{{ getAtc(item.atcarr) || "/" }}</div>
                <!-- <span>{{getAtc(item.atcarr)}}</span> -->
              </li>
            </ul>
          </router-link>
        </div>
        <div style="positon: relative;">
          <el-pagination
            v-if="extendCount"
            layout="total, sizes, prev, pager, next"
            :page-size="param.pageSize"
            :current-page="param.page"
            :page-sizes="[20, 30, 50]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="extendCount"
            :disabled="nopms.fy"
            :class="{ 'abandon-click-method': nopms.fy }"
          ></el-pagination>
          <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import TooltipBD from "@/components/common/globalCom/target-tooltip";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import commonMixins from "@/mixins/common.js";
import DialogFeedback from "@/components/common/dialog-feedback";
import Export from "@/components/common/export";
import listCheck from "@/components/common/list-check";
import { mapState } from "vuex";
import defaultFiled from "./table";
import setTableHMixins from "@/mixins/setTableH.js";
export default {
  components: {
    TooltipBD,
    LoadingGif,
    DialogFeedback,
    Export,
    listCheck
  },
  data() {
    return {
      tableHead: [],
      vuex_name: "DrugReport",
      show_table: true,
      dialogFeedbackShow: false,
      defaultFiled: [],
      exportDefaultFiled: [],
      isTableCard: true,
      lineClamp: "-webkit-line-clamp: 3",
      tableHeight: document.documentElement.clientHeight - 48 - 60 - 45 - 88
    };
  },
  mixins: [setTableHMixins, commonMixins],
  computed: {
    ...mapState({
      allBase: state => state.DrugReport.allBase,
      tableconf: state => state.DrugReport.tableconf,
      nopms: state => state.DrugReport.nopms,
      param: state => state.DrugReport.param,
      order: state => state.DrugReport.order,
      extendCount: state => state.DrugReport.extendCount,
      listLoading: state => state.DrugReport.listLoading,
      res1: state =>
        _.keys(state.DrugReport.res1).length ? state.DrugReport.res1 : []
    })
  },
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("DrugReport/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
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
    onTableView() {
      this.isTableCard = true;
    },
    onCard() {
      this.isTableCard = false;
    },
    closeDialogFeedback() {
      this.dialogFeedbackShow = false;
    },
    showFeedback() {
      this.dialogFeedbackShow = true;
    },
    handleCurrentChange(val) {
      this.param.page = val;
      if (val * this.param.pageSize <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("DrugReport/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    // 获取atc的中文
    getAtc(arr) {
      let str = "";
      if (arr) {
        for (let item of arr) {
          str += item.shuoming + " > ";
        }
        str = _.trimEnd(str, " > "); // 去除最后多余的" > "
      }
      return str;
    },
    picLoadError(ev) {
      // 图片加载失败，切换为默认图
      ev.target.src = "/static/imgs/general/no-drug-img.jpg";
    }
  },
  updated() {
    if (this.param.pageSize * this.param.page <= 1500) {
      $(".out-of-page").hide();
    } else {
      $(".out-of-page").show();
    }
    this.vueTogglePmsTooltip();
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
      n.forEach(item => {
        item.checked = item.hidden === undefined;
        item.prop = item.field;
      });
      //后台控制列表宽度
      this.defaultFiled = this.tableheaderCombain(n, n);
      this.exportDefaultFiled = this.defaultFiled;
      this.init();
    }
  },
  created() {
    // this.init()
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.la-list {
  .actions {
    top: 0px;
  }
  .card-hand {
    // height: 40px;
    // line-height: 40px;
    display: flex;
    justify-content: flex-end;
    padding: 0px 160px 0 20px;
    box-sizing: border-box;
    .box {
      display: flex;

      .item:first-child {
        margin-right: 16px;
      }
    }
    .item {
      display: flex;
      align-items: center;
      padding-left: 7px;
      &:hover .txt,
      &:hover i,
      &.on .txt,
      &.on i {
        color: #4877e8;
        cursor: pointer;
      }
      &:hover .txt {
        // text-decoration: underline;
      }
    }
    .txt,
    i {
      color: #35384a;
    }
    .txt {
      font-size: 12px;
      padding-left: 3px;
    }
  }
  .en-and-cn,
  .name-tips {
    float: left;
  }
  .tag {
    padding: 0px 10px;
    border-radius: 10px;
    color: #fff;
    line-height: 14px;
    display: inline-block;
  }
  .tag-green {
    background-color: @Green;
  }
  .tag-blue {
    background-color: #4877e8;
  }
  .tags {
    height: 20px;
    padding: 10px 0;
    .tag {
      padding: 1px 10px;
      border-radius: 10px;
      color: #fff;
      white-space: nowrap;
      &.tag-green {
        background-color: @Green;
      }
      &.tag-orange {
        background-color: @Orange;
      }
    }
  }
  .not-loading {
    .drug-lists {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .drug {
        transition: all 300ms;
        display: inline-block;
        width: 290px;
        height: 380px;
        margin: 0px 8px 28px;
        text-decoration: none;
        color: #606266;
        .drug-top {
          padding: 20px 16px 0px;
          background-color: #f7f8fc;
          color: #878c9e;
        }
        .drug-name {
          transition: all 300ms;
          display: inline-block;
          width: 100%;
          height: 26px;
          font-weight: 600;
          color: #35384a;
        }
        .drug-img {
          height: 154px;
          line-height: 154px;
          text-align: center;
          border: 1px solid @BorderColor;
          background-color: white;
          img {
            max-height: 152px;
            max-width: 254px;
            vertical-align: middle;
          }
        }

        .drug-bottom {
          transition: all 300ms;
          height: 93px;
          padding: 10px 15px;
          background-color: #dfe5f1;
          line-height: 24px;
          li {
            display: flex;
            justify-content: flex-start;
          }
          .one-line {
            display: inline-block;
            width: 195px;
            vertical-align: bottom;
          }
          .two-line {
            height: 48px;
            width: 195px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        &:hover {
          transition: all 300ms;
          box-shadow: @BoxShadow;
          .drug-name {
            transition: all 300ms;
            color: @PrimaryColor;
          }
          .drug-bottom {
            transition: all 300ms;
            color: #fff;
            background-color: @PrimaryColor;
          }
        }
      }
    }
  }
}
.el-table .cell {
  .dis {
    max-width: 210px;
  }
}

@media screen and (max-width: 1594px) {
  .drug-lists {
    justify-content: center !important;
  }
}

@media screen and (max-width: 1300px) {
  .drug-lists {
    .drug {
      margin: 0px 6px 28px !important;
    }
  }
}
</style>
