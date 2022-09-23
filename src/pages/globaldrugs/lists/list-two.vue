<template>
  <div class="la-list globaldrugs-list-two">
    <List :loading="listLoading" :nodata="res2 && !res2.length">
      <div class="actions">
        <span
          class="action-btn"
          :class="{ 'abandon-click-method': nopms && nopms.visualization }"
          @click="sendGa"
        >
          <img
            src="~@/assets/imgs/globaldrugs/fx_icon.png"
            width="14px"
            alt=""
          />
          智能分析
        </span>
        <span
          class="action-btn"
          :class="{ 'abandon-click-method': nopms && nopms.compare }"
          @click="goToContrast"
        >
          <img
            src="~@/assets/imgs/globaldrugs/db_icon.png"
            width="14px"
            alt=""
          />
          对比
        </span>
        <span class="action-btn" :class="{ 'abandon-click-method': nopms && nopms.rss }" @click="handleActionsClick('订阅')">
          <img
            src="~@/assets/imgs/globaldrugs/dy_icon.png"
            width="14px"
            alt=""
          />
          订阅
        </span>

        <span
          class="action-btn"
          @click="handleActionsClick('AI推荐')"
          style="color: #9aa4b8"
        >
          <img
            src="~@/assets/imgs/globaldrugs/ai_icon.png"
            width="14px"
            alt=""
          />
          AI推荐
        </span>

        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Globaldrugs"
          :showArray="tableHead"
          @changeTableHeader="(list) => changeTableHeader(this, list)"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Globaldrugs"
          api_name="globaldrugs"
          :max_num="extendCount.projectCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="projectGroup"
        ></Export>
      </div>
      <el-table
        :data="res2"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        @sort-change="sortChange"
        class="table extensible-table"
        style="width: 100%"
        v-if="show_table"
      >
        <el-table-column
          v-for="item in tableHead"
          :prop="item.prop"
          :key="item.prop"
          :sortable="item.sort"
          :min-width="item.width || 100"
          :label="item.label"
        >
          <!-- 自定义表头 -->
          <template :slot="'header'" slot-scope="scope">
            <div v-if="item.prop === 'project'" class="project-title-box">
              <div :title="'进度：临床前'">进度：临床前</div>
              <div>临床申请</div>
              <div>临床Ⅰ期</div>
              <div>临床Ⅱ期</div>
              <div>临床Ⅲ期</div>
              <div>注册申请</div>
              <div>批准上市</div>
            </div>
            <span v-else>
              {{ item.label }}
            </span>
          </template>
          <template slot-scope="scope">
            <div>
              <!-- 项目名称 -->
              <template v-if="item.prop === 'drugname_standard'">
                <div
                  :title="`${scope.row.drugname_standard}:${scope.row.company_standard}`"
                >
                  <div style="font-weight: bold">
                    <span
                      @click="
                        goToDetail(
                          scope.row.hash_drugname_standard,
                          scope.row.hash_company
                        )
                      "
                      class="span-hover"
                      >{{ scope.row.drugname_standard }}</span
                    >
                    <span
                      v-if="
                        scope.row.drugname_standard &&
                        scope.row.company_standard
                      "
                      >:</span
                    >
                  </div>
                  <div style="color: #5c6973">
                    {{ scope.row.company_standard }}
                  </div>
                </div>
              </template>

              <!-- 靶点 -->
              <template v-else-if="item.prop === 'targets_abbr'">
                <div v-if="scope.row.targets_abbr">
                  <!-- {{ scope.row.targets_abbr || scope.row.targets || "-" }} -->
                  <span
                    @click="goTarget(tar.hash_name)"
                    style="cursor: pointer; color: #002fa7"
                    v-for="(tar, index) in scope.row.targets_abbr_arr"
                    :key="index"
                  >
                    {{ tar.name }}<span
                      v-if="index !== scope.row.targets_abbr_arr.length - 1"
                      >;</span
                    >
                  </span>
                </div>
                <span v-else>-</span>
              </template>

              <!-- 适应症 -->
              <!-- <template v-else-if="item.prop === 'indication_standard'">
                <el-tooltip
                  class=""
                  effect="zhuce"
                  placement="right"
                  v-if="scope.row.indication_standard"
                >
                  <div slot="content">
                    <div class="content">
                      <span
                        style="display: block"
                        v-for="(
                          item, index
                        ) in scope.row.indication_standard.split(';')"
                        :key="item"
                        >{{ item }}
                        <span
                          v-if="
                            index !==
                            scope.row.indication_standard.split(';').length - 1
                          "
                          >;</span
                        ></span
                      >
                    </div>
                  </div>
                  <div class="indication-two">
                    <div class="content">
                      <span
                        style="display: block"
                        v-for="(
                          item, index
                        ) in scope.row.indication_standard.split(';')"
                        :key="item"
                        >{{ item }}
                        <span
                          v-if="
                            index !==
                            scope.row.indication_standard.split(';').length - 1
                          "
                          >;</span
                        ></span
                      >
                    </div>
                  </div>
                </el-tooltip>
              </template> -->

              <!-- 治疗领域 -->
              <!-- <template v-else-if="item.prop === 'indication_zlly'">
                <el-tooltip
                  class=""
                  effect="zhuce"
                  placement="right"
                  v-if="scope.row.indication_zlly"
                >
                  <div slot="content">
                    <div class="content">
                      <span
                        style="display: block"
                        v-for="(
                          item, index
                        ) in scope.row.indication_zlly.split(';')"
                        :key="item"
                        >{{ item }}
                        <span
                          v-if="
                            index !==
                            scope.row.indication_zlly.split(';').length - 1
                          "
                          >;</span
                        ></span
                      >
                    </div>
                  </div>
                  <div class="indication-two">
                    <div class="content">
                      <span
                        style="display: block"
                        v-for="(
                          item, index
                        ) in scope.row.indication_zlly.split(';')"
                        :key="item"
                        >{{ item }}
                        <span
                          v-if="
                            index !==
                            scope.row.indication_zlly.split(';').length - 1
                          "
                          >;</span
                        ></span
                      >
                    </div>
                  </div>
                </el-tooltip>
              </template> -->

              <!-- 适应症 -->
              <template v-else-if="item.prop === 'indication_standard'">
                <el-popover
                  placement="right"
                  width="260"
                  trigger="hover"
                  v-if="scope.row.indication_standard"
                >
                  <div class="globaldrugs-company-content">
                    <img
                      class="trangle"
                      src="/static/imgs/globaldrugs/tooltip.png"
                      alt=""
                    />
                    <div class="max-content">
                      <div
                        v-for="(
                          item, index
                        ) in scope.row.indication_standard.split(';')"
                        :key="item"
                      >
                        {{ item }}
                        <span
                          v-if="
                            index !==
                            scope.row.indication_standard.split(';').length - 1
                          "
                          >;</span
                        >
                      </div>
                    </div>
                  </div>
                  <div slot="reference" class="indication-two">
                    <span class="content">{{
                      scope.row.indication_standard
                    }}</span>
                  </div>
                </el-popover>
              </template>

              <!-- 治疗领域 -->
              <template v-else-if="item.prop === 'indication_zlly'">
                <el-popover
                  placement="right"
                  width="260"
                  trigger="hover"
                  v-if="scope.row.indication_zlly"
                >
                  <div class="globaldrugs-company-content">
                    <img
                      class="trangle"
                      src="/static/imgs/globaldrugs/tooltip.png"
                      alt=""
                    />
                    <div class="max-content">
                      <div
                        v-for="(item, index) in scope.row.indication_zlly.split(
                          ';'
                        )"
                        :key="item"
                      >
                        {{ item }}
                        <span
                          v-if="
                            index !==
                            scope.row.indication_zlly.split(';').length - 1
                          "
                          >;</span
                        >
                      </div>
                    </div>
                  </div>
                  <div slot="reference" class="indication-two">
                    <span class="content">{{ scope.row.indication_zlly }}</span>
                  </div>
                </el-popover>
              </template>

              <!-- 项目进度 -->
              <template v-else-if="item.prop === 'project'">
                <div>
                  <!-- 世界项目进度 -->
                  <div
                    v-if="
                      scope.row.project.word && scope.row.project.word.maxphase
                    "
                    class="project-word"
                  >
                    <img
                      src="/static/imgs/globaldrugs/glob.png"
                      width="20"
                      height="20"
                      alt=""
                      class="img-map"
                    />

                    <div class="project-word-box">
                      <!-- 临床前 -->
                      <div
                        class="item"
                        v-if="scope.row.project.word.maxphase >= 10"
                      >
                        {{ scope.row.project.word.phase1.substring(0, 10) }}
                      </div>
                      <!-- 临床申请 -->
                      <div
                        class="item"
                        v-if="scope.row.project.word.maxphase >= 20"
                      >
                        {{ scope.row.project.word.phase2.substring(0, 10) }}
                      </div>
                      <!-- 临床1期 -->
                      <div
                        class="item"
                        v-if="scope.row.project.word.maxphase >= 30"
                      >
                        {{ scope.row.project.word.phase3.substring(0, 10) }}
                      </div>
                      <!-- 临床2期 -->
                      <div
                        class="item"
                        v-if="scope.row.project.word.maxphase >= 40"
                      >
                        {{ scope.row.project.word.phase4.substring(0, 10) }}
                      </div>
                      <!-- 临床3期 -->
                      <div
                        class="item"
                        v-if="scope.row.project.word.maxphase >= 50"
                      >
                        {{ scope.row.project.word.phase5.substring(0, 10) }}
                      </div>
                      <!-- 注册申请 -->
                      <div
                        class="item"
                        v-if="scope.row.project.word.maxphase >= 60"
                      >
                        {{ scope.row.project.word.phase6.substring(0, 10) }}
                      </div>
                      <!-- 批准上市 -->
                      <div
                        class="item"
                        v-if="scope.row.project.word.maxphase >= 70"
                      >
                        {{ scope.row.project.word.phase7.substring(0, 10) }}
                      </div>
                    </div>
                  </div>
                  <!-- 中国项目进度 -->
                  <div
                    v-if="
                      scope.row.project.china &&
                      scope.row.project.china.maxphase
                    "
                    class="project-china"
                  >
                    <img
                      src="/static/imgs/globaldrugs/cn.png"
                      width="20"
                      height="20"
                      alt=""
                      class="img-map"
                    />

                    <div class="project-china-box">
                      <!-- 临床前 -->
                      <div
                        class="item"
                        v-if="scope.row.project.china.maxphase >= 10"
                      >
                        {{ scope.row.project.china.phase1.substring(0, 10) }}
                      </div>
                      <!-- 临床申请 -->
                      <div
                        class="item"
                        v-if="scope.row.project.china.maxphase >= 20"
                      >
                        {{ scope.row.project.china.phase2.substring(0, 10) }}
                      </div>
                      <!-- 临床1期 -->
                      <div
                        class="item"
                        v-if="scope.row.project.china.maxphase >= 30"
                      >
                        {{ scope.row.project.china.phase3.substring(0, 10) }}
                      </div>
                      <!-- 临床2期 -->
                      <div
                        class="item"
                        v-if="scope.row.project.china.maxphase >= 40"
                      >
                        {{ scope.row.project.china.phase4.substring(0, 10) }}
                      </div>
                      <!-- 临床3期 -->
                      <div
                        class="item"
                        v-if="scope.row.project.china.maxphase >= 50"
                      >
                        {{ scope.row.project.china.phase5.substring(0, 10) }}
                      </div>
                      <!-- 注册申请 -->
                      <div
                        class="item"
                        v-if="scope.row.project.china.maxphase >= 60"
                      >
                        {{ scope.row.project.china.phase6.substring(0, 10) }}
                      </div>
                      <!-- 批准上市 -->
                      <div
                        class="item"
                        v-if="scope.row.project.china.maxphase >= 70"
                      >
                        {{ scope.row.project.china.phase7.substring(0, 10) }}
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else
                ><span :title="scope.row[item.prop]">{{
                  scope.row[item.prop] || "-"
                }}</span></template
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative">
        <el-pagination
          v-if="extendCount.projectCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.projectCount"
          :disabled="nopms.fy"
          :class="{ 'abandon-click-method': nopms.fy }"
        >
        </el-pagination>
        <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
      </div>
      <alert-wrong ref="alertWrongTwo"></alert-wrong>
    </List>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import List from "@/components/layouts/list";
