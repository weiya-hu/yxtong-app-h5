<template>
  <Main class="zhuce globaldrugs">
    <!-- 保存条件 - 输入名称 弹出框 -->
    <el-dialog
      class="dialog-saved"
      :visible.sync="savedPopVisible"
      :modal-append-to-body="false"
    >
      <div slot="title" class="dialog-header">保存条件</div>
      <SavedPop
        @closeSavedPop="closeSavedPop"
        vuex_name="Globaldrugs"
      ></SavedPop>
    </el-dialog>

    <!-- 高级搜索弹出框 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :modal-append-to-body="false"
      width="880px"
      class="gj-dialog"
    >
      <div slot="title" class="dialog-header">
        <span class="header-title">高级搜索</span>
        <span class="header-tip"
          >你可以在这里找到并使用所有的检索项
          &nbsp;&nbsp;&nbsp;&nbsp;没有我想要的?<span
            class="header-back"
            @click="handleBack"
            >立即反馈</span
          ></span
        >
      </div>
      <Advanced
        vuex_name="Globaldrugs"
        api_name="globaldrugs"
        route1="list"
        route2="analy"
        @closeAdvancedDialog="closeAdvancedDialog"
        @clearLeft="clearLeft"
        ref="advanced"
      ></Advanced>
    </el-dialog>

    <!-- 左边部分 -->
    <div slot="left" style="position: relative">
      <div style="margin-bottom: 10px">
        <!-- 普通搜索项 -->
        <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
          <Normal
            @nomalSearch="nomalSearch"
            vuex_name="Globaldrugs"
            api_name="globaldrugs"
            :item="item"
            route1="list"
            route2="analy"
            :key="index"
            ref="ileft"
          ></Normal>
        </template>
      </div>
      <!-- 普通搜索按钮 & 高级搜索入口 -->
      <div class="advanced-search">
        <!-- 高级搜索 -->
        <span class="fr adva-icon">
          <a
            @click.prevent="handleAdvancedClick()"
            :class="{ 'abandon-click-method': nopms.gjss }"
            class="gjss"
            >高级检索模式</a
          >
          <el-tooltip
            class="item"
            effect="light"
            placement="right"
            v-if="helpInfo.high_holder"
          >
            <div slot="content" v-html="helpInfo.high_holder"></div>
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </span>
        <!-- 普通搜索 -->
        <el-button
          class="advanced-search-btn"
          type="primary"
          size="mini"
          round
          @click="nomalSearch"
          >搜索</el-button
        >
      </div>
      <!-- 热点筛选条件 -->
      <HotFilter
        vuex_name="Globaldrugs"
        route1="list"
        route2="analy"
      ></HotFilter>
      <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->
      <Filters
        vuex_name="Globaldrugs"
        route1="list"
        ref="globaldrugsFilter"
      ></Filters>
      <!-- 保存的条件 -->
      <Saved vuex_name="Globaldrugs" api_name="globaldrugs"></Saved>
      <!-- 历史搜索 -->
    </div>

    <!-- 右边部分 -->
    <div class="la-right">
      <!-- 顶部 -->
      <section class="sec1 clearfix">
        <span class="database-name">{{ allBase.dbname }}</span>
        <div class="sec1-right">
          <div class="top-update-wrap">
            <el-tooltip
              class="help-tip"
              effect="light"
              placement="bottom"
              v-if="helpInfo.remark ? helpInfo.remark : ''"
            >
              <div slot="content">
                <el-scrollbar>
                  <div
                    class="tip-content"
                    v-html="helpInfo.remark ? helpInfo.remark : ''"
                  ></div>
                </el-scrollbar>
                <a
                  class="btn default"
                  v-if="helpInfo.url"
                  :href="helpInfo.url"
                  target="_blank"
                  >帮助中心</a
                >
              </div>
              <span style="display: flex"
                ><span class="section-ico-qa"></span>帮助</span
              >
            </el-tooltip>
            <span style="color: #9aa4b8; margin-left: 30px">{{
              update_conf.log
            }}</span>

            <el-breadcrumb
              separator-class="el-icon-arrow-right"
              v-if="allBase.dbname"
            >
              <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item v-if="route.indexOf('analy') > -1"
                ><a :href="'/' + allBase.dbename">{{
                  allBase.dbname
                }}</a></el-breadcrumb-item
              >
              <el-breadcrumb-item v-else>{{
                allBase.dbname
              }}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="route.indexOf('analy') > -1"
                >智能分析</el-breadcrumb-item
              >
            </el-breadcrumb>
          </div>
        </div>
        <Optioned
          @showSavedPop="showSavedPop"
          @clearTheLeft="clearTheLeft"
          @clearLeft="clearLeft"
          vuex_name="Globaldrugs"
          route1="list"
          route2="analy"
          route3="qb"
        ></Optioned>
      </section>
      <section class="sec2 newsec2">
        <div class="search-body-content">
          <!-- <i class="iconfont sh">&#xe60c;</i> -->
          <!-- &#xe67f; -->
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </section>
    </div>
  </Main>