import Export from "@/components/common/globaldrugs/export";
import { mapState } from "vuex";
import tablehead from "@/config/tablehead";
import listCheck from "@/components/common/globaldrugs/list-check";
import AlertWrong from "./alert.vue";
import commonMixins from "@/mixins/common.js";
import setTableHMixins from "@/mixins/setTableH.js";
const defaultFiled = tablehead.globaldrugs.project;
export default {
  components: {
    LoadingGif,
    List,
    Export,
    listCheck,
    AlertWrong,
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      vuex_name: "Globaldrugs",
      scope: "",
      defaultFiled: defaultFiled,
      tableType: null,
      checkedFiled: [],
      tableHead: [],
      show_table: true,
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 50 - 88,
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      tableconf: (state) => state.Globaldrugs.tableconf,
      allBase: (state) => state.Globaldrugs.allBase,
      res2: (state) =>
        _.keys(state.Globaldrugs.res2).length ? state.Globaldrugs.res2.res : [],
      errocode: (state) => state.Globaldrugs.error,
      listLoading: (state) => state.Globaldrugs.listLoading,
      putong: (state) => state.Globaldrugs.putong,
      gaoji: (state) => state.Globaldrugs.gaoji,
      shaixuan: (state) => state.Globaldrugs.shaixuan,
      extendCount: (state) => state.Globaldrugs.extendCount,
      param: (state) => state.Globaldrugs.xmjz_param, // 附加参数(存于vuex内)
      nopms: (state) => state.Globaldrugs.nopms,
      order: (state) => state.Globaldrugs.order,
    }),
    exportDefaultFiled() {
      let arr = [];
      for (let item of defaultFiled) {
        //导出没做好暂时隐藏
        if (item.prop != "zgzt" && item.prop != "zxzt") {
          arr.push(item);
        }
      }
      return arr;
    },
  },
  // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
  activated() {
    this.registerEven();
  },
  watch: {
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
    //   //后台控制列表宽度
    //   this.expandFiled = this.tableheaderCombain(n,this.expandFiled);
    // }
  },
  methods: {
    // 跳转到靶点详情页
    goTarget(item) {
      let path = "/globaldrugs/target/detail?target=" + encodeURIComponent(item);
      let routeData = this.$router.resolve({
        path: path,
      });
      window.open(routeData.href, "_blank");
    },
    // 药品详情
    goToDetail(drugname_standard, company) {
      let routeData = this.$router.resolve({
        path:
          "/globaldrugs/detail?drugname_standard=" +
          encodeURIComponent(drugname_standard) +
          "&company_standard=" +
          encodeURIComponent(company),
      });
      window.open(routeData.href, "_blank");
    },
    // 排序
    sortChange(column, prop, order) {
      let sort;
      // column.prop为null时，默认排序
      console.log(column.order)
      if (column.prop) {
        if (column.order == "ascending") {
          sort = column.prop + " " + "asc";
        } else if (column.order == "descending") {
          sort = column.prop + " " + "desc";
        } else {
          sort = "";
        }
      }
      this.param.order = sort;
      Store.commit(
        "Globaldrugs/order",
        Object.assign({}, this.$store.state.Globaldrugs.order, {
          projectGroup: sort ? sort : null,
        })
      );
      Store.dispatch("Globaldrugs/nomalSearch", { params: this.param });
    },
    handleActionsClick(name) {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "企业版_全球药物_列表_" + name
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_列表_" + name,
      ]);
      if (name == "订阅" && this.nopms && !this.nopms.rss) {
        let routeData = this.$router.resolve({
          path: `/usercenter/take/new`,
          query: {
            source: "globaldrugs",
          },
        });
        window.open(routeData.href, "_blank");
      }
      if (name == "AI推荐") {
        this.$refs.alertWrong.changeAlert();
      }
    },
    // 跳转到对比页面
    goToContrast() {
      if (this.nopms && !this.nopms.compare) {
        window.ga(
          "send",
          "event",
          "button",
          "click",
          "企业版_全球药物_列表_对比"
        );
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          "企业版_全球药物_列表_对比",
        ]);

        let routeData = this.$router.resolve({
          path: "/globaldrugs/contrast",
        });
        window.open(routeData.href, "_blank");
      }
    },
    // 跳转到智能分析
    sendGa() {
      if (this.nopms && !this.nopms.visualization) {
        window.ga(
          "send",
          "event",
          "button",
          "click",
          "企业版_全球药物_列表_智能分析"
        );
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          "企业版_全球药物_列表_智能分析",
        ]);
        let routeData = this.$router.resolve({
          path: "/globaldrugs/analysis",
          query: {
            ...this.putong,
          },
        });
        window.open(routeData.href, "_blank");
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
        Store.dispatch("Globaldrugs/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Globaldrugs/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
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
.el-tooltip__popper.is-zhuce {
  min-width: 200px;
  div {
    max-height: 400px;
    overflow-y: auto;
  }
}
.globaldrugs-list-two {
  .span-hover {
    cursor: pointer;
    &:hover {
      color: #002fa7;
    }
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #f5f8fc;
  }
  .el-table {
    .el-table__body tr.el-table__row--striped:hover > td,
    .el-table__body tr:hover > td {
      background-color: #ebeef5 !important;
    }
  }
  .el-table td .cell > div {
    overflow: unset;
    text-overflow: unset;
    display: block;
    -webkit-line-clamp: unset;
    -webkit-box-orient: unset;
    max-height: 55px;
  }

  .el-table .caret-wrapper {
    left: -9.8%;
    z-index: 10;
  }

  .project-title-box {
    width: 94%;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 0 0;
    div {
      padding: 0;
      width: calc(94% / 7);
      position: relative;
      min-width: 100px;
    }
    div:nth-of-type(2) {
      z-index: 1;
      left: 4%;
    }
    div:nth-of-type(3) {
      z-index: 1;
      left: 2%;
    }

    div:nth-of-type(4) {
      z-index: 1;
      left: 1%;
    }

    div:nth-of-type(6),
    div:nth-of-type(7) {
      z-index: 1;
      left: -2%;
    }
  }
  .indication-two {
    font-size: 13px;
    display: inline-block;
    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }

  .project-china,
  .project-word {
    width: 100%;
    height: 20px;
    display: flex;
    padding-left: 15px;
    position: relative;
  }

  img.img-map {
    position: absolute;
    /* right: -20px; */
    left: 0;
    z-index: 10;
  }

  .project-word {
    margin-bottom: 10px;
  }

  .project-china-box,
  .project-word-box {
    flex: 1;
    display: flex;

    > div.item {
      height: 20px;
      line-height: 20px;
      border-radius: 10px;
      width: calc(100% / 7);
      min-width: 105px;
      position: relative;
      text-align: center;
      color: #35384a;
      font-size: 12px;
    }

    .item:nth-of-type(1) {
      background: #e8f1fe;
      z-index: 7;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .item:nth-of-type(2) {
      background: #cddefd;
      left: -2%;
      z-index: 6;
    }
    .item:nth-of-type(3) {
      background: #afc9fe;
      z-index: 5;
      left: -4%;
    }
    .item:nth-of-type(4) {
      background: #8bb4fa;
      color: #fff;
      z-index: 4;
      left: -6%;
    }
    .item:nth-of-type(5) {
      background: #598dfc;
      color: #fff;
      z-index: 3;
      left: -8%;
    }
    .item:nth-of-type(6) {
      background: #3a79f0;
      color: #fff;
      z-index: 2;
      left: -10%;
    }
    .item:nth-of-type(7) {
      background: #1944b0;
      color: #fff;
      z-index: 1;
      left: -12%;
    }
  }

  .project-china-box {
    .item:nth-of-type(1) {
      background: #e4fcb6;
    }
    .item:nth-of-type(2) {
      background: #d2f789;
    }
    .item:nth-of-type(3) {
      background: #c1e975;
    }
    .item:nth-of-type(4) {
      background: #b0d867;
      color: #fff;
    }
    .item:nth-of-type(5) {
      background: #92d763;
      color: #fff;
    }
    .item:nth-of-type(6) {
      background: #82cc19;
      color: #fff;
    }
    .item:nth-of-type(7) {
      background: #6dbf32;
      color: #fff;
    }
  }
}

@media screen and (max-width: 1400px) {
  .la-list.globaldrugs-list-two {
    .actions {
      width: 195px;
      overflow: hidden;
      line-height: 17px;
      // text-align: right;
      top: -58px;

      .action-btn {
        margin-right: 10px;
      }
    }
  }
}
</style>