</template>

<script>
import { mapState } from "vuex";
import Main from "@/components/layouts/main";
import Saved from "@/components/common/globaldrugs/saved";
import SavedPop from "@/components/common/globaldrugs/saved-pop";
import Optioned from "@/components/common/globaldrugs/options";
import Normal from "@/components/common/globaldrugs/normal";
import Advanced from "@/components/common/globaldrugs/advanced";
import Filters from "@/components/common/globaldrugs/filters-config";
import HotFilter from "@/components/common/globaldrugs/hot-filter";
import sha1 from "sha1";
import UUID from "uuid-js";

export default {
  components: {
    Main,
    Normal,
    Advanced,
    HotFilter,
    Filters,
    Saved,
    SavedPop,
    Optioned,
  },
  data() {
    return {
      savedPopVisible: false,
      dialogFormVisible: false, //控制高级搜索弹框
      route: this.$route.path.split("/")[2],
      basic: {},
      api_name: "globaldrugs",
    };
  },
  computed: {
    ...mapState({
      allBase: (state) => state.Globaldrugs.allBase,
      helpInfo: (state) => state.Globaldrugs.helpInfo,
      nomal_filed: (state) => state.Globaldrugs.nomal_filed,
      advanced_filed: (state) => state.Globaldrugs.advanced_filed,
      baseCount: (state) => state.Globaldrugs.extendCount.BaseCount,
      putong: (state) => state.Globaldrugs.putong,
      nopms: (state) => state.Globaldrugs.nopms,
      norules: (state) => state.Globaldrugs.norules,
      update_conf: (state) => state.Globaldrugs.update_conf,
      showPromtNotice: (state) => state.showPromtNotice,
    }),
  },
  filters: {
    // 给数字每三位数加一个逗号
    formatNumber(val) {
      val = parseInt(val);
      return val.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    },
  },
  watch: {
    $route() {
      this.route = this.$route.path.split("/")[2];
    },
    showPromtNotice(val) {
      if (val) {
        $(".globaldrugs .la-left-side").css("paddingBottom", "85px");
      } else {
        $(".globaldrugs .la-left-side").css("paddingBottom", "55px");
      }
    },
  },
  methods: {
    // 关闭保存条件框
    closeSavedPop() {
      this.savedPopVisible = false;
    },
    showSavedPop() {
      this.savedPopVisible = true;
    },
    //获取普通搜索
    nomalSearch() {
      window.ga(
        "send",
        "event",
        "tab",
        "click",
        "企业版_全球药物_普通搜索_搜索"
      );
      window._paq.push([
        "trackEvent",
        "tab",
        "click",
        "企业版_全球药物_普通搜索_搜索",
      ]);
      // Store.commit("Globaldrugs/conditions", []);
      Store.commit("Globaldrugs/conditionsFilter", []);
      Store.commit("Globaldrugs/highGroups", {});
      //清空高级搜索条件和筛选项
      // Store.commit("Globaldrugs/groups", {});
      if (this.route == "list") {
        // Store.dispatch("Globaldrugs/nomalSearch");
        this.$refs.globaldrugsFilter.searchFilter();
      }
    },
    // 点击左侧栏中的“高级搜索”触发的事件
    handleAdvancedClick() {
      if (!this.nopms.gjss) {
        this.dialogFormVisible = true;

        if (this.$refs.advanced) {
          // 第一次点击之后才渲染，所以加此判定
          this.$refs.advanced.initConditions();
        }
      }
      window.ga(
        "send",
        "event",
        "botton",
        "click",
        "企业版_全球药物_高级搜索_高级检索模式"
      );
      window._paq.push([
        "trackEvent",
        "botton",
        "click",
        "企业版_全球药物_高级搜索_高级检索模式",
      ]);
    },

    // 高级搜索点击立即反馈
    handleBack() {
      window.ga(
        "send",
        "event",
        "botton",
        "click",
        "企业版_全球药物_高级搜索_立即反馈"
      );
      window._paq.push([
        "trackEvent",
        "botton",
        "click",
        "企业版_全球药物_高级搜索_立即反馈",
      ]);
      let isLogin = Boolean(this.vueGetCookie("accesstoken"));
      let random = UUID.create().toString();
      let times = new Date().getTime();
      let web_token = isLogin ? this.vueGetCookie("userID") : "";
      let sign_str = `nonce=${random}&timestamp=${times}&web_token=${web_token}`;
      let sha1Result = sha1(
        sign_str + "&2314e6df23cb93264629bbfa10e67c77"
      ).toUpperCase();
      window.open(
        `https://1537030.udesk.cn/im_client/?web_plugin_id=103301&agent_id=208981&group_id=300631&c_name=${
          isLogin ? this.vueGetCookie("userName") : "用户未登录"
        }&c_desc=${
          isLogin ? this.vueGetCookie("userGradeName") : "暂无描述"
        }&${sign_str}&signature=${sha1Result}`,
        "_blank"
      );
    },

    // 关闭高级搜索框（可能并没有起作用，可有可无）
    closeAdvancedDialog() {
      this.dialogFormVisible = false;
    },
    // 高级搜索框中：点击搜索后，清空左侧普通搜索内容（仅肉眼）事件
    clearLeft() {
      this.vueClearLeft();
    },
    // 已选条件部分：点击x后，清空左侧对应的普通搜索内容（仅肉眼）事件
    clearTheLeft(option) {
      this.vueClearTheLeft(option);
    },
  },
  created() {
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
    localStorage.setItem(
      //newProjectGuide 组件需要的东西
      "newProjectGuideArr",
      JSON.stringify([])
    );
    localStorage.setItem("domPosition", "");
  },
  mounted() {
    Store.dispatch("Globaldrugs/getBaseInfo").then(() => {
      this.vueTogglePmsTooltip();
    });
    this.vueRouteFrom("Globaldrugs");
  },
};
</script>

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
.el-dialog {
  border-radius: 20px !important;
}
.globaldrugs {
  .el-breadcrumb__inner a {
    color: #002fa7 !important;
  }
  .la-right {
    .sec1 {
      height: auto !important;
      line-height: 1 !important;
      padding-top: 10px !important;
      padding-bottom: 5px !important;
      .database-name {
        display: inline-block;
        color: #000f32 !important;
        font-size: 20px !important;
        height: 40px;
        line-height: 40px;
      }
      .sec1-right {
        float: right;
        height: 40px;
        .help-tip {
          padding-right: 10px;
          color: @FontColor;
        }

        .top-update-wrap {
          height: 100%;
          .cl-green {
            color: #ffa914;
          }

          .section-ico-qa {
            width: 14px;
            height: 14px;
            display: block;
            margin-right: 5px;
            background-image: url(/static/imgs/globaldrugs/qa-y.png);
            background-size: cover;
          }
        }
      }

      .la-optioned {
        background: #f0f2f9;
        padding-left: 0;
      }
    }
    .sec2 {
      .market_nav {
        .nav_one {
          width: 50%;
          .nav {
            i {
              font-size: 26px;
              margin-right: 4px;
              font-weight: normal;
            }
          }
        }
      }
      .la-body-tab {
        box-shadow: 0 -4px 5px -3px #c4d3f8;
      }
    }
  }

  .cl-green {
    color: #002fa7;
  }

  .la-left-side {
    padding-bottom: 55px;
    background-color: #fafbfd !important;
    .gjss {
      color: #002fa7;
      font-weight: bold;
      position: relative;

      &:hover {
        text-decoration: none;
      }
    }
    .gjss::after {
      content: "";
      width: 84px;
      height: 1px;
      background: #002fa7;
      position: absolute;
      bottom: -4px;
      left: 0;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #fff;
      border-color: #ebeef5;
    }
    .el-checkbox__inner {
      border-color: #ebeef5;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #002fa7;
    }
    .el-checkbox.is-checked + .custom-tree-node {
      color: #002fa7;
    }
    .el-checkbox__inner::after {
      border-color: #ffa914;
    }
    .la-input .title,
    .la-date .title,
    .la-cascader .title {
      font-size: 12px;
    }
    .la-input .title .title-right {
      color: #9aa4b8;

      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #333;
      }
    }
    input.el-input__inner {
      border-color: #ffffff;
      border: 1px solid #ebeef5;
    }
    .la-date .date-range .el-input__icon.el-icon-date {
      color: #ffa914;
    }
    .el-input__inner:focus {
      border-color: #002fa7;
    }
    .advanced-search {
      position: fixed;
      z-index: 10;
      bottom: 5px;
      left: 0;
      width: 288px;
      box-sizing: border-box;
      align-items: center;
    }
    .advanced-search-btn {
      background: #002fa7;
      padding: 7px 0px;
      font-size: 14px;
    }

    @media screen and (max-width: 1280px) {
      .advanced-search {
        width: 260px;
      }
    }

    .la-cascader .title .title-right {
      color: #9aa4b8;
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #333;
      }
    }
  }

  .gj-dialog {
    .el-dialog {
      border-radius: 3px !important;
      background: #fafbfd;
    }

    .el-dialog__header {
      padding: 16px 20px 8px 20px;
      box-shadow: 2px 1px 9px 0px rgba(9, 20, 79, 0.1);

      &::after {
        height: 0;
      }

      .dialog-header {
        padding-left: 0;
        &::before {
          width: 0;
          height: 0;
        }

        .header-title {
          font-size: 16px;
          font-weight: bold;
          color: #333333;
          margin-right: 10px;
        }

        .header-tip {
          font-size: 12px;
          color: #9aa4b8;
          font-weight: normal;
        }

        .header-back {
          color: #002fa7;
          cursor: pointer;
        }
      }

      .el-dialog__headerbtn {
        top: 16px;
        right: 20px;
        border: 1px solid #dbdfe7;
        width: 16px;
        height: 16px;
        line-height: 12px;

        .el-dialog__close {
          color: #ffa500;
          font-size: 12px;
        }
      }
    }
    .el-dialog__body {
      padding-right: 0;
      color: #333333;
    }
  }
}
.search-body-content {
  width: 100%;
  position: relative;
  .sh {
    position: absolute;
    right: 26px;
    top: 16px;
    cursor: pointer;
    z-index: 7;
    display: none;
  }
}
// el-dialog遮罩层样式（背景色）
.v-modal {
  background: rgba(102, 102, 102, 0.4);
}
</style>
